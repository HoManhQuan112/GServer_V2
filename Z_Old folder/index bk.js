'use strict';
var express			= require('express');
var app				= express();
var server			= require('http').createServer(app);
var io 				= require('socket.io').listen(server);
io.sockets.setMaxListeners(15);
var shortId 		= require('shortid');
var mysql           = require("mysql");
var Chance  		= require('chance');
const nodemailer 	= require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var shortId 		= require('shortid');
var cron 			= require('node-cron');
var CronJob 		= require('cron').CronJob;
var sortBy 			= require('sort-by');
var lodash		    = require('lodash');
var Promise 		= require('promise');
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var datetime 		= require('node-datetime');
var crypto 			= require('crypto');
var async 			= require("async");
var threads 		= require('threads');
var spawn   		= threads.spawn;
var thread  		= spawn(function() {});
const fs   			= require('fs');

//setup database
var pool 			= require('./db');

//đăng kí user mới
var register 		= require('./register');
	register.start(io);

//lấy lại mật khẩu
var recoverpass     = require('./recoverpass');
	recoverpass.start(io);

//nâng cấp tài nguyên và lính
var upgrade			= require('./upgrade');
	upgrade.start(io);

//mua lính trong thành
var unitinbase		= require('./unitinbase');

//thu hoạch tài nguyên
var harvest 		= require('./harvest');

//lấy dữ liệu client
var client 			= require('./redis');

//mua user base
var userbase 		= require('./userbase');
	userbase.start(io);

//quản lý guild
var guildmanager	= require('./guildmanager');
	guildmanager.start(io);

//nhận và gửi dữ liệu chat
var chatting 		= require('./chatting');
	chatting.start(io);

//danh sách đen
var blacklist 		= require('./blacklist');
	blacklist.start(io);

//di chuyển
var move 	 		= require('./move');
	move.start(io);

//đồng bộ di chuyển
var sync 	 		= require('./sync');
	sync.start(io);

//hồi phục máu
var healthrecover 	= require('./healthrecover');
	healthrecover.start(io);

//var login 	 		= require('./login');
//login.start(io);

//Trao đổi tài nguyên
var resourcetransfer = require('./resourcetransfer');

//thực hiện chức năng kết bạn
var addfriend 		= require('./addfriend');  

//các hàm được thực hiện trong game
var functions 		= require("./functions");

app.set('port', process.env.PORT);
server.listen(process.env.PORT);
var clients	= [],redisarray = [];

var lastPosition="",numberDistanceMine,numberDistance,checkResetMine,timeSend=0, hourReset=11,minuteReset = 56,seconReset=0,timeResetMines = '00 56 11 * * 0-6';
var parseN = 10, limitNumber = 200,MineHarvestServer=0;
var d,createPositionTimelast, arrayFightOffline = [], arrayFightOnlinevsOffline = [], arrayFightOnlinevsOnline = [], arrayAvsB = [],
arrayAvsBTemp = [],arrayAvsBFightOut = [],arrayRequestJoinGuild=[];

