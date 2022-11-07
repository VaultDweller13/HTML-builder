const fs = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const resultFile = path.join(projectDir, 'bundle.css');
const isStylesheet = file => file.isFile() && path.extname(file.name) === '.css';

async function readFilesContents() {
  return (await fs.readdir(stylesDir, {withFileTypes: true}))
    .filter(isStylesheet)
    .map((file) => fs.readFile(path.join(stylesDir, file.name), 'utf-8'));
}

async function writeArray(arr) {
  const data = (await Promise.all(await arr)).join('');

  fs.writeFile(resultFile, data, 'utf-8');
}

writeArray(readFilesContents());
