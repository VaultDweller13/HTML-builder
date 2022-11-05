const fs = require('fs');
const path = require('path');

const { stdout } = process;
const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, 'utf-8');

stream.on('data', (chunk) => {
  stdout.write(chunk);
});