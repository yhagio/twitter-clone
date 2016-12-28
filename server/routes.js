const authUser = require('./auth-user');
const tweetsHandler = require('./handlers');

module.exports = (app) => {
  // Get tweets
  app.get('/', tweetsHandler.getTweets);

  // Post a tweet
  app.post('/tweets/create', tweetsHandler.postTweet);

  // Display edit a tweet page
  app.get('/tweets/:id([0-9]+)/edit', authUser, tweetsHandler.getEditTweet);

  // Update or Delete a tweet
  app.post('/tweets/:id([0-9]+)/update', authUser, tweetsHandler.updateDeleteTweet);
};
