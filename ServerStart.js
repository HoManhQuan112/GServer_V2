'use strict';


var resetMine 			= require('./ResetMine/resetMine.js'); 
var redisData 			= require('./StartServer/RedisData.js');
var dictionaryOff		= require('./StartServer/DictionaryOffline.js');
var getRedisOffline 	= require('./StartServer/GetRedisOffline/GetRedisOffline.js');

// var extend 			= require('extend');
// var database 		= require('./db');

// var functions 		= require("./Util/functions");
// var lodash		    = require('lodash');
// var cron 			= require('node-cron');
// var promise 			= require('promise');
// var async 			= require("async");



var dataSelect = {fighting:0,offline:1,test:2,offl:3};

exports.start = function start (io) {
	//var currentTime = Math.floor(new Date().getTime()/1000);
	resetMine.start(io);
	function_offlinePos_ok ();
}

// module.exports = {
// 	start: function(io) {
// 		resetMine.start(io);

// 		//function_offlinePos_ok();	
// 	}
// }

function function_offlinePos_ok () {
	redisData.ClearData(dataSelect.test);
	
	//testFunc();

	//redisData.RemoveCheckValue(dataSelect.test,322);
	//redisData.AddOffline(dataSelect.test,"144,-150",520,1);
}

function testFunc () {
	var arrayFun=[{'160,-131':1522832196},
	{'161,-131':1522832204}]
	console.log(arrayFun);
	console.log(arrayFun.length);
	for (var i = 0; i < arrayFun.length; i++) {		
		redisData.SetData(dataSelect.offl,Object.keys(arrayFun[i])[0],Object.values(arrayFun[i])[0]);
		
	}
}