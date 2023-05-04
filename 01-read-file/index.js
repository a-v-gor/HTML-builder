const fs = require('node:fs');
const path = require('node:path'); 

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToFile);

let data = '';

readStream.on('error', error => console.log('Error:', error.message));
readStream.on('data', chunk => data += chunk);
readStream.on('end', () => console.log(data));