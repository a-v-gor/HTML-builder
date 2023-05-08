const fs = require('node:fs');
const path = require('node:path');
const directoryPath = path.join(__dirname, 'secret-folder');

function logFileInfo(file) {
  if(!file.isFile()) {
    return
  }
  const fPath = path.join(directoryPath, file.name);
  const fName = path.parse(fPath).name;
  const fExt = path.parse(fPath).ext.replace(/\./,'');
  fs.stat(fPath, (err, stats) => {
    if (err) {
      throw err;
    }
    const fSize = (stats.size < 1024) ? stats.size + 'b' : stats.size/1024 + 'kb';
    console.log(`${fName} - ${fExt} - ${fSize}`);
  });
}

fs.readdir(directoryPath, { withFileTypes: true }, function (err, files) {
  if (err) {
    throw err;
  }
  files.forEach(logFileInfo);
});