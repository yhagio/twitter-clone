const authUser = require('./auth-user');
const tweetsHandlers = require('./tweetsHandlers');
const usersHandlers = require('./usersHandlers');

module.exports = (app) => {
  // Get tweets
  app.get('/', tweetsHandlers.getTweets);

  // Post a tweet
  app.post('/tweets/create', tweetsHandlers.postTweet);

  // Display edit a tweet page
  app.get('/tweets/:id([0-9]+)/edit', authUser, tweetsHandlers.getEditTweet);

  // Update or Delete a tweet
  app.post('/tweets/:id([0-9]+)/update', authUser, tweetsHandlers.updateDeleteTweet);

  // Sign Up 
  app.get('/signup', usersHandlers.getSignup);
  app.post('/signup', usersHandlers.signupUser);

  // Log in
  app.get('/login', usersHandlers.getLogin);
  app.post('/login', usersHandlers.loginUser);
  // Log out
  app.get('/logout', usersHandlers.logoutUser);
};
