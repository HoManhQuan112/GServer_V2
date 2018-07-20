'use strict';
var pool = require('./db');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var currentSENDCHATWORLD = [],currentSENDCHATGUILD = [],currentSENDCHATPRIVATE = [],currentSENDCANCELCHATGUILD = [],currentSENDCANCELCHATPRIVATE = [],
currentSENDOPENCHATGUILD = [],currentSENDOPENCHATPRIVATE = [],d,createPositionTimelast, currentSENDRESPONSECHAT = [];


module.exports = {
    start: function(io) 
    {    
    	io.on('connection', function(socket) 
        {		
        	//Chat thế giới	
			socket.on('SENDCHATWORLD', function (data)
			{
				currentSENDCHATWORLD = getcurrentSENDCHATWORLD(data);
				console.log("data receive SENDCHATWORLD============: "+ currentSENDCHATWORLD.UserName+"_"
											+ currentSENDCHATWORLD.ClientTime+"_"											
											+ currentSENDCHATWORLD.ColorText+"_"											
											+ currentSENDCHATWORLD.Details);
																		
				pool.getConnection(function(err,connection)
				{	
					d = new Date();
    				createPositionTimelast = Math.floor(d.getTime() / 1000);	
					connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
					+currentSENDCHATWORLD.UserName+"','"+currentSENDCHATWORLD.Details+"','"+parseFloat(createPositionTimelast)+"','"+currentSENDCHATWORLD.ClientTime+"','"
					+currentSENDCHATWORLD.ColorText+"')",function(error, result, field)
					{
			            if(!!err){console.log('Error in the query34');
			            }else
			            {
			            	if (result.affectedRows > 0) 
			            	{			            		
			            		socket.broadcast.emit('RECEIVECHATWORLD',
								{
									UserName : currentSENDCHATWORLD.UserName,									
									ColorText : currentSENDCHATWORLD.ColorText,	
									Details : currentSENDCHATWORLD.Details,									
								});	
								connection.release();
			            	}
			            }
			        });					
												     	
		   		});		
			});	

			//chat trong guild
			socket.on('SENDCHATGUILD', function (data)
			{				
				currentSENDCHATGUILD = getcurrentSENDCHATGUILD(data);
				console.log("data receive SENDCHATGUILD============: "+ currentSENDCHATGUILD.UserName+"_"
											+ currentSENDCHATGUILD.ClientTime+"_"											
											+ currentSENDCHATGUILD.ColorText+"_"											
											+ currentSENDCHATGUILD.GuildName+"_"											
											+ currentSENDCHATGUILD.Details);																		
				pool.getConnection(function(err,connection)
				{	
					var arrayAllGuildMember=[];
					d = new Date();
    				createPositionTimelast = Math.floor(d.getTime() / 1000);	
					connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`GuildName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
					+currentSENDCHATGUILD.UserName+"','"+currentSENDCHATGUILD.GuildName+"','"+currentSENDCHATGUILD.Details+"','"+parseFloat(createPositionTimelast)+"','"+currentSENDCHATGUILD.ClientTime+"','"
					+currentSENDCHATGUILD.ColorText+"')",function(error, result, field)
					{
			            if(!!err){console.log('Error in the query34');
			            }else
			            {
			            	if (result.affectedRows > 0) 
			            	{		            					            		
			            		connection.query("SELECT MemberName FROM `guildlistmember` WHERE  `GuildName`='"+currentSENDCHATGUILD.GuildName+"'",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 1hfgdsf34hf');
									}else
									{
										if (rows.length>0) 
										{
											arrayAllGuildMember = rows;
											var GameServer = require("./login");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;
											for (var i = 0; i < arrayAllGuildMember.length; i++) 
									  		{									  			
									  			if ((lodash.filter(gameServer.clients, x => x.name === arrayAllGuildMember[i].MemberName)).length >0) 
									  			{															  				
							                		console.log("Gui cho MemberName guild"+"_"+arrayAllGuildMember[i].MemberName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket);
							                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket).emit('RECEIVECHATGUILD',
													{
														UserName : currentSENDCHATGUILD.UserName,									
														ColorText : currentSENDCHATGUILD.ColorText,	
														Details : currentSENDCHATGUILD.Details,																														
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

			//chat cá nhân
			socket.on('SENDCHATPRIVATE', function (data)
			{				
				currentSENDCHATPRIVATE = getcurrentSENDCHATPRIVATE(data);
				console.log("data receive SENDCHATPRIVATE============: "+ currentSENDCHATPRIVATE.UserName+"_"
											+ currentSENDCHATPRIVATE.ClientTime+"_"											
											+ currentSENDCHATPRIVATE.ColorText+"_"											
											+ currentSENDCHATPRIVATE.ToUserName+"_"											
											+ currentSENDCHATPRIVATE.Details);
																		
				pool.getConnection(function(err,connection)
				{	
					var arrayAllGuildMember=[];
					d = new Date();
    				createPositionTimelast = Math.floor(d.getTime() / 1000);	
    				connection.query("SELECT CheckCloseMessPrivateUser FROM `users` WHERE CheckCloseMessPrivateUser = 1 AND `UserName` = '"+currentSENDCHATPRIVATE.ToUserName+"'",function(error, rows,field)
					{
						if (!!error){console.log('Error in the queryedf4');
						}else
						{
							if (rows.length>0) 
							{
								connection.query("SELECT `idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail` FROM `blacklist` WHERE  (`UserName`='"+currentSENDCHATPRIVATE.UserName
									+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows,field)
								{
									if (!!error){console.log('Error in the queryedfdfdf4');
									}else
									{
										if (rows.length<=0)										
										{
											connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
											+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+1+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(createPositionTimelast)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
											+currentSENDCHATPRIVATE.ColorText+"')",function(error, result, field)
											{
									            if(!!err){console.log('Error in the query34');
									            }else
									            {
									            	if (result.affectedRows > 0) 
									            	{	            											            					            		
														var GameServer = require("./login");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;
														if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
											  			{															  				
									                		console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
									                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('RECEIVECHATPRIVATE',
															{
																UserName : currentSENDCHATPRIVATE.UserName,									
																ColorText : currentSENDCHATPRIVATE.ColorText,	
																Details : currentSENDCHATPRIVATE.Details,																																
										                	});					                	
											  			}	
											  			connection.release();	            		
									            	}
									            }
									        });
										}
									}
								});									
							}else
							{
								connection.query("SELECT `idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail` FROM `blacklist` WHERE  (`UserName`='"+currentSENDCHATPRIVATE.UserName
									+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows,field)
								{
									if (!!error){console.log('Error in the queryeddfdff4');
									}else
									{
										if (rows.length<=0) 
										{
											connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
											+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+0+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(createPositionTimelast)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
											+currentSENDCHATPRIVATE.ColorText+"')",function(error, result, field)
											{
									            if(!!err){console.log('Error in the query34');
									            }else
									            {
									            	if (result.affectedRows > 0) 
									            	{	            											            					            		
														var GameServer = require("./login");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;
														if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
											  			{															  				
									                		console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
									                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('RECEIVECHATPRIVATE',
															{
																UserName : currentSENDCHATPRIVATE.UserName,									
																ColorText : currentSENDCHATPRIVATE.ColorText,	
																Details : currentSENDCHATPRIVATE.Details,																	
																
										                	});	
										                	connection.release();				                	
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
			});

			//check message đã xem của private
			socket.on('SENDOPENCHATPRIVATE', function (data)
			{				
				currentSENDOPENCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
				console.log("==============data receive SENDOPENCHATPRIVATE============: "+ currentSENDOPENCHATPRIVATE.UserName);																		
				pool.getConnection(function(err,connection)
				{	
					connection.query("UPDATE users,chatting SET users.CheckCloseMessPrivateUser = 0, chatting.CheckCloseMessPrivate=0 where chatting.ToUserName = users.UserName AND users.CheckCloseMessPrivateUser = 1 AND users.UserName = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query11gh3434ghjfgfgfafd');
						}else
						{
							if (result.affectedRows>0){connection.release();}
						}
					});																					     	
		   		});		
			});

			//check message hủy xem của private
			socket.on('SENDCANCELCHATPRIVATE', function (data)
			{				
				currentSENDCANCELCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
				console.log("data receive SENDCANCELCHATPRIVATE============: "+ currentSENDCANCELCHATPRIVATE.UserName);
																		
				pool.getConnection(function(err,connection)
				{		
					connection.query("UPDATE users SET CheckCloseMessPrivateUser = 1 where CheckCloseMessPrivateUser = 0 AND `UserName` = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query11gh3434ghjfgfgfafd');
						}else
						{
							if (result.affectedRows>0){connection.release();}
						}
					});																					     	
		   		});			
			});	
				
			//check message đã xem của guild	
			socket.on('SENDOPENCHATGUILD', function (data)
			{
				
				currentSENDOPENCHATGUILD = getcurrentSENDRESPONSECHAT(data);
				console.log("data receive SENDOPENCHATGUILD============: "+ currentSENDOPENCHATGUILD.UserName);
																		
				pool.getConnection(function(err,connection)
				{		
					connection.query("UPDATE users SET CheckCloseMessGuild = 0 where UserName = '"+currentSENDOPENCHATGUILD.UserName+"'",function(error, result, field)
					{
						if(!!error){console.log('Error in the query11gh3434ghjfgfgfafd');
						}else
						{
							if (result.affectedRows>0){connection.release();}
						}
					});						     	
		   		});		
			});	

			//check message hủy đã xem của guild
			socket.on('SENDCANCELCHATGUILD', function (data)
			{
				
				currentSENDCANCELCHATGUILD = getcurrentSENDRESPONSECHAT(data);
				console.log("data receive SENDCANCELCHATGUILD=========================: "+ currentSENDCANCELCHATGUILD.UserName);
																		
				pool.getConnection(function(err,connection)
				{						
					d = new Date();
    				createPositionTimelast = Math.floor(d.getTime() / 1000);	
					connection.query("UPDATE users SET TimeCancelGuild = '"+createPositionTimelast+"',CheckCloseMessGuild = 1 where UserName = '"+currentSENDCANCELCHATGUILD.UserName+"' AND CheckCloseMessGuild = 0",function(error, result, field)
					{
						if(!!error){console.log('Error in the query11gh3434ghjfgfgfafd');
						}else
						{
							if (result.affectedRows>0){connection.release();}
						}
					});								     	
		   		});		
			});						
		});
		cron.schedule('*/1 * * * * *',function()
		{
			//Gửi thông báo của hệ thống
			var arrayMessageSystem = [];				
			var query = pool.query("SELECT Detail FROM `chatting` WHERE `SystemCheck` > 0",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query 458');
				}else
				{
					if (rows.length>0) 
					{
						arrayMessageSystem =rows;		
						var query = pool.query("UPDATE chatting SET `SystemCheck` = 0 where `SystemCheck` =1",function(error, result, field)
						{
							if(!!error){console.log('Error in the query 459');
							}else
							{
								if (result.affectedRows>0) 
								{							
									console.log("Gửi message System");
									io.emit('RECEIVEMESSAGESYSTEM',
									{
										arrayMessageSystem:arrayMessageSystem,																																																																												
				                	});																																	
								}
							}
						});					
					}
				}
			});	
		});
    }
}
 
function getcurrentSENDCHATWORLD(data)
{
	return currentSENDCHATWORLD =
	{							
		UserName : data.UserName,
		ClientTime : data.ClientTime,
		ColorText : data.ColorText,	
		Details : data.Details,
	}
}

function getcurrentSENDCHATGUILD(data)
{
	return currentSENDCHATGUILD =
	{							
		UserName : data.UserName,
		GuildName : data.GuildName,
		ClientTime : data.ClientTime,
		ColorText : data.ColorText,	
		Details : data.Details,
	}
}
function getcurrentSENDCHATPRIVATE(data)
{
	return	currentSENDCHATPRIVATE =
	{							
		UserName : data.UserName,
		ToUserName : data.ToUserName,
		ClientTime : data.ClientTime,
		ColorText : data.ColorText,	
		Details : data.Details,
	}
}

function getcurrentSENDRESPONSECHAT(data)
{
	return currentSENDRESPONSECHAT =
	{							
		UserName : data.UserName,															
	}
}
