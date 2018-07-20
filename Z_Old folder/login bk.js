'use strict';
var pool = require('./db');
const nodemailer 	= require('nodemailer');
var lodash		    = require('lodash');
var functions 		= require("./functions");
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var cron 			= require('node-cron');
var shortId 		= require('shortid');
var datetime 		= require('node-datetime');
var client 			= require('./redis');
var d,createPositionTimelast, clients = [],redisarray = [], lastPosition="",checkResetMine,timeSend=0,hourReset=0,minuteReset = 0,secondReset=0,
MineHarvestServer=0, arrayRequestJoinGuild=[], parseN = 10, numberDistance,limitNumber = 200;

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {   				
			var newLocation ="",idUnitInLocationstemp,X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,HealthRemain,
				F="",S="",C="",timeResetMines,FarmTransferRemain=0, WoodTransferRemain=0, StoneTransferRemain=0, StoneTransferRemain=0, 
				FarmTransferSurpass=0,WoodTransferSurpass=0,arrayAllresourceupmine=[], StoneTransferSurpass=0,MetalTransferSurpass=0,
				FarmConsumeInOffline,FarmRemainInOnline, arrayUserLogin = [], arrayAllUser = [],arrayAllUserposition = [],
				arrayUserBaseResource = [],arrayAllPositionclick = [],arrayMineposition = [],arrayMineId = [], arrayAllMine = [], arrayAllMineName = [],
				arrayAllMinePosition = [], arrayAllMineMerger = [],arrayidResource =[],arrayBaseUser =[], arrayUnitBaseUser =[],arrayUnitWaitBaseUser =[],
				arrayAddedFriend=[],arrayCancelFriend =[],arrayWaitedFriend=[],	arrayAllresourcebuyunit =[],arraytest =[],arraycheckUserlg=[],arrayAllResourceToDiamond=[],
				arrayUnitLocationsComplete=[],arrayAllUnitLocationsComplete=[],arrayAllUnitLocationsCompletefirst=[], arrayAllresourceupbase = [],
				rrayAllresourceupmine = [],arrayAllresourceupSwordman = [],arrayAllresourceupFarm=[], arrayAllresourceupWood=[],arrayAllresourceupStone=[],
				arrayAllresourceupMetal=[],arrayAllresourceupBowman=[],	arrayAllresourceupGranary=[],arrayAllresourceupMarket=[], arrayAllresourceupCityWall=[],
				arrayAllresourceupHorseman=[],arrayAllresourceupTower=[],arrayAllresourceupSpearman=[],arrayAllresourceupShaman=[],arrayAllresourceupCrossbow=[],
				arrayAllresourceupBallista=[],arrayAllresourceupBatteringRam=[],arrayAllresourceupTrebuchet=[],arrayAllUsers=[],arrayWaitingFriend=[],
				arrayAllresourceupHorseArcher=[],arrayAllresourceupElephantArcher=[],arrayAllresourceupCavalry=[],arrayAllresourceupBattleElephant=[],
				arrayAllresourcebuybase=[],arrayAllresourceupguild=[],arrayAllGuildList=[],arrayAllRequestJoinGuildByUser=[],arrayAllMinepositionTrue = [],arrayBaseResource = [],
				arrayAllMemberGuild=[],arrayAllInviteByGuild=[],arrayTimeTransferFarmfromBaseToUnit=[],arrayPolicy=[],arrayNotisyStatus=[],
				arrayMessGuildMember=[],arrayMessPrivateMember=[],arrayBlackList=[],arrayBlockedBlackListByUser=[],currentUser,UserNameLogin,EmailLogin,PortLogin;			        	
        	function GameServer() 
        	{		    
			    this.clients = clients;	  			    
			    this.currentUser = currentUser;
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
			        //update infomation of devide
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

					//cập nhật thời gian reset mine
					var query = pool.query("SELECT DetailMore FROM `task` WHERE DetailTask ='ResetMine'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 387');
						}else
						{
							if (rows.length>0) 
							{									
								timeResetMines = rows[0].DetailMore;								 
							    var arr = timeResetMines.split(/\s+/);
							    hourReset = parseFloat(arr[2]);
							    minuteReset = parseFloat(arr[1]);
							    secondReset = parseFloat(arr[0]);											                												  															  								                														  							  							  					 
							}			

						}
					})

					//Update time buy unit in base
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
													            		//cập nhật lại quality wait
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
					
					//load data of user
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
										var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, secondReset);
										var resetMine = Math.floor(myToday.getTime() / 1000);

										//thời gian mỗi ngày reset công thêm 1 ngày
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
										connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
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
										//lấy dữ liệu mua unit
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

										//lấy dữ liệu toàn bộ user
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

										//lấy data những user hủy kết bạn
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

										//lấy position của user base hiện tại và base tài nguyên
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
						        						//update quality to unit in base
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
																	//insert vào quality vào unit in base																		
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
										
										//cập nhật thời gian gửi farm từ base đến unit
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
																										connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
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

																										        //cập nhật user cho mảng client																			        																									        
							    																				clients.push(currentUser);	

							    																				//gửi thông tin toàn bộ user lên user đang đăng nhập
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

																										        //Gửi thông tin cần thiết cho user đang đăng nhập
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
													newLocation =getNewLocation(arr[0],arr[1],i,M);																																			
													while(arrayAllMineMerger.indexOf(newLocation)>=1)
													{														
														i = functions.getRandomIntInclusive(1,8);
														newLocation =getNewLocation(arr[0],arr[1],i,M);														
													}
													arrayAllMineMerger.push(newLocation);

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
																															connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
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
																															        //cập nhật mảng cilent																				        																									        
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
													if ((rows[0].checkResetMine === 1) && (rows.length > 0))
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
										                		//cập nhật thời gian check reset mine
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
										var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, secondReset);
										var resetMine = Math.floor(myToday.getTime() / 1000);

										//thời gian mỗi ngày reset công thêm 1 ngày
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
										
										//lấy position của base	mới tạo sau cùng
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

										//lấy position userbase của user đăng nhập
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
																	//lấy thông tin thành viên của guild
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
																						}
																					});
			        															}else
			        															{
			        																connection.query("UPDATE guildlistmember SET TimeRemain = 0 where MemberName = '"+currentUser.name+"'",function(error, result, field)
																					{
																						if(!!error)
																						{
																							console.log('Error in the query 144');
																						}
																					});		        																
			        															}
																							 
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
															//cập nhật dữ liệu khi hết thời gian mới kết bạn
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

										//dử liệu của tất cả các mine đang có
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
										connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
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
																										connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
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
													newLocation =getNewLocation(arr[0],arr[1],i,M);
													while(arrayAllMineMerger.indexOf(newLocation)>=1)
													{
														i = functions.getRandomIntInclusive(1,8);
														newLocation =getNewLocation(arr[0],arr[1],i,M);
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
																															connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
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
        });
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

function getNewLocation(X,Z,N,M)
{
    if (M===0) {
        numberDistance = parseInt(functions.getRandomIntInclusive(2, 6),parseN);
    }else{
        numberDistance = parseInt(functions.getRandomIntInclusive(1, 4),parseN);
    }

    X = parseInt(X, parseN);
    Z = parseInt(Z, parseN);
    switch(N)
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

