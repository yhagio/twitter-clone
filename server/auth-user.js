module.exports = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const tweetsCreated = req.cookies.tweets_created || [];

  if (!tweetsCreated.includes(id)) {
    // Redirect to homepage if user didn't create tweet.
    res.redirect('/');
    return;
  }
  next();
};
