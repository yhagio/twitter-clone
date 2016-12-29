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
