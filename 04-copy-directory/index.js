const path = require('path');
const fs = require('fs/promises');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');
const copyFile = item => {
  const file = path.join(src, item);
  const copy = path.join(dest, item);
  fs.copyFile(file, copy);
};

fs.rm(dest, {recursive: true, force: true})
  .then(() => fs.mkdir(dest, {recursive: true}))
  .then(() => fs.readdir(src))
  .then(files => files.forEach(copyFile));

