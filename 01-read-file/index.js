const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToFile);
readStream.pipe(process.stdout);
