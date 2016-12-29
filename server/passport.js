const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const connection = require('./database');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log('[Serialize]', user)
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('[Deserialize]', id)
    const query = `SELECT * FROM Users WHERE id = '${id}';`;
    connection.query(query, (err, users) => {
      if (err) return done(err);
      done(err, users[0]);
    });
  });

  passport.use('local', new LocalStrategy({
    // Login with email instead of username(default)
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    console.log('[LocalStrategy]', email, password);
    const query = `SELECT * FROM Users WHERE email='${email}';`;
    connection.query(query, (error, users) => {
      console.log('[LoggingIn]', users[0]);
      if (error) return done(error);
      if (!users[0]) return done(null, false);
      bcrypt.compare(password, users[0].password, (err, res) => {
        if (err) return done(err);
        if (res) return done(null, users[0]);
        return done(new Error('Passwords did not match'));
      });
    });
  }));
};
