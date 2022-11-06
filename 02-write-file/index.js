const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const file = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(file);

stdout.write('Hello there! Input text:\n');

stdin.on('data', chunk => {
  if (chunk.toString().trim().toLowerCase() === 'exit') process.exit();

  output.write(chunk);
});

process.on('exit', () => stdout.write('Thank you! Have a nice day.'));
process.on('SIGINT', () => process.exit());
