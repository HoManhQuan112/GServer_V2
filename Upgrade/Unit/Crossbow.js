'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupCrossbow = function getarrayAllresourceupCrossbow (arrayAllresourceupCrossbow) {
  database.query("SELECT * FROM `resourceupCrossbow`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupCrossbow ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupCrossbow(rows);
  });
}
