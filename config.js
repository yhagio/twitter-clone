const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = (app) => {
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(express.static('./public'));
  if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
  }
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    store: new RedisStore({
      url: process.env.REDIS_URL || ''
    }),
    secret: 'SecretCodeIsHere',
    cookie: { maxAge: 1209600000 },
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(compression());
  app.use(helmet());
};
