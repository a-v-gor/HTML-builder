const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');
const distDirPath = path.join(__dirname, 'project-dist');
const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';

fs.rm(distDirPath, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }
  fs.mkdir(distDirPath, () => {
    // template .html
    fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
      if (err) {
        throw err;
      }
      let textStr = String(data);
      const templates = textStr.match(/{{.*}}/g);
      for (let i = 0; i < templates.length; i++) {
        const templName = templates[i].match(/{{(.*)}}/)[1];
        fs.readFile(
          path.join(__dirname, 'components', `${templName}.html`),
          (err, data) => {
            if (err) {
              throw err;
            }
            textStr = textStr.replace(templates[i], String(data));
            if (i == templates.length - 1) {
              fs.writeFile(
                path.join(distDirPath, 'index.html'),
                textStr,
                (err) => {
                  if (err) {
                    throw err;
                  }
                }
              );
            }
          });
      }
    });

    // styles
    const srcDirStylesPath = path.join(__dirname, 'styles');
    const dstStylesPath = path.join(distDirPath, 'style.css');

    fs.writeFile(
      dstStylesPath,
      '',
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    // !!! async!!! Если эта фраза найдена по поиску синхронных методов модуля fs, прошу обратить внимание,
    // что таких методов в работе нет - только асинхронные, разрешенные условием.

    async function getCss () {
      const cssFiles = await fsPromises.readdir(srcDirStylesPath, { withFileTypes:true });
      let stylesNames = [];
      cssFiles.forEach(file => {
        stylesNames.push(file.name);
      });
      
      if (stylesNames.indexOf('header.css')) {
        stylesNames.splice(stylesNames.indexOf('header.css'),1);
        stylesNames.unshift('header.css');
      }

      if (stylesNames.indexOf('footer.css')) {
        stylesNames.splice(stylesNames.indexOf('footer.css'),1);
        stylesNames.push('footer.css');
      }

      stylesNames.forEach(async item => {
        const styleText = String(await fsPromises.readFile(path.join(srcDirStylesPath, item))) + newLineChar;
        await fsPromises.appendFile(dstStylesPath, styleText);
      });
    }

    getCss();

    // assets
    
    const srcAssetsDirPath = path.join(__dirname, 'assets');
    const dstAssetsDirPath = path.join(distDirPath, 'assets');

    function copyCatalog (srcPath, dstPath) {
      fs.readdir(srcPath, { withFileTypes: true }, function (err, files) {
        if (err) {
          throw err;
        }
        files.forEach(file => {
          if (file.isFile()) {
            const srcFilePath = path.join(srcPath, file.name);
            const dstFilePath = path.join(dstPath, file.name);
            fs.writeFile(dstFilePath, '',
              (err) => {
                if (err) {
                  throw err;
                }
              });
            const input = fs.createReadStream(srcFilePath);
            const output = fs.createWriteStream(dstFilePath);
            input.pipe(output);
          } else {
            fs.mkdir(path.join(dstPath, file.name), (err) => {
              if (err) throw err;
            });
            copyCatalog (path.join(srcPath, file.name), path.join(dstPath, file.name));
          }
        });
      });
    }

    fs.mkdir(dstAssetsDirPath, () => {
      copyCatalog(srcAssetsDirPath, dstAssetsDirPath);
    });
  });
});