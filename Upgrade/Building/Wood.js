'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupWood = function getarrayAllresourceupWood (arrayAllresourceupWood) {
  database.query("SELECT * FROM `resourceupwood`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupWood ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupWood(rows);
  });
}