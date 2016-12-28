const express = require('express');

const app = express();

// Database connection setup
require('./server/database');

// Configuration
require('./config')(app);

// Routes
require('./server/routes')(app);

app.listen(8080, () => {
  console.log('Web server listening on port 8080!');
});
