'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllResourceToDiamond = function getarrayAllResourceToDiamond (arrayAllResourceToDiamond) {
  database.query("SELECT * FROM `resourcetodiamond`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT arrayAllResourceToDiamond ');functions.writeLogErrror(DetailError);}
    arrayAllResourceToDiamond(rows);
  });
}

exports.getarrayAllresourceupMarket = function getarrayAllresourceupMarket (arrayAllresourceupMarket) {
  database.query("SELECT * FROM `resourceupswordman`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupMarket');functions.writeLogErrror(DetailError);}
    arrayAllresourceupMarket(rows);
  });
}