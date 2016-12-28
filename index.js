'use strict'

var bodyParser = require('body-parser');
var express = require("express");
var mysql = require('mysql');
var moment = require('moment');
var cookieParser = require('cookie-parser');

var authUser = require('./middlewares/auth-user');

var app = express();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'twitclone'
});

connection.connect(function(err) {
  if(err) {
    console.log('DB Connection Error:', err);
    return;
  }

  console.log('Connected to the database.');

  app.listen(8080, function() {
    console.log('Web server listening on port 8080!');
  });
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
  // var queryCallback = function(err) {
  //   if(err) {
  //     console.log(err);
  //   }
  //   res.redirect('/');
  //   return;
  // };

  if (isDelete) {
    // Delete
    connection.query(deleteQuery, [id], function(err) {
      if(err) {
        console.error('[ErrorDelete]', err);
      }
      console.log('Deleted successfully');
      res.redirect('/');
      return;
    });
  } else {
    // Update
    connection.query(updateQuery, [body, handle, id], function(err, results) {
      if(err) {
        console.error('[ErrorUpdate]', err);
        res.redirect('/');
        return;
      }

      if (results.length === 0) {
        console.error('No tweets found');
        res.redirect('/');
        return;
      }

      console.log('Updated successfully');
      res.redirect('/');
      return;
    });
  }
});
