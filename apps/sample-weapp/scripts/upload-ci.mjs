#!/usr/bin/env node

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import ci from 'miniprogram-ci';

const __dirname = import.meta.dirname;
const APP_ROOT = path.resolve(__dirname, '..');
const SECRET_DIR = path.resolve(APP_ROOT, '.secret');
const DEFAULT_KEY_PATH = path.resolve(SECRET_DIR, 'upload.key');
const CACHE_ROOT = path.resolve(APP_ROOT, '.cache/miniprogram-ci');

function readEnv(name, legacyName) {
  const raw =
    process.env[name] ?? (legacyName ? process.env[legacyName] : undefined);
  if (raw === undefined || raw === null) return undefined;
  const trimmed = String(raw).trim();
  return trimmed.length ? trimmed : undefined;
}

async function ensureKeyPath() {
  const keyPathFromEnv = readEnv('WEAPP_UPLOAD_KEY_PATH', 'WEAPP-UPLOAD-KEY-PATH');
  if (keyPathFromEnv && fs.existsSync(keyPathFromEnv)) {
    return { keyPath: keyPathFromEnv, cleanup: false };
  }

  const existingKeyPath = [DEFAULT_KEY_PATH].find((p) =>
    fs.existsSync(p),
  );
  if (existingKeyPath && !readEnv('WEAPP_UPLOAD_KEY', 'WEAPP-UPLOAD-KEY')) {
    return { keyPath: existingKeyPath, cleanup: false };
  }

  const keyContent = readEnv('WEAPP_UPLOAD_KEY', 'WEAPP-UPLOAD-KEY');
  if (!keyContent) {
    throw new Error('Missing WEAPP_UPLOAD_KEY (secret key).');
  }

  await fsp.mkdir(SECRET_DIR, { recursive: true });
  await fsp.writeFile(DEFAULT_KEY_PATH, keyContent.trim() + '\n', {
    encoding: 'utf8',
    mode: 0o600,
  });

  return { keyPath: DEFAULT_KEY_PATH, cleanup: true };
}

function loadAppId() {
  const envAppId = readEnv('WEAPP_APPID', 'WEAPP-APPID');
  if (envAppId) return envAppId;

  const configPath = path.resolve(APP_ROOT, 'project.config.json');
  if (!fs.existsSync(configPath)) return undefined;

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config.appid;
  } catch {
    return undefined;
  }
}

function resolveVersion() {
  const explicit = readEnv('WEAPP_UPLOAD_VERSION');
  if (explicit) return explicit;

  const runNumber = readEnv('GITHUB_RUN_NUMBER');
  if (runNumber) return `0.0.${runNumber}`;

  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(APP_ROOT, 'package.json'), 'utf8'),
    );
    if (pkg?.version) return pkg.version;
  } catch {
    // ignore
  }

  return '0.0.0';
}

function resolveDesc() {
  const explicit = readEnv('WEAPP_UPLOAD_DESC');
  if (explicit) return explicit;

  const ref = readEnv('GITHUB_REF_NAME');
  const sha = readEnv('GITHUB_SHA');
  if (ref && sha) return `ci ${ref}@${sha.slice(0, 7)}`;
  if (sha) return `ci ${sha.slice(0, 7)}`;

  return 'ci upload';
}

async function main() {
  const appId = loadAppId();
  if (!appId) {
    throw new Error('Missing WEAPP_APPID (or appid in project.config.json).');
  }

  const { keyPath, cleanup } = await ensureKeyPath();
  const version = resolveVersion();
  const desc = resolveDesc();
  const prevCwd = process.cwd();

  fs.mkdirSync(CACHE_ROOT, { recursive: true });
  process.chdir(CACHE_ROOT);

  const project = new ci.Project({
    appid: appId,
    type: 'miniProgram',
    projectPath: APP_ROOT,
    privateKeyPath: keyPath,
  });

  const formatProgress = (info) => {
    if (typeof info === 'string') return info;
    if (!info || typeof info !== 'object') return '';
    const parts = [];
    if (info.id) parts.push(info.id);
    if (info.progress !== undefined && info.progress !== null) {
      const progress =
        typeof info.progress === 'number' && info.progress <= 1
          ? Math.round(info.progress * 100)
          : info.progress;
      parts.push(`${progress}%`);
    }
    if (info.message) parts.push(info.message);
    return parts.join(' | ');
  };

  try {
    console.log(`[weapp] Upload start: version=${version} desc="${desc}"`);
    await ci.upload({
      project,
      version,
      desc,
      onProgressUpdate(info) {
        if (!info) return;
        const status = info.status || 'progress';
        const detail = formatProgress(info);
        const line = detail ? `[weapp] ${status} ${detail}` : `[weapp] ${status}`;
        if (status === 'warn') {
          console.warn(line);
        } else {
          console.log(line);
        }
      },
    });
    console.log('[weapp] Upload complete.');
  } finally {
    process.chdir(prevCwd);
    if (cleanup) {
      try {
        await fsp.rm(keyPath, { force: true });
        const files = await fsp.readdir(SECRET_DIR).catch(() => []);
        if (files.length === 0) {
          await fsp.rmdir(SECRET_DIR).catch(() => {});
        }
      } catch {
        // ignore cleanup errors
      }
    }
  }
}

main().catch((err) => {
  console.error('[weapp] Upload failed.');
  console.error(err?.stack || err);
  process.exit(1);
});
