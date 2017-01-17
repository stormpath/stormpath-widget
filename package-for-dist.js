const fs = require('fs');
const outputFile = `${__dirname}/dist/stormpath.min.js`;
const packDirectory = `${__dirname}/pack`;
const packWidgetDirectory = `${packDirectory}/widget`;

console.log('Preparing package for distribution...');

// Sanity check
if (!fs.existsSync(outputFile)) {
  throw new Error('The file dist/stormpath.min.js does not exist');
}
if (fs.existsSync(packDirectory)) {
  throw new Error('The pack/ directory already exists');
}

const widgetSource = fs.readFileSync(outputFile, 'utf-8');

fs.mkdirSync(packDirectory);
fs.mkdirSync(packWidgetDirectory);

// Always copy the latest version to /widget/latest/
console.log('Copying output to /pack/widget/latest/stormpath.js');
const latestDirectory = `${packWidgetDirectory}/latest`;
fs.mkdirSync(latestDirectory);
fs.writeFileSync(`${latestDirectory}/stormpath.min.js`, widgetSource, { encoding: 'utf-8' });

