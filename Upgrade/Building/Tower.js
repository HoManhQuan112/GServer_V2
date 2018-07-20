'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupTower = function getarrayAllresourceupTower (arrayAllresourceupTower) {
  database.query("SELECT * FROM `resourceupTower`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupTower ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupTower(rows);
  });
}