var test = require('tape');
var generateStockSymbolForName = require('../generate-stock-symbol-for-name');
var callNextTick = require('call-next-tick');

var expectedSymbolsForNames = {
  smidgeo: 'SMGO',
  deathmtn: 'DEHN',
  galyngale: 'GLGE',
  gobstoppers: 'GBPS',
  cat: 'CAT',
  'Thomas Aquinas': 'TA'
};

Object.keys(expectedSymbolsForNames).forEach(runTest);

function runTest(name) {
  test('Generate stock symbol', function symbolTest(t) {
    t.equal(
      generateStockSymbolForName(name),
      expectedSymbolsForNames[name],
      'The correct symbol is generated.'
    );
    t.end();
  });
}
