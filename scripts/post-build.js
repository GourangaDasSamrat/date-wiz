#!/usr/bin/env node
// scripts/post-build.js
// Injects a package.json into the CJS output dir so Node's module resolution
// correctly treats those files as CommonJS (avoids "require() of ES module" errors).

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const cjsDir = join(root, 'dist', 'cjs');
if (!existsSync(cjsDir)) mkdirSync(cjsDir, { recursive: true });

writeFileSync(
  join(cjsDir, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
);

const esmDir = join(root, 'dist', 'esm');
if (!existsSync(esmDir)) mkdirSync(esmDir, { recursive: true });

writeFileSync(
  join(esmDir, 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2) + '\n',
);

console.log('✅  post-build: CJS/ESM package.json markers written.');
