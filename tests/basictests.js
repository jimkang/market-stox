var test = require('tape');
var createGetStoxNumber = require('../get-stox-number');
var callNextTick = require('call-next-tick');

test('Basic test', function basicTest(t) {
  t.plan(2);

  function mockPick(array) {
    return array[0];
  }

  function mockPickUpOrDown(seed) {
    return -1;
  }

  function mockGetExtent(seed) {
    return 500.5;
  }

  function mockGetCommentary(seed) {
    return '♥️';
  }

  function mockGetStock(done) {
    var stock = {
      company: 'Apple',
      symbol: 'AAPL'
    };
    callNextTick(done, null, stock);
  }

  var getStoxNumber = createGetStoxNumber({
    pickFromArray: mockPick,
    pickUpOrDown: mockPickUpOrDown,
    getExtent: mockGetExtent,
    getStock: mockGetStock,
    upSymbols: ['↑', '⇑', '⇡', '⇧', '⇧', '⇪', '⟰', '⥠', '⇯', '⇈', '⇮', '⇭', '⥘', '⥔', '⇬', '⇫', '↿', '↾', '↥', '⤊', '↟', '⤉', '⇞', '⤒', '⥉'],
    downSymbols: ['↓', '⇓', '⇩', '⇣', '☟', '⥥', '↡', '↧', '⤋', '⟱', '⇟', '⇊', '⥡', '⤈', '↯', '⥝', '⇃', '⥙', '⇂', '⥕'],
    getCommentary: mockGetCommentary
  });

  getStoxNumber((new Date()).toISOString(), checkStox);

  function checkStox(error, stox) {
    t.ok(!error, 'No error whe getting stox number.');
    t.equal(stox, 'Apple ･ $AAPL ↓ -500.5 ♥️', 'Generates stox number.');
  }
});
