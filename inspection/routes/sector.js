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

router.get('/sectorsearch', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT sector.*,concat(equipment.equipmentname,"-",port.portName) as portNbr,port.cardNbr,equipment.equipmentname,port.portName FROM sector ' +
			'LEFT JOIN equipmentsector ON sector.sectorid = equipmentsector.sectorid ' +
			'LEFT JOIN port on equipmentsector.equipmentid = port.equipmentid and equipmentsector.portNbr = port.portNbr and equipmentsector.cardNbr = port.cardNbr ' +
			'LEFT JOIN equipment on equipmentsector.equipmentid = equipment.equipmentid', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				for (i = 0; i < rows.length; i++) {
					rows[i].installationtime = rTime(rows[i].installationtime);
					rows[i].portNbr = rows[i].equipmentname + '-' + rows[i].cardNbr + '-' + rows[i].portName;
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

router.get('/sectorsearcho', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('SELECT * FROM sector', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			for (i = 0; i < rows.length; i++) {
				rows[i].installationtime = rTime(rows[i].installationtime);
			}

			res.send(rows);

			connection.end();
		});
	});
});

router.get('/searchxy', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('select camera.*,cameraxy.textx,cameraxy.texty,cameraxy.canvaswidth,cameraxy.canvasheight from camera ' +
			' LEFT JOIN cameraxy on camera.id = cameraxy.camearid  ', function (err, rows) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					return;
				}

				res.send(rows);

				connection.end();
			});
	});
});

router.get('/deletexy', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('delete from cameraxy', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send('ok');

			connection.end();
		});
	});
});

var interval_arrMain = new Array();
function Build_interval_array(_ID) {
	interval_arrMain.push(new intervaldetails(_ID));
}

function intervaldetails(_ID) {
	this.id = _ID;
}

router.get('/savexy', function (req, res, next) {
	var vsavedata = JSON.parse(req.query.savedata);
	interval_arrMain.length = 0;
	var addSql = 'INSERT INTO cameraxy(camearid,textx,texty,canvaswidth,canvasheight) VALUES(?,?,?,?,?)';
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		for (i = 0; i < vsavedata.length; i++) {
			var vhas = false;
			for (selecount = 0; selecount < interval_arrMain.length; selecount++) {
				if (interval_arrMain[selecount].id == vsavedata[i].id) {
					vhas = true;
				}
			}
			if (!vhas) {
				Build_interval_array(vsavedata[i].id);
				var addSqlParams = [vsavedata[i].id, vsavedata[i].textx, vsavedata[i].texty, vsavedata[i].canvaswidth, vsavedata[i].canvasheight];
				connection.query(addSql, addSqlParams, function (err, rows) {
					if (err) {
						console.log('[SELECT ERROR] - ', err.message);
						return;
					}
				});
			}
		}
		res.send('ok');
		connection.end();
	});
});

router.get('/deletesectorcam', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('delete from sectorcam where sectorid = "' + req.query.sectorid + '"', function (err, rows) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}

			res.send('ok');

			connection.end();
		});
	});
});

router.get('/deletesectorcamall', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
		connection.query('delete from sectorcam where sectorid IN (' + vusers + ')', function (err, rows) {
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

