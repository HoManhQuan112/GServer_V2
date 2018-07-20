'use strict';

//var lodash		    	= require('lodash');
//var math 				= require('mathjs');
var cron 				= require('node-cron');
//var sqrt 				= require( 'math-sqrt');
var datetime 			= require('node-datetime');

var database 			= require('./../Util/db.js');
var redis 				= require('./../Util/redis.js');
var functions 			= require("./../Util/functions.js");
var redisData 			= require('./../StartServer/RedisData.js');


var dataSelect = {fighting:0,offline:1,test:2};
var disconnectedUser=[];

module.exports = {
	start: function (io) {
		io.on('connection', function(socket) {
			S_DISCONNECTED(io,socket);
		});
	}
}

function S_DISCONNECTED (io,socket) {
	socket.on('S_DISCONNECTED', function (data){		
		var currentTime =  Math.floor(new Date().getTime() / 1000);
		disconnectedUser = getCurrentDisconnect(data);

		console.log("disconnectedUser:_"+disconnectedUser.UserName+"_socket_"+disconnectedUser.idSocket);

		updateUserToOffline(disconnectedUser,io);
		viewGuildMsg(disconnectedUser,currentTime);
		viewPrivateMsg (disconnectedUser);
		updateTime (disconnectedUser,currentTime)
		updateMoveOffline (disconnectedUser,currentTime);
		updateGuild (disconnectedUser,io);
		addRedisData (disconnectedUser);
	});
}

//add redis data with unit not move
function addRedisData (disconnectedUser) {
	database.query("SELECT `idUnitInLocations` ,`TimeMoveComplete`, `Position` FROM `unitinlocations` WHERE `UserName` = '"+disconnectedUser.UserName+"' AND TimeMoveComplete = 0",function(error,rows){
		if (!!error){DetailError = ('disconected.js: Error addRedisData');functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			for (var i = 0; i < rows.length; i++) {
				redisData.AddOffline(dataSelect.test,rows[i].Position, rows[i].idUnitInLocations,1);
			}
		}
	});

}
//update User to Offline
function updateUserToOffline (disconnectedUser,io) {
	var stringQuery = "UPDATE unitinlocations SET CheckOnline = 0 WHERE UserName = '"+disconnectedUser.UserName+"'";
	database.query(stringQuery,function(error){
		if (!!error) {DetailError=('disconnected.js: Error updateUserToOffline');functions.writeLogErrror(DetailError);}			
	});	
	R_STATUS_FOR_ALL (disconnectedUser,io);
}
function R_STATUS_FOR_ALL (disconnectedUser,io) {
	var stringQuery = "SELECT idUnitInLocations FROM `unitinlocations` WHERE `UserName` = '"+disconnectedUser.UserName+"'";
	database.query(stringQuery,function(error,rows){
		if (!!error){DetailError = ('disconected.js: Error sendOfflineStatus');functions.writeLogErrror(DetailError);}
		else{
			var arrayUnitLocationsComplete = rows;
			io.emit('R_STATUS_FOR_ALL',{
				Status : 0,	
				UserName : disconnectedUser.UserName,	
				idUnitInLocations: arrayUnitLocationsComplete,
			});
		}
	});
}
//tính toán di chuyển Offline
function updateMoveOffline (disconnectedUser,currentTime) {	
	var stringQuery = "SELECT `idUnitInLocations`,`Position`,`PositionClick`,`TimeMoveComplete`,`TimeCheck`,`TimeClick`, `TimeMoveTotalComplete` FROM `unitinlocations`"
	+" WHERE TimeMoveComplete > 0 AND UserName = '"+disconnectedUser.UserName+"'";	
	database.query(stringQuery,function (error,rows) {
		if (!!error) {DetailError=('disconnected.js: Error queryUserDisconnect');functions.writeLogErrror(DetailError);}		
		if (rows.length>0) {
			updateTimeMoveComplete(rows,currentTime);
			getMoveOfflinePos(rows,currentTime);
		}
	});
}

