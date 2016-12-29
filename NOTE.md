### Simple Twitter Clone

Node.js MySQL Twitter Clone

http://qiita.com/hkusu/items/cda3e8461e7a46ecf25d

MySQL 5.7 on macOS does not seem to work well ...

Remove MySQL 5.7 if installed https://gist.github.com/vitorbritto/0555879fe4414d18569d
Install MySQL 5.6 https://dev.mysql.com/downloads/file/?id=463209


```sh
mysql.server start
```

After start
```
mysql -u root
> source start.sql
```
https://dev.mysql.com/doc/refman/5.7/en/mysql-batch-commands.html

http://dev.mysql.com/doc/refman/5.7/en/show-databases.html

Stop / Restart
```
mysql.server stop
mysql.server restart 
```


Start Redis server

```sh
redis-server
redis-cli # Shell command
```

### Run Locally

```
redis-server
npm run start
```


### Heroku

Use ClearDB (MySQL) add-on

http://stackoverflow.com/questions/9822313/remote-connect-to-cleardb-heroku-database

Use Heroku Redis add-on