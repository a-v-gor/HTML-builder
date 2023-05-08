const fs = require('node:fs');
const path = require('node:path');
const srcDirPath = path.join(__dirname, 'styles');
const dstPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(dstPath, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }
  fs.writeFile(
    dstPath,
    '',
    (err) => {
      if (err) {
        throw err;
      }
    }
  );

  fs.readdir(srcDirPath, { withFileTypes: true }, function (err, files) {
    if (err) {
      throw err;
    }
    files.forEach(file => {
      if(file.isFile()) {
        const filePath = path.join(srcDirPath, file.name);
        const ext = path.parse(filePath).ext.replace(/\./,'');
        if (ext === 'css') {
          const input = fs.createReadStream(filePath);
          const output = fs.createWriteStream(dstPath, {flags:'a'});
          input.pipe(output);
          output.on('end', () => fs.appendFile(dstPath, '\n', (err) => { if (err) { throw err;  }}));
        }
      }
    });
  });
});