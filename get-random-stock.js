var lineChomper = require('line-chomper');
var jsonfile = require('jsonfile');
var numberOfLinesInTxtFile = 8349;

function createGetRandomStock(createOpts) {
  var pickLineIndex;
  if (createOpts) {
    pickLineIndex = createOpts.pickLineIndex;
  }

  function getRandomStock(done) {
    var offsets = jsonfile.readFileSync(
      __dirname + '/data/nasdaqtraded-offsets.json'
    );

    var lineIndex = pickLineIndex(numberOfLinesInTxtFile);

    lineChomper.chomp(
      __dirname + '/data/nasdaqtraded.txt',
      {
        lineOffsets: offsets,
        fromLine: lineIndex,
        lineCount: 1
      },
      getStockDataFromLines
    );

    function getStockDataFromLines(error, lines) {
      var line;
      if (error) {
        done(error);
      }
      else if (!lines || !Array.isArray(lines) || lines.length < 1) {
        var error = new Error('Could not get valid line at ' + lineIndex);
        done(error);
      }
      else {
        line = lines[0];
        done(error, getStockDataFromLine(line));
      }
    }

    function getStockDataFromLine(line) {
      var parts = line.split('|');
      return {
        company: parts[2],
        symbol: parts[1]
      };
    }
  }

  return getRandomStock;
}

module.exports = createGetRandomStock;
