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
    user.id = user.insertId;
    req.login(user, (error) => {
      if (error) {
        console.error(error);
        return;
      }
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
      console.error(err);
      return res.redirect('/login');
    }

    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
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
