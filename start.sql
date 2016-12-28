CREATE DATABASE twitclone;

USE twitclone;

CREATE TABLE Tweets (
  id INT NOT NULL AUTO_INCREMENT,
  body TEXT NOT NULL,
  handle VARCHAR(15) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO Tweets(handle, body) VALUES('DonkkaShane', 'Having a great time teaching this Twitter clone course!');
