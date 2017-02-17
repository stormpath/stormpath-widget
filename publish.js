'use strict';

const semver = require('semver');
const fs = require('fs');
const child_process = require('child_process');
const git = require('git-rev-sync');
const chalk = require('chalk');

const version = process.argv[2];
const packageJsonPath = `${__dirname}/package.json`;
const minifiedDistPath = `${__dirname}/dist/stormpath.min.js`;
const integrityFilePath = `${__dirname}/integrity.txt`;
const shaAlgorithm = 'sha384';

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

let throwIfVersionLessThanCurrentTag = (newVersion) => {
  const latestTag = git.tag();
  if (!semver.gt(newVersion, latestTag)) {
    throw new Error(`Proposed version ${newVersion} is not greater than current tag ${latestTag}`);
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

let computeHashFor = (path) => {
  return child_process
    .execSync(`cat ${path} | openssl dgst -sha384 -binary | openssl enc -base64 -A`)
    .toString();
};

let appendToIntegrityFile = (version, hash) => {
  fs.appendFileSync(integrityFilePath, `${version} ${shaAlgorithm}-${hash}`);
};

/* eslint-disable no-console */
throwIfVersionInvalid(version);
//throwIfNotOnMaster();
console.log('TODO RESTORE');
throwIfVersionLessThanCurrentTag(version);
updatePackageJsonVersion(packageJsonPath, version);

console.log('Building project...');
buildProject();

const minifiedHash = computeHashFor(minifiedDistPath);
console.log(`Built stormpath.min.js v${version} with SHA ${minifiedHash}`);
// TODO - update README.MD automatically
appendToIntegrityFile(version, minifiedHash);

// commit and tag

console.log(chalk.green('Done! Don\'t forget to run:\ngit push origin --tags'));
