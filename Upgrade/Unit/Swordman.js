'use strict';
var database            = require('./../../Util/db.js');
var functions           = require('./../../Util/functions.js');

var lodash              = require('lodash');
var DetailError;

exports.getarrayAllresourceupSwordman = function getarrayAllresourceupSwordman (arrayAllresourceupSwordman) {
  database.query("SELECT * FROM `resourceupswordman`",function(error, rows){
    if (!!error){DetailError =('upgrade :Error SELECT getarrayAllresourceupSwordman ');functions.writeLogErrror(DetailError);}
    arrayAllresourceupSwordman(rows);
  });
}
