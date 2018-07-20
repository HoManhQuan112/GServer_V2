'use strict';
var pool 			= require('./db');
const nodemailer 	= require('nodemailer');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var client 			= require('./redis');
var Promise 		= require('promise');
var async 			= require("async");
var functions 		= require("./functions");


module.exports = {
    start: function(io) 
    {   
    	var arrayAvsB = [], d, createPositionTimelast, arrayAvsBTemp = [],arrayAvsBFightOut = [],redisarray = []; 	
        io.on('connection', function(socket) 
        {
        	var currentSENDUNITAvsB, FarmPortableMove, currentSENDUNITAoutB;
        	socket.on('SENDUNITAvsB', function (data)
			{
				currentSENDUNITAvsB =
				{
					idUnitInLocationsA:data.idUnitInLocationsA,	
					UserNameA: data.UserNameA,
					UnitOrderA: data.UnitOrderA,

					idUnitInLocationsB: data.idUnitInLocationsB,	
					UserNameB: data.UserNameB,
					UnitOrderB: data.UnitOrderB,									
				}
				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);	
				console.log("===========SENDUNITAvsB: "+currentSENDUNITAvsB.idUnitInLocationsA+" VS "
					+currentSENDUNITAvsB.idUnitInLocationsB+"_"+createPositionTimelast);					
				arrayAvsB.push(currentSENDUNITAvsB);
				arrayAvsBTemp.push(currentSENDUNITAvsB);
				console.log("Chieu dai mang dánh nhau hiện tại: "+arrayAvsBTemp.length);
				var GameServer 		= require("./login");				
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;			    		    																
				//duyệt các unit vào tầm đánh
				for (var i = 0; i < arrayAvsBTemp.length; i++) 
			 	{			 		
					var index = i;																							
					var query = pool.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations ='"+
						arrayAvsBTemp[index].idUnitInLocationsA+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 402');
						}else
						{
							if ((rows.length>0) && (parseFloat(rows[0].CheckMove)===1)) 
							{		
								console.log("Chieu dai mang hien tai for move: "+arrayAvsBTemp.length);																					
								//cập farm đứng lại khi đánh nhau		
								FarmPortableMove = parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete));								
								if (parseFloat(rows[0].FarmPortable)<(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete)))
								{
									FarmPortableMove = 0;
								}	
								console.log("Cap nhat idUnitInLocationsA: "+ arrayAvsBTemp[index].idUnitInLocationsA+ "thanh cong");														
								var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = 0,userFight ='"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)
									+"',TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
									+"',CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
		                			+"',TimeSendToClient = 0, CheckMove = 0, CheckFight = 1 where idUnitInLocations = '"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 403s');
									}else
									{				
										console.log("Cập nhật idUnitInLocationsB: "+arrayAvsBTemp[index].idUnitInLocationsB+ "thanh cong");														
										//gửi lên cho từng user
					                	if ((lodash.filter(gameServer.clients, x => x.name === rows[0].UserName)).length >0) 
							  			{									  				
							  				io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === rows[0].UserName)].idSocket).emit('RECEIVEFARMCONSUMEMOVE',
											{
												message: 1,
												idUnitInLocations: rows[0].idUnitInLocations,																				
												FarmPortableMove: FarmPortableMove,
												Position: rows[0].PositionClick,
						                	});	
						                	//cập nhật redis
						                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
						                		arrayAvsBTemp[index].idUnitInLocationsA+"'UNION ALL SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
						                		arrayAvsBTemp[index].idUnitInLocationsB+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 404');
												}else
												{													
													//update resid														
													client.set(arrayAvsBTemp[index].idUnitInLocationsA,JSON.stringify(rows[0])); 
													client.set(arrayAvsBTemp[index].idUnitInLocationsB,JSON.stringify(rows[1])); 
													client.mget([arrayAvsBTemp[index].UserNameA+arrayAvsBTemp[index].UserNameB, arrayAvsBTemp[index].UserNameB+arrayAvsBTemp[index].UserNameA], function (err, replies) 
													{							    						    														
														if (isEmptyObject(replies[0]) && isEmptyObject(replies[1]))
														{																			
															d = new Date();
												    		createPositionTimelast = Math.floor(d.getTime());     		
															if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 
															&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0) 
															{				
																client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
																{  
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																			
																	} 																									  																		
																});
																
																client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
																{    														
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																		
																		redisarray.push(JSON.parse(replies));																			
																	}	  																		
																});
															}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 ) 
															{								
																client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
																{  
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																			
																	} 																									  																		
																});	
																
															}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0 )  
															{
																client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
																{    														
																	if (!replies){}else
																	{	
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																				
																	}	  																		
																});
															}else
															{
																console.log("idUnitInLocations is already exist move")
																redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].userFight = arrayAvsBTemp[index].idUnitInLocationsB;
																redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].CheckFight = 1;
															}												
																																																																												
														}else
														{
															console.log("===========La ban cua nhau=============");
														}																																																										
													});															
												}
											})					                							                								  									  								                	
							  			}					  			
							  																	
									}
								});																																									
							}else
							{		
								console.log("Chieu dai mang hien tai for stand: "+arrayAvsBTemp.length);
								console.log("Cap nhat idUnitInLocationsA: "+ arrayAvsBTemp[index].idUnitInLocationsA+ "thanh cong");
								var query = pool.query("UPDATE unitinlocations SET CheckFight = 1, TimeMoveComplete = 0, userFight ='"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)																	
		                			+"'where idUnitInLocations = '"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 403s2');
									}else
									{
										if (result.affectedRows>0) 
										{
											console.log("Cập nhật idUnitInLocationsB: "+arrayAvsBTemp[index].idUnitInLocationsB+ "thanh cong");		
											//cập nhật redis
						                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
						                		arrayAvsBTemp[index].idUnitInLocationsA+"'UNION ALL SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
						                		arrayAvsBTemp[index].idUnitInLocationsB+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 404');
												}else
												{													
													//update resid														
													client.set(arrayAvsBTemp[index].idUnitInLocationsA,JSON.stringify(rows[0])); 
													client.set(arrayAvsBTemp[index].idUnitInLocationsB,JSON.stringify(rows[1])); 
													client.mget([arrayAvsBTemp[index].UserNameA+arrayAvsBTemp[index].UserNameB, arrayAvsBTemp[index].UserNameB+arrayAvsBTemp[index].UserNameA], function (err, replies) 
													{							    						    														
														if (isEmptyObject(replies[0]) && isEmptyObject(replies[1]))
														{																			
															d = new Date();
												    		createPositionTimelast = Math.floor(d.getTime());     		
															if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 
															&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0) 
															{				
																client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
																{  
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																			
																	} 																									  																		
																});
																
																client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
																{    														
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																		
																		redisarray.push(JSON.parse(replies));																			
																	}	  																		
																});
															}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 ) 
															{								
																client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
																{  
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																			
																	} 																									  																		
																});	
																
															}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0 )  
															{
																client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
																{    														
																	if (!replies){}else
																	{	
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));																				
																	}	  																		
																});
															}else
															{
																console.log("idUnitInLocations is already exist stand")
																redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].userFight = arrayAvsBTemp[index].idUnitInLocationsB;
																redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].CheckFight = 1;
																
															}																											
																																																												
														}else
														{
															console.log("===========La ban cua nhau=============");
														}																																																										
													});
												}
											});

										}
									}
								});							
																	
							}
						}
					});													
				}																			
			});

			socket.on('SENDUNITAoutB', function (data)
			{			
				currentSENDUNITAoutB =
				{
					idUnitInLocationsA:data.idUnitInLocationsA,				
					idUnitInLocationsB:data.idUnitInLocationsB,			
				}
				d = new Date();
	    		createPositionTimelast = Math.floor(d.getTime());   
	    		console.log("========================SENDUNITAoutB: "+currentSENDUNITAoutB.idUnitInLocationsA+" VS "
	    			+currentSENDUNITAoutB.idUnitInLocationsB+"_"+createPositionTimelast); 	    		
	    		var GameServer 		= require("./login");		    		
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;
	    		arrayAvsBFightOut.push(currentSENDUNITAoutB);	
	    		//console.log("Chieu dai mang hoan tat tam danh ======SENDUNITAoutB: "+ arrayAvsBFightOut.length);    			    		
	    		for (var i = 0; i < arrayAvsBFightOut.length; i++) 
	    		{	    			
	    			var index = i;    				    			
	    			if (arrayAvsB.length > 0) 
					{
						if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) 
						{																				
							//Cập nhật mảng đánh
							if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) {												
								arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA), 1);	
								arrayAvsBTemp.splice(arrayAvsBTemp.findIndex(item=>item.idUnitInLocationsA==arrayAvsBFightOut[index].idUnitInLocationsA),1);	
								redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBFightOut[index].idUnitInLocationsA)), 1);							
							}	
							console.log("Chieu dai redisarray hiện tại là: "+ redisarray.length);
							//kiểm tra user đang bị đánh
							if ((lodash.filter(redisarray,x => x.idUnitInLocations === parseFloat(arrayAvsBFightOut[index].idUnitInLocationsB))).length > 0) 
							{
								if (parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBFightOut[index].idUnitInLocationsB))].userFight.length)===0) 
								{
									redisarray.splice(redisarray.findIndex(item =>item.idUnitInLocations === parseFloat(arrayAvsBFightOut[index].idUnitInLocationsB)),1);
								}else
								{
									console.log(arrayAvsBFightOut[index].idUnitInLocationsB + " is fighting");
								}																							

							}
							
							const s = [1000];
							const asyncFunc = (timeout) => {
								return new Promise((resolve,reject) => {
									setTimeout(() => 
									{ 
											//cập nhật mysql
											var query=pool.query("UPDATE unitinlocations SET CheckFight = 0,userFight ='', TimeFight='"+createPositionTimelast
												+"'  WHERE idUnitInLocations = '"+parseFloat(arrayAvsBFightOut[index].idUnitInLocationsA)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 385');
												}else
												{  	
													if (result.affectedRows >0) 
													{
														//console.log("========Cap nhat thanh cong idUnitInLocationsA: "+arrayAvsBFightOut[index].idUnitInLocationsA);
														var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE`idUnitInLocations` = '"
																							+arrayAvsBFightOut[index].idUnitInLocationsA+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 386');
															}else
															{	
																if (rows.length > 0) 
																{	
																	//console.log("===========cap nhat redis thanh cong idUnitInLocationsA: "+arrayAvsBFightOut[index].idUnitInLocationsA);											
																	//cập nhật redis
																	client.set(arrayAvsBFightOut[index].idUnitInLocationsA,JSON.stringify(rows[0]));	
																	console.log("Chieu dai redisarray hiện tại là 1: "+ redisarray.length);																																						
																}																																						
															}
														})	

													}																																				
																							
												}
											})											
										
										resolve(); 
									}, timeout)
							    }).then(() => {
									return new Promise((resolve,reject) => {
									  setTimeout(() => { 									  		
									  	arrayAvsBFightOut = [];	
									  	console.log("Chieu dai redisarray hiện tại 2 là: "+ redisarray.length);								  	
									  	resolve(); 
									  }, timeout)
							        });
								});
							}
							s.reduce((promise, item) => {															
							  return promise.then(() => asyncFunc(item));
							}, Promise.resolve());	
						}
					}	    							
	    		}
	    	});   			        
        })
		cron.schedule('*/1 * * * * *',function()
		{			
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime() / 1000);
    		

			//Cập nhật tầm đánh 
			var query = pool.query("SELECT idUnitInLocations,Position FROM `unitinlocations` WHERE TimeCheck ='"+createPositionTimelast+"' ORDER BY `TimeCheck` DESC",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 479');				
				}else
				{
					if (rows.length > 0) 
					{
						for (var i = 0; i < rows.length; i++) 
						{				
							const s = [250],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = rows[i].Position.split(","), idUnitInLocations = rows[i].idUnitInLocations;
							const asyncFunc = (timeout) => {
								return new Promise((resolve,reject) => {
									setTimeout(() => { 
										var X = parseFloat(arrs[0]), 
										Y =parseFloat(arrs[1]), N=1;
										X = X - N;
										Y = Y + N;
										var TopLeft= X+","+Y;
										arrayS.push(TopLeft);
										for (var i = 0; i < (N*2); i++)
										{
											X +=1;
											arrayS.push(X+","+Y);
										}
										for (var k = 0; k < (N*2+1); k++)
										{
											var arr = arrayS[k].split(",");
											for (var i = 1; i < (N*2+1); i++)
											{
												var v =parseFloat(arr[1])-i;
												arrayS.push(arr[0]+","+v);
											}						
										}				
										
										resolve(); 
									}, timeout)
							    }).then(() => {
									return new Promise((resolve,reject) => {
									  setTimeout(() => { 
									  	var X = parseFloat(arrs[0]), 
										Y =parseFloat(arrs[1]), N=2;
										X = X - N;
										Y = Y + N;
										var TopLeft= X+","+Y;
										arrayS1.push(TopLeft);
										for (var i = 0; i < (N*2); i++)
										{
											X +=1;
											arrayS1.push(X+","+Y);
										}
										for (var k = 0; k < (N*2+1); k++)
										{
											var arr = arrayS1[k].split(",");
											for (var i = 1; i < (N*2+1); i++)
											{
												var v =parseFloat(arr[1])-i;
												if(arrayS.indexOf(arr[0]+","+v) > -1) {								
												}else
												{								
													arrayS1.push(arr[0]+","+v);			
												}							
											}						
										}	
									  	resolve(); 
									  }, timeout)
							        });
								}).then(() => {
									return new Promise((resolve,reject) => {
									  setTimeout(() => { 
									   	var X = parseFloat(arrs[0]), 
										Y =parseFloat(arrs[1]), N=3;
										X = X - N;
										Y = Y + N;
										var TopLeft= X+","+Y;
										arrayS2.push(TopLeft);
										for (var i = 0; i < (N*2); i++)
										{
											X +=1;
											arrayS2.push(X+","+Y);
										}
										for (var k = 0; k < (N*2+1); k++)
										{
											var arr = arrayS2[k].split(",");
											for (var i = 1; i < (N*2+1); i++)
											{
												var v =parseFloat(arr[1])-i;
												if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
												{								
												}else
												{								
													arrayS2.push(arr[0]+","+v);			
												}	
											}						
										}									
								  	resolve(); 
									  }, timeout)
							        });
								}).then(() => {
									return new Promise((resolve,reject) => {
									  setTimeout(() => { 								  	
										var query = pool.query('UPDATE unitinlocations SET FightRadiusPosition = ?, FightRadiusPosition1 = ?, FightRadiusPosition2 = ? WHERE idUnitInLocations = ?', [arrayS.toString(),arrayS1.toString(),arrayS2.toString(),parseFloat(idUnitInLocations)],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 480');
											}else
											{
												if (result.affectedRows> 0) 
												{
												}
												else
												{
													console.log('khong co time remain duoc cap nhat 481');
												}

											}
										})
									  	resolve(); 
									  }, timeout)
							        });
								});
							}
							s.reduce((promise, item) => {
							  return promise.then(() => asyncFunc(item));
							}, Promise.resolve());																	
						}
					}
				}
			});	

			//Check mảng redisarray
			if (redisarray.length > 0) 
			{
				console.log("Mang redisarray hien tai: "+redisarray.length);
				for (var i = 0; i < redisarray.length; i++) {
					var index = i;
					console.log(redisarray[index].idUnitInLocations+" VS "+redisarray[index].userFight.length+"_"+redisarray[index].CheckFight);
					console.log(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(redisarray[index].idUnitInLocations))].userFight.length);
				}
			}			
							
			//Thực hiện chức năng unit A đánh nhau B online
			if (arrayAvsB.length > 0) 
			{					
				var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameB,UnitOrderB,
				UserNameA,UnitOrderA,FarmRemain=0,QualityBegin=0, FarmTotal=0,
				FarmTotalA=0,FarmTotalB=0,AC; 
				var GameServer 		= require("./login");				
			    var gameServer 		= new GameServer();
			    exports.gameServer 	= gameServer;			  		
				for (var s = 0; s < arrayAvsB.length; s++) 
				{
					var index = s;								
					A=arrayAvsB[index].idUnitInLocationsA;
					UserNameA=arrayAvsB[index].UserNameA;
				 	UnitOrderA=arrayAvsB[index].UnitOrderA;	
				 	B=arrayAvsB[index].idUnitInLocationsB;	
					UserNameB=arrayAvsB[index].UserNameB;
					UnitOrderB=arrayAvsB[index].UnitOrderB;	
					//console.log(index+": ================================"+arrayAvsB[index].idUnitInLocationsA+" VS "+arrayAvsB[index].idUnitInLocationsB);		
					//console.log("Chieu dai mang danh duoc them vao: "+arrayAvsBTemp.length);								
					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(A)).length > 0 && lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(B)).length > 0) 
					{																
						QualityUnEqual = 0;					
						QualityUnEqual = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality,10);					
						if (QualityUnEqual < 1)
						{
							QualityUnEqual=1;
						}
						// Tính Defent tổng
						DefendSum = 0;					
						DefendSum = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);					
						if ((DefendSum % 1 ) >= 0.5)
						{
							DefendSum = Number((DefendSum).toFixed(0)); 								
						}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
						{
							DefendSum = Number((DefendSum).toFixed(0))+1;  								
						}else
						{
							DefendSum	= parseInt(DefendSum,10);  								
						}
						
						HealthRemain = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain,10)
						 -(parseFloat(QualityUnEqual)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10) 
						 	- parseInt(DefendSum,10)* parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10)); 														
									
						if (HealthRemain<=0)
						{																			
							io.emit('RECEIVEUNITAvsB',
							{
								idUnitInLocations: parseFloat(B),
								UserName:UserNameB,
								UnitOrder:parseFloat(UnitOrderB),
								HealthRemain:0,
								Quality:0,
								idUnitInLocationsA: parseFloat(A),
								FarmTotalA: parseInt(parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable),10),
					            FarmTotalB: 0,
							});		
							//xóa trong mảng đánh nhau
							if (arrayAvsB.length > 0) 
							{
								if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === B)).length > 0) 
								{
									//console.log("Cập nhật arrayAvsB: "+ B + " Thành công");
									arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsB === B), 1);
									//arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === B), 1);														
								}	
							}								   			
							//Xóa trong database
							var query = pool.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ? ',
							[B],function(error, result, field)
						  	{
								if(!!error)
								{
									console.log('Error in the 482');
								}else
								{
									if(result.affectedRows > 0)
									{	
										//Cập nhật unit oder cho user bi đánh								
										var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder-1  WHERE `UserName` = '"+UserNameB+"'AND `UnitOrder` > '"+UnitOrderB+"'",function(error, result, field)
										{
											if(!!error)
											{
		      									console.log('Error in the query 483');
											}else
											{																																				

											}
										})		
										var FarmPortableWin = parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);
										//Cập nhật trang thái cho unit đánh bại online
										var query = pool.query("UPDATE unitinlocations SET  Quality ='"+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality)
											+"',FarmPortable ='"+parseFloat(FarmPortableWin)
											+"',checkFight = 0, userFight = '' WHERE idUnitInLocations = ?",[parseFloat(A)],function(error, result, field)
										{
											if(!!error)
											{
		      									console.log('Error in the query 484');
											}else
											{	
												//console.log("Cập nhật idUnitInLocationsB: "+ B + " Thành công");													
												//cập nhật lại redis va memmory
												redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable = parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);					
												//cập nhật redis và data base																												
												client.set(A,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))]));

												//xóa torng redis	
												redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);					
												redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);																															
												//console.log("Cập nhật idUnitInLocationsB: "+ B + " Thành công 1");
												//xóa trong redis
												client.del(B);			
												arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === B), 1);								
												//console.log("Cập nhật idUnitInLocationsB: "+ B + " Thành công 2");
											}
										})

										//cập nhật trạng thái cho unit đang đánh	
										var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE userFight = ?',
										[B],function(error, result, field)
										{if(!!error){console.log('Error in the query 488');}else{}
										})
									}else
									{
										console.log('khong co gi update 485');
									}
								}
							})

						}else
						{

							//Tính các thông số sau khi đánh nhau
							QualityRemain = 0;	
							QualityBegin = parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality);							
							QualityRemain = parseInt(HealthRemain,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);							
							if ((QualityRemain % 1 ) >= 0.5)
							{
								QualityEnd = Number((QualityRemain).toFixed(0));  									
							}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
							{
								QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
							}else
							{
								QualityEnd	= parseInt(QualityRemain,10);  									
							}													
							AC=parseFloat(QualityBegin)/parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);						
							FarmTotal=(parseFloat(QualityBegin)-parseFloat(QualityEnd))/AC;							
							FarmTotalA=parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(FarmTotal);
		       			    FarmTotalB=parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable)-parseFloat(FarmTotal);						
		       			    //console.log(A+" Farm la: "+ FarmTotalA);
		       			   // console.log(B+" Farm la: "+ FarmTotalB+" Mau hien tai: "+HealthRemain);
							//Gửi lên client
					        io.emit('RECEIVEUNITAvsB',
					        {
					            idUnitInLocations:parseInt(B),
					            UserName:UserNameB,
					            UnitOrder:parseFloat(UnitOrderB),
					            HealthRemain:HealthRemain,
					            Quality:QualityEnd,
					            idUnitInLocationsA: parseFloat(A),
					            FarmTotalA: parseInt(FarmTotalA,10),
					            FarmTotalB: parseInt(FarmTotalB,10),
					        });	    

					        //cập nhật mảng redis
							DamageRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DamageEach,10);						
							DefendRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10);						
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain = HealthRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Damage = DamageRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Defend = DefendRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality = QualityEnd;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable = FarmTotalA;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable = FarmTotalB;						
							//cập nhật redis và data base																					
							client.set(B,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))]));
							client.set(A,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))]));														

							//cập nhật my sql																       	
					       	d = new Date();
							createPositionTimelast = Math.floor(d.getTime() / 1000);							         
							var query = pool.query("UPDATE unitinlocations SET HealthRemain = '"+parseFloat(HealthRemain)
								+"' , Damage = '"+parseFloat(DamageRemain)
								+"' , Defend = '"+parseFloat(DefendRemain)
								+"' , Quality = '"+parseFloat(QualityEnd)
								+"', TimeFight = '"+parseFloat(createPositionTimelast)
								+"', FarmPortable = '"+parseFloat(FarmTotalB)								
								+"'WHERE idUnitInLocations = '"+parseFloat(B)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 486');
								}else
								{}
							}) 	
							var query = pool.query("UPDATE unitinlocations SET TimeFight = '"+parseFloat(createPositionTimelast)													
								+"', FarmPortable = '"+parseFloat(FarmTotalA)
								+"',CheckFight = 1 WHERE idUnitInLocations = '"+parseFloat(A)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 487');
								}else
								{}
							})								 															
						}
					}else
					{					
						io.emit('RECEIVEUNITAvsB',
						{
							idUnitInLocations: parseFloat(B),
							UserName:UserNameB,
							UnitOrder:parseFloat(UnitOrderB),
							HealthRemain:0,
							Quality:0,
							idUnitInLocationsA: parseFloat(A),
						});	
						if (arrayAvsB.length > 0) 
						{
							if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === A)).length > 0) 
							{						
								arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === A), 1);	
								redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);
								//Cập nhật trang thái cho unit đánh unit online sau khi đã bại trận
								var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
								[A],function(error, result, field)
								{if(!!error){console.log('Error in the query 488');}else{}
								})	
								//cập nhật trạng thái cho unit đang đánh	
								var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE userFight = ?',
								[B],function(error, result, field)
								{if(!!error){console.log('Error in the query 488');}else{}
								})

							}	

						}

					}
				}
			}

		}); 
    }
}
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
} 