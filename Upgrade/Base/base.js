'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourcebuybase = function getarrayAllresourcebuybase (arrayAllresourcebuybase) {
	database.query("SELECT * FROM `resourcebuybase`",function(error, rows){
		if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourcebuyunit ');functions.writeLogErrror(DetailError);}
		arrayAllresourcebuybase(rows);
	});
}

exports.getarrayAllresourceupbase = function getarrayAllresourceupbase (arrayAllresourceupbase) {
	database.query("SELECT * FROM `resourceupcity`",function(error, rows){
		if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourcebuyunit ');functions.writeLogErrror(DetailError);}
		arrayAllresourceupbase(rows);
	});
}