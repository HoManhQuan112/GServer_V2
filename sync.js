'use strict';
module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {        	
			socket.on('S_SYNC_ANIMATION', function (data)
			{	
				console.log("======================S_SYNC_ANIMATION");						
				socket.broadcast.emit('R_SYNC_ANIMATION',data);	
				//io.emit('RECEIVESYNCANIMATION',data);	
			});

			socket.on('S_SYNC_ATTACK', function (data)
			{				
				console.log("======================S_SYNC_ATTACK");
				socket.broadcast.emit('R_SYNC_CLICK_ATTACK',data);	
				//io.emit('RECEIVESYNCCLICKATTACK',data);	
			});        	             
        })
    }
}