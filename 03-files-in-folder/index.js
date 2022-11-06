const fs = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder'); 

fs.readdir(dir).then((res) => {
  res.forEach(item => {
    const filePath = path.join(dir, item);

    fs.stat(filePath).then(stats => {
      if (stats.isFile()) {
        const name = path.parse(item).name;
        const extension = path.extname(item).slice(1);
        const size = `${(stats.size / 1024).toFixed(2)} kB`;

        console.log(`${name} - ${extension} - ${size}`);
      }
    });
  });
});
