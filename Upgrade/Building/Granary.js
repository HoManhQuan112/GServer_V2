'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupGranary = function getarrayAllresourceupGranary (arrayAllresourceupGranary) {
  database.query("SELECT * FROM `resourceupgranary`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupGranary ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupGranary(rows);
  });
}