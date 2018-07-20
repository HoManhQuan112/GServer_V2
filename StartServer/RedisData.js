'use strict';
var redisDt				= require('./RedisData');
//var database 			= require('./../Util/db.js');
var redis 				= require('./../Util/redis.js');
var dictionaryOff		= require('./../StartServer/DictionaryOffline.js');
var async          		= require('async');

var dataSelect = {fighting:0,offline:1,test:2};
var specialSymbol = "/";
module.exports = exports;

exports.SelectData = function SelectData (dataNumber) {
	redis.select(dataNumber);
}

exports.ClearData = function ClearData (dataNumber) {
	redis.select(dataNumber);
	redis.flushdb();
}

exports.GetAllKey = function GetAllKey (dataNumber,callback) {
	redis.select(dataNumber);
	redis.KEYS("*",function (err,reply) {		
		callback(reply);
	});
}

exports.SetData = function SetData (dataNumber,key,value) {
	redis.select(dataNumber);
	redis.set(key,value);
}


module.exports.SetDataFromJson = function SetDataFromJson (dataNumber,JsonObject) {
	redis.select(dataNumber);
	redis.flushdb();	
	var objSize = Object.keys(JsonObject).length;
	for (var key in JsonObject) {
		redis.set(key,JsonObject[key]);		
	}//redis.quit();
}

exports.SetDataFromJsonCheckDup = function SetDataFromJsonCheckDup (dataNumber,JsonObject) {
	var size = Object.keys(JsonObject).length;
	for (var i = 0; i < size; i++) {	
		var keyJson = Object.keys(JsonObject)[i];

		redis.get(keyJson,function (err,valueRedis){
			//console.log(keyJson);
			if (valueRedis===null) {
				redis.set(keyJson,JsonObject[keyJson])
			}
			else{
				var arrayVal = valueRedis.split(specialSymbol);
				//console.log("arrayVal:_"+arrayVal);
				//console.log("valueRedis:_"+valueRedis);
			}
		});		
	}
}


exports.GetAllData = function GetAllData (dataNumber,callReturn) {
	var returnDict = {};
	redis.select(dataNumber);
	redis.keys('*', function(err, keys) {
		async.each(keys, function(key, callback) {
			redis.get(key, function(err, value) {
				returnDict[key] = value;
				callback(err);
			});
		}, function() {
			callReturn(returnDict);	// callReturn(JSON.stringify(returnDict));
		});
	});
}

exports.RemoveKey = function RemoveKey (dataNumber,key) {
	redis.select(dataNumber);
	redis.del(key);
}

exports.RemoveCheckKey = function RemoveCheckKey (dataNumber,key) {
	redis.select(dataNumber);
	redis.get(key,function (err,reply) {
		(reply==="")?redis.del(key):console.log(key+" isn't empty");		
	});	
}

exports.RemoveCheckValue = function RemoveCheckValue (dataNumber,idUnit) {
	this.GetAllData(dataNumber,function (GetAllDataDict) {	
		dictionaryOff.removeValue(324,GetAllDataDict);
		redisDt.SetDataFromJson(dataSelect.test,GetAllDataDict);
	});
}

exports.AddOffline = function AddOffline (dataRedis,unitPosition,idUnit,unitRange) {
	////console.log("{0},{1},{2},{3}",dataRedis,unitPosition,idUnit,unitRange);
	this.GetAllData(dataRedis,function (addDict) {
		////console.log(addDict);
		dictionaryOff.offlineDict = addDict;
		////console.log(dictionaryOff.offlineDict);
		dictionaryOff.addValueF(unitPosition,idUnit,unitRange, function (addDictRet) {
			//console.log(addDictRet);
			redisDt.ClearData(dataRedis);
			for (var i = 0; i < Object.keys(addDictRet).length; i++) {
				var key = Object.keys(addDictRet)[i];
				addValueRedis(Object.keys(addDictRet)[i],addDictRet[key]);
			}
		});		
		// //console.log(dictionaryOff.offlineDict);
		// redisDt.ClearData(dataRedis);
		// for (var i = 0; i < Object.keys(dictionaryOff.offlineDict).length; i++) {
		// 	var key = Object.keys(dictionaryOff.offlineDict)[i];
		// 	addValueRedis(Object.keys(dictionaryOff.offlineDict)[i],dictionaryOff.offlineDict[key]);
		// }
	});
}
// exports.AddOffline = function AddOffline (dataRedis,unitPosition,idUnit,unitRange) {
// 	this.GetAllData(dataRedis,function (addDict) {
// 		dictionaryOff.addValue(unitPosition,idUnit,unitRange);		
// 		for (var i = 0; i < Object.keys(dictionaryOff.offlineDict).length; i++) {
// 			var key = Object.keys(dictionaryOff.offlineDict)[i];
// 			addValueRedis(Object.keys(dictionaryOff.offlineDict)[i],dictionaryOff.offlineDict[key]);
// 		}
// 	});
// }

function addValueRedis (key,valueDict) {
	redis.get(key,function (err,value) {
		if(value===null){
			redis.set(key,valueDict);
		}else{
			if (checkValueRedis(value,valueDict)===false) {
				redis.set(key,value+valueDict);
			}			
		}
	});
}

function checkValueRedis (valueRedis,valueDict) {
	var arrIdUnit = valueRedis.split(specialSymbol);
	var valueD = valueDict.replace(specialSymbol, '');
	var check= false;
	for (var i = 0; i < arrIdUnit.length; i++) {
		if (arrIdUnit[i]===valueD) {
			check = true;
			break;
		}
	}
	return check;
}


/*
Redis document
https://github.com/NodeRedis/node_redis
*/
//redis.flushdb();// xóa tất cả data đang có trong bảng data đang được redis select.
/* set key & value
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    //console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        //console.log("    " + i + ": " + reply);
    });
    client.quit();
});


//redis.select(dataNumber); select Database
//quit data redis
//redis.quit();

// redis.exists(key, function(err, reply) {			
// 	//console.log(reply);	//return 0,1;
// });

//get value
// redis.get("key3",function (err,reply) {
// 	//console.log(reply);
// })


*/