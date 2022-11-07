const fs = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(projectDir, 'assets');
const indexDest = path.join(projectDir, 'index.html');

fs.mkdir(projectDir, {recursive: true}).then(() => {
    assembleStyles();
    copyDir(assetsSrc, assetsDest);
    assembleHTML();
  })

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
  const copy = item => {
    const file = path.join(src, item.name);
    const copy = path.join(dest, item.name);
    if (item.isFile()) {
      fs.copyFile(file, copy);
    } else copyDir(file, copy);
  };

fs.rm(dest, {recursive: true, force: true})
  .then(() => fs.mkdir(dest, {recursive: true}))
  .then(() => fs.readdir(src, {withFileTypes: true}))
  .then(files => files.forEach(copy));
}

function assembleHTML() {
  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    .then(replaceTemplates)
    .then(writeHTML); 
}

function getComponentContents(template) {
  const name = template.trim().slice(2, -2);
  const indent = template.indexOf('{');
  const dir = path.join(__dirname, 'components', `${name}.html`);
  const content = fs.readFile(dir, 'utf-8');
  
  return content.then(res => {
    return res
      .split('\n')
      .map(line => line.padStart(line.length + indent, ' '))
      .join('\n');
  });
}

function replaceTemplates(file) {
  const isTemplate = line => line.trim().startsWith('{{');
  const lines = file.split('\n');

  return lines.map(line => {
    if (isTemplate(line)) return getComponentContents(line);
    return Promise.resolve(line);
  });
}

function writeHTML(content) {
  Promise.all(content).then(res => {
    const data = res.join('\n');
    fs.writeFile(indexDest, data);
  });
}