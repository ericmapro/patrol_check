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

router.get('/parolsearch', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT equipment.*,info_devicelib.devlibType FROM equipment left join info_devicelib on equipment.devlibId = info_devicelib.devlibId', function (err, rows) {
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

router.get('/parolsearcho', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM equipment', function (err, rows) {
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

router.get('/parolsearchsmall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM equipment where devlibId <> "110"', function (err, rows) {
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

router.get('/parolsearchsmallalarm', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM equipment where devlibId = "110"', function (err, rows) {
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

router.get('/portsearch', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT port.* FROM port inner JOIN equipment on port.equipmentid = equipment.equipmentid ' +
			'where port.devlibId <> "110" and port.portlibtypeid = "6"', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				res.send(rows);

				connection.end();
			});
	});
});

router.get('/portsearchalarm', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT port.* FROM port LEFT JOIN equipment on port.devlibId = equipment.devlibId ' +
			' where port.devlibId = "110"', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				res.send(rows);

				connection.end();
			});
	});
});

router.get('/searchequipmentsectorall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM equipmentsector', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/searchequipmentsectorallalarm', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM relayout', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/searchequipmentsector', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT equipmentsector.*,sector.sectorname,CONCAT(equipment.equipmentname,"-",port.portName) AS listname,port.cardNbr,port.devlibId ' +
			'FROM equipmentsector LEFT JOIN sector on equipmentsector.sectorid = sector.sectorid ' +
			'LEFT JOIN port on equipmentsector.equipmentid = port.equipmentid and equipmentsector.portNbr = port.portNbr and equipmentsector.cardNbr = port.cardNbr ' +
			'LEFT JOIN equipment on equipmentsector.equipmentid = equipment.equipmentid', function (err, rows) {
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

router.get('/searchequipmentalarm', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT relayout.*,sector.sectorname,concat(equipment.equipmentname,"-",port.portName) AS listname,port.devlibId ' +
			'FROM relayout LEFT JOIN sector on relayout.sectorid = sector.sectorid ' +
			'LEFT JOIN port on relayout.equipmentid = port.equipmentid and relayout.portNbr = port.portNbr ' +
			'LEFT JOIN equipment on relayout.equipmentid = equipment.equipmentid', function (err, rows) {
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

function rTime(date) {
	var json_date = new Date(date).toJSON();
	return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

module.exports = router;

