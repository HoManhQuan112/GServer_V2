'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupStone = function getarrayAllresourceupStone (arrayAllresourceupStone) {
  database.query("SELECT * FROM `resourceupstone`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupStone ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupStone(rows);
  });
}