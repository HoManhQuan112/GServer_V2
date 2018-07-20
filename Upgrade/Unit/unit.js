'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourcebuyunit = function getarrayAllresourcebuyunit (arrayAllresourcebuyunit) {
  database.query("SELECT * FROM `resourcebuyunit`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourcebuyunit ');functions.writeLogErrror(DetailError);}
    arrayAllresourcebuyunit(rows);
  });
}