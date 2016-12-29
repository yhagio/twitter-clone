const mysql = require('mysql');
let connection;

// connection.connect((err) => {
//   if (err) {
//     console.log('DB Connection Error:', err);
//     return;
//   }
//   console.log('Connected to the database.');
// });

function startAndHandleDisconnection() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'twitclone',
  });
  
  connection.connect((err) => {
    if (err) {
      console.log('[DB Connection Error]:\n', err);
      return;
    }
    console.log('Connected to the database.');
  });

  connection.on('error', (err) => {
    console.log('[DB ERROR]:\n', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      startAndHandleDisconnection();
    } else {
      console.error('[Some DB Error]:\n', err);
    }
  });
}

// connection.on('error', (err) => {
//   console.log('[DB ERROR]\n', err);
//   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//     connection.connect((err2) => {
//       if (err2) {
//         console.log('DB Connection Error again:\n', err2);
//         return;
//       }
//       console.log('Connected to the database again.');
//     });
//   } else {
//     console.error('[Some DB Error]\n', err);
//   }
// });

startAndHandleDisconnection();

module.exports = connection;
