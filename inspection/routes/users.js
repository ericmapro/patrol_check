var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var vconfig = require('../helper/getconfig.js');

var pool = mysql.createPool({
  host: vconfig.DB_IP,
  user: vconfig.DB_USER,
  password: vconfig.DB_PASSWORD,
  database: vconfig.DB_DATABASE
});

router.get('/search', function (req, res, next) {
  var vUserName = req.query.UserName;
  var vUserPassword = req.query.UserPassword;
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('SELECT * FROM user where username = "' + vUserName + '" and userpassword = "' + vUserPassword + '"', function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      res.send(rows);

      connection.end();
    });
  });
});

router.get('/searchbyid', function (req, res, next) {
  var vuserid = req.query.userid;
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('SELECT * FROM user where userid = "' + vuserid + '"', function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      res.send(rows);

      connection.end();
    });
  });
});

router.get('/searchall', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('SELECT * FROM user where username <> "admin"', function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      for (i = 0; i < rows.length; i++) {
        if (rows[i].addtime != null) {
          rows[i].addtime = rTime(rows[i].addtime);
        }
      }

      var data = {
        code: 0,
        msg: '',
        count: rows.length,
        data: rows
      };

      var content = JSON.stringify(data);

      res.send(content);

      connection.end();
    });
  });
});

router.get('/delete', function (req, res, next) {
  var vuserid = req.query.userid;
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('delete from user where userid = "' + vuserid + '"', function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      res.send('ok');

      connection.end();
    });
  });
});

router.get('/deleteall', function (req, res, next) {
  var vusers = req.query.users;
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('DELETE FROM user where userid IN (' + vusers + ')', function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      res.send('ok');

      connection.end();
    });
  });
});

router.get('/update', function (req, res, next) {
  var vuserid = req.query.userid;
  var vusername = req.query.username;
  var vuserpassword = req.query.userpassword;
  var vuserphone = req.query.userphone;
  var vuseremail = req.query.useremail;
  var vuserrule = req.query.userrule;

  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('update user set username = "' + vusername + '" , userpassword = "' + vuserpassword + '" , userphone = "' + vuserphone + '" , useremail = "' + vuseremail +
      '" , userrule = "' + vuserrule + '" where userid = "' + vuserid + '"', function (err, rows) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          return;
        }

        res.send('ok');

        connection.end();
      });
  });
});

router.get('/save', function (req, res, next) {
  var vusername = req.query.username;
  var vuserpassword = req.query.userpassword;
  var vuserphone = req.query.userphone;
  var vuseremail = req.query.useremail;
  var vuserrule = req.query.userrule;
  var addSqlParams = [vusername, vuserpassword, vuserphone, vuseremail, vuserrule];
  pool.getConnection(function (err, connection) {
    if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
    connection.query('INSERT INTO user(username,userpassword,userphone,useremail,userrule,addtime) VALUES(?,?,?,?,?,NOW())', addSqlParams, function (err, rows) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      res.send('ok');

      connection.end();
    });
  });
});

function rTime(date) {
  var json_date = new Date(date).toJSON();
  return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

module.exports = router;
