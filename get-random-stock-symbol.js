var lineChomper = require('line-chomper');
var jsonfile = require('jsonfile');
var numberOfLinesInTxtFile = 8349;

function createGetRandomStockSymbol(createOpts) {
  var pickLineIndex;
  if (createOpts) {
    pickLineIndex = createOpts.pickLineIndex;
  }

  function getRandomStockSymbol(done) {
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
      getQuoteFromLines
    );

    function getQuoteFromLines(error, lines) {
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
        done(error, getQuoteFromLine(line));
      }
    }

    function getQuoteFromLine(line) {
      var parts = line.split('|');
      return parts[1];
    }
  }

  return getRandomStockSymbol;
}

module.exports = createGetRandomStockSymbol;
