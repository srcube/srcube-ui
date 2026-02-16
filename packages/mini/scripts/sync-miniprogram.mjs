import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '../../..');
const uiRoot = join(workspaceRoot, 'packages/ui');
const miniPackagePath = join(workspaceRoot, 'packages/mini/package.json');
const miniDistRoot = join(workspaceRoot, 'packages/mini/dist');

function getComponentNamesFromDependencies() {
  const miniPkg = JSON.parse(readFileSync(miniPackagePath, 'utf8'));
  const dependencies = miniPkg.dependencies ?? {};

  return Object.keys(dependencies)
    .filter((name) => name.startsWith('@srcube-ui/'))
    .map((name) => name.replace('@srcube-ui/', ''))
    .filter((name) => name !== 'mini' && name !== 'react' && name !== 'runtime')
    .sort();
}

function clearComponentDirs() {
  if (!existsSync(miniDistRoot)) return;

  const entries = readdirSync(miniDistRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    rmSync(join(miniDistRoot, entry.name), { recursive: true, force: true });
  }
}

function syncMiniOutputs() {
  clearComponentDirs();

  const componentNames = getComponentNamesFromDependencies();
  const missing = [];

  for (const name of componentNames) {
    const sourceDir = join(uiRoot, name, 'dist/mini');
    if (!existsSync(sourceDir)) {
      missing.push(name);
      continue;
    }

    const targetDir = join(miniDistRoot, name);
    rmSync(targetDir, { recursive: true, force: true });
    mkdirSync(targetDir, { recursive: true });
    cpSync(sourceDir, targetDir, { recursive: true });
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing built mini outputs for: ${missing.join(', ')}. ` +
        'Please build those component packages first.',
    );
  }
}

syncMiniOutputs();
