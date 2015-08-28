var config = require('./config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var createGetStoxNumber = require('./get-stox-number');
var createProbable = require('probable').createProbable;
var createGetRandomStock = require('./get-random-stock');
var seedrandom = require('seedrandom');
var emojisource = require('emojisource');
var getRandomFriendUsername = require('./get-random-friend-username');
var createWordnok = require('wordnok').createWordnok;
var generateStockSymbolForName = require('./generate-stock-symbol-for-name');
var toTitleCase = require('titlecase');

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var twit = new Twit(config.twitter);

var wordnok = createWordnok({
  apiKey: config.wordnikAPIKey
});

function postTweet(text, done) {
  if (dryRun) {
    console.log('Would have tweeted:', text);
    callNextTick(done);
  }
  else {
    var body = {
      status: text
    };
    twit.post('statuses/update', body, done);
  }
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  }
}

((function go() {
  var seed = (new Date()).toISOString();
  console.log(seed);

  var probable = createProbable({
    random: seedrandom(seed)
  });

  var multiplierTable = probable.createRangeTableFromDict({
    2: 5,
    5: 10,
    10: 30,
    20: 30,
    50: 20,
    100: 5,
    1000: 1
  });

  var sourceTypeTable = probable.createRangeTableFromDict({
    nasdaq: 20,
    wordnikTopic: 25,
    friend: 10
  });

  function pickLineIndex(numberOfLines) {
    // Last line is going to be a time stamp; don't pick that.
    return probable.rollDie(numberOfLines - 1);
  }

  var getRandomStock = createGetRandomStock({
    pickLineIndex: pickLineIndex
  });

  function getStockChangeExtent() {
    var base = probable.roll(100)/100.0;
    var multiplier = +multiplierTable.roll();
    return base * multiplier;
  }

  function getCommentary() {
    return emojisource.getRandomTopicEmoji();
  }

  function getStock(done) {
    switch (sourceTypeTable.roll()) {
      case 'nasdaq':
        getRandomStock(done);
        break;
      case 'wordnikTopic':
        wordnok.getTopic(wrapNameInStock);
        break;
      case 'friend':
        getRandomFriendUsername(twit, probable.pickFromArray, wrapNameInStock);
        break;
    }

    function wrapNameInStock(error, name) {
      if (error) {
        done(error);
      }
      else {
        var stockDatum = {};

        if (name[0] === '@') {
          // Twitter username
          stockDatum.symbol = generateStockSymbolForName(name.slice(1));
          stockDatum.company = name;
        }
        else {
          stockDatum.symbol = generateStockSymbolForName(name);
          stockDatum.company = toTitleCase(name);
        }

        done(error, stockDatum);
      }
    }    
  }

  var getStoxNumber = createGetStoxNumber({
    pickFromArray: probable.pickFromArray,
    getExtent: getStockChangeExtent,
    getStock: getStock,
    // TODO: Should be in a data file.
    upSymbols: ['↑', '⇑', '⇡', '⇧', '⇧', '⇪', '⟰', '⥠', '⇯', '⇈', '⇮', '⇭', '⥘', '⥔', '⇬', '⇫', '↿', '↾', '↥', '⤊', '↟', '⤉', '⇞', '⤒', '⥉'],
    downSymbols: ['↓', '⇓', '⇩', '⇣', '☟', '⥥', '↡', '↧', '⤋', '⟱', '⇟', '⇊', '⥡', '⤈', '↯', '⥝', '⇃', '⥙', '⇂', '⥕'],
    getCommentary: getCommentary
  });

  getStoxNumber(seed, passToTweet);

  function passToTweet(error, stoxNumber) {
    if (error) {
      console.log(error);
    }
    else {
      postTweet(stoxNumber, wrapUp);
    }
  }
})());
