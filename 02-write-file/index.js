const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const pathToFile = path.join(__dirname, 'text.txt');

function createFile() {
  fs.writeFile(
    pathToFile,
    '',
    (err) => {
      if (err) {
        throw err;
      }
    }
  )
}

function addDataToFile(data) {
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

function sayHiBye(event) {
  const str = (event === 0) ? 'Good bye.' : 'Enter the text.\n';
  process.stdout.write(str);
}

sayHiBye();
createFile();

process.stdin.on('data', addDataToFile);
process.on('exit', sayHiBye);
process.on('SIGINT', () => process.exit());
