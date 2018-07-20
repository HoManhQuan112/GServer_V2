'use strict';
var pool 			= require('./db');
var cron 			= require('node-cron');
var lodash		    = require('lodash');
var CronJob 		= require('cron').CronJob;
var functions       = require("./functions");
var Promise         = require('promise');
var async           = require("async");
var d,createPositionTimelast,DetailError;

module.exports = 
{
    start: function(io) 
    {
        /*io.on('connection', function(socket) 
        {
        	socket.on('RESET_MINE', function (data)
			{
				var GameServer = require("./login2");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;
				socket.emit('RESET_MINE_SUCCESS',
				{
		        	message : '0',
		    	});				
			});	
        	
        });*/
        
        cron.schedule('*/1 * * * * *',function()
        {
         d = new Date();
         createPositionTimelast = Math.floor(d.getTime() / 1000);
			//reset mine   	
			var query = pool.query("SELECT DetailMore FROM `task` WHERE DetailTask ='ResetMine' AND CheckSend = 0",function(error, rows,field)
			{
				if (!!error){DetailError = ('resetmine: Error in the query 1');
                console.log(DetailError);
                functions.writeLogErrror(DetailError);  
            }else
            {
               if (rows.length>0) 
               {	                        	
                  var timeResetMines = rows[0].DetailMore;
                  var query = pool.query("UPDATE task SET CheckSend =1 where DetailTask = 'ResetMine'",function(error, result, field)
                  {
                     if(!!error){DetailError = ('resetmine: Error in the query 2');
                     console.log(DetailError);
                     functions.writeLogErrror(DetailError);  
                 }else
                 {
                    if (result.affectedRows>0) 
                    {									
                       var jobResetMine = new CronJob(
                       {
										//cronTime: '00 0,4,8,12,16,20 * * * *',
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
                    DetailError = ('resetmine: Error in the query 3');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
                }else
                {
                    if (rows.length > 0)
                    {
                        var query = pool.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
                        {
                            if (!!error){DetailError = ('resetmine: Error in the query 4');
                            console.log(DetailError);
                            functions.writeLogErrror(DetailError);  
                        }else
                        {
                            for (var i = 0; i < rows.length; i++)
                            {
                                arrayAllMinepositionupdate.push(rows[i]);
                            }                                                               
                            io.emit('R_RESET_MINE',
                            {
                                getAllIDMineOfUser: arrayAllMinepositionupdate,
                                gettimeSendRepeat : 86400,
                            });
                                //cập nhật check reset mine đã gửi thành công
                                var query = pool.query('UPDATE userbase SET checkResetMine = 0 WHERE 1',function(error, result, field)
                                {
                                    if(!!error){DetailError = ('resetmine: Error in the query 5');
                                    console.log(DetailError);
                                    functions.writeLogErrror(DetailError);  
                                }
                                else
                                {                                    	
                                   var query = pool.query("UPDATE task SET CheckSend =0 where DetailTask = 'ResetMine'",function(error, result, field)
                                   {
                                     if(!!error){DetailError = ('resetmine: Error in the query 6');}
                                     console.log(DetailError);
                                     functions.writeLogErrror(DetailError);  
                                 });
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
    var arrayAllUserposition = [],arrayMineposition = [], arrayAllMine = [], arrayAllMineName = [], arrayAllMinePosition = [], arrayAllMineMerger = [];           
    const k = [1000];
    
    const asyncFunc = (timeout) => {
        return new Promise((resolve,reject) => {
            setTimeout(() => {                
                var query = pool.query('DELETE FROM userasset WHERE userNameOwner = ?', [""],function(error, result, field)
                    {if(!!error){DetailError = ('resetmine: Error in the query 7');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
                }})
                resolve(); 
            }, timeout)
        }).then(() => {
            return new Promise((resolve,reject) => {
              setTimeout(() => {                
                var query = pool.query("SELECT Position FROM `userbase` WHERE `Position`!='' UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
                {
                    if (!!error){DetailError = ('resetmine: Error in the query 8');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
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
                    if (!!error){DetailError = ('resetmine: Error in the query 9');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
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
                    if (!!error){DetailError = ('resetmine: Error in the query 10');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
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
                                if(!!err){DetailError = ('resetmine: Error in the query 11');
                                console.log(DetailError);
                                functions.writeLogErrror(DetailError);  
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
                    if(!!error){DetailError = ('resetmine: Error in the query 12');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
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
                    if(!!error){DetailError = ('resetmine: Error in the query 13');
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);  
                }
            }); 
                resolve(); 
            }, timeout)
          });
        });
    }
    k.reduce((promise, timeout) => {
      return promise.then(() => asyncFunc(timeout));
  }, Promise.resolve());
} 

