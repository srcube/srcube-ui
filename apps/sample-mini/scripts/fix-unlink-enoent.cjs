'use strict';

const path = require('node:path');

const ENOENT_SAFE_METHODS = [
  'unlink',
  'chmod',
  'chown',
  'lchown',
  'utimes',
  'lutimes',
];

const PICKER_DATE_RANGE_JSON_SUFFIX = path.join(
  'miniprogram_npm',
  '@srcube-ui',
  'picker',
  'date-range-picker',
  'index.json',
);

const PICKER_DATE_RANGE_JSON_REPLACEMENTS = [
  ['"sr-field": "../field/index"', '"sr-field": "../../field/index"'],
  ['"sr-drawer": "../drawer/index"', '"sr-drawer": "../../drawer/index"'],
  ['"sr-tabs": "../tabs/index"', '"sr-tabs": "../../tabs/index"'],
  ['"sr-pickbox": "../pickbox/index"', '"sr-pickbox": "../../pickbox/index"'],
  ['"sr-button": "../button/index"', '"sr-button": "../../button/index"'],
];

function shouldPatchPickerDateRangeJson(filePath) {
  if (typeof filePath !== 'string' || !filePath) {
    return false;
  }

  const normalizedPath = path.normalize(filePath);
  return normalizedPath.endsWith(PICKER_DATE_RANGE_JSON_SUFFIX);
}

function patchPickerDateRangeJsonContent(filePath, content) {
  if (!shouldPatchPickerDateRangeJson(filePath)) {
    return content;
  }

  const sourceText = Buffer.isBuffer(content)
    ? content.toString('utf8')
    : String(content);

  let patchedText = sourceText;
  for (const [from, to] of PICKER_DATE_RANGE_JSON_REPLACEMENTS) {
    patchedText = patchedText.replace(from, to);
  }

  if (patchedText === sourceText) {
    return content;
  }

  return Buffer.isBuffer(content)
    ? Buffer.from(patchedText, 'utf8')
    : patchedText;
}

function patchPickerDateRangeJsonOutputFile(fsModule) {
  const outputPath = path.join(
    process.cwd(),
    'dist',
    'miniprogram_npm',
    '@srcube-ui',
    'picker',
    'date-range-picker',
    'index.json',
  );

  try {
    if (!fsModule.existsSync(outputPath)) {
      return;
    }

    const sourceText = fsModule.readFileSync(outputPath, 'utf8');
    const patchedText = patchPickerDateRangeJsonContent(outputPath, sourceText);

    if (patchedText !== sourceText) {
      fsModule.writeFileSync(outputPath, patchedText, 'utf8');
    }
  } catch {
  }
}

function wrapCallbackMethod(fsModule, methodName) {
  if (!fsModule || typeof fsModule[methodName] !== 'function') {
    return;
  }

  const originalMethod = fsModule[methodName].bind(fsModule);
  fsModule[methodName] = (...args) => {
    const callback = args[args.length - 1];
    if (typeof callback !== 'function') {
      return originalMethod(...args);
    }

    const wrappedCallback = (error, ...rest) => {
      if (error && error.code === 'ENOENT') {
        callback(null, ...rest);
        return;
      }
      callback(error ?? null, ...rest);
    };

    args[args.length - 1] = wrappedCallback;
    return originalMethod(...args);
  };
}

function wrapPromiseMethod(fsModule, methodName) {
  if (!fsModule?.promises || typeof fsModule.promises[methodName] !== 'function') {
    return;
  }

  const originalMethod = fsModule.promises[methodName].bind(fsModule.promises);
  fsModule.promises[methodName] = async (...args) => {
    try {
      return await originalMethod(...args);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  };
}

function wrapWriteMethod(fsModule, methodName) {
  if (!fsModule || typeof fsModule[methodName] !== 'function') {
    return;
  }

  const originalMethod = fsModule[methodName].bind(fsModule);
  fsModule[methodName] = (...args) => {
    if (args.length >= 2) {
      args[1] = patchPickerDateRangeJsonContent(args[0], args[1]);
    }

    return originalMethod(...args);
  };
}

function wrapPromiseWriteMethod(fsModule) {
  if (!fsModule?.promises || typeof fsModule.promises.writeFile !== 'function') {
    return;
  }

  const originalMethod = fsModule.promises.writeFile.bind(fsModule.promises);
  fsModule.promises.writeFile = (...args) => {
    if (args.length >= 2) {
      args[1] = patchPickerDateRangeJsonContent(args[0], args[1]);
    }

    return originalMethod(...args);
  };
}

function patchFsForEnoent(fsModule) {
  for (const methodName of ENOENT_SAFE_METHODS) {
    wrapCallbackMethod(fsModule, methodName);
    wrapPromiseMethod(fsModule, methodName);
  }

  wrapWriteMethod(fsModule, 'writeFile');
  wrapWriteMethod(fsModule, 'writeFileSync');
  wrapPromiseWriteMethod(fsModule);
}

const fs = require('node:fs');
patchFsForEnoent(fs);

let hasPatchedPickerDateRangeOutput = false;
const patchPickerDateRangeOutputOnce = () => {
  if (hasPatchedPickerDateRangeOutput) {
    return;
  }

  hasPatchedPickerDateRangeOutput = true;
  patchPickerDateRangeJsonOutputFile(fs);
};

process.on('beforeExit', patchPickerDateRangeOutputOnce);
process.on('exit', patchPickerDateRangeOutputOnce);

try {
  const gracefulFs = require('graceful-fs');
  patchFsForEnoent(gracefulFs);
} catch {
}
