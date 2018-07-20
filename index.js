'use strict';
var express			= require('express');
var app				= express();
var server			= require('http').createServer(app);
var io 				= require('socket.io').listen(server);

var database 		= require('./Util/db.js');
var functions       = require('./Util/functions.js');

// io.sockets.setMaxListeners(100);
io.sockets.setMaxListeners(0);
// var mysql           = require("mysql");
// var Chance  		= require('chance');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// var cron 			= require('node-cron');
// var CronJob 		= require('cron').CronJob;
// var sortBy 			= require('sort-by');
// var lodash		    = require('lodash');
// var Promise 		= require('promise');
// var sqrt 			= require( 'math-sqrt' );
// var math 			= require('mathjs');
var datetime 		= require('node-datetime');
// var crypto 			= require('crypto');
// var async 			= require("async");

// var threads 		= require('threads');
// var thread  		= spawn(function() {});
// var spawn   		= threads.spawn;

// const fs   			= require('fs');
//var util 			= require('util'); 

// var functions	 	= require("./functions");
// var client 			= require('./redis');//lấy dữ liệu client

//setup database
//var pool 			= require('./db');
exports.ioT = io;

exports.socketEmit = function socketEmit (userName, event, dataValue) {
	var stringQuery = "SELECT `idSocket` FROM `users` WHERE `UserName`='"+userName+"'";
	database.query(stringQuery,function (error,rows) {
		if (!!error){DetailError =('login :Error socketEmit '+event+"_name:_"+userName);functions.writeLogErrror(DetailError);}
		if (rows.length>0 && rows[0].idSocket.toString()!=="0") {
			console.log('socketEmit: '+event);
			console.log(dataValue);
			io.to(rows[0].idSocket).emit(event,dataValue);
		}
	})
}
exports.socketEmitAnother = function socketEmitAnother (userName, event, dataValue) {
	var stringQuery ="SELECT `UserName`,`idSocket` FROM `users` WHERE NOT `UserName`='"+userName+"' AND NOT `idSocket`='0' AND NOT `idSocket`=''"; 
	// console.log(stringQuery);	
	database.query(stringQuery,function (error,rows) {
		console.log(rows);		
		if (!!error){DetailError =('login :Error socketEmitAnother '+event+"_name:_"+userName);functions.writeLogErrror(DetailError);}
		console.log('socketEmitAnother: '+event);
		console.log(dataValue);	
		if (rows.length>0) {
			for (var i = 0; i < rows.length; i++) {					
				io.to(rows[i].idSocket).emit(event,dataValue);
			}
		}
	})
}
exports.socketEmitAll = function socketEmitAll (event, dataValue) {
	var stringQuery ="SELECT `idSocket` FROM `users` WHERE NOT `idSocket`='0' AND NOT `idSocket`=''"; 
	database.query(stringQuery,function (error,rows) {
		if (!!error){DetailError =('login :Error socketEmitAll '+event);functions.writeLogErrror(DetailError);}
		console.log('socketEmitAll: '+event);
		console.log(dataValue);
		if (rows.length>0) {
			for (var i = 0; i < rows.length; i++) {				
				io.to(rows[i].idSocket).emit(event,dataValue);
			}
		}
	});
}
//đăng kí user mới
var register 		= require('./Login/Register/register.js');
register.start(io);

//mua lính trong thành
// var unitinbase		= require('./unitinbase');
var unitInBase		= require('./UnitInBase/unitInBase.js');
unitInBase.start(io);
//thu hoạch tài nguyên
//var harvest 		= require('./harvest');

//mua user base
var userbase 		= require('./userbase');
userbase.start(io);

//đồng bộ di chuyển
var sync 	 		= require('./sync');
sync.start(io);

//đăng nhập
//var login 	 		= require('./login');
//login.start(io);


app.set('port', process.env.PORT);
server.listen(process.env.PORT);

