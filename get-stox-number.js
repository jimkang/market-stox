function createGetStoxNumber(createOpts) {
  var pickFromArray;
  var pickUpOrDown;
  var getExtent;
  var getStock;
  var upSymbols;
  var downSymbols;
  var getExtent;
  var getCommentary;

  if (createOpts) {
    pickFromArray = createOpts.pickFromArray;
    pickUpOrDown = createOpts.pickUpOrDown;
    getExtent = createOpts.getExtent;
    getStock = createOpts.getStock;
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

  function getStoxNumber(seed, done) {
    var direction = pickUpOrDown(seed);
    var amount = direction * getExtent(seed).toFixed(1);
    if (amount > 0) {
      amount = '+' + amount;
    }
    var directionSymbol;
    if (direction < 0) {
      directionSymbol = pickFromArray(downSymbols);
    }
    else {
      directionSymbol = pickFromArray(upSymbols);
    }
    var commentary = getCommentary();

    getStock(assembleStoxNumber);

    function assembleStoxNumber(error, stock) {
      if (error) {
        done(error);
      }
      else {
        done(
          error,
          stock.company + ' ･ $' + stock.symbol + '\n\n' +
            directionSymbol + ' ' + amount + ' ' + commentary
        );
      }
    }
  }

  return getStoxNumber;
}

module.exports = createGetStoxNumber;
