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
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM camera', function (err, rows) {
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

router.get('/searchall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM camera order by sequence', function (err, rows) {
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
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM camera where id = "' + req.query.camid + '"', function (err, rows) {
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
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		
			connection.query('DELETE FROM camera where id = "' + req.query.camid + '"', function (err, rows) {
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
	var vcams = req.query.cams;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		
			connection.query('DELETE FROM camera where id IN (' + vcams + ')', function (err, rows) {
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
	
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('update camera set camera_name = "' + req.query.camname + '" , camera_factory = "' + req.query.camerafactory + '" , ip_address = "' + req.query.ipaddress +
			'" , rtsp_port = "' + req.query.rtspport + '" , user_name = "' + req.query.username +
			'" , password = "' + req.query.password + '" , code_stream = "' + req.query.codestream + 
			'" , sequence = "' + req.query.sequence + '" , category = "' + req.query.category + 
			'" , detect_level = "' + req.query.detectlevel + '" , stay_time = "' + req.query.staytime + 
			'" , url = "' + req.query.url + '" where id = "' + req.query.camid + '"', function (err, rows) {

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
	var vcameraname = req.query.camname;
	var vcamerafactory = req.query.camerafactory;
	var vipaddress = req.query.ipaddress;
	var vrtspport = req.query.rtspport;
	var vusername = req.query.username;
	var vpassword = req.query.password;
	var vcodestream = req.query.codestream;
	var vurl = req.query.url;
	var vsequence = req.query.sequence;
	var vcategory = req.query.category;
	var vdetectlevel = req.query.detectlevel;
	var vstaytime = req.query.staytime;
	var addSqlParams = [vcameraname,vcamerafactory,vipaddress,vrtspport,vusername,vpassword, vcodestream, vurl, vsequence,vcategory,vdetectlevel,vstaytime];
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('INSERT INTO camera(camera_name,camera_factory,ip_address,rtsp_port,user_name,password,code_stream,url,sequence,category,detect_level,stay_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', addSqlParams, function (err, rows) {

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