if (app.get('port') === process.env.PORT)
{	
	io.on('connection', function (socket)
	{				
		//gửi socket cho mua unit in base 	
		

		//gửi socket cho thu hoạch
		//harvest(socket);

		//gửi socket cho unit in location
		//unitinlocation(socket);

		//gửi socket cho trao đổi unit in location
		//unitinlocationshare(socket);

		// socket.on('disconnect', function () {
		// 	disconnectedFunc();
		// });
	});

	

	// if (app.get('port') === "8080")
	// {		
	// 	//kiểm tra kết nối
	// 	var userconnected   = require('./userconnected'); 
	// 	userconnected.start(io); 	

	// 	//đăng nhập
	// 	var login 	 		= require('./login');
	// 	login.start(io);

	// 	//thoát
	// 	var disconnected	= require('./disconnected');
	// 	disconnected.start(io);

	// 	//danh sách đen
	// 	var blacklist 		= require('./blacklist');
	// 	blacklist.start(io);

	// 	//đánh nhau online 
	// 	//var onlinefighting 	= require('./onlinefighting'); 
	// 	//	onlinefighting.start(io);

	// 	//reset mine: luu y khong de chung
	// 	//var resetmine 		= require('./resetmine');
	// 	//resetmine.start(io);

	// 	//di chuyển
	// 	//var move 	 		= require('./move');
	// 		//move.start(io);

	// 	//hồi phục máu
	// 	// var healthrecover 	= require('./healthrecover');
	// 	// 	healthrecover.start(io);	

	// 	//quản lý guild
	// 	//var guildmanager	= require('./guildmanager');
	// 		//guildmanager.start(io);

	// 	//Trao đổi tài nguyên
	// 	//var resourcetransfer = require('./resourcetransfer');
	// 	//	resourcetransfer.start(io);

	// 	//thực hiện chức năng kết bạn
	// 	//var addfriend 		= require('./addfriend');	
	// 		//addfriend.start(io);

	// 	//gửi unitinlocation
	// 	var unitinlocation   =require('./unitinlocation');	
	// 	unitinlocation.start(io);

	// 	//nhận và gửi dữ liệu chat
	// 	//var chatting 		= require('./chatting');
	// 	//	chatting.start(io);

	// 	//reset user khi server cập nhât
	// 	//var resetuser 		= require('./resetuser');
	// 	//	resetuser.start(io);

	// 	//lấy lại mật khẩu
	// 	var recoverpass     = require('./recoverpass');
	// 	recoverpass.start(io);	 

	// 	//nâng cấp tài nguyên và lính
	// 	var upgrade			= require('./upgrade');
	// 	upgrade.start(io);	

	// 	//trao đổi unitinlocation
	// 	var unitinlocationshare = require('./unitinlocationshare'); 	  
	// 	unitinlocationshare.start(io);

	// }

	if (app.get('port') === "9090")
	{			
		var serverReset   = require('./Login/Login/serverReset.js');  
		serverReset.start(io);	

		//đăng nhập
		var login 	 		= require('./Login/Login/login.js');
		login.start(io);
		// var login2 	 		= require('./login2');
		// login2.start(io);

		//nâng cấp tài nguyên và lính
		var upgrade			= require('./Upgrade/upgrade.js');
		upgrade.start(io);
		
		//thoát	
		var disconnected	= require('./Disconnect/disconnected.js');
		disconnected.start(io);

		//đánh nhau online 
		var onlinefighting2 	= require('./onlinefighting2'); 
		onlinefighting2.start(io);
		
		//đánh nhau offline
		// var offlineFighting = require('./Map/offlineFighting');
		// offlineFighting.start(io);

		// //reset mine
		// var resetmine 		= require('./ResetMine/resetMine.js');
		// resetmine.start(io)
		// var resetmine2 		= require('./resetmine2');
		// resetmine2.start(io);  

		//di chuyển
		var move 	 		= require('./Move/move.js');
		move.start(io);
		// var move2 	 		= require('./move2');
		// move2.start(io);

		//hồi phục máu
		var healthrecover2 	= require('./healthrecover2');
		healthrecover2.start(io);

		//quản lý guild
		var guildManager	= require('./GuildManager/guildManager.js');
		guildManager.start(io);	
		// var guildmanager2	= require('./guildmanager2');
		// guildmanager2.start(io);		

		//thực hiện chức năng kết bạn
		var addFriend 		= require('./Map/addFriend');	
		addFriend.start(io);		

		//reset user khi server cập nhât
		var resetuser2 		= require('./resetuser2');
		resetuser2.start(io);

		//lấy lại mật khẩu
		var recoverpass     = require('./recoverpass');
		recoverpass.start(io);

		//Thu hoạch
		var harvest 		= require('./Harvest/harvest.js');
		harvest.start(io);	 	
		// var harvest2 		= require('./harvest2');
		// harvest2.start(io);	 	

		var resourceTransfer = require('./ResourceTransfer/resourceTransfer.js');
		resourceTransfer.start(io);

		//gửi unitinlocation
		var unitInLocation   =require('./UnitInLocation/unitInLocation.js');	
		unitInLocation.start(io);	

		//trao đổi unitinlocation
		// var unitinlocationshare2 = require('./unitinlocationshare2'); 	  
		// unitinlocationshare2.start(io);	

		//nhận và gửi dữ liệu chat
		var chatting		= require('./Chat/chatting.js');
		chatting.start(io);	
		// var chatting2 		= require('./chatting2');
		// chatting2.start(io);	

		//kiểm tra lỗi string
		var checkerror 		= require('./checkerror');
		checkerror.start(io);	

		//danh sách đen
		var blackList 		= require('./BlackList/blackList.js');
		blackList.start(io);
		// var blacklist2 		= require('./blacklist2');
		// blacklist2.start(io);
		
	}	

	server.listen(app.get(process.env.PORT), function ()
	{
		console.log(process.env.PORT);		
		console.log("thời gian hien tại: "+datetime.create().format('H:M:S d-m-Y')+" "+ new Date().toString().slice(25, 33));	
		
		var serverStart = require('./ServerStart');//Start Server
		serverStart.start(io);   

	});
}

function disconnectedFunc () {
	console.log("thời gian disconnected: "+datetime.create().format('H:M:S d-m-Y')+" "+ new Date().toString().slice(25, 33));
}

