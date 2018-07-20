'use strict';
var database 			      = require('./../Util/db.js');
var functions           = require("./../Util/functions.js");
var cron 			          = require('node-cron');

var lodash		          = require('lodash');
var Promise             = require('promise');
//var cron             = require('cron');
// var CronJob 		    = require('cron');


//var async               = require("async");

var currentTime,DetailError;
var circleTime = 4*60*60;

exports.getarrayAllMinepositionTrue = function getarrayAllMinepositionTrue (arrayAllMinepositionTrue) {
   database.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows){
     if (!!error){DetailError = ('resetMine.js: Error getarrayAllMinepositionTrue');functions.writeLogErrror(DetailError);}
     (rows.length>0)?arrayAllMinepositionTrue(rows):arrayAllMinepositionTrue("");
   });
}

exports.getTimeResetMine =function getTimeResetMine (currentTime,arrayTimeResetserver) {
  database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
    if (!!error){DetailError = ('resetMine: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
    var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
    var timeResetMine = resetTime - currentTime;
    arrayTimeResetserver(timeResetMine);
    
  });
}

exports.start = function start (io) {
  currentTime =  Math.floor(new Date().getTime()/1000);
  checkDataBase(io,currentTime);
  scheduleTimeReset(io,currentTime);
}


function checkDataBase (io,currentTime) {
 database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
  if (!!error){DetailError = ('resetMine.js: Error select checkDataBase');functions.writeLogErrror(DetailError);}

  var timeReset =  Math.floor(new Date(rows[0].NextTimeReset).getTime()/1000);

  if (timeReset<currentTime) {
    myFuncReset();
    var nextTimeReset  = timeReset + circleTime;
    var lastTimeRest = nextTimeReset - circleTime;
    updateLastTimeReset (functions.timeConverterResetMine(lastTimeRest));  
    updateNextTimeReset(functions.timeConverterResetMine(nextTimeReset)); 
    sendToUser(io);
  }    
});
}

function scheduleTimeReset (io,currentTime) {
 cron.schedule('0 0 0,4,8,12,16,20 * * * *',function(){
  currentTime =   Math.floor(new Date().getTime()/1000);
  var nextTimeReset  = currentTime + circleTime;
  var lastTimeRest = nextTimeReset - circleTime;
  myFuncReset();
  updateLastTimeReset (functions.timeConverterResetMine(lastTimeRest));  
  updateNextTimeReset(functions.timeConverterResetMine(nextTimeReset)); 
  sendToUser(io); 
});
}

function updateLastTimeReset (timeUpdate) {
  database.query("UPDATE `task` SET LastTimeReset='"+timeUpdate.toString()+"' WHERE `DetailTask`='ResetMine'",function (error) {
   if (!!error){DetailError = ('resetMine.js: Error updateLastTimeReset');functions.writeLogErrror(DetailError);}
 });
}
function updateNextTimeReset (timeUpdate) {
  database.query("UPDATE `task` SET NextTimeReset='"+timeUpdate.toString()+"' WHERE `DetailTask`='ResetMine'",function (error) {
   if (!!error){DetailError = ('resetMine.js: Error updateNextTimeReset');functions.writeLogErrror(DetailError);}
 });
}
function sendToUser (io) {
  var arrayAllMinepositionupdate = [];
  database.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows){
   if (!!error){DetailError = ('resetMine.js: Error SELECT userasset');functions.writeLogErrror(DetailError);} 
   if (rows.length>0) {
    for (var i = 0; i < rows.length; i++){
      arrayAllMinepositionupdate.push(rows[i]);
    }
    io.emit('R_RESET_MINE',
    {
      getAllIDMineOfUser: arrayAllMinepositionupdate,
      gettimeSendRepeat : circleTime,
    });     
  }
});
}

