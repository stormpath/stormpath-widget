'use strict';

const filename = 'stormpath.min.js';
const fs = require('fs');
const semver = require('semver');

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));

const outputFile = `${__dirname}/dist/${filename}`;
const widgetSource = fs.readFileSync(outputFile, 'utf-8');
const packDirectory = `${__dirname}/pack`;

// Sanity check
if (!fs.existsSync(outputFile)) {
  throw new Error(`The file dist/${filename} does not exist`);
}
if (fs.existsSync(packDirectory)) {
  throw new Error('The pack/ directory already exists');
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

if (tag !== packageInfo.version) {
  throw new Error(`Tag version ${tag} does not match package version ${packageInfo.version}, exiting`);
}

console.log(`Preparing package stormpath-widget/${packageInfo.version} for distribution...`);
fs.mkdirSync(packDirectory);

// Always copy the latest tagged version to /widget/latest/
const latestDirectory = `${packDirectory}/latest`;
console.log(`Copying output to ${latestDirectory}/${filename}`);
fs.mkdirSync(latestDirectory);
fs.writeFileSync(`${latestDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

// Push tagged minor releases to /widget/x.y/
const shortVersion = `${semver.major(tag)}.${semver.minor(tag)}`;
const shortVersionDirectory = `${packDirectory}/${shortVersion}`;
console.log(`Copying output to ${shortVersionDirectory}/${filename}`);
fs.mkdirSync(shortVersionDirectory);
fs.writeFileSync(`${shortVersionDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

// Push tagged releases to /widget/x.y.z/
const versionDirectory = `${packDirectory}/${tag}`;
console.log(`Copying output to ${versionDirectory}/${filename}`);
fs.mkdirSync(versionDirectory);
fs.writeFileSync(`${versionDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

// Profit!
console.log('Done!');
