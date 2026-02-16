'use strict';

const ENOENT_SAFE_METHODS = [
  'unlink',
  'chmod',
  'chown',
  'lchown',
  'utimes',
  'lutimes',
];

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

function patchFsForEnoent(fsModule) {
  for (const methodName of ENOENT_SAFE_METHODS) {
    wrapCallbackMethod(fsModule, methodName);
    wrapPromiseMethod(fsModule, methodName);
  }
}

const fs = require('node:fs');
patchFsForEnoent(fs);

try {
  const gracefulFs = require('graceful-fs');
  patchFsForEnoent(gracefulFs);
} catch {
}