function myFuncReset()
{
  var arrayAllUserposition = [],arrayMineposition = [], arrayAllMine = [], arrayAllMineName = [], arrayAllMinePosition = [], arrayAllMineMerger = [];           
  const k = [1000];
  const asyncFunc = (timeout) => {
    return new Promise((resolve,reject) => {
      setTimeout(() => {                
        var query = database.query('DELETE FROM userasset WHERE userNameOwner = ?', [""],function(error, result)
          {if(!!error){DetailError = ('resetmine: Error DELETE emptyMine');functions.writeLogErrror(DetailError);  
        }})
        resolve(); 
      }, timeout)
    }).then(() => {
      return new Promise((resolve,reject) => {
        setTimeout(() => {                
          var query = database.query("SELECT Position FROM `userbase` WHERE `Position`!='' UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
          {
            if (!!error){DetailError = ('resetmine: Error select userbase');functions.writeLogErrror(DetailError);  
          }else
          {
            for (var i = 0; i < rows.length; i++)
            {
              arrayAllUserposition.push(rows[i].Position);
            }
          }
        })
          var query = database.query("SELECT PositionClick FROM `unitinlocations` WHERE TimeMoveComplete = 0",function(error, rows,field)
          {
            if (!!error){DetailError = ('resetmine: Error in the query 9');functions.writeLogErrror(DetailError);  
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
          var query = database.query("SELECT * FROM `itemmine` WHERE 1",function(error, rows,field)
          {
            if (!!error){DetailError = ('resetmine: Error in the query 10');functions.writeLogErrror(DetailError);  
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
                var query = database.query(sql, [records], function(err, result)
                {
                  if(!!err){DetailError = ('resetmine: Error in the query 11');

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

          currentTime = Math.floor(new Date().getTime() / 1000);
          var query = database.query('UPDATE users SET timeResetMine = ? WHERE timeResetMine != ?', [currentTime, ""],function(error, result, field)
          {
            if(!!error){DetailError = ('resetmine: Error in the query 12');functions.writeLogErrror(DetailError);  
          }
        });
          resolve(); 
        }, timeout)
      });
    }).then(() => {
      return new Promise((resolve,reject) => {
        setTimeout(() => {                     
          var query = database.query('UPDATE userbase SET checkResetMine = ? WHERE Position != ?', [1, ""],function(error, result, field)
          {
            if(!!error){DetailError = ('resetmine: Error in the query 13');functions.writeLogErrror(DetailError);  
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

  //       cron.schedule('*/1 * * * * *',function()
		// {
		// 	d = new Date();
	 //    	currentTime = Math.floor(new Date().getTime() / 1000);
		// 	//reset mine   	
		// 	var query = database.query("SELECT DetailMore FROM `task` WHERE DetailTask ='ResetMine' AND CheckSend = 0",function(error, rows,field)
		// 	{
		// 		if (!!error){DetailError = ('resetmine: Error in the query 1');
  //                  
  //                   functions.writeLogErrror(DetailError);  
		// 		}else
		// 		{
		// 			if (rows.length>0) 
		// 			{	                        	
		// 				var timeResetMines = rows[0].DetailMore;
		// 				var query = database.query("UPDATE task SET CheckSend =1 where DetailTask = 'ResetMine'",function(error, result, field)
		// 				{
		// 					if(!!error){DetailError = ('resetmine: Error in the query 2');
  //                              
  //                               functions.writeLogErrror(DetailError);  
		// 					}else
		// 					{
		// 						if (result.affectedRows>0) 
		// 						{									
		// 							var jobResetMine = new CronJob(
		// 							{
		// 								//cronTime: '00 0,4,8,12,16,20 * * * *',
		// 							  	cronTime: timeResetMines,
		// 							  	onTick: function()
		// 							  	{									    	
		// 							    	myFuncReset();
		// 							    	jobResetMine.stop();
		// 							  	},
		// 							  	onComplete: function()
		// 							  	{		    	
		// 							 	},
		// 							  	start: false,
		// 							  	timeZone: 'Asia/Ho_Chi_Minh'
		// 							});
		// 							jobResetMine.start();
		// 						}
		// 					}
		// 				});			                												  															  								                														  							  							  					 
		// 			}	
		// 		}
		// 	}) 
  //           //gửi user assest cho tất cả user
  //           //check reset server of user
  //           var arrayAllMinepositionupdate = [];
  //           var query = database.query("SELECT `checkResetMine` FROM `userbase` WHERE checkResetMine = 1",function(error, rows,field)
  //           {
  //               if (!!error) {
  //                   DetailError = ('resetmine: Error in the query 3');
  //                  
  //                   functions.writeLogErrror(DetailError);  
  //               }else
  //               {
  //                   if (rows.length > 0)
  //                   {
  //                       var query = database.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
  //                       {
  //                           if (!!error){DetailError = ('resetmine: Error in the query 4');
  //                              
  //                               functions.writeLogErrror(DetailError);  
  //                           }else
  //                           {
  //                               for (var i = 0; i < rows.length; i++)
  //                               {
  //                                   arrayAllMinepositionupdate.push(rows[i]);
  //                               }                                                               
  //                               io.emit('R_RESET_MINE',
  //                               {
  //                                   getAllIDMineOfUser: arrayAllMinepositionupdate,
  //                                   gettimeSendRepeat : 86400,
  //                               });
  //                               //cập nhật check reset mine đã gửi thành công
  //                               var query = database.query('UPDATE userbase SET checkResetMine = 0 WHERE 1',function(error, result, field)
  //                               {
  //                                   if(!!error){DetailError = ('resetmine: Error in the query 5');
  //                                      
  //                                       functions.writeLogErrror(DetailError);  
  //                                   }
  //                                   else
  //                                   {                                    	
  //                                   	var query = database.query("UPDATE task SET CheckSend =0 where DetailTask = 'ResetMine'",function(error, result, field)
		// 								{
		// 									if(!!error){DetailError = ('resetmine: Error in the query 6');}
  //                                              
  //                                               functions.writeLogErrror(DetailError);  
		// 								});
  //                                   }
  //                               });
  //                           }
  //                       })
  //                   }
  //               }
  //           })
		// })
//