function getMoveOfflinePos (results,currentTime) {
	var APosition, BPosition, A,A1,A2,B,B1,B2,XB,ZB,XL,ZL;
	var timeGetDetail;
	
	for (var i = 0; i < results.length; i++) {
		APosition = results[i].Position;
		A = APosition.split(",");
		A1 = parseFloat(A[0]);
		A2 = parseFloat(A[1]);
		BPosition = results[i].PositionClick;
		B = BPosition.split(",");
		B1 = parseFloat(B[0]);
		B2 = parseFloat(B[1]);

		var arrayDistanceMove=[];
		for (var k = 1; k <= results[i].TimeMoveComplete; k++) {
			XB= parseInt(A1+((k-1)*(B1-A1))/parseFloat(results[i].TimeMoveComplete),10);
			ZB= parseInt(A2+((k-1)*(B2-A2))/parseFloat(results[i].TimeMoveComplete),10);
			XL= parseInt(A1+((k)*(B1-A1))/parseFloat(results[i].TimeMoveComplete),10);
			ZL= parseInt(A2+((k)*(B2-A2))/parseFloat(results[i].TimeMoveComplete),10);
			
			if ((XB!==XL)||(ZB!==ZL)) {
				timeGetDetail = k+currentTime;
				arrayDistanceMove.push(XL+","+ZL+"\:"+timeGetDetail);
			}
		}		
		var objMoveTime = JSON.parse(JSON.stringify((arrayDistanceMove)));
		calcOffline(objMoveTime,results[i].idUnitInLocations,currentTime);
	}
}
function calcOffline (objMove,idUnitInLocations) {
	//console.log("idUnitInLocations: "+idUnitInLocations);
	var sizeObj = Object.keys(objMove).length;
	//console.log(sizeObj);
	var timeStack=[];
	for (var i = 0; i < sizeObj; i++) {
		timeStack.push(objMove[i]);
	}
	var timeNextArr = timeStack.shift().split("\:");
	//console.log("idUnitInLocations: "+idUnitInLocations+"_timeNextArr[1]_"+timeNextArr[1]);
	database.query(updateTimeMoveNext(timeNextArr[1],idUnitInLocations),function (error) {
		if (!!error) {DetailError = ('disconnected2: Error query updateTimeMoveNext');functions.writeLogErrror(DetailError);}
	});

	var task = cron.schedule('*/1 * * * * *',function(){	
		var currentTimeF=  Math.floor(new Date().getTime() / 1000);
		//console.log("currentTime: "+currentTimeF);
		database.query("SELECT `TimeMoveNext`,`FarmPortable`,`Quality` FROM `unitinlocations` WHERE `idUnitInLocations`= '"+idUnitInLocations+"'",function (error,value) {
			if (value[0].TimeMoveNext!==0&&(value[0].FarmPortable > value[0].Quality)) {
				if (parseInt(currentTimeF)<parseInt(timeNextArr[1])) {
					//console.log(timeNextArr[1]);
				}
				else if (parseInt(currentTimeF)===parseInt(timeNextArr[1]))
				{			
					if (timeStack.length>0) {
						timeNextArr = timeStack.shift().split("\:");
						database.query(updateTimeMoveNext(timeNextArr[1],idUnitInLocations),function (error) {
							if (!!error) {DetailError = ('disconnected: Error updateTimeMoveNext');functions.writeLogErrror(DetailError);}
						});	
					}else{

						database.query(updateTimeMoveNext (0,idUnitInLocations),function (error) {
							if (!!error) {DetailError = ('disconnected: Error updateTimeMoveNext');functions.writeLogErrror(DetailError);}
						});
						task.stop();
					}
				}
			}
			else{
				task.stop();
			}
		});		
	});
}
function updateTimeMoveNext (TimeMoveNext,idUnitInLocations) {
	return "UPDATE unitinlocations SET TimeMoveNext = '"+ TimeMoveNext +"' WHERE idUnitInLocations = "+idUnitInLocations;
}
function updateTimeMoveComplete (rows,currentTime) {

	var timeMoveLogout = 0;
	for (var i = 0; i < rows.length; i++) {
		if (parseFloat(rows[i].TimeCheck) - parseFloat(currentTime)>0) {
			timeMoveLogout = (parseFloat(rows[i].TimeCheck)-parseFloat(currentTime));
		}else{
			timeMoveLogout = 0;
		}

		updateTMoveComplete (timeMoveLogout,currentTime,rows[i]);
	}

}

