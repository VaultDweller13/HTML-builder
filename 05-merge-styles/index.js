const fs = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const resultFile = path.join(projectDir, 'bundle.css');
const isStylesheet = file => file.isFile() && path.extname(file.name) === '.css';

// async function readFiles() {
//   const resultArray = [];
//   const files =  await fs.readdir(stylesDir, {withFileTypes: true});

//   files.filter(isStylesheet).forEach(async file => {
//     const src = path.join(stylesDir, file.name);
//     const content = await fs.readFile(src, 'utf-8');
//     resultArray.push(content);
//   });

//   return resultArray;
// }

// fs.readdir(stylesDir, {withFileTypes: true})
//   .then(res => {
//     // const resultArray = [];

//     res.filter(isStylesheet).forEach(getFileContent);
//     // .then(content => resultArray.push(content));
//     return resultArray;
//   })
//   .then((res) => {
//     fs.mkdir(projectDir, {recursive: true});
//     return res;
//   })
//   .then((res) => {
//     // console.log(data);
//     console.log(res);

//     // const data = new Uint8Array(Buffer.from(resultArray));
//     fs.writeFile(resultFile, resultArray, 'utf-8');
//   });
  