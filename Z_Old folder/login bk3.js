'use strict';
var pool = require('./db');
var lodash		    = require('lodash');
var functions 		= require("./functions");
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var cron 			= require('node-cron');
var shortId 		= require('shortid');
var datetime 		= require('node-datetime');
var client 			= require('./redis');
var Promise 		= require('promise');
var async 			= require("async");
var d,createPositionTimelast, clients = [],currentUser=[], redisarray = [], lastPosition="",timeSend=0,hourReset=0,minuteReset = 0,secondReset=0,
MineHarvestServer=0, arrayRequestJoinGuild=[], parseN = 10, numberDistance, limitNumber = 200;
const k = [250];


module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {   				
			var newLocation ="",idUnitInLocationstemp,X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,HealthRemain,
				F="",S="",C="",timeResetMines,FarmTransferRemain=0, WoodTransferRemain=0, StoneTransferRemain=0,MetalTransferRemain=0,
				FarmTransferSurpass=0,WoodTransferSurpass=0, StoneTransferSurpass=0,MetalTransferSurpass=0,
				FarmConsumeInOffline,FarmRemainInOnline, arrayUserLogin = [], arrayAllUserposition = [],
				arrayUserBaseResource = [],arrayAllPositionclick = [],arrayMineposition = [],arrayMineId = [], arrayAllMine = [], arrayAllMineName = [],
				arrayAllMinePosition = [], arrayAllMineMerger = [],arrayidResource =[],arrayBaseUser =[], arrayUnitBaseUser =[],arrayUnitWaitBaseUser =[],
				arrayAddedFriend=[],arrayCancelFriend =[],arrayWaitedFriend=[],	arrayAllresourcebuyunit =[],arraytest =[],arraycheckUserlg=[],arrayAllResourceToDiamond=[],
				arrayUnitLocationsComplete=[],arrayAllUnitLocationsComplete=[],arrayAllUnitLocationsCompletefirst=[], arrayAllresourceupbase = [],
				rrayAllresourceupmine = [],arrayAllresourceupSwordman = [],arrayAllresourceupFarm=[], arrayAllresourceupWood=[],arrayAllresourceupStone=[],
				arrayAllresourceupMetal=[],arrayAllresourceupBowman=[],	arrayAllresourceupGranary=[],arrayAllresourceupMarket=[],arrayAllUsers=[],arrayWaitingFriend=[],				
				arrayAllresourcebuybase=[],arrayAllresourceupguild=[],arrayAllGuildList=[],arrayAllRequestJoinGuildByUser=[],arrayAllMinepositionTrue = [],arrayBaseResource = [],
				arrayAllMemberGuild=[],arrayAllInviteByGuild=[],arrayTimeTransferFarmfromBaseToUnit=[],arrayPolicy=[],arrayNotisyStatus=[],
				arrayMessGuildMember=[],arrayMessPrivateMember=[],arrayBlackList=[],arrayBlockedBlackListByUser=[];			       	
        	
   		
			module.exports =  exports = GameServer;					
        	socket.on('R_LOGIN', function (data)
			{		
				var s,arrayOnlineStatus =[],d = new Date(), createPositionTimelast = Math.floor(d.getTime() / 1000);;			
				//lấy dữ liệu login
				currentUser = getCurrentUser (data,shortId,socket);
				console.log("===========data receive Login: "+currentUser.name+"_"+currentUser.password+"_"+socket.id);
				pool.getConnection(function(err,connection)
				{
			        if (err)
			        {
			          return;
			        }
					//Kiểm tra username và password
			        connection.query("SELECT UserID FROM `users` WHERE `UserName`='"+currentUser.name+"' AND `UserPass`='"+currentUser.password+"'",function(error, rows,field)
			        {
						if (!!error){console.log('Error in the query 131');
						}else
						{						
							if (rows.length>0)
							{									
							    const asyncFunc = (timeout) => {
							        return new Promise((resolve,reject) => {
							            setTimeout(() => {  

											//Cập nhật thông tin thiết bị đăng nhập
									        connection.query("UPDATE users SET modelDevide ='"+currentUser.modelDevide+"',ramDevide ='"+parseFloat(currentUser.ramDevide)
							    			+"'WHERE `UserName` = '"+currentUser.name+"'",function(error, result, field)
											{
												if(!!error){console.log('Error in the query 2');}
											});		
														
									        //#region Cập nhật thời gian
												//Cập nhật thời gian mua unit cho base
										        connection.query("SELECT * FROM `unitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 3');
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
																	if (!!error){console.log('Error in the query 4');																			
																	}else
																	{	
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
																				if(!!error){console.log('Error in the query 5');}
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
																				if(!!error){console.log('Error in the query 6');
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
																							if(!!error){console.log('Error in the query 7');
																							}else
																							{
																								if (result.affectedRows>0) 
																								{
																									//update																		
																									connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																									{
																										if(!!error){console.log('Error in the query 8');}
																									});
																								}
																							}
																						});
																					}else
																					{														
																						//insert
																						connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `QualityWait`, `Level`, `numberBaseReceive`, `TimeCompleteUnitMoveSpeed`, `TimeWaitUnitMoveSpeed`) VALUES ('"+""+"','"
																						+rows[0].UserName+"','"+rows[0].numberBaseReceive+"','"+rows[0].UnitType+"','"+rows[0].QualityWait+"','"+0+"','"+rows[0].Level+"','"+0+"','"+0+"','"+0+"')",function(error, result, field)
																						{
																				            if(!!err){console.log('Error in the query 9');
																				            }else
																				            {
																				            	if (result.affectedRows>0) 
																				            	{														            												            		
																				            		//cập nhật lại quality wait
																				            		connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
																				        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
																									+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
																									+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
																									{
																										if(!!error){console.log('Error in the query 10');
																										}else
																										{
																											if (result.affectedRows>0) 
																											{
																												//update																					
																												connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																												{
																													if(!!error){console.log('Error in the query 10-1');}
																												});															
																											}
																										}
																									});
																				            	}
																				            }
																				        });
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

												//Cập nhật thời gian gửi farm từ base đến unit location
												connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 11');
													}else
													{
														if (rows.length>0) 
														{
															for (var i = 0; i < rows.length; i++)
															{	
												    			//tính toán lượng farm cần cho di chuyển
												    			if ( parseFloat(rows[i].FarmTransferCompleteTime)> parseFloat(createPositionTimelast))  
												    			{
												    				//trường hợp còn thời gian					    						    					;
												    				connection.query("UPDATE `unitinlocations` SET TransferCompleteTotalTime = '"+(parseFloat(rows[i].FarmTransferCompleteTime)-parseFloat(createPositionTimelast)) 
												    					+"' where UserName = '"+rows[i].UserName
										                				+"'AND UnitOrder = '"+rows[i].UnitOrder+"'",function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query 12');}
																	});
												    			}else if (( parseFloat(rows[i].FarmTransferCompleteTime)> parseFloat(createPositionTimelast)) &&( parseFloat(rows[i].FarmTransferCompleteTime)> 0))
												    			{
												    				//trường hợp hoàn tất thời gian				    							    										    				
												    				connection.query("UPDATE userbase,unitinlocations SET unitinlocations.FarmPortable = unitinlocations.FarmPortable + unitinlocations.FarmWait,userbase.TransferUnitOrderStatus = '"+ 0								
										                			+"',unitinlocations.FarmWait = '"+ 0                			
										                			+"',unitinlocations.FarmTransferCompleteTime = '"+0
										                			+"',unitinlocations.TransferCompleteTotalTime = '"+0				                				                						                				                			
										                			+"'where userbase.UserName = unitinlocations.UserName AND userbase.UserName ='"+currentUser.name
										                			+"'AND userbase.numberBase = '"+rows[i].numberBaseTransfer
										                			+"' AND unitinlocations.UnitOrder ='"+rows[i].UnitOrder+"'",function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query 14');}
																	});			    				
												    			}				    			
												    		}
														}
											    	}
											    });

										        //Cập nhật thời gian cho user base
												connection.query("SELECT * FROM `userbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 24');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
															var index = i; 
															//Cập nhật thời gian mua unit in base nếu còn
											    			if ( parseFloat(rows[index].TimeWaitSum)> parseFloat(createPositionTimelast))  
											    			{
											    				connection.query("UPDATE userbase SET TimeWait = '"+parseFloat(parseFloat(rows[index].TimeWaitSum)-parseFloat(createPositionTimelast)) 
											    					+"' where UserName = '"+rows[index].UserName
									                				+"'AND numberBase = '"+rows[index].numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 25');}
																});
											    			}	

											    			//Cập nhật khi còn thời gian chuyển tài nguyên cho bạn
											    			if ( parseFloat(rows[i].TimeCompleteResourceTransferFromFriend)> parseFloat(createPositionTimelast))  
											    			{
											    				connection.query("UPDATE userbase SET TimeRemainResourceTransferFromFriend = '"+(parseFloat(rows[i].TimeCompleteResourceTransferFromFriend)-parseFloat(createPositionTimelast)) +"' where UserName = '"+rows[i].UserName
									                			+"'AND numberBase = '"+rows[i].numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 55');}
																});
											    			}				    			
											    			//#region Thu hoạch	
												    			//cập nhật thời gian farm thu hoach					    							
																connection.query("SELECT A.Farm,A.LvFarm,A.UserName,A.numberBase,A.FarmHarvestTime,A.CurrentLvFarm, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupfarm AS B ON B.Level =  A.CurrentLvFarm WHERE A.UserName = '"+rows[index].UserName
																	+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
																{
																	if (!!error){	
																		console.log("error query farm thu hoạch");
																	}else
																	{				
																						
																		if (rows.length > 0 && (parseFloat(rows[0].LvFarm)===parseFloat(rows[0].CurrentLvFarm))) 
																		{					    						
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																													
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 58');}
																				});																		
																			}else
																			{				                			
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
																					if(!!error){console.log('Error in the query 60');}
																				});																				
																			}											
																		} else if (rows.length > 0 && (parseFloat(rows[0].LvFarm)>parseFloat(rows[0].CurrentLvFarm))) 
																		{								
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																												
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 62');}
																				});																		
																			}else
																			{				                			
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
																					if(!!error){console.log('Error in the query 64');}
																				});																				
																			}											
																		}
																	}
																}); 

																//cập nhật thời gian Wood thu hoach	
																connection.query("SELECT A.Wood,A.LvWood,A.UserName,A.numberBase,A.WoodHarvestTime,A.CurrentLvWood, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupwood AS B ON B.Level =  A.CurrentLvWood WHERE A.UserName = '"+rows[index].UserName
																	+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 66');								
																	}else
																	{																	
																		if (rows.length > 0 && (parseFloat(rows[0].LvWood)===parseFloat(rows[0].CurrentLvWood))) 
																		{				    						
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																													
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 67');}
																				});																			

																			}else
																			{				                			
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
																						if(!!error){console.log('Error in the query 69');}
																					});										
																				
																			}
																			
																		} else if (rows.length > 0 && (parseFloat(rows[0].LvWood)>parseFloat(rows[0].CurrentLvWood))) 
																		{								
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																											
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 71');}
																				});																	

																			}else
																			{
																							                			
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
																					if(!!error){console.log('Error in the query 73');}
																				});																				
																			}											
																		}
																	}
																}); 

																//cập nhật thời gian Stone thu hoach
																connection.query("SELECT A.Stone,A.LvStone,A.UserName,A.numberBase,A.StoneHarvestTime,A.CurrentLvStone, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupstone AS B ON B.Level =  A.CurrentLvStone WHERE A.UserName = '"+rows[index].UserName
																	+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 75');										
																	}else
																	{																	
																		if (rows.length > 0 && (parseFloat(rows[0].LvStone)===parseFloat(rows[0].CurrentLvStone))) 
																		{				    						
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																													
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 76');}
																				});																			

																			}else
																			{				                			
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
																					if(!!error){console.log('Error in the query 78');}
																				});																					
																			}
																			
																		} else if (rows.length > 0 && (parseFloat(rows[0].LvStone)>parseFloat(rows[0].CurrentLvStone))) 
																		{								
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																												
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 80');}
																				});																	

																			}else
																			{				                			
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
																					if(!!error){console.log('Error in the query 82');}
																				});									
																			}											
																		}
																	}
																}); 

																//cập nhật thời gian metal thu hoach
																connection.query("SELECT A.Metal,A.LvMetal,A.UserName,A.numberBase,A.MetalHarvestTime,A.CurrentLvMetal, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupmetal AS B ON B.Level =  A.CurrentLvMetal WHERE A.UserName = '"+rows[index].UserName
																	+"'AND A.numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 84');									
																	}else
																	{				
																						
																		if (rows.length > 0 && (parseFloat(rows[0].LvMetal)===parseFloat(rows[0].CurrentLvMetal))) 
																		{	
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																													
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))								                							                						                		
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 85');}
																				});																	
																			}else
																			{				                			
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
																					if(!!error){console.log('Error in the query 87');}
																				});										
																				
																			}
																			
																		} else if (rows.length > 0 && (parseFloat(rows[0].LvMetal)>parseFloat(rows[0].CurrentLvMetal))) 
																		{								
																			if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= parseFloat(rows[0].HarvestContainer)) 
																			{																													
														                		//update tài nguyên còn lại của base					                		
														                		connection.query("UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))					                									                	
														                			+"'where UserName = '"+rows[0].UserName
														                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																				{
																					if(!!error){console.log('Error in the query 89');}
																				});																		

																			}else
																			{			                			
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
																					if(!!error){console.log('Error in the query 91');}
																				});																			
																			}											
																		}
																	}
																}); 
															//#endregion 	

															//#reginon cập nhật thời gian trao đổi tài nguyên giữa các base							
																connection.query("SELECT UserName,numberBase,FarmWait,WoodWait,StoneWait,MetalWait,TimeCompleteResourceMoveSpeed,ResourceTransferToBase FROM userbase WHERE UserName = '"+rows[index].UserName+"'AND numberBase = '"+rows[index].numberBase+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 94');									
																	}else
																	{						
																		if (rows.length > 0 && (parseFloat(createPositionTimelast)<parseFloat(rows[0].TimeCompleteResourceMoveSpeed))) 
																		{	
																			connection.query("UPDATE userbase SET TimeWaitResourceMoveSpeed = '"+ (parseFloat(rows[0].TimeCompleteResourceMoveSpeed)-parseFloat(createPositionTimelast))								                							                						                		
													                			+"'where UserName = '"+rows[0].UserName
													                			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																			{
																				if(!!error){console.log('Error in the query 95');}
																			});	
																		}if (rows.length > 0 
																			&& (parseFloat(createPositionTimelast)>=parseFloat(rows[0].TimeCompleteResourceMoveSpeed))
																			&& (parseFloat(rows[0].TimeCompleteResourceMoveSpeed)>0)) 
																		{
																			//update từng tài nguyên còn lại của base						
																			connection.query("SELECT A.UserName,A.numberBase,A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+rows[0].UserName+"'AND A.numberBase = '"+parseFloat(rows[0].numberBase)
																				+"' UNION ALL SELECT A.UserName,A.numberBase,A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+rows[0].UserName+"'AND A.numberBase = '"+parseFloat(rows[0].ResourceTransferToBase)+"'",function(error, rows,field)
																			{
																				if (!!error){console.log('Error in the query 97');															
																				}else
																				{	
																					if (rows.length > 0) 
																					{														
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
																								if(!!error){console.log('Error in the query 98');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET Farm = Farm +'"+FarmTransferSurpass+"',FarmWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 99');}
																										});
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
																								if(!!error){console.log('Error in the query 102');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET FarmWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 103');}
																										});
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
																								if(!!error){console.log('Error in the query 106');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET Wood = Wood +'"+WoodTransferSurpass+"',WoodWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 107');}
																										});
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
																								if(!!error){console.log('Error in the query 110');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET WoodWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 111');}
																										});
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
																								if(!!error){console.log('Error in the query 114');	
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET Stone = Stone +'"+StoneTransferSurpass+"',StoneWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 115');}
																										});
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
																								if(!!error){console.log('Error in the query 118');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET StoneWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 119');}
																										});
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
																								if(!!error){console.log('Error in the query 122');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																										 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET Metal = Metal +'"+MetalTransferSurpass+"',MetalWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 123');}
																										});
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
																								if(!!error){console.log('Error in the query 126');
																								}else
																								{
																									if (result.affectedRows>0) 
																									{																		 
																										//Cập nhật base gửi
																										connection.query("UPDATE userbase SET MetalWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0,TimeWaitResourceMoveSpeed=0 where UserName = '"+rows[0].UserName				    		
																							    			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)+"'",function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 127');}
																										});
																									}
																								}
																							});
																						}	
																					}else
																					{
																						socket.emit('R_RESOURCE_TRANSFER_BASE_BASE_COMPLETE', 
																						{
																	                		message : 0
																	            		});
																	            		console.log("gửi mail 130");
																					}
																				}
																			});
																		}
																	}
																});
															//#endregion														
											    		}
											    	}
											    });

												//cập nhật thời gian reset mine
												var query = pool.query("SELECT DetailMore FROM `task` WHERE DetailTask ='ResetMine'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 387');
													}else
													{
														if (rows.length>0) 
														{									
															timeResetMines = rows[0].DetailMore;								 
														    var arr = timeResetMines.split(/\s+/);
														    hourReset = parseFloat(arr[2]);
														    minuteReset = parseFloat(arr[1]);
														    secondReset = parseFloat(arr[0]);	

														    var today = new Date();								

															//thời gian mỗi ngày reset
															var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, secondReset);
															var resetMine = Math.floor(myToday.getTime() / 1000);

															//thời gian reset tiếp theo
															var myTodaynext = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, hourReset, minuteReset, secondReset);
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
														}			

													}
												})

												//cập nhật thời gian cho những unitinbase đã mua xong
												connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													var index=-1;
													if (!!error) {console.log('Error in the query 198');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{	
								        					if(parseFloat(rows[i].timeComplete)>parseFloat(createPositionTimelast))
								        					{		        						
																connection.query("UPDATE unitwaitinbase SET timeRemain = '"+(parseFloat(rows[i].timeComplete)-parseFloat(createPositionTimelast))
																	+"' WHERE UserName = '"+rows[i].UserName
																	+"' AND numberBase = '"+parseFloat(rows[i].numberBase)
																	+"' AND UnitType = '"+parseFloat(rows[i].UnitType)+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 199');}
																});
								        					}else 
								        					{					        											        						
								        						//update quality to unit in base
																connection.query("UPDATE unitinbase SET Quality = Quality + '"+parseFloat(rows[i].Quality)+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
																		[rows[i].UserName,rows[i].numberBase,rows[i].UnitType,rows[i].Level],function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 201');
																	}else
																	{
																		index++;
																		if (result.affectedRows > 0) 
																		{																												
																			connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																			[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
																		  	{
																				if(!!error){console.log('Error in the query 202');
																				}else
																				{
																					if(result.affectedRows<=0)
																					{
																						console.log("Update khong thanh cong 203");	
																						socket.emit('R_UNIT_IN_BASE_SUCCESS',
																						{
																							message:0,									
																						});																				
																					}
																				}
																			})
																		}else
																		{																	
																			//insert vào quality vào unit in base																		
																			connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`numberBase`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
																			+rows[index].UserName+"','"+rows[index].numberBase+"','"+rows[index].UnitType+"','"+rows[index].Quality+"','"
																			+rows[index].Level+"')",function(error, result, field)
																			{
																	            if(!!err){console.log('Error in the query 204');
																	            }else
																	            {
																	            	if (result.affectedRows > 0) 
																	            	{														            		
																	            		connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
																						[rows[index].UserName,rows[index].numberBase,rows[index].UnitType],function(error, result, field)
																					  	{
																							if(!!error){console.log('Error in the queryfgfg7567');}
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
											//#endregion      

											//#region Cập nhật position
												//cập nhật vi trí unit location
												connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 191');
													}else
													{											
														for (var i = 0; i < rows.length; i++)
														{
															var index = i;
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
									    											    							
									    							//tính lượng farm oflline đã di chuyển và còn lại cho online
									    							//farm off
									    							FarmConsumeInOffline = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));													    							
									    							console.log("Farm offline mà user đã di chuyển là: "+ FarmConsumeInOffline);	
									    							FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(timeMoves));													    							
									    							console.log("Farm online mà user cần di chuyển là: "+ FarmRemainInOnline);
									    							console.log("Đơn vị giây gửi lên client: "+(1/parseFloat(rows[index].MoveSpeedEach)));
									    							if ((parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)) >= parseFloat(FarmRemainInOnline)) 
									    							{							    								
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
																				if(!!error){console.log('Error in the query113434gSfafd');}
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
																					if(!!error){console.log('Error in the query113434gSfafd');}
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
																					if(!!error){console.log('Error in the query113434gSfafd');}
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
																				if(!!error){console.log('Error in the query 403');}
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
																					if(!!error){console.log('Error in the query113434gSfafd');}
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
																					if(!!error){console.log('Error in the query113434gSfafd');}
																				});	
									    									}		    																						
									    								}			    								
									    							}					    							
																}else
																{
																	var query = pool.query("UPDATE unitinlocations SET PositionLogin =PositionClick, Position =PositionClick , CheckMoveOff=0, TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query 403-3');}
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
									    											    							
									    							//tính lượng farm oflline đã di chuyển và còn lại cho online
									    							//farm off
									    							FarmConsumeInOffline = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(rows[index].TimeMoveComplete)-parseFloat(timeMoves)));													    							
									    							console.log("Farm offline mà user đã di chuyển là: "+ FarmConsumeInOffline);	
									    							FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(timeMoves));													    							
									    							console.log("Farm online mà user cần di chuyển là: "+ FarmRemainInOnline);
									    							console.log("Đơn vị giây gửi lên client: "+(1/parseFloat(rows[index].MoveSpeedEach)));
									    							if ((parseFloat(rows[index].FarmPortable) - parseFloat(FarmConsumeInOffline)) >= parseFloat(FarmRemainInOnline)) 
									    							{							    								
									    								//update vị trị sau cùng và time move kiểm tra đơn vị di chuyển
									    								if (parseFloat(timeMoves) >= (1/parseFloat(rows[index].MoveSpeedEach))) 
									    								{
									    									//cập nhật farm và vị trí đủ một đơn vị di chuyển
									    									connection.query("UPDATE unitinlocations SET PositionLogin = '"+ X+","+Z 	                												                			 			                													                			
													                			+"' where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																			{
																				if(!!error){console.log('Error in the query113434gSfafd');}
																			});	
									    								}else
									    								{
									    									//cập nhật farm và vị trí không đủ một đơn vị di chuyển
									    									connection.query("UPDATE unitinlocations SET PositionLogin = '"+ X+","+Z 	                												                			 			                													                											                			
													                			+"'where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																			{
																				if(!!error){console.log('Error in the query113434gSfafd');}
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
																				if(!!error){console.log('Error in the query 403');}
																			});
									    								}
									    								else
									    								{
									    									console.log("Thiếu farm không đủ một đơn vị 1");			    							
																			var query = pool.query("UPDATE unitinlocations SET PositionLogin ='"+X+","+Z						    									
												                			+"'where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																			{
																				if(!!error){console.log('Error in the query 403-1');}
																			});	
									    								}			    								
									    							}					    							
																}else
																{
																	var query = pool.query("UPDATE unitinlocations SET PositionLogin =PositionClick, Position =PositionClick, CheckMoveOff=0, TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+rows[index].idUnitInLocations+"'",function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query 403-2');}
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
																			newLocation =getNewLocationClick(arr[0],arr[1],i,K);
																			arrayAllUnitLocationsCompletefirst[j].PositionClick = newLocation;																
																			if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)<=1)
																			{												
																				break;
																			}
																		}			

																		//cập nhật position mới trung vào data
																		connection.query('UPDATE unitinlocations SET Position = ?,PositionClick = ?  WHERE idUnitInLocations = ?', [newLocation, newLocation,arrayAllUnitLocationsCompletefirst[j].idUnitInLocations],function(error, result, field)
																		{
																			if(!!error){console.log('Error in the query 194');}
																		})
																	}
														        }
															}
														})								

													}
												})
											//#endregion 

											//#region kiem tra user base đã tạo chưa. Nếu chưa thì insert.							
												connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 205');
													}else
													{	
														//tạo Base mới cho user dn lần đầu				
														if (rows.length<=0)
														{	
															//Lấy vị trí sau cùng của base mới tạo	
															connection.query("SELECT * FROM `userbase` where `Position`!='' ORDER BY `CreateTime` DESC LIMIT 1",function(error, rows,field)
													        {
																if (!!error){console.log('Error in the query 132');
																}else
																{
																	lastPosition=rows[0].Position;	
																	//Lấy position của những base khác không phải là base của user đăng nhập
									                				connection.query("SELECT `Position` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' AND `Position`!=''",function(error, rows,field)
																	{
																		if (!!error){console.log('Error in the query 133');
																		}else
																		{
																			for (var i = 0; i < rows.length; i++)
																			{											
																				arrayAllUserposition.push(rows[i].Position);
																	        }
																	        //Lấy position của user asset và unit in location để tạo base mới không trùng
																			connection.query("SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE 1",function(error, rows,field)
																			{
																				if (!!error){console.log('Error in the query 177');
																				}else
																				{
																					for (var i = 0; i < rows.length; i++)
																					{
																        				arrayAllMinePosition.push(rows[i].Position);
																			        }
																			        var arr = lastPosition.split(",");																								
																					var i = functions.getRandomIntInclusive(1,8), M=0;												
																					arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
																					newLocation = functions.getNewLocation(arr[0],arr[1],i,M);																																			
																					while(arrayAllMineMerger.indexOf(newLocation)>=1)
																					{														
																						i = functions.getRandomIntInclusive(1,8);
																						newLocation = functions.getNewLocation(arr[0],arr[1],i,M);														
																					}
																					arrayAllMineMerger.push(newLocation);

																					//thêm Base mới tạo
																					connection.query("SELECT * FROM `resourcebuybase` WHERE `numberBase` = 0",function(error, rows,field)
																					{
																						if (!!error){console.log('Error in the query 215');
																						}else
																						{													
																							if (rows.length > 0)
																							{																												
																								//insert Base mới tạo
																								connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `MaxStorage`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`) VALUES ('"
																									+""+"','"+currentUser.name+"','"+10000+"','"+newLocation+"','"+1+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady+"','"+createPositionTimelast+"','"+rows[0].numberBase+"','"+0+"','"+1+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"')",function(error, result, field)
																								{
																						            if(!!err){console.log('insert thất bại 216');}
																						        });														
																							}
																						}
																					});

																			        
																				}
																			})
																		}
																	})								
																}
															})										
															
														}										
													}
												});
											//#endregion

											//Cập nhật online cho user
											connection.query('UPDATE unitinlocations SET CheckOnline = 1 WHERE UserName = ?', [currentUser.name],function(error, result, field)
											{
												if(!!error){console.log('Error in the query 188');}
											});	

											//cập nhật thời gian login
											connection.query("UPDATE users SET timeLogin = ?,idSocket=?,timeLogout =? WHERE UserName = ?", [createPositionTimelast,socket.id,0, currentUser.name],function(error, result, field)
											{													
												if(!!error){console.log('Error in the query 2067');}
												
											});
											//cập nhật guild											
											connection.query("UPDATE guildlistmember SET Status = 1 WHERE MemberName = '"+currentUser.name+"'",function(error, result, field)
											{													
												if(!!error){console.log('Error in the query 206');
												}
											});												             							               
							                resolve(); 
							            }, timeout)
							        }).then(() => {
							            return new Promise((resolve,reject) => {
							              setTimeout(() => {							              	
											//#region Kiểm tra có user nào đăng nhập trùng không						
												if ( (lodash.filter(clients, x => x.name === currentUser.name)).length > 0) 
												{
													for (var i = 0; i < clients.length; i++) 
													{										
														if (clients[i].name===currentUser.name) 
														{										
															console.log("=================================duplicate to client");										
															socket.broadcast.to(clients[i].idSocket).emit('R_CHECK_DUPLICATE_LOGIN',
															{
																checkDuplicateLogin:0,
										                	});
										                	clients.splice(i,1);
														}
													}
												}
											//#endregion

											//#region lấy thời gian 	
												//Lấy thời gian gửi farm từ base đến unit đang còn
											/*	connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName`='"+currentUser.name+"' AND `TransferCompleteTotalTime`>0",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 205');
													}else
													{
														if (rows.length>0) 
														{												
															arrayTimeTransferFarmfromBaseToUnit = rows;											
														}
													}
												})*/
												getarrayTimeTransferFarmfromBaseToUnit(currentUser.name, function getLoginarrayTimeTransferFarmfromBaseToUnit(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayTimeTransferFarmfromBaseToUnit = data;						            
													}    
												});


											//#endregion													
																		
											//#region Guild
												//danh sách yêu cầu tham gia guild của user
												getarrayRequestJoinGuild(currentUser.name, function getLoginarrayRequestJoinGuild(err,dataGuild)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{
														if (dataGuild.length >0) 
														{	
						    								if (dataGuild[0].ActiveStatus===1||dataGuild[0].ActiveStatus===2) 
						    								{
						    									arrayRequestJoinGuild = dataGuild;						    								
						    									//danh sách membe của guild			
						    									//cập nhật tình trạng online của member in guild						    																									
																connection.query("UPDATE guildlistmember SET Status = 1, TimeDetail = '"+datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentUser.name
																				+"'AND GuildName = '"+dataGuild[0].GuildName+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 137');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{																		
																			//Dữ Liệu Leader/Co_Leader đã mời những người nào
																			/*connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
																	        {
																				if (!!error){console.log('Error in the query 139');
																				}else
																				{
																					if (rows.length >0) 
																					{
																						arrayAllInviteByGuild=rows;
																					}
																				}
																			});*/

																			getarrayAllInviteByGuild(dataGuild[0].GuildName, function getLoginarrayAllInviteByGuild(err,data)
																			{
																				if (err) {	console.log("ERROR ======: ",err);            
																				} else 
																				{            
																					arrayAllInviteByGuild = data;						            
																				}    
																			});

																			//dữ liệu policy
																			/*connection.query("SELECT * FROM `policys` where GuildName='"+rows[0].GuildName+"'",function(error, rows,field)
																	        {
																				if (!!error){console.log('Error in the query 140');
																				}else
																				{
																					if (rows.length >0) 
																					{
																						arrayPolicy = rows;
																					}
																					
																				}
																			})*/

																			getarrayPolicy(dataGuild[0].GuildName, function getLoginarrayPolicy(err,data)
																			{
																				if (err) {	console.log("ERROR ======: ",err);            
																				} else 
																				{            
																					arrayPolicy = data;						            
																				}    
																			});


																			//kiểm tra tình trạng online guild member
																			connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+dataGuild[0].GuildName+"'",function(error, rows,field)
																			{
																				if (!!error){console.log('Error in the query 141');
																				}else
																				{
																					if (rows.length>0) 
																					{
																						arrayNotisyStatus = rows;																																			
																						for (var i = 0; i < arrayNotisyStatus.length; i++) 
																				  		{																	  			
																				  			if ((lodash.filter(clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
																				  			{	
																				  				console.log("Gui len user===================: "+ arrayNotisyStatus[i].MemberName+"_"+clients[clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket);																  			
																			  					io.in(clients[clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('R_STATUS',
																								{
																									Status : 1,
																									TimeDetail : datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
																									UserName : currentUser.name,																																							
																			                	});																  													  															  								                	
																				  			}													  							  			
																				  		}			 
																					}
																				}
																			})
																			//dữ liệu của toàn bộ thành viên guild
																			/*connection.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+rows[0].GuildName+"'",function(error, rows,field)
																	        {
																				if (!!error){console.log('Error in the query 138');
																				}else
																				{
																					if (rows.length >0) 
																					{
																						arrayAllMemberGuild = rows;
																					}															
																				}
																			})*/

																			getarrayAllMemberGuild(dataGuild[0].GuildName, function getLoginarrayAllMemberGuild(err,data)
																			{
																				if (err) {	console.log("ERROR ======: ",err);            
																				} else 
																				{            
																					arrayAllMemberGuild = data;						            
																				}    
																			});

																			//Cập nhật tình trạng đóng góp cho guild
																			connection.query("SELECT * FROM `guildlistmember` WHERE MemberName = '"+currentUser.name+"'",function(error, rows,field)
																			{
																				if (!!error){console.log('Error in the query 142');
																				}else
																				{
																					if (rows.length>0) 
																					{																						
																						var TimeRemain = 0;
																						if (parseFloat(rows[0].TimeComplete) >parseFloat(createPositionTimelast)) 
																						{
																							TimeRemain = (parseFloat(rows[0].TimeComplete)-parseFloat(createPositionTimelast));
																						}																						
				        																connection.query("UPDATE guildlistmember SET TimeRemain = '"+ parseFloat(TimeRemain)
				        																	+"' where MemberName = '"+currentUser.name+"'",function(error, result, field)
																						{
																							if(!!error){console.log('Error in the query 143');
																							}else
																							{
																								//cập nhật lại thoi gian đóng góp
																								connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
																						        {
																									if (!!error){console.log('Error in the query 136');
																									}else
																									{
																										if (rows.length >0) 
																										{
																											arrayRequestJoinGuild = rows;																										
																										}
																									}
																								});																								
																							}
																						});					        																																				 
																					}
																				}
																			})
																		}
																	}
																})

																connection.query("SELECT TimeCancelGuild FROM `users` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
						        								{
						        									if (!!error) {console.log("Error in the query 145-1");}
						        									else
						        									{
						        										if (rows.length>0) 
						        										{
						        											//hien thi tin nhan chua xem của guild
																			/*connection.query("SELECT * FROM `chatting` WHERE `GuildName`='"+arrayRequestJoinGuild[0].GuildName+"' AND `ServerTime` >= '"+parseFloat(rows[0].TimeCancelGuild)+"' ",function(error, rows,field)
																			{
																				if (!!error){console.log('Error in the query 145');																
																				}else
																				{											
																					if (rows.length > 0) 
																					{           					    				            		
																						arrayMessGuildMember =rows;											  						       		                													  						            		
																	            	}
																	            }
																	        }); */

																	        getarrayMessGuildMember(arrayRequestJoinGuild[0].GuildName, parseFloat(rows[0].TimeCancelGuild), function getLoginarrayMessGuildMember(err,data)
																			{
																				if (err) {	console.log("ERROR ======: ",err);            
																				} else 
																				{            
																					arrayMessGuildMember = data;						            
																				}    
																			});
						        										}
						        									}
						        								})																											       											         																	
						    								}else
						    								{
						    									if ( parseFloat(createPositionTimelast)>=parseFloat(dataGuild[0].TimeReset) 
						    										&&(dataGuild[0].ActiveStatus===0))   
																{
																	connection.query("DELETE FROM guildlistmember WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, result, field)
																  	{
																		if(!!error){console.log('Error in the query 149');
																		}else
																		{
																			if(result.affectedRows>0)
																			{																		
																				arrayRequestJoinGuild =[];																				
																			}
																		}
																	})																																						
																}else
																{												
																	arrayRequestJoinGuild = dataGuild;																	
																}
						    								}   																																
														}else
														{
															arrayRequestJoinGuild =[];															
														}										
													}   
												});

												

												//dữ liệu tất cả các guild đã mời user									
												/*connection.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`!='' AND MemberName = '"+currentUser.name+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 151');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllRequestJoinGuildByUser=rows;
														}
													}
												});	*/

												getarrayAllRequestJoinGuildByUser(currentUser.name, function getLogingetarrayAllRequestJoinGuildByUser(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														getarrayAllRequestJoinGuildByUser = data;						            
													}    
												});													

												//dữ liệu nâng cấp guild
												/*connection.query("SELECT * FROM `resourceupguild` where 1",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 152');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupguild = rows;
														}										
													}
												})*/

												getarrayAllresourceupguild(function getLoginarrayAllresourceupguild(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupguild = data;						            
													}    
												});

												//dữ liệu toàn bộ các guild hiện tại
												/*connection.query("SELECT * FROM `guildlist` where 1",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 153');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllGuildList = rows;
														}														
													}
												})*/

												getarrayAllGuildList( function getLoginarrayAllGuildList(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllGuildList = data;						            
													}    
												});
											//#endregion

											//#region lấy dữ liệu black list
											 	//hien thi black list đã khóa user nào 
										      /*  connection.query("SELECT * FROM `blacklist` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 147');																			
													}else
													{											
														if (rows.length > 0) 
														{           					    				            		
															arrayBlackList =rows;
															console.log("arrayBlackList: "+ arrayBlackList.length);											  						       		                													  						            	
										            	}
										            }
										        }); */

										        getarrayBlackList(currentUser.name, function getLoginarrayBlackList(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayBlackList = data;						            
													}    
												});

										        //hien thi black list đã bị khóa bởi user nào
										       /* connection.query("SELECT * FROM `blacklist` WHERE `WithUserName`='"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 148');																			
													}else
													{											
														if (rows.length > 0) 
														{           					    				            		
															arrayBlockedBlackListByUser = rows;																		
										            	}
										            }
										        });*/

										        getarrayBlockedBlackListByUser(currentUser.name, function getLoginarrayBlockedBlackListByUser(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayBlockedBlackListByUser = data;						            
													}    
												});
											//#endregion

											//#region dữ liệu mua, trao đổi và nâng cấp
												//dữ liệu mua base
												/*connection.query("SELECT * FROM `resourcebuybase` where 1",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 154');
													}else
													{
														if (rows.length >0) 
														{												
															arrayAllresourcebuybase = rows;
														}										
													}
												})*/

												getarrayAllresourcebuybase(function getLoginarrayAllresourcebuybase(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourcebuybase = data;						            
													}    
												});

												//lấy dữ liệu mua unit
												/*connection.query("SELECT * FROM `resourcebuyunit` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 181');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayAllresourcebuyunit.push(rows[i]);
												        }								       
													}
												})*/

												getarrayAllresourcebuyunit(function getLoginarrayAllresourcebuyunit(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++)
														{
									        				arrayAllresourcebuyunit.push(data[i]);
												        }						            
													}    
												});

												//dữ liệu đổi tài nguyên thành kim cương
												/*connection.query("SELECT * FROM `resourcetodiamond` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 134');
													}else
													{
														arrayAllResourceToDiamond = rows;								        
													}
												})	*/

												getarrayAllResourceToDiamond(function getLoginarrayAllResourceToDiamond(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllResourceToDiamond = data;						            
													}    
												});

												//dữ liệu nâng cấp city
												/*connection.query("SELECT * FROM `resourceupcity` where 1",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 135');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupbase = rows;
														}										
													}
												})*/

												getarrayAllresourceupbase(function getLoginarrayAllresourceupbase(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupbase = data;						            
													}    
												});

				                				//dữ liệu nâng cấp Swordman
												/*connection.query("SELECT * FROM `resourceupswordman` where 1",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 156');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupSwordman = rows;
														}																				
													}
												})*/

												getarrayAllresourceupSwordman(function getLoginarrayAllresourceupSwordman(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupSwordman = data;						            
													}    
												});

												//dữ liệu nâng cấp Farm
												/*connection.query("SELECT * FROM `resourceupfarm` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 157');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupFarm=rows;											
														}																				
													}
												})*/

												getarrayAllresourceupFarm(function getLoginarrayAllresourceupFarm(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupFarm = data;						            
													}    
												});

												//dữ liệu nâng cấp Wood
												/*connection.query("SELECT * FROM `resourceupwood` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 158');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupWood=rows;																				
														}																				
													}
												})*/

												getarrayAllresourceupWood(function getLoginarrayAllresourceupWood(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupWood = data;						            
													}    
												});												

												//dữ liệu nâng cấp Stone
												/*connection.query("SELECT * FROM `resourceupstone` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 159');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupStone=rows;
														}																				
													}
												})*/

												getarrayAllresourceupStone(function getLoginarrayAllresourceupStone(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupStone = data;						            
													}    
												});

												//dữ liệu nâng cấp Metal
												/*connection.query("SELECT * FROM `resourceupmetal` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 160');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupMetal=rows;
														}																				
													}
												})*/

												getarrayAllresourceupMetal(function getLoginarrayAllresourceupMetal(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupMetal = data;						            
													}    
												});

												//dữ liệu nâng cấp Bowman
												/*connection.query("SELECT * FROM `resourceupBowman` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 161');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupBowman=rows;
														}																				
													}
												})*/

												getarrayAllresourceupBowman(function getLoginarrayAllresourceupBowman(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupBowman = data;						            
													}    
												});

												//dữ liệu nâng cấp Granary
												//connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`, CONVERT(`MaxStorage`, CHAR(50)) as `MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
												/*connection.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`,`MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 162');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupGranary=rows;
														}																				
													}
												})*/

												getarrayAllresourceupGranary(function getLoginarrayAllresourceupGranary(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupGranary = data;						            
													}    
												});

												//dữ liệu nâng cấp Market
												/*connection.query("SELECT * FROM `resourceupMarket` where 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 163');
													}else
													{
														if (rows.length >0) 
														{
															arrayAllresourceupMarket=rows;
														}																				
													}
												})	*/

												getarrayAllresourceupMarket(function getLoginarrayAllresourceupMarket(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayAllresourceupMarket = data;						            
													}    
												});							
											//#endregion

											//#region lấy position			
												//lấy thông tin postion của tất user asset
												/*connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 179');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayAllMinepositionTrue.push(rows[i]);
												        }								       
													}
												})*/

												getarrayAllMinepositionTrue(function getLoginarrayAllMinepositionTrue(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++)
														{
									        				arrayAllMinepositionTrue.push(data[i]);
												        }				            
													}    
												});

												//lấy position của user base hiện tại và base tài nguyên
												connection.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 190');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
										    				arraycheckUserlg.push(rows[i]);
												        }								       
													}
												})									
											//#endregion

											//#region Friend
												//danh sách các user đã kết bạn
												/*connection.query("SELECT  `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
													+"' AND `ActiveStatus` =1 UNION ALL SELECT  `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
													+"' AND `ActiveStatus` =1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 183');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayAddedFriend.push(rows[i]);
												        }								       
													}
												})*/

												getarrayAddedFriend(currentUser.name, function getLoginarrayAddedFriend(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           															
														for (var i = 0; i < data.length; i++)
														{
									        				arrayAddedFriend.push(data[i]);
												        }					            
													}    
												});

												//danh sách những user hủy kết bạn
												/*connection.query("SELECT  * FROM `addfriend` WHERE `UserNameFriendB` = '"+currentUser.name
													+"' AND  `ActiveStatus` =2 UNION ALL SELECT  * FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name
													+"' AND  `ActiveStatus` =2",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 184');
													}else
													{																					
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayCancelFriend.push(rows[i]);
												        }
												       
													}
												})*/

												getarrayCancelFriend(currentUser.name, function getLoginarrayCancelFriend(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++)
														{
									        				arrayCancelFriend.push(data[i]);
												        }					            
													}    
												});

												//danh sách lời mời kết bạn được user khác gửi cho user đăng nhập hiện tại
												/*connection.query("SELECT `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 185');
													}else
													{														
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayWaitedFriend.push(rows[i]);
												        }								       
													}
												})*/

												getarrayWaitedFriend(currentUser.name, function getLoginarrayWaitedFriend(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           														
														for (var i = 0; i < data.length; i++)
														{
									        				arrayWaitedFriend.push(data[i]);
												        }					            
													}    
												});

												//danh sách lời mời kết bạn được user đăng nhập hiện tại gửi cho user khác
												/*connection.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 186');
													}else
													{																					
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayWaitingFriend.push(rows[i]);
												        }								       
													}
												})	*/

												getarrayWaitingFriend(currentUser.name, function getLoginarrayWaitingFriend(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           
														
														for (var i = 0; i < data.length; i++)
														{
									        				arrayWaitingFriend.push(data[i]);
												        }					            
													}    
												});
								
											//#endregion	

											//#region Chatting private
												//hien thi tin nhan chua xem của private
										      /*  connection.query("SELECT * FROM `chatting` WHERE `ToUserName`='"+currentUser.name+"' AND `CheckCloseMessPrivate` = 1 ",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 146');																			
													}else
													{											
														if (rows.length > 0) 
														{           					    				            		
															arrayMessPrivateMember =rows;											  						       		                													  						            		
										            	}
										            }
										        });*/

										        getarrayMessPrivateMember(currentUser.name, function getLoginarrayMessPrivateMember(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayMessPrivateMember = data;						            
													}    
												});
											//#endregion	
												
											//#region lấy dữ liệu cần cho user đăng nhập
												//Lấy dữ liệu tất cả các user base hiện tại
												/*connection.query("SELECT * FROM `userbase` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 178');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayBaseResource.push(rows[i]);
												        }								       
													}
												})	*/	

												getarrayBaseResource(function getLoginarrayBaseResource(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           																
														for (var i = 0; i < data.length; i++)
														{
									        				arrayBaseResource.push(data[i]);
												        }				            
													}    
												});															

												//lấy dữ liệu toàn bộ user
												/*connection.query("SELECT * FROM `users` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 182');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{
									        				arrayAllUsers.push(rows[i]);
												        }								       
													}
												})*/


												getarrayAllUsers(function getLoginarrayAllUsers(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++)
														{
									        				arrayAllUsers.push(data[i]);
												        }					            
													}    
												});

												//Lấy thông tin user đăng nhập
												/*connection.query("SELECT * FROM `users` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 131');
													}else
													{						
														if (rows.length>0)
														{								
															arrayUserLogin = rows;	
														}
													}
												});*/

												getarrayUserLogin(currentUser.name, function getLoginarrayUserLogin(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														arrayUserLogin = data;						            
													}    
												});

												//Lấy toàn bộ unit location của tất cả user
												/*connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 196');
													}else
													{												
														for (var i = 0; i < rows.length; i++)
														{
							                				arrayAllUnitLocationsComplete.push(rows[i]);
												        }
													}										
												})*/

												getarrayAllUnitLocationsComplete(function getLoginarrayAllUnitLocationsComplete(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           														
														for (var i = 0; i < data.length; i++)
														{
							                				arrayAllUnitLocationsComplete.push(data[i]);
												        }					            
													}    
												});

												//Lấy unit location của user đăng nhập
											/*	connection.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 197');
													}else
													{													
														for (var i = 0; i < rows.length; i++)
														{
								            				arrayUnitLocationsComplete.push(rows[i]);
												        }												      
												    }
												})*/

												getarrayUnitLocationsComplete(currentUser.name, function getLoginarrayUnitLocationsComplete(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++)
														{
								            				arrayUnitLocationsComplete.push(data[i]);
												        }						            
													}    
												});

												//Lấy thông tin unit in base của user đăng nhập
												/*connection.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 208');
													}else
													{																				
														for (var i = 0; i < rows.length; i++) 
														{
							                				arrayUnitBaseUser.push(rows[i]);
												        }								       
													}
												});	*/

												getarrayUnitBaseUser(currentUser.name, function getLoginarrayUnitBaseUser(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
																
														for (var i = 0; i < data.length; i++) 
														{
							                				arrayUnitBaseUser.push(data[i]);
												        }			            
													}    
												});

												//Lấy toàn bộ thông tin của unit mua chưa hoàn tất thời gian
												/*connection.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 209');
													}else
													{
														for (var i = 0; i < rows.length; i++) 
														{
							                				arrayUnitWaitBaseUser.push(rows[i]);
												        }								        
													}
												});*/

												getarrayUnitWaitBaseUser(currentUser.name, function getLoginarrayUnitWaitBaseUser(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{           														
														for (var i = 0; i < data.length; i++) 
														{
							                				arrayUnitWaitBaseUser.push(data[i]);
												        }					            
													}    
												});

												//Lấy thông tin user base của user đăng nhập
												/*connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 210');
													}else
													{																																																							
														if (rows.length>0)
														{																									
															for (var i = 0; i < rows.length; i++) 
															{
							                					arrayBaseUser.push(rows[i]);
												        	}								        																									
														}
													}
												});	*/

												getarrayBaseUser(currentUser.name, function getLoginarrayBaseUser(err,data)
												{
													if (err) {	console.log("ERROR ======: ",err);            
													} else 
													{            
														for (var i = 0; i < data.length; i++) 
														{
						                					arrayBaseUser.push(data[i]);
											        	}						            
													}    
												});

												//gửi thông tin toàn bộ user lên user đang đăng nhập
												connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 212');
													}else
													{
														if (rows.length>0) 
														{
															arrayOnlineStatus = rows;																																			
															for (var i = 0; i < arrayOnlineStatus.length; i++) 
													  		{
													  			if ((lodash.filter(clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
													  			{	
												  					io.in(clients[clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('R_STATUS_FOR_ALL',
																	{
																		Status : 1,	
																		UserName : currentUser.name,
																		idUnitInLocations: arrayUnitLocationsComplete,																																																					
												                	});																										  													  															  								                	
													  			}													  							  			
													  		}			 
														}
													}
												})
											//#endregion	

											//#region cập nhật redis
												//Cập nhật thông tin unit in location của user đăng nhập cho redis
												connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query211');
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

												//cập nhật bạn của nhau trong redis
												connection.query("SELECT `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus` FROM `addfriend` WHERE `ActiveStatus`=1",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 187');
													}else
													{
														for (var i = 0; i < rows.length; i++)
														{														
															//update resid															        					
								        					client.set(rows[i].UserNameFriendA+rows[i].UserNameFriendB,JSON.stringify(rows[i]));			        																											
												        }	
												    }
												});	
											//#endregion
											               							               
							                resolve(); 
							              }, timeout)
							            });
							        }).then(() => {
							            return new Promise((resolve,reject) => {
							              setTimeout(() => {  							              	
											//cập nhật user cho mảng client																			        																									        
											clients.push(currentUser);
									        connection.release();
									        console.log("User: "+currentUser.name +" id socket: "+socket.id+" has connected at: "+datetime.create().format('H:M:S d-m-Y'));										        							       

									        //Gửi tất cả thông tin cần thiết để đăng nhập									       
									        socket.emit('R_LOGIN_SUCCESS',
											{
						                    	message : '1',
						                    	arrayTimeTransferFarmfromBaseToUnit:arrayTimeTransferFarmfromBaseToUnit,
						                    	arrayAllUsers: arrayAllUsers,
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
						                    	arrayAllresourceupSwordman:arrayAllresourceupSwordman,
						                    	arrayAllresourceupFarm:arrayAllresourceupFarm,
												arrayAllresourceupWood:arrayAllresourceupWood,
												arrayAllresourceupStone:arrayAllresourceupStone,
												arrayAllresourceupMetal:arrayAllresourceupMetal,
												arrayAllresourceupBowman:arrayAllresourceupBowman,
												arrayAllresourceupGranary:arrayAllresourceupGranary,												
												arrayAllresourceupMarket:arrayAllresourceupMarket,
											});								              
							                
							                resolve(); 
							              }, timeout)
							            });
							        });
							    }
							    k.reduce((promise, item) => {
							      return promise.then(() => asyncFunc(item));
							    }, Promise.resolve())	
							}else
							{	
								//user hoặc mật khẩu không đúng	
								console.log("Username hoặc mật khẩu chưa đúng")
								connection.release();				
								socket.emit('R_LOGIN_SUCCESS',
								{
			                    	message : '0',			                    	
			                	});
							}
						}
					})
			    });																
			});        	      	
        });
    }
}

