'use strict';
var pool = require('./db');
var sqrt 			= require( 'math-sqrt' );
var cron 			= require('node-cron');
var math 			= require('mathjs');
var lodash		    = require('lodash');
var client 			= require('./redis');

var currentSENDRESOURCETRANSFER,d,createPositionTimelast,currentSENDRESOURCETRANSFERBASECOMPLETE,currentSENDRESOURCETRANSFERBASE,
currentSENDRESOURCETRANSFERBASEBASECOMPLETE,currentSENDUNITTRANSFERTOBASE,currentSENDRESOURCETRANSFERTOFRIEND,currentSENDRESOURCEFROMBASETRANSFERTOUNIT,
currentSENDUNITTRANSFERTOBASECOMPLETE,SendQualityFarm = 0, SendQualityWood = 0, SendQualityStone = 0, SendQualityMetal = 0,
SendRemainFarm = 0, SendRemainWood = 0, SendRemainStone = 0, SendRemainMetal =0,
ReciveQualityFarm = 0, ReciveQualityWood = 0, ReciveQualityStone = 0, ReciveQualityMetal = 0, 
ReciveRemainFarm = 0, ReciveRemainWood = 0, ReciveRemainStone = 0, ReciveRemainMetal = 0,arrX,arrZ,TimeCompleteResourceTransferBase,
TimeCompleteResourceTransferBaseFriend,TimeWaitResourceTransferBase,
FarmTransferRemain=0,WoodTransferRemain=0,StoneTransferRemain=0,MetalTransferRemain=0,
FarmTransferSurpass=0,WoodTransferSurpass=0,StoneTransferSurpass=0,MetalTransferSurpass=0,CountLimitNumberUnitTransfer=0,arrayClients=[];

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        { 
			socket.on('SENDRESOURCETRANSFER', function (data)
			{
				currentSENDRESOURCETRANSFER =
				{
					UserName:data.UserName,		
					numberBase:data.numberBase,	
					ResouceSendName:data.ResouceSendName,
					ResouceSendQuality:data.ResouceSendQuality,
					ResouceSendRemain:data.ResouceSendRemain,

					ResouceReciveName:data.ResouceReciveName,
					ResouceReciveQuality:data.ResouceReciveQuality,
					ResouceReciveRemain:data.ResouceReciveRemain,

					DiamondConsumption:data.DiamondConsumption,
					DiamondRemain:data.DiamondRemain,							
				}
				console.log("data receive SENDRESOURCETRANSFER: "+ currentSENDRESOURCETRANSFER.UserName+"_"				
						+"_"+currentSENDRESOURCETRANSFER.numberBase
						+"_"+currentSENDRESOURCETRANSFER.ResouceSendName
						+"_"+currentSENDRESOURCETRANSFER.ResouceSendQuality
						+"_"+currentSENDRESOURCETRANSFER.ResouceSendRemain+
						"_"+currentSENDRESOURCETRANSFER.ResouceReciveName+
						"_"+currentSENDRESOURCETRANSFER.ResouceReciveQuality+
						"_"+currentSENDRESOURCETRANSFER.ResouceReciveRemain+
						"_"+currentSENDRESOURCETRANSFER.DiamondConsumption+
						"_"+currentSENDRESOURCETRANSFER.DiamondRemain);
				pool.getConnection(function(err,connection)
				{		
					//var ResouceSendName =  "B."+currentSENDRESOURCETRANSFER.ResouceSendName, ResouceReciveName="B."+ResouceReciveName;		
					connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName WHERE A.UserName = '"+currentSENDRESOURCETRANSFER.UserName
						+"'AND B.numberBase = '"+parseFloat(currentSENDRESOURCETRANSFER.numberBase)+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdft434fh');
							socket.emit('RECIEVERESOURCETRANSFER', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{						
							if (rows.length > 0) 
							{
								switch(currentSENDRESOURCETRANSFER.ResouceSendName)
								{
									case "Farm":
										{
											if ((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCETRANSFER.ResouceSendQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain)
												&&(parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCETRANSFER.DiamondConsumption))===parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain)
												)
											{										
												switch(currentSENDRESOURCETRANSFER.ResouceReciveName)
												{											
													case "Wood":
														{
															if ((parseFloat(rows[0].Wood) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query1134346gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Farm&&Wood");
																		}else
																		{
																			console.log("update khong thanh cong Farm&&Wood");
																		}

																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Stone":
														{
															if ((parseFloat(rows[0].Stone) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query11f3434gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Farm&&Stone");
																		}else
																		{
																			console.log("update khong thanh cong Farm&&Stone");
																		}

																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Metal":
														{
															if ((parseFloat(rows[0].Metal) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Metal= '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query1134hgft34gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Farm&&Metal");
																		}else
																		{
																			console.log("update khong thanh cong Farm&&Metal");
																		}

																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;											
												}

											}else
											{
												socket.emit('RECIEVERESOURCETRANSFER', 
												{
						                    		message : 0
						                		});
												console.log("gửi mail");
											}									
										}
										break;
									case "Wood":
										{
											if ((parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCETRANSFER.ResouceSendQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain)
												&&(parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCETRANSFER.DiamondConsumption))===parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain)
												)
											{
												switch(currentSENDRESOURCETRANSFER.ResouceReciveName)
												{
													case "Farm":
														{
															if ((parseFloat(rows[0].Farm) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query11ty3434gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Wood&&farm");
																		}else
																		{
																			console.log("update khong thanh cong Wood&&farm");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;											
													case "Stone":
														{
															if ((parseFloat(rows[0].Stone) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query113434dfgfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Wood&&Stone");
																		}else
																		{
																			console.log("update khong thanh cong Wood&&Stone");
																		}

																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Metal":
														{
															if ((parseFloat(rows[0].Metal) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Metal= '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query11343gh4gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Wood&&Metal");
																		}else
																		{
																			console.log("update khong thanh cong Wood&&Metal");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;											
												}

											}else
											{
												socket.emit('RECIEVERESOURCETRANSFER', 
												{
						                    		message : 0
						                		});
												console.log("gửi mail");
											}									
										}
										break;
									case "Stone":
										{
											if ((parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCETRANSFER.ResouceSendQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain)
												&&(parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCETRANSFER.DiamondConsumption))===parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain)
												)
											{		                		
												switch(currentSENDRESOURCETRANSFER.ResouceReciveName)
												{
													case "Farm":
														{
															if ((parseFloat(rows[0].Farm) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query11uyu3434gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Stone&&farm");
																		}else
																		{
																			console.log("update khong thanh cong Stone&&farm");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Wood":
														{
															if ((parseFloat(rows[0].Wood) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query1134wea34gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Stone&&Wood");
																		}else
																		{
																			console.log("update khong thanh cong Stone&&Wood");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;											
													case "Metal":
														{
															if ((parseFloat(rows[0].Metal) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Metal= '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query113434gfkjlafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Stone&&Metal");
																		}else
																		{
																			console.log("update khong thanh cong Stone&&Metal");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;										
												}
											}else
											{
												socket.emit('RECIEVERESOURCETRANSFER', 
												{
						                    		message : 0
						                		});
												console.log("gửi mail");
											}																	
										}
										break;
									case "Metal":
										{
											if ((parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCETRANSFER.ResouceSendQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain)
												&&(parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCETRANSFER.DiamondConsumption))===parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain)
												)
											{
												switch(currentSENDRESOURCETRANSFER.ResouceReciveName)
												{
													case "Farm":
														{
															if ((parseFloat(rows[0].Farm) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Metal = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Farm = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query113434hjklgfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Metal&&farm");
																		}else
																		{
																			console.log("update khong thanh cong Metal&&farm");
																		}
																	}
																});
															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Wood":
														{
															if ((parseFloat(rows[0].Wood) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Metal = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Wood = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query113434hlkgfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Metal&&Wood");
																		}else
																		{
																			console.log("update khong thanh cong Metal&&Wood");
																		}
																	}
																});
															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;
													case "Stone":
														{
															if ((parseFloat(rows[0].Stone) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
															{		                		
										                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
										                			+"',userbase.Metal = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
										                			+"',userbase.Stone = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
										                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
										                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the querhlky113434gfafd');
																	}else
																	{
																		if (result.affectedRows>0) 
																		{
																			console.log("update thanh cong Metal&&Stone");
																		}else
																		{
																			console.log("update khong thanh cong Metal&&Stone");
																		}
																	}
																});

															}else
															{
																socket.emit('RECIEVERESOURCETRANSFER', 
																{
										                    		message : 0
										                		});
																console.log("gửi mail");
															}									
														}
														break;																					
												}

											}else
											{
												socket.emit('RECIEVERESOURCETRANSFER', 
												{
						                    		message : 0
						                		});
												console.log("gửi mail");
											}									
										}
										break;			
								}																
							}else
							{
								console.log("dữ liệu không đủ");
								socket.emit('RECIEVERESOURCETRANSFER', 
								{
		                    		message : 0
		                		});
								console.log("gửi mail");
							}
						}

					});		

				});
			});
			
			socket.on('SENDRESOURCETRANSFERBASE', function (data)
			{
				currentSENDRESOURCETRANSFERBASE =
				{
					UserName:data.UserName,		
					numberBaseSend:data.numberBaseSend,	
					numberBaseReceive:data.numberBaseReceive,
					FarmSend:data.FarmSend,
					FarmTotalSend:data.FarmTotalSend,			
					WoodSend:data.WoodSend,
					WoodTotalSend:data.WoodTotalSend,			
					StoneSend:data.StoneSend,
					StoneTotalSend:data.StoneTotalSend,			
					MetalSend:data.MetalSend,
					MetalTotalSend:data.MetalTotalSend,			
					TimeComplete:data.TimeComplete,
												
				}
				console.log("data receive SENDRESOURCETRANSFERBASE: "+ currentSENDRESOURCETRANSFERBASE.UserName+"_"				
						+"_"+currentSENDRESOURCETRANSFERBASE.numberBaseSend
						+"_"+currentSENDRESOURCETRANSFERBASE.numberBaseReceive
						+"_"+currentSENDRESOURCETRANSFERBASE.FarmSend
						+"_"+currentSENDRESOURCETRANSFERBASE.FarmTotalSend				
						+"_"+currentSENDRESOURCETRANSFERBASE.WoodSend
						+"_"+currentSENDRESOURCETRANSFERBASE.WoodTotalSend				
						+"_"+currentSENDRESOURCETRANSFERBASE.StoneSend
						+"_"+currentSENDRESOURCETRANSFERBASE.StoneTotalSend				
						+"_"+currentSENDRESOURCETRANSFERBASE.MetalSend+
						"_"+currentSENDRESOURCETRANSFERBASE.MetalTotalSend+				
						"_"+currentSENDRESOURCETRANSFERBASE.TimeComplete);
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT `Farm`, `Wood`, `Stone`, `Metal`, `Position`, `ResourceMoveSpeed` FROM `userbase` WHERE `UserName`='"+currentSENDRESOURCETRANSFERBASE.UserName+"' AND numberBase = '"+currentSENDRESOURCETRANSFERBASE.numberBaseSend
						+"'UNION ALL SELECT `Farm`, `Wood`, `Stone`, `Metal`, `Position`, `ResourceMoveSpeed` FROM `userbase` WHERE `UserName` = '"+currentSENDRESOURCETRANSFERBASE.UserName+"' AND `numberBase` ='"+currentSENDRESOURCETRANSFERBASE.numberBaseReceive+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdbft4hgghsdds34fh');
							socket.emit('RECIEVERESOURCETRANSFERBASE', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{	

							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");
								console.log("X: "+rows[0].Position);
								arrZ =	rows[1].Position.split(",");
								console.log("Z: "+rows[1].Position);
								TimeCompleteResourceTransferBase=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);															
								console.log("Thoi gian comple resource transfer base: "+TimeCompleteResourceTransferBase);

								if (((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCETRANSFERBASE.FarmSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.FarmTotalSend))&&

									((parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.WoodTotalSend))&&

									((parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.StoneTotalSend))&&

									((parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.MetalTotalSend))&&
										
									(parseInt(TimeCompleteResourceTransferBase,10)===parseInt(currentSENDRESOURCETRANSFERBASE.TimeComplete,10))) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);
									console.log("Thời gian gưi: "+createPositionTimelast);
									TimeCompleteResourceTransferBase= parseFloat(currentSENDRESOURCETRANSFERBASE.TimeComplete)+parseFloat(createPositionTimelast);
									console.log("Thời gian thuc gưi: "+TimeCompleteResourceTransferBase);
									connection.query("UPDATE userbase SET FarmWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.FarmSend))				                			
			                			+"',WoodWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))				                				                			
			                			+"',StoneWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))				                				                			
			                			+"',MetalWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))	
			                			+"',Farm = Farm - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))
			                			+"',Wood = Wood - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))				                				                			
			                			+"',Stone = Stone - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))				                				                			
			                			+"',Metal = Metal - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))	
			                			+"',ResourceTransferToBase = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.numberBaseReceive))
			                			+"',TimeCompleteResourceMoveSpeed = '"+ (parseInt(TimeCompleteResourceTransferBase,10))				                				                						                				                			
			                			+"'where UserName = '"+currentSENDRESOURCETRANSFERBASE.UserName
			                			+"'AND numberBase = '"+currentSENDRESOURCETRANSFERBASE.numberBaseSend+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query113434ghjfafd');
										}else
										{
											if (result.affectedRows>0) 
											{
												console.log("update thanh cong SENDRESOURCETRANSFERBASE");										
											}else
											{
												console.log("update khong thanh cong SENDRESOURCETRANSFERBASE");
												console.log('Error in the queryhgsdbfrthdfgjt434fh');
												socket.emit('RECIEVERESOURCETRANSFERBASE', 
												{
							                		message : 0
							            		});
												console.log("gửi mail");
											}

										}
									});

								}else
								{
									console.log('Error in the queryhgsdbfrthjdgft434fh');
									socket.emit('RECIEVERESOURCETRANSFERBASE', 
									{
				                		message : 0
				            		});
									console.log("gửi mail");

								}
							}else
							{
								console.log('Error in the queryhgsdbft434fh');
								socket.emit('RECIEVERESOURCETRANSFERBASE', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}
							
						}


					});

				});
			});

			socket.on('SENDRESOURCETRANSFERBASECOMPLETE', function (data)
			{
				currentSENDRESOURCETRANSFERBASEBASECOMPLETE =
				{
					UserName:data.UserName,	
					numberBaseSend:data.numberBaseSend,
					numberBaseReceive:data.numberBaseReceive,			
					FarmTotalReceive:data.FarmTotalReceive,
					WoodTotalReceive:data.WoodTotalReceive,
					StoneTotalReceive:data.StoneTotalReceive,
					MetalTotalReceive:data.MetalTotalReceive,					
				}
				console.log("data receive SENDRESOURCETRANSFERBASECOMPLETE: "+ currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName+"_"				
						+"_"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)
						+"_"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)
						+"_"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive
						+"_"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive
						+"_"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive
						+"_"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive));
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName+"'AND A.numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)
						+"' UNION ALL SELECT A.Farm,A.Wood,A.Stone,A.Metal,A.FarmWait, A.WoodWait, A.StoneWait, A.MetalWait,A.TimeCompleteResourceMoveSpeed,A.ResourceTransferToBase,C.MaxStorage FROM userbase AS A INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName+"'AND A.numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdbfdt4hggh3sd4fh');
							socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{	

							if (rows.length > 0) 
							{
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);
								console.log("Thoi gian thực hoan tat: "+(parseFloat(createPositionTimelast) - parseFloat(rows[0].TimeCompleteResourceMoveSpeed)));
								console.log("Thoi gian hoan tat: "+createPositionTimelast);
								console.log("data check update: "+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive+"="+(parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait))
								+"_"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive+"="+(parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait))
								+"_"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive+"="+(parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait))
								+"_"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive)+"="+(parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait)));
								if (((parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive))&&

									((parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive))&&

									((parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive))&&

									((parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive))&&
									((parseFloat(rows[0].TimeCompleteResourceMoveSpeed) - parseFloat(createPositionTimelast))<=2)&&	
									((parseFloat(createPositionTimelast) - parseFloat(rows[0].TimeCompleteResourceMoveSpeed))<=2)) 
								{
									//kiểm tra max store cho từng tài nguyên
									if ((parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) >=  parseFloat(rows[1].MaxStorage)) 
									{
										FarmTransferSurpass = (parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) - parseFloat(rows[1].MaxStorage);
										FarmTransferRemain = parseFloat(rows[0].FarmWait) - FarmTransferSurpass;
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Farm = Farm +'"+parseFloat(FarmTransferRemain)									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query1134364gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET Farm = Farm +'"+FarmTransferSurpass+"',FarmWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query1134gt34gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send Farm");
																socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
																{
											                		Farm : (parseFloat(rows[0].Farm) + parseFloat(FarmTransferSurpass)),
											                		Base : parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend),
											            		});
															}else
															{
																console.log("update khong thanh cong Farm");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong Farm");
												}

											}
										});
									}else
									{
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Farm = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive)									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query113434tygfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET FarmWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query113ty434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send");
															}else
															{
																console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
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
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query1134ty34gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET Wood = Wood +'"+WoodTransferSurpass+"',WoodWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query11ty3434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send Wood");
																socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
																{
											                		Wood : (parseFloat(rows[0].Wood) + parseFloat(WoodTransferSurpass)),
											                		Base : parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend),
											            		});
															}else
															{
																console.log("update khong thanh cong Wood");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong Wood");
												}

											}
										});
									}else
									{
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Wood = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query11343654gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET WoodWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query1134347gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send");
															}else
															{
																console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
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
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query113434g45fafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET Stone = Stone +'"+StoneTransferSurpass+"',StoneWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query113434gf4afd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send Stone");
																socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
																{
											                		Stone : (parseFloat(rows[0].Stone) + parseFloat(StoneTransferSurpass)),
											                		Base : parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend),
											            		});
															}else
															{
																console.log("update khong thanh cong Stone");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong Stone");
												}

											}
										});
									}else
									{
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Stone = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive)									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query11673434gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET StoneWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query11343424gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send");
															}else
															{
																console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
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
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query1133434gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET Metal = Metal +'"+MetalTransferSurpass+"',MetalWait=0,TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query1134534gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send Metal");
																socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
																{
											                		Metal : (parseFloat(rows[0].Metal) + parseFloat(MetalTransferSurpass)),
											                		Base : parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend),
											            		});
															}else
															{
																console.log("update khong thanh cong Metal");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong Metal");
												}

											}
										});
									}else
									{
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Metal = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive)									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query1134346gfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("update thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET MetalWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query1134348gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("update thanh cong base send");
															}else
															{
																console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
															}

														}
													});
												}else
												{
													console.log("update khong thanh cong currentSENDRESOURCETRANSFERBASEBASECOMPLETE");
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
				            		console.log("gửi mail sdl;;lg");

								}
									
							}else
							{
								socket.emit('RECIEVERESOURCETRANSFERBASEBASECOMPLETE', 
								{
			                		message : 0
			            		});
			            		console.log("gửi mail sdgsdf");
							}
						}
					});
				
					
				});
			});
			
			socket.on('SENDUNITTRANSFERTOBASE', function (data)
			{		
				console.log("data receive SENDUNITTRANSFERTOBASE"+data);		
				CountLimitNumberUnitTransfer=0;					
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT `Position`, `UnitMoveSpeed`, `UnitNumberLimitTransfer` FROM `userbase` WHERE `UserName`='"+data[0].UserName+"' AND numberBase = '"+data[0].numberBaseSend
						+"'UNION ALL SELECT  `Position`, `UnitMoveSpeed`, `UnitNumberLimitTransfer` FROM `userbase` WHERE `UserName` = '"+data[0].UserName+"' AND `numberBase` ='"+data[0].numberBaseReceive+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdbft4hgghsdds34fh');
							socket.emit('RECIEVEUNITTRANSFERTOBASE', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{	

							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");					
								arrZ =	rows[1].Position.split(",");
								TimeWaitResourceTransferBase=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].UnitMoveSpeed);															
								for (var i = 0; i < data.length; i++) 
								{
									var index=i;	
									var s=	parseFloat(data[index].QualitySend);				
									
									if (parseInt(TimeWaitResourceTransferBase,10)===parseInt(data[index].TimeCompleteToSendUnit,10))
									{
										d = new Date();
										createPositionTimelast = Math.floor(d.getTime() / 1000);
										TimeCompleteResourceTransferBase= parseFloat(data[index].TimeCompleteToSendUnit)+parseFloat(createPositionTimelast);
										CountLimitNumberUnitTransfer = parseFloat(CountLimitNumberUnitTransfer)+parseFloat(s);
										connection.query("UPDATE unitinbase SET Quality = Quality - '"+ (parseFloat(data[index].QualitySend))				                			
			                			+"',numberBaseReceive = '"+ parseFloat(data[index].numberBaseReceive)
			                			+"',QualityWait = '"+ parseFloat(data[index].QualitySend)		                				                					                				                				                			
			                			+"',TimeCompleteUnitMoveSpeed = '"+ parseInt(TimeCompleteResourceTransferBase,10)				                				                						                				                			
			                			+"'where UserName = '"+data[index].UserName
			                			+"'AND numberBase = '"+parseFloat(data[index].numberBaseSend)
			                			+"'AND (Quality - '"+parseFloat(data[index].QualityTotalSend)+"')= '"+parseFloat(data[index].QualitySend)
										+"'AND UnitType = '"+parseFloat(data[index].UnitType)
										+"'AND Level = '"+parseFloat(data[index].Level)+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query113434ghjfafd');
											}else
											{
												if (result.affectedRows>0) 
												{
													console.log("bnkjhok"+CountLimitNumberUnitTransfer);
													//kiểm tra max quality
													if (parseFloat(CountLimitNumberUnitTransfer)>parseFloat(rows[0].UnitNumberLimitTransfer)) 
													{												
														socket.emit('RECIEVEUNITTRANSFERTOBASE', 
														{
									                		message : 0
									            		});
									            		for (var i = 0; i < data.length; i++) {
									            			connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+data[i].UserName
										        			+"'AND numberBase = '"+parseFloat(data[0].numberBaseSend)		        			
															+"'AND UnitType = '"+parseFloat(data[0].UnitType)
															+"'AND Level = '"+parseFloat(data[0].Level)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the queerry1134r34ghjfafd');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		//update	
																	}else
																	{
																		console.log("insert them unit");
																		//insert
																	}

																}
															});
									            		}
									            		

													}
													
													

												}else
												{
													console.log("update khong thanh cong RECIEVEUNITTRANSFERTOBASE2");
													console.log('Error in the queryhgsdbfrthjt4dgf34fh');
													socket.emit('RECIEVEUNITTRANSFERTOBASE', 
													{
								                		message : 0
								            		});
													console.log("gửi mail");
												}

											}
										});

									}else
									{								
										console.log('Error in the queryhgsdbfrthjtdfg34fh');
										socket.emit('RECIEVEUNITTRANSFERTOBASE', 
										{
					                		message : 0
					            		});
										console.log("gửi mail");
									}
								}

							}else
							{
								console.log('Error in the queryhgsdbft434fh');
								socket.emit('RECIEVEUNITTRANSFERTOBASE', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}
							
						}


					});
				});
			});

			socket.on('SENDUNITTRANSFERTOBASECOMPLETE', function (data)
			{
				console.log("data receive SENDUNITTRANSFERTOBASECOMPLETE: "+data);		
				pool.getConnection(function(err,connection)
				{	
						
					for (var i = 0; i < data.length; i++) 
					{
						var index=i;
						connection.query("SELECT `UserName`, `numberBase`, `UnitType`, `QualityWait`, `Level`, `numberBaseReceive`,`TimeCompleteUnitMoveSpeed` FROM `unitinbase` WHERE `UserName`='"+data[index].UserName
							+"'AND numberBase = '"+parseFloat(data[index].numberBaseSend)
							+"'AND UnitType = '"+parseFloat(data[index].UnitType)
							+"'AND Level = '"+parseFloat(data[index].Level)+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the queryhgsdbft4hgghsdds3434fh');
								socket.emit('RECIEVEUNITTRANSFERTOBASECOMPLETE', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}else
							{	
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);						
								console.log("Time hoan tat: "+parseFloat(createPositionTimelast) - parseFloat(rows[0].TimeCompleteUnitMoveSpeed));
								if (rows.length >0 
									&&((parseFloat(rows[0].TimeCompleteUnitMoveSpeed) - parseFloat(createPositionTimelast)) <=2)
									&&((parseFloat(createPositionTimelast) - parseFloat(rows[0].TimeCompleteUnitMoveSpeed)) <=2))
								{
									connection.query("UPDATE unitinbase SET Quality = Quality + '"+ (parseFloat(rows[0].QualityWait))			                					        						                				                						                				                			
				        			+"'where UserName = '"+rows[0].UserName
				        			+"'AND numberBase = '"+parseFloat(rows[0].numberBaseReceive)		        			
									+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
									+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11e3434ghjerfafd');
										}else
										{
											if (result.affectedRows>0) 
											{
												//update	
												console.log("Update transfer unit");
												connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
							        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
												+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
												+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the queerry1134r34ghjfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															//update	
															console.log("unit wait is formatting affter update is successed");
															connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the queryfgfg659');
																}else
																{
																	if(result.affectedRows > 0)
																	{
																	}
																}
															});

														}else
														{
															console.log("insert them unit");
															//insert
														}

													}
												});

											}else
											{
												console.log("insert tranfer unit");
												//insert
												connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `QualityWait`, `Level`, `numberBaseReceive`, `TimeCompleteUnitMoveSpeed`, `TimeWaitUnitMoveSpeed`) VALUES ('"+""+"','"
												+rows[0].UserName+"','"+rows[0].numberBaseReceive+"','"+rows[0].UnitType+"','"+rows[0].QualityWait+"','"+0+"','"+rows[0].Level+"','"+0+"','"+0+"','"+0+"')",function(error, result, field)
												{
										            if(!!err)
										            {
										            	console.log('Error in the queryer34');
										            }else
										            {
										            	if (result.affectedRows>0) 
										            	{
										            		console.log("insert them unit khi tranfer thanh cong");
										            		//cập nhật lại qualitu wait
										            		connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
										        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
															+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
															+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query1134e34ghejfafd');
																}else
																{
																	if (result.affectedRows>0) 
																	{
																		//update	
																		console.log("format sau khi insert them unit  thanh cong");	
																		connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the queryfgfg659');
																			}else
																			{
																				if(result.affectedRows > 0)
																				{
																				}
																			}
																		});															
																	}else
																	{
																		console.log("insert them unit");
																		//insert
																	}

																}
															});
										            	}else
										            	{
										            		console.log("chưa insert dc");
										            	}
										            }
										        });
											}
										}
									});
								}else
								{
									console.log('Error in the queryhgsdbft4hgghsdeds34fh');
									socket.emit('RECIEVEUNITTRANSFERTOBASECOMPLETE', 
									{
				                		message : 0
				            		});							
								}
							}
						});
					}

				});
			});
	
			//Chuyển tài nguyên giữa hai người bạn
			socket.on('SENDRESOURCETRANSFERTOFRIEND', function (data)
			{	
				currentSENDRESOURCETRANSFERTOFRIEND =
				{
					UserNameSend:data.UserNameSend,
					UserNameReceive:data.UserNameReceive,	
					numberBaseSend:data.numberBaseSend,
					numberBaseReceive:data.numberBaseReceive,	
					FarmSend:data.FarmSend,
					WoodSend:data.WoodSend,
					StoneSend:data.StoneSend,
					MetalSend:data.MetalSend,
					FarmTotalSend:data.FarmTotalSend,
					WoodTotalSend:data.WoodTotalSend,
					StoneTotalSend:data.StoneTotalSend,
					MetalTotalSend:data.MetalTotalSend,					
				}	
				console.log("data receive SENDRESOURCETRANSFERTOFRIEND: "+ currentSENDRESOURCETRANSFERTOFRIEND.UserNameSend+"_"				
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.UserNameReceive
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.numberBaseSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.numberBaseReceive
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.FarmSend				
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.WoodSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.StoneSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.MetalSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.FarmTotalSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.WoodTotalSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.StoneTotalSend
						+"_"+currentSENDRESOURCETRANSFERTOFRIEND.MetalTotalSend);
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT `Farm`, `Wood`, `Stone`, `Metal`, `Position`, `ResourceMoveSpeed` FROM `userbase` WHERE `UserName`='"+currentSENDRESOURCETRANSFERTOFRIEND.UserNameSend+"' AND numberBase = '"+currentSENDRESOURCETRANSFERTOFRIEND.numberBaseSend
						+"'UNION ALL SELECT `Farm`, `Wood`, `Stone`, `Metal`, `Position`, `ResourceMoveSpeed` FROM `userbase` WHERE `UserName` = '"+currentSENDRESOURCETRANSFERTOFRIEND.UserNameReceive+"' AND `numberBase` ='"+currentSENDRESOURCETRANSFERTOFRIEND.numberBaseReceive+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdbft4hgghsddsgh34fh');
							socket.emit('RECIEVERESOURCETRANSFERTOFRIEND', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{	
							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");
								arrZ =	rows[1].Position.split(",");
								TimeCompleteResourceTransferBase=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);															
								console.log("Thoi gian comple resource transfer base friend: "+TimeCompleteResourceTransferBase);

								if (((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.FarmSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.FarmTotalSend))&&

									((parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodTotalSend))&&

									((parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneTotalSend))&&

									((parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalTotalSend))) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);
									console.log("Thời gian gưi: "+createPositionTimelast);
									TimeCompleteResourceTransferBaseFriend= parseInt(TimeCompleteResourceTransferBase,10)+parseFloat(createPositionTimelast);
									console.log("Thời gian thuc gưi: "+TimeCompleteResourceTransferBase);
									connection.query("UPDATE userbase SET FarmWaitFromFriend = '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.FarmSend))				                			
			                			+"',WoodWaitFromFriend = '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodSend))				                				                			
			                			+"',StoneWaitFromFriend = '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneSend))				                				                			
			                			+"',MetalWaitFromFriend = '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalSend))	
			                			+"',Farm = Farm - '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodSend))
			                			+"',Wood = Wood - '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodSend))				                				                			
			                			+"',Stone = Stone - '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneSend))				                				                			
			                			+"',Metal = Metal - '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalSend))	
			                			+"',ResourceTransferToBaseOfFriend = '"+ (parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.numberBaseReceive))
			                			+"',ResourceTransferToUserNameOfFriend = '"+ currentSENDRESOURCETRANSFERTOFRIEND.UserNameReceive
			                			+"',TimeCompleteResourceTransferFromFriend	 = '"+ (parseInt(TimeCompleteResourceTransferBaseFriend,10))				                				                						                				                			
			                			+"'where UserName = '"+currentSENDRESOURCETRANSFERTOFRIEND.UserNameSend
			                			+"'AND TimeCompleteResourceTransferFromFriend = 0 AND numberBase = '"+currentSENDRESOURCETRANSFERTOFRIEND.numberBaseSend+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11gh3434ghjfafd');
										}else
										{
											if (result.affectedRows>0) 
											{
												console.log("update thanh cong currentSENDRESOURCETRANSFERTOFRIEND");										
											}else
											{
												console.log("update khong thanh cong currentSENDRESOURCETRANSFERTOFRIEND");
												console.log('Error in the queryhgsdbfrthdfgjt434fh');
												socket.emit('RECIEVERESOURCETRANSFERTOFRIEND', 
												{
							                		message : 0
							            		});
												console.log("gửi mail");
											}
										}
									});

								}else
								{
									console.log('Error in the queryhgsdbfrthjdgft434fh');
									socket.emit('RECIEVERESOURCETRANSFERTOFRIEND', 
									{
				                		message : 0
				            		});
									console.log("gửi mail");

								}
							}else
							{
								console.log('Error in the queryhgsdbft434fh');
								socket.emit('RECIEVERESOURCETRANSFERTOFRIEND', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}					
						}
					});
				});
			});	

			//vận chuyển lương thực từ base đến unit	
			socket.on('SENDRESOURCEFROMBASETRANSFERTOUNIT', function (data)
			{	
				currentSENDRESOURCEFROMBASETRANSFERTOUNIT =
				{
					UserName:data.UserName,				
					numberBaseSend:data.numberBaseSend,
					UnitOrderReceive:data.UnitOrderReceive,	
					FarmSend:data.FarmSend,			
					FarmTotalSend:data.FarmTotalSend,							
				}	
				console.log("data receive SENDRESOURCEFROMBASETRANSFERTOUNIT: "+ currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName+"_"				
						+"_"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend
						+"_"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UnitOrderReceive
						+"_"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmSend
						+"_"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmTotalSend);
				var TimeCompleteResourceTransferToUnit=0,TimeCompleteResourceTransferBaseUnit=0;
				pool.getConnection(function(err,connection)
				{

					connection.query("SELECT `Farm`, `Position`,`ResourceMoveSpeed` FROM `userbase` WHERE `UserName`='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName+"' AND numberBase = '"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend
						+"'UNION ALL SELECT `FarmPortable`, `Position`,`PositionClick` FROM `unitinlocations` WHERE `UserName` = '"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName+"' AND `UnitOrder` ='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UnitOrderReceive+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdbft4hgghsdddsgh34fh');
							socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{	
							
							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");
								console.log("X: "+rows[0].Position);
								arrZ =	rows[1].Position.split(",");
								console.log("Z: "+rows[1].Position);
								TimeCompleteResourceTransferToUnit=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);															
								console.log("Thoi gian comple resource transfer base unit: "+TimeCompleteResourceTransferToUnit);

								if ((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmSend))===parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmTotalSend)) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);
									console.log("Thời gian gưi: "+createPositionTimelast);
									TimeCompleteResourceTransferBaseUnit= parseInt(TimeCompleteResourceTransferToUnit,10)+parseFloat(createPositionTimelast);
									console.log("Thời gian thuc gưi: "+TimeCompleteResourceTransferToUnit);
									connection.query("UPDATE userbase,unitinlocations SET userbase.Farm = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmTotalSend))			                				                				
										+"',userbase.TransferUnitOrderStatus = '"+ 1
										+"',unitinlocations.numberBaseTransfer = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend))
			                			+"',unitinlocations.FarmWait = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmSend))	                			
			                			+"',unitinlocations.FarmTransferCompleteTime = '"+ (parseInt(TimeCompleteResourceTransferBaseUnit,10))				                				                						                				                			
			                			+"'where userbase.UserName = unitinlocations.UserName AND userbase.UserName ='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName
			                			+"'AND userbase.numberBase = '"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend
			                			+"'AND unitinlocations.UnitOrder ='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UnitOrderReceive+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11gh343f4ghjfafd');
										}else
										{
											if (result.affectedRows>0) 
											{
												console.log("update thanh cong currentSENDRESOURCEFROMBASETRANSFERTOUNIT");										
											}else
											{										
												console.log('Error in the queryhgsdbdfrthdfgjt4g34fh');
												socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
												{
							                		message : 0
							            		});
												console.log("gửi mail");
											}
										}
									});

								}else
								{
									console.log('Error in the queryhgsdbfrthjdgdft4fg34fh');
									socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
									{
				                		message : 0
				            		});
									console.log("gửi mail");

								}
							}else
							{
								console.log('Error in the queryhgsdbft4h3f4fh');
								socket.emit('RECIEVERESOURCEFROMBASETRANSFERTOUNIT', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}					
						}
					});
				});
			});
		});

		cron.schedule('*/1 * * * * *',function()
		{
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);

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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;
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
							  			if ((lodash.filter(gameServer.clients, x => x.name === arraySendResourceFromBaseToUnit[index].UserName)).length >0) 
							  			{	
							  				console.log("Gửi lên user: "+arraySendResourceFromBaseToUnit[index].UserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendResourceFromBaseToUnit[index].UserName)].idSocket)						  											  				
						  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendResourceFromBaseToUnit[index].UserName)].idSocket).emit('RECEIVECOMPLETESENDRESOURCEFROMBASETRANSFERTOUNIT',
											{
												UnitOrder: parseFloat(arraySendResourceFromBaseToUnit[index].UnitOrder),
												numberBase: parseFloat(arraySendResourceFromBaseToUnit[index].numberBaseTransfer),
												Farm: parseFloat(arraySendResourceFromBaseToUnit[index].FarmPortable) + parseFloat(arraySendResourceFromBaseToUnit[index].FarmWait),
						                	});		
						                	//cập nhật lại redis và memory
						                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
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
														if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
														{
															//cập nhật tình trạng ofllie cho unit location
															gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].FarmPortable = parseFloat(rows[i].FarmPortable);														
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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;
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

																	if (gameServer.clients.length>0) 
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
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVETRANSFERRESOURCEFRIENDCOMPLETE',
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

																	if (gameServer.clients.length>0) 
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
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVETRANSFERRESOURCEFRIENDCOMPLETE',
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
		});
    }
}

