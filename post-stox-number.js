var config = require('./config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var createGetStoxNumber = require('./get-stox-number');
var createProbable = require('probable').createProbable;
var createGetRandomStock = require('./get-random-stock');
var seedrandom = require('seedrandom');
var emojisource = require('emojisource');
var getRandomFollowerUsername = require('./get-random-follower-username');
var createWordnok = require('wordnok').createWordnok;

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
    var roll = probable.roll(4);
    if (roll === 0) {
      getRandomFollowerUsername(twit, probable.pickFromArray, done);
    }
    else if (roll == 1) {
      wordnok.getTopic(done);
    }
    else {
      getRandomStock(done);
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
