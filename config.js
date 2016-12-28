const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(express.static('./public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
  }
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
};
