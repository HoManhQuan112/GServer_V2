'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupMetal = function getarrayAllresourceupMetal (arrayAllresourceupMetal) {
  database.query("SELECT * FROM `resourceupstone`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupMetal ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupMetal(rows);
  });
}