function getCurrentUser (data,shortId,socket) {
 return currentUser =
 {
  name:data.name,
  password:data.password,
  modelDevide: data.modelDevide, 
  ramDevide: data.ramDevide,   
  id:shortId.generate(),    
  idSocket:socket.id,
 }
}

function getNewLocationClick(X,Z,N,M)
{
    numberDistance = parseInt(N,parseN);
    X = parseInt(X, parseN);
    Z = parseInt(Z, parseN);
    switch(M)
    {
        //random theo đường thẳng
        case 1:
            if(X>=0 && X<=(limitNumber - numberDistance))
            {
                X = X + numberDistance;
            }
            break;            
        case 2:
            if(X>=numberDistance && X<=limitNumber)
            {
                X = X - numberDistance;
            }
            break;
        case 3:
            if(Z <= -numberDistance && Z>=-limitNumber)
            {
                Z = Z + numberDistance;
            }
            break;
        case 4:
            if(Z<=0 && Z>=(-limitNumber + numberDistance))
            {
                Z = Z - numberDistance;
            }
            break;

        //random theo đường chéo
        case 5:
            if(X>=0 && X<=(limitNumber -numberDistance))
            {
                X = X + numberDistance;
            }
            if(Z<=0 && Z>=(-limitNumber + numberDistance))
            {
                Z = Z - numberDistance;
            }
            break;
        case 6:
            if(X>=0 && X<=(limitNumber - numberDistance))
            {
                X = X + numberDistance;
            }
            if(Z <= -numberDistance && Z>=-limitNumber)
            {
                Z = Z + numberDistance;
            }
            break;
        case 7:
            if(X>=numberDistance && X<=limitNumber)
            {
                X = X - numberDistance;
            }
            if(Z <= -numberDistance && Z>=-limitNumber)
            {
                Z = Z + numberDistance;
            }
            break;
        case 8:
            if(X>= numberDistance && X<=limitNumber)
            {
                X = X - numberDistance;
            }
            if(Z<=0 && Z>=(-limitNumber + numberDistance))
            {
                Z = Z - numberDistance;
            }
            break;
    }
    return X+","+Z;
}

