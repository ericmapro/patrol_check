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

router.get('/searchall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('SELECT * FROM global_config', function (err, rows) {
		if (err) {
		  console.log('[SELECT ERROR] - ', err.message);
		  return;
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

router.get('/searchbyid', function (req, res, next) {
	var vid = req.query.id;
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('SELECT * FROM global_config where id = "' + vid + '"', function (err, rows) {
		if (err) {
		  console.log('[SELECT ERROR] - ', err.message);
		  return;
		}
  
		res.send(rows);
  
		connection.end();
	  });
	});
});

router.get('/delete', function (req, res, next) {
	var vid = req.query.id;
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('delete from global_config where id = "' + vid + '"', function (err, rows) {
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
	var vids = req.query.ids;
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('DELETE FROM global_config where id IN (' + vids + ')', function (err, rows) {
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
	var vid = req.query.id;
	var vbegin_time = req.query.begin_time;
	var vend_time = req.query.end_time;
	var vinterval = req.query.interval;
	var vsave_data_path = req.query.save_data_path;
	var vstay_time_mini = req.query.stay_time_mini;
	var vmax_lost_time = req.query.max_lost_time;
  
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('update global_config set begin_time = "' + vbegin_time + '" , end_time = "' + vend_time + '" , curr_interval = "' + vinterval + 
	  '" , save_data_path = "' + vsave_data_path + '" , stay_time_mini = "' + vstay_time_mini + '" , max_lost_time = "' + vmax_lost_time +
		'" where id = "' + vid + '"', function (err, rows) {
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
	var vbegin_time = req.query.begin_time;
	var vend_time = req.query.end_time;
	var vinterval = req.query.interval;
	var vsave_data_path = req.query.save_data_path;
	var vstay_time_mini = req.query.stay_time_mini;
	var vmax_lost_time = req.query.max_lost_time;
	var addSqlParams = [vbegin_time, vend_time, vinterval,vsave_data_path,vstay_time_mini,vmax_lost_time];
	pool.getConnection(function (err, connection) {
	  if (err) {
			  console.log('[SELECT ERROR] - ', err.message); 
			  return;
		  }
	  connection.query('INSERT INTO global_config(begin_time,end_time,curr_interval,save_data_path,stay_time_mini,max_lost_time) VALUES(?,?,?,?,?,?)', addSqlParams, function (err, rows) {
		if (err) {
		  console.log('[SELECT ERROR] - ', err.message);
		  return;
		}
  
		res.send('ok');
  
		connection.end();
	  });
	});
});
  
module.exports = router;

