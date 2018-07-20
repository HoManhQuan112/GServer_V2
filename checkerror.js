'use strict';
var pool 			= require('./db');
var functions 		= require("./functions");
var currentError,d,createPositionTimelast,DetailError;

exports.start = function start (io) {
	io.on('connection', function(socket) 
        {
        	socket.on('CHECK_ERROR', function (data)
			{
				currentError = getcurrentError(data);						
				DetailError = ("CHECK_ERROR: "+currentError.data+" "+currentError.detail);
				functions.writeLogErrror(DetailError);						
			});             
        })
}

// module.exports = {
//     start: function(io) 
//     {
//         io.on('connection', function(socket) 
//         {
//         	socket.on('CHECK_ERROR', function (data)
// 			{
// 				currentError = getcurrentError(data);						
// 				DetailError = ("CHECK_ERROR: "+currentError.data+" "+currentError.detail);
// 				functions.writeLogErrror(DetailError);						
// 			});             
//         })       
//     }
// }

function getcurrentError(data)
{
	return currentError =
	{
		data : data.data,		
		detail : data.detail,	
	}
}