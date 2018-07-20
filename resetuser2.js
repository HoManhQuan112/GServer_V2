'use strict';
var pool = require('./db');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var functions 	= require("./functions");
var d,createPositionTimelast,DetailError;


module.exports = {
    start: function(io) 
    {      	
		cron.schedule('*/1 * * * * *',function()
		{				
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);	
	    	//reset all user khi server bảo trì	
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailBool = 1",function(error, rows,field)
			{
				if (!!error){DetailError = ('resetuser: Error in the query 1');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{		
						console.log("Reset user");	
						var GameServer = require("./login2");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;								
	  					for (var k = 0; k < gameServer.clients.length; k++) 
						{											
		  					io.in(gameServer.clients[k].idSocket).emit('R_RESET_SERVER',
							{
								arrayResetServer: 1,
								DetailTime : parseFloat(rows[0].DetailTime),
								DetailTimeBlock : 0,
		                	});				                														  									  								                					  				
						}		
						// var query = pool.query("UPDATE task SET CheckSend = 1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						// {if(!!error){DetailError = ('resetuser: Error in the query 2');
						// 	console.log(DetailError);
						// 	functions.writeLogErrror(DetailError);	
						// }});              												  															  								                														  							  							  					 
					}
				}
			})

			//check time reset				
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime >0 AND DetailBool = 1",function(error, rows,field)
			{
				if (!!error)
				{DetailError = ('resetuser: Error in the query 3');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{					
					if (rows.length>0) 
					{	
	                	var query = pool.query("UPDATE task SET DetailTime = DetailTime-1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{
							if(!!error){DetailError = ('resetuser: Error in the query 4');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						});													  															  								                														  							  			
				  					 
					}else
					{						
						var query = pool.query("UPDATE task SET DetailBool =0 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{
							if(!!error){DetailError = ('resetuser: Error in the query 5');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}

						});	 	
					}			

				}
			}) 	

			//Kiểm tra user bị block trong một khoảng thời gian
			var query = pool.query("SELECT * FROM `users` WHERE DetailTimeBlock > 0",function(error, rows,field)
			{
				if (!!error){DetailError = ('resetuser: Error in the query 3');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{
						console.log("Block user in period: "+ parseFloat(rows[0].DetailTimeBlock)+"_"+parseFloat(createPositionTimelast));	
						var GameServer = require("./login2");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;					    
					   	for (var i = 0; i < rows.length; i++) 
					   	{	
					   		if ((lodash.filter(gameServer.clients, x => x.name ===rows[i].UserName)).length >0) 
						    {
						        io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name ===rows[0].UserName)].idSocket).emit('R_RESET_SERVER',
						        {
						            arrayResetServer: 2,
						            DetailTime : 0,
									DetailTimeBlock : (parseFloat(rows[0].DetailTimeBlock) - parseFloat(createPositionTimelast)),
						        }); 
						    }
						 //    var query = pool.query("UPDATE users SET CheckSend = 1 where UserName = '"+rows[i].UserName+"'",function(error, result, field)
							// {if(!!error){DetailError = ('resetuser: Error in the query 4');
							// 	console.log(DetailError);
							// 	functions.writeLogErrror(DetailError);	
							// }}); 			   		
					   	}				    						             												  															  								                														  							  							  					 
					}
				}
			})

			//Kiểm tra user bị block vĩnh viễn
			var query = pool.query("SELECT UserName FROM `users` WHERE CheckBLockForever = 1 ",function(error, rows,field)
			{
				if (!!error){DetailError = ('resetuser: Error in the query 3');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{	

						console.log("Block user in forever");	
						var GameServer = require("./login2");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;					    
					   	for (var i = 0; i < rows.length; i++) 
					   	{	
					   		if ((lodash.filter(gameServer.clients, x => x.name ===rows[i].UserName)).length >0) 
						    {
						        io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name ===rows[0].UserName)].idSocket).emit('R_RESET_SERVER',
						        {
						            arrayResetServer:4,		
						            DetailTime : 0,
									DetailTimeBlock : 0,				            
						        }); 
						    }	
						 //    var query = pool.query("UPDATE users SET CheckSend = 1 where UserName = '"+rows[i].UserName+"'",function(error, result, field)
							// {if(!!error){DetailError = ('resetuser: Error in the query 4');
							// 	console.log(DetailError);
							// 	functions.writeLogErrror(DetailError);	
							// }});					   			   		
					   	}				    						             												  															  								                														  							  							  					 
					}
				}
			})		
		});
    }
}
 