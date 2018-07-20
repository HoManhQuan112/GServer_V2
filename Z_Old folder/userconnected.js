'use strict';
var pool = require('./db');

module.exports = function (socket) 
{ 
	
};

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        { 
        	socket.on('USER_CONNECT', function ()
			{
				var GameServer = require("./login");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;  

				console.log('Users Connected ');						
				for (var i = 0; i < gameServer.clients.length; i++)
				{				
					console.log('User name '+gameServer.clients[i].name+"_"+gameServer.clients[i].idSocket+' is connected..');
				};
				//lấy thời gian trả về cho client
				var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime > 0",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 1');
					}else
					{
						if (rows.length>0) 
						{															
										
		  					socket.emit('RECEIVEDETAILRESET',
							{
								arrayResetServer:1,
								DetailTime: parseFloat(rows[0].DetailTime),
		                	});						 
						}else
						{									
		  					socket.emit('RECEIVEDETAILRESET',
							{
								arrayResetServer:0,
								DetailTime:0,
		                	});	
						}				

					}
				})				
			});

        });
    }
}