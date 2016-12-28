'use strict';

var moment = require('moment');

var authUser = require('./middlewares/auth-user');

module.exports = function(app, connection) {
  // Get tweets
  app.get('/', function(req, res) {
    var query = 'SELECT * FROM Tweets ORDER BY created_at DESC';
    var tweetsCreated = req.cookies.tweets_created || [];

    connection.query(query, function(err, tweets) {
      if(err) {
        console.error(err);
        return;
      }

      for(var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        tweet.time_from_now = moment(tweet.created_at).fromNow();
        tweet.isEditable = tweetsCreated.includes(tweet.id);
      }
      res.render('tweets', { tweets: tweets });
      return;
    });
  });

  // Post a tweet
  app.post('/tweets/create', function(req, res) {
    var query = 'INSERT INTO Tweets(handle, body) VALUES(?, ?)';
    var handle = req.body.handle;
    var body = req.body.body;
    var tweetsCreated = req.cookies.tweets_created || [];

    connection.query(query, [handle, body], function(err, results) {
      if(err) {
        console.error(err);
        return;
      }

      tweetsCreated.push(results.insertId);
      res.cookie('tweets_created', tweetsCreated, { httpOnly: true });

      res.redirect('/');
    });
  });

  // Display edit a tweet page
  app.get('/tweets/:id([0-9]+)/edit', authUser, function(req, res) {
    var query = 'SELECT * FROM Tweets WHERE id = ?';
    var id = req.params.id;
    connection.query(query, [id], function(err, results) {
      if(err) {
        console.error(err);
        res.redirect('/');
        return;
      }

      if (results.length === 0) {
        console.error('No tweets found');
        res.redirect('/');
        return;
      }

      var tweet = results[0];
      tweet.time_from_now = moment(tweet.created_at).fromNow();

      res.render('tweet-edit', { tweet: results[0] });
      return;
    });
  });

  // Update a tweet
  app.post('/tweets/:id([0-9]+)/update', authUser, function(req, res) {
    var updateQuery = 'UPDATE Tweets SET body = ?, handle = ? WHERE id = ?';
    var deleteQuery = 'DELETE FROM Tweets WHERE id = ?';
    var id = req.params.id;
    var handle = req.body.handle;
    var body = req.body.body;
    var isDelete = req.body.delete_button !== undefined;
    var queryCallback = function(err, results) {
      if(err) {
        console.error(err);
      }
      res.redirect('/');
      return;
    };

    if (isDelete) {
      // Delete
      connection.query(deleteQuery, [id], queryCallback);
    } else {
      // Update
      connection.query(updateQuery, [body, handle, id], queryCallback);
    }
  });

}