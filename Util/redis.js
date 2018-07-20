'use strict';
const redis 		= require("redis"),
    client 			= redis.createClient({host: '127.0.0.1', port: 6379,    
    flush_strategy (options) 
    {
	    if (options.attempt >= 3) 
	    {
	      // flush all pending commands with this error
	      return new Error('Redis unavailable')
	    }
	    // let the connection come up again on its own
	    return null;
  	},
  	// this strategy handles the reconnect of a failing redis
  	retry_strategy (options) 
  	{ 
	    if (options.total_retry_time > 1000 * 60 * 60) {
	      // The connection is never going to get up again
	      // kill the client with the error event
	      return new Error('Retry time exhausted');
	    }
    	// attempt reconnect after this delay
    	return Math.min(options.attempt * 100, 3000)
  	}}); 
 client.on('ready',function() {
 //console.log("Redis is ready");
});

client.on('error',function() {
 console.log("Error in Redis");
});

//client.auth("test123");
client.on("error", function (err) {
    console.log("Error " + err);
});
module.exports = client;  

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });