'use strict';

const fs = require('fs');
const semver = require('semver');

const sourceFilename = 'stormpath.min.js';
const sourceMapFilename = `${sourceFilename}.map`;

const stagingDirectory = `${__dirname}/staging`;
const outputSourceFile = `${__dirname}/dist/${sourceFilename}`;
const outputSourceMapFile = `${__dirname}/dist/${sourceMapFilename}`;

// Sanity check
if (!fs.existsSync(outputSourceFile) || !fs.existsSync(outputSourceMapFile)) {
  throw new Error('The source files do not exist');
}
if (fs.existsSync(stagingDirectory)) {
  throw new Error('The staging directory already exists');
}

// If this is not a tagged release, end early
const tag = process.env.DEPLOY_TAG || process.env.TRAVIS_TAG || '';

if (!tag) {
  console.log('Not a tagged release, no further action needed');
  return 0;
}

if (!semver.valid(tag)) {
  throw new Error(`Tag version ${tag} is not a valid semver string, exiting`);
}

const source = fs.readFileSync(outputSourceFile, 'utf-8');
const sourceMap = fs.readFileSync(outputSourceMapFile, 'utf-8');

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));

if (tag !== packageInfo.version) {
  throw new Error(`Tag version ${tag} does not match package version ${packageInfo.version}, exiting`);
}

console.log(`Preparing package stormpath-widget/${packageInfo.version} for distribution...`);
fs.mkdirSync(stagingDirectory);

// Always copy the latest tagged version to /widget/latest/
const latestDirectory = `${stagingDirectory}/latest`;
fs.mkdirSync(latestDirectory);
console.log(`Copying source to ${latestDirectory}/${sourceFilename}`);
fs.writeFileSync(`${latestDirectory}/${sourceFilename}`, source, { encoding: 'utf-8' });
console.log(`Copying sourcemap to ${latestDirectory}/${sourceMapFilename}`);
fs.writeFileSync(`${latestDirectory}/${sourceMapFilename}`, sourceMap, { encoding: 'utf-8' });

// Push tagged minor releases to /widget/major.x/
const shortVersion = `${semver.major(tag)}.x`;
const shortVersionDirectory = `${stagingDirectory}/${shortVersion}`;
fs.mkdirSync(shortVersionDirectory);
console.log(`Copying source to ${shortVersionDirectory}/${sourceFilename}`);
fs.writeFileSync(`${shortVersionDirectory}/${sourceFilename}`, source, { encoding: 'utf-8' });
console.log(`Copying sourcemap to ${shortVersionDirectory}/${sourceMapFilename}`);
fs.writeFileSync(`${shortVersionDirectory}/${sourceMapFilename}`, sourceMap, { encoding: 'utf-8' });

// Push tagged releases to /widget/major.minor.patch/
const versionDirectory = `${stagingDirectory}/${tag}`;
fs.mkdirSync(versionDirectory);
console.log(`Copying source to ${versionDirectory}/${sourceFilename}`);
fs.writeFileSync(`${versionDirectory}/${sourceFilename}`, source, { encoding: 'utf-8' });
console.log(`Copying sourcemap to ${versionDirectory}/${sourceMapFilename}`);
fs.writeFileSync(`${versionDirectory}/${sourceMapFilename}`, sourceMap, { encoding: 'utf-8' });

// Profit!
console.log('Done!');
