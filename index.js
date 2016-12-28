'use strict'

var express = require("express");
var mysql = require('mysql');

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

// Configuration
require('./config')(app);

// Routes
require('./routes')(app, connection);
