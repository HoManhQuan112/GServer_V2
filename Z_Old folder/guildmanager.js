'use strict';
var pool = require('./db');
var lodash		    = require('lodash');
var datetime 		= require('node-datetime');
var cron 			= require('node-cron');
var currentSENDREQUESTENTERTOGUILD,currentSENDREQUESTETOCREATEGUILD,currentSENDCHANGERESOURCEDIAMONDGUILD,currentSENDREMOVEMEMBERINGUILD,
currentSENDACCEPTINVITEWITHGUILD,currentSENDACCEPTINVITEWITHGUILD,currentSENDTRANSFERRESOURCEDOFGUILDTOUSER,currentSENDCANCELFRIEND,currentSENDMEMBEROOUTGUILD
,currentSENDREQUESTENTERTOGUILDBYUSER,d,createPositionTimelast,arrayDetailBase =[],arrayResponseInviteByGuild =[],currentSENDREJECTINVITEWITHGUILD,currentSENDCHANGERESOURCEGUILD
,arrayLeader =[],currentSENDREJECTINVITEWITHGUILDBYLEADER,currentSENDACCEPTJOINGUILDBYLEADER,SENDUPGUILD,currentSENDDOWNMEMBERINGUILD,currentSENDUPMEMBERINGUILD,arraySendUpMember =[]
,arrayMemberUp =[],arrayResponseAcceptJoinGuildByLeader =[],arrayALLLeader =[],arrayPolicyChange = [],arrayGuildDonate = [];
module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	//user gửi request tham gia guil
        	socket.on('SENDREQUESTENTERTOGUILD', function (data)
			{
				currentSENDREQUESTENTERTOGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,															
				}
				console.log("data receive SENDREQUESTENTERTOGUILD ============: "+ currentSENDREQUESTENTERTOGUILD.UserName+"_"
											+ currentSENDREQUESTENTERTOGUILD.GuildName);					
				
				pool.getConnection(function(err,connection)
				{				
					connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName
												+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILD.UserName+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdft434fh');
							socket.emit('RECEIVEREQUESTENTERTOGUILD', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{											
							if (rows.length > 0) 
							{								
								socket.emit('RECEIVEREQUESTENTERTOGUILD', 
								{
			                		message : 0,
			            		});
			            		connection.release();
								console.log("gửi mail");
							}else
							{
								connection.query("SELECT * FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the queryhgsdft434fh');
										socket.emit('RECEIVEREQUESTENTERTOGUILD', 
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
											connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`) VALUES ('"+""+"','"+currentSENDREQUESTENTERTOGUILD.GuildName+"','"+parseFloat(rows[0].GuildName)+"','"+currentSENDREQUESTENTERTOGUILD.UserName
												+"','"+0+"','"+(parseFloat(createPositionTimelast)+14400)+"','"+0+"','"+""+"','"+"Member"+"')",function(error, result, field)
											{
									            if(!!err){console.log('Error in the queryhgsdft434fhs');
									            }else
									            {
									            	if (result.affectedRows>0) 
									            	{										            		
									            		connection.query("SELECT MemberName FROM `guildlistmember` WHERE PositionGuild = 'Leader' AND `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 1hfgdsf34hf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayALLLeader = rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;
																	for (var i = 0; i < arrayALLLeader.length; i++) 
															  		{
															  			console.log(arrayALLLeader[i].MemberName);															  			
															  			if ((lodash.filter(gameServer.clients, x => x.name === arrayALLLeader[i].MemberName)).length >0) 
															  			{															  				
													                		console.log("Gui cho Leader Join");
													                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayALLLeader[i].MemberName)].idSocket).emit('SENDJOINGUILDTOLEADER',
																			{
																				UserName:currentSENDREQUESTENTERTOGUILD.UserName,																	
																				
														                	});					                	
															  			}													  							  			
															  		}
															  		connection.release();			 
																}
															}
														})
									            	}
									            }
									        });
										}
									}
								});								
							}
						}

					});					     	
		   		});		
			}); 

        	//Leader gửi lời mời user khác tham gia guild
			socket.on('SENDREQUESTENTERTOGUILDBYUSER', function (data)
			{
				currentSENDREQUESTENTERTOGUILDBYUSER =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,
					InviteByUser:data.InviteByUser,															
				}
				console.log("data receive SENDREQUESTENTERTOGUILDBYUSER ============: "+ currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"_"
											+ currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser+"_"
											+ currentSENDREQUESTENTERTOGUILDBYUSER.GuildName);									
				pool.getConnection(function(err,connection)
				{	
					connection.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"' ",function(error, rows,field)
					{
						if (!!error){console.log('Error in the queryhgsdft434dffh');							
						}else
						{															
							if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
							{
								connection.query("SELECT idguildlist,`GuildName`,`Level` FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
									+"' UNION ALL SELECT idguildlistmember,`GuildName`,`LevelGuild` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
									+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"' AND `InviteByUser` !=''",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the queryhgsdft434fh');
										socket.emit('RECEIVEREQUESTENTERTOGUILDBYUSER', 
										{
					                		message : 0
					            		});
										console.log("gửi mail");
									}else
									{											
										if (rows.length <= 0) 
										{								
											d = new Date();
					        				createPositionTimelast = Math.floor(d.getTime() / 1000);
											connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`) VALUES ('"+""+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
												+"','"+parseFloat(rows[0].Level)+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"','"+0+"','"
												+(parseFloat(createPositionTimelast)+14400)+"','"+0+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser+"','"+"Member"+"')",function(error, result, field)
											{
									            if(!!err){console.log('Error in the queryhgsdft434');
									            }else
									            {
									            	if (result.affectedRows>0) 
									            	{										            		
									            		//gui chi tiết lời mời lên cho các leader khác đang online và user được mời
									            		connection.query("SELECT MemberName,PositionGuild FROM `guildlistmember` WHERE (MemberName ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
									            			+"' OR PositionGuild = 'Leader') AND GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 1hfg34sdfhf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayResponseInviteByGuild = rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;
																	for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
															  		{
															  			console.log(arrayResponseInviteByGuild[i].MemberName);															  			
															  			if ((lodash.filter(gameServer.clients, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
															  			{
															  				console.log("Gui cho user: " +arrayResponseInviteByGuild[i].PositionGuild);
															  				if (arrayResponseInviteByGuild[i].PositionGuild === 'Member') 
								  											{		
								  												console.log("Gui cho member: "+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket);										  				
															  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('RECEIVEACCEPTINVITEWITHGUILDMEMBER',
																				{																			
																					GuildName:currentSENDREQUESTENTERTOGUILDBYUSER.GuildName,																	
															                	});
														                	}else
														                	{
														                		console.log("Gui cho Leader: "+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket );
														                		io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('RECEIVEACCEPTINVITEWITHGUILDLEADER',
																				{
																					UserName:currentSENDREQUESTENTERTOGUILDBYUSER.UserName,																		
																					InviteByUser:currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser,
															                	});
														                	}				                	
															  			}													  							  			
															  		}
															  		connection.release();			 
																}
															}
														})
									            	}
									            }
									        });
										}
									}
								});	
							}
						}
					});											     	
		   		});		
			});  

			//Gửi request tạo guild
			socket.on('SENDREQUESTETOCREATEGUILD', function (data)
			{
				currentSENDREQUESTETOCREATEGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,																			
				}
				console.log("data receive SENDREQUESTETOCREATEGUILD============: "+ currentSENDREQUESTETOCREATEGUILD.UserName+"_"
											+ currentSENDREQUESTETOCREATEGUILD.GuildName);
				pool.getConnection(function(err,connection)
				{				
					connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE  ActiveStatus = 1 AND (`MemberName` ='"+currentSENDREQUESTETOCREATEGUILD.UserName
						+"' OR `GuildName` ='"+currentSENDREQUESTETOCREATEGUILD.GuildName+"')",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryhgsdft434fh');
							socket.emit('RECEIVEREQUESTENTERTOGUILD', 
							{
		                		message : 0
		            		});
							console.log("gửi mail");
						}else
						{											
							if (rows.length > 0) 
							{
								console.log("Bạn đã xin yeu cau tu mot guild khác");
								socket.emit('RECEIVEREQUESTETOCREATEGUILD', 
								{
			                		message : 0,
			            		});
			            		connection.release();
								console.log("gửi mail");
							}else
							{	
								connection.query("SELECT A.Diamond,C.MaxStorage, C.Diamond as Diamondconsumption FROM users AS A INNER JOIN resourceupguild AS C ON C.Level =0 AND A.UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the queryhgsdft434fh');
										socket.emit('RECEIVEREQUESTENTERTOGUILD', 
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
											connection.query("INSERT INTO `guildlist`(`idGuildList`, `GuildName`, `LeaderName`, `Level`,`MaxStorage`, `Diamond`, `Quality`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"',0,'"+rows[0].MaxStorage+"',0,1)",function(error, result, field)
											{
									            if(!!error){console.log('Error in the queryhgsdft434fhsgf');
									            }else
									            {
									            	if (result.affectedRows > 0) 
									            	{	
									            		console.log("insert guildlist thành công create guild");									            		
									            		connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`, `InviteByUser`, `PositionGuild`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"',0,'"+currentSENDREQUESTETOCREATEGUILD.UserName+"',1,0,0,'','Leader')",function(error, result, field)
														{
												            if(!!error){console.log('Error in the queryhgsdft434fhsgf');
												            }else
												            {
												            	if (result.affectedRows > 0) 
												            	{	
												            		console.log("insert thành công member create guild");
												            		socket.emit('RECEIVEREQUESTENTERTOGUILD', 
																	{
												                		Diamond : (parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))
												            		});
												            		connection.query("UPDATE users SET GuildName = '"+currentSENDREQUESTETOCREATEGUILD.GuildName
												            			+"',Diamond = Diamond - '"+parseFloat(rows[0].Diamondconsumption)
																		+"' WHERE UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query1132g46fafd');
																		}else
																		{
																			if (result.affectedRows>0) 
																			{
																				console.log("update Diamond Sau khi tao gui thanh cong");
																				io.emit('USERCREATEGUILD',{
														                        	UserName:currentSENDREQUESTETOCREATEGUILD.UserName,		
																					GuildName:currentSENDREQUESTETOCREATEGUILD.GuildName,
														                    	});	
														                    	 //insert policy
																		        connection.query("INSERT INTO `policys`(`idPolicys`, `GuildName`, `LeaderName`, `Details`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"','')",function(error, result, field)
																				{
																		            if(!!error) {console.log('Error in the queryhgsdft434fhsgf');}
																		            else{connection.release();}
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
					});					     	
		   		});	
			});   

			//User được mời chấp nhận vào vào guild
			socket.on('SENDACCEPTINVITEWITHGUILD', function (data)
			{
				currentSENDACCEPTINVITEWITHGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,															
				}
				console.log("data receive SENDACCEPTINVITEWITHGUILD============: "+ currentSENDACCEPTINVITEWITHGUILD.UserName+"_"
											+ currentSENDACCEPTINVITEWITHGUILD.GuildName);
				var query = pool.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"' ",function(error, rows,field)
				{
					if (!!error){console.log('Error in the queryhgsdft434dffh');							
					}else
					{											
						if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
						{
							var query = pool.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTINVITEWITHGUILD.GuildName)	                			
		            			+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.InviteByUser != '' AND guildlistmember.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName
		            			+"'AND guildlistmember.ActiveStatus = 0 AND guildlistmember.MemberName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"'",function(error, result, field)
							{
								if(!!error){console.log('Error in the query113434grfafd');
								}else
								{
									if (result.affectedRows>0) 
									{											
										var query = pool.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 1hfg34dfshf');
											}else
											{
												if (rows.length>0) 
												{														
													arrayResponseInviteByGuild = rows;
													var GameServer = require("./login");
													var gameServer = new GameServer();
													exports.gameServer = gameServer;
													for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
											  		{
											  			console.log(arrayResponseInviteByGuild[i].MemberName);
											  			if ((lodash.filter(gameServer.clients, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
											  			{
											  				if (arrayResponseInviteByGuild[i].MemberName===currentSENDACCEPTINVITEWITHGUILD.UserName) 
											  				{	
											  					console.log("LAy data gui thanh cong gưi len member");	
											  					console.log("1: "+ gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket);										  					
											  					socket.emit(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('RECEIVEACCEPTINVITEWITHGUILDNEWMEMBER',
																{
																	arrayResponseInviteByGuild:arrayResponseInviteByGuild,																		
											                	});
											  				}else
											  				{
											  					console.log("LAy data gui thanh cong gui len all member");
											  					console.log("2: "+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket);
											  					socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('RECEIVEACCEPTINVITEWITHGUILDALLMEMBER',
																{
																	UserName:(arrayResponseInviteByGuild[arrayResponseInviteByGuild.findIndex(item => item.MemberName === currentSENDACCEPTINVITEWITHGUILD.UserName)]),																		
											                	});
											  				}									  															  								                	
											  			}													  							  			
											  		}			 
												}
											}
										})
										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
										var query = pool.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 1hf34fdsghf');
											}else
											{
												if (rows.length>0) 
												{
													io.emit('INFOMATIONGUILD',{
							                        	GuildName : rows,
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
			}); 

			//hủy lời mời tham gia guild bởi user    
			socket.on('SENDREJECTINVITEWITHGUILD', function (data)
			{
				currentSENDREJECTINVITEWITHGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,															
				}
				console.log("data receive SENDREJECTINVITEWITHGUILD============: "+ currentSENDREJECTINVITEWITHGUILD.UserName+"_"
											+ currentSENDREJECTINVITEWITHGUILD.GuildName);					
				
				pool.getConnection(function(err,connection)
				{				
					connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILD.GuildName
						+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILD.UserName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query113434grfafd');
						}else
						{
							if (result.affectedRows>0) 
							{								
								connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDREJECTINVITEWITHGUILD.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 1hfghghhf');
									}else
									{
										if (rows.length>0) 
										{
											arrayLeader = rows;
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;
											for (var i = 0; i < arrayLeader.length; i++) 
									  		{
									  			console.log(arrayLeader[i].MemberName);
									  			if ((lodash.filter(gameServer.clients, x => x.name === arrayLeader[i].MemberName)).length >0) 
									  			{
								  					console.log("LAy data gui thanh cong gui len leader: "+ arrayLeader[i].MemberName);
								  					console.log("2: "+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[i].MemberName)].idSocket);
								  					socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[i].MemberName)].idSocket).emit('RECEIVEREJECTINVITEWITHGUILDBYMEMBER',
													{
														UserName:currentSENDREJECTINVITEWITHGUILD.UserName,																		
								                	});									  													  															  								                
									  			}													  							  			
									  		}
									  		connection.release();			 
										}			
									}
								})						
							}
						}
					});				     	
		   		});		
			}); 

			//hủy lời mời tham gia guild bởi leader    
			socket.on('SENDREJECTINVITEWITHGUILDBYLEADER', function (data)
			{
				currentSENDREJECTINVITEWITHGUILDBYLEADER =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,															
				}
				console.log("data receive SENDREJECTINVITEWITHGUILDBYLEADER============: "+ currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"_"
											+ currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName);					
				
				pool.getConnection(function(err,connection)
				{	
					var arrayResetJoin=[],arrayLeader=[]; 
					connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName
						+"'AND GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"'",function(error, rows,field)
					{
						if (!!error){console.log('Error in the query 1hfghhgghf');
						}else
						{
							if (rows.length>0) 
							{
								arrayResetJoin = rows;
								connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName
									+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"'",function(error, result, field)
								{
									if(!!error){console.log('Error in the query113434grfafd');
									}else
									{
										if (result.affectedRows>0) 
										{											
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;
											if (gameServer.clients.length>0) 
											{	
												//gửi client
									  			if ((lodash.filter(gameServer.clients, x => x.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)).length >0) 
									  			{	
									  				console.log("Gửi lên user: "+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)].idSocket)						  				
									  				
								  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)].idSocket).emit('RECEIVEREJECTINVITEWITHGUILDBYLEADER',
													{
														ExpireInviteToJoinGuild:arrayResetJoin[0],
								                	});							                							                	
									  									  								                	
									  			}	
									  			//gửi leader					  			
									  			connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows,field)
												{													
													if (!!error){console.log('Error in the query 1hfghghghf');
													}else
													{
														if (rows.length>0) 
														{
															arrayLeader = rows;												
															for (var k = 0; k < arrayLeader.length; k++) 
															{
																if ((lodash.filter(gameServer.clients, x => x.name === arrayLeader[k].MemberName)).length >0) 
													  			{	
													  				console.log("Gửi lên leader: "+arrayLeader[k].MemberName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket);					  													  								  																	  				
												  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('RECEIVEREJECTINVITEWITHGUILDBYLEADER',
																	{
																		ExpireInviteToJoinGuild:arrayResetJoin[0],
												                	});							                														  									  								                	
													  			}	
															}	
															connection.release();												
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
		   		});		
			});

			//Leader chấp nhận lời yêu cầu vào guild 
			socket.on('SENDACCEPTJOINGUILDBYLEADER', function (data)
			{
				currentSENDACCEPTJOINGUILDBYLEADER =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,	
					LeaderAccept: data.LeaderAccept,														
				}
				console.log("data receive SENDACCEPTJOINGUILDBYLEADER============: "+ currentSENDACCEPTJOINGUILDBYLEADER.UserName+"_"
											+ currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"_"+currentSENDACCEPTJOINGUILDBYLEADER.LeaderAccept);																
				var query = pool.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTJOINGUILDBYLEADER.GuildName)	                			
        			+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName
        			+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.ActiveStatus = 0 AND guildlistmember.GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName
        			+"'AND guildlistmember.MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"'",function(error, result, field)
				{
					if(!!error){console.log('Error in the query113434grfafd');
					}else
					{
						if (result.affectedRows>0) 
						{								
							var query = pool.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows,field)
							{
								if (!!error){console.log('Error in the query 1hfgh34fdf');
								}else
								{
									if (rows.length>0) 
									{											
										arrayResponseAcceptJoinGuildByLeader = rows;
										var GameServer = require("./login");
										var gameServer = new GameServer();
										exports.gameServer = gameServer;
										for (var i = 0; i < arrayResponseAcceptJoinGuildByLeader.length; i++) 
								  		{
								  			console.log(arrayResponseAcceptJoinGuildByLeader[i].MemberName);
								  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
								  			console.log ("length: "+(lodash.filter(gameServer.clients, x => x.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)).length);
								  			if ((lodash.filter(gameServer.clients, x => x.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)).length >0) 
								  			{
								  				console.log(arrayResponseAcceptJoinGuildByLeader[i].MemberName+"_"+currentSENDACCEPTJOINGUILDBYLEADER.UserName);	
								  				if (arrayResponseAcceptJoinGuildByLeader[i].MemberName===currentSENDACCEPTJOINGUILDBYLEADER.UserName) 
								  				{										  					
								  					socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('RECEIVEACCEPTJOINGUILDBYLEADERNEWMEMBER',
													{
														arrayResponseAcceptJoinGuildByLeader:arrayResponseAcceptJoinGuildByLeader,																		
								                	});
								  				}else
								  				{
								  					socket.emit(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('RECEIVEACCEPTJOINGUILDBYLEADERALLMEMBER',
													{
														UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
								                	});
									  			
									  				socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('RECEIVEACCEPTJOINGUILDBYLEADERALLMEMBER',
													{
														UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
								                	});
								  				}									  															  								                	
								  			}													  							  			
								  		}			 
									}			
								}
							})
							//Gửi thông tin cho tất cả các người chơi về gui hiện tại
							var query = pool.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows,field)
							{
								if (!!error){console.log('Error in the query 1hgfhhfghf');
								}else
								{
									if (rows.length>0) 
									{
										io.emit('INFOMATIONGUILD',{
				                        	GuildName : rows,
				                    	});
									}
								}
							});
							//xóa các lời mời của guild khác và lời join
							var query = pool.query("DELETE FROM guildlistmember WHERE MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"' AND ActiveStatus = 0",function(error, result, field)
						  	{
								if(!!error){console.log('Error in the queryfgfg7567');
								}
							})
						}
					}
				});				     	
		   				
			});     
			
			//leader từ chối lời yêu cầu vào guild
			socket.on('SENDREJECTJOINGUILDBYLEADER', function (data)
			{
				currentSENDREJECTJOINGUILDBYLEADER =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,
					LeaderReject: data.LeaderReject,															
				}
				console.log("data receive SENDREJECTJOINGUILDBYLEADER============: "+ currentSENDREJECTJOINGUILDBYLEADER.UserName+"_"
											+ currentSENDREJECTJOINGUILDBYLEADER.GuildName+"_"+ currentSENDREJECTJOINGUILDBYLEADER.LeaderReject);					
				
				pool.getConnection(function(err,connection)
				{				
					connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTJOINGUILDBYLEADER.GuildName
						+"'AND ActiveStatus = 0 AND MemberName = '"+currentSENDREJECTJOINGUILDBYLEADER.UserName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query113434grfafd');
						}else
						{
							if (result.affectedRows>0) 
							{								
								connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDREJECTJOINGUILDBYLEADER.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 1hfhgfhgfdghf');
									}else
									{
										if (rows.length>0) 
										{																												
											arrayLeader = rows;
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;
											for (var i = 0; i < arrayLeader.length; i++) 
									  		{									  			
									  			if ((lodash.filter(gameServer.clients, x => x.name === arrayLeader[i].MemberName)).length >0) 
									  			{									  				
								  					socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[i].MemberName)].idSocket).emit('RECEIVEREJECTJOINGUILDBYLEADER',
													{
														UserName:currentSENDREJECTJOINGUILDBYLEADER.UserName,																		
								                	});									  													  															  								                	
									  			}													  							  			
									  		}	
									  		connection.release();		 
										}
									}
								})
							}
						}
					});				     	
		   		});		
			});

			//Send Up Member
			socket.on('SENDUPMEMBERINGUILD', function (data)
			{
				currentSENDUPMEMBERINGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,																		
				}
				console.log("data receive SENDUPMEMBERINGUILD============: "+ currentSENDUPMEMBERINGUILD.UserName+"_"											
											+ currentSENDUPMEMBERINGUILD.GuildName);
				var arrayMemberDown = [],arrayMemberChange = [];															
				var query = pool.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, rows,field)
				{
					if (!!error){console.log('Error in the queryhgsdft434dffh');							
					}else
					{											
						if (rows.length > 0)
						{
							arraySendUpMember = rows;
							if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDUPMEMBERINGUILD.UserName)].PositionGuild==="Member") 
							{
								if((lodash.filter(arraySendUpMember, x => x.PositionGuild === "CoLeader")).length<4)
								{
									//nâng cấp member lên CoLeader và thông báo cho các user khác
									var query = pool.query("UPDATE guildlistmember SET PositionGuild = 'CoLeader' where GuildName = '"+
										currentSENDUPMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, result, field)
									{
										if(!!error){console.log('Error in the query113434grfafd');
										}else
										{
											if (result.affectedRows>0) 
											{													
												var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
													+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 1hfgdshf');
													}else
													{
														if (rows.length>0) 
														{
															arrayMemberChange = rows;																
															var GameServer = require("./login");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arraySendUpMember.length; i++) 
													  		{														  			
													  			if ((lodash.filter(gameServer.clients, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
													  			{	
												  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('RECEIVEUPMEMBERINGUILD',
																	{
																		arrayMemberChange:arrayMemberChange,																		
												                	});														  													  															  								                	
													  			}													  							  			
													  		}			 
														}
													}
												})
											}
										}
									});
								}
							}else
							{											
								var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
									+"' AND PositionGuild = 'Leader'",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 1hfghdfgf');
									}else
									{
										if (rows.length>0) 
										{
											arrayMemberDown = rows;
											var query = pool.query("UPDATE guildlistmember SET PositionGuild = CASE WHEN GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
												+"' AND PositionGuild = 'Leader' THEN 'CoLeader' WHEN  GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
												+"' AND `MemberName` = '"+currentSENDUPMEMBERINGUILD.UserName
												+"' THEN 'Leader' ELSE PositionGuild END",function(error, result, field)
											{
												if(!!error){console.log('Error in the query113434grfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
															+"' AND (MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"' OR MemberName = '"+arrayMemberDown[0].MemberName+"')",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 1hfgdsf453hf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayMemberChange = rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;																
																	for (var i = 0; i < arraySendUpMember.length; i++) 
															  		{
															  			console.log(arraySendUpMember[i].MemberName);
															  			if ((lodash.filter(gameServer.clients, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
															  			{	
														  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('RECEIVEUPMEMBERINGUILD',
																			{
																				arrayMemberChange:arrayMemberChange,																		
														                	});													  													  															  								                	
															  			}													  							  			
															  		}			 
																}	
															}
														})	
														//cập nhật policy
														var query = pool.query("UPDATE policys SET LeaderName = '"+currentSENDUPMEMBERINGUILD.UserName+"' where GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error){console.log('Error in the query113434grfafd');}
														});																										  	
													}
												}
											});														 
										}		
									}
								})						
							}
						}
					}
				});								
			}); 

			//Send Down Member
			socket.on('SENDDOWNMEMBERINGUILD', function (data)
			{
				currentSENDDOWNMEMBERINGUILD =
				{
					UserName:data.UserName,		
					GuildName:data.GuildName,																		
				}
				console.log("data receive SENDDOWNMEMBERINGUILD============: "+ currentSENDDOWNMEMBERINGUILD.UserName+"_"											
											+ currentSENDDOWNMEMBERINGUILD.GuildName);
				var arrayMemberDown = [],arrayMemberChange = [];												
				
				pool.getConnection(function(err,connection)
				{	
					connection.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName+"'",function(error, rows,field)
					{
						if (!!error){console.log('Error in the queryhgsdft434dffh');							
						}else
						{											
							if (rows.length > 0)
							{
								arraySendUpMember = rows;
								if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDDOWNMEMBERINGUILD.UserName)].PositionGuild==="CoLeader") 
								{									
									//nâng cấp member lên CoLeader và thông báo cho các user khác
									connection.query("UPDATE guildlistmember SET PositionGuild = 'Member' where GuildName = '"+
										currentSENDDOWNMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, result, field)
									{
										if(!!error){console.log('Error in the query113434grfafd');
										}else
										{
											if (result.affectedRows>0) 
											{												
												connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName
													+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, rows,field)
												{
													if (!!error){console.log('Error in the query 1hfgsdf43hf');
													}else
													{
														if (rows.length>0) 
														{
															arrayMemberChange = rows;															
															var GameServer = require("./login");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arraySendUpMember.length; i++) 
													  		{
													  			console.log(arraySendUpMember[i].MemberName);
													  			if ((lodash.filter(gameServer.clients, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
													  			{	
												  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('RECEIVEDOWNMEMBERINGUILD',
																	{
																		arrayMemberChange:arrayMemberChange,																		
												                	});													  													  															  								                	
													  			}													  							  			
													  		}
													  		connection.release();			 
														}
													}
												})
											}
										}
									});
								}
							}
						}
					});														     	
		   		});		
			});

			//Policy
			socket.on('SENDPOLICYOFGUILD', function (data)
			{				
				currentSENDPOLICYOFGUILD =
				{							
					GuildName : data.GuildName,
					LeaderName : data.LeaderName,	
					Details : data.Details,
				}
				console.log("data receive SENDPOLICYOFGUILD============: "+ currentSENDPOLICYOFGUILD.Details+"_"
											+ currentSENDPOLICYOFGUILD.LeaderName+"_"											
											+ currentSENDPOLICYOFGUILD.GuildName);																		
				pool.getConnection(function(err,connection)
				{	
					//nâng cấp member lên CoLeader và thông báo cho các user khác
					connection.query("UPDATE policys SET Details = '"+ currentSENDPOLICYOFGUILD.Details+"' where GuildName = '"+
						currentSENDPOLICYOFGUILD.GuildName+"' AND LeaderName = '"+currentSENDPOLICYOFGUILD.LeaderName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query113434grfafd');
						}else
						{
							if (result.affectedRows>0) 
							{
								connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDPOLICYOFGUILD.GuildName+"'",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 1hfghsdf34f');
									}else
									{
										if (rows.length>0) 
										{
											arrayPolicyChange = rows;
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;																
											for (var i = 0; i < arrayPolicyChange.length; i++) 
									  		{
									  			console.log(arrayPolicyChange[i].MemberName);
									  			if ((lodash.filter(gameServer.clients, x => x.name === arrayPolicyChange[i].MemberName)).length >0) 
									  			{	
								  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayPolicyChange[i].MemberName)].idSocket).emit('RECEIVEPOLICYCHANGE',
													{
														GuildName : currentSENDPOLICYOFGUILD.GuildName,
														LeaderName : currentSENDPOLICYOFGUILD.LeaderName,	
														Details : currentSENDPOLICYOFGUILD.Details,																																
								                	});								  															  								                	
									  			}													  							  			
									  		}	
									  		connection.release();		 
										}		
									}
								})	
							}
						}
					});													     	
		   		});		
			});	

			//Đóng góp cho guild
			socket.on('SENDRESOURCEDONATE', function (data)
			{				
				currentSENDRESOURCEDONATE =
				{							
					GuildName : data.GuildName,
					UserName : data.UserName,
					GuildLevel : data.GuildLevel,
					numberBase: data.numberBase,	
					Diamond : data.Diamond,					
					DiamondQuality : data.DiamondQuality,
					Farm : data.Farm,														
					FarmQuality : data.FarmQuality,
					Wood : data.Wood,									
					WoodQuality : data.WoodQuality,
					Stone : data.Stone,									
					StoneQuality : data.StoneQuality,
					Metal : data.Metal,														
					MetalQuality : data.MetalQuality,
				}
				console.log("data receive SENDRESOURCEDONATE============: "+ currentSENDRESOURCEDONATE.GuildName+"_"
											+ currentSENDRESOURCEDONATE.UserName+"_"
											+ currentSENDRESOURCEDONATE.Diamond+"_"
											+ currentSENDRESOURCEDONATE.numberBase+"_"
											+ currentSENDRESOURCEDONATE.DiamondQuality+"_"
											+ currentSENDRESOURCEDONATE.Farm+"_"
											+ currentSENDRESOURCEDONATE.FarmQuality+"_"
											+ currentSENDRESOURCEDONATE.Wood+"_"
											+ currentSENDRESOURCEDONATE.WoodQuality+"_"
											+ currentSENDRESOURCEDONATE.Stone+"_"
											+ currentSENDRESOURCEDONATE.StoneQuality+"_"
											+ currentSENDRESOURCEDONATE.Metal+"_"
											+ currentSENDRESOURCEDONATE.MetalQuality);																		
				pool.getConnection(function(err,connection)
				{	
					var arrayDiamondGuild = [];
					//Lấy diamond
					connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal, C.TimeTransport FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourceupguild AS C ON C.Level = '"+
						currentSENDRESOURCEDONATE.GuildLevel+"' WHERE A.UserName = '"+currentSENDRESOURCEDONATE.UserName+"'AND B.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, rows,field)
					{
						if (!!error) {console.log('Error in the queryhjkhjk');
						}else
						{
							console.log((parseFloat(rows[0].Diamond) -parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Diamond)
								+"_"+(parseFloat(rows[0].Farm) -parseFloat(currentSENDRESOURCEDONATE.FarmQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Farm)
								+"_"+(parseFloat(rows[0].Wood) -parseFloat(currentSENDRESOURCEDONATE.WoodQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Wood)
								+"_"+(parseFloat(rows[0].Stone) -parseFloat(currentSENDRESOURCEDONATE.StoneQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Stone)
								+"_"+(parseFloat(rows[0].Metal) -parseFloat(currentSENDRESOURCEDONATE.MetalQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Metal));
							 
							if ((rows.length>0)
								&&((parseFloat(rows[0].Diamond) -parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
								&&(parseFloat(currentSENDRESOURCEDONATE.FarmQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.WoodQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.StoneQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.MetalQuality)=== 0))  
							{
								//update tài nguyên còn lại của base		                		
								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.TimeComplete ='"+0
									+"',guildlistmember.TimeRemain ='"+0								
									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
								{
									if(!!error){console.log('Error in the query113434grfafd');
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows,field)
											{
												if (!!error){console.log('Error in the query 1hfgsdr34hf');
												}else
												{
													if (rows.length>0) 
													{
														arrayDiamondGuild = rows;
														connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 1hfg34eashf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayGuildDonate = rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;																
																	for (var i = 0; i < arrayGuildDonate.length; i++) 
															  		{
															  			console.log(arrayGuildDonate[i].MemberName);
															  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
															  			{	
														  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('RECEIVERESOURCEDIAMONDDONATE',
																			{
																				Diamond:arrayDiamondGuild,																																																																								
														                	});								  															  								                	
															  			}													  							  			
															  		}	
															  		connection.release();		 
																}
															}
														})
													}
												}
											});											
										}
									}
								});					
							}else if ((rows.length>0)
								&&((parseFloat(rows[0].Diamond) -parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
								&&((parseFloat(rows[0].Farm) -parseFloat(currentSENDRESOURCEDONATE.FarmQuality))=== parseFloat(currentSENDRESOURCEDONATE.Farm))
								&&((parseFloat(rows[0].Wood) -parseFloat(currentSENDRESOURCEDONATE.WoodQuality))=== parseFloat(currentSENDRESOURCEDONATE.Wood))
								&&((parseFloat(rows[0].Stone) -parseFloat(currentSENDRESOURCEDONATE.StoneQuality))=== parseFloat(currentSENDRESOURCEDONATE.Stone))
								&&((parseFloat(rows[0].Metal) -parseFloat(currentSENDRESOURCEDONATE.MetalQuality))=== parseFloat(currentSENDRESOURCEDONATE.Metal)))  
							{
								//update tài nguyên còn lại của base
		                		d = new Date();
		        				createPositionTimelast = Math.floor(d.getTime() / 1000);
								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.TimeComplete ='"+(parseFloat(rows[0].TimeTransport)+parseFloat(createPositionTimelast))
									+"',guildlistmember.TimeRemain ='"+parseFloat(rows[0].TimeTransport)
									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
								{
									if(!!error){console.log('Error in the query113434grfafd');
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows,field)
											{
												if (!!error){console.log('Error in the query 1hffsea34hf');
												}else
												{
													if (rows.length>0) 
													{
														arrayDiamondGuild = rows;
														connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 1hfgh3qasf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayGuildDonate = rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;																
																	for (var i = 0; i < arrayGuildDonate.length; i++) 
															  		{
															  			console.log(arrayGuildDonate[i].MemberName);
															  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
															  			{	
														  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('RECEIVERESOURCEDIAMONDDONATE',
																			{
																				Diamond:arrayDiamondGuild,																																																																												
														                	});								  															  								                	
															  			}													  							  			
															  		}
															  		connection.release();			 
																}
															}
														})
													}
												}
											});											
										}
									}
								});					

							}else
							{														
								//gửi mail
								console.log("Hack face time");
								connection.release();
								socket.emit('RECEIVERESOURCEDONATE',
								{
									checkResource:0,
			                	});
							}
						}
					});						     	
		   		});		
			});	

			//Update guild
			socket.on('SENDUPGUILD', function (data)
			{
				var arrayAfterUpdate = [], arrayGuildDonate = [],DiamondRemain =0; 			
				currentSENDUPGUILD =
				{							
					GuildName : data.GuildName,					
				}			
				console.log("data receive SENDUPGUILD=========: "+currentSENDUPGUILD.GuildName);														
				pool.getConnection(function(err,connection)
				{	
					connection.query("SELECT A.Diamond As DiamondConsumption, A.Level, B.Diamond FROM resourceupguild AS A INNER JOIN guildlist AS B WHERE B.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND  A.Level = B.Level + 1",function(error, rows,field)
					{
						if (!!error){console.log('Error in the queryhjhjkhjk');
						}else
						{	 
							if ((rows.length>0))  
							{
								//tính toán dử liệu sau khi nâng cấp								
								arrayAfterUpdate.push(rows[0].Level);
								arrayAfterUpdate.push(currentSENDUPGUILD.GuildName);
								DiamondRemain = parseFloat(rows[0].Diamond - rows[0].DiamondConsumption);
								
								//thực hiện nâng cấp guild
								connection.query("UPDATE guildlist,guildlistmember SET guildlist.Diamond = '"+DiamondRemain+"',guildlist.Level = '"+rows[0].Level+"', guildlistmember.LevelGuild = '"+rows[0].Level
									+"' where guildlist.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND guildlistmember.GuildName = '"+currentSENDUPGUILD.GuildName+"'",function(error, result, field)
								{
									if(!!error){console.log('Error in the query113434gr6ffafd');
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT UserName FROM `users` WHERE 1",function(error, rows,field)
											{
												if (!!error){console.log('Error in the query 1hfg43qrahf');
												}else
												{
													if (rows.length>0) 
													{
														arrayAfterUpdate.push(DiamondRemain); 
														arrayGuildDonate = rows;
														var GameServer = require("./login");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;																
														for (var i = 0; i < arrayGuildDonate.length; i++) 
												  		{
												  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildDonate[i].UserName)).length >0) 
												  			{	
											  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildDonate[i].UserName)].idSocket).emit('RECEIVEREDATAUPGUILD',
																{
																	arrayAfterUpdate:arrayAfterUpdate,																																																																					
											                	});								  															  								                	
												  			}													  							  			
												  		}
												  		connection.release();			 
													}
												}
											})
										}
									}
								});

							}else
							{
								//hack hoặc không đủ dk nâng cấp
								console.log("hack hoặc không đủ dk nâng cấp");
								connection.release();
								socket.emit('RECEIVEUPGUILD',
								{
									checkResource:0,
			                	});
							}
						}
					});
				});
			});

			//remove member in guild 
			socket.on('SENDREMOVEMEMBERINGUILD', function (data)
			{				
				currentSENDREMOVEMEMBERINGUILD =
				{							
					GuildName : data.GuildName,
					UserName : data.UserName,
				}
				var arrayUserRemoved =[],arrayGuildNotify =[],arrayAllUsers =[];
				console.log("===============data receive SENDREMOVEMEMBERINGUILD: "+currentSENDREMOVEMEMBERINGUILD.GuildName+"_"+currentSENDREMOVEMEMBERINGUILD.UserName);
									
				//update tài nguyên còn lại của base
        		d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				var query = pool.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
					+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDREMOVEMEMBERINGUILD.UserName
					+"'AND guildlist.GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName									
					+"'AND guildlistmember.MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, result, field)
				{
					if(!!error){console.log('Error in the query113434grfajknfd');
					}else
					{
						if (result.affectedRows>0) 
						{
							var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName
										+"' AND MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, rows,field)
							{
								if (!!error){console.log('Error in the query 1hfgh65fsdf');
								}else
								{
									if (rows.length>0) 
									{
										arrayUserRemoved =rows;
										var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 1hf34afgghf');
											}else
											{
												if (rows.length>0) 
												{
													arrayGuildNotify = rows;
													var GameServer = require("./login");
													var gameServer = new GameServer();
													exports.gameServer = gameServer;																
													for (var i = 0; i < arrayGuildNotify.length; i++) 
											  		{
											  			console.log(arrayGuildNotify[i].MemberName);
											  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
											  			{	
										  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVEREMOVEMEMBERINGUILD',
															{
																arrayUserRemoved:arrayUserRemoved,																																																																												
										                	});											  													  															  								                	
											  			}													  							  			
											  		}			 
												}
											}
										})	

										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
										var query = pool.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 1hfgh545sf');
											}else
											{
												if (rows.length>0) 
												{
													arrayAllUsers =rows;															
							                    	var GameServer = require("./login");
													var gameServer = new GameServer();
													exports.gameServer = gameServer;																
													for (var i = 0; i < arrayAllUsers.length; i++) 
											  		{
											  			console.log(arrayAllUsers[i].MemberName);
											  			if ((lodash.filter(gameServer.clients, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
											  			{	
										  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('INFOMATIONGUILD',
															{
																arrayUserRemoved:arrayUserRemoved,																																																																												
										                	});											  													  															  								                	
											  			}													  							  			
											  		}
												}
											}
										});												
									}
								}
							});
						}
					}
				});	
			});

			//chuyển đổi tài nguyên từ tài nguyên này thành tài nguyên khác
			socket.on('SENDCHANGERESOURCEGUILD', function (data)
			{
				currentSENDCHANGERESOURCEGUILD =
				{							
					GuildName : data.GuildName,
					UserName : data.UserName,
					NameResourceFrom: data.NameResourceFrom,
					QualityResourceFrom: data.QualityResourceFrom,
					NameResourceTo: data.NameResourceTo,					
					DiamondUse: data.DiamondUse, 
				}
				console.log("=========Data receive SENDCHANGERESOURCEGUILD "+currentSENDCHANGERESOURCEGUILD.GuildName
					+"_"+currentSENDCHANGERESOURCEGUILD.UserName
					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceFrom
					+"_"+currentSENDCHANGERESOURCEGUILD.QualityResourceFrom
					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceTo
					+"_"+currentSENDCHANGERESOURCEGUILD.DiamondUse);
				var checkQuality,arrayGuildNotify=[],PercentChange=0;

				switch(currentSENDCHANGERESOURCEGUILD.DiamondUse) 
				{										
					case "0":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.5;
					}break;
					case "1":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.6;
					}break;
					case "2":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.7;
					}break;
					case "3":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.8;
					}break;
					case "4":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.9;
					}break;
					case "5":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*1;
					}break;
					default:
    				
				}

				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 1hfgsdf34hf');
						}else
						{
							if (rows.length>0) 
							{
								switch(currentSENDCHANGERESOURCEGUILD.NameResourceFrom) 
								{
									case "Farm":
									{
										if (rows[0].Farm >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											switch(currentSENDCHANGERESOURCEGUILD.NameResourceTo) 
											{										
												case "Wood":
												{
													connection.query("UPDATE guildlist SET Farm = Farm - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Wood = Wood +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113FG434g46fafd');}
													});

												}break;
												case "Stone":
												{
													connection.query("UPDATE guildlist SET Farm = Farm - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Stone = Stone +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g464fafd');}
													});

												}break;
												case "Metal":
												{
													connection.query("UPDATE guildlist SET Farm = Farm - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Metal = Metal +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g6746fafd');}
													});

												}break;
												default:
						        				console.log(" mac dinh");
											}

										}
										
									}break;
									case "Wood":
									{
										if (rows[0].Wood >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											switch(currentSENDCHANGERESOURCEGUILD.NameResourceTo) 
											{										
												case "Farm":
												{
													connection.query("UPDATE guildlist SET Wood = Wood - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Farm = Farm +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g4FH6fafd');}
													});

												}break;
												case "Stone":
												{
													connection.query("UPDATE guildlist SET Wood = Wood - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Stone = Stone +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46fGFafd');}
													});

												}break;
												case "Metal":
												{
													connection.query("UPDATE guildlist SET Wood = Wood - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Metal = Metal +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g4FH6fafd');}
													});

												}break;
												default:
						        				console.log(" mac dinh");
											}

										}else
										{
											console.log("Gui mail");
										}
										
									}break;
									case "Stone":
									{
										if (rows[0].Stone >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											switch(currentSENDCHANGERESOURCEGUILD.NameResourceTo) 
											{										
												case "Wood":
												{
													connection.query("UPDATE guildlist SET Stone = Stone - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Wood = Wood +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query11356434g46fafd');}
													});

												}break;
												case "Farm":
												{
													connection.query("UPDATE guildlist SET Stone = Stone - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Farm = Farm +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46fGFHafd');}
													});

												}break;
												case "Metal":
												{
													connection.query("UPDATE guildlist SET Stone = Stone - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Metal = Metal +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46fJJKafd');}
													});

												}break;
												default:
						        				console.log(" mac dinh");
											}

										}else
										{
											console.log("Gui mail");
										}
										
									}break;
									case "Metal":
									{
										if (rows[0].Metal >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											switch(currentSENDCHANGERESOURCEGUILD.NameResourceTo) 
											{										
												case "Wood":
												{
													connection.query("UPDATE guildlist SET Metal = Metal - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Wood = Wood +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46faf878d');}
													});

												}break;
												case "Stone":
												{
													connection.query("UPDATE guildlist SET Metal = Metal - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Stone = Stone +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46fJKJKafd');}
													});

												}break;
												case "Farm":
												{
													connection.query("UPDATE guildlist SET Metal = Metal - '"+parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)
														+"',Farm = Farm +'"+parseFloat(PercentChange)
														+"',Diamond = Diamond -'"+parseFloat(currentSENDCHANGERESOURCEGUILD.DiamondUse)
														+"'  where GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434g46f5Fafd');}
													});

												}break;
												default:
						        				console.log(" mac dinh");
											}
										}
										
									}break;
									default:
			        				console.log(" mac dinh");
								}
								connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the query 1hfgsdf34hf');
									}else
									{
										if (rows.length>0) 
										{
											arrayGuildNotify = rows;
											connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 1hfghsdr34f');
												}else
												{
													if (rows.length>0) 
													{
														var GameServer = require("./login");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;																
														for (var i = 0; i < arrayGuildNotify.length; i++) 
												  		{
												  			console.log(arrayGuildNotify[i].MemberName);
												  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
												  			//console.log ("length: "+(lodash.filter(clients, x => x.name === "dungphi101")).length);
												  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
												  			{	
											  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVERERESOURCECHANGE',
																{
																	arrayResourceChange:rows[0],																																																																												
											                	});	
											                	 connection.release();										  													  															  								                	
												  			}													  							  			
												  		}	
													}
												}
											});													 
										}else
										{

										}				

									}
								})	

							}else
							{
								console.log("Hack sss");
							}
						}
					});

				});
					
			});

			//chuyển tai nguyen thanh kim cương
			socket.on('SENDCHANGERESOURCEDIAMONDGUILD', function (data)
			{				
				currentSENDCHANGERESOURCEDIAMONDGUILD =
				{							
					GuildName : data.GuildName,					
					NameResourceFrom: data.NameResourceFrom,					
				}
				console.log("Data receive SENDCHANGERESOURCEDIAMONDGUILD"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName					
					+"_"+currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom);
				var checkResourceaDiamond=625000,arrayGuildNotify=[],PercentChange=0,arrayGuild=[];
				pool.getConnection(function(err,connection)
				{
					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 1hfghsdfsdf34f');
						}else
						{
							if (rows.length>0) 
							{	
								arrayGuild = rows;
								//trong ngày công dồn
								connection.query("SELECT Quality FROM `resourcetodiamond` WHERE idresourcetodiamond = '"+(parseFloat(arrayGuild[0].numberResourceToDiamon)+1)+"'",function(error, rows,field)
								{
									if (!!error)
									{
										console.log('Error in the query 1hfsdf34ghf');
									}else
									{
										if (rows.length>0) 
										{
											//cộng dồn bình thường
											switch(currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom) 
											{
												case "Farm":
												{
													console.log("Farm: "+ parseFloat(rows[0].Quality)+"_"+parseFloat(arrayGuild[0].Farm));
													if (parseFloat(arrayGuild[0].Farm)>=parseFloat(rows[0].Quality))
													{
														connection.query("UPDATE guildlist SET Farm = Farm - '"+parseFloat(rows[0].Quality)														
																	+"',Diamond = Diamond + 1,numberResourceToDiamon =numberResourceToDiamon+1 where GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query113FG434g46fafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	console.log("update thanh cong sau khi hoan tat time Farm");	
																	connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 1hf45wsghf');
																		}else
																		{
																			if (rows.length>0) 
																			{
																				arrayGuildNotify = rows;
																				connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 1hfsdf34qghf');
																					}else
																					{
																						if (rows.length>0) 
																						{
																							console.log("select member thanh cong gui thanh cong");																
																							var GameServer = require("./login");
																							var gameServer = new GameServer();
																							exports.gameServer = gameServer;																
																							for (var i = 0; i < arrayGuildNotify.length; i++) 
																					  		{
																					  			console.log(arrayGuildNotify[i].MemberName);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === "dungphi101")).length);
																					  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
																					  			{	
																				  					console.log("LAy data gui thanh cong gưi len tât ca member");	
																				  					console.log("1: "+ gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket);										  					
																				  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVERERESOURCECHANGEDIAMOND',
																									{
																										arrayResourceChange:rows[0],																																																																												
																				                	});	
																				                	 connection.release();										  													  															  								                	
																					  			}													  							  			
																					  		}	
																						}
																					}
																				});													 
																			}else
																			{

																			}				

																		}
																	})									
																}else
																{
																	console.log("update khong thanh cong");
																}
															}
														});

													}else
													{
														console.log("Gui mail farm");
													}
													
												}break;

												case "Wood":
												{
													console.log("Wood: "+ parseFloat(rows[0].Quality)+"_"+parseFloat(arrayGuild[0].Wood));
													if (parseFloat(arrayGuild[0].Wood)>=parseFloat(rows[0].Quality))
													{
														connection.query("UPDATE guildlist SET Wood = Wood - '"+parseFloat(rows[0].Quality)														
																	+"',Diamond = Diamond + 1,numberResourceToDiamon =numberResourceToDiamon+1 where GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query113FG434g46fafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	console.log("update thanh cong sau khi hoan tat time Wood");	
																	connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 1hfsdf34qghfghf');
																		}else
																		{
																			if (rows.length>0) 
																			{
																				arrayGuildNotify = rows;
																				connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 1hfgSDF433hf');
																					}else
																					{
																						if (rows.length>0) 
																						{
																							console.log("select member thanh cong gui thanh cong");																
																							var GameServer = require("./login");
																							var gameServer = new GameServer();
																							exports.gameServer = gameServer;																
																							for (var i = 0; i < arrayGuildNotify.length; i++) 
																					  		{
																					  			console.log(arrayGuildNotify[i].MemberName);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === "dungphi101")).length);
																					  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
																					  			{	
																				  					console.log("LAy data gui thanh cong gưi len tât ca member");	
																				  					console.log("1: "+ gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket);										  					
																				  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVERERESOURCECHANGEDIAMOND',
																									{
																										arrayResourceChange:rows[0],																																																																												
																				                	});	
																				                	 connection.release();										  													  															  								                	
																					  			}													  							  			
																					  		}	
																						}
																					}
																				});													 
																			}else
																			{

																			}				

																		}
																	})									
																}else
																{
																	console.log("update khong thanh cong");
																}
															}
														});

													}else
													{
														console.log("Gui mail wood");
													}
													
												}break;

												case "Stone":
												{
													console.log("Stone: "+ parseFloat(rows[0].Quality)+"_"+parseFloat(arrayGuild[0].Stone));
													if (parseFloat(arrayGuild[0].Stone)>=parseFloat(rows[0].Quality))
													{
														connection.query("UPDATE guildlist SET Stone = Stone - '"+parseFloat(rows[0].Quality)														
																	+"',Diamond = Diamond + 1,numberResourceToDiamon =numberResourceToDiamon+1 where GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query113FG434g46fafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	console.log("update thanh cong sau khi hoan tat time Stone");		
																	connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 1hfghSDFAERf');
																		}else
																		{
																			if (rows.length>0) 
																			{
																				arrayGuildNotify = rows;
																				connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 1h3Q4Qafghf');
																					}else
																					{
																						if (rows.length>0) 
																						{
																							console.log("select member thanh cong gui thanh cong");																
																							var GameServer = require("./login");
																							var gameServer = new GameServer();
																							exports.gameServer = gameServer;																
																							for (var i = 0; i < arrayGuildNotify.length; i++) 
																					  		{
																					  			console.log(arrayGuildNotify[i].MemberName);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === "dungphi101")).length);
																					  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
																					  			{	
																				  					console.log("LAy data gui thanh cong gưi len tât ca member");	
																				  					console.log("1: "+ gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket);										  					
																				  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVERERESOURCECHANGEDIAMOND',
																									{
																										arrayResourceChange:rows[0],																																																																												
																				                	});	
																				                	 connection.release();										  													  															  								                	
																					  			}													  							  			
																					  		}	
																						}
																					}
																				});													 
																			}else
																			{
																			}			
																		}
																	})								
																}else
																{
																	console.log("update khong thanh cong");
																}
															}
														});
													}else
													{
														console.log("Gui mail");
													}	

												}break;

												case "Metal":
												{
													console.log("Metal: "+ parseFloat(rows[0].Quality)+"_"+parseFloat(arrayGuild[0].Metal));
													if (parseFloat(arrayGuild[0].Metal)>=parseFloat(rows[0].Quality))
													{
														connection.query("UPDATE guildlist SET Metal = Metal - '"+parseFloat(rows[0].Quality)														
																	+"',Diamond = Diamond + 1,numberResourceToDiamon =numberResourceToDiamon+1 where GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the query113FG434g46fafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	console.log("update thanh cong sau khi hoan tat time Metal");	
																	connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 1hfgh34q34aSf');
																		}else
																		{
																			if (rows.length>0) 
																			{
																				arrayGuildNotify = rows;
																				connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query 1hfghqw	Sf');
																					}else
																					{
																						if (rows.length>0) 
																						{
																							console.log("select member thanh cong gui thanh cong");																
																							var GameServer = require("./login");
																							var gameServer = new GameServer();
																							exports.gameServer = gameServer;																
																							for (var i = 0; i < arrayGuildNotify.length; i++) 
																					  		{
																					  			console.log(arrayGuildNotify[i].MemberName);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
																					  			//console.log ("length: "+(lodash.filter(clients, x => x.name === "dungphi101")).length);
																					  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
																					  			{	
																				  					console.log("LAy data gui thanh cong gưi len tât ca member");	
																				  					console.log("1: "+ gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket);										  					
																				  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVERERESOURCECHANGEDIAMOND',
																									{
																										arrayResourceChange:rows[0],																																																																												
																				                	});	
																				                	 connection.release();										  													  															  								                	
																					  			}													  							  			
																					  		}	
																						}
																					}
																				});													 
																			}else
																			{
																			}			
																		}
																	})									
																}else
																{
																	console.log("update khong thanh cong");
																}
															}
														});
													}else
													{
														console.log("Gui mail");
													}										

												}break;

												default:
						        				console.log(" mac dinh");
											}
										}
									}
								});																									

							}else
							{
								//hack
							}
						}
					});

				});
					
			});

			//Chuyển tài nguyên của guild cho một user->base
			socket.on('SENDTRANSFERRESOURCEDOFGUILDTOUSER', function (data)
			{				
				currentSENDTRANSFERRESOURCEDOFGUILDTOUSER =
				{							
					GuildName : data.GuildName,					
					UserName: data.UserName,
					idBase: data.idBase,	
					Farm: data.Farm,
					Wood: data.Wood,
					Stone: data.Stone,
					Metal: data.Metal,				
				}
				console.log("data receive SENDTRANSFERRESOURCEDOFGUILDTOUSER"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone+"_"+
					currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
				arraySentResourceOfGuildToUser=[],arrayGuildAfterSendResourceBase=[],FarmFromGuild=0,WoodFromGuild=0,StoneFromGuild=0,MetalFromGuild=0;
				pool.getConnection(function(err,connection)
				{

					connection.query("SELECT A.`MaxStorage`, B.Wood, B.Stone, B.Farm, B.Metal FROM resourceupgranary AS A INNER JOIN userbase AS B ON A.Level = B.LvGranary WHERE B.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase+"'",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 1hfqw12ghf');
						}else
						{
							if (rows.length>0) 
							{
								if ((parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm))>parseFloat(rows[0].MaxStorage))
								{
									FarmFromGuild = parseFloat(rows[0].MaxStorage);
								}else
								{
									FarmFromGuild=parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm);
								}
								if((parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood))>parseFloat(rows[0].MaxStorage))
								{
									WoodFromGuild = parseFloat(rows[0].MaxStorage);
								}else
								{
									WoodFromGuild=parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood);
								}
									
								if((parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone))>parseFloat(rows[0].MaxStorage))
								{
									StoneFromGuild = parseFloat(rows[0].MaxStorage);
								}else
								{
									StoneFromGuild = parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone);
								}
								
								if((parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal))>parseFloat(rows[0].MaxStorage))
								{
									MetalFromGuild = parseFloat(rows[0].MaxStorage);
								}else
								{
									MetalFromGuild = parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
								}	

								connection.query("UPDATE userbase,guildlist SET userbase.Farm = '"+parseFloat(FarmFromGuild)
								+"',userbase.Wood = '"+parseFloat(WoodFromGuild)
								+"',userbase.Stone = '"+parseFloat(StoneFromGuild)
								+"',userbase.Metal = '"+parseFloat(MetalFromGuild)
								+"',guildlist.Farm = guildlist.Farm - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm)
								+"',guildlist.Wood = guildlist.Wood - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood)
								+"',guildlist.Stone = guildlist.Stone - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone)
								+"',guildlist.Metal = guildlist.Metal - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal)		
								+"'where userbase.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
			        			+"' AND guildlist.GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query113434grfafd');
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query 1hfgh34q34aSfwhf');
												}else
												{
													if (rows.length>0) 
													{
														arraySentResourceOfGuildToUser = rows;
														connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 1hfgQWS231hf');
															}else
															{
																if (rows.length>0) 
																{
																	arrayGuildAfterSendResource =rows;
																	var GameServer = require("./login");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;console.log("LAy data gui thanh cong gưi len member moi dc nhan resource: "+parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase));	
												  					connection.query("SELECT * FROM `userbase` WHERE idBase = '"+parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase)+"'",function(error, rows,field)
																	{
																		if (!!error)
																		{
																			console.log('Error in the query 1hfgh34q34aSfwhf12ghf');
																		}else
																		{
																			if (rows.length>0) 
																			{
																				arrayGuildAfterSendResourceBase=rows;
																				for (var i = 0; i < arraySentResourceOfGuildToUser.length; i++) 
																		  		{
																		  			console.log(arraySentResourceOfGuildToUser[i].MemberName);
																		  			var index=i;
																		  			//console.log ("length: "+(lodash.filter(clients, x => x.name === arrayResetJoin[i].MemberName)).length);
																		  			console.log ("length: "+(lodash.filter(gameServer.clients, x => x.name === arraySentResourceOfGuildToUser[index].MemberName)).length);
																		  			if ((lodash.filter(gameServer.clients, x => x.name === arraySentResourceOfGuildToUser[index].MemberName)).length >0) 
																		  			{															  				
																		  				if (arraySentResourceOfGuildToUser[index].MemberName===currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName) 
													  									{
																							io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('RECEIVERERESOURCEFROMGUIDMEMBER',
																							{
																								arrayGuildAfterSendResourceBase:arrayGuildAfterSendResourceBase,																						

																		                	});
																						}		
																		                console.log("LAy data gui thanh cong cho cac Member trong guild");	
																  						io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('RECEIVERERESOURCEFROMGUIDTOALLMEMBER',
																						{
																							arrayGuildAfterSendResource:arrayGuildAfterSendResource,																		
																	                	});						  																		  																			  												  															  								                	
																		  			}													  							  			
																		  		}
																		  	}
																		 }
																	});
																}
															}
														});
																	 
													}else
													{
														console.log("Select khong thay");

													}				

												}
											})							

										}else
										{
											console.log("update khong thanh cong");
										}
									}
								});
							}
						}
					});
					
				});
				
			});

			//User out guild 
			socket.on('SENDMEMBEROOUTGUILD', function (data)
			{				
				currentSENDMEMBEROOUTGUILD =
				{							
					GuildName : data.GuildName,
					UserName : data.UserName,
				}
				var arrayUserRemoved =[],arrayGuildNotify =[],arrayAllUsers =[];
				console.log("data receive SENDMEMBEROOUTGUILD: "+currentSENDMEMBEROOUTGUILD.GuildName+"_"+currentSENDMEMBEROOUTGUILD.UserName);
				pool.getConnection(function(err,connection)
				{
					
					//update tài nguyên còn lại của base
            		d = new Date();
    				createPositionTimelast = Math.floor(d.getTime() / 1000);
					connection.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
						+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDMEMBEROOUTGUILD.UserName
						+"'AND guildlist.GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName									
						+"'AND guildlistmember.MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query113434grfajknfd');
							}else
							{
								if (result.affectedRows>0) 
								{
									connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName
												+"' AND MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query 1hfgh65fsdf');
										}else
										{
											if (rows.length>0) 
											{
												arrayUserRemoved =rows;
												connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 1hf34afgghf');
													}else
													{
														if (rows.length>0) 
														{
															arrayGuildNotify = rows;
															var GameServer = require("./login");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arrayGuildNotify.length; i++) 
													  		{
													  			console.log(arrayGuildNotify[i].MemberName);
													  			if ((lodash.filter(gameServer.clients, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
													  			{	
												  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('RECEIVEMEMBEROOUTGUILD',
																	{
																		arrayUserRemoved:arrayUserRemoved,																																																																												
												                	});
													  													  															  								                	
													  			}													  							  			
													  		}			 
														}else
														{

														}				

													}
												})	

												//Gửi thông tin cho tất cả các người chơi về gui hiện tại
												connection.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 1hfgh545sf');
													}else
													{
														if (rows.length>0) 
														{
															arrayAllUsers =rows;															
									                    	var GameServer = require("./login");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arrayAllUsers.length; i++) 
													  		{
													  			console.log(arrayAllUsers[i].MemberName);
													  			if ((lodash.filter(gameServer.clients, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
													  			{	
												  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('INFOMATIONGUILD',
																	{
																		arrayUserRemoved:arrayUserRemoved,																																																																												
												                	});													  													  															  								                	
													  			}													  							  			
													  		}
														}
													}
												});												
											}
										}
									});
									
								}else
								{
									console.log("update khong thanh cong");
								}

							}
						});							

				});

			});
        })
		cron.schedule('*/1 * * * * *',function()
		{			
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);
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
										var GameServer = require("./login");
									    var gameServer = new GameServer();
									    exports.gameServer = gameServer;									
										if (gameServer.clients.length>0) 
										{		
								  			if ((lodash.filter(gameServer.clients, x => x.name === arrayResetJoin[index].MemberName)).length >0) 
								  			{								  				
								  				
							  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayResetJoin[index].MemberName)].idSocket).emit('RECEIVERESETJOINGUILD',
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
															if ((lodash.filter(gameServer.clients, x => x.name === arrayLeader[k].MemberName)).length >0) 
												  			{													  				
											  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('RECEIVERESETJOINGUILD',
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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;
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
										
										if (gameServer.clients.length>0) 
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
															if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k].UserName)).length >0) 
												  			{													  				
											  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k].UserName)].idSocket).emit('RECEIVERESETOUTGUILD',
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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;					
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
												FarmRemain = parseFloat(arrayMaxStorage[0].MaxStorage);											 
											}else
											{
												FarmRemain = (arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm));											
											}

											if ((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{												
												WoodRemain = parseFloat(arrayMaxStorage[0].MaxStorage);

											}else
											{
												WoodRemain = (arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood));											
											}

											if ((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{												
												StoneRemain = parseFloat(arrayMaxStorage[0].MaxStorage);
											}
											else
											{
												StoneRemain = (arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone));												
											}

											if ((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))
											{												
												MetalRemain = parseFloat(arrayMaxStorage[0].MaxStorage);												
											}else
											{
												MetalRemain = (arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal));												
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
														if (gameServer.clients.length>0) 
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
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayAllMemberGuilds[k].MemberName)).length >0) 
																			  			{	
																			  				io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket).emit('RECEIVEDONATECOMPLETE',
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
														if (gameServer.clients.length>0) 
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
																						if ((lodash.filter(gameServer.clients, x => x.name === arrayAllMemberGuilds[k].MemberName)).length >0) 
																			  			{	
																			  				io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket).emit('RECEIVEDONATECOMPLETE',
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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;
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
							  			if ((lodash.filter(gameServer.clients, x => x.name === arrayAllGuild[i].LeaderName)).length >0) 
							  			{							  					
						  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuild[i].LeaderName)].idSocket).emit('RECEIVERERESETRESOURCECHANGEDIAMOND',
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
		});
    }
}