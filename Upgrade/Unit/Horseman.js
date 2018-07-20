'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupHorseman = function getarrayAllresourceupHorseman (arrayAllresourceupHorseman) {
  database.query("SELECT * FROM `resourceupHorseman`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupHorseman ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupHorseman(rows);
  });
}
