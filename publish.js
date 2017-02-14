'use strict';

const semver = require('semver');
const fs = require('fs');
const child_process = require('child_process');

const packageJsonPath = `${__dirname}/package.json`;

const version = process.argv[2];
if (!semver.valid(version)) {
  throw new Error(`Version '${version}' is not a valid semver string!`);
}

/* eslint-disable no-console */
console.log(`Prepping version ${version}`);

const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
packageInfo.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageInfo, null, 2), 'utf-8');

// console.log('Building project...');
// const buildResult = child_process.spawnSync('npm', ['run', 'build']);
// if (buildResult.status !== 0) {
//   throw new Error('Build failed');
// }

