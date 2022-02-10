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
	var vequipmentid = req.query.equipmentid
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM monitorpoint where equipmentid="' + vequipmentid + '"', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/updatestatus', function (req, res, next) {
	var vequipmentid = req.query.equipmentid;
	var vtrapenable = req.query.trapenable;
	var vmonitorid = req.query.monitorid;

	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('update monitorpoint set trapenable=' + vtrapenable + ' where equipmentid="' + vequipmentid + '" and monitorid = "' + vmonitorid + '"', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/updateip', function (req, res, next) {
	var vequipmentid = req.query.equipmentid;
	var vmonitorip = req.query.monitorip;
	var vmonitorid = req.query.monitorid;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('update monitorpoint set monitorip="' + vmonitorip + '" where equipmentid="' + vequipmentid + '" and monitorid = "' + vmonitorid + '"', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

module.exports = router;

