#!/usr/bin/env node

/**
 * Watch @srcube-ui packages' dist and sync changes to dist/miniprogram_npm.
 *
 * Usage:
 *   node scripts/sync-miniprogram-npm.mjs          # watch mode
 *   node scripts/sync-miniprogram-npm.mjs --once    # one-shot sync
 */

import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;
const APP_ROOT = path.resolve(__dirname, '..');
const MONO_ROOT = path.resolve(APP_ROOT, '../..');
const NPM_DIST = path.resolve(APP_ROOT, 'dist/miniprogram_npm/@srcube-ui');

const isOnce = process.argv.includes('--once');

// Read @srcube-ui deps from package.json
const appPkg = JSON.parse(
  fs.readFileSync(path.resolve(APP_ROOT, 'package.json'), 'utf-8'),
);
const srcubeDeps = Object.keys(appPkg.dependencies || {}).filter((d) =>
  d.startsWith('@srcube-ui/'),
);

// Resolve source dir for each dep
function resolveTargets() {
  const targets = [];

  for (const dep of srcubeDeps) {
    const name = dep.replace('@srcube-ui/', '');

    try {
      const linked = fs.realpathSync(
        path.resolve(MONO_ROOT, 'node_modules', dep),
      );
      const depPkg = JSON.parse(
        fs.readFileSync(path.resolve(linked, 'package.json'), 'utf-8'),
      );
      const miniDir = depPkg.miniprogram || 'dist';
      const srcDir = path.resolve(linked, miniDir);
      const destDir = path.resolve(NPM_DIST, name);

      targets.push({ name, srcDir, destDir });
    } catch {
      // package not installed yet, skip
    }
  }

  return targets;
}

// Recursively copy a directory
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Sync a single file
function syncFile(srcDir, destDir, filename) {
  const src = path.resolve(srcDir, filename);
  const dest = path.resolve(destDir, filename);

  try {
    if (!fs.existsSync(src)) {
      // File deleted — remove from dest
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      return;
    }

    const stat = fs.statSync(src);
    if (stat.isFile()) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  } catch {
    // ignore transient errors during rebuild
  }
}

const targets = resolveTargets();

function syncTargetDirectory(name, srcDir, destDir, tag = '[sync]') {
  if (!fs.existsSync(srcDir)) return false;
  copyDirSync(srcDir, destDir);
  console.log(`${tag} @srcube-ui/${name}`);
  return true;
}

function syncAllTargets(tag = '[sync]') {
  let count = 0;
  for (const { name, srcDir, destDir } of targets) {
    if (syncTargetDirectory(name, srcDir, destDir, tag)) {
      count += 1;
    }
  }
  return count;
}

function restoreMissingTargets(tag = '[sync:restore]') {
  if (!fs.existsSync(NPM_DIST)) return 0;

  let restored = 0;
  for (const { name, srcDir, destDir } of targets) {
    if (!fs.existsSync(srcDir)) continue;
    if (fs.existsSync(destDir)) continue;
    copyDirSync(srcDir, destDir);
    console.log(`${tag} @srcube-ui/${name}`);
    restored += 1;
  }
  return restored;
}

try {
  fs.mkdirSync(NPM_DIST, { recursive: true });
} catch {
  console.log('[sync] Failed to create dist/miniprogram_npm/@srcube-ui.');
  if (isOnce) process.exit(1);
}

// --once: do a full sync and exit
if (isOnce) {
  syncAllTargets('[sync]');
  console.log('[sync] Done.');
  process.exit(0);
}

// Watch mode
console.log('[sync] Watching @srcube-ui packages for changes...\n');

const initCount = syncAllTargets('[sync:init]');
if (initCount === 0) {
  console.log('[sync:init] No built @srcube-ui dist found yet.');
}

for (const { name, srcDir, destDir } of targets) {
  if (!fs.existsSync(srcDir)) {
    console.log(`[skip] @srcube-ui/${name} — dist not built yet`);
    continue;
  }

  // Debounce: collect changed files, then batch sync
  let pending = new Set();
  let timer;

  fs.watch(srcDir, { recursive: true }, (_event, filename) => {
    if (!filename) return;

    pending.add(filename);
    clearTimeout(timer);
    timer = setTimeout(() => {
      // dist may be cleaned/recreated by weapp-vite, restore package dir first.
      if (!fs.existsSync(destDir)) {
        copyDirSync(srcDir, destDir);
      }

      const files = [...pending];
      pending = new Set();

      for (const f of files) {
        syncFile(srcDir, destDir, f);
      }
      console.log(`[sync] @srcube-ui/${name} (${files.length} file${files.length > 1 ? 's' : ''})`);
    }, 300);
  });

  console.log(`[watch] @srcube-ui/${name}`);
}

console.log('');

setInterval(() => {
  restoreMissingTargets('[sync:restore]');
}, 1000);

// Keep alive, clean exit on Ctrl+C
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
