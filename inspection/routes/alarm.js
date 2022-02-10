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
	var vbegintime = req.query.begintime;
	var vendtime = req.query.endtime;
	pool.getConnection(function (err, connection) {
		if (err) 
		{
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
			connection.query('SELECT * FROM recoreds where record_time <= "' + vendtime + ' 23:59:59" and record_time >= "' + vbegintime + ' 00:00:00" order by record_time DESC', function (err, rows) {
						if (err) {
							console.log('[SELECT ERROR] - ', err.message);
							return;
						}

						for (i = 0; i < rows.length; i++) {
							rows[i].record_time = rTime(rows[i].record_time);
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
		if (err)
		{
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM recoreds order by record_time DESC', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				for (i = 0; i < rows.length; i++) {
					rows[i].record_time = rTime(rows[i].record_time);
				}

				res.send(rows);
				
				connection.end();
			});
	});
});


router.get('/searchbyid', function (req, res, next) {
	var vrecord_id = req.query.record_id;
	pool.getConnection(function (err, connection) {
		if (err) 
		{
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM recoreds where record_id = "' + vrecord_id + '"', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			for (i = 0; i < rows.length; i++) {
				rows[i].record_time = rTime(rows[i].record_time);
			}

			res.send(rows);
			
			connection.end();
		});
	});
});

router.get('/searchallnow', function (req, res, next) {
	var vrecord_id = req.query.record_id;
	pool.getConnection(function (err, connection) {
		if (err) 
		{
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM recoreds order by record_time DESC LIMIT 0,1', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			for (i = 0; i < rows.length; i++) {
				rows[i].record_time = rTime(rows[i].record_time);
			}

			res.send(rows);
			
			connection.end();
		});
	});
});

router.get('/selectcurrency', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) 
		{
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('select * FROM currency', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				res.send(rows);

				connection.end();
			});
	});
});


function rTime(date) {
	var json_date = new Date(date).toJSON();
	return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

module.exports = router;

