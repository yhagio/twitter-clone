const moment = require('moment');

const connection = require('./database');

function getTweets(req, res) {
  // console.log('[USER]', req.user)
  const query = `
    SELECT t.id, t.body, t.created_at, u.handle
    FROM Tweets as t
    LEFT JOIN Users as u
    ON t.user_id = u.id
    ORDER BY created_at DESC
  `;

  connection.query(query, (err, tweets) => {
    // console.log('[Tweets]', tweets);
    if (err) {
      console.error(err);
      return;
    }

    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      tweet.time_from_now = moment(tweet.created_at).fromNow();
      if (req.user) {
        tweet.isEditable = tweets[i].handle === req.user.handle;
      } else {
        tweet.isEditable = false;
      }
    }
    res.render('tweets', { tweets, user: req.user });
  });
}

function postTweet(req, res) {
  // console.log('User', req.user, req.body);
  const query = 'INSERT INTO Tweets(user_id, body) VALUES(?, ?)';
  const userId = req.user.id;
  const body = req.body.body;
  // const tweetsCreated = req.cookies.tweets_created || [];

  connection.query(query, [userId, body], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }

    // tweetsCreated.push(results.insertId);
    // res.cookie('tweets_created', tweetsCreated, { httpOnly: true });

    res.redirect('/');
  });
}

function getEditTweet(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  const query = `
    SELECT t.id, t.body, t.created_at, u.handle
    FROM Tweets as t
    LEFT JOIN Users as u
    ON t.user_id = ${userId} AND t.id = ${id} AND u.id = ${userId}
    WHERE u.handle IS NOT NULL
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.redirect('/');
      return;
    }

    if (results.length === 0) {
      // console.error('No tweets found');
      res.redirect('/');
      return;
    }

    const tweet = results[0];
    if (!tweet.handle) {
      res.redirect('/');
      return;
    }

    tweet.time_from_now = moment(tweet.created_at).fromNow();

    res.render('tweet-edit', { tweet: results[0], user: req.user });
  });
}

function updateDeleteTweet(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  const body = req.body.body;

  const updateQuery = `
  UPDATE Tweets
  SET body = "${body}"
  WHERE id = ${id} AND user_id = ${userId}
  `;

  const deleteQuery = `
  DELETE FROM Tweets
  WHERE id = ${id} AND user_id = ${userId}
  `;

  const isDelete = req.body.delete_button !== undefined;
  const queryCallback = (err) => {
    if (err) {
      console.error(err);
    }
    return res.redirect('/');
  };

  if (isDelete) {
    // Delete
    connection.query(deleteQuery, queryCallback);
  } else {
    // Update
    connection.query(updateQuery, queryCallback);
  }
}

module.exports = {
  getTweets,
  postTweet,
  getEditTweet,
  updateDeleteTweet,
};
