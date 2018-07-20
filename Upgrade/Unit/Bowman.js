'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupBowman = function getarrayAllresourceupBowman (arrayAllresourceupBowman) {
  database.query("SELECT * FROM `resourceupBowman`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupBowman ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupBowman(rows);
  });
}