'use strict';
var datetime 		= require('node-datetime');


var database 		= require('./../../Util/db');
var functions 		= require("./../../Util/functions");
var DetailError;

exports.start = function start (io) {
	io.on('connection', function(socket){ 

		database.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime > 0",function(error, rows){
			if(!!error){DetailError = ('serverReset.js: Error SELECT start ');functions.writeLogErrror(DetailError);}

			var blk = 0;
			var blkLimit = 0;
			var detailTimeBlockio = 0;

			if (rows.length>0){
				blk = 1;
				blkLimit = 1;
				detailTimeBlockio=rows[0].DetailTime;
				R_RESET_SERVER (socket,blk,blkLimit,detailTimeBlockio);
			}

		});

	});
}

function R_RESET_SERVER (socket,blk,blkLimit,detailTimeBlockio){
	socket.emit('R_SERVER_TIME_OUT',{
		block: 0,
		blockLimit: blkLimit,
		DetailTimeBlockio: detailTimeBlockio,
	});			
}