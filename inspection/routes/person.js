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
	var vpage = req.query.page;
	var vlimit = req.query.limit;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM person ', function (err, rowscount) {
			connection.query('SELECT * FROM person limit ' + ((vpage - 1) * vlimit) + ',' + vlimit + ';', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				var data = {
					code: 0,
					msg: '',
					count: rowscount.length,
					data: rows
				};

				var content = JSON.stringify(data);

				res.send(content);

				connection.end();
			});
		});
	});
});

router.get('/searchall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM person', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/searchallperson', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM sectorperson', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/searchsectorperson', function (req, res, next) {
	var vpage = req.query.page;
	var vlimit = req.query.limit;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT sectorperson.*,sector.sectorname,person.name' +
			' FROM sectorperson LEFT JOIN sector on sectorperson.sectorid = sector.sectorid ' +
			'LEFT JOIN person on sectorperson.personid = person.personid limit ' + ((vpage - 1) * vlimit) + ',' + vlimit + ';', function (err, rows) {
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

module.exports = router;

