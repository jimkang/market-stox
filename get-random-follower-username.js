function getRandomFollowerUsername(twit, pickFromArray, done) {
  twit.get('followers/ids', pickIdFromFollowers);

  function pickIdFromFollowers(error, followersData) {
    if (error) {
      done(error);
    }
    else {
      var showUsersParams = {
        user_id: pickFromArray(followersData.ids)
      };
      twit.get('users/show', showUsersParams, passBackScreenName);
    }
  }

  function passBackScreenName(error, userInfo) {
    if (error) {
      done(error);
    }
    else {
      done(error, '@' + userInfo.screen_name);
    }
  }
}

module.exports = getRandomFollowerUsername;
