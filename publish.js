'use strict';

const semver = require('semver');
const fs = require('fs');
const child_process = require('child_process');
const git = require('git-rev-sync');

const version = process.argv[2];
const packageJsonPath = `${__dirname}/package.json`;

let throwIfVersionInvalid = (versionArg) => {
  if (!semver.valid(versionArg)) {
    throw new Error(`Version '${versionArg}' is not a valid semver string!`);
  }
};

let throwIfNotOnMaster = () => {
  const branch = git.branch();
  if (branch !== 'master') {
    throw new Error(`Must be on branch master (current branch is ${branch})`);
  }
};

let updatePackageJsonVersion = (path, newVersion) => {
  const packageInfo = JSON.parse(fs.readFileSync(path, 'utf-8'));
  packageInfo.version = newVersion;
  fs.writeFileSync(path, JSON.stringify(packageInfo, null, 2), 'utf-8');
};

let buildProject = () => {
  const buildResult = child_process.spawnSync('npm', ['run', 'build']);
  if (buildResult.status !== 0) {
    throw new Error('Build failed');
  }
};

throwIfVersionInvalid(version);
throwIfNotOnMaster();

/* eslint-disable no-console */
console.log(`Prepping version ${version}`);
updatePackageJsonVersion(packageJsonPath, version);

console.log('Building project...');
buildProject();
