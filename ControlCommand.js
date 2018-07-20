'use strict';
var pool 			= require('./db');
var cron 			= require('node-cron');
var lodash		    = require('lodash');
var CronJob 		= require('cron').CronJob;
var functions       = require("./functions");
var Promise         = require('promise');
var async           = require("async");
var d,createPositionTimelast,DetailError,TimeResetUser;

var specialSymbol = "%";
if (process.argv.length <=2) {
	console.log("Vui long chon tham so truyen vao.")
	console.log("Danh sach:\n1 - Reset all user: node ControlCommand 1 100\n2 - Block a user in period: node ControlCommand 2 userName time\n3 - Reset mine: node ControlCommand 3 '00 24 11 * * 0-6'\n4 - Block a user forever: node ControlCommand 4 username\n");	
    console.log("Đuong dan file: " + __filename);
   // process.exit(-1);
}else
{
	console.log("param case: "+process.argv[2])
	console.log("param data: "+process.argv[3])
	//var param = funParam(process.argv[2]);	

	switch(parseInt(process.argv[2],10))
	{		
		case 1:
				console.log("Truong hop Reset all user");
				var query = pool.query("UPDATE task SET DetailBool = 1, DetailTime = '"+process.argv[3]
								+"' where DetailTask = 'ResetAllUser'",function(error, result, field)
				{if(!!error){DetailError = ('ControlCommand: Error in the query 1');}});		
			break;	
		case 2: 
				console.log("Truong hop khóa user trong một khoảng thời gian");
				d = new Date();
	    		createPositionTimelast = Math.floor(d.getTime() / 1000);
	    		console.log("thoi gian hien tại: "+ createPositionTimelast);
	    		console.log("Thoi gian reset: "+ process.argv[4]);
	    		TimeResetUser = parseFloat(createPositionTimelast) + parseFloat(process.argv[4]);
	    		console.log(TimeResetUser);	    	
				var query = pool.query("UPDATE users SET CheckSend = 0, DetailTimeBlock ='"+parseFloat(TimeResetUser)
										+"' where UserName = '"+process.argv[3]+"'",function(error, result, field)
				{
					if(!!error)
					{
							DetailError = ('resetuser: Error in the query 4');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
					}else
					{
						if(result.affectedRows > 0)
						{
							console.log("Reset user thành công");
						}else
						{
							console.log("Không tìm thấy user");
						}
					}
				}); 
			break;
		case 3: 
				console.log("Truong hop Reset mine");
				var query = pool.query("UPDATE task SET CheckSend = 0, DetailMore = '"+process.argv[3]
								+"' where DetailTask = 'ResetMine'",function(error, result, field)
				{if(!!error){DetailError = ('ControlCommand: Error in the query 2');}});
			break;
		case 4: 
				console.log("Truong hop khóa user vĩnh viễn");
				var query = pool.query("UPDATE users SET CheckSend = 0,CheckBLockForever = 1 where UserName = '"+process.argv[3]+"'",function(error, result, field)
				{if(!!error){DetailError = ('resetuser: Error in the query 4');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}});
			break;	
		default:
			console.log("khon co truong hop nao");	

	}
	/*function funParam(param) {
		if (param.indexOf(specialSymbol)!==-1) 
		{
			var userParam = param.split(specialSymbol);
			funParam2(userParam[0],userParam[1]);
		}
		else 
		{
			funParam1(param);
		}
	}

	function funParam1 (userName) {
		console.log('User kickout: ' + userName);
	}

	function funParam2 (userName,caseNumber) 
	{
		console.log("userName: "+userName);
		console.log("caseNumber: "+caseNumber);
		var number = parseInt(caseNumber);
		switch (number) {
			case 1:
				console.log("KickoutTime: 1 hour");
				break;
			case 2:
				console.log("KickoutTime: unlimited");
				break;
		}
		
	}*/
}