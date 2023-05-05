const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = require('node:process');

const pathToFile = path.join(__dirname, 'text.txt');

function addDataToFile(data = '') {
  if (data.toString() === 'exit\r\n') {
    process.exit();
  } else {
    fs.appendFile(
      pathToFile,
      String(data),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }
}

addDataToFile();
stdout.write('Enter the text\n');
stdin.on('data', addDataToFile);
