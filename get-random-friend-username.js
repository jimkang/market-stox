function getRandomFriendUsername(twit, pickFromArray, done) {
  // Actually picking from friends instead of Friends in order to avoid 
  // promoting spam accounts.
  twit.get('friends/ids', pickIdFromFriends);

  function pickIdFromFriends(error, FriendsData) {
    if (error) {
      done(error);
    }
    else {
      var showUsersParams = {
        user_id: pickFromArray(FriendsData.ids)
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

module.exports = getRandomFriendUsername;
