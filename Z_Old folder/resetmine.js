'use strict';
var pool 			= require('./db');
var cron 			= require('node-cron');
var lodash		    = require('lodash');
var CronJob 		= require('cron').CronJob;
var functions       = require("./functions");
var Promise         = require('promise');
var async           = require("async");
var d,createPositionTimelast;

module.exports = 
{
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('RESETMINE', function (data)
			{
				var GameServer = require("./login");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;
				socket.emit('ResetMineSuccess',
				{
		        	message : '0',
		    	});				
			});	
        	
        });
        
        cron.schedule('*/1 * * * * *',function()
		{
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);
			//reset mine   	
			var query = pool.query("SELECT DetailMore FROM `task` WHERE DetailTask ='ResetMine' AND CheckSend = 0",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 387');
				}else
				{
					if (rows.length>0) 
					{		
                        console.log("thuc hien reset mine login");
						var timeResetMines = rows[0].DetailMore;
						var query = pool.query("UPDATE task SET CheckSend =1 where DetailTask = 'ResetMine'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 388');
							}else
							{
								if (result.affectedRows>0) 
								{
									var jobResetMine = new CronJob(
									{
										//cronTime: '00 24 09 * * 0-6',
									  	cronTime: timeResetMines,
									  	onTick: function()
									  	{									    	
									    	myFuncReset();
									    	jobResetMine.stop();
									  	},
									  	onComplete: function()
									  	{		    	
									 	},
									  	start: false,
									  	timeZone: 'Asia/Ho_Chi_Minh'
									});
									jobResetMine.start();
								}
							}
						});			                												  															  								                														  							  							  					 
					}				

				}
			}) 
            //gửi user assest cho tất cả user
            //check reset server of user
            var arrayAllMinepositionupdate = [];
            var query = pool.query("SELECT `checkResetMine` FROM `userbase` WHERE checkResetMine = 1",function(error, rows,field)
            {
                if (!!error) {
                    console.log('Error in the query 226');
                }else
                {
                    if (rows.length > 0)
                    {
                        var query = pool.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
                        {
                            if (!!error)
                            {
                                console.log('Error in the query 227');
                            }else
                            {
                                for (var i = 0; i < rows.length; i++)
                                {
                                    arrayAllMinepositionupdate.push(rows[i]);
                                }  
                                console.log("thuc hien reset mine login thanh cong");                              
                                io.emit('loginUnsuccessMine',
                                {
                                    getAllIDMineOfUser: arrayAllMinepositionupdate,
                                    gettimeSendRepeat : 86400,
                                });
                                //cập nhật check reset mine đã gửi thành công
                                var query = pool.query('UPDATE userbase SET checkResetMine = 0 WHERE 1',function(error, result, field)
                                {
                                    if(!!error)
                                    {
                                        console.log('Error in the query 228');
                                    }
                                });
                            }
                        })
                    }
                }
            })
		})
    }
}
function myFuncReset()
{
    var arrayAllUserposition = [],arrayMineposition = [],
    arrayAllMine = [], arrayAllMineName = [], arrayAllMinePosition = [], arrayAllMineMerger = [];           
    const k = [1000];
    const asyncFunc = (timeout) => {
        return new Promise((resolve,reject) => {
            setTimeout(() => {                
                var query = pool.query('DELETE FROM userasset WHERE userNameOwner = ?', [""],function(error, result, field)
                {
                    if(!!error)
                    {
                        console.log('Error in the queryfgfg34');
                    }
                })

                resolve(); 
            }, timeout)
        }).then(() => {
            return new Promise((resolve,reject) => {
              setTimeout(() => {                
                var query = pool.query("SELECT Position FROM `userbase` WHERE `Position`!='' UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
                {
                    if (!!error)
                    {
                        console.log('Error in the query 1');
                    }else
                    {
                        for (var i = 0; i < rows.length; i++)
                        {
                            arrayAllUserposition.push(rows[i].Position);
                        }

                    }
                })
                var query = pool.query("SELECT PositionClick FROM `unitinlocations` WHERE TimeMoveComplete = 0",function(error, rows,field)
                {
                    if (!!error)
                    {
                        console.log('Error in the queryghgf');
                    }else
                    {
                        for (var i = 0; i < rows.length; i++)
                        {
                            arrayAllMinePosition.push(rows[i].PositionClick);
                        }
                    }
                })
                resolve(); 
              }, timeout)
            });
        }).then(() => {
            return new Promise((resolve,reject) => {
              setTimeout(() => {                  
                var query = pool.query("SELECT * FROM `itemmine` WHERE 1",function(error, rows,field)
                {
                    if (!!error)
                    {
                        console.log('Error in the query 2fgjgj');
                    }else
                    {
                        for (var i = 0; i < rows.length; i++)
                        {
                            arrayAllMine.push(rows[i].IDMine);
                            arrayAllMineName.push(rows[i].NameMine);
                        }
                        arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
                        for (var k = 0; k <arrayAllUserposition.length; k++)
                        {
                            for (var i = 0; i <4; i++)
                            {
                                var iMine = functions.getRandomIntInclusive(1,8), M=1;
                                var arrMine = arrayAllUserposition[k].split(",");
                                arrayMineposition[i] = functions.getNewLocation(arrMine[0],arrMine[1],iMine,M);
                                while(arrayAllMineMerger.indexOf(arrayMineposition[i])>=1)
                                {
                                    iMine = functions.getRandomIntInclusive(1,8);
                                    arrayMineposition[i] = functions.getNewLocation(arrMine[0],arrMine[1],iMine,M);
                                }
                                arrayAllMineMerger.push(arrayMineposition[i]);
                            }
                            //Insert mine
                            var records = [
                                ["",arrayAllMine[0],arrayAllMineName[0], arrayMineposition[0],1,1],
                                ["",arrayAllMine[1],arrayAllMineName[1], arrayMineposition[1],1,1],
                                ["",arrayAllMine[2],arrayAllMineName[2], arrayMineposition[2],1,1],
                                ["",arrayAllMine[3],arrayAllMineName[3], arrayMineposition[3],1,1]
                            ];
                            var sql = "INSERT INTO userasset (userNameOwner,idMine,nameMine,Position,Level,Time) VALUES ?";
                            var query = pool.query(sql, [records], function(err, result)
                            {
                                if(!!err)
                                {
                                    console.log('Error in the query 3');
                                }
                            });
                        }
                    }
                })                  
                resolve(); 
              }, timeout)
            });
        }).then(() => {
            return new Promise((resolve,reject) => {
              setTimeout(() => {                 
                d = new Date();
                createPositionTimelast = Math.floor(d.getTime() / 1000);
                var query = pool.query('UPDATE users SET timeResetMine = ? WHERE timeResetMine != ?', [createPositionTimelast, ""],function(error, result, field)
                {
                    if(!!error)
                    {
                        console.log('Error in the queryhgjh');
                    }
                });
                resolve(); 
              }, timeout)
            });
        }).then(() => {
            return new Promise((resolve,reject) => {
              setTimeout(() => {                
                var query = pool.query('UPDATE userbase SET checkResetMine = ? WHERE Position != ?', [1, ""],function(error, result, field)
                {
                    if(!!error)
                    {
                        console.log('Error in the queryghg');
                    }
                }); 
                resolve(); 
              }, timeout)
            });
        });
    }
    k.reduce((promise, item) => {
      return promise.then(() => asyncFunc(item));
    }, Promise.resolve());
} 