function GameServer() 
{		    
    this.clients = clients;	  			    
    this.currentUser = currentUser;
    this.redisarray = redisarray; 			    		   	    
}	

function getarrayTimeTransferFarmfromBaseToUnit(UserName,callback) 
{   
    var query = pool.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName`='"+UserName+"' AND `TransferCompleteTotalTime`>0",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayTimeTransferFarmfromBaseToUnit: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllUsers(callback) 
{   
    var query = pool.query("SELECT * FROM `users` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllUsers");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayMessGuildMember(GuildName, TimeCancelGuild, callback) 
{   
    var query = pool.query("SELECT * FROM `chatting` WHERE `GuildName`='"+GuildName+"' AND `ServerTime` >= '"+parseFloat(TimeCancelGuild)+"' ",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayMessGuildMember: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayMessPrivateMember(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `chatting` WHERE `ToUserName`='"+UserName+"' AND `CheckCloseMessPrivate` = 1 ",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayMessPrivateMember: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayBlackList(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `blacklist` WHERE `UserName`='"+UserName+"'",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayBlackList: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayBlockedBlackListByUser(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `blacklist` WHERE `WithUserName`='"+UserName+"'",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayBlockedBlackListByUser: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllResourceToDiamond(callback) 
{   
    var query = pool.query("SELECT * FROM `resourcetodiamond` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllResourceToDiamond: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayPolicy(GuildName,callback) 
{   
    var query = pool.query("SELECT * FROM `policys` where GuildName='"+GuildName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayPolicy: "+GuildName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayUserLogin(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `users` WHERE `UserName`='"+UserName+"'",function(error, rows,field)
    {	
        if (error) {
            console.log("Error in the query getarrayUserLogin: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllInviteByGuild(GuildName,callback) 
{   
    var query = pool.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND GuildName = '"+GuildName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllInviteByGuild: "+GuildName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllRequestJoinGuildByUser(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`!='' AND MemberName = '"+UserName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllRequestJoinGuildByUser: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllMemberGuild(GuildName,callback) 
{   
    var query = pool.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+GuildName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllMemberGuild: "+GuildName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayRequestJoinGuild(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND MemberName = '"+UserName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayRequestJoinGuild: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllGuildList(callback) 
{   
    var query = pool.query("SELECT * FROM `guildlist` where 1",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllGuildList");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}
		
function getarrayAllresourceupguild(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupguild` where 1",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllresourceupguild: ");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourcebuybase(callback) 
{   
    var query = pool.query("SELECT * FROM `resourcebuybase` where 1",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllresourcebuybase: ");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayWaitingFriend(UserName,callback) 
{   
    var query = pool.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA`='"+UserName+"' AND `ActiveStatus`=0",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayWaitingFriend: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayWaitedFriend(UserName,callback) 
{   
    var query = pool.query("SELECT `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB`='"+UserName+"' AND `ActiveStatus`=0",function(error, rows,field)
	{		
        if (error) {
            console.log("Error in the query getarrayWaitedFriend: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAddedFriend(UserName,callback) 
{   
    var query = pool.query("SELECT  `UserNameFriendA` FROM `addfriend` WHERE `UserNameFriendB` = '"+UserName
		+"' AND `ActiveStatus` =1 UNION ALL SELECT  `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA` = '"+UserName
		+"' AND `ActiveStatus` =1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAddedFriend: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayCancelFriend(UserName,callback) 
{   
    var query = pool.query("SELECT  * FROM `addfriend` WHERE `UserNameFriendB` = '"+UserName
		+"' AND  `ActiveStatus` =2 UNION ALL SELECT  * FROM `addfriend` WHERE `UserNameFriendA` = '"+UserName
		+"' AND  `ActiveStatus` =2",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayCancelFriend: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllMinepositionTrue(callback) 
{   
    var query = pool.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllMinepositionTrue ");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayBaseResource(callback) 
{   
    var query = pool.query("SELECT * FROM `userbase` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayBaseResource");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayBaseUser(UserName,callback) 
{   
    var query = pool.query("SELECT * FROM `userbase` WHERE `UserName`='"+UserName+"'",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayBaseUser: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayUnitBaseUser(UserName,callback) 
{   
    var query = pool.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+UserName+"'",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayUnitBaseUser: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayUnitWaitBaseUser(UserName,callback) 
{   
    var query = pool.query("SELECT  `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0
    	+"' AND `UserName` ='"+UserName+"'",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayUnitWaitBaseUser: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayUnitLocationsComplete(UserName,callback) 
{   
    var query = pool.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE `UserName` = '"+UserName+"'",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayUnitLocationsComplete: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllUnitLocationsComplete(callback) 
{   
    var query = pool.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `FarmPortable`, `Health`, `HealthEach`, `HealthRemain`, `Damage`, `DamageEach`, `Defend`, `DefendEach`, `FarmEach`, `FarmWait`, `FarmTransferCompleteTime`, `TransferCompleteTotalTime`, `numberBaseTransfer`,  `PositionLogin` as `Position`, `Level`, `PositionClick`, `MoveSpeedEach`, `TimeCheck`, `timeClick`, `CheckLog`, `CheckOnline`, `CheckCreate`, `TimeFight`, `CheckFight`, `userFight`, `FightRadius`, `FightRadiusPosition`, `FightRadiusPosition1`, `FightRadiusPosition2`, `DistanceMoveLogoff`, `CheckMove`, `TimeMoveComplete`, `TimeMoveTotalComplete`, `CheckMoveOff`, `TimeSendToClient` FROM `unitinlocations` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllUnitLocationsComplete");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourcebuyunit(callback) 
{   
    var query = pool.query("SELECT * FROM `resourcebuyunit` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourcebuyunit: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupbase(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupcity` where 1",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllresourceupbase");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupSwordman(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupswordman` where 1",function(error, rows,field)
    {
        if (error) {
            console.log("Error in the query getarrayAllresourceupSwordman");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}
										
function getarrayAllresourceupFarm(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupfarm` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupFarm");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupWood(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupwood` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupWood");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupStone(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupstone` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupStone");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupMetal(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupmetal` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupMetal ");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupBowman(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupBowman` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupBowman");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupGranary(callback) 
{   
    var query = pool.query("SELECT `idresourceupGranary`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `Diamond`, `TimeUp`,`MaxStorage`   FROM `resourceupgranary` WHERE 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupGranary");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}

function getarrayAllresourceupMarket(callback) 
{   
    var query = pool.query("SELECT * FROM `resourceupMarket` where 1",function(error, rows,field)
	{
        if (error) {
            console.log("Error in the query getarrayAllresourceupMarket");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                callback(null,rows);           
            }
        }
    }); 
}