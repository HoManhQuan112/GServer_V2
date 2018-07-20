'use strict';
var pool 			= require('./db');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var client 			= require('./redis');
var Promise 		= require('promise');
var async 			= require("async");
var functions 	= require("./functions");

var currentSENDUNITAvsB, FarmPortableMove, currentSENDUNITAoutB,DetailError;
module.exports = 
{
    start: function(io) 
    {   
  //   	var arrayAvsB = [], d, createPositionTimelast, arrayAvsBTemp = [],arrayAvsBFightOut = []; 	
  //       io.on('connection', function(socket) 
  //       {        	
  //       	socket.on('S_UNIT_AvsB', function (data)
		// 	{
		// 		currentSENDUNITAvsB = getcurrentSENDUNITAvsB(data);
		// 		d = new Date();
		// 		createPositionTimelast = Math.floor(d.getTime() / 1000);	
		// 		console.log("===========data receive S_UNIT_AvsB: "+currentSENDUNITAvsB.idUnitInLocationsA+" VS "
		// 			+currentSENDUNITAvsB.idUnitInLocationsB+"_"+createPositionTimelast);					
		// 		arrayAvsB.push(currentSENDUNITAvsB);
		// 		arrayAvsBTemp.push(currentSENDUNITAvsB);
		// 		console.log("Chieu dai mang dánh nhau hiện tại: "+arrayAvsBTemp.length);
		// 		var GameServer 		= require("./login2");				
		// 	    var gameServer 		= new GameServer();
		// 	    exports.gameServer 	= gameServer;			    		    																
		// 		//duyệt các unit vào tầm đánh
		// 		for (var i = 0; i < arrayAvsBTemp.length; i++) 
		// 	 	{
		// 			var index = i;																							
		// 			var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1 AND idUnitInLocations ='"+
		// 				arrayAvsBTemp[index].idUnitInLocationsA+"'",function(error, rows,field)
		// 			{
		// 				if (!!error){DetailError = ('onlinefighting: Error in the query 1');
		// 					console.log(DetailError);
		// 					functions.writeLogErrror(DetailError);	
		// 				}else
		// 				{
		// 					if ((rows.length>0) && (parseFloat(rows[0].CheckMove)===1))
		// 					{																							
		// 						//cập farm đứng lại khi đánh nhau		
		// 						FarmPortableMove = parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete));								
		// 						if (parseFloat(rows[0].FarmPortable)<(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete)))
		// 						{
		// 							FarmPortableMove = 0;
		// 						}															
		// 						var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = 0,userFight = '"+arrayAvsBTemp[index].idUnitInLocationsB
		// 							+"',TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
		// 							+"',CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
		//                 			+"',TimeSendToClient = 0,CheckMove = 0, CheckFight =1 where idUnitInLocations = '"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'",function(error, result, field)
		// 						{
		// 							if(!!error){DetailError = ('onlinefighting2,js: Error query 2');
		// 								console.log(DetailError);
		// 								functions.writeLogErrror(DetailError);	
		// 							}else
		// 							{															
		// 								//gửi lên cho từng user
		// 			                	if ((lodash.filter(gameServer.clients, x => x.name === rows[0].UserName)).length >0) 
		// 					  			{									  				
		// 					  				io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === rows[0].UserName)].idSocket).emit('R_FARM_CONSUME_MOVE',
		// 									{
		// 										message: 1,
		// 										idUnitInLocations: rows[0].idUnitInLocations,																				
		// 										FarmPortableMove: FarmPortableMove,
		// 										Position: rows[0].PositionClick,
		// 				                	});						                						                					                							                								  									  								                	
		// 					  			}					  			
							  																	
		// 							}
		// 						});																																									
		// 					}								
		// 					var query = pool.query("UPDATE unitinlocations SET CheckFight = 1, userFight ='"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)																	
	 //                			+"'where idUnitInLocations = '"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'",function(error, result, field)
		// 					{
		// 						if(!!error){DetailError = ('onlinefighting: Error in the query 3');
		// 							console.log(DetailError);
		// 							functions.writeLogErrror(DetailError);	
		// 						}else
		// 						{
		// 							if (result.affectedRows>0) 
		// 							{												
		// 								//cập nhật redis
		// 			                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
		// 			                		parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'UNION ALL SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
		// 			                		parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)+"'",function(error, rows,field)
		// 								{
		// 									if (!!error){DetailError = ('onlinefighting: Error in the query 4');
		// 										console.log(DetailError);
		// 										functions.writeLogErrror(DetailError);	
		// 									}else
		// 									{														
		// 										//update resid														
		// 										client.set(arrayAvsBTemp[index].idUnitInLocationsA,JSON.stringify(rows[0])); 
		// 										client.set(arrayAvsBTemp[index].idUnitInLocationsB,JSON.stringify(rows[1])); 
		// 										client.mget([arrayAvsBTemp[index].UserNameA+arrayAvsBTemp[index].UserNameB, arrayAvsBTemp[index].UserNameB+arrayAvsBTemp[index].UserNameA], function (err, replies) 
		// 										{							    						    														
		// 											if (CheckFriend(replies[0]) && CheckFriend(replies[1]))
		// 											{														
		// 												d = new Date();
		// 									    		createPositionTimelast = Math.floor(d.getTime());     		
		// 												if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations ===  parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 
		// 												&& lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0) {				
		// 													client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
		// 													{  
		// 														if (!replies) {}else
		// 														{
		// 															var objectValue = JSON.parse(replies);													
		// 															gameServer.redisarray.push(JSON.parse(replies));	
		// 															(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
		// 														}																				  																		
		// 													});										
		// 													client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
		// 													{    														
		// 														if (!replies) {}else
		// 														{
		// 															var objectValue = JSON.parse(replies);													
		// 															gameServer.redisarray.push(JSON.parse(replies));	
		// 															(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
		// 														}	  																		
		// 													});
		// 												}else if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 ) 
		// 												{								
		// 													client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
		// 													{  
		// 														if (!replies) {}else
		// 														{
		// 															var objectValue = JSON.parse(replies);													
		// 															gameServer.redisarray.push(JSON.parse(replies));	
		// 															(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
		// 														} 																				  																		
		// 													});												
		// 												}else if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0 )  
		// 												{
		// 													client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
		// 													{    														
		// 														if (!replies){}else
		// 														{	
		// 															var objectValue = JSON.parse(replies);													
		// 															gameServer.redisarray.push(JSON.parse(replies));		
		// 															(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																
		// 														}	  																		
		// 													});
		// 												}else
		// 												{														
		// 													gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].userFight = arrayAvsBTemp[index].idUnitInLocationsB;
		// 													gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].CheckFight = 1;
		// 												}									
															
		// 												//Đồng bộ farm unit A	
		// 												client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
		// 												{
		// 													if (err){DetailError = (err+"380");
		// 														console.log(DetailError);
		// 														functions.writeLogErrror(DetailError);	
		// 													}else
		// 													{									
		// 												       	var objectValue = JSON.parse(replies);										       	
		// 												       	if (parseFloat(objectValue['FarmPortable'])!==(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)) 
		// 												       	{									       			
		// 												       		(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
		// 												       	}		    						
		// 													}									    
		// 												});										

		// 												//động bộ farm	unit B
		// 												client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
		// 												{
		// 													if (err){DetailError = (err+"381");
		// 														console.log(DetailError);
		// 														functions.writeLogErrror(DetailError);	
		// 													}else
		// 													{									
		// 												       	var objectValue = JSON.parse(replies);										       	
		// 											       		if (parseFloat(objectValue['FarmPortable'])!==(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)) 
		// 												       	{									       		
		// 												       		(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
		// 												       	}		    						
		// 													}									    
		// 												});																																										
		// 											}else
		// 											{
		// 												console.log("===========La ban cua nhau=============");
		// 											}																																																										
		// 										});
		// 									}
		// 								});
		// 							}
		// 						}
		// 					});																																																				
							
		// 				}
		// 			});													
		// 		}																			
		// 	});

		// 	socket.on('S_UNIT_AoutB', function (data)
		// 	{			
		// 		currentSENDUNITAoutB = getcurrentSENDUNITAoutB(data);
		// 		d = new Date();
	 //    		createPositionTimelast = Math.floor(d.getTime());   
	 //    		console.log("========================data receive S_UNIT_AoutB: "+currentSENDUNITAoutB.idUnitInLocationsA+" VS "
	 //    			+currentSENDUNITAoutB.idUnitInLocationsB+"_"+createPositionTimelast); 	    		
	 //    		var GameServer 		= require("./login2");		    		
		// 	    var gameServer = new GameServer();
		// 	    exports.gameServer = gameServer;
	 //    		arrayAvsBFightOut.push(currentSENDUNITAoutB);	
	 //    		console.log("Chieu dai mang hoan tat tam danh ======S_UNIT_AoutB: "+ arrayAvsBFightOut.length);    			    		
	 //    		for (var i = 0; i < arrayAvsBFightOut.length; i++) 
	 //    		{	    			
	 //    			var index = i;    				    			
	 //    			if (arrayAvsB.length > 0) 
		// 			{
		// 				if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) 
		// 				{																		
		// 					//Cập nhật mảng đánh
		// 					if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) 
		// 					{																			
		// 						arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA), 1);	
		// 						arrayAvsBTemp.splice(arrayAvsBTemp.findIndex(item=>item.idUnitInLocationsA==arrayAvsBFightOut[index].idUnitInLocationsA),1);								
		// 					}																																	
															
		// 					const s = [1000];
		// 					const asyncFunc = (timeout) => {
		// 						return new Promise((resolve,reject) => {
		// 							setTimeout(() => 
		// 							{ 
		// 								//cập nhật mysql
		// 								var query=pool.query("UPDATE unitinlocations SET CheckFight = 0,userFight ='', TimeFight='"+createPositionTimelast
		// 									+"'  WHERE idUnitInLocations = '"+parseFloat(arrayAvsBFightOut[index].idUnitInLocationsA)+"'",function(error, result, field)
		// 								{
		// 									if(!!error){DetailError = ('onlinefighting: Error in the query 5');
		// 										console.log(DetailError);
		// 										functions.writeLogErrror(DetailError);	
		// 									}else
		// 									{  	
		// 										if (result.affectedRows >0) 
		// 										{												
		// 											var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE`idUnitInLocations` = '"
		// 																				+arrayAvsBFightOut[index].idUnitInLocationsA+"'",function(error, rows,field)
		// 											{
		// 												if (!!error){DetailError = ('onlinefighting: Error in the query 6');
		// 													console.log(DetailError);
		// 													functions.writeLogErrror(DetailError);	
		// 												}else
		// 												{	
		// 													if (rows.length > 0) 
		// 													{																		
		// 														//cập nhật redis
		// 														client.set(arrayAvsBFightOut[index].idUnitInLocationsA,JSON.stringify(rows[0]));																																							
		// 													}																																						
		// 												}
		// 											})	

		// 										}																																				
																						
		// 									}
		// 								})											
										
		// 								resolve(); 
		// 							}, timeout)
		// 					    }).then(() => {
		// 							return new Promise((resolve,reject) => {
		// 							  setTimeout(() => { 									  		
		// 							  	arrayAvsBFightOut = [];									  	
		// 							  	resolve(); 
		// 							  }, timeout)
		// 					        });
		// 						});
		// 					}
		// 					s.reduce((promise, item) => {															
		// 					  return promise.then(() => asyncFunc(item));
		// 					}, Promise.resolve());	
		// 				}
		// 			}	    							
	 //    		}
	 //    	});   			        
  //       })

		// cron.schedule('*/1 * * * * *',function()
		// {			
		// 	d = new Date();
  //   		createPositionTimelast = Math.floor(d.getTime() / 1000);
  //   		const k = [250];

		// 	//Cập nhật tầm đánh 
		// 	var query = pool.query("SELECT idUnitInLocations,Position FROM `unitinlocations` WHERE TimeCheck ='"+createPositionTimelast+"' ORDER BY `TimeCheck` DESC",function(error, rows,field)
		// 	{
		// 		if (!!error){DetailError = ('onlinefighting2.js: Error query 7');				
		// 			functions.writeLogErrror(DetailError);	
		// 		}else
		// 		{
		// 			if (rows.length > 0) 
		// 			{
		// 				for (var i = 0; i < rows.length; i++) 
		// 				{				
		// 					const arrayS = [],arrayS1 = [],arrayS2 = [],arrs = rows[i].Position.split(","), idUnitInLocations = rows[i].idUnitInLocations;
		// 					const asyncFunc = (timeout) => {
		// 						return new Promise((resolve,reject) => {
		// 							setTimeout(() => { 
		// 								var PositionX = parseFloat(arrs[0]), PositionZ = parseFloat(arrs[1]), Distance=1;
		// 								PositionX = PositionX - Distance;
		// 								PositionZ = PositionZ + Distance;
		// 								var TopLeft= PositionX +","+PositionZ;
		// 								arrayS.push(TopLeft);
		// 								for (var i = 0; i < (Distance*2); i++)
		// 								{
		// 									PositionX +=1;
		// 									arrayS.push(PositionX+","+PositionZ);
		// 								}
		// 								for (var k = 0; k < (Distance*2+1); k++)
		// 								{
		// 									var arr = arrayS[k].split(",");
		// 									for (var i = 1; i < (Distance*2+1); i++)
		// 									{
		// 										var v =parseFloat(arr[1])-i;
		// 										arrayS.push(arr[0]+","+v);
		// 									}						
		// 								}														
		// 								resolve(); 
		// 							}, timeout)
		// 					    }).then(() => {
		// 							return new Promise((resolve,reject) => {
		// 							  setTimeout(() => { 
		// 							  	var PositionX = parseFloat(arrs[0]), PositionZ = parseFloat(arrs[1]), Distance=2;
		// 								PositionX = PositionX - Distance;
		// 								PositionZ = PositionZ + Distance;
		// 								var TopLeft= PositionX+","+PositionZ;
		// 								arrayS1.push(TopLeft);
		// 								for (var i = 0; i < (Distance*2); i++)
		// 								{
		// 									PositionX +=1;
		// 									arrayS1.push(PositionX+","+PositionZ);
		// 								}
		// 								for (var k = 0; k < (Distance*2+1); k++)
		// 								{
		// 									var arr = arrayS1[k].split(",");
		// 									for (var i = 1; i < (Distance*2+1); i++)
		// 									{
		// 										var v =parseFloat(arr[1])-i;
		// 										if(arrayS.indexOf(arr[0]+","+v) > -1) {								
		// 										}else
		// 										{								
		// 											arrayS1.push(arr[0]+","+v);			
		// 										}							
		// 									}						
		// 								}	
		// 							  	resolve(); 
		// 							  }, timeout)
		// 					        });
		// 						}).then(() => {
		// 							return new Promise((resolve,reject) => {
		// 							  setTimeout(() => { 
		// 							   	var PositionX = parseFloat(arrs[0]), PositionZ =parseFloat(arrs[1]), Distance=3;
		// 								PositionX = PositionX - Distance;
		// 								PositionZ = PositionZ + Distance;
		// 								var TopLeft= PositionX+","+PositionZ;
		// 								arrayS2.push(TopLeft);
		// 								for (var i = 0; i < (Distance*2); i++)
		// 								{
		// 									PositionX +=1;
		// 									arrayS2.push(PositionX+","+PositionZ);
		// 								}
		// 								for (var k = 0; k < (Distance*2+1); k++)
		// 								{
		// 									var arr = arrayS2[k].split(",");
		// 									for (var i = 1; i < (Distance*2+1); i++)
		// 									{
		// 										var v =parseFloat(arr[1])-i;
		// 										if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
		// 										{								
		// 										}else
		// 										{								
		// 											arrayS2.push(arr[0]+","+v);			
		// 										}	
		// 									}						
		// 								}									
		// 						  	resolve(); 
		// 							  }, timeout)
		// 					        });
		// 						}).then(() => {
		// 							return new Promise((resolve,reject) => {
		// 							  setTimeout(() => { 								  	
		// 								var query = pool.query('UPDATE unitinlocations SET FightRadiusPosition = ?, FightRadiusPosition1 = ?, FightRadiusPosition2 = ? WHERE idUnitInLocations = ?', [arrayS.toString(),arrayS1.toString(),arrayS2.toString(),parseFloat(idUnitInLocations)],function(error, result, field)
		// 								{
		// 									if(!!error){DetailError = ('onlinefighting: Error in the query 8');
		// 										console.log(DetailError);
		// 										functions.writeLogErrror(DetailError);	
		// 									}
		// 								})
		// 							  	resolve(); 
		// 							  }, timeout)
		// 					        });
		// 						});
		// 					}
		// 					k.reduce((promise, item) => {
		// 					  return promise.then(() => asyncFunc(item));
		// 					}, Promise.resolve());																	
		// 				}
		// 			}
		// 		}
		// 	});		
							
		// 	//Thực hiện chức năng unit A đánh nhau B online
		// 	if (arrayAvsB.length > 0) 
		// 	{					
		// 		var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameB,UnitOrderB,
		// 		UserNameA,UnitOrderA,FarmRemain=0,QualityBegin=0, FarmTotal=0,
		// 		FarmTotalA=0,FarmTotalB=0,AC; 
		// 		var GameServer 		= require("./login2");				
		// 	    var gameServer 		= new GameServer();
		// 	    exports.gameServer 	= gameServer;			  		
		// 		for (var s = 0; s < arrayAvsB.length; s++) 
		// 		{
		// 			var index = s;								
		// 			A=arrayAvsB[index].idUnitInLocationsA;
		// 			UserNameA=arrayAvsB[index].UserNameA;
		// 		 	UnitOrderA=arrayAvsB[index].UnitOrderA;	
		// 		 	B=arrayAvsB[index].idUnitInLocationsB;	
		// 			UserNameB=arrayAvsB[index].UserNameB;
		// 			UnitOrderB=arrayAvsB[index].UnitOrderB;	
		// 			console.log(index+": ================================"+arrayAvsB[index].idUnitInLocationsA+" VS "+arrayAvsB[index].idUnitInLocationsB);														
		// 			if ((lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(A)).length > 0) && (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(B)).length > 0)) 
		// 			{																
		// 				QualityUnEqual = 0;					
		// 				QualityUnEqual = parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality,10)/parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality,10);					
		// 				if (QualityUnEqual < 1)
		// 				{
		// 					QualityUnEqual=1;
		// 				}
		// 				// Tính Defent tổng
		// 				DefendSum = 0;					
		// 				DefendSum = parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10)/parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);					
		// 				if ((DefendSum % 1 ) >= 0.5)
		// 				{
		// 					DefendSum = Number((DefendSum).toFixed(0)); 								
		// 				}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
		// 				{
		// 					DefendSum = Number((DefendSum).toFixed(0))+1;  								
		// 				}else
		// 				{
		// 					DefendSum	= parseInt(DefendSum,10);  								
		// 				}
						
		// 				HealthRemain = parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain,10)
		// 				 -(parseFloat(QualityUnEqual)*parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10) 
		// 				 	- parseInt(DefendSum,10)* parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10)); 																						
		// 				if (parseFloat(HealthRemain)<=0)
		// 				{	
		// 					console.log("===============idUnitInLocations: "+A+" WIN " +B);																									
		// 					io.emit('R_UNIT_AvsB',
		// 					{
		// 						idUnitInLocations: parseFloat(B),
		// 						UserName:UserNameB,
		// 						UnitOrder:parseFloat(UnitOrderB),
		// 						HealthRemain:0,
		// 						Quality:0,
		// 						idUnitInLocationsA: parseFloat(A),
		// 						FarmTotalA: parseInt(parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable),10),
		// 			            FarmTotalB: 0,
		// 					});	
		// 					var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder-1  WHERE `UserName` = '"+UserNameB+"'AND `UnitOrder` > '"+parseFloat(UnitOrderB)+"'",function(error, result, field)
		// 					{
		// 						if(!!error){DetailError = ('onlinefighting: Error in the query 9');
		// 							console.log(DetailError);
		// 							functions.writeLogErrror(DetailError);	
		// 						}

		// 					})	
		// 					//Cập nhật mảng vs											
		// 					arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === B), 1);	

		// 					//farm còn lại
		// 					var FarmPortableWin = parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);													   										

		// 					//cập nhật lại redis va memmory
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable = parseFloat(FarmPortableWin);					

		// 					//cập nhật redis và data base																												
		// 					client.set(A,JSON.stringify(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))]));

		// 					//cập nhật trong mảng redis												
		// 					gameServer.redisarray.splice(gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);	

		// 					//cap nhật trong redis
		// 					client.del(B);

		// 					var query = pool.query("DELETE FROM unitinlocations WHERE idUnitInLocations = '"+parseFloat(B)+"'",function(error, result, field)
		// 				  	{
		// 						if(!!error){DetailError = ('onlinefighting: Error in the query 10');
		// 							console.log(DetailError);
		// 							functions.writeLogErrror(DetailError);	
		// 						}else
		// 						{																																						
		// 							//Cập nhật trang thái cho unit đánh bại online
		// 							var query = pool.query("UPDATE unitinlocations SET  Quality ='"+parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality)
		// 								+"',FarmPortable ='"+parseFloat(FarmPortableWin)
		// 								+"',checkFight = 0, userFight = '' WHERE idUnitInLocations = ?",[parseFloat(A)],function(error, result, field)
		// 							{
		// 								if(!!error){DetailError = ('onlinefighting: Error in the query 11');
		// 									console.log(DetailError);
		// 									functions.writeLogErrror(DetailError);	
		// 								}										
		// 							})									
		// 						}
		// 					})
		// 				}else
		// 				{
		// 					//Tính các thông số sau khi đánh nhau
		// 					QualityRemain = 0;	
		// 					QualityBegin = parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality);							
		// 					QualityRemain = parseInt(HealthRemain,10)/parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);							
		// 					if ((QualityRemain % 1 ) >= 0.5)
		// 					{
		// 						QualityEnd = Number((QualityRemain).toFixed(0));  									
		// 					}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
		// 					{
		// 						QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
		// 					}else
		// 					{
		// 						QualityEnd	= parseInt(QualityRemain,10);  									
		// 					}													
		// 					AC=parseFloat(QualityBegin)/parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);						
		// 					FarmTotal=(parseFloat(QualityBegin)-parseFloat(QualityEnd))/AC;							
		// 					FarmTotalA=parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(FarmTotal);
		//        			    FarmTotalB=parseFloat(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable)-parseFloat(FarmTotal);						
		//        			    console.log(A+" Farm la: "+ FarmTotalA);
		//        			    console.log(B+" Farm la: "+ FarmTotalB+" Mau hien tai: "+HealthRemain);
		// 					//Gửi lên client
		// 			        io.emit('R_UNIT_AvsB',
		// 			        {
		// 			            idUnitInLocations:parseInt(B),
		// 			            UserName:UserNameB,
		// 			            UnitOrder:parseFloat(UnitOrderB),
		// 			            HealthRemain:HealthRemain,
		// 			            Quality:QualityEnd,
		// 			            idUnitInLocationsA: parseFloat(A),
		// 			            FarmTotalA: parseInt(FarmTotalA,10),
		// 			            FarmTotalB: parseInt(FarmTotalB,10),
		// 			        });	    

		// 			        //cập nhật mảng redis
		// 					DamageRemain = parseInt(QualityEnd,10)*parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DamageEach,10);						
		// 					DefendRemain = parseInt(QualityEnd,10)*parseInt(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10);						
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain = HealthRemain;
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Damage = DamageRemain;
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Defend = DefendRemain;
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality = QualityEnd;
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable = FarmTotalA;
		// 					gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable = FarmTotalB;						
		// 					//cập nhật redis và data base																					
		// 					client.set(B,JSON.stringify(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))]));
		// 					client.set(A,JSON.stringify(gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))]));														

		// 					//cập nhật my sql																       	
		// 			       	d = new Date();
		// 					createPositionTimelast = Math.floor(d.getTime() / 1000);							         
		// 					var query = pool.query("UPDATE unitinlocations SET HealthRemain = '"+parseFloat(HealthRemain)
		// 						+"' , Damage = '"+parseFloat(DamageRemain)
		// 						+"' , Defend = '"+parseFloat(DefendRemain)
		// 						+"' , Quality = '"+parseFloat(QualityEnd)
		// 						+"', TimeFight = '"+parseFloat(createPositionTimelast)
		// 						+"', FarmPortable = '"+parseFloat(FarmTotalB)								
		// 						+"'WHERE idUnitInLocations = '"+parseFloat(B)+"'",function(error, result, field)
		// 					{
		// 						if(!!error){DetailError = ('onlinefighting: Error in the query 12');
		// 							console.log(DetailError);
		// 							functions.writeLogErrror(DetailError);	
		// 						}
		// 					}) 	
		// 					var query = pool.query("UPDATE unitinlocations SET userFight = '"+B
		// 						+"' ,TimeFight = '"+parseFloat(createPositionTimelast)													
		// 						+"', FarmPortable = '"+parseFloat(FarmTotalA)
		// 						+"',CheckFight = 1 WHERE idUnitInLocations = '"+parseFloat(A)+"'",function(error, result, field)
		// 					{
		// 						if(!!error){DetailError = ('onlinefighting: Error in the query 13');
		// 							console.log(DetailError);
		// 							functions.writeLogErrror(DetailError);	
		// 						}
		// 					})								 															
		// 				}
		// 			}else
		// 			{									
		// 				io.emit('R_UNIT_AvsB',
		// 				{
		// 					idUnitInLocations: parseFloat(B),
		// 					UserName:UserNameB,
		// 					UnitOrder:parseFloat(UnitOrderB),
		// 					HealthRemain:0,
		// 					Quality:0,
		// 					idUnitInLocationsA: parseFloat(A),
		// 				});	
		// 				if (arrayAvsB.length > 0) 
		// 				{
		// 					if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === A)).length > 0) 
		// 					{						
		// 						arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === A), 1);																	
		// 						//Cập nhật trang thái cho unit đánh unit online sau khi đã bại trận
		// 						var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
		// 						[A],function(error, result, field)
		// 						{if(!!error){DetailError = ('onlinefighting: Error in the query 14');
		// 								console.log(DetailError);
		// 								functions.writeLogErrror(DetailError);	
		// 							}
		// 						})	
		// 						//cập nhật trạng thái cho unit đang đánh	
		// 						var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE userFight = ?',
		// 						[B],function(error, result, field)
		// 						{if(!!error){DetailError = ('onlinefighting: Error in the query 15');
		// 								console.log(DetailError);
		// 								functions.writeLogErrror(DetailError);	
		// 							}
		// 						})
		// 					}	
		// 				}

		// 			}
		// 		}
		// 	}

		// }); 
    }
}
function CheckFriend(obj) 
{	
	if(typeof obj === 'undefined') 
	{  	   	
    	return false;    	
	}else{
		return true;		
	}  	
} 
function getcurrentSENDUNITAvsB(data)
{
	return currentSENDUNITAvsB =
	{
		idUnitInLocationsA:data.idUnitInLocationsA,	
		UserNameA: data.UserNameA,
		UnitOrderA: data.UnitOrderA,

		idUnitInLocationsB: data.idUnitInLocationsB,	
		UserNameB: data.UserNameB,
		UnitOrderB: data.UnitOrderB,									
	}
}
function getcurrentSENDUNITAoutB(data)
{
	return currentSENDUNITAoutB =
	{
		idUnitInLocationsA:data.idUnitInLocationsA,				
		idUnitInLocationsB:data.idUnitInLocationsB,			
	}
}