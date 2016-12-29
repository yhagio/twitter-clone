const express = require('express');

const app = express();

// Database connection setup
require('./server/database');

// Configuration
require('./config')(app);

// Routes
require('./server/routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Web server listening on port 8080!');
});
