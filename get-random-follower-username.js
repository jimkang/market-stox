function getRandomFollowerUsername(twit, pickFromArray, done) {
  twit.get('friends/ids', pickIdFromFriends);

  function pickIdFromFriends(error, friendsData) {
    if (error) {
      done(error);
    }
    else {
      var showUsersParams = {
        user_id: pickFromArray(friendsData.ids)
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
