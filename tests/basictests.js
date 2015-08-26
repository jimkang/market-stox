var test = require('tape');
var createGetStoxNumber = require('../get-stox-number');

test('Basic test', function basicTest(t) {
  t.plan(1);

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

  var getStoxNumber = createGetStoxNumber({
    pickFromArray: mockPick,
    pickUpOrDown: mockPickUpOrDown,
    getExtent: mockGetExtent,
    stockSymbols: ['AAPL', 'SMGO', 'WZRD'],
    upSymbols: ['↑', '⇑', '⇡', '⇧', '⇧', '⇪', '⟰', '⥠', '⇯', '⇈', '⇮', '⇭', '⥘', '⥔', '⇬', '⇫', '↿', '↾', '↥', '⤊', '↟', '⤉', '⇞', '⤒', '⥉'],
    downSymbols: ['↓', '⇓', '⇩', '⇣', '☟', '⥥', '↡', '↧', '⤋', '⟱', '⇟', '⇊', '⥡', '⤈', '↯', '⥝', '⇃', '⥙', '⇂', '⥕'],
    getCommentary: mockGetCommentary
  });

  t.equal(getStoxNumber(
    (new Date()).toISOString()), 'AAPL ↓ -500.5 ♥️', 'Generates stox number.'
  );
});
