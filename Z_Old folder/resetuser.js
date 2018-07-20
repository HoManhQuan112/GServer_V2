'use strict';
var pool = require('./db');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var d,createPositionTimelast;


module.exports = {
    start: function(io) 
    {      	
		cron.schedule('*/1 * * * * *',function()
		{				
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);	
	    	//reset time all user   	
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailBool = 1 AND CheckSend = 0",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query 387');
				}else
				{
					if (rows.length>0) 
					{			
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;									
	  					for (var k = 0; k < gameServer.clients.length; k++) 
						{											
		  					io.in(gameServer.clients[k].idSocket).emit('RECEIVERESETSERVER',
							{
								arrayResetServer:1,
		                	});				                														  									  								                					  				
						}							
						var query = pool.query("UPDATE task SET CheckSend =1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{if(!!error){console.log('Error in the query 388');}});              												  															  								                														  							  							  					 
					}
				}
			})

			//check time reset				
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime >0 AND DetailBool = 1",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query 389');
				}else
				{					
					if (rows.length>0) 
					{	
	                	var query = pool.query("UPDATE task SET DetailTime = DetailTime-1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{if(!!error){console.log('Error in the query 390');}});	 												  															  								                														  							  			
				  					 
					}else
					{						
						var query = pool.query("UPDATE task SET DetailBool =0,CheckSend = 0 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{if(!!error){console.log('Error in the query 391');}});	 	
					}			

				}
			}) 			
		});
    }
}
 