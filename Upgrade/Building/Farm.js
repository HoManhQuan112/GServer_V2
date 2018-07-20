'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupFarm = function getarrayAllresourceupFarm (arrayAllresourceupFarm) {
  database.query("SELECT * FROM `resourceupfarm`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupSwordman ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupFarm(rows);
  });
}