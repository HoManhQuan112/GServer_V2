'use strict';
var mysql = require('mysql');
var functions   = require("./functions");

var pool    =    mysql.createPool({
//var pool    =    mysql.createConnection({
      connectionLimit   :   100,
      host              :   'localhost',
      user              :   'gamevae',
      password          :   'GWgUi2]&]aa',
      database          :   'gamevae',
      debug             :   false,
      multipleStatements: true,
      charset     :   'utf8_unicode_ci'

});
pool.on('connection', function(connection) {
   //console.log('Connection established');
    // Below never get called
    connection.on('error', function(err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function(err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

module.exports = pool;