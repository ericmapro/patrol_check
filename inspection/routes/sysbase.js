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

router.get('/devicelibsearch', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM info_devicelib', function (err, rows) {
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

