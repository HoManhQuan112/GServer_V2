'use strict';
var pool 			= require('./../db.js');
var GameServer 		= require("./../login.js");
var cron 			= require('node-cron');
var client 			= require('./../redis.js');
var currentSENDADDFRIEND,currentSENDACCEPTFRIEND,currentSENDCANCELFRIEND,currentSENDREJECTINVITEFRIEND,d,createPositionTimelast,MineHarvestServer=0,arrayClients=[];

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {        	
			socket.on('SENDADDFRIEND', function(data)
			{
				currentSENDADDFRIEND =
				{
					UserNameFriendA:data.UserNameFriendA,
					UserNameFriendB:data.UserNameFriendB,																
				}		
				console.log("data receive SENDADDFRIEND==========: "+currentSENDADDFRIEND.UserNameFriendA+"_"+currentSENDADDFRIEND.UserNameFriendB);				
				//kiểm tra socket client			
				pool.getConnection(function(err,connection)
				{	
					//kiểm tra đã là bạn chưa
					connection.query("SELECT * FROM `addfriend` WHERE (`UserNameFriendA`= '"+currentSENDADDFRIEND.UserNameFriendA
						+"' AND `UserNameFriendB`='"+currentSENDADDFRIEND.UserNameFriendB
						+"') OR (`UserNameFriendB`= '"+currentSENDADDFRIEND.UserNameFriendA
						+"' AND `UserNameFriendA`='"+currentSENDADDFRIEND.UserNameFriendB+"')",function(error, rows,field)
					{
						if (!!error){console.log('Error in the queryhgsdbft4juhgghsdds3434fh');												
						}else
						{	
							if (rows.length<=0) 
							{
								connection.query("INSERT INTO `addfriend`(`idaddFriend`, `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus`) VALUES ('"+""+"','"+currentSENDADDFRIEND.UserNameFriendA+"','"+currentSENDADDFRIEND.UserNameFriendB+"','"+0+"')",function(error, result, field)
								{
									if (!!error){console.log('Error in the queryhgsdbft4juhgghsdds3434lfh');																		
									}else
									{	
										if (result.affectedRows>0) 
										{
											//lưu kết bạn thanh cong																				
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;		
											if (gameServer.clients.length>0) 
											{								
												for (var i = 0; i < gameServer.clients.length; i++) 
												{									
													if (gameServer.clients[i].name===currentSENDADDFRIEND.UserNameFriendB) 
													{																																	
														socket.broadcast.to(gameServer.clients[i].idSocket).emit('RECEIVEADDFRIEND',
														{
															UserNameAddFriend:currentSENDADDFRIEND.UserNameFriendA,
									                	});							                	
													}
												}
											}
											connection.release();									
										}
									}
								});											
							}
						}
					});
				});
			});

			socket.on('SENDACCEPTFRIEND', function (data)
			{							
				currentSENDACCEPTFRIEND =
				{
					UserNameFriendA:data.UserNameFriendA,																				
					UserNameFriendB:data.UserNameFriendB,
				}
				console.log("SENDACCEPTFRIEND=========="+currentSENDACCEPTFRIEND.UserNameFriendA+"_"+currentSENDACCEPTFRIEND.UserNameFriendB+"La bạn====================");		
				//kiểm tra gioi han bạn
				var query = pool.query("SELECT `numberFriends`,`UserName` FROM `users` WHERE UserName ='"+currentSENDACCEPTFRIEND.UserNameFriendA+"' UNION ALL SELECT `numberFriends`,`UserName` FROM `users` WHERE UserName ='"+currentSENDACCEPTFRIEND.UserNameFriendB+"'",function(error, rows,field)
				{
					if (!!error){console.log('Error in the queryhgsdbft4juhgghsdds3434fh');													
					}else
					{
						if (rows.length>0 && ((parseFloat(rows[0].numberFriends)>=20)||(parseFloat(rows[1].numberFriends)>=20))) 
						{	
							//số lượng bạn đã full						
							socket.emit('RECIEVEFULLACCEPTFRIEND', 
							{
		                		UserNameFriendB : currentSENDACCEPTFRIEND.UserNameFriendB,                    		
		            		});						
						}else if (rows.length>0)
						{
							var query = pool.query("UPDATE users, addfriend SET users.numberFriends = users.numberFriends +1 ,addfriend.ActiveStatus = 1 where (users.UserName = '"+currentSENDACCEPTFRIEND.UserNameFriendA
								+"' OR users.UserName = '"+currentSENDACCEPTFRIEND.UserNameFriendB+"'  ) AND addfriend.UserNameFriendB = '"+currentSENDACCEPTFRIEND.UserNameFriendA
		            			+"'AND addfriend.UserNameFriendA = '"+currentSENDACCEPTFRIEND.UserNameFriendB+"'",function(error, result, field)
							{
								if(!!error){console.log('Error in the query113434gfafd');
								}else
								{
									if (result.affectedRows>0) 
									{																		
										var GameServer = require("./login");
										var gameServer = new GameServer();
										exports.gameServer = gameServer;		
										if (gameServer.clients.length>0) 
										{									
											for (var i = 0; i < gameServer.clients.length; i++) 
											{																																
												if ((gameServer.clients[i].name===currentSENDACCEPTFRIEND.UserNameFriendA)) 
												{
													console.log("Gửi thong bao ket ban đến user: "+currentSENDACCEPTFRIEND.UserNameFriendA);
													socket.emit('RECEIVESENDACCEPTFRIEND',
													{
														UserNameAddFriendA:currentSENDACCEPTFRIEND.UserNameFriendA,
														UserNameAddFriendB:currentSENDACCEPTFRIEND.UserNameFriendB,
								                	});	
												}
												if(gameServer.clients[i].name===currentSENDACCEPTFRIEND.UserNameFriendB) 
												{
													console.log("Gửi thong bao ket ban đến user: "+currentSENDACCEPTFRIEND.UserNameFriendB);
													socket.broadcast.to(gameServer.clients[i].idSocket).emit('RECEIVESENDACCEPTFRIEND',
													{
														UserNameAddFriendA:currentSENDACCEPTFRIEND.UserNameFriendA,
														UserNameAddFriendB:currentSENDACCEPTFRIEND.UserNameFriendB,
								                	});						                												
												}																																																
											}

											//cập nhật bạn của nhau trong redis
											var query = pool.query("SELECT `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus` FROM `addfriend` WHERE `UserNameFriendB`= '"+currentSENDACCEPTFRIEND.UserNameFriendA
											+"' AND `UserNameFriendA`='"+currentSENDACCEPTFRIEND.UserNameFriendB+"'",function(error, rows,field)
											{
												if (!!error){console.log('Error in the query4xcvf');
												}else
												{	
													if (rows.length>0) 
													{																																
														//update resid															        					
						        						client.set(rows[0].UserNameFriendA+rows[0].UserNameFriendB,JSON.stringify(rows[0]));			        																																				
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

			//hủy lời mời
			socket.on('SENDREJECTINVITEFRIEND', function (data)
			{
				
				currentSENDREJECTINVITEFRIEND =
				{
					UserNameFriendA:data.UserNameFriendA,																				
					UserNameFriendB:data.UserNameFriendB,
				}
				console.log("data receive SENDREJECTINVITEFRIEND ========================:"+currentSENDREJECTINVITEFRIEND.UserNameFriendA+"_"+currentSENDREJECTINVITEFRIEND.UserNameFriendB);

				var query = pool.query("DELETE FROM `addfriend` WHERE ActiveStatus = 0 AND ((`UserNameFriendA`= '"+currentSENDREJECTINVITEFRIEND.UserNameFriendA
						+"' AND `UserNameFriendB`='"+currentSENDREJECTINVITEFRIEND.UserNameFriendB
						+"') OR (`UserNameFriendB`= '"+currentSENDREJECTINVITEFRIEND.UserNameFriendA
						+"' AND `UserNameFriendA`='"+currentSENDREJECTINVITEFRIEND.UserNameFriendB+"'))",function(error, result, field)
				{
					if(!!error){console.log('Error in the query113434g5fafhyu');
					}else
					{
						if (result.affectedRows>0) 
						{															
							var GameServer = require("./login");
							var gameServer = new GameServer();
							exports.gameServer = gameServer;		
							if (gameServer.clients.length>0) 
							{									
								for (var i = 0; i < gameServer.clients.length; i++) 
								{									
									if (gameServer.clients[i].name===currentSENDREJECTINVITEFRIEND.UserNameFriendB) 
									{										
										console.log("Gửi thong bao huy loi moi ket ban đến user: "+currentSENDREJECTINVITEFRIEND.UserNameFriendB);										
										socket.broadcast.to(gameServer.clients[i].idSocket).emit('RECEIVESENDREJECTINVITEFRIEND',
										{
											UserNameAddFriend:currentSENDREJECTINVITEFRIEND.UserNameFriendA,
					                	});							                	
									}
								}					
							}													
						}
					}
				});
			});

			//Hủy kết bạn
			socket.on('SENDCANCELFRIEND', function (data)
			{
				currentSENDCANCELFRIEND =
				{													
					UserNameFriendA:data.UserNameFriendA,																				
					UserNameFriendB:data.UserNameFriendB,									
				}
				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				var arrayFriendCanceled =[]; 
				console.log("data receive SENDCANCELFRIEND====================: "+currentSENDCANCELFRIEND.UserNameFriendA+"_"+currentSENDCANCELFRIEND.UserNameFriendB);
				var query = pool.query("UPDATE addfriend,users SET users.numberFriends= users.numberFriends-1, addfriend.ActiveStatus = 2,addfriend.TimeCancelFriend = '"+(parseFloat(createPositionTimelast)+3600)+ "'WHERE (users.UserName = '"+currentSENDCANCELFRIEND.UserNameFriendA+"' OR users.UserName='"+currentSENDCANCELFRIEND.UserNameFriendB+"')AND addfriend.ActiveStatus = 1 AND ((addfriend.UserNameFriendA= '"+currentSENDCANCELFRIEND.UserNameFriendA
						+"' AND addfriend.UserNameFriendB='"+currentSENDCANCELFRIEND.UserNameFriendB
						+"') OR (addfriend.UserNameFriendB= '"+currentSENDCANCELFRIEND.UserNameFriendA
						+"' AND addfriend.UserNameFriendA='"+currentSENDCANCELFRIEND.UserNameFriendB+"'))",function(error, result, field)
				{
					if(!!error){console.log('Error in the query113434grfajknfd');
					}else
					{
						if (result.affectedRows>0) 
						{
							var query = pool.query("SELECT * FROM `addfriend` WHERE ActiveStatus = 2 AND ((`UserNameFriendA`= '"+currentSENDCANCELFRIEND.UserNameFriendA
								+"' AND `UserNameFriendB`='"+currentSENDCANCELFRIEND.UserNameFriendB
								+"') OR (`UserNameFriendB`= '"+currentSENDCANCELFRIEND.UserNameFriendA
								+"' AND `UserNameFriendA`='"+currentSENDCANCELFRIEND.UserNameFriendB+"'))",function(error, rows,field)
							{
								if (!!error){console.log('Error in the queryhgsdbft4juhgghsdds3434fh');																	
								}else
								{	
									if (rows.length<=0) 
									{
										arrayFriendCanceled =rows;																		
										var GameServer = require("./login");
										var gameServer = new GameServer();
										exports.gameServer = gameServer;		
										if (gameServer.clients.length>0) 
										{									
											for (var i = 0; i < gameServer.clients.length; i++) 
											{								
												if (gameServer.clients[i].name===currentSENDCANCELFRIEND.UserNameFriendB) 
												{										
													console.log("Gửi thong bao huy ket ban đến user: "+currentSENDCANCELFRIEND.UserNameFriendB);										
													socket.broadcast.to(gameServer.clients[i].idSocket).emit('RECEIVECANCELFRIEND',
													{
														UserNameCancelFriend:arrayFriendCanceled,
								                	});							                	
												}
											}					
										}	
									}
								}
							});							
						}
					}			
				});				
			});	
		});

		cron.schedule('*/1 * * * * *',function()
		{
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);

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
						var GameServer = require("./login");
					    var gameServer = new GameServer();
					    exports.gameServer = gameServer;
						arrayUserCanceled = rows;
						for (var i = 0; i < arrayUserCanceled.length; i++) 
				  		{
				  			var index = i;	
				  			arrayMember.push(arrayUserCanceled[index].UserNameFriendA);
				  			arrayMember.push(arrayUserCanceled[index].UserNameFriendB);				  			
				  			var query = pool.query("DELETE FROM addfriend WHERE ActiveStatus = 2 AND UserNameFriendA = '"+arrayUserCanceled[index].UserNameFriendA
				  				+"' AND UserNameFriendB = '"+arrayUserCanceled[index].UserNameFriendB+"'",function(error, result, field)
						  	{
								if(!!error){console.log('Error in the query 431');
								}else
								{
									if(result.affectedRows>0)
									{
										client.del(arrayUserCanceled[index].UserNameFriendA+arrayUserCanceled[index].UserNameFriendB);										
										if (gameServer.clients.length>0) 
										{									  			
								  			for (var k = 0; k < arrayMember.length; k++) 
											{
												if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
									  			{										  				
								  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVECANCELFRIENDTIME',
													{
														arrayCancelFriend:arrayUserCanceled[index],
								                	});							                														  									  								                	
									  			}	
											}	
							  			}
									}
								}
							})				  			
				  		}			 
					}
				}
			})
		});
    }
}
