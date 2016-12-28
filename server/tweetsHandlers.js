const moment = require('moment');

const connection = require('./database');

function getTweets(req, res) {
  // console.log('USER', req.user)
  const query = 'SELECT * FROM Tweets ORDER BY created_at DESC';
  const tweetsCreated = req.cookies.tweets_created || [];

  connection.query(query, (err, tweets) => {
    if (err) {
      console.error(err);
      return;
    }

    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      tweet.time_from_now = moment(tweet.created_at).fromNow();
      tweet.isEditable = tweetsCreated.includes(tweet.id);
    }
    res.render('tweets', { tweets, user: req.user });
  });
}

function postTweet(req, res) {
  console.log('User', req.user, req.body);
  res.redirect('/');
  // const query = 'INSERT INTO Tweets(user_id, body) VALUES(?, ?)';
  // const user_id = req.body.user_id;
  // const body = req.body.body;
  // const tweetsCreated = req.cookies.tweets_created || [];

  // connection.query(query, [user_id, body], (err, results) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }

  //   tweetsCreated.push(results.insertId);
  //   res.cookie('tweets_created', tweetsCreated, { httpOnly: true });

  //   res.redirect('/');
  // });
}

function getEditTweet(req, res) {
  const query = 'SELECT * FROM Tweets WHERE id = ?';
  const id = req.params.id;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.redirect('/');
      return;
    }

    if (results.length === 0) {
      console.error('No tweets found');
      res.redirect('/');
      return;
    }

    const tweet = results[0];
    tweet.time_from_now = moment(tweet.created_at).fromNow();

    res.render('tweet-edit', { tweet: results[0] });
  });
}

function updateDeleteTweet(req, res) {
  const updateQuery = 'UPDATE Tweets SET body = ?, user_id = ? WHERE id = ?';
  const deleteQuery = 'DELETE FROM Tweets WHERE id = ?';
  const id = req.params.id;
  const user_id = req.body.user_id;
  const body = req.body.body;
  const isDelete = req.body.delete_button !== undefined;
  const queryCallback = (err) => {
    if (err) {
      console.error(err);
    }
    return res.redirect('/');
  };

  if (isDelete) {
    // Delete
    connection.query(deleteQuery, [id], queryCallback);
  } else {
    // Update
    connection.query(updateQuery, [body, user_id, id], queryCallback);
  }
}

module.exports = {
  getTweets,
  postTweet,
  getEditTweet,
  updateDeleteTweet,
};
