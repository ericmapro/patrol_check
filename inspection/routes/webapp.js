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

var host_ip = vconfig.host_ip;
var socket_port = vconfig.socket_port;
var host_port = vconfig.host_port;

router.post('/savebackimg', function (req, res, next) {
    var addSql = 'INSERT INTO picsrctable (picsrc) VALUES(?)';
    var addSqlParams = [req.body.savedata];
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('delete FROM picsrctable', function (err, rows) {
            connection.query(addSql, addSqlParams, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }

                res.send('ok');

                connection.end();
            });
        });
    });
});

router.post('/savelogo', function (req, res, next) {
    var addSql = 'INSERT INTO piclogo (picsrc) VALUES(?)';
    var addSqlParams = [req.body.savedata];
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('delete FROM piclogo', function (err, rows) {
            connection.query(addSql, addSqlParams, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }

                res.send('ok');

                connection.end();
            });
        });
    });
});

router.get('/savepoc', function (req, res, next) {
    var addSql = 'INSERT INTO poclist (pocname) VALUES(?)';
    var addSqlParams = [req.query.pocname];
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('delete FROM poclist', function (err, rows) {
            connection.query(addSql, addSqlParams, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }

                res.send('ok');

                connection.end();
            });
        });
    });
});

router.get('/selectpic', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('SELECT * FROM picsrctable', function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            res.send(rows);

            connection.end();
        });
    });
});

router.get('/selectlogo', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('SELECT * FROM piclogo', function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            res.send(rows);

            connection.end();
        });
    });
});

router.get('/selectpoc', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
			console.log('[SELECT ERROR] - ', err.message); 
			return;
		}
        connection.query('SELECT * FROM poclist', function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            res.send(rows);

            connection.end();
        });
    });
});

router.get('/socketport', function (req, res, next) {
    var vsocket_port = socket_port;
    res.send('' + vsocket_port);
});

var net = require("net");
var client = new net.Socket();
var vconnectedmark = '0';

router.get('/initconnect', function (req, res, next) {
    console.log("vconnectedmark ----- ", vconnectedmark);
    if (vconnectedmark == '0') {
        client.connect(host_port, host_ip, function () {
            vconnectedmark = '1';
            console.log("connected");
        });

        client.on("error", function (data) {
            vconnectedmark = '0';
            console.log('Error ' + data);
        });

        client.on("data", function (data) {
            io.emit('message', data.toString("utf8"));
        });
    }
    res.send('ok');
});

router.get('/savedb', function (req, res, next) {
    var vsavejson = req.query.savejson;
    var buffer = new Buffer(JSON.stringify(vsavejson), "utf8");
    client.write(buffer);
    res.send('ok');
});

router.get('/updatedb', function (req, res, next) {
    var vsavejson = req.query.savejson;
    var buffer = new Buffer(JSON.stringify(vsavejson), "utf8");
    client.write(buffer);
    res.send('ok');
});

router.get('/deletedb', function (req, res, next) {
    var vsavejson = req.query.savejson;
    console.log("vsavejson-----" + vsavejson);
    console.log("JSON.stringify(vsavejson)-----" + JSON.stringify(vsavejson));
    var buffer = new Buffer(JSON.stringify(vsavejson), "utf8");
    console.log("buffer-----" + buffer);
    client.write(buffer);
    res.send('ok');
});

router.get('/deletedbal', function (req, res, next) {
    var vsavejson = req.query.savejson;
    var buffer = new Buffer(vsavejson, "utf8");
    client.write(buffer);
    res.send('ok');
});

router.get('/deletedball', function (req, res, next) {
    var vsavejson = req.query.savejson;
    var buffer = new Buffer(vsavejson, "utf8");
    client.write(buffer);
    res.send('ok');
});

router.post('/deletedb1', function (req, res, next) {
    var vsavejson = req.body.savejson;
    var buffer = new Buffer(JSON.stringify(vsavejson), "utf8");
    client.write(buffer);
    res.send('ok');
});

var http = require('http').Server(express);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    socket.on('message', function (obj) {
        io.emit('message', data.toString("utf8"));
    });
})

http.listen(socket_port, function () {});

module.exports = router;

