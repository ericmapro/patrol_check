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

router.get('/parolcardsearch', function (req, res, next) {
	var vequipmentid = req.query.equipmentid;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT board.*,info_cardlib.cardlibType,equipment.equipmentname FROM board LEFT JOIN equipment on board.equipmentid = equipment.equipmentid  ' +
			'LEFT JOIN info_cardlib on equipment.devlibId = info_cardlib.devlibId and board.cardlibId = info_cardlib.cardlibId where board.equipmentid = "' + vequipmentid + '"', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				for (i = 0; i < rows.length; i++) {
					rows[i].installdate = rTime(rows[i].installdate);
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

router.get('/cardinfosearch', function (req, res, next) {
	var vboardid = req.query.boardid;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT board.*,info_cardlib.cardlibType,equipment.equipmentname FROM board LEFT JOIN equipment on board.equipmentid = equipment.equipmentid  ' +
			'LEFT JOIN info_cardlib on board.devlibId = info_cardlib.devlibId where boardid = "' + vboardid + '"', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				for (i = 0; i < rows.length; i++) {
					rows[i].installdate = rTime(rows[i].installdate);
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

