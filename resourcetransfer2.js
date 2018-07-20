'use strict';
var pool = require('./db');
var sqrt 			= require( 'math-sqrt' );
var cron 			= require('node-cron');
var math 			= require('mathjs');
var lodash		    = require('lodash');
var client 			= require('./redis');
var functions   = require("./functions");


var currentSENDRESOURCETRANSFER,d,createPositionTimelast,currentSENDRESOURCETRANSFERBASECOMPLETE,currentSENDRESOURCETRANSFERBASE,
currentSENDRESOURCETRANSFERBASEBASECOMPLETE,currentSENDUNITTRANSFERTOBASE,currentSENDRESOURCETRANSFERTOFRIEND,currentSENDRESOURCEFROMBASETRANSFERTOUNIT,
currentSENDUNITTRANSFERTOBASECOMPLETE,SendQualityFarm = 0, SendQualityWood = 0, SendQualityStone = 0, SendQualityMetal = 0,
SendRemainFarm = 0, SendRemainWood = 0, SendRemainStone = 0, SendRemainMetal =0,
ReciveQualityFarm = 0, ReciveQualityWood = 0, ReciveQualityStone = 0, ReciveQualityMetal = 0, 
ReciveRemainFarm = 0, ReciveRemainWood = 0, ReciveRemainStone = 0, ReciveRemainMetal = 0,arrX,arrZ,TimeCompleteResourceTransferBase,
TimeCompleteResourceTransferBaseFriend,TimeWaitResourceTransferBase,
FarmTransferRemain=0,WoodTransferRemain=0,StoneTransferRemain=0,MetalTransferRemain=0,
FarmTransferSurpass=0,WoodTransferSurpass=0,StoneTransferSurpass=0,MetalTransferSurpass=0,CountLimitNumberUnitTransfer=0,arrayClients=[],DetailError;

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        { 
			socket.on('S_RESOURCE_TRANSFER', function (data)
			{
				currentSENDRESOURCETRANSFER = getcurrentSENDRESOURCETRANSFER(data);
				console.log("data receive S_RESOURCE_TRANSFER: "+ currentSENDRESOURCETRANSFER.UserName+"_"				
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
					var ResouceSendName =  "B."+currentSENDRESOURCETRANSFER.ResouceSendName, ResouceReciveName = "B."+currentSENDRESOURCETRANSFER.ResouceReciveName,
						userbaseSendName =  "userbase."+currentSENDRESOURCETRANSFER.ResouceSendName, userbaseReciveName = "userbase."+currentSENDRESOURCETRANSFER.ResouceReciveName;		
					connection.query("SELECT A.Diamond,"+ResouceSendName+" as ResouceSendNames,"+ResouceReciveName+" as ResouceReciveNames  FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName WHERE A.UserName = '"+currentSENDRESOURCETRANSFER.UserName
						+"'AND B.numberBase = '"+parseFloat(currentSENDRESOURCETRANSFER.numberBase)+"'",function(error, rows,field)
					{
						if (!!error)
						{							
							socket.emit('R_RESOURCE_TRANSFER', 
							{
		                		message : 0
		            		});
							DetailError = ("resourcetransfer: Error in query 1");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{						
							if (rows.length > 0) 
							{
								if ((parseFloat(rows[0].ResouceSendNames) - parseFloat(currentSENDRESOURCETRANSFER.ResouceSendQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain)
												&&(parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCETRANSFER.DiamondConsumption))===parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain)
												)
								{
									if ((parseFloat(rows[0].ResouceReciveNames) + parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveQuality))===parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))
									{		                		
				                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDRESOURCETRANSFER.DiamondRemain))				                			
				                			+"',"+userbaseSendName+" = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceSendRemain))				                			
				                			+"',"+userbaseReciveName+" = '"+ (parseFloat(currentSENDRESOURCETRANSFER.ResouceReciveRemain))				                			
				                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDRESOURCETRANSFER.UserName
				                			+"'AND userbase.numberBase = '"+currentSENDRESOURCETRANSFER.numberBase+"'",function(error, result, field)
										{
											if(!!error){DetailError = ("resourcetransfer: Error in query 2");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}

										});

									}else
									{
										socket.emit('R_RESOURCE_TRANSFER', 
										{
				                    		message : 0
				                		});										
									}
								}else
								{
									socket.emit('R_RESOURCE_TRANSFER', 
									{
			                    		message : 0
			                		});									
								}													
							}else
							{								
								socket.emit('R_RESOURCE_TRANSFER', 
								{
		                    		message : 0
		                		});								
							}
						}

					});		

				});
			});
			
			socket.on('S_RESOURCE_TRANSFER_BASE', function (data)
			{
				currentSENDRESOURCETRANSFERBASE = getcurrentSENDRESOURCETRANSFERBASE(data);
				console.log("data receive S_RESOURCE_TRANSFER_BASE: "+ currentSENDRESOURCETRANSFERBASE.UserName+"_"				
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
							socket.emit('R_RESOURCE_TRANSFER_BASE', 
							{
		                		message : 0
		            		});
							DetailError = ("resourcetransfer: Error in query 4");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{	

							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");								
								arrZ =	rows[1].Position.split(",");								
								TimeCompleteResourceTransferBase=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);															
								if (((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCETRANSFERBASE.FarmSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.FarmTotalSend))&&

									((parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.WoodTotalSend))&&

									((parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.StoneTotalSend))&&

									((parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))===parseFloat(currentSENDRESOURCETRANSFERBASE.MetalTotalSend))&&
										
									(parseInt(TimeCompleteResourceTransferBase,10)===parseInt(currentSENDRESOURCETRANSFERBASE.TimeComplete,10))) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);									
									TimeCompleteResourceTransferBase= parseFloat(currentSENDRESOURCETRANSFERBASE.TimeComplete)+parseFloat(createPositionTimelast);									
									connection.query("UPDATE userbase SET FarmWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.FarmSend))				                			
			                			+"',WoodWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))				                				                			
			                			+"',StoneWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))				                				                			
			                			+"',MetalWait = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))	
			                			+"',Farm = Farm - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.FarmSend))
			                			+"',Wood = Wood - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.WoodSend))				                				                			
			                			+"',Stone = Stone - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.StoneSend))				                				                			
			                			+"',Metal = Metal - '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.MetalSend))	
			                			+"',ResourceTransferToBase = '"+ (parseFloat(currentSENDRESOURCETRANSFERBASE.numberBaseReceive))
			                			+"',TimeCompleteResourceMoveSpeed = '"+ (parseInt(TimeCompleteResourceTransferBase,10))				                				                						                				                			
			                			+"'where UserName = '"+currentSENDRESOURCETRANSFERBASE.UserName
			                			+"'AND numberBase = '"+currentSENDRESOURCETRANSFERBASE.numberBaseSend+"'",function(error, result, field)
									{
										if(!!error){DetailError = ("resourcetransfer: Error in query 5");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (result.affectedRows<=0)
											{												
												socket.emit('R_RESOURCE_TRANSFER_BASE', 
												{
							                		message : 0
							            		});												
											}
										}
									});

								}else
								{									
									socket.emit('R_RESOURCE_TRANSFER_BASE', 
									{
				                		message : 0
				            		});									

								}
							}else
							{								
								socket.emit('R_RESOURCE_TRANSFER_BASE', 
								{
			                		message : 0
			            		});								
							}							
						}
					});
				});
			});

			socket.on('S_RESOURCE_TRANSFER_BASE_COMPLETE', function (data)
			{
				currentSENDRESOURCETRANSFERBASEBASECOMPLETE = getcurrentSENDRESOURCETRANSFERBASEBASECOMPLETE(data);
				console.log("data receive S_RESOURCE_TRANSFER_BASE_COMPLETE: "+ currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName+"_"				
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
							socket.emit('R_RESOURCE_TRANSFER_BASE_BASE_COMPLETE', 
							{
		                		message : 0
		            		});
							DetailError = ("resourcetransfer: Error in query 6");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{	

							if (rows.length > 0) 
							{
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);
								if (((parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive))&&

									((parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive))&&

									((parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive))&&

									((parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait))===parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive))&&
									((parseFloat(rows[0].TimeCompleteResourceMoveSpeed) - parseFloat(createPositionTimelast))<=2)&&	
									((parseFloat(createPositionTimelast) - parseFloat(rows[0].TimeCompleteResourceMoveSpeed))<=2)) 
								{
									//Chuyển Farm base to base
									if (((parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) >=  parseFloat(rows[1].MaxStorage)) 
										&&((parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait)) >=  parseFloat(rows[1].MaxStorage)) 
										&&((parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait)) >=  parseFloat(rows[1].MaxStorage)) 
										&&((parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait)) >=  parseFloat(rows[1].MaxStorage))
										)
									{
										//Tính farm
										FarmTransferSurpass = (parseFloat(rows[1].Farm) + parseFloat(rows[0].FarmWait)) - parseFloat(rows[1].MaxStorage);
										FarmTransferRemain = parseFloat(rows[0].FarmWait) - FarmTransferSurpass;

										//Tính Wood
										WoodTransferSurpass = (parseFloat(rows[1].Wood) + parseFloat(rows[0].WoodWait)) - parseFloat(rows[1].MaxStorage);
										WoodTransferRemain = parseFloat(rows[0].WoodWait) - WoodTransferSurpass;

										//Tính Stone
										StoneTransferSurpass = (parseFloat(rows[1].Stone) + parseFloat(rows[0].StoneWait)) - parseFloat(rows[1].MaxStorage);
										StoneTransferRemain = parseFloat(rows[0].StoneWait) - StoneTransferSurpass;

										//Tính Metal
										MetalTransferSurpass = (parseFloat(rows[1].Metal) + parseFloat(rows[0].MetalWait)) - parseFloat(rows[1].MaxStorage);
										MetalTransferRemain = parseFloat(rows[0].MetalWait) - MetalTransferSurpass;

										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Farm = Farm +'"+parseFloat(FarmTransferRemain)									
											+"',Wood = Wood + '"+parseFloat(WoodTransferRemain)
											+"',Stone = Stone + '"+parseFloat(StoneTransferRemain)
											+"',Metal = Metal + '"+parseFloat(MetalTransferRemain)
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error){DetailError = ("resourcetransfer: Error in query 7");
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (result.affectedRows>0) 
												{
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET Farm = Farm +'"+FarmTransferSurpass
														+"', Wood = Wood +'"+WoodTransferSurpass
														+"', Stone = Stone +'"+StoneTransferSurpass
														+"', Metal = Metal +'"+MetalTransferSurpass
														+"',FarmWait = 0, WoodWait = 0, StoneWait = 0, MetalWait = 0, TimeCompleteResourceMoveSpeed = 0, ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error){DetailError = ("resourcetransfer: Error in query 8");
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}else
														{
															if (result.affectedRows>0) 
															{
																socket.emit('R_RESOURCE_TRANSFER_BASE_BASE_COMPLETE', 
																{
											                		Farm : (parseFloat(rows[0].Farm) + parseFloat(FarmTransferSurpass)),
											                		Wood : (parseFloat(rows[0].Wood) + parseFloat(WoodTransferSurpass)),
											                		Stone : (parseFloat(rows[0].Stone) + parseFloat(StoneTransferSurpass)),
											                		Farm : (parseFloat(rows[0].Metal) + parseFloat(MetalTransferSurpass)),
											                		Base : parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend),
											            		});
															}
														}
													});
												}
											}
										});
									}else
									{
										//update tài nguyên còn lại của base							
										connection.query("UPDATE userbase SET Farm = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.FarmTotalReceive)									
											+"',Wood = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.WoodTotalReceive)									
											+"',Stone = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.StoneTotalReceive)									
											+"',Metal = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.MetalTotalReceive)									
											+"' where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
							    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseReceive)+"'",function(error, result, field)
										{
											if(!!error){DetailError = ("resourcetransfer: Error in query 9");
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (result.affectedRows>0) 
												{													
													//Cập nhật base gửi
													connection.query("UPDATE userbase SET FarmWait = 0, WoodWait = 0, StoneWait = 0, MetalWait = 0, TimeCompleteResourceMoveSpeed = 0,ResourceTransferToBase = 0 where UserName = '"+currentSENDRESOURCETRANSFERBASEBASECOMPLETE.UserName				    		
										    			+"'AND numberBase = '"+parseFloat(currentSENDRESOURCETRANSFERBASEBASECOMPLETE.numberBaseSend)+"'",function(error, result, field)
													{
														if(!!error){DetailError = ("resourcetransfer: Error in query 10");
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}
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
								}									
							}else
							{
								socket.emit('R_RESOURCE_TRANSFER_BASE_BASE_COMPLETE', 
								{
			                		message : 0
			            		});
			            		
							}
						}
					});								
				});
			});
			
			socket.on('S_UNIT_TRANSFER_TO_BASE', function (data)
			{		
				console.log("data receive S_UNIT_TRANSFER_TO_BASE");		
				CountLimitNumberUnitTransfer=0;					
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT `Position`, `UnitMoveSpeed`, `UnitNumberLimitTransfer` FROM `userbase` WHERE `UserName`='"+data[0].UserName+"' AND numberBase = '"+data[0].numberBaseSend
						+"'UNION ALL SELECT  `Position`, `UnitMoveSpeed`, `UnitNumberLimitTransfer` FROM `userbase` WHERE `UserName` = '"+data[0].UserName+"' AND `numberBase` ='"+data[0].numberBaseReceive+"'",function(error, rows,field)
					{
						if (!!error){DetailError = ("resourcetransfer: Error in query 11");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
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
											if(!!error){DetailError = ("resourcetransfer: Error in query 12");
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (result.affectedRows>0) 
												{
													//kiểm tra max quality
													if (parseFloat(CountLimitNumberUnitTransfer)>parseFloat(rows[0].UnitNumberLimitTransfer)) 
													{
									            		connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+data[0].UserName
										        			+"'AND numberBase = '"+parseFloat(data[0].numberBaseSend)		        			
															+"'AND UnitType = '"+parseFloat(data[0].UnitType)
															+"'AND Level = '"+parseFloat(data[0].Level)+"'",function(error, result, field)
														{if(!!error){DetailError = ("resourcetransfer: Error in query 13");
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}});
													}
												}
											}
										});
									}
								}
							}							
						}
					});
				});
			});

			socket.on('S_UNIT_TRANSFER_TO_BASE_COMPLETE', function (data)
			{
				console.log("data receive S_UNIT_TRANSFER_TO_BASE_COMPLETE: "+data);		
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
								socket.emit('R_UNIT_TRANSFER_BASE_COMPLETE', 
								{
			                		message : 0
			            		});
								DetailError = ("resourcetransfer: Error in query 14");
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{	
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);														
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
										if(!!error){DetailError = ("resourcetransfer: Error in query 15");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
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
													if(!!error){DetailError = ("resourcetransfer: Error in query 16");
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (result.affectedRows>0) 
														{															
															connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
															{if(!!error){DetailError = ("resourcetransfer: Error in query 1");
																console.log(DetailError);
																functions.writeLogErrror(DetailError);	
															}});
														}
													}
												});
											}else
											{
												//insert
												connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `QualityWait`, `Level`, `numberBaseReceive`, `TimeCompleteUnitMoveSpeed`, `TimeWaitUnitMoveSpeed`) VALUES ('"+""+"','"
												+rows[0].UserName+"','"+rows[0].numberBaseReceive+"','"+rows[0].UnitType+"','"+rows[0].QualityWait+"','"+0+"','"+rows[0].Level+"','"+0+"','"+0+"','"+0+"')",function(error, result, field)
												{
										            if(!!err){DetailError = ("resourcetransfer: Error in query 18");
										            	console.log(DetailError);
														functions.writeLogErrror(DetailError);	
										            }else
										            {
										            	if (result.affectedRows>0) 
										            	{
										            		//cập nhật lại qualitu wait
										            		connection.query("UPDATE unitinbase SET QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 where UserName = '"+rows[0].UserName
										        			+"'AND numberBase = '"+parseFloat(rows[0].numberBase)		        			
															+"'AND UnitType = '"+parseFloat(rows[0].UnitType)
															+"'AND Level = '"+parseFloat(rows[0].Level)+"'",function(error, result, field)
															{
																if(!!error){DetailError = ("resourcetransfer: Error in query 19");
																	console.log(DetailError);
																	functions.writeLogErrror(DetailError);	
																}else
																{
																	if (result.affectedRows>0) 
																	{																		
																		connection.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
																		{if(!!error){DetailError = ("resourcetransfer: Error in query 20");
																			console.log(DetailError);
																			functions.writeLogErrror(DetailError);	
																		}});															
																	}
																}
															});
										            	}
										            }
										        });
											}
										}
									});
								}else
								{									
									socket.emit('R_UNIT_TRANSFER_BASE_COMPLETE', 
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
			socket.on('S_RESOURCE_TRANSFER_TO_FRIEND', function (data)
			{	
				currentSENDRESOURCETRANSFERTOFRIEND = getcurrentSENDRESOURCETRANSFERTOFRIEND(data);
				console.log("data receive S_RESOURCE_TRANSFER_TO_FRIEND: "+ currentSENDRESOURCETRANSFERTOFRIEND.UserNameSend+"_"				
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
							DetailError = ("resourcetransfer: Error in query 21");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
							socket.emit('R_RESOURCE_TRANSFER_TO_FRIEND', 
							{
		                		message : 0
		            		});							
						}else
						{	
							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");
								arrZ =	rows[1].Position.split(",");
								TimeCompleteResourceTransferBase=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);															
								
								if (((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.FarmSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.FarmTotalSend))&&

									((parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.WoodTotalSend))&&

									((parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.StoneTotalSend))&&

									((parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalSend))===parseFloat(currentSENDRESOURCETRANSFERTOFRIEND.MetalTotalSend))) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);									
									TimeCompleteResourceTransferBaseFriend= parseInt(TimeCompleteResourceTransferBase,10)+parseFloat(createPositionTimelast);									
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
										if(!!error){DetailError = ("resourcetransfer: Error in query 22");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (result.affectedRows<=0) 
											{												
												socket.emit('R_RESOURCE_TRANSFER_TO_FRIEND', 
												{
							                		message : 0
							            		});												
											}
										}
									});

								}else
								{
									socket.emit('R_RESOURCE_TRANSFER_TO_FRIEND', 
									{
				                		message : 0
				            		});									

								}
							}else
							{
								socket.emit('R_RESOURCE_TRANSFER_TO_FRIEND', 
								{
			                		message : 0
			            		});								
							}					
						}
					});
				});
			});	

			//vận chuyển lương thực từ base đến unit	
			socket.on('S_RESOURCE_FROM_BASE_TRANSFER_TO_UNIT', function (data)
			{	
				currentSENDRESOURCEFROMBASETRANSFERTOUNIT = getcurrentSENDRESOURCEFROMBASETRANSFERTOUNIT(data);
				console.log("data receive S_RESOURCE_FROM_BASE_TRANSFER_TO_UNIT: "+ currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName+"_"				
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
						if (!!error){DetailError = ("resourcetransfer: Error in query 24");
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{							
							if (rows.length > 1) 
							{		
								arrX =	rows[0].Position.split(",");								
								arrZ =	rows[1].Position.split(",");								
								TimeCompleteResourceTransferToUnit=sqrt( math.square(parseFloat(arrZ[0])-parseFloat(arrX[0])) + math.square(parseFloat(arrZ[1])-parseFloat(arrX[1])))/parseFloat(rows[0].ResourceMoveSpeed);																						
								if ((parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmSend))===parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmTotalSend)) 
								{
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);									
									TimeCompleteResourceTransferBaseUnit= parseInt(TimeCompleteResourceTransferToUnit,10)+parseFloat(createPositionTimelast);									
									connection.query("UPDATE userbase,unitinlocations SET userbase.Farm = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmTotalSend))			                				                				
										+"',userbase.TransferUnitOrderStatus = '"+ 1
										+"',unitinlocations.numberBaseTransfer = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend))
			                			+"',unitinlocations.FarmWait = '"+ (parseFloat(currentSENDRESOURCEFROMBASETRANSFERTOUNIT.FarmSend))	                			
			                			+"',unitinlocations.FarmTransferCompleteTime = '"+ (parseInt(TimeCompleteResourceTransferBaseUnit,10))				                				                						                				                			
			                			+"'where userbase.UserName = unitinlocations.UserName AND userbase.UserName ='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UserName
			                			+"'AND userbase.numberBase = '"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.numberBaseSend
			                			+"'AND unitinlocations.UnitOrder ='"+currentSENDRESOURCEFROMBASETRANSFERTOUNIT.UnitOrderReceive+"'",function(error, result, field)
									{
										if(!!error){DetailError = ("resourcetransfer: Error in query 25");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}
									});
								}
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
				if (!!error){DetailError = ("resourcetransfer: Error in query 26");
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{
						var GameServer = require("./login2");
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
								if(!!error){DetailError = ("resourcetransfer: Error in query 27");
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (result.affectedRows>0) 
									{		
							  			if ((lodash.filter(gameServer.clients, x => x.name === arraySendResourceFromBaseToUnit[index].UserName)).length >0) 
							  			{								  				
						  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendResourceFromBaseToUnit[index].UserName)].idSocket).emit('R_COMPLETE_SEND_RESOURCE_FROM_BASE_TO_UNIT',
											{
												UnitOrder: parseFloat(arraySendResourceFromBaseToUnit[index].UnitOrder),
												numberBase: parseFloat(arraySendResourceFromBaseToUnit[index].numberBaseTransfer),
												Farm: parseFloat(arraySendResourceFromBaseToUnit[index].FarmPortable) + parseFloat(arraySendResourceFromBaseToUnit[index].FarmWait),
						                	});		
						                	//cập nhật lại redis và memory
						                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
											{
												if (!!error){DetailError = ("resourcetransfer: Error in query 28");
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{													
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
							  		}
								}
							});				  			
				  		}			 
					}		
				}
			})
			
			//Kiểm tra hoàn tất chuyển tài nguyên từ bạn
			//========================================
			var arrayResetCancelFriend=[],arrayUserTransfer=[],arrayMember=[],arrayUserTransferComplete=[],arrayTransferComplete=[],
			FarmRemain,WoodRemain,StoneRemain,MetalRemain,FarmOver,WoodOver,StoneOver,MetalOver;  		    						
    		var query = pool.query("SELECT * FROM `userbase` WHERE TimeCompleteResourceTransferFromFriend > 0 AND  TimeCompleteResourceTransferFromFriend <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
			{
				if (!!error){DetailError = ("resourcetransfer: Error in query 29");
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{
						var GameServer = require("./login2");
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
								if (!!error){DetailError = ("resourcetransfer: Error in query 30");
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
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
											if ((arrayUserTransfer[index].FarmWaitFromFriend +parseFloat(arrayTransferComplete[0].Farm))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												FarmRemain = parseFloat(arrayTransferComplete[0].MaxStorage);											 
											}else
											{
												FarmRemain = (arrayUserTransfer[index].FarmWaitFromFriend +parseFloat(arrayTransferComplete[0].Farm));												
											}

											if ((arrayUserTransfer[index].WoodWaitFromFriend +parseFloat(arrayTransferComplete[0].Wood))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												WoodRemain = parseFloat(arrayTransferComplete[0].MaxStorage);

											}else
											{
												WoodRemain = (arrayUserTransfer[index].WoodWaitFromFriend +parseFloat(arrayTransferComplete[0].Wood));
											}

											if ((arrayUserTransfer[index].StoneWaitFromFriend +parseFloat(arrayTransferComplete[0].Stone))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												StoneRemain = parseFloat(arrayTransferComplete[0].MaxStorage);
											}
											else
											{
												StoneRemain = (arrayUserTransfer[index].StoneWaitFromFriend +parseFloat(arrayTransferComplete[0].Stone));
											}

											if ((arrayUserTransfer[index].MetalWaitFromFriend +parseFloat(arrayTransferComplete[0].Metal))>=parseFloat(arrayTransferComplete[0].MaxStorage))
											{
												MetalRemain = parseFloat(arrayTransferComplete[0].MaxStorage);												
											}else
											{
												MetalRemain = (arrayUserTransfer[index].MetalWaitFromFriend +parseFloat(arrayTransferComplete[0].Metal));
											}

											var query = pool.query("UPDATE userbase SET Farm = '"+ (parseFloat(FarmRemain))
					                			+"',Wood ='"+ (parseFloat(WoodRemain))				                				                			
					                			+"',Stone ='"+ (parseFloat(StoneRemain))				                				                			
					                			+"',Metal ='"+ (parseFloat(MetalRemain))	                							                				                						                				                			
					                			+"'where UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                			+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"'",function(error, result, field)
											{
												if(!!error){DetailError = ("resourcetransfer: Error in query 31");
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (result.affectedRows>0) 
													{														
														var query = pool.query("UPDATE userbase SET FarmWaitFromFriend = 0,WoodWaitFromFriend = 0,StoneWaitFromFriend =0 ,MetalWaitFromFriend = 0,ResourceTransferToBaseOfFriend = 0,ResourceTransferToUserNameOfFriend = '',TimeCompleteResourceTransferFromFriend = 0, TimeRemainResourceTransferFromFriend = 0 where UserName = '"+arrayUserTransfer[index].UserName
							                			+"' AND numberBase = '"+parseFloat(arrayUserTransfer[index].numberBase)+"'",function(error, result, field)
														{
															if(!!error){DetailError = ("resourcetransfer: Error in query 32");
																console.log(DetailError);
																functions.writeLogErrror(DetailError);	
															}else
															{
																if (result.affectedRows>0) 
																{														
																	if (gameServer.clients.length>0) 
																	{	
																		var query = pool.query("SELECT * FROM `userbase` WHERE UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                												+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"' ",function(error, rows,field)
																		{
																			if (!!error){DetailError = ("resourcetransfer: Error in query 33");
																				console.log(DetailError);
																				functions.writeLogErrror(DetailError);	
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayUserTransferComplete=rows;
																					for (var k = 0; k < arrayMember.length; k++) 
																					{
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('R_TRANSFER_RESOURCE_FRIEND_COMPLETE',
																							{
																								arrayTransferResourceFriend:arrayUserTransferComplete,
																		                	});							                														  									  								                	
																			  			}	
																					}
																				}
																			}
																		});						  																		  				
														  			}
																}
															}
														});
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
												if(!!error){DetailError = ("resourcetransfer: Error in query 34");
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (result.affectedRows>0) 
													{														
														var query = pool.query("UPDATE userbase SET FarmWaitFromFriend = 0,WoodWaitFromFriend = 0,StoneWaitFromFriend =0 ,MetalWaitFromFriend = 0,ResourceTransferToBaseOfFriend = 0,ResourceTransferToUserNameOfFriend = '',TimeCompleteResourceTransferFromFriend = 0, TimeRemainResourceTransferFromFriend = 0 where UserName = '"+arrayUserTransfer[index].UserName
							                			+"' AND numberBase = '"+parseFloat(arrayUserTransfer[index].numberBase)+"'",function(error, result, field)
														{
															if(!!error){DetailError = ("resourcetransfer: Error in query 35");
																console.log(DetailError);
																functions.writeLogErrror(DetailError);	
															}else
															{
																if (result.affectedRows>0) 
																{														
																	if (gameServer.clients.length>0) 
																	{	
																		var query = pool.query("SELECT * FROM `userbase` WHERE UserName = '"+arrayUserTransfer[index].ResourceTransferToUserNameOfFriend
					                												+"'AND numberBase = '"+arrayUserTransfer[index].ResourceTransferToBaseOfFriend+"' ",function(error, rows,field)
																		{
																			if (!!error){DetailError = ("resourcetransfer: Error in query 36");
																				console.log(DetailError);
																				functions.writeLogErrror(DetailError);	
																			}else
																			{
																				if (rows.length>0) 
																				{
																					arrayUserTransferComplete=rows;
																					for (var k = 0; k < arrayMember.length; k++) 
																					{
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
																			  			{																				  				
																		  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('R_TRANSFER_RESOURCE_FRIEND_COMPLETE',
																							{
																								arrayTransferResourceFriend:arrayUserTransferComplete,
																		                	});							                														  									  								                	
																			  			}	
																					}
																				}
																			}
																		});						  																		  				
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
				  		}			 
					}
				}
			})	
		});
    }
}

function getcurrentSENDRESOURCETRANSFER(data)
{
	return currentSENDRESOURCETRANSFER =
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
}

function getcurrentSENDRESOURCETRANSFERBASE(data)
{
	return currentSENDRESOURCETRANSFERBASE =
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
}

function getcurrentSENDRESOURCETRANSFERBASEBASECOMPLETE(data)
{
	return currentSENDRESOURCETRANSFERBASEBASECOMPLETE =
		{
			UserName:data.UserName,	
			numberBaseSend:data.numberBaseSend,
			numberBaseReceive:data.numberBaseReceive,			
			FarmTotalReceive:data.FarmTotalReceive,
			WoodTotalReceive:data.WoodTotalReceive,
			StoneTotalReceive:data.StoneTotalReceive,
			MetalTotalReceive:data.MetalTotalReceive,					
		}
}

function getcurrentSENDRESOURCETRANSFERTOFRIEND(data)
{
	return currentSENDRESOURCETRANSFERTOFRIEND =
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
}

function getcurrentSENDRESOURCEFROMBASETRANSFERTOUNIT(data)
{
	return currentSENDRESOURCEFROMBASETRANSFERTOUNIT =
		{
			UserName:data.UserName,				
			numberBaseSend:data.numberBaseSend,
			UnitOrderReceive:data.UnitOrderReceive,	
			FarmSend:data.FarmSend,			
			FarmTotalSend:data.FarmTotalSend,							
		}
}