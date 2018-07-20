'use strict';
var datetime 		= require('node-datetime');


var database 		= require('./../../Util/db');
var functions 		= require("./../../Util/functions");
var DetailError;

exports.start = function start (io) {
	io.on('connection', function(socket) 
		{ 
			socket.on('S_USER_CONNECT', function ()
			{
				var GameServer = require("./login.js");
				var gameServer = new GameServer();
				exports.gameServer = gameServer;  
				

				console.log('Users Connecting... at: '+datetime.create().format('H:M:S d-m-Y'));						
				for (var i = 0; i < gameServer.redisDatas.length; i++)
				{				
					console.log('User name '+gameServer.redisDatas[i].name+"_"+gameServer.redisDatas[i].idSocket+' is connecting....');
				};
				//lấy thời gian trả về cho client
				var query = database.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime > 0",function(error, rows,field)
				{
					if (!!error)
					{
						DetailError = ('userconnected: Error in the query 1');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);
					}else
					{
						if (rows.length>0) 
						{																								
							socket.emit('R_SERVER_TIME_OUT',
							{
								arrayResetServer: 1,
								DetailTime: parseFloat(rows[0].DetailTime),
								DetailTimeBlockio: 0,
								blockLimit: 0,
								block: 0,
							});						 
						}else
						{									
							socket.emit('R_SERVER_TIME_OUT',
							{
								arrayResetServer: 0,
								DetailTime: 0,
								DetailTimeBlockio: 0,
								blockLimit: 0,
								block: 0,
							});	
						}			
					}
				})				
			});
		});
}

// module.exports = {
// 	start: function(io) 
// 	{
// 		io.on('connection', function(socket) 
// 		{ 
// 			socket.on('S_USER_CONNECT', function ()
// 			{
// 				var GameServer = require("./login.js");
// 				var gameServer = new GameServer();
// 				exports.gameServer = gameServer;  
// 				var DetailError;

// 				console.log('Users Connecting... at: '+datetime.create().format('H:M:S d-m-Y'));						
// 				for (var i = 0; i < gameServer.redisDatas.length; i++)
// 				{				
// 					console.log('User name '+gameServer.redisDatas[i].name+"_"+gameServer.redisDatas[i].idSocket+' is connecting....');
// 				};
// 				//lấy thời gian trả về cho client
// 				var query = database.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime > 0",function(error, rows,field)
// 				{
// 					if (!!error)
// 					{
// 						DetailError = ('userconnected: Error in the query 1');
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);
// 					}else
// 					{
// 						if (rows.length>0) 
// 						{																								
// 							socket.emit('R_SERVER_TIME_OUT',
// 							{
// 								arrayResetServer: 1,
// 								DetailTime: parseFloat(rows[0].DetailTime),
// 								DetailTimeBlockio: 0,
// 								blockLimit: 0,
// 								block: 0,
// 							});						 
// 						}else
// 						{									
// 							socket.emit('R_SERVER_TIME_OUT',
// 							{
// 								arrayResetServer: 0,
// 								DetailTime: 0,
// 								DetailTimeBlockio: 0,
// 								blockLimit: 0,
// 								block: 0,
// 							});	
// 						}			
// 					}
// 				})				
// 			});
// 		});
// 	}
// }