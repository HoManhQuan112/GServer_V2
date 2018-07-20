'use strict';
var async         		= require('async');
var extend 				= require('extend');
var database 			= require('./../../Util/db');
var redisData 			= require('./../../StartServer/RedisData.js');
var dictionaryOff		= require('./../../StartServer/DictionaryOffline');


var dateTime;
var DetailError;
var dataSelect = {fighting:0,offline:1,test:2};

function queryUserOffline () {	return "SELECT UserName FROM users WHERE timeLogin =0";}
function queryIdUserOffline (UserName,currentStartDate) {
	var query ="SELECT idUnitInLocations , Position FROM unitinlocations WHERE UserName = '"+UserName+"' AND TimeCheck < "+currentStartDate+" OR TimeCheck = "+currentStartDate;
	return query;
}

module.exports = {
	start: function(io) {
		redisData.ClearData(dataSelect.test);
		getOfflineLoc();
	}
}

function getOfflineLoc () {
	dateTime = new Date();
	var currentStartDate = Math.floor(dateTime.getTime() / 1000);
	//console.log("currentStartDate: "+currentStartDate);
	var queryUser = database.query(queryUserOffline(),function (error,rows,filed) {		
		if(!!error){DetailError = ('Query UserName _SeverStart.js');functions.writeLogErrror(DetailError);}		
		if (rows.length>0) 
		{
			for (var i = 0; i < rows.length; i++) {
				var queryID = database.query(queryIdUserOffline (rows[i].UserName,currentStartDate),function (error,rows,filed) {					
					if(!!error){DetailError = ('Query queryID _SeverStart.js');functions.writeLogErrror(DetailError);}
					if (rows.length>0) {
						for (var i = 0; i < rows.length; i++) {
							//redisData.SetData(dataSelect.test,rows[i].Position,rows[i].idUnitInLocations);
							dictionaryOff.addValue(rows[i].Position,rows[i].idUnitInLocations,1);
						}
					}
					setRedisData();	
				});
			}
		}		
	});	
}

function setRedisData () {	
	for (var key in dictionaryOff.offlineDict) {
		redisData.SetData(dataSelect.test,key, dictionaryOff.offlineDict[key]);
	}
}