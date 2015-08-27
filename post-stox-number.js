var config = require('./config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var createGetStoxNumber = require('./get-stox-number');
var createProbable = require('probable').createProbable;
var createGetRandomStockSymbol = require('./get-random-stock-symbol');
var seedrandom = require('seedrandom');
var emojisource = require('emojisource');
var getRandomFollowerUsername = require('./get-random-follower-username');

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var twit = new Twit(config.twitter);

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
  debugger;
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

  function pickLineIndex(numberOfLines) {
    // Last line is going to be a time stamp; don't pick that.
    return probable.rollDie(numberOfLines - 1);
  }

  var getRandomStockSymbol = createGetRandomStockSymbol({
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

  function getStockSymbol(done) {
    if (probable.roll(4) === 0) {
      getRandomFollowerUsername(twit, probable.pickFromArray, done);
    }
    else {
      getRandomStockSymbol(done);
    }
  }

  var getStoxNumber = createGetStoxNumber({
    pickFromArray: probable.pickFromArray,
    getExtent: getStockChangeExtent,
    // TODO: stockSymbols should be an async function, not a list.
    getStockSymbol: getStockSymbol,
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
