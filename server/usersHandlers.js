const passport = require('passport');
const bcrypt = require('bcrypt');

require('./passport')(passport);

const connection = require('./database');

function getSignup(req, res) {
  res.render('signup');
}

function signupUser(req, res) {
  const email = req.body.email;
  const handle = req.body.handle;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const query = 'INSERT INTO Users(email, handle, password) VALUES(?, ?, ?)';
  connection.query(query, [email, handle, hash], (err, user) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[SUCCESS signupUser]:\n', user);
    user.id = user.insertId;
    req.login(user, (error) => {
      if (error) {
        console.error('[Login Error on Signup]:\n', error);
        return;
      }
      console.log('[User Logged-in after Sign up]');
      res.redirect('/');
    });
  });
}

function getLogin(req, res) {
  res.render('login');
}

function loginUser(req, res) {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      console.error('[Auth Error]\n', err);
      return res.redirect('/login');
    }

    if (!user) {
      console.error('[Auth Error - No User -]');
      return res.redirect('/login');
    }

    console.log('[Logging In ...]');
    req.logIn(user, (err) => {
      if (err) {
        console.error('[Log In Error]:\n', err);
        return res.redirect('/login');
      }
      return res.redirect('/');
    });
  })(req, res);
}

function logoutUser(req, res) {
  req.logout();
  res.redirect('/login');
  return;
}

module.exports = {
  getSignup,
  signupUser,
  getLogin,
  loginUser,
  logoutUser,
};
