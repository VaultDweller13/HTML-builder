const fs = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(projectDir, 'assets');
const indexDest = path.join(projectDir, 'index.html');

fs.mkdir(projectDir, {recursive: true})
  .then(assembleStyles())
  .then(copyDir(assetsSrc, assetsDest))
  .then(assembleHTML());
  


function assembleStyles() {
  const src = path.join(__dirname, 'styles');
  const dest = path.join(projectDir, 'style.css');
  const isStylesheet = file => file.isFile() && path.extname(file.name) === '.css';

  async function readFilesContents() {
    return (await fs.readdir(src, {withFileTypes: true}))
      .filter(isStylesheet)
      .map((file) => fs.readFile(path.join(src, file.name), 'utf-8'));
  }

  async function writeArray(arr) {
    const data = (await Promise.all(await arr)).join('');

    fs.writeFile(dest, data, 'utf-8');
  }

  writeArray(readFilesContents());
}

function copyDir(src, dest) {
  const copyFile = item => {
    const file = path.join(src, item.name);
    const copy = path.join(dest, item.name);
    if (item.isFile()) {
      fs.copyFile(file, copy);
    } else copyDir(file, copy);
  };

fs.rm(dest, {recursive: true, force: true})
  .then(() => fs.mkdir(dest, {recursive: true}))
  .then(() => fs.readdir(src, {withFileTypes: true}))
  .then(files => files.forEach(copyFile));
}

function assembleHTML() {
  const isTemplate = line => line.trim().startsWith('{{');
  const getComponentContents = template => {
    const dir = path.join(__dirname, 'components', `${template}.html`);
    return fs.readFile(dir, 'utf-8');
  }
  const getComponentName = line => line.trim().slice(2, -2);

  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    .then(res => {
      const lines = res.split('\n');

      return lines.map(line => {
        if (isTemplate(line)) return getComponentContents(getComponentName(line));
        return Promise.resolve(line);
      });
    })
    .then(promisesArray => {
      Promise.all(promisesArray).then(res => fs.writeFile(indexDest, res));
    }); 
}