if (app.get('port') === process.env.PORT)
{	

	io.on('connection', function (socket)
	{	
		//console.log(socket);
		var portIdarray =[3000,4000,5000,6000,7000];
		var portId,numRows,HealthRecover=0,UnitTime=0,FarmPortableMove=0,currentUser,currentBaseSend,currentSENDADDFRIEND,currentdisconect,currentSENDACCEPTFRIEND,currentSENDUNITAvsB,
			currentSENDUNITAoutB,currentSYNCANIMATION,currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove,currentSENDPOSITIONFIGHTONLINEvsOFFLINE,currentSENDPOSITIONFIGHTONLINE,
			currentSENDPOSITIONFIGHTONLINEoutOFFLINE,currentSENDPOSITIONFIGHTOFFLINEvsONLINE,currentSENDPOSITIONCLICK,UnitOrderZero,currentSENDFIGHTINGUNIT,
			currentSENDEXCHANGECHECKUNITINLOCATION,currentSENDCHECKUNITINLOCATION,currentSENDCHECKTIMEWAITINBASE,currentSENDCHECKUNITINBASE,currentSENDRECOVERPASSWORD,
			currentCONFIRMRECOVERPASSWORD,currentSENDUNITINLOCATIONSCOMPLETE,currentBaseComplete,timeLogin,timeLogout,timeRemains,timeRemaincomplete,timeResetMine,idLastPage, 
			checkResetM,UserNameLogin,EmailLogin,PortLogin;
		var userPosition="", newLocation ="",newLocationMine ="",dataTest ="",dataTestExchange ="",idUnitInLocationstemp,unitTypeShare,LevelShare,UnitOrderShare,UserNameExchange,QualityShare,HealthEachShare,FarmEachShare,FarmPortableShare,HealthRemailShare,
			HealthExchangeLeft,HealthExchangeRight,TimeCheckMove,FarmConsumeChangePositionDuplicate;
		var picked ="", pickedMine = "", pickedMineUser = "",EmailSend="", X,Z,XB,ZB,XL,ZL,timeMoves,APosition,A,A1,A2,BPosition,CPosition,C,C1,C2,B,B1,B2,HealthRemain,F="",FU="",SU="",S="",C=""
			,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,X2,Z2,timeMoves2,APosition2,A2,A12,A22,BPosition2,B2,B12,B22;
		var createPositionTime = 0, idLastBase, timeCompleteClient=0,unitTimeCompleteServer=0,m=0,FarmTransferRemain=0,WoodTransferRemain=0,StoneTransferRemain=0,MetalTransferRemain=0,
			FarmTransferSurpass=0,WoodTransferSurpass=0,StoneTransferSurpass=0,MetalTransferSurpass=0,FarmConsumeInOffline,FarmRemainInOnline;
		var arrayUserLogin = [], arrayAllUser = [],arrayAllUserposition = [],arrayAllMinepositionTrue = [],arrayBaseResource = [],arrayUserBaseResource = [],arrayAllPositionclick = [],
			arrayMineposition = [],arrayMineId = [], arrayAllMine = [], arrayAllMineName = [],arrayAllUsers=[],arrayWaitingFriend=[],arrayAllResourceToDiamond=[],
			arrayAllMinePosition = [], arrayAllMineMerger = [],arrayidResource =[],arrayBaseUser =[],
			arrayUserName, arrayidCity, arrayUnitType, arrayQuality, arrayQualityunit, arrayLevel,arrayUnitBaseUser =[],arrayUnitWaitBaseUser =[],arrayPositionClickUser =[],arraychecksend =[],
			arrayUserNames=[], arrayidCitys=[], arrayUnitTypes=[], arrayQualitys=[], arrayLevels=[],arrayAddedFriend=[],arrayCancelFriend =[],arrayWaitedFriend=[],
			arrayUserNamecomplete=[], arrayidCitycomplete=[], arrayUnitTypecomplete=[], arrayQualitycomplete=[], arrayLevelcomplete=[],
			arrayFarmBase=[], arrayWoodBase=[], arrayStoneBase=[], arrayMetalBase=[], arrayLevelBase=[],
			arrayFarmSpent=[], arrayWoodSpent=[], arrayStoneSpent=[], arrayMetalSpent=[],arrayTimeUnitComplete=[],arrayAllresourcebuyunit =[],arraytest =[],arraycheckUserlg=[],
			arrayUnitLocationsComplete=[],arrayAllUnitLocationsComplete=[],arrayAllUnitLocationsCompletefirst=[],arrayAllPositionchange=[],
			arraycheckUserlg = [],arrayAllCheckTimelg = [],arrayAllresourceupbase = [],arrayAllresourceupmine = [],arrayAllresourceupSwordman = [],arrayAllresourceupFarm=[],
			arrayAllresourceupWood=[],arrayAllresourceupStone=[],arrayAllresourceupMetal=[],arrayAllresourceupBowman=[],arrayAllresourceupGranary=[],arrayAllresourceupMarket=[],
			arrayAllresourceupCityWall=[],arrayAllresourceupCrossbow=[],arrayAllresourceupHorseman=[],arrayAllresourceupTower=[],arrayAllresourceupSpearman=[],arrayAllresourceupShaman=[],
			arrayAllresourceupBallista=[],arrayAllresourceupBatteringRam=[],arrayAllresourceupTrebuchet=[],arrayAllresourceupHorseArcher=[],arrayAllresourceupElephantArcher=[],
			arrayAllresourceupCavalry=[],arrayAllresourceupBattleElephant=[],arrayAllresourcebuybase=[],arrayAllresourceupguild=[],arrayAllGuildList=[],arrayAllRequestJoinGuildByUser=[]
			,arrayAllMemberGuild=[],arrayAllInviteByGuild=[],arrayTimeTransferFarmfromBaseToUnit=[],arrayPolicy=[],arrayNotisyStatus=[],arrayMessGuildMember=[],arrayMessPrivateMember=[],arrayBlackList=[],arrayBlockedBlackListByUser=[];			

			//gửi socket cho các class 	
			unitinbase(socket);
			resourcetransfer(socket);		
			harvest(socket);
			addfriend(socket);	
		
		socket.on('USER_CONNECT', function ()
		{
			console.log('Users Connected ');						
			for (var i = 0; i < clients.length; i++)
			{				
				console.log('User name '+clients[i].name+"_"+clients[i].idSocket+' is connected..');
			};
			//lấy thời gian trả về cho client
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime > 0",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 1');
				}else
				{
					if (rows.length>0) 
					{															
									
	  					socket.emit('RECEIVEDETAILRESET',
						{
							arrayResetServer:1,
							DetailTime: parseFloat(rows[0].DetailTime),
	                	});						 
					}else
					{									
	  					socket.emit('RECEIVEDETAILRESET',
						{
							arrayResetServer:0,
							DetailTime:0,
	                	});	
					}				

				}
			})				
		});		

		function GameServer() {
		    // Startup
		    this.clients = clients;	  
		    this.redisarray = redisarray;      		   	    
		}
		module.exports =  exports = GameServer;
		
		socket.on('Login', function (data)
		{		
			var s,arrayOnlineStatus =[];			
			currentUser =
			{
				name:data.name,
				password:data.password,
				modelDevide: data.modelDevide,	
				ramDevide: data.ramDevide,			
				id:shortId.generate(),				
				idSocket:socket.id,

			}			
			
			pool.getConnection(function(err,connection)
			{
		        if (err)
		        {
		          return;
		        }	
		        //Cập nhật thông tin thiết bị cài
		        connection.query("UPDATE users SET modelDevide ='"+currentUser.modelDevide
    			+"',ramDevide ='"+parseFloat(currentUser.ramDevide)
    			+"'WHERE `UserName` = '"+currentUser.name+"'",function(error, result, field)
				{
					if(!!error)
					{
						console.log('Error in the query 2');
					}else
					{
						if (result.affectedRows>0) 
						{							
						}else
						{
							console.log("Cập nhật thông tin thiết bị không thành công");
						}
					}
				});

		        connection.query("SELECT * FROM `unitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the query 3');
					}else
					{
						if (rows.length>0) 
						{

							for (var i = 0; i < rows.length; i++)
							{
								//cập nhật trao đổi unit giữa các base
								connection.query("SELECT * FROM `unitinbase` WHERE `UserName`='"+rows[i].UserName
									+"'AND numberBase = '"+parseFloat(rows[i].numberBase)
									+"'AND UnitType = '"+parseFloat(rows[i].UnitType)
									+"'AND Level = '"+parseFloat(rows[i].Level)+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the query 4');									
										
									}else
									{	
										d = new Date();
										createPositionTimelast = Math.floor(d.getTime() / 1000);

										if (rows.length > 0 
											&& (parseFloat(createPositionTimelast) < parseFloat(rows[0].TimeCompleteUnitMoveSpeed))
											) 
										{																					
											//cập nhật lai giây
											connection.query("UPDATE unitinbase SET TimeWaitUnitMoveSpeed ='"+ (parseFloat(rows[0].TimeCompleteUnitMoveSpeed)-parseFloat(createPositionTimelast))			                					        						                				                						                				                			
						        			+"'where UserName = '"+rows[0].UserName
						        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
											+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
											+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 5');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{

													}
												}
											});
										} else if (rows.length >0 
											&&(parseFloat(createPositionTimelast) >= parseFloat(rows[0].TimeCompleteUnitMoveSpeed))
											&&(parseFloat(rows[0].TimeCompleteUnitMoveSpeed)>0)
											)
										{											
											connection.query("UPDATE unitinbase SET Quality = Quality + '"+ (parseFloat(rows[0].QualityWait))			                					        						                				                						                				                			
						        			+"'where UserName = '"+rows[0].UserName
						        			+"'AND numberBase = '"+parseFloat(rows[0].numberBaseReceive)		        			
											+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
											+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 6');
												}else
												{
													if (result.affectedRows>0) 
													{
														//update															
														connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
									        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
														+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
														+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 7');
															}else
															{
																if (result.affectedRows>0) 
																{
																	//update																		
																	connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 8');
																		}else
																		{
																			if(result.affectedRows > 0)
																			{
																			}
																		}
																	});

																}else
																{
																	//insert
																}

															}
														});

													}else
													{														
														//insert
														connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `QualityWait`, `Level`, `numberBaseReceive`, `TimeCompleteUnitMoveSpeed`, `TimeWaitUnitMoveSpeed`) VALUES ('"+""+"','"
														+rows[0].UserName+"','"+rows[0].numberBaseReceive+"','"+rows[0].UnitType+"','"+rows[0].QualityWait+"','"+0+"','"+rows[0].Level+"','"+0+"','"+0+"','"+0+"')",function(error, result, field)
														{
												            if(!!err)
												            {
												            	console.log('Error in the query 9');
												            }else
												            {
												            	if (result.affectedRows>0) 
												            	{		
												            		console.log("==========Insert unitinbase thanh cong========");										            		
												            		//cập nhật lại qualitu wait
												            		connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
												        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
																	+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
																	+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 10');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				//update																					
																				connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																				{
																					if(!!error)
																					{																						
																					}else
																					{
																						if(result.affectedRows > 0)
																						{
																						}
																					}
																				});															
																			}else
																			{																				
																				//insert
																			}

																		}
																	});
												            	}else
												            	{												            		

												            	}
												            }
												        });
													}

												}
											});


										}else
										{																										
										}
									}
								});

							}
						}
						
					}
				});

				//update time transfer farm from userbase to unit location
				connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the query 11');
					}else
					{
						if (rows.length>0) 
						{
							for (var i = 0; i < rows.length; i++)
							{	        					
	        					d = new Date();
				    			createPositionTimelast = Math.floor(d.getTime() / 1000);
				    			//tính toán lượng farm di chuyển
				    			if ( parseFloat(rows[i].FarmTransferCompleteTime)> parseFloat(createPositionTimelast))  
				    			{
				    				//còn thời gian					    						    					;
				    				connection.query("UPDATE `unitinlocations` SET TransferCompleteTotalTime = '"+(parseFloat(rows[i].FarmTransferCompleteTime)-parseFloat(createPositionTimelast)) 
				    					+"' where UserName = '"+rows[i].UserName
		                				+"'AND UnitOrder = '"+rows[i].UnitOrder+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 12');
										}else
										{
											if (result.affectedRows>0) 
											{												
											}else
											{
												console.log("update khong thanh cong 13");
											}
										}
									});
				    			}else if (( parseFloat(rows[i].FarmTransferCompleteTime)> parseFloat(createPositionTimelast)) &&( parseFloat(rows[i].FarmTransferCompleteTime)> 0))
				    			{
				    				//hoàn tất thời gian				    							    										    				
				    				connection.query("UPDATE userbase,unitinlocations SET unitinlocations.FarmPortable = unitinlocations.FarmPortable + unitinlocations.FarmWait,userbase.TransferUnitOrderStatus = '"+ 0								
		                			+"',unitinlocations.FarmWait = '"+ 0                			
		                			+"',unitinlocations.FarmTransferCompleteTime = '"+0
		                			+"',unitinlocations.TransferCompleteTotalTime = '"+0				                				                						                				                			
		                			+"'where userbase.UserName = unitinlocations.UserName AND userbase.UserName ='"+currentUser.name
		                			+"'AND userbase.numberBase = '"+rows[i].numberBaseTransfer
		                			+"' AND unitinlocations.UnitOrder ='"+rows[i].UnitOrder+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 14');
										}else
										{
											if (result.affectedRows>0) 
											{																					
											}else
											{										
												
												socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
												{
							                		message : 0
							            		});
												console.log("gửi mail 15");
											}
										}
									});			    				
				    			}
				    			

				    		}

						}else
						{							
						}
						
			    	}
			    });

		        //update time upgrate
				connection.query("SELECT * FROM `userbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the query 24');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
							var index = i;        					
        					d = new Date();
			    			createPositionTimelast = Math.floor(d.getTime() / 1000);
			    			if ( parseFloat(rows[index].TimeWaitSum)> parseFloat(createPositionTimelast))  
			    			{
			    				connection.query("UPDATE userbase SET TimeWait = '"+parseFloat(parseFloat(rows[index].TimeWaitSum)-parseFloat(createPositionTimelast)) 
			    					+"' where UserName = '"+rows[index].UserName
	                				+"'AND numberBase = '"+rows[index].numberBase+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 25');
									}else
									{
										if (result.affectedRows>0) 
										{
											
										}else
										{
											console.log("update khong thanh cong 16");
										}

									}
								});

			    			}			    			
			    			//Cập nhật khi còn thời gian chuyển tài nguyên cho bạn
			    			if ( parseFloat(rows[i].TimeCompleteResourceTransferFromFriend)> parseFloat(createPositionTimelast))  
			    			{
			    				connection.query("UPDATE userbase SET TimeRemainResourceTransferFromFriend = '"+(parseFloat(rows[i].TimeCompleteResourceTransferFromFriend)-parseFloat(createPositionTimelast)) +"' where UserName = '"+rows[i].UserName
	                			+"'AND numberBase = '"+rows[i].numberBase+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 55');
									}else
									{
										if (result.affectedRows>0) 
										{											
										}else
										{
											console.log("update khong thanh cong 56");
										}

									}
								});

			    			}
			    			

			    			//cập nhật farm thu hoach	
			    			var index = i;					
							connection.query("SELECT A.Farm,A.LvFarm,A.UserName,A.numberBase,A.FarmHarvestTime,A.CurrentLvFarm, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupfarm AS B ON B.Level =  A.CurrentLvFarm WHERE A.UserName = '"+rows[index].UserName
								+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
							{
								if (!!error)
								{									
									socket.emit('RECIEVEHARVEST', 
									{
				                		message : 0
				            		});
									console.log("gửi mail 57");
								}else
								{				
													
									if (rows.length > 0 && (parseFloat(rows[0].LvFarm)===parseFloat(rows[0].CurrentLvFarm))) 
									{											
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);			    						
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																													
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 58');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{
														console.log("update khong thanh cong 59");
													}
												}
											});																			

										}else
										{											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}		                		
					                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(MineHarvestServer))									                			
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 60');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 61");
														}

													}
												});										
											
										}
										
									} else if (rows.length > 0 && (parseFloat(rows[0].LvFarm)>parseFloat(rows[0].CurrentLvFarm))) 
									{												
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);							
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																												
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 62');
												}else
												{
													if (result.affectedRows>0) 
													{
														
													}else
													{
														console.log("update khong thanh cong 63");
													}
												}
											});																			

										}else
										{
											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}										
																															
					                		//update tài nguyên còn lại của base						                						                		
					                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(MineHarvestServer))					                									                						                	
					                			+"'where UserName = '"+rows[0].UserName
				                				+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 64');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 65");
														}

													}
												});										
										
										}
										
									}else
									{
									}
								}

							}); 
							//cập nhật Wood thu hoach	
							connection.query("SELECT A.Wood,A.LvWood,A.UserName,A.numberBase,A.WoodHarvestTime,A.CurrentLvWood, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupwood AS B ON B.Level =  A.CurrentLvWood WHERE A.UserName = '"+rows[index].UserName
								+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 66');									
								}else
								{				
													
									if (rows.length > 0 && (parseFloat(rows[0].LvWood)===parseFloat(rows[0].CurrentLvWood))) 
									{												
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);			    						
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																													
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 67');
												}else
												{
													if (result.affectedRows>0) 
													{
														
													}else
													{
														console.log("update khong thanh cong 68");
													}
												}
											});																			

										}else
										{											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}																																											
						                			                		
					                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(MineHarvestServer))									                			
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 69');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 70");
														}

													}
												});										
											
										}
										
									} else if (rows.length > 0 && (parseFloat(rows[0].LvWood)>parseFloat(rows[0].CurrentLvWood))) 
									{												
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);							
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																											
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 71');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{
														console.log("update khong thanh cong 72");
													}
												}
											});																			

										}else
										{
											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}										
																															
					                		//update tài nguyên còn lại của base
					                				                		
					                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(MineHarvestServer))					                									                						                	
					                			+"'where UserName = '"+rows[0].UserName
				                				+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 73');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 74");
														}

													}
												});										
										
										}
										
									}else
									{
									}
								}

							}); 
							//cập nhật Stone thu hoach
							connection.query("SELECT A.Stone,A.LvStone,A.UserName,A.numberBase,A.StoneHarvestTime,A.CurrentLvStone, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupstone AS B ON B.Level =  A.CurrentLvStone WHERE A.UserName = '"+rows[index].UserName
								+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 75');
									
								}else
								{				
													
									if (rows.length > 0 && (parseFloat(rows[0].LvStone)===parseFloat(rows[0].CurrentLvStone))) 
									{											
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);			    						
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																													
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 76');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{
														console.log("update khong thanh cong 77");
													}
												}
											});																			

										}else
										{											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}																																									
						                			                		
					                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(MineHarvestServer))									                			
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 78');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 79");
														}

													}
												});										
											
										}
										
									} else if (rows.length > 0 && (parseFloat(rows[0].LvStone)>parseFloat(rows[0].CurrentLvStone))) 
									{											
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);							
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																												
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 80');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{
														console.log("update khong thanh cong 81");
													}
												}
											});																			

										}else
										{
											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}										
																															
					                		//update tài nguyên còn lại của base						                						                		
					                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(MineHarvestServer))					                									                						                	
					                			+"'where UserName = '"+rows[0].UserName
				                				+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 82');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 83");
														}

													}
												});										
										
										}
										
									}else
									{
									}
								}

							}); 

							//cập nhật metal thu hoach
							connection.query("SELECT A.Metal,A.LvMetal,A.UserName,A.numberBase,A.MetalHarvestTime,A.CurrentLvMetal, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupmetal AS B ON B.Level =  A.CurrentLvMetal WHERE A.UserName = '"+rows[index].UserName
								+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 84');									
								}else
								{				
													
									if (rows.length > 0 && (parseFloat(rows[0].LvMetal)===parseFloat(rows[0].CurrentLvMetal))) 
									{											
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);			    							
			    						
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																													
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 85');
												}else
												{
													if (result.affectedRows>0) 
													{
														
													}else
													{
														console.log("update khong thanh cong 86");
													}
												}
											});																			

										}else
										{											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}																																									
						                			                		
					                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(MineHarvestServer))									                			
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 87');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 88");
														}

													}
												});										
											
										}
										
									} else if (rows.length > 0 && (parseFloat(rows[0].LvMetal)>parseFloat(rows[0].CurrentLvMetal))) 
									{											
										d = new Date();
			    						createPositionTimelast = Math.floor(d.getTime() / 1000);							
										if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
										{																													
					                		//update tài nguyên còn lại của base					                		
					                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
					                			+"'where UserName = '"+rows[0].UserName
					                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 89');
												}else
												{
													if (result.affectedRows>0) 
													{														
													}else
													{
														console.log("update khong thanh cong 90");
													}
												}
											});																			

										}else
										{
											
											d = new Date();
				                			createPositionTimelast = Math.floor(d.getTime() / 1000);			                			
											MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
											if ((MineHarvestServer % 1 ) >= 0.5)
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0));
											}else
											{
												MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
											}											
																															
					                		//update tài nguyên còn lại của base						                			
					                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(MineHarvestServer))					                									                						                	
					                			+"'where UserName = '"+rows[0].UserName
				                				+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 91');
													}else
													{
														if (result.affectedRows>0) 
														{															
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong 92");
														}

													}
												});										
										
										}
										
									}else
									{
									}
								}

							}); 

							//cập nhật trao đổi tài nguyên giữa các base
							connection.query("SELECT UserName,numberBase,FarmWait,WoodWait,StoneWait,MetalWait,TimeCompleteResourceMoveSpeed,ResourceTransferToBase FROM userbase WHERE UserName = '"+rows[index].UserName+"'AND numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 94');									
								}else
								{				
										
									d = new Date();
			    					createPositionTimelast = Math.floor(d.getTime() / 1000);			
									if (rows.length > 0 && (parseFloat(createPositionTimelast)<parseFloat(rows[0].TimeCompleteResourceMoveSpeed))) 
									{	
										connection.query("UPDATE userbase SET TimeWaitResourceMoveSpeed = '"+ (parseFloat(rows[0].TimeCompleteResourceMoveSpeed)-parseFloat(createPositionTimelast))								                							                						                		
				                			+"'where UserName = '"+rows[0].UserName
				                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 95');
											}else
											{
												if (result.affectedRows>0) 
												{													
												}else
												{
													console.log("trao đổi tài nguyên giữa các base update khong thanh cong 96");
												}
											}
										});	
									}if (rows.length > 0 
										&& (parseFloat(createPositionTimelast)>=parseFloat(rows[0].TimeCompleteResourceMoveSpeed))
										&& (parseFloat(rows[0].TimeCompleteResourceMoveSpeed)>0)) 
									{
										//update từng tài nguyên còn lại của base						
										connection.query("SELECT A.UserName,A.numberBase,A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+rows[0].UserName+"'AND A.numberBase = '"+parseFloat(rows[0].numberBase)
											+"' UNION ALL SELECT A.UserName,A.numberBase,A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+rows[0].UserName+"'AND A.numberBase = '"+parseFloat(rows[0].ResourceTransferToBase)+"'",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 97');				
											
											}else
											{	

												if (rows.length > 0) 
												{
													d = new Date();
													createPositionTimelast = Math.floor(d.getTime() / 1000);
													
														//kiểm tra max store cho từng tài nguyên
														if ((parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) >=  parseFloat(rows[1].MaxStorage)) 
														{
															FarmTransferSurpass = (parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) - parseFloat(rows[1].MaxStorage);
															FarmTransferRemain = parseFloat(rows[0].FarmWait) - FarmTransferSurpass;
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Farm = Farm +'"+parseFloat(FarmTransferRemain)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 98');
																}else
																{
																	if (result.affectedRows>0) 
																	{																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET Farm = Farm +'"+FarmTransferSurpass+"',FarmWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 99');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																																		
																				}else
																				{
																					console.log("update khong thanh cong Farm 100");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong Farm 101");
																	}

																}
															});
														}else
														{
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Farm = Farm + '"+parseFloat(rows[0].FarmWait)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 102');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET FarmWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 103');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																				}else
																				{
																					console.log("update khong thanh cong 104");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong 105");
																	}

																}
															});

														}

														if ((parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait)) >=  parseFloat(rows[1].MaxStorage)) 
														{
															WoodTransferSurpass = (parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait)) - parseFloat(rows[1].MaxStorage);
															WoodTransferRemain = parseFloat(rows[0].WoodWait) - WoodTransferSurpass;
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Wood = Wood +'"+parseFloat(WoodTransferRemain)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 106');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET Wood = Wood +'"+WoodTransferSurpass+"',WoodWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 107');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																					
																				}else
																				{
																					console.log("update khong thanh cong Wood 108");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong Wood 109");
																	}

																}
															});
														}else
														{
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Wood = Wood +'"+ parseFloat(rows[0].WoodWait)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 110');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET WoodWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 111');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																				}else
																				{
																					console.log("update khong thanh cong 112");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong 113");
																	}

																}
															});

														}

														if ((parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait)) >=  parseFloat(rows[1].MaxStorage)) 
														{
															StoneTransferSurpass = (parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait)) - parseFloat(rows[1].MaxStorage);
															StoneTransferRemain = parseFloat(rows[0].StoneWait) - StoneTransferSurpass;
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Stone = Stone +'"+parseFloat(StoneTransferRemain)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 114');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET Stone = Stone +'"+StoneTransferSurpass+"',StoneWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 115');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																					
																				}else
																				{
																					console.log("update khong thanh cong Stone 116");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong Stone 117");
																	}

																}
															});
														}else
														{
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Stone = Stone+ '"+parseFloat(rows[0].StoneWait)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 118');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET StoneWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 119');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																				}else
																				{
																					console.log("update khong thanh cong 120");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong 121");
																	}

																}
															});

														}

														if ((parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait)) >=  parseFloat(rows[1].MaxStorage)) 
														{
															MetalTransferSurpass = (parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait)) - parseFloat(rows[1].MaxStorage);
															MetalTransferRemain = parseFloat(rows[0].MetalWait) - MetalTransferSurpass;
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Metal = Metal +'"+parseFloat(MetalTransferRemain)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 122');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET Metal = Metal +'"+MetalTransferSurpass+"',MetalWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 123');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																					
																				}else
																				{
																					console.log("update khong thanh cong Metal 124");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong Metal 125");
																	}

																}
															});
														}else
														{
															//update tài nguyên còn lại của base							
															connection.query("UPDATE userbase SET Metal = Metal +'"+parseFloat(rows[0].MetalWait)									
																+"' where UserName = '"+rows[0].UserName				    		
												    			+"'AND numberBase = '"+parseFloat(rows[1].numberBase)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 126');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		 
																		//Cập nhật base gửi
																		connection.query("UPDATE userbase SET MetalWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
															    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 127');
																			}else
																			{
																				if (result.affectedRows>0) 
																				{																					
																				}else
																				{
																					console.log("update khong thanh cong 128");
																				}

																			}
																		});
																	}else
																	{
																		console.log("update khong thanh cong 129");
																	}

																}
															});

														}

														
													
														
												}else
												{
													socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
													{
								                		message : 0
								            		});
								            		console.log("gửi mail 130");
												}
											}
										});


									}else
									{

									}
								}
							});
							
							

			    		}
			    	}
			    });   

		        connection.query("SELECT * FROM `users` WHERE `UserName`='"+currentUser.name+"' AND `UserPass`='"+currentUser.password+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query 131');
					}else
					{						
						if (rows.length>0)
						{
							arrayUserLogin = rows;							
							if ( (lodash.filter(clients, x => x.name === currentUser.name)).length <= 0) 
								{
									UserNameLogin = rows[0].UserName;
									EmailLogin =  rows[0].UserEmail;
									PortLogin = rows[0].Port;
									var today = new Date();
									var CheckMove, CheckMoveOff;

									//thời gian mỗi ngày reset
									var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, seconReset);
									var resetMine = Math.floor(myToday.getTime() / 1000);

									//thời gian mỗi ngày reset công thêm 1 ngày
									var myTodaynext = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, hourReset, minuteReset, seconReset);
									var resetMineNext = Math.floor(myTodaynext.getTime() / 1000);

									//thời gian hiện tại
									var timeNow = Math.floor(today.getTime() / 1000);

									if(timeNow < resetMine)
									{
										timeSend = resetMine - timeNow;
									}else
									{
										timeSend = resetMineNext - timeNow;
									}
										
									connection.query("SELECT * FROM `userbase` where `Position`!='' ORDER BY `CreateTime` DESC LIMIT 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 132');
										}else
										{
											lastPosition=rows[0].Position;
											
										}
									})

	                				connection.query("SELECT `Position` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' AND `Position`!=''",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 133');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
												arrayAllUser.push(rows[i]);
												arrayAllUserposition.push(rows[i].Position);
									        }
									        
										}
									})
									//bang moi lan doi tai nguyen thanh kim cuong trong guilg
									connection.query("SELECT * FROM `resourcetodiamond` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 134');
										}else
										{
											arrayAllResourceToDiamond = rows;
									        
										}
									})
									//dử liệu nâng cấp
									//dữ liệu nâng cấp city
									connection.query("SELECT * FROM `resourceupbase` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 135');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupbase = rows;
											}
											
										}
									})

									//dữ yêu cầu tham gia guild hiện tại của user
									connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 136');
										}else
										{
											if (rows.length >0) 
											{
												d = new Date();
			    								createPositionTimelast = Math.floor(d.getTime() / 1000);	
			    								if (rows[0].ActiveStatus===1||rows[0].ActiveStatus===2) 
			    								{
			    									arrayRequestJoinGuild = rows;
			    									//danh sách membe của guild			
			    									//cập nhật tình trạng online của member in guild
			    									var dt = datetime.create();		
													console.log(dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	
													connection.query("UPDATE guildlistmember SET Status = 1, TimeDetail = '"+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentUser.name
																	+"'AND GuildName = '"+rows[0].GuildName+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 137');
														}else
														{
															if (result.affectedRows>0) 
															{
																connection.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 138');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayAllMemberGuild = rows;
																		}															
																	}
																})
																//Dữ Liệu Leader/Co_Leader đã mời những người nào
																connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 139');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayAllInviteByGuild=rows;
																		}
																	}
																});
																//dữ liệu policy
																connection.query("SELECT * FROM `policys` where GuildName='"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 140');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayPolicy = rows;
																		}
																		
																	}
																})

																//kiểm tra tình trạng online
																connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 141');
																	}else
																	{
																		if (rows.length>0) 
																		{
																			arrayNotisyStatus = rows;																																			
																			for (var i = 0; i < arrayNotisyStatus.length; i++) 
																	  		{																	  			
																	  			if ((lodash.filter(clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
																	  			{																	  			
																  					io.in(clients[clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('RECEIVESTATUS',
																					{
																						Status : 1,
																						TimeDetail : dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
																						UserName : currentUser.name,																																							
																                	});
																	  													  															  								                	
																	  			}													  							  			
																	  		}			 
																		}else
																		{

																		}				

																	}
																})

																//Cập nhật tình trạng đóng góp cho guild
																connection.query("SELECT * FROM `guildlistmember` WHERE MemberName = '"+currentUser.name+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 142');
																	}else
																	{
																		if (rows.length>0) 
																		{
																			d = new Date();
		        															createPositionTimelast = Math.floor(d.getTime() / 1000);
		        															if (parseFloat(rows[0].TimeComplete) >parseFloat(createPositionTimelast)) 
		        															{
		        																connection.query("UPDATE guildlistmember SET TimeRemain = '"+ (parseFloat(rows[0].TimeComplete)-parseFloat(createPositionTimelast))
		        																	+"' where MemberName = '"+currentUser.name+"'",function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 143');
																					}else
																					{
																						if (result.affectedRows>0) 
																						{
																						}
																					}
																				});
		        															}else
		        															{
		        																connection.query("UPDATE guildlistmember SET TimeRemain = 0 where MemberName = '"+currentUser.name+"'",function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 144');
																					}else
																					{
																						if (result.affectedRows>0) 
																						{
																						}
																					}
																				});		        																
		        															}
																						 
																		}else
																		{

																		}				

																	}
																})

															}
														}
													})  
													//hien thi tin nhan chua xem của guild
													connection.query("SELECT * FROM `chatting` WHERE `GuildName`='"+arrayRequestJoinGuild[0].GuildName+"' AND `ServerTime` >= '"+parseFloat(arrayUserLogin[0].TimeCancelGuild)+"' ",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 145');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayMessGuildMember =rows;												  						       		                	
													  						            		
											            	}
											            }
											        });  
											        //hien thi tin nhan chua xem của private
											        connection.query("SELECT * FROM `chatting` WHERE `ToUserName`='"+currentUser.name+"' AND `CheckCloseMessPrivate` = 1 ",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 146');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayMessPrivateMember =rows;												  						       		                	
													  						            		
											            	}
											            }
											        });

											         //hien thi black list đã khóa user nào 
											        connection.query("SELECT * FROM `blacklist` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 147');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayBlackList =rows;												  						       		                	
													  						            		
											            	}
											            }
											        }); 
											        //hien thi black list đã bị khóa bởi user nào
											        connection.query("SELECT * FROM `blacklist` WHERE `WithUserName`='"+currentUser.name+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 148');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayBlockedBlackListByUser =rows;											  						       		                	
													  						            		
											            	}
											            }
											        }); 

																
			    								}else
			    								{
			    									if ( parseFloat(createPositionTimelast)>=parseFloat(rows[0].TimeReset) 
			    										&&(rows[0].ActiveStatus===0))   
													{
														connection.query("DELETE FROM guildlistmember WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, result, field)
														  	{
																if(!!error)
																{
																	console.log('Error in the query 149');
																}else
																{
																	if(result.affectedRows>0)
																	{																		
																		arrayRequestJoinGuild =[];
																	}else
																	{
																		console.log("remove Join is not succes 150");																														
																	}
																}
															})															
																									
													}else
													{													

														arrayRequestJoinGuild = rows;
													}

			    								}	    								
																									
											}else
											{
												arrayRequestJoinGuild =[];
											}
											
										}
									})
									//dữ liệu tất cả các guild đã mời user
									//dữ yêu cầu tham gia guild hiện tại của user
									connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`!='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 151');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllRequestJoinGuildByUser=rows;
											}
										}
									});														

									//dữ liệu nâng cấp guild
									connection.query("SELECT * FROM `resourceupguild` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 152');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupguild = rows;
											}
											
										}
									})

									////dữ liệu toàn bộ guild
									connection.query("SELECT * FROM `guildlist` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 153');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllGuildList = rows;
											}
											
										}
									})

									//dữ liệu mua base
									connection.query("SELECT * FROM `resourcebuybase` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 154');
										}else
										{
											if (rows.length >0) 
											{												
												arrayAllresourcebuybase = rows;
											}
											
										}
									})

									//dữ liệu nâng cấp mine
									connection.query("SELECT * FROM `resourceupmine` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 155');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupmine = rows;
											}																				
										}
									})

	                				//dữ liệu nâng cấp Swordman
									connection.query("SELECT * FROM `resourceupswordman` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 156');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupSwordman = rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Farm
									connection.query("SELECT * FROM `resourceupfarm` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 157');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupFarm=rows;											
											}																				
										}
									})

									//dữ liệu nâng cấp Wood
									connection.query("SELECT * FROM `resourceupwood` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 158');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupWood=rows;										
												
											}																				
										}
									})

									//dữ liệu nâng cấp Stone
									connection.query("SELECT * FROM `resourceupstone` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 159');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupStone=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Metal
									connection.query("SELECT * FROM `resourceupmetal` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 160');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupMetal=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Bowman
									connection.query("SELECT * FROM `resourceupBowman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 161');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBowman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Granary
									//connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`, CONVERT(`MaxStorage`, CHAR(50)) as `MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
									connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`,`MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 162');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupGranary=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Market
									connection.query("SELECT * FROM `resourceupMarket` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 163');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupMarket=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp CityWall
									connection.query("SELECT * FROM `resourceupCityWall` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 164');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCityWall=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Crossbow
									connection.query("SELECT * FROM `resourceupCrossbow` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 165');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCrossbow=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Horseman
									connection.query("SELECT * FROM `resourceupHorseman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 166');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupHorseman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Tower
									connection.query("SELECT * FROM `resourceupTower` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 167');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupTower=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Spearman
									connection.query("SELECT * FROM `resourceupSpearman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 168');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupSpearman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Shaman
									connection.query("SELECT * FROM `resourceupShaman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 169');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupShaman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Ballista
									connection.query("SELECT * FROM `resourceupBallista` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 170');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBallista=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp BatteringRam
									connection.query("SELECT * FROM `resourceupBatteringRam` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 171');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBatteringRam=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Trebuchet
									connection.query("SELECT * FROM `resourceupTrebuchet` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 172');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupTrebuchet=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp HorseArcher
									connection.query("SELECT * FROM `resourceupHorseArcher` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 173');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupHorseArcher=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp ElephantArcher
									connection.query("SELECT * FROM `resourceupElephantArcher` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 174');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupElephantArcher=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Cavalry
									connection.query("SELECT * FROM `resourceupCavalry` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 175');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCavalry=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp BattleElephant
									connection.query("SELECT * FROM `resourceupBattleElephant` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 176');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBattleElephant=rows;
											}																				
										}
									})

									connection.query("SELECT * FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 177');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayAllMinePosition.push(rows[i].Position);
									        }
									        
										}
									})

									//connection.query("SELECT * FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' OR `numberBase`!='"+0+"'",function(error, rows,field)
									connection.query("SELECT * FROM `userbase` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 178');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayBaseResource.push(rows[i]);
									        }
									       
										}
									})

									connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 179');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayAllMinepositionTrue.push(rows[i]);
									        }
									       
										}
									})

									//Đồng bộ giữa redis và my sql
									connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 189');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{																	        					
												//update resid															        					
												client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
												//update array memory
												if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
												{
													//cập nhật tình trạng ofllie cho unit location
													redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
												}
									        }  
									          
										}
									})
									connection.query("SELECT * FROM `resourcebuyunit` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 181');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAllresourcebuyunit.push(rows[i]);
									        }
									       
										}
									})
									connection.query("SELECT * FROM `users` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 182');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAllUsers.push(rows[i]);
									        }
									       
										}
									})
									//list user Da addfriend
									connection.query("SELECT  `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
										+"' AND `ActiveStatus` =1 UNION ALL SELECT  `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
										+"' AND `ActiveStatus` =1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 183');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAddedFriend.push(rows[i]);
									        }
									       
										}
									})
									connection.query("SELECT  * FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
										+"' AND  `ActiveStatus` =2 UNION ALL SELECT  * FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
										+"' AND  `ActiveStatus` =2",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 184');
										}else
										{																					
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayCancelFriend.push(rows[i]);
									        }
									       
										}
									})
									//list user cho add friend
									connection.query("SELECT `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 185');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayWaitedFriend.push(rows[i]);
									        }
									       
										}
									})

									//list user cho waited add friend
									connection.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 186');
										}else
										{											
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayWaitingFriend.push(rows[i]);
									        }
									       
										}
									})
									//cập nhật bạn của nhau trong redis
									connection.query("SELECT `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus` FROM `addfriend` WHERE `ActiveStatus`=1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 187');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{														
												//update resid															        					
					        					client.set(rows[i].UserNameFriendA+rows[i].UserNameFriendB,JSON.stringify(rows[i]));			        																											
									        }	
									    }
									});							



									//update user online 
									connection.query('UPDATE unitinlocations SET CheckOnline = 1 WHERE UserName = ?', [currentUser.name],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 188');
										}else
										{
											if (result.affectedRows> 0) 
											{		

												
											}
											else
											{
												console.log('hiện tại user chưa có unit inlocation 189erwar');
											}
										}
									});
									connection.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 190');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
							    				arraycheckUserlg.push(rows[i]);
									        }								       
										}
									})
									//cập nhật vi trí unit location 1
									connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 191');
										}else
										{											
											for (var i = 0; i < rows.length; i++)
											{
												var index = i;
												d = new Date();
					    						createPositionTimelast = Math.floor(d.getTime() / 1000);
					    						APosition = rows[index].Position;
					    						A = APosition.split(",");
												A1 = parseFloat(A[0]);
												A2 = parseFloat(A[1]);
												BPosition = rows[index].PositionClick;
												B = BPosition.split(",");
												B1 = parseFloat(B[0]);
												B2 = parseFloat(B[1]);
												//kiểm tra trùng và set lại
												idUnitInLocationstemp = rows[index].idUnitInLocations;
												//Kiểm tra trạng thái di chuyển khi đăng nhập
					    						if (rows[index].UserName === currentUser.name) 
					    						{						    							
					    							if( (parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick)) < parseFloat(rows[index].TimeMoveComplete) )
						    						{
						    							timeMoves=0;
						    							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick))*(B1-A1))/parseFloat(rows[index].TimeMoveComplete);
						    							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick))*(B2-A2))/parseFloat(rows[index].TimeMoveComplete);
						    							timeMoves = parseFloat(rows[index].TimeMoveTotalComplete) - parseFloat(createPositionTimelast);					    							
						    							console.log("1"+parseFloat(rows[index].TimeMoveTotalComplete));
						    							console.log("2"+parseFloat(createPositionTimelast));
						    							console.log("3"+parseFloat(rows[index].timeClick));
						    							console.log("thời gian đã di tiếp: "+(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));
						    							console.log("thời gian di chuyển tiếp: "+timeMoves);				    							
						    							//tính lượng farm oflline đã di chuyển và còn lại cho online
						    							//farm off
						    							FarmConsumeInOffline = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));													    							
						    							console.log("Farm offline mà user đã di chuyển là: "+ FarmConsumeInOffline);	
						    							FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(timeMoves));													    							
						    							console.log("Farm online mà user cần di chuyển là: "+ FarmRemainInOnline);
						    							console.log("Đơn vị giây gửi lên client: "+(1/parseFloat(rows[index].MoveSpeedEach)));
						    							if ((parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)) >= parseFloat(FarmRemainInOnline)) 
						    							{
						    								console.log("================Đủ farm login user");
						    								//update vị trị sau cùng và time move kiểm tra đơn vị di chuyển
						    								if (parseFloat(timeMoves) >= (1/parseFloat(rows[index].MoveSpeedEach))) 
						    								{
						    									//cập nhật farm và vị trí đủ một đơn vị di chuyển
						    									connection.query("UPDATE unitinlocations SET Position = '"+ X+","+Z 	  
						    										+"',PositionLogin = '"+ X+","+Z              												                			 			                			
										                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
										                			+"',TimeMoveComplete = '"+ parseFloat(timeMoves)			                			
										                			+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
										                			+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',TimeSendToClient = '"+ (1/parseFloat(rows[index].MoveSpeedEach)+parseFloat(createPositionTimelast))
										                			+"',CheckMove = 1,CheckMoveOff = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query113434gSfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("Cập nhật farm du mot don vi trong khi login thanh cong");																											                	
																																					
																		}else
																		{
																			console.log("update khong thanh cong");
																		}
																	}
																});	

						    								}else
						    								{						    									
						    									//cập nhật farm và vị trí không đủ một đơn vị di chuyển
						    									if ((parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)))>=rows[index].Quality) 
						    									{
						    										connection.query("UPDATE unitinlocations SET Position = '"+ X+","+Z 
						    										+"',PositionLogin = '"+ X+","+Z 	                												                			 			                			
										                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
										                			+"',TimeMoveComplete = '"+ parseFloat(timeMoves)			                			
										                			+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
										                			+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))									                			
										                			+"',CheckMove = 1,CheckMoveOff = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query113434gSfafd');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				console.log("Cập nhật login khong du 1 don vi còn farm đủ một đơn vị - còn farm");																																																				
																																																								
																			}else
																			{
																				console.log("update khong thanh cong");
																			}
																		}
																	});	
						    									}else
						    									{

						    										connection.query("UPDATE unitinlocations SET Position = '"+ X+","+Z 
						    										+"',PositionLogin = '"+ X+","+Z 	                												                			 			                			
										                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
										                			+"',TimeMoveComplete = '"+ parseFloat(timeMoves)			                			
										                			+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
										                			+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))									                			
										                			+"',CheckMove = 1,CheckMoveOff = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query113434gSfafd');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				console.log("Cập nhật login khong du 1 don vi khong còn farm đủ một đơn vị - còn farm");																																																																																																												
																			}else
																			{
																				console.log("update khong thanh cong");
																			}
																		}
																	});	
						    									}
						    									
						    								}					    													    						
						    							}else
						    							{
						    								console.log("Thiếu farm user");
						    								if ((parseFloat(timeMoves) >= (1/parseFloat(rows[index].MoveSpeedEach))) 
						    									&& ((parseFloat(rows[index].FarmPortable) - FarmConsumeInOffline) >= parseFloat(rows[index].Quality))) 
						    								{
						    									console.log("Thiếu farm du một đơn vị");
						    									var query = pool.query("UPDATE unitinlocations SET Position ='"+X+","+Z
						    									+"',PositionLogin = '"+ X+","+Z 
						    									+"',TimeCheck='"+(parseFloat(timeMoves)+parseFloat(createPositionTimelast))
						    									+"',TimeMoveComplete = '"+parseFloat(timeMoves)
						    									+"',TimeSendToClient = '"+ ((1/parseFloat(rows[index].MoveSpeedEach))+parseFloat(createPositionTimelast))
						    									+"',CheckMoveOff=0,TimeMoveTotalComplete = '"+(parseFloat(timeMoves)+parseFloat(createPositionTimelast))
						    									+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
						    									+"',timeClick = '"+ parseFloat(createPositionTimelast)
									                			+"',CheckMove = 1 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 403');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("Cập nhật trong trường hợp login thiếu farm thành công");	
																																
																		}else
																		{
																			console.log("update khong thanh cong 405");
																		}
																	}
																});	

						    								}
						    								else
						    								{
						    									console.log("Thiếu farm không đủ một đơn vị");		

						    									//cập nhật farm và vị trí không đủ một đơn vị di chuyển
						    									if ((parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)))>rows[index].Quality) 
						    									{
						    										connection.query("UPDATE unitinlocations SET Position = '"+ X+","+Z 	
						    										+"',PositionLogin = '"+ X+","+Z                 												                			 			                			
										                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
										                			+"',TimeMoveComplete = '"+ parseFloat(timeMoves)			                			
										                			+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
										                			+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))									                			
										                			+"',CheckMove = 1,CheckMoveOff = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query113434gSfafd');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				console.log("Cập nhật login khong du 1 don vi còn farm đủ một đơn vị - thieu farm");																																																																																																																																																																																		
																			}else
																			{
																				console.log("update khong thanh cong");
																			}
																		}
																	});	
						    									}else
						    									{
						    										connection.query("UPDATE unitinlocations SET Position = '"+ X+","+Z 	
						    										+"',PositionLogin = '"+ X+","+Z                 												                			 			                			
										                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
										                			+"',TimeMoveComplete = '"+ parseFloat(timeMoves)			                			
										                			+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))
										                			+"',FarmPortable = '"+parseFloat(parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline))
										                			+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(createPositionTimelast))									                			
										                			+"',CheckMove = 1,CheckMoveOff = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query113434gSfafd');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				console.log("Cập nhật login khong du 1 don vi khong còn farm đủ một đơn vị - thieu farm");																																																																																																																																																																
																																																								
																			}else
																			{
																				console.log("update khong thanh cong");
																			}
																		}
																	});	
						    									}			    							

																
						    								}				    								

						    							}					    							
													}else
													{
														var query = pool.query("UPDATE unitinlocations SET PositionLogin =PositionClick, Position =PositionClick , CheckMoveOff=0, TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 403');
															}else
															{
																if (result.affectedRows>0) 
																{
																	//console.log("Cập nhật trong trường hợp login thiếu farm thành công 1");														
																}else
																{
																	console.log("update khong thanh cong 405");
																}
															}
														});														
													}					    												    							
					    						}else
					    						{					    							
					    							if( (parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick)) < parseFloat(rows[index].TimeMoveComplete) )
						    						{
						    							timeMoves=0;
						    							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick))*(B1-A1))/parseFloat(rows[index].TimeMoveComplete);
						    							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[index].timeClick))*(B2-A2))/parseFloat(rows[index].TimeMoveComplete);
						    							timeMoves = parseFloat(rows[index].TimeMoveTotalComplete) - parseFloat(createPositionTimelast);					    							
						    							console.log("1"+parseFloat(rows[index].TimeMoveTotalComplete));
						    							console.log("2"+parseFloat(createPositionTimelast));
						    							console.log("3"+parseFloat(rows[index].timeClick));
						    							console.log("thời gian đã di tiếp: "+(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));
						    							console.log("thời gian di chuyển tiếp: "+timeMoves);				    							
						    							//tính lượng farm oflline đã di chuyển và còn lại cho online
						    							//farm off
						    							FarmConsumeInOffline = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));													    							
						    							console.log("Farm offline mà user đã di chuyển là: "+ FarmConsumeInOffline);	
						    							FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(timeMoves));													    							
						    							console.log("Farm online mà user cần di chuyển là: "+ FarmRemainInOnline);
						    							console.log("Đơn vị giây gửi lên client: "+(1/parseFloat(rows[index].MoveSpeedEach)));
						    							if ((parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)) >= parseFloat(FarmRemainInOnline)) 
						    							{
						    								console.log("================Đủ farm login user");
						    								//update vị trị sau cùng và time move kiểm tra đơn vị di chuyển
						    								if (parseFloat(timeMoves) >= (1/parseFloat(rows[index].MoveSpeedEach))) 
						    								{
						    									//cập nhật farm và vị trí đủ một đơn vị di chuyển
						    									connection.query("UPDATE unitinlocations SET PositionLogin = '"+ X+","+Z 	                												                			 			                													                			
										                			+"' where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query113434gSfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("Cập nhật farm du mot don vi trong khi login thanh cong");																											                	
																																					
																		}else
																		{
																			console.log("update khong thanh cong");
																		}
																	}
																});	

						    								}else
						    								{
						    									//cập nhật farm và vị trí không đủ một đơn vị di chuyển
						    									connection.query("UPDATE unitinlocations SET PositionLogin = '"+ X+","+Z 	                												                			 			                													                											                			
										                			+"'where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query113434gSfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("Cập nhật farm khong du mot don vi thanh cong 1");	
																																																							
																		}else
																		{
																			console.log("update khong thanh cong");
																		}
																	}
																});	
						    								}					    													    						
						    							}else
						    							{
						    								console.log("Thiếu farm user");
						    								if ((parseFloat(timeMoves) >= (1/parseFloat(rows[i].MoveSpeedEach))) 
						    									&& ((parseFloat(rows[index].FarmPortable) - FarmConsumeInOffline) >= parseFloat(rows[index].Quality))) 
						    								{
						    									console.log("Thiếu farm du một đơn vị");
						    									var query = pool.query("UPDATE unitinlocations SET PositionLogin ='"+X+","+Z						    									
									                			+"'where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 403');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("Cập nhật trong trường hợp login thiếu farm thành công");	
																																
																		}else
																		{
																			console.log("update khong thanh cong 405");
																		}
																	}
																});	

						    								}
						    								else
						    								{
						    									console.log("Thiếu farm không đủ một đơn vị 1");					    							

																var query = pool.query("UPDATE unitinlocations SET PositionLogin ='"+X+","+Z						    									
									                			+"'where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 403');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			//console.log("Cập nhật trong trường hợp login thiếu farm thành công 1");														
																		}else
																		{
																			console.log("update khong thanh cong 405");
																		}
																	}
																});	
						    								}				    								

						    							}					    							
													}else
													{
														var query = pool.query("UPDATE unitinlocations SET PositionLogin =PositionClick, Position =PositionClick, CheckMoveOff=0, TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 403');
															}else
															{
																if (result.affectedRows>0) 
																{
																	//console.log("Cập nhật trong trường hợp login thiếu farm thành công 1");														
																}else
																{
																	console.log("update khong thanh cong 405");
																}
															}
														});														
													}

					    						}				    						
									        }

									        connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE CheckMove=0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
											{
												if (!!error) {
													console.log('Error in the query 194');
												}else
												{
													for (var k = 0; k < rows.length; k++)
													{
														arrayAllUnitLocationsCompletefirst.push(rows[k]);												
											        }

											        for (var j = 0; j < arrayAllUnitLocationsCompletefirst.length; j++)
													{														
														if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)>=2)									
														{
															 for (var M = 0; M <= 36; M++) 
															{
																var arr = arrayAllUnitLocationsCompletefirst[j].PositionClick.split(",");
																var i = 1;
																var K=M;
																if(M > 7 && M < 16)
																{
																	i = 2;
																	K = M-7;
																}else if(M > 15 && M < 36)
																{
																	i = 3;
																	K = M-15;
																}
																newLocation =functions.getNewLocationClick(arr[0],arr[1],i,K);
																arrayAllUnitLocationsCompletefirst[j].PositionClick = newLocation;																
																if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)<=1)
																{												
																	break;
																}
															}																														
															//cập nhật position mới trung vào data
															connection.query('UPDATE unitinlocations SET Position = ?,PositionClick = ?  WHERE idUnitInLocations = ?', [newLocation, newLocation,arrayAllUnitLocationsCompletefirst[j].idUnitInLocations],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 194');
																}else
																{
																	if (result.affectedRows> 0) {																	
																		
																	}
																	else
																	{
																		console.log('khong co time remain duoc cap nhat  195');
																	}

																}
															})
														}
											        }


												}
											})

											connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE 1",function(error, rows,field)
											{
												if (!!error) {
													console.log('Error in the query 196');
												}else
												{
													
													for (var i = 0; i < rows.length; i++)
													{
						                				arrayAllUnitLocationsComplete.push(rows[i]);
											        }
												}
												connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 197');
													}else
													{
														
														for (var i = 0; i < rows.length; i++)
														{
								            				arrayUnitLocationsComplete.push(rows[i]);
												        }												      
												    }
												})
											})

										}
									})						
									// cap nhat time remain
									connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
									{
										var index=-1;
										if (!!error) {
											console.log('Error in the query 198');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{					        					
					        					d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);

					        					if(parseFloat(rows[i].timeComplete)>parseFloat(createPositionTimelast))
					        					{			        						

													connection.query("UPDATE unitwaitinbase SET timeRemain = '"+(parseFloat(rows[i].timeComplete)-parseFloat(createPositionTimelast))
														+"' WHERE UserName = '"+rows[i].UserName
														+"' AND numberBase = '"+parseFloat(rows[i].numberBase)
														+"' AND UnitType = '"+parseFloat(rows[i].UnitType)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 199');
														}else
														{
															if (result.affectedRows>0) 
															{																									
															}else
															{
																console.log("update khong thanh cong 200");
															}
														}
													});

					        					}else 
					        					{
					        						//Insert/update vào unitinbae						        						
					        						
													connection.query("UPDATE unitinbase SET Quality = Quality + '"+parseFloat(rows[i].Quality)+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
															[rows[i].UserName,rows[i].numberBase,rows[i].UnitType,rows[i].Level],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 201');
														}else
														{
															index++;
															if (result.affectedRows > 0) 
															{															
																
																connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
															  	{
																	if(!!error)
																	{
																		console.log('Error in the query 202');
																	}else
																	{
																		if(result)
																		{																			
																		}else
																		{
																			console.log("Update khong thanh cong 203");	
																			socket.emit('ReceiveUnitInBaseSuccess',
																			{
																				message:0,									
																			});											
																		}
																	}
																})
															}else
															{
																console.log("INSERT INTO initin base thanh cong");
																//nếu không cập nhật thì insert																		
																connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`numberBase`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
																+rows[index].UserName+"','"+rows[index].numberBase+"','"+rows[index].UnitType+"','"+rows[index].Quality+"','"
																+rows[index].Level+"')",function(error, result, field)
																{
														            if(!!err)
														            {
														            	console.log('Error in the query 204');
														            }else
														            {
														            	if (result.affectedRows > 0) 
														            	{														            		
														            		connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																			[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
																		  	{
																				if(!!error)
																				{
																					console.log('Error in the queryfgfg7567');
																				}else
																				{
																					if(result)
																					{																					
																					}else{}	
																				}
																			})
														            	}
														            	
														            }
																})										

															}
															
														}
													})												

					        					}
					        					
									        }
									        
										}
									})
									
									connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName`='"+currentUser.name+"' AND `TransferCompleteTotalTime`>0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 205');
										}else
										{
											if (rows.length>0) 
											{
											
												arrayTimeTransferFarmfromBaseToUnit= rows;												

											}else
											{

											}

										}
									})
									//kiem tra trong bảng page user đã tạo chưa
									connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 205');
										}else
										{											
											//đã tồn tại page cho user dn lần đầu					
											if (rows.length>0){											
												//load base đả có sẳn
												d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);
												connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout =?,timeResetMine = ? WHERE UserName = ?', [createPositionTimelast,socket.id,"",createPositionTimelast, currentUser.name],function(error, result, field)
												{
												
													if(!!error)
													{
														console.log('Error in the query 206');
													}else
													{
														if(result)
														{
															//update checkResetMine for page

															connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 207');
																}else
																{																
																	if(result)
																	{
																		connection.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 208');
																			}else
																			{																				
																				for (var i = 0; i < rows.length; i++) 
																				{
													                				arrayUnitBaseUser.push(rows[i]);
																		        }
																		        connection.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 209');
																					}else
																					{

																						for (var i = 0; i < rows.length; i++) {
															                				arrayUnitWaitBaseUser.push(rows[i]);
																				        }
																				        connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
																				        {
																							if (!!error)
																							{
																								console.log('Error in the query 210');
																							}else
																							{
																								//đã tồn tại page cho user dn lần đầu						
																
																								if (rows.length>0){																									
																									for (var i = 0; i < rows.length; i++) 
																									{
																	                					arrayBaseUser.push(rows[i]);
																						        	}
																						        	 //cập nhật online cho redis
																									connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																									{
																										if (!!error)
																										{
																											console.log('Error in the query211');
																										}else
																										{
																											for (var i = 0; i < rows.length; i++)
																											{		
																												//update resid															        					
																					        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																					        					//update array memory
																					        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																												{
																													//cập nhật tình trạng ofllie cho unit location
																													redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																												}
																									        }																				        																									        
						    																				clients.push(currentUser);							    																													
																											connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
																											{
																												if (!!error)
																												{
																													console.log('Error in the query 212');
																												}else
																												{
																													if (rows.length>0) 
																													{
																														arrayOnlineStatus = rows;																																			
																														for (var i = 0; i < arrayOnlineStatus.length; i++) 
																												  		{

																												  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
																												  			{	
																											  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																																{
																																	Status : 1,	
																																	UserName : currentUser.name,
																																	idUnitInLocations: arrayUnitLocationsComplete,																																																					
																											                	});
																												  													  															  								                	
																												  			}													  							  			
																												  		}			 
																													}else
																													{

																													}				

																												}
																											})


						    																				//write file

						    																				//let idSocket = currentUser.idSocket+"*";

																											//fs.appendFile('socketio.js', idSocket, function (err) {
																											//  if (err) throw err;
																											//  console.log('Saved!');
																											//});

																											//read file 
																											//var array = require("fs").readFileSync("socketio.js").toString().split("*");
																											//console.log("chieu dai mang doc:  "+ array.length+"_"+array[0]);						    																				
																									        connection.release();
																									        console.log("User: "+currentUser.name +" id socket: "+socket.id+" has connected");
																									        socket.emit('loginSuccess',
																											{
																						                    	message : '1',
																						                    	arrayTimeTransferFarmfromBaseToUnit:arrayTimeTransferFarmfromBaseToUnit,
																						                    	arrayMessGuildMember:arrayMessGuildMember,
																						                    	arrayMessPrivateMember:arrayMessPrivateMember,
																						                    	arrayBlackList:arrayBlackList,
																						                    	arrayBlockedBlackListByUser:arrayBlockedBlackListByUser,
																						                    	currentUser:currentUser,
																						                    	arrayAllResourceToDiamond:arrayAllResourceToDiamond,
																						                    	arrayPolicy:arrayPolicy,
																						                    	arrayUserLogin: arrayUserLogin,
																						                    	arrayAllInviteByGuild: arrayAllInviteByGuild,
																						                    	arrayAllRequestJoinGuildByUser:arrayAllRequestJoinGuildByUser,
																						                    	arrayAllMemberGuild:arrayAllMemberGuild,
																						                    	arrayRequestJoinGuild:arrayRequestJoinGuild,
																						                    	arrayAllGuildList:arrayAllGuildList,
																						                    	arrayAllresourceupguild:arrayAllresourceupguild,
																						                    	arrayAllresourcebuybase:arrayAllresourcebuybase,
																						                    	arrayWaitingFriend: arrayWaitingFriend,
																						                    	arrayWaitedFriend:arrayWaitedFriend,
																						                    	arrayAddedFriend:arrayAddedFriend,
																						                    	arrayCancelFriend:arrayCancelFriend,
																						                    	getAllUser: arrayAllUser,
																						                    	arrayAllUsers: arrayAllUsers,
																						                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																						                    	getBaseResource: arrayBaseResource,
																						                    	getBaseUser: arrayBaseUser,
																						                    	getUnitBaseUser: arrayUnitBaseUser,
																						                    	getUnitWaitBaseUser: arrayUnitWaitBaseUser,
																						                    	getUnitLocationsComplete: arrayUnitLocationsComplete,
																						                    	getTimeResetserver: timeSend,
																						                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																						                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																						                    	arrayAllresourceupbase : arrayAllresourceupbase,
																						                    	arrayAllresourceupmine : arrayAllresourceupmine,
																						                    	arrayAllresourceupSwordman:arrayAllresourceupSwordman,
																						                    	arrayAllresourceupFarm:arrayAllresourceupFarm,
																												arrayAllresourceupWood:arrayAllresourceupWood,
																												arrayAllresourceupStone:arrayAllresourceupStone,
																												arrayAllresourceupMetal:arrayAllresourceupMetal,
																												arrayAllresourceupBowman:arrayAllresourceupBowman,
																												arrayAllresourceupGranary:arrayAllresourceupGranary,
																												arrayAllresourceupMarket:arrayAllresourceupMarket,
																												arrayAllresourceupCityWall:arrayAllresourceupCityWall,
																												arrayAllresourceupCrossbow:arrayAllresourceupCrossbow,
																												arrayAllresourceupHorseman:arrayAllresourceupHorseman,
																												arrayAllresourceupTower:arrayAllresourceupTower,
																												arrayAllresourceupSpearman:arrayAllresourceupSpearman,
																												arrayAllresourceupShaman:arrayAllresourceupShaman,
																												arrayAllresourceupBallista:arrayAllresourceupBallista,
																												arrayAllresourceupBatteringRam:arrayAllresourceupBatteringRam,
																												arrayAllresourceupTrebuchet:arrayAllresourceupTrebuchet,
																												arrayAllresourceupHorseArcher:arrayAllresourceupHorseArcher,
																												arrayAllresourceupElephantArcher:arrayAllresourceupElephantArcher,
																												arrayAllresourceupCavalry:arrayAllresourceupCavalry,
																												arrayAllresourceupBattleElephant:arrayAllresourceupBattleElephant, 
																						                	});
																										}
																									})	
																									
																								}
																							}
																						});
		
																					}
																				})
																			}

																		})

																	}else
																	{
																		console.log('cap nhat that bai 213');
																	}
																}
															});


														}else
														{
															console.log('cap nhat that bai 214');
														}
													}
												});
											}else
											{												
												//tạo Base mới cho user dn lần đầu
												d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);
												var arr = lastPosition.split(",");												
												var lastLocationjson = arr[0]+","+arr[1];
												var i = functions.getRandomIntInclusive(1,8), M=0;												
												arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
												newLocation =functions.getNewLocation(arr[0],arr[1],i,M);																																			
												while(arrayAllMineMerger.indexOf(newLocation)>=1)
												{
													//console.log("tao base while");
													i = functions.getRandomIntInclusive(1,8);
													newLocation =functions.getNewLocation(arr[0],arr[1],i,M);
													//console.log(newLocation);
												}
												arrayAllMineMerger.push(newLocation);
												console.log("tao base 4");
												//Load Base mới tạo
												connection.query("SELECT * FROM `resourcebuybase` WHERE `numberBase` = 0",function(error, rows,field)
												{
													if (!!error) {
														console.log('Error in the query 215');
													}else
													{
														console.log("tao base 5");
														if (rows.length > 0)
														{	
															console.log("insert user base thanh cong 1");														
															//Load Base mới tạo
															connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `MaxStorage`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`) VALUES ('"
																+""+"','"+UserNameLogin+"','"+10000+"','"+newLocation+"','"+1+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady+"','"+createPositionTimelast+"','"+rows[0].numberBase+"','"+0+"','"+1+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"')",function(error, result, field)
															{
													            if(!!err) {
													            	console.log('insert thất bại 216');
													            }else
													            {
													            	d = new Date();
													    			createPositionTimelast = Math.floor(d.getTime() / 1000);
																	connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout =?,timeResetMine = ? WHERE UserName = ?', [createPositionTimelast,socket.id,"",createPositionTimelast, currentUser.name],function(error, result, field)
																	{
																	
																		if(!!error)
																		{
																			console.log('Error in the query 206');
																		}else
																		{
																			if(result)
																			{
																				//update checkResetMine for page

																				connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 207');
																					}else
																					{																
																						if(result)
																						{
																							connection.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																							{
																								if (!!error)
																								{
																									console.log('Error in the query 208');
																								}else
																								{																				
																									for (var i = 0; i < rows.length; i++) 
																									{
																		                				arrayUnitBaseUser.push(rows[i]);
																							        }
																							        connection.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																									{
																										if (!!error)
																										{
																											console.log('Error in the query 209');
																										}else
																										{

																											for (var i = 0; i < rows.length; i++) {
																				                				arrayUnitWaitBaseUser.push(rows[i]);
																									        }
																									        connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
																									        {
																												if (!!error)
																												{
																													console.log('Error in the query 210');
																												}else
																												{
																													//đã tồn tại page cho user dn lần đầu						
																					
																													if (rows.length>0){																									
																														for (var i = 0; i < rows.length; i++) 
																														{
																						                					arrayBaseUser.push(rows[i]);
																											        	}
																											        	 //cập nhật online cho redis
																														connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																														{
																															if (!!error)
																															{
																																console.log('Error in the query211');
																															}else
																															{
																																for (var i = 0; i < rows.length; i++)
																																{		
																																	//update resid															        					
																										        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																										        					//update array memory
																										        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																																	{
																																		//cập nhật tình trạng ofllie cho unit location
																																		redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																																	}
																														        }																				        																									        
											    																				clients.push(currentUser);							    																													
																																connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
																																{
																																	if (!!error)
																																	{
																																		console.log('Error in the query 212');
																																	}else
																																	{
																																		if (rows.length>0) 
																																		{
																																			arrayOnlineStatus = rows;																																			
																																			for (var i = 0; i < arrayOnlineStatus.length; i++) 
																																	  		{

																																	  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
																																	  			{	
																																  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																																					{
																																						Status : 1,	
																																						UserName : currentUser.name,
																																						idUnitInLocations: arrayUnitLocationsComplete,																																																					
																																                	});
																																	  													  															  								                	
																																	  			}													  							  			
																																	  		}			 
																																		}else
																																		{

																																		}				

																																	}
																																})


											    																				//write file

											    																				//let idSocket = currentUser.idSocket+"*";

																																//fs.appendFile('socketio.js', idSocket, function (err) {
																																//  if (err) throw err;
																																//  console.log('Saved!');
																																//});

																																//read file 
																																//var array = require("fs").readFileSync("socketio.js").toString().split("*");
																																//console.log("chieu dai mang doc:  "+ array.length+"_"+array[0]);						    																				
																														        connection.release();
																														        console.log("User: "+currentUser.name +" id socket: "+socket.id+" has connected");
																														        socket.emit('loginSuccess',
																																{
																											                    	message : '1',
																											                    	arrayTimeTransferFarmfromBaseToUnit:arrayTimeTransferFarmfromBaseToUnit,
																											                    	arrayMessGuildMember:arrayMessGuildMember,
																											                    	arrayMessPrivateMember:arrayMessPrivateMember,
																											                    	arrayBlackList:arrayBlackList,
																											                    	arrayBlockedBlackListByUser:arrayBlockedBlackListByUser,
																											                    	currentUser:currentUser,
																											                    	arrayAllResourceToDiamond:arrayAllResourceToDiamond,
																											                    	arrayPolicy:arrayPolicy,
																											                    	arrayUserLogin: arrayUserLogin,
																											                    	arrayAllInviteByGuild: arrayAllInviteByGuild,
																											                    	arrayAllRequestJoinGuildByUser:arrayAllRequestJoinGuildByUser,
																											                    	arrayAllMemberGuild:arrayAllMemberGuild,
																											                    	arrayRequestJoinGuild:arrayRequestJoinGuild,
																											                    	arrayAllGuildList:arrayAllGuildList,
																											                    	arrayAllresourceupguild:arrayAllresourceupguild,
																											                    	arrayAllresourcebuybase:arrayAllresourcebuybase,
																											                    	arrayWaitingFriend: arrayWaitingFriend,
																											                    	arrayWaitedFriend:arrayWaitedFriend,
																											                    	arrayAddedFriend:arrayAddedFriend,
																											                    	arrayCancelFriend:arrayCancelFriend,
																											                    	getAllUser: arrayAllUser,
																											                    	arrayAllUsers: arrayAllUsers,
																											                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																											                    	getBaseResource: arrayBaseResource,
																											                    	getBaseUser: arrayBaseUser,
																											                    	getUnitBaseUser: arrayUnitBaseUser,
																											                    	getUnitWaitBaseUser: arrayUnitWaitBaseUser,
																											                    	getUnitLocationsComplete: arrayUnitLocationsComplete,
																											                    	getTimeResetserver: timeSend,
																											                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																											                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																											                    	arrayAllresourceupbase : arrayAllresourceupbase,
																											                    	arrayAllresourceupmine : arrayAllresourceupmine,
																											                    	arrayAllresourceupSwordman:arrayAllresourceupSwordman,
																											                    	arrayAllresourceupFarm:arrayAllresourceupFarm,
																																	arrayAllresourceupWood:arrayAllresourceupWood,
																																	arrayAllresourceupStone:arrayAllresourceupStone,
																																	arrayAllresourceupMetal:arrayAllresourceupMetal,
																																	arrayAllresourceupBowman:arrayAllresourceupBowman,
																																	arrayAllresourceupGranary:arrayAllresourceupGranary,
																																	arrayAllresourceupMarket:arrayAllresourceupMarket,
																																	arrayAllresourceupCityWall:arrayAllresourceupCityWall,
																																	arrayAllresourceupCrossbow:arrayAllresourceupCrossbow,
																																	arrayAllresourceupHorseman:arrayAllresourceupHorseman,
																																	arrayAllresourceupTower:arrayAllresourceupTower,
																																	arrayAllresourceupSpearman:arrayAllresourceupSpearman,
																																	arrayAllresourceupShaman:arrayAllresourceupShaman,
																																	arrayAllresourceupBallista:arrayAllresourceupBallista,
																																	arrayAllresourceupBatteringRam:arrayAllresourceupBatteringRam,
																																	arrayAllresourceupTrebuchet:arrayAllresourceupTrebuchet,
																																	arrayAllresourceupHorseArcher:arrayAllresourceupHorseArcher,
																																	arrayAllresourceupElephantArcher:arrayAllresourceupElephantArcher,
																																	arrayAllresourceupCavalry:arrayAllresourceupCavalry,
																																	arrayAllresourceupBattleElephant:arrayAllresourceupBattleElephant, 
																											                	});
																															}
																														})	
																														
																													}
																												}
																											});
							
																										}
																									})
																								}

																							})

																						}else
																						{
																							console.log('cap nhat that bai 213');
																						}
																					}
																				});


																			}else
																			{
																				console.log('cap nhat that bai 214');
																			}
																		}
																	});

													            }
													        });
															
														}else
														{
															console.log("=============khong selec dc 225");
														}
													}
												});

											}

										}
									});
									d = new Date();
						    		createPositionTimelast = Math.floor(d.getTime() / 1000);
									cron.schedule('*/1 * * * * *', function()
									{
							 	 		//check reset server of user
							 	 		var arrayAllMinepositionupdate = [];
						 	 			connection.query("SELECT `checkResetMine` FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
										{
											if (!!error) {
												console.log('Error in the query 226');
											}else
											{
												if (rows[0].checkResetMine === 1)
												{
													connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
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
															socket.emit('loginUnsuccessMine',
															{
									                    		getAllIDMineOfUser: arrayAllMinepositionupdate,
									                    		gettimeSendRepeat : 86400,
									                		});
									                		connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 228');
																}else
																{															
																	if(result)
																	{																	
																		
																	}else
																	{
																		console.log('cap nhat that bai 229');
																	}
																}
															});

														}
													})
												}else
												{
													
												}

											}
										})

									});													
								}
							else
							{
								for (var i = 0; i < clients.length; i++) 
								{
									
									if (clients[i].name===currentUser.name) 
									{										
										console.log("=================================gửi dupilacelen client");										
										socket.broadcast.to(clients[i].idSocket).emit('RECEIVECHECKDUPLICATELOGIN',
										{
											checkDuplicateLogin:0,
					                	});
					                	clients.splice(i,1);
									}
								}
								{
									UserNameLogin = rows[0].UserName;
									EmailLogin =  rows[0].UserEmail;
									PortLogin = rows[0].Port;
									var today = new Date();
									var CheckMove, CheckMoveOff;

									//thời gian mỗi ngày reset
									var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, seconReset);
									var resetMine = Math.floor(myToday.getTime() / 1000);

									//thời gian mỗi ngày reset công thêm 1 ngày
									var myTodaynext = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, hourReset, minuteReset, seconReset);
									var resetMineNext = Math.floor(myTodaynext.getTime() / 1000);

									//thời gian hiện tại
									var timeNow = Math.floor(today.getTime() / 1000);

									if(timeNow < resetMine)
									{
										timeSend = resetMine - timeNow;
									}else
									{
										timeSend = resetMineNext - timeNow;
									}
										
									connection.query("SELECT * FROM `userbase` where `Position`!='' ORDER BY `CreateTime` DESC LIMIT 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 132');
										}else
										{
											lastPosition=rows[0].Position;
											
										}
									})

	                				connection.query("SELECT `Position` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' AND `Position`!=''",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 133');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
												arrayAllUser.push(rows[i]);
												arrayAllUserposition.push(rows[i].Position);
									        }
									        
										}
									})
									//bang moi lan doi tai nguyen thanh kim cuong trong guilg
									connection.query("SELECT * FROM `resourcetodiamond` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 134');
										}else
										{
											arrayAllResourceToDiamond = rows;
									        
										}
									})
									//dử liệu nâng cấp
									//dữ liệu nâng cấp city
									connection.query("SELECT * FROM `resourceupbase` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 135');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupbase = rows;
											}
											
										}
									})

									//dữ yêu cầu tham gia guild hiện tại của user
									connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 136');
										}else
										{
											if (rows.length >0) 
											{
												d = new Date();
			    								createPositionTimelast = Math.floor(d.getTime() / 1000);	
			    								if (rows[0].ActiveStatus===1||rows[0].ActiveStatus===2) 
			    								{
			    									arrayRequestJoinGuild = rows;
			    									//danh sách membe của guild			
			    									//cập nhật tình trạng online của member in guild
			    									var dt = datetime.create();		
													console.log(dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	
													connection.query("UPDATE guildlistmember SET Status = 1, TimeDetail = '"+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentUser.name
																	+"'AND GuildName = '"+rows[0].GuildName+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 137');
														}else
														{
															if (result.affectedRows>0) 
															{
																connection.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 138');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayAllMemberGuild = rows;
																		}															
																	}
																})
																//Dữ Liệu Leader/Co_Leader đã mời những người nào
																connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 139');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayAllInviteByGuild=rows;
																		}
																	}
																});
																//dữ liệu policy
																connection.query("SELECT * FROM `policys` where GuildName='"+rows[0].GuildName+"'",function(error, rows,field)
														        {
																	if (!!error)
																	{
																		console.log('Error in the query 140');
																	}else
																	{
																		if (rows.length >0) 
																		{
																			arrayPolicy = rows;
																		}
																		
																	}
																})

																//kiểm tra tình trạng online
																connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 141');
																	}else
																	{
																		if (rows.length>0) 
																		{
																			arrayNotisyStatus = rows;																																			
																			for (var i = 0; i < arrayNotisyStatus.length; i++) 
																	  		{																	  			
																	  			if ((lodash.filter(clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
																	  			{																	  			
																  					io.in(clients[clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('RECEIVESTATUS',
																					{
																						Status : 1,
																						TimeDetail : dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
																						UserName : currentUser.name,																																							
																                	});
																	  													  															  								                	
																	  			}													  							  			
																	  		}			 
																		}else
																		{

																		}				

																	}
																})

																//Cập nhật tình trạng đóng góp cho guild
																connection.query("SELECT * FROM `guildlistmember` WHERE MemberName = '"+currentUser.name+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 142');
																	}else
																	{
																		if (rows.length>0) 
																		{
																			d = new Date();
		        															createPositionTimelast = Math.floor(d.getTime() / 1000);
		        															if (parseFloat(rows[0].TimeComplete) >parseFloat(createPositionTimelast)) 
		        															{
		        																connection.query("UPDATE guildlistmember SET TimeRemain = '"+ (parseFloat(rows[0].TimeComplete)-parseFloat(createPositionTimelast))
		        																	+"' where MemberName = '"+currentUser.name+"'",function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 143');
																					}else
																					{
																						if (result.affectedRows>0) 
																						{
																						}
																					}
																				});
		        															}else
		        															{
		        																connection.query("UPDATE guildlistmember SET TimeRemain = 0 where MemberName = '"+currentUser.name+"'",function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 144');
																					}else
																					{
																						if (result.affectedRows>0) 
																						{
																						}
																					}
																				});		        																
		        															}
																						 
																		}else
																		{

																		}				

																	}
																})

															}
														}
													})  
													//hien thi tin nhan chua xem của guild
													connection.query("SELECT * FROM `chatting` WHERE `GuildName`='"+arrayRequestJoinGuild[0].GuildName+"' AND `ServerTime` >= '"+parseFloat(arrayUserLogin[0].TimeCancelGuild)+"' ",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 145');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayMessGuildMember =rows;												  						       		                	
													  						            		
											            	}
											            }
											        });  
											        //hien thi tin nhan chua xem của private
											        connection.query("SELECT * FROM `chatting` WHERE `ToUserName`='"+currentUser.name+"' AND `CheckCloseMessPrivate` = 1 ",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 146');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayMessPrivateMember =rows;												  						       		                	
													  						            		
											            	}
											            }
											        });

											         //hien thi black list đã khóa user nào 
											        connection.query("SELECT * FROM `blacklist` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 147');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayBlackList =rows;												  						       		                	
													  						            		
											            	}
											            }
											        }); 
											        //hien thi black list đã bị khóa bởi user nào
											        connection.query("SELECT * FROM `blacklist` WHERE `WithUserName`='"+currentUser.name+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 148');						
															
														}else
														{											
															if (rows.length > 0) 
															{           					    				            		
																arrayBlockedBlackListByUser =rows;											  						       		                	
													  						            		
											            	}
											            }
											        }); 

																
			    								}else
			    								{
			    									if ( parseFloat(createPositionTimelast)>=parseFloat(rows[0].TimeReset) 
			    										&&(rows[0].ActiveStatus===0))   
													{
														connection.query("DELETE FROM guildlistmember WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, result, field)
														  	{
																if(!!error)
																{
																	console.log('Error in the query 149');
																}else
																{
																	if(result.affectedRows>0)
																	{																		
																		arrayRequestJoinGuild =[];
																	}else
																	{
																		console.log("remove Join is not succes 150");																														
																	}
																}
															})															
																									
													}else
													{													

														arrayRequestJoinGuild = rows;
													}

			    								}	    								
																									
											}else
											{
												arrayRequestJoinGuild =[];
											}
											
										}
									})
									//dữ liệu tất cả các guild đã mời user
									//dữ yêu cầu tham gia guild hiện tại của user
									connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`!='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 151');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllRequestJoinGuildByUser=rows;
											}
										}
									});														

									//dữ liệu nâng cấp guild
									connection.query("SELECT * FROM `resourceupguild` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 152');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupguild = rows;
											}
											
										}
									})

									////dữ liệu toàn bộ guild
									connection.query("SELECT * FROM `guildlist` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 153');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllGuildList = rows;
											}
											
										}
									})

									//dữ liệu mua base
									connection.query("SELECT * FROM `resourcebuybase` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 154');
										}else
										{
											if (rows.length >0) 
											{												
												arrayAllresourcebuybase = rows;
											}
											
										}
									})

									//dữ liệu nâng cấp mine
									connection.query("SELECT * FROM `resourceupmine` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 155');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupmine = rows;
											}																				
										}
									})

	                				//dữ liệu nâng cấp Swordman
									connection.query("SELECT * FROM `resourceupswordman` where 1",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 156');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupSwordman = rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Farm
									connection.query("SELECT * FROM `resourceupfarm` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 157');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupFarm=rows;											
											}																				
										}
									})

									//dữ liệu nâng cấp Wood
									connection.query("SELECT * FROM `resourceupwood` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 158');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupWood=rows;										
												
											}																				
										}
									})

									//dữ liệu nâng cấp Stone
									connection.query("SELECT * FROM `resourceupstone` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 159');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupStone=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Metal
									connection.query("SELECT * FROM `resourceupmetal` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 160');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupMetal=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Bowman
									connection.query("SELECT * FROM `resourceupBowman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 161');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBowman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Granary
									//connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`, CONVERT(`MaxStorage`, CHAR(50)) as `MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
									connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`,`MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 162');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupGranary=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Market
									connection.query("SELECT * FROM `resourceupMarket` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 163');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupMarket=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp CityWall
									connection.query("SELECT * FROM `resourceupCityWall` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 164');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCityWall=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Crossbow
									connection.query("SELECT * FROM `resourceupCrossbow` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 165');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCrossbow=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Horseman
									connection.query("SELECT * FROM `resourceupHorseman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 166');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupHorseman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Tower
									connection.query("SELECT * FROM `resourceupTower` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 167');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupTower=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Spearman
									connection.query("SELECT * FROM `resourceupSpearman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 168');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupSpearman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Shaman
									connection.query("SELECT * FROM `resourceupShaman` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 169');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupShaman=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Ballista
									connection.query("SELECT * FROM `resourceupBallista` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 170');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBallista=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp BatteringRam
									connection.query("SELECT * FROM `resourceupBatteringRam` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 171');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBatteringRam=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Trebuchet
									connection.query("SELECT * FROM `resourceupTrebuchet` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 172');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupTrebuchet=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp HorseArcher
									connection.query("SELECT * FROM `resourceupHorseArcher` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 173');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupHorseArcher=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp ElephantArcher
									connection.query("SELECT * FROM `resourceupElephantArcher` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 174');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupElephantArcher=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp Cavalry
									connection.query("SELECT * FROM `resourceupCavalry` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 175');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupCavalry=rows;
											}																				
										}
									})

									//dữ liệu nâng cấp BattleElephant
									connection.query("SELECT * FROM `resourceupBattleElephant` where 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 176');
										}else
										{
											if (rows.length >0) 
											{
												arrayAllresourceupBattleElephant=rows;
											}																				
										}
									})

									connection.query("SELECT * FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 177');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayAllMinePosition.push(rows[i].Position);
									        }
									        
										}
									})

									//connection.query("SELECT * FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' OR `numberBase`!='"+0+"'",function(error, rows,field)
									connection.query("SELECT * FROM `userbase` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 178');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayBaseResource.push(rows[i]);
									        }
									       
										}
									})

									connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 179');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        				arrayAllMinepositionTrue.push(rows[i]);
									        }
									       
										}
									})

									//Đồng bộ giữa redis và my sql
									connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 189');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{																	        					
												//update resid															        					
												client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
												//update array memory
												if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
												{
													//cập nhật tình trạng ofllie cho unit location
													redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
												}
									        }  
									          
										}
									})
									connection.query("SELECT * FROM `resourcebuyunit` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 181');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAllresourcebuyunit.push(rows[i]);
									        }
									       
										}
									})
									connection.query("SELECT * FROM `users` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 182');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAllUsers.push(rows[i]);
									        }
									       
										}
									})
									//list user Da addfriend
									connection.query("SELECT  `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
										+"' AND `ActiveStatus` =1 UNION ALL SELECT  `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
										+"' AND `ActiveStatus` =1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 183');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayAddedFriend.push(rows[i]);
									        }
									       
										}
									})
									connection.query("SELECT  * FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
										+"' AND  `ActiveStatus` =2 UNION ALL SELECT  * FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
										+"' AND  `ActiveStatus` =2",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 184');
										}else
										{																					
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayCancelFriend.push(rows[i]);
									        }
									       
										}
									})
									//list user cho add friend
									connection.query("SELECT `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 185');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayWaitedFriend.push(rows[i]);
									        }
									       
										}
									})

									//list user cho waited add friend
									connection.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 186');
										}else
										{											
											for (var i = 0; i < rows.length; i++)
											{
						        					arrayWaitingFriend.push(rows[i]);
									        }
									       
										}
									})
									//cập nhật bạn của nhau trong redis
									connection.query("SELECT `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus` FROM `addfriend` WHERE `ActiveStatus`=1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 187');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{														
												//update resid															        					
					        					client.set(rows[i].UserNameFriendA+rows[i].UserNameFriendB,JSON.stringify(rows[i]));			        																											
									        }	
									    }
									});							



									//update user online 
									connection.query('UPDATE unitinlocations SET CheckOnline = 1 WHERE UserName = ?', [currentUser.name],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 188');
										}else
										{
											if (result.affectedRows> 0) {											
												
											}
											else
											{
												console.log('hiện tại user chưa có unit inlocation 189err');
											}
										}
									});
									connection.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 190');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
							    				arraycheckUserlg.push(rows[i]);
									        }								       
										}
									})
									//cập nhật vi trí unit location
									connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 191');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{
												d = new Date();
					    						createPositionTimelast = Math.floor(d.getTime() / 1000);
					    						APosition = rows[i].Position;
					    						A = APosition.split(",");
												A1 = parseFloat(A[0]);
												A2 = parseFloat(A[1]);
												BPosition = rows[i].PositionClick;
												B = BPosition.split(",");
												B1 = parseFloat(B[0]);
												B2 = parseFloat(B[1]);
												//kiểm tra trùng và set lại
												idUnitInLocationstemp = rows[i].idUnitInLocations;
												//Kiểm tra trạng thái di chuyển khi đăng nhập
					    						if (parseFloat(rows[i].CheckMoveOff)==1) 
					    						{					    							
					    							CheckMove = 1;
					    							CheckMoveOff = 0;
					    						}

					    						if( (parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick)) < parseFloat(rows[i].TimeMoveComplete) )
					    						{
					    							timeMoves = 0;
					    							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B1-A1))/parseFloat(rows[i].TimeMoveComplete);
					    							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B2-A2))/parseFloat(rows[i].TimeMoveComplete);
					    							timeMoves = parseFloat(rows[i].TimeMoveTotalComplete) - parseFloat(createPositionTimelast);					    							
					    							//update vị trị sau cùng và time move
						    						connection.query("UPDATE unitinlocations SET CheckMove = '"+parseFloat(CheckMove)
					    							+"', CheckMoveOff='"+parseFloat(CheckMoveOff)
					    							+"', Position = '"+X+","+Z
					    							+"', TimeMoveComplete = '"+parseFloat(timeMoves)
					    							+"', timeClick = '"+parseFloat(createPositionTimelast)
					    							+"' WHERE UserName = '"+rows[i].UserName+"' AND UnitOrder = '"+rows[i].UnitOrder+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 192d');
														}else
														{
															if (result.affectedRows> 0) {															
																 //cập nhật unit locations
																 console.log("Cập nhật thanh công tình trang dang nhap");
															}
															else
															{
																console.log('khong co time remain duoc cap nhat 193d');
															}

														}
													})
												}			    						

									        }

									        connection.query("SELECT * FROM `unitinlocations` WHERE CheckMove=0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
											{
												if (!!error) {
													console.log('Error in the query 194');
												}else
												{
													for (var k = 0; k < rows.length; k++)
													{
														arrayAllUnitLocationsCompletefirst.push(rows[k]);												
											        }

											        for (var j = 0; j < arrayAllUnitLocationsCompletefirst.length; j++)
													{														
														if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)>=2)									
														{
															 for (var M = 0; M <= 36; M++) 
															{
																var arr = arrayAllUnitLocationsCompletefirst[j].PositionClick.split(",");
																var i = 1;
																var K=M;
																if(M > 7 && M < 16)
																{
																	i = 2;
																	K = M-7;
																}else if(M > 15 && M < 36)
																{
																	i = 3;
																	K = M-15;
																}
																newLocation =functions.getNewLocationClick(arr[0],arr[1],i,K);
																arrayAllUnitLocationsCompletefirst[j].PositionClick = newLocation;																
																if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)<=1)
																{												
																	break;
																}
															}																														
															//cập nhật position mới trung vào data
															connection.query('UPDATE unitinlocations SET Position = ?,PositionClick = ?  WHERE idUnitInLocations = ?', [newLocation, newLocation,arrayAllUnitLocationsCompletefirst[j].idUnitInLocations],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 194');
																}else
																{
																	if (result.affectedRows> 0) {																	
																		
																	}
																	else
																	{
																		console.log('khong co time remain duoc cap nhat  195');
																	}

																}
															})
														}
											        }


												}
											})

											connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
											{
												if (!!error) {
													console.log('Error in the query 196');
												}else
												{
													
													for (var i = 0; i < rows.length; i++)
													{
						                					arrayAllUnitLocationsComplete.push(rows[i]);
											        }
												}
												connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 197');
													}else
													{
														
														for (var i = 0; i < rows.length; i++)
														{
								            				arrayUnitLocationsComplete.push(rows[i]);
												        }												      
												    }
												})
											})

										}
									})						
									// cap nhat time remain
									connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
									{
										var index=-1;
										if (!!error) {
											console.log('Error in the query 198');
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{					        					
					        					d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);

					        					if(parseFloat(rows[i].timeComplete)>parseFloat(createPositionTimelast))
					        					{			        						

													connection.query("UPDATE unitwaitinbase SET timeRemain = '"+(parseFloat(rows[i].timeComplete)-parseFloat(createPositionTimelast))
														+"' WHERE UserName = '"+rows[i].UserName
														+"' AND numberBase = '"+parseFloat(rows[i].numberBase)
														+"' AND UnitType = '"+parseFloat(rows[i].UnitType)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 199');
														}else
														{
															if (result.affectedRows>0) 
															{																									
															}else
															{
																console.log("update khong thanh cong 200");
															}
														}
													});

					        					}else 
					        					{
					        						//Insert/update vào unitinbae						        						
					        						
													connection.query("UPDATE unitinbase SET Quality = Quality + '"+parseFloat(rows[i].Quality)+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
															[rows[i].UserName,rows[i].numberBase,rows[i].UnitType,rows[i].Level],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 201');
														}else
														{
															index++;
															if (result.affectedRows > 0) 
															{															
																
																connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
															  	{
																	if(!!error)
																	{
																		console.log('Error in the query 202');
																	}else
																	{
																		if(result)
																		{																			
																		}else
																		{
																			console.log("Update khong thanh cong 203");	
																			socket.emit('ReceiveUnitInBaseSuccess',
																			{
																				message:0,									
																			});											
																		}
																	}
																})
															}else
															{
																console.log("insert unitinbase thanh cong");
																//nếu không cập nhật thì insert																		
																connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`numberBase`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
																+rows[index].UserName+"','"+rows[index].numberBase+"','"+rows[index].UnitType+"','"+rows[index].Quality+"','"
																+rows[index].Level+"')",function(error, result, field)
																{
														            if(!!err)
														            {
														            	console.log('Error in the query 204');
														            }else
														            {
														            	if (result.affectedRows > 0) 
														            	{														            		
														            		connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																			[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
																		  	{
																				if(!!error)
																				{
																					console.log('Error in the queryfgfg7567');
																				}else
																				{
																					if(result)
																					{																					
																					}else{}	
																				}
																			})
														            	}
														            	
														            }
																})										

															}
															
														}
													})												

					        					}
					        					
									        }
									        
										}
									})
									
									connection.query("SELECT * FROM `unitinlocations` WHERE `UserName`='"+currentUser.name+"' AND `TransferCompleteTotalTime`>0",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 205');
										}else
										{
											if (rows.length>0) 
											{
											
												arrayTimeTransferFarmfromBaseToUnit= rows;												

											}else
											{

											}

										}
									})
									//kiem tra trong bảng page user đã tạo chưa
									connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
							        {
										if (!!error)
										{
											console.log('Error in the query 205');
										}else
										{
											//đã tồn tại page cho user dn lần đầu					
											if (rows.length>0){											
												//load base đả có sẳn
												d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);
												connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout =?,timeResetMine = ? WHERE UserName = ?', [createPositionTimelast,socket.id,"",createPositionTimelast, currentUser.name],function(error, result, field)
												{
												
													if(!!error)
													{
														console.log('Error in the query 206');
													}else
													{
														if(result)
														{
															//update checkResetMine for page

															connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 207');
																}else
																{																
																	if(result)
																	{
																		connection.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 208');
																			}else
																			{																				
																				for (var i = 0; i < rows.length; i++) 
																				{
													                				arrayUnitBaseUser.push(rows[i]);
																		        }
																		        connection.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 209');
																					}else
																					{

																						for (var i = 0; i < rows.length; i++) {
															                				arrayUnitWaitBaseUser.push(rows[i]);
																				        }
																				        connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
																				        {
																							if (!!error)
																							{
																								console.log('Error in the query 210');
																							}else
																							{
																								//đã tồn tại page cho user dn lần đầu						
																
																								if (rows.length>0){																									
																									for (var i = 0; i < rows.length; i++) 
																									{
																	                					arrayBaseUser.push(rows[i]);
																						        	}
																						        	 //cập nhật online cho redis
																									connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																									{
																										if (!!error)
																										{
																											console.log('Error in the query211');
																										}else
																										{
																											for (var i = 0; i < rows.length; i++)
																											{		
																												//update resid															        					
																					        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																					        					//update array memory
																					        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																												{
																													//cập nhật tình trạng ofllie cho unit location
																													redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																												}
																									        }																				        																									        
						    																				clients.push(currentUser);							    																													
																											connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
																											{
																												if (!!error)
																												{
																													console.log('Error in the query 212');
																												}else
																												{
																													if (rows.length>0) 
																													{
																														arrayOnlineStatus = rows;																																			
																														for (var i = 0; i < arrayOnlineStatus.length; i++) 
																												  		{

																												  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
																												  			{	
																											  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																																{
																																	Status : 1,	
																																	UserName : currentUser.name,
																																	idUnitInLocations: arrayUnitLocationsComplete,																																																					
																											                	});
																												  													  															  								                	
																												  			}													  							  			
																												  		}			 
																													}else
																													{

																													}				

																												}
																											})


						    																				//write file

						    																				//let idSocket = currentUser.idSocket+"*";

																											//fs.appendFile('socketio.js', idSocket, function (err) {
																											//  if (err) throw err;
																											//  console.log('Saved!');
																											//});

																											//read file 
																											//var array = require("fs").readFileSync("socketio.js").toString().split("*");
																											//console.log("chieu dai mang doc:  "+ array.length+"_"+array[0]);						    																				
																									        connection.release();
																									        console.log("User: "+currentUser.name +" id socket: "+socket.id+" has connected");
																									        socket.emit('loginSuccess',
																											{
																						                    	message : '1',
																						                    	arrayTimeTransferFarmfromBaseToUnit:arrayTimeTransferFarmfromBaseToUnit,
																						                    	arrayMessGuildMember:arrayMessGuildMember,
																						                    	arrayMessPrivateMember:arrayMessPrivateMember,
																						                    	arrayBlackList:arrayBlackList,
																						                    	arrayBlockedBlackListByUser:arrayBlockedBlackListByUser,
																						                    	currentUser:currentUser,
																						                    	arrayAllResourceToDiamond:arrayAllResourceToDiamond,
																						                    	arrayPolicy:arrayPolicy,
																						                    	arrayUserLogin: arrayUserLogin,
																						                    	arrayAllInviteByGuild: arrayAllInviteByGuild,
																						                    	arrayAllRequestJoinGuildByUser:arrayAllRequestJoinGuildByUser,
																						                    	arrayAllMemberGuild:arrayAllMemberGuild,
																						                    	arrayRequestJoinGuild:arrayRequestJoinGuild,
																						                    	arrayAllGuildList:arrayAllGuildList,
																						                    	arrayAllresourceupguild:arrayAllresourceupguild,
																						                    	arrayAllresourcebuybase:arrayAllresourcebuybase,
																						                    	arrayWaitingFriend: arrayWaitingFriend,
																						                    	arrayWaitedFriend:arrayWaitedFriend,
																						                    	arrayAddedFriend:arrayAddedFriend,
																						                    	arrayCancelFriend:arrayCancelFriend,
																						                    	getAllUser: arrayAllUser,
																						                    	arrayAllUsers: arrayAllUsers,
																						                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																						                    	getBaseResource: arrayBaseResource,
																						                    	getBaseUser: arrayBaseUser,
																						                    	getUnitBaseUser: arrayUnitBaseUser,
																						                    	getUnitWaitBaseUser: arrayUnitWaitBaseUser,
																						                    	getUnitLocationsComplete: arrayUnitLocationsComplete,
																						                    	getTimeResetserver: timeSend,
																						                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																						                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																						                    	arrayAllresourceupbase : arrayAllresourceupbase,
																						                    	arrayAllresourceupmine : arrayAllresourceupmine,
																						                    	arrayAllresourceupSwordman:arrayAllresourceupSwordman,
																						                    	arrayAllresourceupFarm:arrayAllresourceupFarm,
																												arrayAllresourceupWood:arrayAllresourceupWood,
																												arrayAllresourceupStone:arrayAllresourceupStone,
																												arrayAllresourceupMetal:arrayAllresourceupMetal,
																												arrayAllresourceupBowman:arrayAllresourceupBowman,
																												arrayAllresourceupGranary:arrayAllresourceupGranary,
																												arrayAllresourceupMarket:arrayAllresourceupMarket,
																												arrayAllresourceupCityWall:arrayAllresourceupCityWall,
																												arrayAllresourceupCrossbow:arrayAllresourceupCrossbow,
																												arrayAllresourceupHorseman:arrayAllresourceupHorseman,
																												arrayAllresourceupTower:arrayAllresourceupTower,
																												arrayAllresourceupSpearman:arrayAllresourceupSpearman,
																												arrayAllresourceupShaman:arrayAllresourceupShaman,
																												arrayAllresourceupBallista:arrayAllresourceupBallista,
																												arrayAllresourceupBatteringRam:arrayAllresourceupBatteringRam,
																												arrayAllresourceupTrebuchet:arrayAllresourceupTrebuchet,
																												arrayAllresourceupHorseArcher:arrayAllresourceupHorseArcher,
																												arrayAllresourceupElephantArcher:arrayAllresourceupElephantArcher,
																												arrayAllresourceupCavalry:arrayAllresourceupCavalry,
																												arrayAllresourceupBattleElephant:arrayAllresourceupBattleElephant, 
																						                	});
																										}
																									})	
																									
																								}
																							}
																						});
		
																					}
																				})
																			}

																		})

																	}else
																	{
																		console.log('cap nhat that bai 213');
																	}
																}
															});


														}else
														{
															console.log('cap nhat that bai 214');
														}
													}
												});
											}else
											{
												//tạo Base mới cho user dn lần đầu
												d = new Date();
								    			createPositionTimelast = Math.floor(d.getTime() / 1000);
												var arr = lastPosition.split(",");
												var lastLocationjson = arr[0]+","+arr[1];
												var i = functions.getRandomIntInclusive(1,8), M=0;
												arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
												newLocation =functions.getNewLocation(arr[0],arr[1],i,M);
												while(arrayAllMineMerger.indexOf(newLocation)>=1)
												{
													i = functions.getRandomIntInclusive(1,8);
													newLocation =functions.getNewLocation(arr[0],arr[1],i,M);
												}
												arrayAllMineMerger.push(newLocation);

												//Load Base mới tạo
												connection.query("SELECT * FROM `resourcebuybase` WHERE `numberBase` = 0",function(error, rows,field)
												{
													if (!!error) {
														console.log('Error in the query 215');
													}else
													{
														if (rows.length > 0)
														{		
															console.log("INSERT INTO tjhamh cong");	
															//Load Base mới tạo
															connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `MaxStorage`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`) VALUES ('"
																+""+"','"+UserNameLogin+"','"+10000+"','"+newLocation+"','"+1+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady+"','"+createPositionTimelast+"','"+rows[0].numberBase+"','"+0+"','"+1+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"')",function(error, result, field)
															{
													            if(!!err) {
													            	console.log('insert thất bại 216');
													            }else
													            {
													            	d = new Date();
													    			createPositionTimelast = Math.floor(d.getTime() / 1000);
																	connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout =?,timeResetMine = ?,Diamond = ? WHERE UserName = ?', [createPositionTimelast,socket.id,"",createPositionTimelast,rows[0].DiamondReady, currentUser.name],function(error, result, field)
																	{
																	
																		if(!!error)
																		{
																			console.log('Error in the query 217');
																		}else
																		{
																			if(result)
																			{
																				//update checkResetMine for page
																				connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 218');
																					}else
																					{																
																						if(result)
																						{
																							connection.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																							{
																								if (!!error)
																								{
																									console.log('Error in the query 219');
																								}else
																								{
																									for (var i = 0; i < rows.length; i++) 
																									{
																		                				arrayUnitBaseUser.push(rows[i]);
																							        }
																							        connection.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																									{
																										if (!!error)
																										{
																											console.log('Error in the query 220');
																										}else
																										{

																											for (var i = 0; i < rows.length; i++) {
																				                				arrayUnitWaitBaseUser.push(rows[i]);
																									        }
																									        connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
																									        {
																												if (!!error)
																												{
																													console.log('Error in the query 221');
																												}else
																												{
																													//đã tồn tại page cho user dn lần đầu						
																					
																													if (rows.length>0){																														
																														for (var i = 0; i < rows.length; i++) 
																														{
																						                					arrayBaseUser.push(rows[i]);
																											        	}
																											        	 //cập nhật online cho redis
																														connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																														{
																															if (!!error)
																															{
																																console.log('Error in the query 222');
																															}else
																															{
																																for (var i = 0; i < rows.length; i++)
																																{		
																																	//update resid															        					
																										        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																										        					//update array memory
																										        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																																	{
																																		//cập nhật tình trạng ofllie cho unit location
																																		redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																																	}
																														        }																				        																														        
											    																				clients.push(currentUser);												    																													
																																connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
																																{
																																	if (!!error)
																																	{
																																		console.log('Error in the query 222');
																																	}else
																																	{
																																		if (rows.length>0) 
																																		{
																																			arrayOnlineStatus = rows;																																			
																																			for (var i = 0; i < arrayOnlineStatus.length; i++) 
																																	  		{
																																	  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
																																	  			{	
																																  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																																					{
																																						Status : 1,	
																																						UserName : currentUser.name,
																																						idUnitInLocations: arrayUnitLocationsComplete,																																																					
																																                	});
																																	  													  															  								                	
																																	  			}													  							  			
																																	  		}			 
																																		}else
																																		{

																																		}				

																																	}
																																})										    																															    																				
																														        connection.release();
																														        console.log("User: "+currentUser.name +" id socket: "+socket.id+" has connected");
																														        socket.emit('loginSuccess',
																																{
																											                    	message : '1',
																											                    	arrayTimeTransferFarmfromBaseToUnit:arrayTimeTransferFarmfromBaseToUnit,
																											                    	currentUser:currentUser,
																											                    	arrayMessGuildMember:arrayMessGuildMember,
																											                    	arrayMessPrivateMember:arrayMessPrivateMember,
																											                    	arrayBlackList:arrayBlackList,
																											                    	arrayBlockedBlackListByUser:arrayBlockedBlackListByUser,
																											                    	arrayAllResourceToDiamond:arrayAllResourceToDiamond,
																											                    	arrayPolicy:arrayPolicy,
																											                    	arrayUserLogin: arrayUserLogin,
																											                    	arrayAllInviteByGuild: arrayAllInviteByGuild,
																											                    	arrayAllRequestJoinGuildByUser:arrayAllRequestJoinGuildByUser,
																											                    	arrayAllMemberGuild:arrayAllMemberGuild,
																											                    	arrayRequestJoinGuild:arrayRequestJoinGuild,
																											                    	arrayAllGuildList:arrayAllGuildList,
																						                    						arrayAllresourceupguild:arrayAllresourceupguild,
																											                    	arrayAllresourcebuybase:arrayAllresourcebuybase,
																											                    	arrayWaitingFriend: arrayWaitingFriend,
																											                    	arrayWaitedFriend:arrayWaitedFriend,
																									                    			arrayAddedFriend:arrayAddedFriend,
																									                    			arrayCancelFriend:arrayCancelFriend,
																											                    	getAllUser: arrayAllUser,
																											                    	arrayAllUsers: arrayAllUsers,
																											                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																											                    	getBaseResource: arrayBaseResource,
																											                    	getBaseUser: arrayBaseUser,
																											                    	getUnitBaseUser: arrayUnitBaseUser,
																											                    	getUnitWaitBaseUser: arrayUnitWaitBaseUser,
																											                    	getUnitLocationsComplete: arrayUnitLocationsComplete,
																											                    	getTimeResetserver: timeSend,
																											                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																											                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																											                    	arrayAllresourceupbase : arrayAllresourceupbase,
																											                    	arrayAllresourceupmine : arrayAllresourceupmine,
																											                    	arrayAllresourceupSwordman:arrayAllresourceupSwordman,
																											                    	arrayAllresourceupFarm:arrayAllresourceupFarm,
																																	arrayAllresourceupWood:arrayAllresourceupWood,
																																	arrayAllresourceupStone:arrayAllresourceupStone,
																																	arrayAllresourceupMetal:arrayAllresourceupMetal,
																																	arrayAllresourceupBowman:arrayAllresourceupBowman,
																																	arrayAllresourceupGranary:arrayAllresourceupGranary,
																																	arrayAllresourceupMarket:arrayAllresourceupMarket,
																																	arrayAllresourceupCityWall:arrayAllresourceupCityWall,
																																	arrayAllresourceupCrossbow:arrayAllresourceupCrossbow,
																																	arrayAllresourceupHorseman:arrayAllresourceupHorseman,
																																	arrayAllresourceupTower:arrayAllresourceupTower,
																																	arrayAllresourceupSpearman:arrayAllresourceupSpearman,
																																	arrayAllresourceupShaman:arrayAllresourceupShaman,
																																	arrayAllresourceupBallista:arrayAllresourceupBallista,
																																	arrayAllresourceupBatteringRam:arrayAllresourceupBatteringRam,
																																	arrayAllresourceupTrebuchet:arrayAllresourceupTrebuchet,
																																	arrayAllresourceupHorseArcher:arrayAllresourceupHorseArcher,
																																	arrayAllresourceupElephantArcher:arrayAllresourceupElephantArcher,
																																	arrayAllresourceupCavalry:arrayAllresourceupCavalry,
																																	arrayAllresourceupBattleElephant:arrayAllresourceupBattleElephant, 
																											                	});
																															}
																														})	
																														
																													}
																												}
																											});
							
																										}
																									})
																								}

																							})

																						}else
																						{
																							console.log('cap nhat that bai 223');
																						}
																					}
																				});


																			}else
																			{
																				console.log('cap nhat that bai 224');
																			}
																		}
																	});

													            }
													        });
															
														}else
														{
															console.log("=============khong selec dc 225");
														}
													}
												});

											}

										}
									});
									d = new Date();
						    		createPositionTimelast = Math.floor(d.getTime() / 1000);
									cron.schedule('*/1 * * * * *', function()
									{
							 	 		//check reset server of user
							 	 		var arrayAllMinepositionupdate = [];
						 	 			connection.query("SELECT `checkResetMine` FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
										{
											if (!!error) {
												console.log('Error in the query 226');
											}else
											{
												if (rows[0].checkResetMine === 1)
												{
													connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
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
															socket.emit('loginUnsuccessMine',
															{
									                    		getAllIDMineOfUser: arrayAllMinepositionupdate,
									                    		gettimeSendRepeat : 86400,
									                		});
									                		connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 228');
																}else
																{															
																	if(result)
																	{																	
																		
																	}else
																	{
																		console.log('cap nhat that bai 229');
																	}
																}
															});

														}
													})
												}else
												{
													
												}

											}
										})

									});													
								}

							}

						}else
						{		
							connection.release();				
							socket.emit('loginSuccess',
							{
		                    	message : '0',
		                    	arrayUserLogin: '0',
		                    	getAllUser : '0',
		                    	getAllMineOfUser : '0',
		                    	getBaseResource: '0',
		                    	getBaseUser : '0',
		                    	getUnitBaseUser: '0',
		                    	getUnitWaitBaseUser: '0',
		                    	getUnitLocationsComplete: '0',
		                    	getTimeResetserver: timeSend,
		                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
		                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
		                	});
						}
					}
				})
		    });			
			socket.emit('Login',currentUser );			
			//socket.emit('USER_CONNECTED',currentUser );
			socket.broadcast.emit('USER_CONNECTED',currentUser);
		});		

		socket.on('disconnected', function (data)
		{			
			currentdisconect =
			{
				UserName:data.UserName,						
				idSocket:data.idSocket,															
			}						
			var PositionLogout,timeMoveLogout,timeGetDetail;
			var arrayDistanceMove = [],arrayOnlineStatus=[],arraySendFarmAfterMoveConsume = [],arraySendFarmMoveConsume = [],FarmPortableMove,FarmPortableMoveOffComplete,
	    	APosition,BPosition,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrB,arrC,TimeMoveToOff=0,arraySendFarmMoveConsumeOffComplete = [],arraySendFarmMoveConsumeOff=[],
	    	APositionOff,BPositionOff,AOff,A1Off,A2Off,BOff,B1Off,B2Off,XOff,ZOff,PositionChangeOff,FarmPortableMoveOnOff,FarmPortableMoveOff,
	    	FarmPortableMoveOffNotEnought,AverageFarmSecond,NumberSecondMoveOff,PositionChangeOffNotEnought,TimeMoveCompletes=0,TimeMoveCompleteOffs =0;
			console.log(currentdisconect.UserName+"_"+currentdisconect.idSocket);
			if (clients.length>0
				&&(typeof currentdisconect.UserName !== 'undefined')
				&&(typeof currentdisconect.idSocket !== 'undefined')) 
			{
				for (var i = 0; i < clients.length; i++)
				{					
					if (typeof currentUser !== 'undefined')
					{
						if ((clients[i].name === currentdisconect.UserName && clients[i].idSocket === currentdisconect.idSocket)
							||(clients[i].name === currentUser.name && clients[i].id === currentUser.id))
						{

							pool.getConnection(function(err,connection)
							{
							    if (err)
							    {
							      return;
							    }
							    else
							    {
							    	//cập nhật thời gian logout
							    	d = new Date();
						    		createPositionTimelast = Math.floor(d.getTime() / 1000);

									//check khong xem tn guild						    			
									connection.query("UPDATE users SET TimeCancelGuild = '"+parseFloat(createPositionTimelast)+"' where UserName = '"+currentUser.name+"' AND CheckCloseMessGuild = 0",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 298');
										}else
										{
											if (result.affectedRows>0) 
											{												
											}
										}
									});	

									//check khong xem tin nhan cua private
									connection.query("UPDATE users SET CheckCloseMessPrivateUser = 1 where UserName = '"+currentUser.name+"' AND CheckCloseMessPrivateUser = 0",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 299');
										}else
										{
											if (result.affectedRows>0) 
											{												
											}
										}
									});							    		

									//Thực hiện kiểm tra vị trí với farm hiện tại khi user oflline
									var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1  AND TimeMoveTotalComplete  >'"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 392c');
										}else
										{
											if (rows.length>0) 
											{						
												arraySendFarmMoveConsumeOff =rows;	
												console.log("tong thoi gian vi tri di toi diem den: "+ rows[0].TimeMoveComplete);						
												for (var i = 0; i < arraySendFarmMoveConsumeOff.length; i++) 
												{	
													var index = i,PositionClickChange;
													if (arraySendFarmMoveConsumeOff[index].UserName === currentdisconect.UserName) 
													{
														//tính lượng farm và lấy vị trí hiện tại đi cho đoạn đường đi từ vị trí sau cùng							
														//thời gian mà user đã di chuyển được từ điểm cuối
														TimeMoveToOff = parseFloat(createPositionTimelast)-parseFloat(arraySendFarmMoveConsumeOff[index].timeClick);													
														APositionOff = rows[index].Position;
														AOff = APositionOff.split(",");
														A1Off = parseFloat(AOff[0]);
														A2Off = parseFloat(AOff[1]);
														BPositionOff = rows[index].PositionClick;
														BOff = BPositionOff.split(",");
														B1Off = parseFloat(BOff[0]);
														B2Off = parseFloat(BOff[1]);
														XOff= A1Off+((parseFloat(TimeMoveToOff))*(B1Off-A1Off))/parseFloat(rows[i].TimeMoveComplete);
														XOff=Number((parseFloat(XOff).toFixed(1)));
														ZOff= A2Off+((parseFloat(TimeMoveToOff))*(B2Off-A2Off))/parseFloat(rows[i].TimeMoveComplete);
														ZOff=Number((parseFloat(ZOff).toFixed(1)));							
														PositionChangeOff = XOff+","+ZOff;															
														console.log("Vị trị hiện tại đã di chuyển được là: "+ PositionChangeOff);
														console.log("Thoi gian vị trị tính đến hiện tại đa di duoc: "+ TimeMoveToOff);

														//kiểm tra lượng farm còn lại cho lần di chuyển kế tiếp													
														//FarmPortableMoveOnOff = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(TimeMoveToOff));														
														//console.log("Farm tinh khi di chuyển con lai sau khi di chuyen: "+ FarmPortableMoveOnOff);
														//kiểm tra lượng farm cho di chuyển oflline
														FarmPortableMoveOff = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(arraySendFarmMoveConsumeOff[index].TimeMoveComplete)));														
														//console.log("Farm cân cho di chuyển offline: "+ FarmPortableMoveOff);							
														//console.log("Thời gian cần cho di chuyển oflline: "+(parseFloat(arraySendFarmMoveConsumeOff[index].TimeMoveComplete)));
														AverageFarmSecond =parseFloat(rows[index].Quality)/(1/parseFloat(rows[index].MoveSpeedEach));	
														//console.log("Farm moi giay cần có:==================== "+ FarmPortableMoveOff);					

														//tính trung bình mổi giay di được bao nhiêu farm
														if (FarmPortableMoveOff > parseFloat(rows[index].FarmPortable)) 
														{
															//Thiếu farm
															//console.log("=================Thiếu farm");																
															NumberSecondMoveOff = parseFloat(rows[index].FarmPortable)/AverageFarmSecond;
															//console.log("số lượng giay sẽ di được với số farm còn lại là: "+NumberSecondMoveOff);															
															if ((parseInt(A1Off,10)===parseInt(B1Off,10))
																||(parseInt(A2Off,10)===parseInt(B2Off,10))) 
															{
																
																NumberSecondMoveOff = NumberSecondMoveOff -(NumberSecondMoveOff%(1/(parseFloat(rows[i].MoveSpeedEach))));
																//console.log("Cập nhật vị trí le trong truong hop di thẳng: "+ NumberSecondMoveOff);
																//tính lại vị trí đi được với số farm còn lại
																APositionOff = rows[index].Position;
																AOff = APositionOff.split(",");
																A1Off = parseFloat(AOff[0]);
																A2Off = parseFloat(AOff[1]);
																BPositionOff = rows[index].PositionClick;
																BOff = BPositionOff.split(",");
																B1Off = parseFloat(BOff[0]);
																B2Off = parseFloat(BOff[1]);
																XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
																XOff=Number((parseFloat(XOff).toFixed(1)));
																ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
																ZOff=Number((parseFloat(ZOff).toFixed(1)));							
																PositionChangeOffNotEnought = XOff+","+ZOff;
																//console.log("Vị trí sau khi tinh toán với số farm còn lại: "+ PositionChangeOffNotEnought);																																

															}else
															{
																//tính lại vị trí thiếu farm theo đơn vị thời gian
																//kiểm tra di chuyển là vị trí chéo
																// if ((Math.abs(parseInt(B1Off,10) -parseInt(A1Off,10))===Math.abs(parseInt(B2Off,10) -parseInt(A2Off,10)))
																// 	&&(parseFloat(rows[index].FarmPortable) >= (parseFloat(rows[index].Quality)*(1.4/(parseFloat(rows[i].MoveSpeedEach)))))) 
																if ((Math.abs(parseInt(B1Off,10) -parseInt(A1Off,10))===Math.abs(parseInt(B2Off,10) -parseInt(A2Off,10)))) 
																{
																	console.log("1: "+parseFloat(rows[index].FarmPortable));
																	console.log("2: "+parseFloat(rows[index].Quality));
																	console.log("3: "+(1.4/(parseFloat(rows[i].MoveSpeedEach))));
																	console.log(parseFloat(rows[index].FarmPortable)+"_"+(parseFloat(rows[index].Quality)*(14*(parseFloat(rows[i].MoveSpeedEach)))));
																	if (NumberSecondMoveOff<(1.4/(parseFloat(rows[i].MoveSpeedEach)))) 
																	{
																		NumberSecondMoveOff = (1.4/(parseFloat(rows[i].MoveSpeedEach)));																		
																	}else
																	{
																		NumberSecondMoveOff = NumberSecondMoveOff -(NumberSecondMoveOff%(1.4/(parseFloat(rows[i].MoveSpeedEach))));
																	}	
																	console.log("================Cập nhật vị trí le trong truong hop di chuyen cheo: "+NumberSecondMoveOff);
																	//tính lại vị trí đi được với số farm còn lại
																	APositionOff = rows[index].Position;
																	AOff = APositionOff.split(",");
																	A1Off = parseFloat(AOff[0]);
																	A2Off = parseFloat(AOff[1]);
																	BPositionOff = rows[index].PositionClick;
																	BOff = BPositionOff.split(",");
																	B1Off = parseFloat(BOff[0]);
																	B2Off = parseFloat(BOff[1]);
																	XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
																	XOff=Number((parseFloat(XOff).toFixed(1)));
																	ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
																	ZOff=Number((parseFloat(ZOff).toFixed(1)));							
																	PositionChangeOffNotEnought = XOff+","+ZOff;
																	//console.log("Vị trí sau khi tinh toán với số farm còn lại: "+ PositionChangeOffNotEnought);

																}else
																{
																	console.log("==================Cập nhật vị trí le trong truong hop di chuyen khong xac dinh");
																	//tính lại vị trí đi được với số farm còn lại
																	APositionOff = rows[index].Position;
																	AOff = APositionOff.split(",");
																	A1Off = parseFloat(AOff[0]);
																	A2Off = parseFloat(AOff[1]);
																	BPositionOff = rows[index].PositionClick;
																	BOff = BPositionOff.split(",");
																	B1Off = parseFloat(BOff[0]);
																	B2Off = parseFloat(BOff[1]);
																	XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
																	XOff=Number((parseFloat(XOff).toFixed(1)));
																	ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
																	ZOff=Number((parseFloat(ZOff).toFixed(1)));							
																	PositionChangeOffNotEnought = XOff+","+ZOff;
																	//console.log("Vị trí sau khi tinh toán với số farm còn lại: "+ PositionChangeOffNotEnought);
																}
																

															}
															
															//set lại vị trí chẳn nếu vị trí hết farm là lẻ
															if (((parseFloat(XOff) % 1 ) < 0.099) && ((parseFloat(Math.abs(ZOff)) % 1 ) < 0.099))
															{	
																//console.log("Cập nhật vị trí chan");
																TimeMoveCompletes = (parseFloat(createPositionTimelast)+parseFloat(NumberSecondMoveOff));
																PositionChangeOffNotEnought = Number((parseFloat(XOff).toFixed(0)))+","+Number((parseFloat(ZOff).toFixed(0)));
																//console.log("Thời gian set lai cho vi tri chan la: "+TimeMoveCompletes);
																//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
																var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+parseFloat(NumberSecondMoveOff)
										                			+"',TimeMoveTotalComplete = '"+parseFloat(TimeMoveCompletes)
										                			+"',Position = '"+ PositionChangeOff			                			
										                			+"',PositionClick = '"+ PositionChangeOffNotEnought
										                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
										                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 393s');
																	}else
																	{
																		//Kiểm tra data sau khi update
																		if (result.affectedRows>0)
																		{
																			//console.log("Cập nhật thanh cong trong trường hợp chẳn không đủ farm");
																			//gửi vị trí lên cho các thành viên khác																			
														                	io.emit('RECEIVEPOSITIONCLICK',
																			{						
																				PositionClick:PositionChangeOffNotEnought,
																				Position: PositionChangeOff,
																				idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
															            	});														     
																		}else
																		{
																			console.log("khong Cập nhật thanh con gtrong trường hợp không đủ farm");												
																		}																								
																	}
																});					  								                							                								  									  								                	
													  														
															}else
															{	
																//kiểm tra nếu đi trên đường thảng
																//console.log("Cập nhật vị trí le");	
																//console.log("Vị trí hiện tại PositionClick: "+rows[index].PositionClick);															
												  				arrC =	PositionChangeOffNotEnought.split(",");
																arrB =	functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought).split(",");	
																var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																
																//console.log("Thời gian set lai vi tri chẵn không cần farm: "+time);
																TimeMoveCompletes=(parseFloat(createPositionTimelast) + parseFloat(NumberSecondMoveOff) + Number((time).toFixed(0)));
																TimeMoveCompleteOffs = parseFloat(NumberSecondMoveOff) + parseFloat(Number((time).toFixed(0)));
																PositionClickChange = functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought)
																//console.log("Vi tri duoc set lai là: "+functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought));																						                																			
											                	//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
																var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+TimeMoveCompleteOffs
										                			+"',TimeMoveTotalComplete = '"+ parseFloat(TimeMoveCompletes)
										                			+"',Position = '"+ PositionChangeOff			                			
										                			+"',PositionClick = '"+ PositionClickChange
										                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
										                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 393s');
																	}else
																	{
																		//Kiểm tra data sau khi update
																		if (result.affectedRows>0)
																		{												
																			//console.log("Cập nhật thanh cong trong trường hợp lẻ không đủ farm: "+functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought));
																			//gửi vị trí lên cho các thành viên khác																			
														                	io.emit('RECEIVEPOSITIONCLICK',
																			{						
																				PositionClick:PositionClickChange,
																				Position: PositionChangeOff,
																				idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
															            	});
														                	
																		}else
																		{
																			console.log("khong Cập nhật thanh con gtrong trường hợp không đủ farm");												
																		}																									
																	}
																});	
															}									
														}else
														{
															//đủ farm
															//console.log("=======================Đủ farm");
															var query = pool.query("UPDATE unitinlocations SET CheckMoveOff = 1,TimeSendToClient = 0, CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 393a');
																}else
																{
																	//Kiểm tra data sau khi update
																	if (result.affectedRows>0)
																	{
																		//console.log("Cập nhật thanh cong trong trường hợp đủ farm");
																	}else
																	{
																		console.log(" khong Cập nhật thanh cong trong trường hợp đủ farm");
																	}														
																}
															});	
														}	
													}																																																																														
												}														
											}
										}
									});

							    	connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout = ?,timeResetMine = ? WHERE UserName = ?', ["","",createPositionTimelast,"", currentUser.name],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 306');
										}else
										{
											if(result)
											{

											}else
											{
												console.log('cap nhat that bai 307');
											}
										}
									});

									connection.query('UPDATE unitinlocations SET CheckOnline = 0 WHERE UserName = ?', [ currentUser.name],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 308');
										}else
										{
											if (result.affectedRows> 0) 
											{												
												//cập nhật redis
												connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations`WHERE UserName = ?", [ currentUser.name],function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 309');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{																	        					
															client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));													
															if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
															{
																//cập nhật tình trạng ofllie cho unit location
																redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "0";														
															}								
												        }									        
												        
													}
												})	
												//gửi tình trạng on/off cho tất cả các user												
												connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 310');
													}else
													{
														arrayUnitLocationsComplete= rows;	
														connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 311');
															}else
															{
																if (rows.length>0) 
																{
																	arrayOnlineStatus = rows;																																			
																	for (var i = 0; i < arrayOnlineStatus.length; i++) 
															  		{
															  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
															  			{	
														  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																			{
																				Status : 0,	
																				UserName : currentUser.name,	
																				idUnitInLocations: arrayUnitLocationsComplete,																																																					
														                	});
															  													  															  								                	
															  			}													  							  			
															  		}			 
																}else
																{

																}			

															}
														})									
												        
												    }
												})	
												// Cập nhật check move cho oflline
												// connection.query("UPDATE unitinlocations SET Che=1 WHERE UserName = ? AND TimeMoveTotalComplete >'"+parseFloat(createPositionTimelast)+"'", [ currentUser.name],function(error, result, field)
												// {
												// 	if(!!error)
												// 	{
												// 		console.log('Error in the query 308');
												// 	}else
												// 	{
												// 		if (result.affectedRows> 0) 
												// 		{
												// 		}
												// 	}
												// });
											}
											else
											{
												console.log('Hiện tại user chưa có unit in location 312');
											}
										}
									});	

									//cap nhat thoi gian cho user trong guid
									var dt = datetime.create();		
									//console.log(dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	
									connection.query("UPDATE guildlistmember SET Status = 0, TimeDetail = '"+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentUser.name+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 313');
										}else
										{
											if (result.affectedRows>0) 
											{
												connection.query("SELECT B.MemberName FROM users AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE A.UserName ='"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 314');
													}else
													{
														if (rows.length>0) 
														{
															arrayNotisyStatus = rows;																																			
															for (var i = 0; i < arrayNotisyStatus.length; i++) 
													  		{													  			
													  			if ((lodash.filter(clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
													  			{													  			
												  					io.in(clients[clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('RECEIVESTATUS',
																	{
																		Status : 0,
																		TimeDetail : dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
																		UserName : currentUser.name,																																							
												                	});
													  													  															  								                	
													  			}													  							  			
													  		}			 
														}else
														{
														}		
													}
												})

											}
										}
									});						
																	
							    }
							 });
							console.log("User: "+clients[i].name+" && idSocket: "+clients[i].idSocket+" has disconnected");
							clients.splice(i,1);							

						}else
						{
							console.log("khong tim thay socket user dang nhap 315");
						}
					}else
					{
						console.log('=================================socket bi loi khi dang nhap 316');						
					}
				};				
			}else if ((typeof currentdisconect.UserName === 'undefined')||(typeof currentdisconect.idSocket === 'undefined'))
			{
				console.log("=================================Kết noi toi server mà chua login 317");
			}
		});
			
		socket.on('SENDCHECKUNITINLOCATION', function (data)
		{
			currentSENDCHECKUNITINLOCATION =
			{
				idUnitInLocations:data.idUnitInLocations,
				UserName:data.UserName,
				numberBase:data.numberBase,				
				Quality:data.Quality,
				Farm:data.Farm,
				QualityAfterMerge:data.QualityAfterMerge,
				UnitOrder:data.UnitOrder,				
			}
			console.log('data receive SENDCHECKUNITINLOCATION" '+ currentSENDCHECKUNITINLOCATION.idUnitInLocations
																+"_"+currentSENDCHECKUNITINLOCATION.UserName
																+"_"+currentSENDCHECKUNITINLOCATION.numberBase
																+"_"+currentSENDCHECKUNITINLOCATION.Quality
																+"_"+currentSENDCHECKUNITINLOCATION.Farm
																+"_"+currentSENDCHECKUNITINLOCATION.QualityAfterMerge
																+"_"+currentSENDCHECKUNITINLOCATION.UnitOrder);			
			pool.getConnection(function(err,connection)
			{             
				//Check tài khuyên
				connection.query("SELECT unitType,Level,UnitOrder,Quality,HealthEach,FarmEach,FarmPortable,HealthRemain FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDCHECKUNITINLOCATION.idUnitInLocations
					+"'AND `Quality` = '"+parseInt(currentSENDCHECKUNITINLOCATION.Quality, 10)+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query 230');
					}else
					{
						if(rows.length > 0)
						{							
							//gán giá trị select được
							LevelShare = rows[0].Level;
							UnitOrderShare = rows[0].UnitOrder;
							unitTypeShare = rows[0].unitType;
							QualityShare = rows[0].Quality;
							HealthEachShare = rows[0].HealthEach;
							FarmEachShare = rows[0].FarmEach;
							FarmPortableShare = rows[0].FarmPortable;
							HealthRemailShare = rows[0].HealthRemain;						
							
							//kiểm tra cập nhật hay update
							connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
											+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
					        {
					        	if (!!error)
								{
									console.log('Error in the query 231');
								}else
								{
									if (rows.length>0) {										
										//thực hiện update
										//kiểm tra unit đã đầy máu trước khi đưa vào thành
										if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
										{
											//đầy máu																			        																																
											//cập nhật farm trong thành											
											connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))+"' where `UserName` = '"
												+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 232');
												}else
												{													
													if (result.affectedRows > 0) 
													{
														//cập nhật và xóa base
														// kiểm tra và cập nhật unit in base
														connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
														+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
												        {
															if (!!error)
															{
																console.log('Error in the query 233');
															}else
															{
																if(rows.length > 0)
																{													
																	//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																	if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																	{
																		//gửi len client thong tin cap nhat dung
																		socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																		{
																			checkResource:1,
													                	});	
													                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 234');
																			}else
																			{
																				if (result.affectedRows > 0) 
																				{
																					
																					//xóa unit in location và cập nhật lại unit order
																					client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)).length > 0 ) 
																					{																				
																						
																						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)), 1);									
																					}	

																					//check redis
																					//gửi lên client thông số id xóa
																					socket.broadcast.emit('RECEIVEUNITDELETE',
																					{
																						idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																                	});
																                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																					{
																						if(!!error)
																						{
																							console.log('Error in the query 235');
																						}else
																						{
																							if(result.affectedRows > 0)
																							{
																								//update lại unit order																							
																								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																										+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																								{
																									if (!!error)
																									{
																										console.log('Error in the query 236');
																									}else
																									{
																										if(rows.length > 0)
																										{
																											for (var i = 0; i < rows.length; i++)
																											{
																												connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																												[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																												{
																													if(!!error)
																													{
																														console.log('Error in the query 237');
																													}else
																													{
																														if(result.affectedRows > 0)
																														{																															
																														}else
																														{
																															console.log('update unit order locations khong66 thành công 238');

																														}

																													}
																												})

																											}

																										}
																									}
																								})																								

																							}else
																							{
																								console.log('khong co gi delete location 239');

																							}
																						}
																					})
																				}
																			}
																		});
																	}else
																	{
																		//gửi mail
																		connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
																        {
																			if (!!error)
																			{
																				console.log('Error in the query 240');
																			}else
																			{
																				console.log('Mail Error in the database 1');

																				for (var i = 0; i < rows.length; i++)
																				{
																				 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																				 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
																				 		+parseInt(rows[i].Quality, 10)+"</td><td>"
																						+parseInt(rows[i].Level, 10)+"</td><td>"
																						+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
																				}


																				let transporter = nodemailer.createTransport({
																				    service: 'gmail',
																				    auth: {
																				        user: 'aloevera.hoang@gmail.com',
																				        pass: '123456@A'
																				    }
																				});

																				// setup email data with unicode symbols
																				let mailOptions = {
																				    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
																				    to: "codergame@demandvi.com", // list of receivers
																				    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
																				    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
																				    html:"<html><head><title>HTML Table</title></head>"+
																					"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
																					"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
																					"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																					dataTest+
																					"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
																					"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																					"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
																					+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
																					+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
																				};
																				// send mail with defined transport object
																				transporter.sendMail(mailOptions, (error, info) => {
																				    if (error) {
																				        return console.log(error);
																				    }
																				    console.log('Message %s sent: %s', info.messageId, info.response);
																				});


																			}
																		})
																		socket.emit('RECEIVECHECKUNITINLOCATION',
																		{
																			checkResource:0,
								                						});
																	}
																}
															}
														});

													}
												}
											});																				
													
										}else
										{											
											//không đầy máu
											connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, rows,field)
									        {
												if (!!error)
												{
													console.log('Error in the query 241');
												}else
												{
													if(rows.length > 0)
													{
														//Tính và cập nhật farm
														//Tính farm tiêu tốn	
														//kiểm tra unit location có đậy mau										
														
														//Cập nhật farm trong thành
														if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
														{															
															//cập nhật farm trong thành															
															connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"' where `UserName` = '"
																+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 242');
																}else
																{																	
																	if (result.affectedRows > 0) 
																	{
																		//cập nhật và xóa base
																		// kiểm tra và cập nhật unit in base
																		connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																		+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
																        {
																			if (!!error)
																			{
																				console.log('Error in the query 243');
																			}else
																			{
																				if(rows.length > 0)
																				{													
																					//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																					if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																					{
																						//gửi len client thong tin cap nhat dung
																						socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																						{
																							checkResource:1,
																	                	});															                	
																	                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																						{
																							if(!!error)
																							{
																								console.log('Error in the query 244');
																							}else
																							{
																								if (result.affectedRows > 0) 
																								{																									
																									//xóa unit in location và cập nhật lại unit order
																									client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																									//check redis
																									//gửi lên client thông số id xóa
																									socket.broadcast.emit('RECEIVEUNITDELETE',
																									{
																										idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																				                	});
																				                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																									{
																										if(!!error)
																										{
																											console.log('Error in the query 245');
																										}else
																										{
																											if(result.affectedRows > 0)
																											{
																												//update lại unit order																												
																												connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																														+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																												{
																													if (!!error)
																													{
																														console.log('Error in the query 246');
																													}else
																													{
																														if(rows.length > 0)
																														{
																															for (var i = 0; i < rows.length; i++)
																															{
																																connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																																[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																																{
																																	if(!!error)
																																	{
																																		console.log('Error in the query 247');
																																	}else
																																	{
																																		if(result.affectedRows > 0)
																																		{																																			
																																		}else
																																		{
																																			console.log('update unit order locations khong66 thành công 148');
																																		}

																																	}
																																})

																															}

																														}
																													}
																												})

																											}else
																											{
																												console.log('khong co gi delete location 149');

																											}
																										}
																									})
																								}
																							}
																						});
																					}else
																					{
																						//gửi mail
																						connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
																				        {
																							if (!!error)
																							{
																								console.log('Error in the query 250');
																							}else
																							{
																								console.log('Mail Error in the database 2');
																								for (var i = 0; i < rows.length; i++)
																								{
																								 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																								 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
																								 		+parseInt(rows[i].Quality, 10)+"</td><td>"
																										+parseInt(rows[i].Level, 10)+"</td><td>"
																										+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
																								}


																								let transporter = nodemailer.createTransport({
																								    service: 'gmail',
																								    auth: {
																								        user: 'aloevera.hoang@gmail.com',
																								        pass: '123456@A'
																								    }
																								});

																								// setup email data with unicode symbols
																								let mailOptions = {
																								    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
																								    to: "codergame@demandvi.com", // list of receivers
																								    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
																								    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
																								    html:"<html><head><title>HTML Table</title></head>"+
																									"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
																									"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
																									"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																									dataTest+
																									"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
																									"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																									"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
																									+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
																									+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
																								};
																								// send mail with defined transport object
																								transporter.sendMail(mailOptions, (error, info) => {
																								    if (error) {
																								        return console.log(error);
																								    }
																								    console.log('Message %s sent: %s', info.messageId, info.response);
																								});


																							}
																						})
																						socket.emit('RECEIVECHECKUNITINLOCATION',
																						{
																							checkResource:0,
												                						});
																					}
																				}
																			}
																		});

																	}
																}
															});

														}else
														{
															//gửi số 2
															console.log("khong du dieu kien thu ve thanh 251");
															socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
															{
																checkResource:2,
										                	});
														}										

													}										

												}
											});
										}		
									}else
									{										
										if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
										{
											//đầy máu																			        																					
											//cập nhật farm trong thành											
											connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))+"' where `UserName` = '"
												+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 251');
												}else
												{													
													if (result.affectedRows > 0) 
													{
														//cập nhật và xóa base
														// kiểm tra và cập nhật unit in base
														connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
														+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
														+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
														{
												            if(!!err)
												            {
												            	console.log('Error in the query 252');
												            }else
												            {
												            	//xóa unit in location và cập nhật lại unit order												            	
																client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																//check redis
																//gửi lên client thông số id xóa
																socket.broadcast.emit('RECEIVEUNITDELETE',
																{
																	idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
											                	});
											                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 253');
																	}else
																	{
																		if(result.affectedRows > 0)
																		{
																			//update lại unit order																		
																			connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																					+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query 254');
																				}else
																				{
																					if(rows.length > 0)
																					{
																						for (var i = 0; i < rows.length; i++)
																						{
																							connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																							[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																							{
																								if(!!error)
																								{
																									console.log('Error in the query 255');
																								}else
																								{
																									if(result.affectedRows > 0)
																									{																										
																									}else
																									{
																										console.log('update unit order locations khong66 thành công 256');
																									}

																								}
																							})

																						}

																					}
																				}
																			})																		

																		}else
																		{
																			console.log('khong co gi delete location 257');

																		}
																	}
																})
												            }
														})

													}
												}
											});																				
													
										}else
										{											
											//không đầy máu
											connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, rows,field)
									        {
												if (!!error)
												{
													console.log('Error in the query 258');
												}else
												{
													if(rows.length > 0)
													{
														//Tính và cập nhật farm
														//Tính farm tiêu tốn	
														//kiểm tra unit location có đậy mau																												
														//Cập nhật farm trong thành
														if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
														{															
															//cập nhật farm trong thành															
															connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"' where `UserName` = '"
																+currentSENDCHECKUNITINLOCATION.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 259');
																}else
																{																	
																	if (result.affectedRows > 0) 
																	{
																		//insert và xóa base
																		// kiểm tra và cập nhật unit in base
																		connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
																		+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
																		+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
																		{
																            if(!!err)
																            {
																            	console.log('Error in the query 260');
																            }else
																            {
																            	//xóa unit in location và cập nhật lại unit order																            	
																				client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																				//check redis
																				//gửi lên client thông số id xóa
																				socket.broadcast.emit('RECEIVEUNITDELETE',
																				{
																					idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
															                	});
															                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 261');
																					}else
																					{
																						if(result.affectedRows > 0)
																						{
																							//update lại unit order																						
																							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																									+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																							{
																								if (!!error)
																								{
																									console.log('Error in the query 262');
																								}else
																								{
																									if(rows.length > 0)
																									{
																										for (var i = 0; i < rows.length; i++)
																										{
																											connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																											[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																											{
																												if(!!error)
																												{
																													console.log('Error in the query 263');
																												}else
																												{
																													if(result.affectedRows > 0)
																													{																														
																													}else
																													{
																														console.log('update unit order locations khong thành công 264');
																													}

																												}
																											})

																										}

																									}
																								}
																							})																						
																							

																						}else
																						{
																							console.log('khong co gi delete location 265');

																						}
																					}
																				})
																            }
																		})

																	}
																}
															});

														}else
														{
															//gửi số 2
															console.log("khong du dieu kien thu ve thanh 266");
															socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
															{
																checkResource:2,
										                	});
														}										

													}										

												}
											});
										}	

									}
								}
					        });									

						}else
						{            		
							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
					        {
								if (!!error)
								{
									console.log('Error in the query 267');
								}else
								{
									console.log('Mail Error in the database 3');	
									for (var i = 0; i < rows.length; i++)
									{
									 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
									 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
									 		+parseInt(rows[i].Quality, 10)+"</td><td>"
											+parseInt(rows[i].Level, 10)+"</td><td>"
											+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
									}


									let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
									    }
									});

									// setup email data with unicode symbols
									let mailOptions = {
									    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
									    to: "codergame@demandvi.com", // list of receivers
									    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
									    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
									    html:"<html><head><title>HTML Table</title></head>"+
										"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
										"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
										"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
										dataTest+
										"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
										"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
										"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
										+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
										+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
									};
									// send mail with defined transport object
									transporter.sendMail(mailOptions, (error, info) => {
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});


								}
							})
							socket.emit('RECEIVECHECKUNITINLOCATION',
							{
								checkResource:0,
		                	});
						}

					}
				});


			});

			socket.emit('SENDCHECKUNITINLOCATION',currentSENDCHECKUNITINLOCATION);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDCHECKUNITINLOCATION);
		});

		socket.on('SENDUNITINLOCATIONSCOMPLETE', function (data)
		{
			currentSENDUNITINLOCATIONSCOMPLETE =
			{
				UserName:data.UserName,
				numberBase:data.numberBase,
				UnitType:data.UnitType,
				Quality:data.Quality,
				Position:data.Position,
				Level:data.Level,
				UnitOrder:data.UnitOrder,
	    		Farm:data.Farm,
			}				
			pool.getConnection(function(err,connection)
			{								

				//Check số lượng lính trong unit in base
				connection.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
					+"'AND `numberBase` = '"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
					+"'AND `Level` = '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Level, 10)
					+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query 268');
					}else
					{

						if(rows.length > 0)
						{							

							if(parseInt(rows[0].Quality, 10)>= parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality, 10))
							{
								//trừ lính trong unit in base và farm trong userbase								
								connection.query("UPDATE userbase SET Farm = Farm -'"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Farm, 10)+"' WHERE UserName = '"
									+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"' AND numberBase = '"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 269');
									}else
									{										
										if(result.affectedRows>0)
										{
											connection.query("UPDATE unitinbase SET Quality = Quality - '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality, 10)
														+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
											[currentSENDUNITINLOCATIONSCOMPLETE.UserName,currentSENDUNITINLOCATIONSCOMPLETE.numberBase, currentSENDUNITINLOCATIONSCOMPLETE.UnitType, 
													currentSENDUNITINLOCATIONSCOMPLETE.Level],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 270');
												}else
												{													
													if(result.affectedRows>0)
													{
														connection.query("SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` where `Level` = '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Level, 10)
															+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
												        {
															if (!!error)
															{
																console.log('Error in the query 271');
															}else
															{
																if(rows.length > 0)
																{
																	d = new Date();
												    				createPositionTimelast = Math.floor(d.getTime() / 1000);
																	//insert unit in locations26
																	connection.query("INSERT INTO `unitinlocations` (`idUnitInLocations`, `UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`TimeMoveComplete`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`, `userFight`,`FightRadius`) VALUES ('"+
																	""+"','"+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"','"
																	+(parseInt(rows[0].Health,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Health,10)+"','"
																	+(parseInt(rows[0].Health,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+(parseInt(rows[0].Damage,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Damage,10)+"','"+
																	+(parseInt(rows[0].Defend,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Defend,10)+"','"
																	+parseInt(rows[0].Farm,10)+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Farm+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"																	
																	+currentSENDUNITINLOCATIONSCOMPLETE.Quality+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Level+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
																	+0+"','"+parseFloat(rows[0].MoveSpeed)+"','"
																	+createPositionTimelast+"','"
																	+createPositionTimelast+"','"
																	+0+"','"+1+"','"+1+"','"+0+"','"+0+"','"+"'"+''+"'"+"','"+4+"')",function(error, result, field)
																	{
															            if(!!err)
															            {
															            	console.log('Error in the query 272');
															            }else
															            {															            	
														                	connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query 273');
																				}else
																				{																						
																        			socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																					{
																						idUnitInLocations:rows[0],																						
																                	});
																                	socket.broadcast.emit('RECEIVEUNITCREAT',
																					{
																						idUnitInLocations:rows[0],
																                	});
																			        
																				}
																			})
														                	
														                	//insert unitlocation to redis
														                	connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query 274');
																				}else
																				{																	
																        					
																        			client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																			        
																				}
																			})


														                	connection.query('DELETE FROM unitinbase WHERE Quality = ?',[0],function(error, result, field)
																			{
																				if(!!error)
																				{
																					console.log('Error in the query 275');
																				}else
																				{
																					if(result)
																					{																				
																					}else
																					{
																						console.log('khong co gi delete 273');

																					}
																				}
																			})
															            }
																	})
																}
															}
														})

													}else
													{
														console.log('cap nhat that bai 277');
													}
												}
											});


										}
									}
								});						

							}else
							{
								socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
								{
									checkResource:0,
			                	});
							}

						}else
						{
							console.log("lỗi select 278");
						}

					}
				})

			});

			socket.emit('SENDUNITINLOCATIONSCOMPLETE',currentSENDUNITINLOCATIONSCOMPLETE );
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDUNITINLOCATIONSCOMPLETE);
		});

		socket.on('SENDEXCHANGECHECKUNITINLOCATION', function (data)
		{
			currentSENDEXCHANGECHECKUNITINLOCATION =
			{
				idUnitInLocationLeft:data.idUnitInLocationLeft,	
				QualityAfterLeft:data.QualityAfterLeft,				
				QualityMergeLeft:data.QualityMergeLeft,
				FarmAfterLeft:data.FarmAfterLeft,	
				FarmMergeLeft:data.FarmMergeLeft,		

				idUnitInLocationRight:data.idUnitInLocationRight,
				QualityAfterRight:data.QualityAfterRight,				
				QualityMergeRight:data.QualityMergeRight,
				FarmAfterRight:data.FarmAfterRight,
				FarmMergeRight:data.FarmMergeRight,
			}					
			pool.getConnection(function(err,connection)
			{			
								//Check số lượng của từng unit
				connection.query("SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft							
								+"'UNION ALL SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight															
								+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query 279');
					}else
					{
						if(rows.length > 1)
						{							
							//Cập nhật tỷ lệ farm trừ khi đánh nhau cho hai unit
		                	if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10)
		                		&&(parseFloat(rows[1].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10)
		                		&&(parseFloat(rows[0].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft, 10)
		                		&&(parseFloat(rows[1].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight, 10))
		                	{
		                		//gán giá trị sau khi select
		                		UserNameExchange = rows[0].UserName;
		                		HealthExchangeLeft = rows[0].HealthEach;
		                		HealthExchangeRight = rows[1].HealthEach;
		                		socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
								{
									checkResource:1,
			                	});			                	
			                	//kiểm tra xem có số lượng nào bẳng 0 để lấy unit order
								if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10))===0)
			                	{
			                		UnitOrderZero = rows[0].UnitOrder;
			                	}else
			                	{
			                		UnitOrderZero = rows[1].UnitOrder;
			                	}
			                	//kiểm tra unit inlocation còn lại và gửi cho tất cả user khác
								if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0 &&
									(parseInt(rows[1].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, 10)) > 0)
								{							
									//gửi cho những user khác cập nhật									
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
										idUnitInLocations1: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
										Quality1:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
				                	});
									//Cập nhật số lại hai id left và right
									// 1 - cập nhật id Left									
									connection.query("UPDATE unitinlocations SET  Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft)*parseFloat(HealthExchangeLeft))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft)+"'  WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 280');
										}else
										{											
											//check redis
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
												+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 281');
												}else
												{																															
													client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
													if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
													{
														//cập nhật tình trạng ofllie cho unit location
														redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
														redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);														
													}																				        
												}
											})
										}
									})
				               		// 2 - cập nhật id Right
				               		
									connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight)*parseFloat(HealthExchangeRight))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight)+"' WHERE idUnitInLocations = ?",
										[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 282');
										}else
										{																										    	
											//check redis
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
												+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 283');
												}else
												{																															
													client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));	
													if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
													{
														//cập nhật tình trạng ofllie cho unit location
														redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
														redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);														
													}																					        
												}
											})

										}
									})									
								}else if((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0)
								{
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
				                	});
				                	socket.broadcast.emit('RECEIVEUNITDELETE',
									{
										idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight),
				                	});
									//Cập nhật số lại id left và del righ	
																
									connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft)*parseFloat(HealthExchangeLeft))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft)+"' WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 284');
										}else
										{										
											connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 285');
												}else
												{
													if(result.affectedRows > 0)
													{
														//update lại unit order																
														connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+UserNameExchange
																+"'AND `UnitOrder` > '"+UnitOrderZero+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 286');
															}else
															{
																if(rows.length > 0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																		[(parseInt(rows[i].UnitOrder, 10)-1),UserNameExchange, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 287');
																			}else
																			{
																				//check redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 288');
																					}else
																					{																															
																						client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																						client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight);
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																				
																						}	
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location																							
																							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)), 1);									
																						}																			        
																					}
																				})
																			}
																		})
																	}
																}
															}
														})

													}
												}
											})
											

										}
									})									
									
								}else
								{
									//Cập nhật số lại id right và del left 
								
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
				                	});
				                	socket.broadcast.emit('RECEIVEUNITDELETE',
									{
										idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft),
				                	});

				                	connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight)*parseFloat(HealthExchangeRight))
				                	+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight)+"' WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 289');
										}else
										{										
											connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 290');
												}else
												{
													if(result.affectedRows > 0)
													{
														//update lại unit order																
														connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+UserNameExchange
																+"'AND `UnitOrder` > '"+UnitOrderZero+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 291');
															}else
															{
																if(rows.length > 0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																		[(parseInt(rows[i].UnitOrder, 10)-1),UserNameExchange, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 292');
																			}else
																			{
																				//check redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 293');
																					}else
																					{																															
																						client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																						client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft);	
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																					
																						}
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)).length > 0 ) 
																						{																							
																							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)), 1);									
																						}																				        
																					}
																				})
																			}
																		})
																	}
																}
															}
														})
													}
												}
											})										
										}
									})
								}	                	
							}else
							{								
								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentUser.name+"'",function(error, rows,field)
						        {
									if (!!error)
									{
										console.log('Error in the query 294');
									}else
									{
										console.log('Mail Error in the database 4');
										for (var i = 0; i < rows.length; i++)
										{
											 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
										 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
										 		+parseInt(rows[i].Quality, 10)+"</td><td>"
												+parseInt(rows[i].Level, 10)+"</td><td>"
												+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
										}


										let transporter = nodemailer.createTransport({
										    service: 'gmail',
										    auth: {
										        user: 'aloevera.hoang@gmail.com',
										        pass: '123456@A'
										    }
										});

										// setup email data with unicode symbols
										let mailOptions = {
										    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
										    to: "codergame@demandvi.com", // list of receivers
										    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
										    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
										    html:"<html><head><title>HTML Table</title></head>"+
											"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
											"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
											"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
											dataTest+
											"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
											"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
											"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
											"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
											"</tbody></table></body></html>"
										};
										// send mail with defined transport object
										transporter.sendMail(mailOptions, (error, info) => {
										    if (error) {
										        return console.log(error);
										    }
										    console.log('Message %s sent: %s', info.messageId, info.response);
										});


									}
								})
								console.log("không đủ số lượng linh ngoài thành 295");
								socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
								{
									checkResource:0,
			                	});
							}

						}else
						{							
              				//kiểm tra dữ liệu hiện có của user
							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentUser.name+"'",function(error, rows,field)
					        {
								if (!!error)
								{
									console.log('Error in the query 296');
								}else
								{
									console.log('Mail Error in the database 5');
									for (var i = 0; i < rows.length; i++)
									{
									 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
									 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
									 		+parseInt(rows[i].Quality, 10)+"</td><td>"
											+parseInt(rows[i].Level, 10)+"</td><td>"
											+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
									}


									let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
									    }
									});

									// setup email data with unicode symbols
									let mailOptions = {
									    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
									    to: "codergame@demandvi.com", // list of receivers
									    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
									    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
									    html:"<html><head><title>HTML Table</title></head>"+
										"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
										"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
										"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
										dataTest+
										"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
										"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
										"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
										"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
										"</tbody></table></body></html>"
									};
									// send mail with defined transport object
									transporter.sendMail(mailOptions, (error, info) => {
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});


								}
							})
							console.log("không đủ số lượng linh ngoài thành 297");
							socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
							{
								checkResource:0,
		                	});
						}

					}
				})


			});

			socket.emit('SENDEXCHANGECHECKUNITINLOCATION',currentSENDEXCHANGECHECKUNITINLOCATION);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDEXCHANGECHECKUNITINLOCATION);
		});
	
		socket.on('RESETMINE', function (data){
			socket.emit('ResetMineSuccess',
			{
	        	message : '0',
	    	});
			socket.broadcast.emit('RESETMINE', currentUser);
		});	

		socket.on('SENDPOSITIONCLICK', function (data)
		{
			currentSENDPOSITIONCLICK =
			{
				idUnitInLocations:data.idUnitInLocations,
				Position:data.Position,
				PositionClick:data.PositionClick,
				timeMove:data.timeMove,	
				idUnitInLocationsB:data.idUnitInLocationsB,
				PositionB:data.PositionB,	
			}	
			console.log("dử liệu nhận khi di chuyển SENDPOSITIONCLICK: "+currentSENDPOSITIONCLICK.idUnitInLocations+"_"+currentSENDPOSITIONCLICK.Position
				+"_"+currentSENDPOSITIONCLICK.PositionClick+"_"+currentSENDPOSITIONCLICK.timeMove
				+"_"+currentSENDPOSITIONCLICK.idUnitInLocationsB+"_"+currentSENDPOSITIONCLICK.PositionB);	

			if (currentSENDPOSITIONCLICK.idUnitInLocationsB.length===0||currentSENDPOSITIONCLICK.PositionB.length===0) {	
				console.log("RECEIVEPOSITIONCLICK");			
				pool.getConnection(function(err,connection)
				{
					console.log("RECEIVEPOSITIONCLICK 1: "+ currentSENDPOSITIONCLICK.idUnitInLocations);
					io.emit('RECEIVEPOSITIONCLICK',
					{						
						PositionClick:currentSENDPOSITIONCLICK.PositionClick,
						Position: currentSENDPOSITIONCLICK.Position,
						idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
	            	});
	            	
					d = new Date();
	    			createPositionTimelast = Math.floor(d.getTime() / 1000);
	    			//kiểm tra position move có chính xác không	    			
	    			connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`='"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
					{
						if (!!error) {
							console.log('Error in the query 318');
						}else
						{
							if (rows.length > 0) 
							{	
								d = new Date();
	    						createPositionTimelast = Math.floor(d.getTime() / 1000);
	    						APosition = rows[0].Position;	    					
	    						A = APosition.split(",");
								A1 = parseFloat(A[0]);
								A2 = parseFloat(A[1]);
								BPosition = rows[0].PositionClick;								
								B = BPosition.split(",");
								B1 = parseFloat(B[0]);
								B2 = parseFloat(B[1]);
								CPosition = currentSENDPOSITIONCLICK.Position;								
								C = CPosition.split(",");
								C1 = parseFloat(C[0]);
								C2 = parseFloat(C[1]);
								
								if (parseFloat(createPositionTimelast -rows[0].timeClick) > parseFloat(rows[0].TimeMoveComplete)) 
								{
									TimeCheckMove = parseFloat(rows[0].TimeMoveComplete);
								}else
								{
									TimeCheckMove = createPositionTimelast -rows[0].timeClick;								
								}
								//kiểm tra position client với position trên server nếu trùng							
								if (parseFloat(Math.round(C2 * 100))===parseFloat(Math.round(A2 * 100)))
								{								
									connection.query("UPDATE unitinlocations SET Position = ? , PositionClick = ?  , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
										[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
												currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query 319');
										}else
										{
											if(result.affectedRows > 0)
											{	
												console.log("RECEIVEPOSITIONCLICK 6: "+currentSENDPOSITIONCLICK.idUnitInLocations);
												io.emit('RECEIVEPOSITIONCLICK',
												{														
													PositionClick:currentSENDPOSITIONCLICK.PositionClick,
													Position: currentSENDPOSITIONCLICK.Position,													
													idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
							                	});	
												connection.release();																									        					
							                }
										}
									})	
								}else
								{
									X= A1+((TimeCheckMove)*(B1-A1))/parseFloat(rows[0].TimeMoveComplete);
									Z= A2+((TimeCheckMove)*(B2-A2))/parseFloat(rows[0].TimeMoveComplete);
									if (functions.getNumberDifferent(rows[0].UnitType,X,Z,C1,C2) === true) 
	    							{
	    								connection.query("UPDATE unitinlocations SET Position = ? , PositionClick = ?   , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
											[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
													currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 360');
											}else
											{
												if(result.affectedRows > 0)
												{
													console.log("RECEIVEPOSITIONCLICK 2: "+currentSENDPOSITIONCLICK.idUnitInLocations);
													io.emit('RECEIVEPOSITIONCLICK',
													{														
														PositionClick:currentSENDPOSITIONCLICK.PositionClick,
														Position: currentSENDPOSITIONCLICK.Position,													
														idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
								                	});		
								                	connection.release();						                	
								                }
											}
										})	
	    							}else
	    							{	    				 			
										connection.query("UPDATE unitinlocations SET Position = ? , PositionClick = ?   , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
											[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
													currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 361');
											}else
											{
												if(result.affectedRows > 0)
												{
													console.log("RECEIVEPOSITIONCLICK 3: "+currentSENDPOSITIONCLICK.idUnitInLocations);
													io.emit('RECEIVEPOSITIONCLICK',
													{
														PositionClick:currentSENDPOSITIONCLICK.PositionClick,
														Position:currentSENDPOSITIONCLICK.Position,
														idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
								                	});	
								                	connection.release();							                	
								                }
											}
										})	
	    							}							  								    						 
								}								

							}else
							{
								console.log(" tang ca 362");
							}
						}
					});				
				});

			}else
			{
				console.log("==============================RECEIVEPOSITIONCLICK 222222222222222222");	
				//cập nhật lại vị trí đánh nhau (1=)
				//kiểm tra vị trí position click đã có người đứng chưa
				var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [],arrayPositionClick = [];
				var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations;

				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				//kiểm tra thời gian về 0 của unit location
				//kiểm tra khi bắng thời gian của server
				//thực hiện random tìm vị trí mới
				//cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)	

				var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 363');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
		    				arraycheckUser.push(rows[i]);
				        }

					}
				})
				var query = pool.query("SELECT PositionClick FROM `unitinlocations` WHERE 1 ",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 364');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
		    				arrayPositionClick.push(rows[i]);
				        }

					}
				})				
													
				//update vị trị sau cùng và time move
				var query = pool.query("UPDATE unitinlocations SET timeClick='"+createPositionTimelast+"',Position =?, PositionClick = ? , TimeMoveComplete = ?, TimeCheck = ? WHERE idUnitInLocations = ? AND CheckCreate !=1",[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),parseFloat(createPositionTimelast),currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
				{
					if(!!error)
					{
						console.log('Error in the query 365');
					}else
					{
						if (result.affectedRows> 0) 
						{																	
							var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 366');
								}else
								{
									for (var k = 0; k < rows.length; k++)
									{
										 arrayAllCheckTime.push(rows[k]);
							        }						        
										
									if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === currentSENDPOSITIONCLICK.PositionClick)).length)
										+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === currentSENDPOSITIONCLICK.PositionClick).length)>=1)
									{	
										const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = currentSENDPOSITIONCLICK.PositionB.split(",");									
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

										for (var i = 0; i < arrayS.length; i++) 
										{
											if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
											{
												arrayRandom.push(arrayS[i]);
											}
										}	
										if (arrayRandom.length>0) 
										{														
											newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
											arrA =	newLocation.split(",");
											arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
											var time=0;
											d = new Date();
											createPositionTimelast = Math.floor(d.getTime() / 1000);
											var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 367');
												}else
												{
													if (result.affectedRows> 0) {
														var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 368');
															}else
															{
																if (rows.length >0)
																{
																	console.log("=============Thuc hien thay doi vi tri danh cron 6");																																			
																	 //gửi vị trí cập nhật
															        io.emit('RECEIVEPOSITIONCHANGE',
																	{
													            		arrayAllPositionchange: rows[0],
													        		});		    													        		
															       
															    }
															}
														})
													}
													else
													{
														console.log('khong co time remain duoc cap nhat 369');
													}
												}
											})	
										}else
										{									
									  		
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

											for (var i = 0; i < arrayS1.length; i++) 
											{
												if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
												{
													arrayRandom.push(arrayS1[i]);
												}
											}
											if (arrayRandom.length >0 ) {														
												newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
												arrA =	newLocation.split(",");
												arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");							
												
												d = new Date();
												createPositionTimelast = Math.floor(d.getTime() / 1000);
												var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query 370');
													}else
													{
														if (result.affectedRows> 0) {
															var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
															{
																if (!!error)
																{
																	console.log('Error in the query 371');
																}else
																{
																	if (rows.length >0)
																	{
																		console.log("=============Thuc hien thay doi vi tri danh cron 5");	
																																																							
																		 //gửi vị trí cập nhật
																        io.emit('RECEIVEPOSITIONCHANGE',
																		{
														            		arrayAllPositionchange: rows[0],
														        		});	
														        		       
																       

																    }
																}
															})
														}
														else
														{
															console.log('khong co time remain duoc cap nhat 372');
														}
													}
												})		
											}else
											{											  		
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


												for (var i = 0; i < arrayS2.length; i++) 
												{
													if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
													{
														arrayRandom.push(arrayS2[i]);
													}
												}																					
												if (arrayRandom.length>0) {														
													newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
													arrA =	newLocation.split(",");
													arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
													var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
													time=0;
													d = new Date();
													createPositionTimelast = Math.floor(d.getTime() / 1000);
													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 373');
														}else
														{
															if (result.affectedRows> 0) {
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 374');
																	}else
																	{
																		if (rows.length >0)
																		{
																			console.log("=============Thuc hien thay doi vi tri danh cron 4");																																																											
																			 //gửi vị trí cập nhật
																	        io.emit('RECEIVEPOSITIONCHANGE',
																			{
															            		arrayAllPositionchange: rows[0],
															        		});   
															        		connection.release();   																	        
																	    }
																	}
																})
															}
															else
															{
																console.log('khong co time remain duoc cap nhat 375');
															}
														}
													})	
												}
											}
										}							
									}else
									{	
										console.log("RECEIVEPOSITIONCLICK 4: "+ currentSENDPOSITIONCLICK.idUnitInLocations);									
										io.emit('RECEIVEPOSITIONCLICK',
										{
											PositionClick:currentSENDPOSITIONCLICK.PositionClick,	
											Position: currentSENDPOSITIONCLICK.Position,												
											idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
					                	});					                	
									}
							        
							    }
							});

						}						
					}
				});
			}		

			socket.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);
		});
		

		
		socket.on('SENDUNITAvsB', function (data)
		{
			//currentSENDUNITAvsB = [];
			//arrayAvsBTemp = [];
			currentSENDUNITAvsB =
			{
				idUnitInLocationsA:data.idUnitInLocationsA,	
				UserNameA: data.UserNameA,
				UnitOrderA: data.UnitOrderA,

				idUnitInLocationsB: data.idUnitInLocationsB,	
				UserNameB: data.UserNameB,
				UnitOrderB: data.UnitOrderB,									
			}	
			console.log("currentSENDUNITAvsB"+currentSENDUNITAvsB.idUnitInLocationsA+" VS "
				+currentSENDUNITAvsB.idUnitInLocationsB);	
			arrayAvsB.push(currentSENDUNITAvsB);
			arrayAvsBTemp.push(currentSENDUNITAvsB);			
			//console.log("=======mang========arrayAvsB: "+arrayAvsB.length);
			//console.log("=======mang========arrayAvsBTemp: "+arrayAvsBTemp.length);							
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);
	    	console.log("=============SENDUNITAvsB==========="+createPositionTimelast); 
			//cập farm đứng lại khi đánh nhau	
			for (var i = 0; i < arrayAvsBTemp.length; i++) 
			{
				var index = i;
				pool.getConnection(function(err,connection)
				{					
					//console.log("Chieu dai mang danh: "+arrayAvsBTemp.length);
					connection.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1 AND idUnitInLocations ='"+
						arrayAvsBTemp[index].idUnitInLocationsA+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 402');
						}else
						{
							if (rows.length>0) 
							{				
																					
								FarmPortableMove = parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete));								
								if (parseFloat(rows[0].FarmPortable)<(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*parseFloat(rows[0].TimeMoveComplete)))
								{
									FarmPortableMove = 0;
								}								
								connection.query("UPDATE unitinlocations SET TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
									+"',CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
		                			+"',TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query 403');
									}else
									{										
										//gửi lên cho từng user
					                	if ((lodash.filter(clients, x => x.name === rows[0].UserName)).length >0) 
							  			{	
							  				console.log("RECEIVEFARMCONSUMEMOVE 5: "+rows[0].idUnitInLocations);
							  				io.in(clients[clients.findIndex(item => item.name === rows[0].UserName)].idSocket).emit('RECEIVEFARMCONSUMEMOVE',
											{
												message: 1,
												idUnitInLocations: rows[0].idUnitInLocations,																				
												FarmPortableMove: FarmPortableMove,
												Position: rows[0].PositionClick,
						                	});	
						                	//cập nhật redis
						                	connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
						                		arrayAvsBTemp[index].idUnitInLocationsA+"'UNION ALL SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+
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
														if (functions.isEmptyObject(replies[0]) && functions.isEmptyObject(replies[1]))
														{	
															arrayAvsBTemp.push(arrayAvsBTemp[index]);				
															d = new Date();
												    		createPositionTimelast = Math.floor(d.getTime());     		
															if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 
															&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0) {				
																client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
																{  
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																			
																		redisarray.push(JSON.parse(replies));	
																		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																							
																	} 								
																		  																		
																});
																client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
																{    														
																	if (!replies) {}else
																	{
																		var objectValue = JSON.parse(replies);																		
																		redisarray.push(JSON.parse(replies));	
																		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																		
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
																		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																							
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
																		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																						
																	}	  																		
																});
															}
															
															//động bộ farm	unit A																
															client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
															{
																if (err) 
																{
																	console.log(err+"380");
																}else
																{									
															       	var objectValue = JSON.parse(replies);																       	
															       	if (parseFloat(objectValue['FarmPortable'])!==(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)) 
															       	{															       		
															       		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
															       	}		    						
																}
															    
															});	

															//động bộ farm	unit B
															client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
															{
																if (err) 
																{
																	console.log(err+"381");
																}else
																{									
															       	var objectValue = JSON.parse(replies);																       	
														       		if (parseFloat(objectValue['FarmPortable'])!==(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)) 
															       	{															       		
															       		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
															       	}		    						
																}
															    
															});																
																
															
														}else
														{
															console.log("===========La ban cua nhau=============");
														}																																																										
													});	
													connection.release();
												}
											})					                							                								  									  								                	
							  			}else
							  			{
							  				connection.release();
							  			}					  			
							  																	
									}
								});																																									
							}else
							{
								//console.log(arrayAvsBTemp[index].idUnitInLocationsA+"===========Không di chuyển================");
								//console.log(arrayAvsBTemp[index].idUnitInLocationsB+"===========Không di chuyển================");
								// console.log("========the last item of array arrayAvsBTemp========: "+ parseFloat(arrayAvsBTemp.length - 1));
								// if (parseFloat(arrayAvsBTemp.length - 1)===parseFloat(index)) 
								// {
								// 	console.log("========Complete the array========");
								// 	arrayAvsBTemp = [];
								// }
								client.mget([arrayAvsBTemp[index].UserNameA+arrayAvsBTemp[index].UserNameB, arrayAvsBTemp[index].UserNameB+arrayAvsBTemp[index].UserNameA], function (err, replies) 
								{							    						    														
									if (functions.isEmptyObject(replies[0]) && functions.isEmptyObject(replies[1]))
									{	
										//arrayAvsBTemp.push(arrayAvsB[index]);				
										d = new Date();
							    		createPositionTimelast = Math.floor(d.getTime());     		
										if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(arrayAvsBTemp[index].idUnitInLocationsA)).length === 0 
										&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB)).length === 0) {				
											client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
											{  
												if (!replies) {}else
												{
													var objectValue = JSON.parse(replies);													
													redisarray.push(JSON.parse(replies));	
													(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
												} 								
													  																		
											});
											client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
											{    														
												if (!replies) {}else
												{
													var objectValue = JSON.parse(replies);													
													redisarray.push(JSON.parse(replies));	
													(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
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
													(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);												
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
													(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);																
												}	  																		
											});
										}									
											
										client.get(arrayAvsBTemp[index].idUnitInLocationsA, function (err, replies) 
										{
											if (err) 
											{
												console.log(err+"380");
											}else
											{									
										       	var objectValue = JSON.parse(replies);										       	
										       	if (parseFloat(objectValue['FarmPortable'])!==(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)) 
										       	{									       			
										       		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsA))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
										       	}		    						
											}									    
										});	

										//động bộ farm	unit B
										client.get(arrayAvsBTemp[index].idUnitInLocationsB, function (err, replies) 
										{
											if (err) 
											{
												console.log(err+"381");
											}else
											{									
										       	var objectValue = JSON.parse(replies);										       	
									       		if (parseFloat(objectValue['FarmPortable'])!==(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)) 
										       	{									       		
										       		(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBTemp[index].idUnitInLocationsB))].FarmPortable)=parseFloat(objectValue['FarmPortable']);
										       	}		    						
											}									    
										});	
																							
									}else
									{
										console.log("===========La ban cua nhau=============");
									}																																																										
								});								
								connection.release();

							}
						}
					});
					
				});
				
			}
							
			
			socket.emit('SENDUNITAvsB',currentSENDUNITAvsB);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDUNITAvsB',currentSENDUNITAvsB);
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
    		console.log("=============SENDUNITAoutB==========="+createPositionTimelast+"_"
    			+currentSENDUNITAoutB.idUnitInLocationsA+"_"
    			+currentSENDUNITAoutB.idUnitInLocationsB); 
    		arrayAvsBFightOut.push(currentSENDUNITAoutB);
    		for (var i = 0; i < arrayAvsBFightOut.length; i++) 
    		{
    			var index = i;
    			if (arrayAvsB.length > 0) 
				{
					if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) 
					{
						arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA), 1);	
						//cập nhật memory redis
						if (parseFloat((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === arrayAvsBFightOut[index].idUnitInLocationsA)).length
							+((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length) === 0)) 
						{
							console.log("=========redisarray========"+"_"+arrayAvsBFightOut[index].idUnitInLocationsA+"_"+arrayAvsBFightOut[index].idUnitInLocationsB);
							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(arrayAvsBFightOut[index].idUnitInLocationsA)), 1);							
						}	

						if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA)).length > 0) {					
							console.log("=========arrayAvsB========"+"_"+arrayAvsBFightOut[index].idUnitInLocationsA+"_"+arrayAvsBFightOut[index].idUnitInLocationsB);	
							arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === arrayAvsBFightOut[index].idUnitInLocationsA), 1);														
						}																		
																			
						
						//cập nhật my sql
						var query=pool.query("UPDATE unitinlocations SET CheckFight = 0,userFight =''  WHERE idUnitInLocations = '"+arrayAvsBFightOut[index].idUnitInLocationsA+"'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 385');
							}else
							{  																													
								var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE`idUnitInLocations` = '"
																		+currentSENDUNITAoutB.idUnitInLocationsA+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the query 386');
									}else
									{	
										if (rows.length > 0) 
										{
											//console.log("ra khoi tam danh:======================================="+ currentSENDUNITAoutB.idUnitInLocationsA+"_"+currentSENDUNITAoutB.idUnitInLocationsB);							
											//cập nhật redis
											client.set(currentSENDUNITAoutB.idUnitInLocationsA,JSON.stringify(rows[0]));
											//cập nhật mảng đánh																							
										}																												
										
									}
								})				
								
							}
						})
						

						client.mget(arrayAvsBFightOut[index].idUnitInLocationsA, function (err, replies) 
						{
							if (err) 
							{
								console.log(err);
							}else
							{	
								
								var objectValue = JSON.parse(replies);	
						       	d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);							         
								var query = pool.query("UPDATE unitinlocations SET userFight = '' ,HealthRemain = '"+parseFloat(objectValue['HealthRemain'])
									+"' , FarmPortable = '"+parseFloat(objectValue['FarmPortable'])
									+"' , Damage = '"+parseFloat(objectValue['Damage'])
									+"' , Defend = '"+parseFloat(objectValue['Defend'])
									+"' , Quality = '"+parseFloat(objectValue['Quality'])
									+"', TimeFight = '"+parseFloat(createPositionTimelast)
									+"', CheckFight = 1  WHERE idUnitInLocations = '"+parseFloat(arrayAvsBFightOut[index].idUnitInLocationsA)
									+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query11dsf');
									}else
									{  										
										
									}
								}) 															       																    									
							}
						    
						});
						
					}

				}	
    							
    		}				
			
							
			socket.emit('SENDUNITAoutB',currentSENDUNITAoutB);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDUNITAoutB',currentSENDUNITAoutB);
		});

	});	
	if (app.get('port') === "8080")
	{			
		cron.schedule('*/1 * * * * *',function()
		{
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);	    

	    	//cập nhật dữ liệu sẵn có 	   
	    	//reset time all user   	
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailBool = 1 AND CheckSend = 0",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 387');
				}else
				{
					if (rows.length>0) 
					{												
	  					for (var k = 0; k < clients.length; k++) 
						{											
		  					io.in(clients[k].idSocket).emit('RECEIVERESETSERVER',
							{
								arrayResetServer:1,
		                	});						                														  									  								                	
				  				
						}							
						var query = pool.query("UPDATE task SET CheckSend =1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 388');
							}else
							{
								if (result.affectedRows>0) 
								{									
								}
							}
						});		                												  															  								                														  							  			
				  					 
					}else
					{

					}				

				}
			})

			//check time reset				
			var query = pool.query("SELECT * FROM `task` WHERE DetailTask ='ResetAllUser' AND DetailTime >0 AND DetailBool = 1",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 389');
				}else
				{					
					if (rows.length>0) 
					{	
	                	var query = pool.query("UPDATE task SET DetailTime = DetailTime-1 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 390');
							}else
							{
								if (result.affectedRows>0) 
								{									
								}
							}
						});	 												  															  								                														  							  			
				  					 
					}else
					{						
						var query = pool.query("UPDATE task SET DetailBool =0,CheckSend = 0 where DetailTask = 'ResetAllUser'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 391');
							}else
							{
								if (result.affectedRows>0) 
								{									
								}
							}
						});	 	
					}			

				}
			})				    	

	    	//thực hiện chức năng trừ farm khi unit di chuyển
	    	var arraySendFarmAfterMoveConsume = [],arraySendFarmMoveConsume = [],FarmPortableMove,FarmPortableMoveOffComplete,
	    	APosition,BPosition,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrB,arrC,TimeMoveToOff=0,arraySendFarmMoveConsumeOffComplete = [],
	    	APositionOff,BPositionOff,AOff,A1Off,A2Off,BOff,B1Off,B2Off,XOff,ZOff,PositionChangeOff,FarmPortableMoveOnOff,FarmPortableMoveOff,
	    	FarmPortableMoveOffNotEnought,AverageFarmSecond,NumberSecondMoveOff,PositionChangeOffNotEnought,TimeMoveCompletes=0;

	    	//thực hiện cập nhật farm khi di chuyển
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE  TimeMoveComplete >10 AND CheckMove = 1 AND CheckOnline = 1 AND TimeSendToClient='"+createPositionTimelast+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 392a');
				}else
				{
					if (rows.length>0) 
					{						
						arraySendFarmMoveConsume =rows;												
						for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
						{							
							var index = i;		
							//kiểm tra lượng farm cho lần di chuyển kế tiếp							
							FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality));	

							//	tính vị trí di chuyển sau 10s
							APosition = rows[index].Position;
							A = APosition.split(",");
							A1 = parseFloat(A[0]);
							A2 = parseFloat(A[1]);
							BPosition = rows[index].PositionClick;
							B = BPosition.split(",");
							B1 = parseFloat(B[0]);
							B2 = parseFloat(B[1]);
							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B1-A1))/parseFloat(rows[i].TimeMoveComplete);
							X=Number((parseFloat(X).toFixed(1)));
							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B2-A2))/parseFloat(rows[i].TimeMoveComplete);
							Z=Number((parseFloat(Z).toFixed(1)));							
							PositionChange = X+","+Z;
							var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast))
								+"',TimeMoveComplete = '"+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast))
	                			+"',TimeMoveTotalComplete = '"+ (parseFloat(createPositionTimelast)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast)))
	                			+"',TimeCheck = '"+ (parseFloat(createPositionTimelast)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast)))
	                			+"',FarmPortable = '"+ parseFloat(FarmPortableMove)		                			
	                			+"',Position = '"+ PositionChange	                			
	                			+"',TimeSendToClient = '"+ (10+parseFloat(createPositionTimelast))	
	                			+"',timeClick = '"+ parseFloat(createPositionTimelast)                			
	                			+"',CheckMove = 1 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 393');
								}else
								{
									//Kiểm tra data sau khi update
									if (result.affectedRows>0)
									{
										var query = pool.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations='"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 392b');
											}else
											{
												if (rows.length>0) 
												{	
													
													if (parseFloat(FarmPortableMove)>=parseFloat(rows[0].Quality))
													{		
														console.log("RECEIVEFARMCONSUMEMOVE 1: "+rows[0].idUnitInLocations);																		
									                	//gửi lên cho từng user									      	
									    				io.emit('RECEIVEFARMCONSUMEMOVE',
														{
															message: 1,
															idUnitInLocations:rows[0].idUnitInLocations,																				
															FarmPortableMove: parseInt(FarmPortableMove,10),
															Position:rows[0].PositionClick,
									                	});	

									                	//Cập nhật redis
									                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations='"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 394');
															}else
															{
																console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm dang còn============================= ");
																//update resid															        					
																client.set(parseFloat(rows[0].idUnitInLocations),JSON.stringify(rows[0]));	
															}	
														})				                							                								  									  								                	
											  			
													}else if (parseFloat(FarmPortableMove)<parseFloat(rows[0].Quality))
													{
														if (((parseFloat(X) % 1 ) < 0.099) && ((parseFloat(Math.abs(Z)) % 1 ) < 0.099))
														{		
															
											  				//io.in(clients[clients.findIndex(item => item.name === arraySendFarmMoveConsume[index].UserName)].idSocket).emit('RECEIVEFARMCONSUMEMOVE',
											  				PositionChange = Number((parseFloat(X).toFixed(0)))+","+Number((parseFloat(Z).toFixed(1)));	
											  				console.log("RECEIVEFARMCONSUMEMOVE 7: "+rows[0].idUnitInLocations);										  				
											  				io.emit('RECEIVEFARMCONSUMEMOVE',
															{
																message: 0,
																idUnitInLocations:rows[0].idUnitInLocations,																				
																FarmPortableMove: parseInt(FarmPortableMove,10),
																Position:PositionChange,
										                	});								                	

										                	//cập nhật lại data									
															var query = pool.query("UPDATE unitinlocations SET  TimeMoveComplete = 0,TimeCheck = '"+parseFloat(createPositionTimelast)
																+"',Position = '"+PositionChange
																+"',timeClick = '"+parseFloat(createPositionTimelast)																
																+"',PositionClick='"+PositionChange
																+"',TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
																+"',TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 395');
																}else
																{
																	if (result.affectedRows>0) 
																	{	
																		//cập nhật redis
																		var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 396');
																			}else
																			{		
																				console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm khong còn vị trí chẳn============================= ");
																				//update resid															        					
																				client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));	

																				//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (2=)
																				/*var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [];
																				var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;			
																				var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 466');
																					}else
																					{
																						arraycheckUser=rows;																						
																						var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
																						{
																							if (!!error)
																							{
																								console.log('Error in the query 469');
																							}else
																							{
																								for (var k = 0; k < rows.length; k++)
																								{
																									 arrayAllCheckTime.push(rows[k]);
																						        }
																						        for (var j = 0; j < arrayAllCheckTime.length; j++)
																								{								
																									if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length)
																										+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length)>=2)
																									{
																										const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTime[j].Position.split(","),idUnitInLocations=arrayAllCheckTime[j].idUnitInLocations;									
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

																										for (var i = 0; i < arrayS.length; i++) 
																										{
																											if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
																											{
																												arrayRandom.push(arrayS[i]);
																											}
																										}																					
																										if (arrayRandom.length>0) 
																										{														
																											newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																											arrayAllCheckTime[j].PositionClick = newLocation;
																											arrA =	newLocation.split(",");
																											arrC =	arrayAllCheckTime[j].Position.split(",");	
																											console.log("Vi tri set lai 1: "+newLocation);								
																											var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach)).toFixed(0));
																											console.log("Thời gian: "+ time);
																											//time=0;
																											d = new Date();
																											createPositionTimelast = Math.floor(d.getTime() / 1000);	
																											var farmtest = 	(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));																	
																											if (parseFloat(arrayAllCheckTime[j].FarmPortable) < (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time))) 
																											{
																												FarmConsumeChangePositionDuplicate=0;
																											}else
																											{
																												FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTime[j].FarmPortable)-(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));
																											}
																											var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',TimeSendToClient='"+(parseFloat(createPositionTimelast)+10)+"',CheckMove=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),0,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																											{
																												if(!!error)
																												{
																													console.log('Error in the query 470');
																												}else
																												{
																													if (result.affectedRows> 0) 
																													{
																														console.log(parseFloat(idUnitInLocations)+" ========================Farm cho di chuyen trung 1: "+farmtest);
																														var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																														{
																															if (!!error)
																															{
																																console.log('Error in the query 471');
																															}else
																															{
																																if (rows.length >0)
																																{						
																																	//console.log("=============Thuc hien thay doi vi tri danh cron 1");											
																																	//gửi vị trí cập nhật
																															        io.emit('RECEIVEPOSITIONCHANGE',
																																	{
																													            		arrayAllPositionchange: rows[0],
																													        		});      															        
																															    }
																															}
																														})
																													}
																													else
																													{
																														console.log('khong co time remain duoc cap nhat 472');
																													}
																												}
																											})	
																										}else
																										{												
																									  		
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

																											for (var i = 0; i < arrayS1.length; i++) 
																											{
																												if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
																												{
																													arrayRandom.push(arrayS1[i]);
																												}
																											}
																											if (arrayRandom.length >0 ) 
																											{														
																												newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																												arrayAllCheckTime[j].PositionClick = newLocation;
																												arrA =	newLocation.split(",");
																												arrC =	arrayAllCheckTime[j].Position.split(",");									
																												var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																												time=0;
																												d = new Date();
																												createPositionTimelast = Math.floor(d.getTime() / 1000);
																												//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																												var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																												{
																													if(!!error)
																													{
																														console.log('Error in the query 473');
																													}else
																													{
																														if (result.affectedRows> 0) {														
																															var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																															{
																																if (!!error)
																																{
																																	console.log('Error in the query 474');
																																}else
																																{
																																	if (rows.length >0)
																																	{
																																		console.log("=============Thuc hien thay doi vi tri danh cron 2");	
																																		//gửi vị trí cập nhật
																																        io.emit('RECEIVEPOSITIONCHANGE',
																																		{
																														            		arrayAllPositionchange: rows[0],
																														        		});	

																																    }
																																}
																															})
																														}
																														else
																														{
																															console.log('khong co time remain duoc cap nhat 475');
																														}
																													}
																												})		
																											}else
																											{												  		
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
																												for (var i = 0; i < arrayS2.length; i++) 
																												{
																													if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
																													{
																														arrayRandom.push(arrayS2[i]);
																													}
																												}																					
																												if (arrayRandom.length>0) 
																												{														
																													newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																													arrayAllCheckTime[j].PositionClick = newLocation;
																													arrA =	newLocation.split(",");
																													arrC =	arrayAllCheckTime[j].Position.split(",");									
																													var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																													time=0;
																													d = new Date();
																													createPositionTimelast = Math.floor(d.getTime() / 1000);

																													//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																													{
																														if(!!error)
																														{
																															console.log('Error in the query 476');
																														}else
																														{
																															if (result.affectedRows> 0) {															
																																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																																{
																																	if (!!error)
																																	{
																																		console.log('Error in the query 477');
																																	}else
																																	{
																																		if (rows.length >0)
																																		{		
																																			console.log("=============Thuc hien thay doi vi tri danh cron 3");																	
																																			//gửi vị trí cập nhật
																																	        io.emit('RECEIVEPOSITIONCHANGE',
																																			{
																															            		arrayAllPositionchange: rows[0],
																															        		});		      																	      
																																	    }
																																	}
																																})
																															}
																															else
																															{
																																console.log('khong co time remain duoc cap nhat 478');
																															}
																														}
																													})	
																												}
																											}
																										}		
																									}
																						        }
																						    }
																						});
																					}
																				})		*/
																				functions.CheckPosition(io);																																																		        																		         
																			}
																		})															
																	}else
																	{
																		console.log("update khong thanh cong 397");
																	}
																}
															});					                							                								  									  								                	
												  														
														}
														else
														{										
																											  				
											  				arrC =	PositionChange.split(",");
															arrB =	functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange).split(",");	
															var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																																
															console.log("RECEIVEFARMCONSUMEMOVE 8: "+rows[0].idUnitInLocations);
															io.emit('RECEIVEFARMCONSUMEMOVE',
															{
																message: 0,
																idUnitInLocations:rows[0].idUnitInLocations,																				
																FarmPortableMove: parseInt(FarmPortableMove,10),
																Position: functions.getNewLocationClickWithFarm(PositionChange,arraySendFarmMoveConsume[index].PositionClick,PositionChange),
										                	});		

										                	//cập nhật lại data									
															var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange)
																+"',timeClick = '"+(parseFloat(createPositionTimelast)+Number((time).toFixed(0)))																	
																+"',FarmPortable = '"+parseFloat(FarmPortableMove)																	
																+"',TimeMoveComplete = '"+time																	
																+"',TimeMoveTotalComplete = '"+ (time+parseFloat(createPositionTimelast))
																+"',TimeCheck = '"+ (time+parseFloat(createPositionTimelast))
																+"',TimeSendToClient = 0,CheckMove = 1 where idUnitInLocations = '"+parseFloat(arraySendFarmMoveConsume[index].idUnitInLocations)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 398');
																}else
																{
																	if (result.affectedRows>0) 
																	{		
																		console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm vị trí lẻ=============================");																		
																		//cập nhật lại redis
																		var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 399');
																			}else
																			{																						
																				//update resid															        					
																				client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));																						
																			}
																		})																																															                	
																	}else
																	{
																		console.log("update khong thanh cong 400");
																	}
																}
															});																									  								                							                								  									  								                												  				
														}
																								
													}else
													{
														console.log("update khong thanh cong 401");										
													}

												}
											}
										});
									}															
								}
							});																								
						}														
					}
				}
			});

			//Thực hiện cập nhật farm khi user đứng lại
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1 AND CheckOnline = 1 AND TimeMoveTotalComplete ='"+createPositionTimelast+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 402');
				}else
				{
					if (rows.length>0) 
					{
						arraySendFarmMoveConsume =rows;	
						for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
						{
							var index = i;														
							FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete));								
							if (parseFloat(rows[index].FarmPortable)<(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete)))
							{
								FarmPortableMove = 0;
							}

							var query = pool.query("UPDATE unitinlocations SET Position = PositionClick ,TimeMoveComplete = 0,CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
	                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
	                			+"',TimeSendToClient = 0,CheckMove = 0,CheckMoveOff = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 403');
								}else
								{
									if (result.affectedRows>0) 
									{
										console.log("RECEIVEFARMCONSUMEMOVE : "+rows[0].idUnitInLocations);
										//gửi lên cho từng user					    
					                	io.emit('RECEIVEFARMCONSUMEMOVE',
										{
											message: 1,
											idUnitInLocations:rows[index].idUnitInLocations,																				
											FarmPortableMove: parseInt(FarmPortableMove,10),
											Position:rows[index].PositionClick,
					                	});	

					                	//console.log("ci tri gửi len sau khi hoan thanh: "+ rows[index].PositionClick);
					                	//cập nhật redis
					                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 404');
											}else
											{
												//update resid	
												console.log(parseFloat(rows[0].idUnitInLocations)+"===================================================================================cập nhật redis khi di chuyên xong: "+parseFloat(rows[0].FarmPortable));
												client.set(parseFloat(rows[0].idUnitInLocations),JSON.stringify(rows[0])); 											          
											}
										})	
										//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (3=)
										/*var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [];
										var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;			
										var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 466');
											}else
											{
												arraycheckUser=rows;
												//console.log("=============Thuc hien thay doi vi tri danh cron dau tien");				
												var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 469');
													}else
													{
														for (var k = 0; k < rows.length; k++)
														{
															 arrayAllCheckTime.push(rows[k]);
												        }
												        for (var j = 0; j < arrayAllCheckTime.length; j++)
														{								
															if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length)
																+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length)>=2)
															{
																const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTime[j].Position.split(","),idUnitInLocations=arrayAllCheckTime[j].idUnitInLocations;									
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

																for (var i = 0; i < arrayS.length; i++) 
																{
																	if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
																	{
																		arrayRandom.push(arrayS[i]);
																	}
																}																					
																if (arrayRandom.length>0) 
																{														
																	newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																	arrayAllCheckTime[j].PositionClick = newLocation;
																	arrA =	newLocation.split(",");
																	arrC =	arrayAllCheckTime[j].Position.split(",");	
																	console.log("Vi tri set lai 2: "+newLocation);								
																	var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach)).toFixed(0));
																	console.log("Thời gian: "+ time);
																	//time=0;
																	d = new Date();
																	createPositionTimelast = Math.floor(d.getTime() / 1000);	
																	var farmtest = 	(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));																	
																	if (parseFloat(arrayAllCheckTime[j].FarmPortable) < (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time))) 
																	{
																		FarmConsumeChangePositionDuplicate=0;
																	}else
																	{
																		FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTime[j].FarmPortable)-(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));
																	}
																	var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',CheckMoveOff=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 470');
																		}else
																		{
																			if (result.affectedRows> 0) 
																			{
																				console.log(parseFloat(idUnitInLocations)+" ========================Farm cho di chuyen trung 2: "+farmtest);
																				var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 471');
																					}else
																					{
																						if (rows.length >0)
																						{						
																							//console.log("=============Thuc hien thay doi vi tri danh cron 1");											
																							//gửi vị trí cập nhật
																					        io.emit('RECEIVEPOSITIONCHANGE',
																							{
																			            		arrayAllPositionchange: rows[0],
																			        		});      															        
																					    }
																					}
																				})
																			}
																			else
																			{
																				console.log('khong co time remain duoc cap nhat 472');
																			}
																		}
																	})	
																}else
																{												
															  		
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

																	for (var i = 0; i < arrayS1.length; i++) 
																	{
																		if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
																		{
																			arrayRandom.push(arrayS1[i]);
																		}
																	}
																	if (arrayRandom.length >0 ) 
																	{														
																		newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																		arrayAllCheckTime[j].PositionClick = newLocation;
																		arrA =	newLocation.split(",");
																		arrC =	arrayAllCheckTime[j].Position.split(",");									
																		var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																		time=0;
																		d = new Date();
																		createPositionTimelast = Math.floor(d.getTime() / 1000);
																		//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																		var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 473');
																			}else
																			{
																				if (result.affectedRows> 0) {														
																					var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																					{
																						if (!!error)
																						{
																							console.log('Error in the query 474');
																						}else
																						{
																							if (rows.length >0)
																							{
																								console.log("=============Thuc hien thay doi vi tri danh cron 2");	
																								//gửi vị trí cập nhật
																						        io.emit('RECEIVEPOSITIONCHANGE',
																								{
																				            		arrayAllPositionchange: rows[0],
																				        		});	

																						    }
																						}
																					})
																				}
																				else
																				{
																					console.log('khong co time remain duoc cap nhat 475');
																				}
																			}
																		})		
																	}else
																	{												  		
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
																		for (var i = 0; i < arrayS2.length; i++) 
																		{
																			if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
																			{
																				arrayRandom.push(arrayS2[i]);
																			}
																		}																					
																		if (arrayRandom.length>0) 
																		{														
																			newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																			arrayAllCheckTime[j].PositionClick = newLocation;
																			arrA =	newLocation.split(",");
																			arrC =	arrayAllCheckTime[j].Position.split(",");									
																			var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																			time=0;
																			d = new Date();
																			createPositionTimelast = Math.floor(d.getTime() / 1000);

																			//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																			var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																			{
																				if(!!error)
																				{
																					console.log('Error in the query 476');
																				}else
																				{
																					if (result.affectedRows> 0) {															
																						var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																						{
																							if (!!error)
																							{
																								console.log('Error in the query 477');
																							}else
																							{
																								if (rows.length >0)
																								{		
																									console.log("=============Thuc hien thay doi vi tri danh cron 3");																	
																									//gửi vị trí cập nhật
																							        io.emit('RECEIVEPOSITIONCHANGE',
																									{
																					            		arrayAllPositionchange: rows[0],
																					        		});		      																	      
																							    }
																							}
																						})
																					}
																					else
																					{
																						console.log('khong co time remain duoc cap nhat 478');
																					}
																				}
																			})	
																		}
																	}
																}		
															}
												        }
												    }
												});
											}
										})	*/
										functions.CheckPosition(io);                							                								  									  								                								  			
									}else
									{
										console.log("update khong thanh cong 405");
									}
								}
							});				
														
						}
														
					}
				}
			});			

			//Cập nhật vi tri và farm khi di chuyển hoàn tất offline
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMoveOff=1 AND CheckOnline=0 AND TimeMoveTotalComplete ='"+parseFloat(createPositionTimelast)+"' AND CheckCreate !=1",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 402');
				}else
				{
					if (rows.length>0) 
					{
						arraySendFarmMoveConsumeOffComplete =rows;	
						for (var i = 0; i < arraySendFarmMoveConsumeOffComplete.length; i++) 
						{
							var index = i;														
							FarmPortableMoveOffComplete = parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)-(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete));								
							if (parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)<(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete)))
							{
								FarmPortableMoveOffComplete = 0;
							}

							var query = pool.query("UPDATE unitinlocations SET Position = PositionClick,TimeMoveTotalComplete='"+parseFloat(createPositionTimelast)
								+"', TimeMoveComplete = 0,TimeCheck = '"+parseFloat(createPositionTimelast)
								+"', CheckMoveOff = 0,CheckMove = 0,timeClick='"+parseFloat(createPositionTimelast)
								+"', FarmPortable='"+parseFloat(FarmPortableMoveOffComplete)
								+"',DistanceMoveLogoff='' WHERE idUnitInLocations='"+parseFloat(arraySendFarmMoveConsumeOffComplete[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 468a');
								}else
								{
									if (result.affectedRows> 0) 
									{		
										console.log("============Cập nhật vị trí và farm khi di chuyển offline hoàn tất: "+parseFloat(rows[index].FarmPortable));
										io.emit('RECEIVEFARMCONSUMEMOVE',
										{
											message: 1,
											idUnitInLocations:rows[index].idUnitInLocations,																				
											FarmPortableMove: parseFloat(FarmPortableMoveOffComplete),
											Position:rows[index].PositionClick,
					                	});	

										//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (4=)
										/*var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [];
										var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;			
										var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 466');
											}else
											{
												arraycheckUser=rows;
												//console.log("=============Thuc hien thay doi vi tri danh cron dau tien");				
												var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 469');
													}else
													{
														for (var k = 0; k < rows.length; k++)
														{
															 arrayAllCheckTime.push(rows[k]);
												        }
												        for (var j = 0; j < arrayAllCheckTime.length; j++)
														{								
															if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length)
																+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length)>=2)
															{
																const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTime[j].Position.split(","),idUnitInLocations=arrayAllCheckTime[j].idUnitInLocations;									
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

																for (var i = 0; i < arrayS.length; i++) 
																{
																	if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
																	{
																		arrayRandom.push(arrayS[i]);
																	}
																}																					
																if (arrayRandom.length>0) 
																{														
																	newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																	arrayAllCheckTime[j].PositionClick = newLocation;
																	arrA =	newLocation.split(",");
																	arrC =	arrayAllCheckTime[j].Position.split(",");	
																	console.log("Vi tri set lai 3: "+newLocation);								
																	var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach)).toFixed(0));
																	console.log("Thời gian: "+ time);
																	//time=0;
																	d = new Date();
																	createPositionTimelast = Math.floor(d.getTime() / 1000);	
																	var farmtest = 	(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));																	
																	if (parseFloat(arrayAllCheckTime[j].FarmPortable) < (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time))) 
																	{
																		FarmConsumeChangePositionDuplicate=0;
																	}else
																	{
																		FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTime[j].FarmPortable)-(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));
																	}
																	var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',CheckMoveOff=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 470');
																		}else
																		{
																			if (result.affectedRows> 0) 
																			{
																				console.log(parseFloat(idUnitInLocations)+" ========================Farm cho di chuyen trung 2s: "+farmtest);
																				var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 471');
																					}else
																					{
																						if (rows.length >0)
																						{						
																							//console.log("=============Thuc hien thay doi vi tri danh cron 1");											
																							//gửi vị trí cập nhật
																					        io.emit('RECEIVEPOSITIONCHANGE',
																							{
																			            		arrayAllPositionchange: rows[0],
																			        		});      															        
																					    }
																					}
																				})
																			}
																			else
																			{
																				console.log('khong co time remain duoc cap nhat 472');
																			}
																		}
																	})	
																}else
																{												
															  		
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

																	for (var i = 0; i < arrayS1.length; i++) 
																	{
																		if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
																		{
																			arrayRandom.push(arrayS1[i]);
																		}
																	}
																	if (arrayRandom.length >0 ) 
																	{														
																		newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																		arrayAllCheckTime[j].PositionClick = newLocation;
																		arrA =	newLocation.split(",");
																		arrC =	arrayAllCheckTime[j].Position.split(",");									
																		var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																		time=0;
																		d = new Date();
																		createPositionTimelast = Math.floor(d.getTime() / 1000);
																		//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																		var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query 473');
																			}else
																			{
																				if (result.affectedRows> 0) {														
																					var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																					{
																						if (!!error)
																						{
																							console.log('Error in the query 474');
																						}else
																						{
																							if (rows.length >0)
																							{
																								console.log("=============Thuc hien thay doi vi tri danh cron 2");	
																								//gửi vị trí cập nhật
																						        io.emit('RECEIVEPOSITIONCHANGE',
																								{
																				            		arrayAllPositionchange: rows[0],
																				        		});	

																						    }
																						}
																					})
																				}
																				else
																				{
																					console.log('khong co time remain duoc cap nhat 475');
																				}
																			}
																		})		
																	}else
																	{												  		
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
																		for (var i = 0; i < arrayS2.length; i++) 
																		{
																			if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
																			{
																				arrayRandom.push(arrayS2[i]);
																			}
																		}																					
																		if (arrayRandom.length>0) 
																		{														
																			newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
																			arrayAllCheckTime[j].PositionClick = newLocation;
																			arrA =	newLocation.split(",");
																			arrC =	arrayAllCheckTime[j].Position.split(",");									
																			var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
																			time=0;
																			d = new Date();
																			createPositionTimelast = Math.floor(d.getTime() / 1000);

																			//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																			var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
																			{
																				if(!!error)
																				{
																					console.log('Error in the query 476');
																				}else
																				{
																					if (result.affectedRows> 0) {															
																						var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																						{
																							if (!!error)
																							{
																								console.log('Error in the query 477');
																							}else
																							{
																								if (rows.length >0)
																								{		
																									console.log("=============Thuc hien thay doi vi tri danh cron 3");																	
																									//gửi vị trí cập nhật
																							        io.emit('RECEIVEPOSITIONCHANGE',
																									{
																					            		arrayAllPositionchange: rows[0],
																					        		});		      																	      
																							    }
																							}
																						})
																					}
																					else
																					{
																						console.log('khong co time remain duoc cap nhat 478');
																					}
																				}
																			})	
																		}
																	}
																}		
															}
												        }
												    }
												});
											}
										})	*/
										functions.CheckPosition(io);
									}
									else
									{					
									}

								}
							});			
														
						}
														
					}
				}
			});				

			//kiểm tra thời gian hoàn tất chuyển farm từ  userbase đến unitloactions
			var arraySendResourceFromBaseToUnit=[]; 			
    		var query = pool.query("SELECT * FROM `unitinlocations` WHERE FarmTransferCompleteTime > 0 AND FarmTransferCompleteTime <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 406');
				}else
				{
					if (rows.length>0) 
					{
						arraySendResourceFromBaseToUnit = rows;
						for (var i = 0; i < arraySendResourceFromBaseToUnit.length; i++) 
				  		{
				  			var index = i;
				  			//hoàn tất thời gian
		    				var query = pool.query("UPDATE userbase,unitinlocations SET unitinlocations.FarmPortable = unitinlocations.FarmPortable + unitinlocations.FarmWait,userbase.TransferUnitOrderStatus = '"+ 0								
	                			+"',unitinlocations.FarmWait = '"+ 0                			
	                			+"',unitinlocations.FarmTransferCompleteTime = '"+0
	                			+"',unitinlocations.TransferCompleteTotalTime = '"+0				                				                						                				                			
	                			+"'where userbase.UserName = unitinlocations.UserName AND userbase.UserName ='"+arraySendResourceFromBaseToUnit[index].UserName
	                			+"'AND userbase.numberBase = '"+arraySendResourceFromBaseToUnit[index].numberBaseTransfer
	                			+"' AND unitinlocations.UnitOrder ='"+arraySendResourceFromBaseToUnit[index].UnitOrder+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 407');
								}else
								{
									if (result.affectedRows>0) 
									{		
							  			if ((lodash.filter(clients, x => x.name === arraySendResourceFromBaseToUnit[index].UserName)).length >0) 
							  			{	
							  				console.log("Gửi lên user: "+arraySendResourceFromBaseToUnit[index].UserName+"_"+clients[clients.findIndex(item => item.name === arraySendResourceFromBaseToUnit[index].UserName)].idSocket)						  											  				
						  					io.in(clients[clients.findIndex(item => item.name === arraySendResourceFromBaseToUnit[index].UserName)].idSocket).emit('RECEIVECOMPLETESENDRESOURCEFROMBASETRANSFERTOUNIT',
											{
												UnitOrder: parseFloat(arraySendResourceFromBaseToUnit[index].UnitOrder),
												numberBase: parseFloat(arraySendResourceFromBaseToUnit[index].numberBaseTransfer),
												Farm: parseFloat(arraySendResourceFromBaseToUnit[index].FarmPortable) + parseFloat(arraySendResourceFromBaseToUnit[index].FarmWait),
						                	});		
						                	//cập nhật lại redis và memory
						                	connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query408');
												}else
												{
													console.log("=================Cap nhat redis======================");
													for (var i = 0; i < rows.length; i++)
													{																	        					
														//update resid															        					
														client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));	
														if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
														{
															//cập nhật tình trạng ofllie cho unit location
															redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].FarmPortable = parseFloat(rows[i].FarmPortable);														
														}																		
											        }  
											          
												}
											})				                							                								  									  								                	
							  			}
							  		}else
									{																			
										socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
										{
					                		message : 0
					            		});
										console.log("gửi mail 409");
									}
								}
							});				  			
				  		}			 
					}else
					{
						
					}			

				}
			})

			//kiem tra reset join guild			
	    	var arrayResetJoin=[],arrayLeader=[]; 			
    		var query = pool.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND TimeReset <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 410');
				}else
				{
					if (rows.length>0) 
					{
						arrayResetJoin = rows;
						for (var i = 0; i < arrayResetJoin.length; i++) 
				  		{
				  			var index = i;					  			
				  			var query = pool.query("DELETE FROM guildlistmember WHERE ActiveStatus= 0 AND GuildName = '"+arrayResetJoin[index].GuildName
				  				+"' AND MemberName = '"+arrayResetJoin[index].MemberName+"'",function(error, result, field)
						  	{
								if(!!error)
								{
									console.log('Error in the query 411');
								}else
								{
									if(result.affectedRows>0)
									{										
										if (clients.length>0) 
										{		
								  			if ((lodash.filter(clients, x => x.name === arrayResetJoin[index].MemberName)).length >0) 
								  			{								  				
								  				
							  					io.in(clients[clients.findIndex(item => item.name === arrayResetJoin[index].MemberName)].idSocket).emit('RECEIVERESETJOINGUILD',
												{
													ExpireInviteToJoinGuild:arrayResetJoin[index],
							                	});							                							                	
								  									  								                	
								  			}									  			
								  			var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+arrayResetJoin[index].GuildName+"' AND PositionGuild = 'Leader'",function(error, rows,field)
											{
												
												if (!!error)
												{
													console.log('Error in the query 412');
												}else
												{
													if (rows.length>0) 
													{
														arrayLeader = rows;														
														for (var k = 0; k < arrayLeader.length; k++) 
														{
															if ((lodash.filter(clients, x => x.name === arrayLeader[k].MemberName)).length >0) 
												  			{													  				
											  					io.in(clients[clients.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('RECEIVERESETJOINGUILD',
																{
																	ExpireInviteToJoinGuild:arrayResetJoin[index],
											                	});							                														  									  								                	
												  			}	
														}													
													}else
													{
														console.log("Kiem tra lai guild 413");
													}
												}
											});
							  			}
									}else
									{
										console.log("Thực hiện lại 413");																														
									}
								}
							})				  			
				  		}			 
					}else
					{
						
					}			

				}
			})

    		//kiểm tra hoàn tất thời gian đóng góp tài nguyên
			//=======================================			
	    	var arrayDonateComplete=[],arrayAllMemberGuilds=[],arrayDonateofGuild =[],arrayMaxStorage =[],
			FarmRemain,WoodRemain,StoneRemain,MetalRemain,FarmOver,WoodOver,StoneOver,MetalOver; 								
    		var query = pool.query("SELECT * FROM `guildlistmember` WHERE TimeRemain > 0 AND TimeComplete <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 414');
				}else
				{
					if (rows.length>0) 
					{						
						arrayDonateComplete = rows;						
						for (var i = 0; i < arrayDonateComplete.length; i++) 
				  		{
				  			var index = i;
				  			FarmRemain=0,WoodRemain=0,StoneRemain=0,MetalRemain=0;
				  			//Kiểm tra tài nguyên hiên tại của guild xem có max chưa				  			
				  			var query = pool.query("SELECT * FROM `guildlist` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 415');
								}else
								{
									if (rows.length>0) 
									{
										arrayMaxStorage =rows;
										if (((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											||((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											||((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											||((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))) 
										{
											console.log("vuot qua resource======================================="+parseFloat(arrayMaxStorage[0].MaxStorage));
											if ((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{
												console.log("1");
												FarmRemain = parseFloat(arrayMaxStorage[0].MaxStorage);											 
											}else
											{
												FarmRemain = (arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm));
												console.log("1.1");
											}

											if ((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{
												console.log("2");
												WoodRemain = parseFloat(arrayMaxStorage[0].MaxStorage);

											}else
											{
												WoodRemain = (arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood));
												console.log("2.1");
											}

											if ((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{
												console.log("3");
												StoneRemain = parseFloat(arrayMaxStorage[0].MaxStorage);
											}
											else
											{
												StoneRemain = (arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone));
												console.log("3.1");
											}

											if ((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{
												console.log("4");
												MetalRemain = parseFloat(arrayMaxStorage[0].MaxStorage);												
											}else
											{
												MetalRemain = (arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal));
												console.log("4.1");
											}

											var query = pool.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = '"+parseFloat(FarmRemain)
											+"',guildlist.Wood =  '"+parseFloat(WoodRemain)
											+"',guildlist.Stone = '"+parseFloat(StoneRemain)
											+"',guildlist.Metal =  '"+parseFloat(MetalRemain)							
											+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 416');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Cập nhật sau khi hoàn tất thành công vuot qua");
														if (clients.length>0) 
														{	
															var query = pool.query("SELECT * FROM `guildlist` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows,field)
															{												
																if (!!error)
																{
																	console.log('Error in the query 417');
																}else
																{
																	if (rows.length>0) 
																	{
																		arrayDonateofGuild =rows;
																		var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows,field)
																		{
																			console.log("Select lead");
																			if (!!error)
																			{
																				console.log('Error in the query 418');
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayAllMemberGuilds = rows;																	
																					for (var k = 0; k < arrayAllMemberGuilds.length; k++) 
																					{
																						if ((lodash.filter(clients, x => x.name === arrayAllMemberGuilds[k].MemberName)).length >0) 
																			  			{	
																			  				console.log("Gửi lên user online: "+arrayAllMemberGuilds[k].MemberName+"_"+clients[clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket);					  													  								  																	  				
																			  				console.log("Farm đống góp: "+ arrayDonateofGuild[0].Farm);
																		  					io.in(clients[clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket).emit('RECEIVEDONATECOMPLETE',
																							{
																								arrayCompleteDonate:arrayDonateofGuild,
																		                	});							                														  									  								                	
																			  			}	
																					}													
																				}else
																				{
																					console.log("Kiem tra lai guild 419");
																				}
																			}
																		});
																	}
																}
															});								  												  			
												  			
											  			}

													}
												}
											});	

										}else
										{
											console.log("khong vuot qua resource=======================================");
											var query = pool.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = guildlist.Farm + '"+arrayDonateComplete[index].FarmWait
											+"',guildlist.Wood = guildlist.Wood + '"+arrayDonateComplete[index].WoodWait
											+"',guildlist.Stone = guildlist.Stone +'"+arrayDonateComplete[index].StoneWait
											+"',guildlist.Metal = guildlist.Metal + '"+arrayDonateComplete[index].MetalWait							
											+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 420');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Cập nhật sau khi hoàn tất thành công khong vuot qua");
														if (clients.length>0) 
														{	
															var query = pool.query("SELECT * FROM `guildlist` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows,field)
															{												
																if (!!error)
																{
																	console.log('Error in the query 421');
																}else
																{
																	if (rows.length>0) 
																	{
																		arrayDonateofGuild =rows;
																		var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows,field)
																		{
																			console.log("Select lead");
																			if (!!error)
																			{
																				console.log('Error in the query 422');
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayAllMemberGuilds = rows;																	
																					for (var k = 0; k < arrayAllMemberGuilds.length; k++) 
																					{
																						if ((lodash.filter(clients, x => x.name === arrayAllMemberGuilds[k].MemberName)).length >0) 
																			  			{	
																			  				console.log("Gửi lên user online: "+arrayAllMemberGuilds[k].MemberName+"_"+clients[clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket);					  													  								  																	  				
																			  				console.log("Farm đống góp: "+ arrayDonateofGuild[0].Farm);
																		  					io.in(clients[clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket).emit('RECEIVEDONATECOMPLETE',
																							{
																								arrayCompleteDonate:arrayDonateofGuild,
																		                	});							                														  									  								                	
																			  			}	
																					}													
																				}else
																				{
																					console.log("Kiem tra lai guild 423");
																				}
																			}
																		});
																	}
																}
															});								  												  			
												  			
											  			}

													}
												}
											});	
										}
									}else
									{
										console.log("khong tim thay guild nao 424");
									}
								}
							});

				  							  							  			
									  			
				  		}			 
					}else
					{
						
					}			

				}
			})

			//kiểm tra thoi gian out guild
			//====================================			
	    	var arrayResetOutGuild=[],arrayMember=[];  		    						
    		var query = pool.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 2 AND TimeRemainOutGuild <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 425');
				}else
				{
					if (rows.length>0) 
					{
						arrayResetOutGuild = rows;
						for (var i = 0; i < arrayResetOutGuild.length; i++) 
				  		{
				  			var index = i;					  			
				  			var query = pool.query("DELETE FROM guildlistmember WHERE ActiveStatus= 2 AND GuildName = '"+arrayResetOutGuild[index].GuildName
				  				+"' AND MemberName = '"+arrayResetOutGuild[index].MemberName+"'",function(error, result, field)
						  	{
								if(!!error)
								{
									console.log('Error in the query 426');
								}else
								{
									if(result.affectedRows>0)
									{										
										
										if (clients.length>0) 
										{	
								  			
								  			var query = pool.query("SELECT * FROM `users` WHERE 1",function(error, rows,field)
											{
											
												if (!!error)
												{
													console.log('Error in the query 427');
												}else
												{
													if (rows.length>0) 
													{
														arrayMember = rows;														
														for (var k = 0; k < arrayMember.length; k++) 
														{
															if ((lodash.filter(clients, x => x.name === arrayMember[k].UserName)).length >0) 
												  			{													  				
											  					io.in(clients[clients.findIndex(item => item.name === arrayMember[k].UserName)].idSocket).emit('RECEIVERESETOUTGUILD',
																{
																	ArrayOutGuild:arrayResetOutGuild[index],
											                	});							                														  									  								                	
												  			}	
														}													
													}else
													{
														console.log("Kiem tra lai guild 428");
													}
												}
											});
							  			}
									}else
									{
										console.log("Thực hiện lại 429");																														
									}
								}
							})				  			
				  		}			 
					}else
					{
						
					}			

				}
			})

			//kiểm tra thoi gian hủy kết bạn
			//=========================			
	    	var arrayResetCancelFriend=[],arrayUserCanceled=[],arrayMember=[];     						
    		var query = pool.query("SELECT * FROM `addfriend` WHERE ActiveStatus = 2 AND TimeCancelFriend <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 430');
				}else
				{
					if (rows.length>0) 
					{
						arrayUserCanceled = rows;
						for (var i = 0; i < arrayUserCanceled.length; i++) 
				  		{
				  			var index = i;	
				  			arrayMember.push(arrayUserCanceled[index].UserNameFriendA);
				  			arrayMember.push(arrayUserCanceled[index].UserNameFriendB);				  			
				  			var query = pool.query("DELETE FROM addfriend WHERE ActiveStatus = 2 AND UserNameFriendA = '"+arrayUserCanceled[index].UserNameFriendA
				  				+"' AND UserNameFriendB = '"+arrayUserCanceled[index].UserNameFriendB+"'",function(error, result, field)
						  	{
								if(!!error)
								{
									console.log('Error in the query 431');
								}else
								{
									if(result.affectedRows>0)
									{
										client.del(arrayUserCanceled[index].UserNameFriendA+arrayUserCanceled[index].UserNameFriendB);										
										if (clients.length>0) 
										{									  			
								  			for (var k = 0; k < arrayMember.length; k++) 
											{
												if ((lodash.filter(clients, x => x.name === arrayMember[k])).length >0) 
									  			{										  				
								  					io.in(clients[clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVECANCELFRIENDTIME',
													{
														arrayCancelFriend:arrayUserCanceled[index],
								                	});							                														  									  								                	
									  			}	
											}	
							  			}
									}else
									{
										console.log("Thực hiện lại 432");																																							}
								}
							})				  			
				  		}			 
					}else
					{
						
					}			

				}
			})

			//Kiểm tra hoàn tất chuyển tài nguyên từ bạn
			//========================================
			var arrayResetCancelFriend=[],arrayUserTransfer=[],arrayMember=[],arrayUserTransferComplete=[],arrayTransferComplete=[],
			FarmRemain,WoodRemain,StoneRemain,MetalRemain,FarmOver,WoodOver,StoneOver,MetalOver;  		    						
    		var query = pool.query("SELECT * FROM `userbase` WHERE TimeCompleteResourceTransferFromFriend > 0 AND  TimeCompleteResourceTransferFromFriend <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 433');
				}else
				{
					if (rows.length>0) 
					{
						arrayUserTransfer = rows;
						
						for (var i = 0; i < arrayUserTransfer.length; i++) 
				  		{
				  			var index = i;	
				  			arrayMember.push(arrayUserTransfer[index].UserName);
				  			arrayMember.push(arrayUserTransfer[index].ResourceTransferToUserNameOfFriend);	
				  			var query = pool.query("SELECT * FROM `userbase` WHERE UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
										+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"' ",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 434');
								}else
								{
									if (rows.length>0) 
									{			
										arrayTransferComplete=rows;				  			
							  			//Cập nhật số lượng tài nguyên được cộng cho bạn
							  			if (((arrayUserTransfer[index].FarmWaitFromFriend +parseFloat(arrayTransferComplete[0].Farm))>=parseFloat(arrayTransferComplete[0].MaxStorage))
														||((arrayUserTransfer[index].WoodWaitFromFriend +parseFloat(arrayTransferComplete[0].Wood))>=parseFloat(arrayTransferComplete[0].MaxStorage))
														||((arrayUserTransfer[index].StoneWaitFromFriend +parseFloat(arrayTransferComplete[0].Stone))>=parseFloat(arrayTransferComplete[0].MaxStorage))
														||((arrayUserTransfer[index].MetalWaitFromFriend +parseFloat(arrayTransferComplete[0].Metal))>=parseFloat(arrayTransferComplete[0].MaxStorage))) 
										{
											console.log("vuot qua resource======================================="+parseFloat(arrayTransferComplete[0].MaxStorage));
											if ((arrayUserTransfer[index].FarmWaitFromFriend +parseFloat(arrayTransferComplete[0].Farm))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												console.log("1");
												FarmRemain = parseFloat(arrayTransferComplete[0].MaxStorage);											 
											}else
											{
												FarmRemain = (arrayUserTransfer[index].FarmWaitFromFriend +parseFloat(arrayTransferComplete[0].Farm));
												console.log("1.1");
											}

											if ((arrayUserTransfer[index].WoodWaitFromFriend +parseFloat(arrayTransferComplete[0].Wood))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												console.log("2");
												WoodRemain = parseFloat(arrayTransferComplete[0].MaxStorage);

											}else
											{
												WoodRemain = (arrayUserTransfer[index].WoodWaitFromFriend +parseFloat(arrayTransferComplete[0].Wood));
												console.log("2.1");
											}

											if ((arrayUserTransfer[index].StoneWaitFromFriend +parseFloat(arrayTransferComplete[0].Stone))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												console.log("3");
												StoneRemain = parseFloat(arrayTransferComplete[0].MaxStorage);
											}
											else
											{
												StoneRemain = (arrayUserTransfer[index].StoneWaitFromFriend +parseFloat(arrayTransferComplete[0].Stone));
												console.log("3.1");
											}

											if ((arrayUserTransfer[index].MetalWaitFromFriend +parseFloat(arrayTransferComplete[0].Metal))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												console.log("4");
												MetalRemain = parseFloat(arrayTransferComplete[0].MaxStorage);												
											}else
											{
												MetalRemain = (arrayUserTransfer[index].MetalWaitFromFriend +parseFloat(arrayTransferComplete[0].Metal));
												console.log("4.1");
											}

											var query = pool.query("UPDATE userbase SET Farm = '"+ (parseFloat(FarmRemain))
					                			+"',Wood ='"+ (parseFloat(WoodRemain))				                				                			
					                			+"',Stone ='"+ (parseFloat(StoneRemain))				                				                			
					                			+"',Metal ='"+ (parseFloat(MetalRemain))	                							                				                						                				                			
					                			+"'where UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                			+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 435');
												}else
												{
													if (result.affectedRows>0) 
													{														
														var query = pool.query("UPDATE userbase SET FarmWaitFromFriend = 0,WoodWaitFromFriend = 0,StoneWaitFromFriend =0 ,MetalWaitFromFriend = 0,ResourceTransferToBaseOfFriend = 0,ResourceTransferToUserNameOfFriend = '',TimeCompleteResourceTransferFromFriend = 0, TimeRemainResourceTransferFromFriend = 0 where UserName = '"+arrayUserTransfer[index].UserName
							                			+"' AND numberBase = '"+parseFloat(arrayUserTransfer[index].numberBase)+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 436');
															}else
															{
																if (result.affectedRows>0) 
																{																

																	if (clients.length>0) 
																	{	
																		var query = pool.query("SELECT * FROM `userbase` WHERE UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                												+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"' ",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 437');
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayUserTransferComplete=rows;
																					for (var k = 0; k < arrayMember.length; k++) 
																					{
																						if ((lodash.filter(clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(clients[clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVETRANSFERRESOURCEFRIENDCOMPLETE',
																							{
																								arrayTransferResourceFriend:arrayUserTransferComplete,
																		                	});							                														  									  								                	
																			  			}	
																					}
																				}
																			}
																		});								  			
															  				
														  			}
																}else
																{												
																	console.log("gửi mail 438");
																}
															}
														});

													}else
													{
														console.log("gửi mail 439");
													}
												}
											});	

										}
										else
										{
											var query = pool.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(arrayUserTransfer[index].FarmWaitFromFriend))
					                			+"',Wood = Wood + '"+ (parseFloat(arrayUserTransfer[index].WoodWaitFromFriend))				                				                			
					                			+"',Stone = Stone + '"+ (parseFloat(arrayUserTransfer[index].StoneWaitFromFriend))				                				                			
					                			+"',Metal = Metal + '"+ (parseFloat(arrayUserTransfer[index].MetalWaitFromFriend))	                							                				                						                				                			
					                			+"'where UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                			+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query 450');
												}else
												{
													if (result.affectedRows>0) 
													{														
														var query = pool.query("UPDATE userbase SET FarmWaitFromFriend = 0,WoodWaitFromFriend = 0,StoneWaitFromFriend =0 ,MetalWaitFromFriend = 0,ResourceTransferToBaseOfFriend = 0,ResourceTransferToUserNameOfFriend = '',TimeCompleteResourceTransferFromFriend = 0, TimeRemainResourceTransferFromFriend = 0 where UserName = '"+arrayUserTransfer[index].UserName
							                			+"' AND numberBase = '"+parseFloat(arrayUserTransfer[index].numberBase)+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 451');
															}else
															{
																if (result.affectedRows>0) 
																{																

																	if (clients.length>0) 
																	{	
																		var query = pool.query("SELECT * FROM `userbase` WHERE UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                												+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"' ",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 452');
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayUserTransferComplete=rows;
																					for (var k = 0; k < arrayMember.length; k++) 
																					{
																						if ((lodash.filter(clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(clients[clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVETRANSFERRESOURCEFRIENDCOMPLETE',
																							{
																								arrayTransferResourceFriend:arrayUserTransferComplete,
																		                	});							                														  									  								                	
																			  			}	
																					}
																				}
																			}
																		});								  			
															  				
														  			}
																}else
																{												
																	console.log("gửi mail 453");
																}
															}
														});

													}else
													{
														console.log("gửi mail 454");
													}
												}
											});								
										}				  			

									}
								}
							});				  			
				  		}			 
					}else
					{						
					}			

				}
			})	
			
			//Cap nhat kiem tra trao doi tai nguyen va kim cuong hang ngay cua guild
			//Cập nhật cho các dữ liệu cần kiểm tra
			var dt = datetime.create();
			var formatted = dt.format('dmY');
			var arrayAllGuild = [];	
			//cap nhat so luong tai nguyen doi kim cuong trong 1 ngay	
			var query = pool.query("SELECT * FROM `guildlist` WHERE DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 455');
				}else
				{
					if (rows.length>0) 
					{
						arrayAllGuild =rows;		
						var query = pool.query("UPDATE guildlist SET numberResourceToDiamon =0, DateResourceToDiamon='"+parseFloat(formatted)
							+"' where DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 456');
							}else
							{
								if (result.affectedRows>0) 
								{	
									for (var i = 0; i < arrayAllGuild.length; i++) 
							  		{							  			
							  			if ((lodash.filter(clients, x => x.name === arrayAllGuild[i].LeaderName)).length >0) 
							  			{							  					
						  					io.in(clients[clients.findIndex(item => item.name === arrayAllGuild[i].LeaderName)].idSocket).emit('RECEIVERERESETRESOURCECHANGEDIAMOND',
											{
												numberResourceToDiamon:0,																																																																												
						                	});						                											  													  															  								                	
							  			}													  							  			
							  		}	
																															
								}else
								{
									console.log("update khong thanh cong 457");
								}
							}
						});					
					}
				}
			});

			
			//Gửi thông báo của hệ thống
			var arrayMessageSystem = [];				
			var query = pool.query("SELECT Detail FROM `chatting` WHERE `SystemCheck` > 0",function(error, rows,field)
			{
				if (!!error)
				{
					console.log('Error in the query 458');
				}else
				{
					if (rows.length>0) 
					{
						arrayMessageSystem =rows;		
						var query = pool.query("UPDATE chatting SET `SystemCheck` = 0 where `SystemCheck` =1",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query 459');
							}else
							{
								if (result.affectedRows>0) 
								{							
									console.log("Gửi message System");
									io.emit('RECEIVEMESSAGESYSTEM',
									{
										arrayMessageSystem:arrayMessageSystem,																																																																												
				                	});																																	
								}else
								{
									console.log("update khong thanh cong 460");
								}
							}
						});					
					}
				}
			});	

			//Cập nhật cho các dữ liệu cần kiểm tra
			var query = pool.query("UPDATE `users` SET `password_recover_key`='',`password_recover_key_expire`='' WHERE `password_recover_key_expire`= '"+parseFloat(createPositionTimelast)+"'",function(error, result, field)
			{					           
	            if(!!error) 
	            {	
	            	console.log('Error in the query 464');
	            }else
	            {

	            }
			});

			//cập nhật lai data passrecover
			var query = pool.query("UPDATE `users` SET `password_recover_key`='',`password_recover_key_expire`='' WHERE `password_recover_key_expire`= '"+parseFloat(createPositionTimelast)+"'",function(error, result, field)
			{					           
	            if(!!error) 
	            {	
	            	console.log('Error in the query 465');
	            }else
	            {
	            }
			});			
			
												
			//update vị trị sau cùng và time move
			var query = pool.query('UPDATE unitinlocations SET Position = PositionClick ,CheckMove=0,DistanceMoveLogoff="" WHERE CheckOnline=1 AND TimeMoveTotalComplete =? AND CheckCreate !=1',[parseFloat(createPositionTimelast)],function(error, result, field)
			{
				if(!!error)
				{
					console.log('Error in the query 468');
				}else
				{
					if (result.affectedRows> 0) 
					{							
						//kiểm tra vị trí trùng sau khi hết thời gian di chuyển (5=)
						/*var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [];
						var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;			
						//kiểm tra thời gian về 0 của unit location
						//kiểm tra khi bắng thời gian của server
						//thực hiện random tìm vị trí mới
						//cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)				

						var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the query 466');
							}else
							{
								arraycheckUser=rows;
								//console.log("=============Thuc hien thay doi vi tri danh cron dau tien");				
								var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the query 469');
									}else
									{
										for (var k = 0; k < rows.length; k++)
										{
											 arrayAllCheckTime.push(rows[k]);
								        }
								        for (var j = 0; j < arrayAllCheckTime.length; j++)
										{								
											if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length)
												+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length)>=2)
											{
												const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTime[j].Position.split(","),idUnitInLocations=arrayAllCheckTime[j].idUnitInLocations;									
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

												for (var i = 0; i < arrayS.length; i++) 
												{
													if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
													{
														arrayRandom.push(arrayS[i]);
													}
												}																					
												if (arrayRandom.length>0) 
												{														
													newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
													arrayAllCheckTime[j].PositionClick = newLocation;
													arrA =	newLocation.split(",");
													arrC =	arrayAllCheckTime[j].Position.split(",");	
													console.log("Vi tri set lai 4: "+newLocation);								
													var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach)).toFixed(0));
													console.log("Thời gian: "+ time);
													//time=0;
													d = new Date();
													createPositionTimelast = Math.floor(d.getTime() / 1000);	
													var farmtest = 	(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));																	
													if (parseFloat(arrayAllCheckTime[j].FarmPortable) < (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time))) 
													{
														FarmConsumeChangePositionDuplicate=0;
													}else
													{
														FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTime[j].FarmPortable)-(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));
													}
													var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',TimeSendToClient='"+(parseFloat(createPositionTimelast)+10)+"',CheckMove=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),0,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query 470');
														}else
														{
															if (result.affectedRows> 0) 
															{
																console.log(parseFloat(idUnitInLocations)+" ========================Farm cho di chuyen trung 3: "+farmtest);
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 471');
																	}else
																	{
																		if (rows.length >0)
																		{						
																			//console.log("=============Thuc hien thay doi vi tri danh cron 1");											
																			//gửi vị trí cập nhật
																	        io.emit('RECEIVEPOSITIONCHANGE',
																			{
															            		arrayAllPositionchange: rows[0],
															        		});      															        
																	    }
																	}
																})
															}
															else
															{
																console.log('khong co time remain duoc cap nhat 472');
															}
														}
													})	
												}else
												{												
											  		
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

													for (var i = 0; i < arrayS1.length; i++) 
													{
														if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
														{
															arrayRandom.push(arrayS1[i]);
														}
													}
													if (arrayRandom.length >0 ) 
													{														
														newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
														arrayAllCheckTime[j].PositionClick = newLocation;
														arrA =	newLocation.split(",");
														arrC =	arrayAllCheckTime[j].Position.split(",");									
														var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
														time=0;
														d = new Date();
														createPositionTimelast = Math.floor(d.getTime() / 1000);
														//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
														var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query 473');
															}else
															{
																if (result.affectedRows> 0) {														
																	var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 474');
																		}else
																		{
																			if (rows.length >0)
																			{
																				console.log("=============Thuc hien thay doi vi tri danh cron 2");	
																				//gửi vị trí cập nhật
																		        io.emit('RECEIVEPOSITIONCHANGE',
																				{
																            		arrayAllPositionchange: rows[0],
																        		});	

																		    }
																		}
																	})
																}
																else
																{
																	console.log('khong co time remain duoc cap nhat 475');
																}
															}
														})		
													}else
													{												  		
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
														for (var i = 0; i < arrayS2.length; i++) 
														{
															if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
															{
																arrayRandom.push(arrayS2[i]);
															}
														}																					
														if (arrayRandom.length>0) 
														{														
															newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
															arrayAllCheckTime[j].PositionClick = newLocation;
															arrA =	newLocation.split(",");
															arrC =	arrayAllCheckTime[j].Position.split(",");									
															var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
															time=0;
															d = new Date();
															createPositionTimelast = Math.floor(d.getTime() / 1000);

															//var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
															var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query 476');
																}else
																{
																	if (result.affectedRows> 0) {															
																		var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the query 477');
																			}else
																			{
																				if (rows.length >0)
																				{		
																					console.log("=============Thuc hien thay doi vi tri danh cron 3");																	
																					//gửi vị trí cập nhật
																			        io.emit('RECEIVEPOSITIONCHANGE',
																					{
																	            		arrayAllPositionchange: rows[0],
																	        		});		      																	      
																			    }
																			}
																		})
																	}
																	else
																	{
																		console.log('khong co time remain duoc cap nhat 478');
																	}
																}
															})	
														}
													}
												}		
											}
								        }
								    }
								});
							}
						})	*/
						functions.CheckPosition(io);				
					}
					else
					{					
					}
				}
			});

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
			
								
			//Thực hiện chức năng unit A đánh nhau B
			if (arrayAvsB.length > 0) 
			{
				//console.log("===========Chieu dai mang danh hien tai:============ "+arrayAvsB.length);
				var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameB,UnitOrderB,
				UserNameA,UnitOrderA,FarmRemain=0,QualityBegin=0, FarmTotal=0,
				FarmTotalA=0,FarmTotalB=0,AC; 				  		
				for (var s = 0; s < arrayAvsB.length; s++) 
				{
					var index = s;								
					A=arrayAvsB[index].idUnitInLocationsA;
					UserNameA=arrayAvsB[index].UserNameA;
				 	UnitOrderA=arrayAvsB[index].UnitOrderA;	
				 	B=arrayAvsB[index].idUnitInLocationsB;	
					UserNameB=arrayAvsB[index].UserNameB;
					UnitOrderB=arrayAvsB[index].UnitOrderB;	
					console.log(index+": ================================"+arrayAvsB[index].idUnitInLocationsA+" VS "+arrayAvsB[index].idUnitInLocationsB);										
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
						
						//console.log(+B+": Mau sau khi bi danh====================: "+HealthRemain);					
						if (HealthRemain<=0)
						{		
							//console.log(A+" SL sau: "+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality));											
							//console.log(A+" Farm sau: "+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable));											
																	
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
								if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === B)).length > 0) {
									arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsB === B), 1);														
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
												//console.log("==================Cập nhật unitlovation A sau khi đánh thành comg===================");
												//cập nhật lại redis va memmory
												redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable = parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].FarmPortable)+parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].FarmPortable);					
												//cập nhật redis và data base																												
												client.set(A,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))]));

												//xóa torng redis	
												redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);					
												redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);											
												//console.log("Chieu dai redis array sau khi danh xong=============: "+redisarray.length);								
												//xóa trong redis
												client.del(B);											
												
											}
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
		       			    console.log(A+" Farm la: "+ FarmTotalA);
		       			    console.log(B+" Farm la: "+ FarmTotalB);
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
							var query = pool.query("UPDATE unitinlocations SET userFight = '"+A
								+"' ,HealthRemain = '"+parseFloat(HealthRemain)
								+"' , Damage = '"+parseFloat(DamageRemain)
								+"' , Defend = '"+parseFloat(DefendRemain)
								+"' , Quality = '"+parseFloat(QualityEnd)
								+"', TimeFight = '"+parseFloat(createPositionTimelast)
								+"', FarmPortable = '"+parseFloat(FarmTotalB)								
								+"', CheckFight = 1  WHERE idUnitInLocations = '"+parseFloat(B)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 486');
								}else
								{  																		
									if(result.affectedRows > 0)
									{ 									
										//console.log(B+ " Cập nhật mysql thanh cong");																		
									}
								}
							}) 	
							var query = pool.query("UPDATE unitinlocations SET userFight = '"+B
								+"' ,TimeFight = '"+parseFloat(createPositionTimelast)													
								+"', FarmPortable = '"+parseFloat(FarmTotalA)
								+"',CheckFight = 1 WHERE idUnitInLocations = '"+parseFloat(A)+"'",function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query 487');
								}else
								{ 																						
									if(result.affectedRows > 0)
									{ 								 
										//console.log(A+" Cap nhat my sql thanh cong");						
									}
								}
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

							}	

						}

					}
				}
			}			

			


		});	

		//reset mine 
		var jobResetMine = new CronJob(
		{
			//cronTime: '00 55 08 * * 0-6',
		  	cronTime: timeResetMines,
		  	onTick: function()
		  	{
		    	console.log('reset Mine');
		    	functions.myFuncReset();
		    	jobResetMine.stop();
		  	},
		  	onComplete: function()
		  	{		    	
		 	},
		  	start: false,
		  	timeZone: 'Asia/Ho_Chi_Minh'
		});
		jobResetMine.start();

		//gửi data array client qua class addfriend
		exports.dataClientsCls = function dataClientsCls () 
		{
		    return clients;   	
		}		
	}

	server.listen(app.get(process.env.PORT), function ()
	{
		console.log("------- server is running 8080-------");
		//console.log("Time Now: "+new Date().toString());		
		//var s = new Date().toString();
		//console.log(new Date().toString().slice(25, 33));		
		var dt = datetime.create();
		var formatted = dt.format('d-m-Y H:M:S');
		//console.log("time: "+ formatted);		
		console.log("thời gian hien tại: "+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	

		//console.log("lay don vị: "+ (26%14));

		//var QualityRemain =10.8;		 
		// console.log("test: "+parseInt(QualityRemain,10));
		// console.log("lam tron: "+(Number((QualityRemain).toFixed(0))));
		// if ((QualityRemain % 1 ) >= -0.5)
		// {
		// 	console.log("1: "+(Number((QualityRemain).toFixed(0))-1));
		// }else
		// {
		// 	console.log("2: "+(Number((QualityRemain).toFixed(0))));
		// }	
	} );
}
