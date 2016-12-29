const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'twitclone',
});

connection.connect((err) => {
  if (err) {
    console.log('DB Connection Error:', err);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;
mysql://bf0be003bac8ce:3aa0556c@us-cdbr-iron-east-04.cleardb.net/heroku_11bef46b16f23a8?reconnect=true