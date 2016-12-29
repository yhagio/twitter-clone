const tweetsHandlers = require('./tweetsHandlers');
const usersHandlers = require('./usersHandlers');
const isAuthed = require('./ensureAuthed');

module.exports = (app) => {
  // Get tweets
  app.get('/', tweetsHandlers.getTweets);

  // Post a tweet
  app.post('/tweets/create', isAuthed, tweetsHandlers.postTweet);

  // Display edit a tweet page
  app.get('/tweets/:id([0-9]+)/edit', isAuthed, tweetsHandlers.getEditTweet);

  // Update or Delete a tweet
  app.post('/tweets/:id([0-9]+)/update', isAuthed, tweetsHandlers.updateDeleteTweet);

  // Sign up
  app.get('/signup', usersHandlers.getSignup);
  app.post('/signup', usersHandlers.signupUser);

  // Log in
  app.get('/login', usersHandlers.getLogin);
  app.post('/login', usersHandlers.loginUser);

  // Log out
  app.get('/logout', usersHandlers.logoutUser);
};
