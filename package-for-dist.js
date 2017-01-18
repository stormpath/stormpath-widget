'use strict';

const filename = 'stormpath.min.js';
const fs = require('fs');
const semver = require('semver');
const spawnSync = require('child_process').spawnSync;

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));

const outputFile = `${__dirname}/dist/${filename}`;
const packDirectory = `${__dirname}/pack`;
const packWidgetDirectory = `${packDirectory}/widget`;

// Sanity check
if (!fs.existsSync(outputFile)) {
  throw new Error(`The file dist/${filename} does not exist`);
}
if (fs.existsSync(packDirectory)) {
  throw new Error('The pack/ directory already exists');
}

console.log(`Preparing package stormpath-widget/${packageInfo.version} for distribution...`);

const widgetSource = fs.readFileSync(outputFile, 'utf-8');

fs.mkdirSync(packDirectory);
fs.mkdirSync(packWidgetDirectory);

// Always copy the latest version to /widget/latest/
console.log(`Copying output to /pack/widget/latest/${filename}`);
const latestDirectory = `${packWidgetDirectory}/latest`;
fs.mkdirSync(latestDirectory);
fs.writeFileSync(`${latestDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

// If this is not a tagged release, end early
const findTag = spawnSync('git', ['describe', '--exact-match', '--tags', 'HEAD']);
const tag = process.env.DEPLOY_TAG || findTag.stdout.toString();

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

// Push tagged minor releases to /widget/x.y/
const shortVersion = `${semver.major(tag)}.${semver.minor(tag)}`;
console.log(`Copying output to /widget/${shortVersion}/`);
const shortVersionDirectory = `${packWidgetDirectory}/${shortVersion}`;
fs.mkdirSync(shortVersionDirectory);
fs.writeFileSync(`${shortVersionDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

// Push tagged releases to /widget/x.y.z/
console.log(`Copying output to /widget/${tag}/`);
const versionDirectory = `${packWidgetDirectory}/${tag}`;
fs.mkdirSync(versionDirectory);
fs.writeFileSync(`${versionDirectory}/${filename}`, widgetSource, { encoding: 'utf-8' });

console.log('Done!');
