var lineChomper = require('line-chomper');

if (process.argv.length < 3) {
  console.log('Usage: node getfilelineoffsets.js <filename>');
  process.exit();
}

var filename = process.argv[2];

lineChomper.mapLineOffsets(filename, logLineOffsets);

function logLineOffsets(error, lineOffsets) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(lineOffsets, null, '  '));
  }
}
