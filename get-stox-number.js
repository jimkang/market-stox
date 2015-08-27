function createGetStoxNumber(createOpts) {
  var pickFromArray;
  var pickUpOrDown;
  var getExtent;
  var stockSymbols;
  var upSymbols;
  var downSymbols;
  var getExtent;
  var getCommentary;

  if (createOpts) {
    pickFromArray = createOpts.pickFromArray;
    pickUpOrDown = createOpts.pickUpOrDown;
    getExtent = createOpts.getExtent;
    stockSymbols = createOpts.stockSymbols;
    upSymbols = createOpts.upSymbols;
    downSymbols = createOpts.downSymbols;
    getCommentary = createOpts.getCommentary;
  }

  if (!pickFromArray) {
    throw new Error('No pickFromArray provided to createGetStoxNumber.');
  }

  if (!pickUpOrDown) {
    pickUpOrDown = function defaultUpOrDown(seed) {
      return pickFromArray([-1, 1]);
    };
  }

  function getStoxNumber(seed) {
    var stock = pickFromArray(stockSymbols);
    var direction = pickUpOrDown(seed);
    var amount = direction * getExtent(seed).toFixed(1);
    var directionSymbol;
    if (direction < 0) {
      directionSymbol = pickFromArray(downSymbols);
    }
    else {
      directionSymbol = pickFromArray(upSymbols);
    }
    var commentary = getCommentary();
    return stock + ' ' + directionSymbol + ' ' + amount + ' ' + commentary;
  }

  return getStoxNumber;
}

module.exports = createGetStoxNumber;