function updateTMoveComplete (timeMoveLogout,currentTime,row) {
	var stringQuery = "UPDATE unitinlocations SET TimeMoveComplete = '"
	+parseFloat(timeMoveLogout)+"',TimeCheck = '"+(parseFloat(currentTime) + parseFloat(timeMoveLogout))
	+"',TimeClick = '"+parseFloat(currentTime)+"' WHERE idUnitInLocations = '"+row.idUnitInLocations+"'";

	database.query(stringQuery,function (error) {
		if (!!error) {DetailError=('disconnected: Error queryUpdateTimeMoveComplete');functions.writeLogErrror(DetailError);}
	});

}

//cập nhật Guild
function updateGuild (disconnectedUser,socket) {
	database.query("UPDATE guildlistmember SET Status = 0 WHERE MemberName = '"+disconnectedUser.UserName+"'",function(error){
		if(!!error){DetailError = ('disconected.js: Error updateGuild');functions.writeLogErrror(DetailError);}
	});
	database.query(updateListGuildMem (disconnectedUser),function(error){
		if(!!error){DetailError = ('disconected.js: Error updateListGuildMem');functions.writeLogErrror(DetailError);}		
	});
	R_STATUS(disconnectedUser,socket);	
}
function R_STATUS (disconnectedUser,io) {
	database.query("SELECT B.MemberName FROM users AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE A.UserName ='"+disconnectedUser.UserName+"'",function(error, rows){
		if(!!error){DetailError = ('disconected.js: Error R_STATUS');functions.writeLogErrror(DetailError);}
		io.emit('R_STATUS',{
			Status : 0,
			TimeDetail : datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
			UserName : disconnectedUser.UserName,
		});
	});
}
function updateListGuildMem (disconnectedUser) {
	return "UPDATE guildlistmember SET Status = 0, TimeDetail = '"+datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' WHERE MemberName = '"+disconnectedUser.UserName+"'";
}
//cập nhật thời gian
function updateTime (disconnectedUser,currentTime) {
	database.query(updateTimeUser(disconnectedUser,currentTime),function(error){
		if(!!error){DetailError = ('disconected.js: Error updateTimeUser');functions.writeLogErrror(DetailError);}
	});
}
function updateTimeUser (disconnectedUser,currentTime) {
	return "UPDATE users SET timeLogin = 0,idSocket=0,timeLogout = '"+currentTime+"',timeResetMine = 0 WHERE UserName ='"+disconnectedUser.UserName+"'";
}
//cập nhật không xem tin nhắn private
function viewPrivateMsg (disconnectedUser) {
	var queryString ="UPDATE users SET CheckCloseMessPrivateUser = 1 where UserName = '"+disconnectedUser.UserName+"' AND CheckCloseMessPrivateUser = 0";

	database.query(queryString,function(error){
		if(!!error){DetailError = ('disconected2.js: Error updateViewPrivateMsg');functions.writeLogErrror(DetailError);}
	});
}

//cập nhật không xem tin nhắn guild
function viewGuildMsg (disconnectedUser,currentTime) {	
	database.query(updateViewGuildMsg(disconnectedUser),function (error) {
		if(!!error){DetailError = ('disconected.js: Error updateViewGuildMsg');functions.writeLogErrror(DetailError);}	
	});	
}
function updateViewGuildMsg (disconnectedUser,currentTime) {
	return  "UPDATE users SET TimeCancelGuild = '"+parseFloat(currentTime)+"' where UserName = '"+disconnectedUser.UserName+"' AND CheckCloseMessGuild = 0";
}
//getCurrentDisconnectData
function getCurrentDisconnect(data)
{
	return disconnectedUser = {
		UserName:data.UserName,						
		idSocket:data.idSocket,															
	}
}

