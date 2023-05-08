const fs = require('node:fs');
const path = require('node:path');

const srcDirPath = path.join(__dirname, 'files');
const dstDirPath = path.join(__dirname, 'files-copy');

function copyFile(file) {
  if(!file.isFile()) {
    return
  }
  const srcFilePath = path.join(srcDirPath, file.name);
  const dstFilePath = path.join(dstDirPath, file.name);
  fs.writeFile(dstFilePath, '',
    (err) => {
      if (err) {
        throw err;
      }
    });
  const input = fs.createReadStream(srcFilePath);
  const output = fs.createWriteStream(dstFilePath);
  input.pipe(output);
}

fs.rm(dstDirPath, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }
  fs.mkdir(dstDirPath, () => {
    fs.readdir(srcDirPath, { withFileTypes: true }, function (err, files) {
      if (err) {
        throw err;
      }
      files.forEach(copyFile);
    });
  });
});