'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

module.exports = function(app) {
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