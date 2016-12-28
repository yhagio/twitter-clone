
http://qiita.com/hkusu/items/cda3e8461e7a46ecf25d

```sh
brew update
brew install mysql
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