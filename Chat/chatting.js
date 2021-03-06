'use strict';
var database        = require('./../Util/db.js');
var functions       = require('./../Util/functions.js');

var lodash		    = require('lodash');
var cron 			= require('node-cron');

var currentSENDCHATWORLD = [],currentSENDCHATGUILD = [],currentSENDCHATPRIVATE = [],currentSENDCANCELCHATGUILD = [],currentSENDCANCELCHATPRIVATE = [],
currentSENDOPENCHATGUILD = [],currentSENDOPENCHATPRIVATE = [],d,currentTime, currentSENDRESPONSECHAT = [],DetailError;


exports.getarrayMessPrivateMember = function getarrayMessPrivateMember (currentUser,arrayMessPrivateMember) {
	database.query("SELECT * FROM `chatting` WHERE `ToUserName`='"+currentUser.name+"' AND `CheckCloseMessPrivate` = 1 ",function(error, rows){
		if(!!error){DetailError = ('chatting: Error SELECT getarrayMessPrivateMember');functions.writeLogErrror(DetailError);}
		(rows.length>0)?arrayMessPrivateMember(rows):arrayMessPrivateMember(0);	
	});	
}

exports.start = function start (io) {
	io.on('connection', function(socket) {		
		socket.on('S_CHAT_WORLD', function (data)
		{
			currentSENDCHATWORLD = getcurrentSENDCHATWORLD(data);
			console.log("data receive S_CHAT_WORLD============: "+ currentSENDCHATWORLD.UserName+"_"
				+ currentSENDCHATWORLD.ClientTime+"_"											
				+ currentSENDCHATWORLD.ColorText+"_"											
				+ currentSENDCHATWORLD.Details);

			database.getConnection(function(err,connection)
			{	
				
				currentTime = Math.floor(new Date().getTime() / 1000);	
				connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
					+currentSENDCHATWORLD.UserName+"','"+currentSENDCHATWORLD.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATWORLD.ClientTime+"','"
					+currentSENDCHATWORLD.ColorText+"')",function(error, result)
					{
						if(!!err){DetailError = ('chatting: Error in the query 1');
						
						functions.writeLogErrror(DetailError);
					}else
					{
						if (result.affectedRows > 0) 
						{			            		
							socket.broadcast.emit('R_CHAT_WORLD',
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


		socket.on('S_CHAT_GUILD', function (data)
		{				
			currentSENDCHATGUILD = getcurrentSENDCHATGUILD(data);
			console.log("data receive S_CHAT_GUILD============: "+ currentSENDCHATGUILD.UserName+"_"
				+ currentSENDCHATGUILD.ClientTime+"_"											
				+ currentSENDCHATGUILD.ColorText+"_"											
				+ currentSENDCHATGUILD.GuildName+"_"											
				+ currentSENDCHATGUILD.Details);																		
			database.getConnection(function(err,connection)
			{	
				var arrayAllGuildMember=[];
				
				currentTime = Math.floor(new Date().getTime() / 1000);	
				connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`GuildName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
					+currentSENDCHATGUILD.UserName+"','"+currentSENDCHATGUILD.GuildName+"','"+currentSENDCHATGUILD.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATGUILD.ClientTime+"','"
					+currentSENDCHATGUILD.ColorText+"')",function(error, result)
					{
						if(!!err){DetailError = ('chatting: Error in the query 2');
						
						functions.writeLogErrror(DetailError);
					}else
					{
						if (result.affectedRows > 0) 
						{		            					            		
							connection.query("SELECT MemberName FROM `guildlistmember` WHERE  `GuildName`='"+currentSENDCHATGUILD.GuildName+"'",function(error, rows)
							{
								if (!!error){DetailError = ('chatting: Error in the query 3');
								
								functions.writeLogErrror(DetailError);
							}else
							{
								if (rows.length>0) 
								{
									arrayAllGuildMember = rows;
									var GameServer = require("./../Login/login.js");
									var gameServer = new GameServer();
									exports.gameServer = gameServer;
									for (var i = 0; i < arrayAllGuildMember.length; i++) 
									{									  			
										if ((lodash.filter(gameServer.clients, x => x.name === arrayAllGuildMember[i].MemberName)).length >0) 
										{															  				
											console.log("Gui cho MemberName guild"+"_"+arrayAllGuildMember[i].MemberName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket);
											socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket).emit('R_CHAT_GUILD',
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


		socket.on('S_CHAT_PRIVATE', function (data)
		{				
			currentSENDCHATPRIVATE = getcurrentSENDCHATPRIVATE(data);
			console.log("data receive S_CHAT_PRIVATE============: "+ currentSENDCHATPRIVATE.UserName+"_"
				+ currentSENDCHATPRIVATE.ClientTime+"_"											
				+ currentSENDCHATPRIVATE.ColorText+"_"											
				+ currentSENDCHATPRIVATE.ToUserName+"_"											
				+ currentSENDCHATPRIVATE.Details);

			database.getConnection(function(err,connection)
			{	
				var arrayAllGuildMember=[];
				
				currentTime = Math.floor(new Date().getTime() / 1000);	
				connection.query("SELECT CheckCloseMessPrivateUser FROM `users` WHERE CheckCloseMessPrivateUser = 1 AND `UserName` = '"+currentSENDCHATPRIVATE.ToUserName+"'",function(error, rows)
				{
					if (!!error){DetailError = ('chatting: Error in the query 4');
					
					functions.writeLogErrror(DetailError);
				}else
				{
					if (rows.length>0) 
					{
						connection.query("SELECT `idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail` FROM `blacklist` WHERE  (`UserName`='"+currentSENDCHATPRIVATE.UserName
							+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows)
							{
								if (!!error){DetailError = ('chatting: Error in the query 5');
								
								functions.writeLogErrror(DetailError);
							}else
							{
								if (rows.length<=0)										
								{
									connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
										+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+1+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
										+currentSENDCHATPRIVATE.ColorText+"')",function(error, result)
										{
											if(!!err){DetailError = ('chatting: Error in the query 6');
											
											functions.writeLogErrror(DetailError);
										}else
										{
											if (result.affectedRows > 0) 
											{	            											            					            		
												var GameServer = require("./../Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;
												if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
												{															  				
													console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
													socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('R_CHAT_PRIVATE',
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
							+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows)
							{
								if (!!error){DetailError = ('chatting: Error in the query 7');
								
								functions.writeLogErrror(DetailError);
							}else
							{
								if (rows.length<=0) 
								{
									connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
										+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+0+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
										+currentSENDCHATPRIVATE.ColorText+"')",function(error, result)
										{
											if(!!err){DetailError = ('chatting: Error in the query 8');
											
											functions.writeLogErrror(DetailError);
										}else
										{
											if (result.affectedRows > 0) 
											{	            											            					            		
												var GameServer = require("./../Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;
												if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
												{															  				
													console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
													socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('R_CHAT_PRIVATE',
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


socket.on('S_OPEN_CHAT_PRIVATE', function (data)
{				
	currentSENDOPENCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
	console.log("==============data receive S_OPEN_CHAT_PRIVATE============: "+ currentSENDOPENCHATPRIVATE.UserName);																		
	database.getConnection(function(err,connection)
	{	
		connection.query("UPDATE users,chatting SET users.CheckCloseMessPrivateUser = 0, chatting.CheckCloseMessPrivate=0 WHERE chatting.ToUserName = users.UserName AND users.CheckCloseMessPrivateUser = 1 AND users.UserName = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result)
		{
			if(!!error){DetailError = ('chatting: Error in the query 9');functions.writeLogErrror(DetailError);}
			else
			{
				if (result.affectedRows>0){connection.release();}
			}
		});																					     	
	});		
});


socket.on('S_CANCEL_CHAT_PRIVATE', function (data)
{				
	currentSENDCANCELCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
	console.log("data receive S_CANCEL_CHAT_PRIVATE============: "+ currentSENDCANCELCHATPRIVATE.UserName);

	database.getConnection(function(err,connection)
	{		
		connection.query("UPDATE users SET CheckCloseMessPrivateUser = 1 WHERE CheckCloseMessPrivateUser = 0 AND `UserName` = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result)
		{
			if(!!error){DetailError = ('chatting: Error in the query 10');
			
			functions.writeLogErrror(DetailError);
		}else
		{
			if (result.affectedRows>0){connection.release();}
		}
	});																					     	
	});			
});	


socket.on('S_OPEN_CHAT_GUILD', function (data)
{				
	currentSENDOPENCHATGUILD = getcurrentSENDRESPONSECHAT(data);
	console.log("data receive S_OPEN_CHAT_GUILD============: "+ currentSENDOPENCHATGUILD.UserName);

	database.getConnection(function(err,connection)
	{		
		connection.query("UPDATE users SET CheckCloseMessGuild = 0 WHERE UserName = '"+currentSENDOPENCHATGUILD.UserName+"'",function(error, result)
		{
			if(!!error){DetailError = ('chatting: Error in the query 11');
			
			functions.writeLogErrror(DetailError);
		}else
		{
			if (result.affectedRows>0){connection.release();}
		}
	});						     	
	});		
});	


socket.on('S_CANCEL_CHAT_GUILD', function (data)
{				
	currentSENDCANCELCHATGUILD = getcurrentSENDRESPONSECHAT(data);
	console.log("data receive S_CANCEL_CHAT_GUILD=========================: "+ currentSENDCANCELCHATGUILD.UserName);

	database.getConnection(function(err,connection)
	{						
		
		currentTime = Math.floor(new Date().getTime() / 1000);	
		connection.query("UPDATE users SET TimeCancelGuild = '"+currentTime+"',CheckCloseMessGuild = 1 WHERE UserName = '"+currentSENDCANCELCHATGUILD.UserName+"' AND CheckCloseMessGuild = 0",function(error, result)
		{
			if(!!error){DetailError = ('chatting: Error in the query 12');
			
			functions.writeLogErrror(DetailError);
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

	var arrayMessageSystem = [];				
	var query = database.query("SELECT Detail FROM `chatting` WHERE `SystemCheck` > 0",function(error, rows)
	{
		if (!!error){DetailError = ('chatting: Error in the query 13');

		functions.writeLogErrror(DetailError);
	}else
	{
		if (rows.length>0) 
		{
			arrayMessageSystem =rows;		
			var query = database.query("UPDATE chatting SET `SystemCheck` = 0 WHERE `SystemCheck` =1",function(error, result)
			{
				if(!!error){DetailError = ('chatting: Error in the query 14');

				functions.writeLogErrror(DetailError);
			}else
			{
				if (result.affectedRows>0) 
				{							
					console.log("Gửi message System");
					io.emit('R_MESSAGE_SYSTEM',
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

// module.exports = {
// 	start: function(io) 
// 	{    
//   //   	io.on('connection', function(socket) 
//   //       {		
//   //       	//Chat thế giới	
// 		// 	socket.on('S_CHAT_WORLD', function (data)
// 		// 	{
// 		// 		currentSENDCHATWORLD = getcurrentSENDCHATWORLD(data);
// 		// 		console.log("data receive S_CHAT_WORLD============: "+ currentSENDCHATWORLD.UserName+"_"
// 		// 									+ currentSENDCHATWORLD.ClientTime+"_"											
// 		// 									+ currentSENDCHATWORLD.ColorText+"_"											
// 		// 									+ currentSENDCHATWORLD.Details);

// 		// 		database.getConnection(function(err,connection)
// 		// 		{	
// 		// 			
//   //   				currentTime = Math.floor(new Date().getTime() / 1000);	
// 		// 			connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
// 		// 			+currentSENDCHATWORLD.UserName+"','"+currentSENDCHATWORLD.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATWORLD.ClientTime+"','"
// 		// 			+currentSENDCHATWORLD.ColorText+"')",function(error, result)
// 		// 			{
// 		// 	            if(!!err){DetailError = ('chatting: Error in the query 1');
// 		// 	            	
// 		// 					functions.writeLogErrror(DetailError);
// 		// 	            }else
// 		// 	            {
// 		// 	            	if (result.affectedRows > 0) 
// 		// 	            	{			            		
// 		// 	            		socket.broadcast.emit('R_CHAT_WORLD',
// 		// 						{
// 		// 							UserName : currentSENDCHATWORLD.UserName,									
// 		// 							ColorText : currentSENDCHATWORLD.ColorText,	
// 		// 							Details : currentSENDCHATWORLD.Details,									
// 		// 						});	
// 		// 						connection.release();
// 		// 	            	}
// 		// 	            }
// 		// 	        });					

// 		//    		});		
// 		// 	});	

// 		// 	//chat trong guild
// 		// 	socket.on('S_CHAT_GUILD', function (data)
// 		// 	{				
// 		// 		currentSENDCHATGUILD = getcurrentSENDCHATGUILD(data);
// 		// 		console.log("data receive S_CHAT_GUILD============: "+ currentSENDCHATGUILD.UserName+"_"
// 		// 									+ currentSENDCHATGUILD.ClientTime+"_"											
// 		// 									+ currentSENDCHATGUILD.ColorText+"_"											
// 		// 									+ currentSENDCHATGUILD.GuildName+"_"											
// 		// 									+ currentSENDCHATGUILD.Details);																		
// 		// 		database.getConnection(function(err,connection)
// 		// 		{	
// 		// 			var arrayAllGuildMember=[];
// 		// 			
//   //   				currentTime = Math.floor(new Date().getTime() / 1000);	
// 		// 			connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`GuildName`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
// 		// 			+currentSENDCHATGUILD.UserName+"','"+currentSENDCHATGUILD.GuildName+"','"+currentSENDCHATGUILD.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATGUILD.ClientTime+"','"
// 		// 			+currentSENDCHATGUILD.ColorText+"')",function(error, result)
// 		// 			{
// 		// 	            if(!!err){DetailError = ('chatting: Error in the query 2');
// 		// 	            		
// 		// 						functions.writeLogErrror(DetailError);
// 		// 	            }else
// 		// 	            {
// 		// 	            	if (result.affectedRows > 0) 
// 		// 	            	{		            					            		
// 		// 	            		connection.query("SELECT MemberName FROM `guildlistmember` WHERE  `GuildName`='"+currentSENDCHATGUILD.GuildName+"'",function(error, rows)
// 		// 						{
// 		// 							if (!!error){DetailError = ('chatting: Error in the query 3');
// 		// 								
// 		// 								functions.writeLogErrror(DetailError);
// 		// 							}else
// 		// 							{
// 		// 								if (rows.length>0) 
// 		// 								{
// 		// 									arrayAllGuildMember = rows;
// 		// 									var GameServer = require("./../Login/login.js");
// 		// 									var gameServer = new GameServer();
// 		// 									exports.gameServer = gameServer;
// 		// 									for (var i = 0; i < arrayAllGuildMember.length; i++) 
// 		// 							  		{									  			
// 		// 							  			if ((lodash.filter(gameServer.clients, x => x.name === arrayAllGuildMember[i].MemberName)).length >0) 
// 		// 							  			{															  				
// 		// 					                		console.log("Gui cho MemberName guild"+"_"+arrayAllGuildMember[i].MemberName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket);
// 		// 					                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayAllGuildMember[i].MemberName)].idSocket).emit('R_CHAT_GUILD',
// 		// 											{
// 		// 												UserName : currentSENDCHATGUILD.UserName,									
// 		// 												ColorText : currentSENDCHATGUILD.ColorText,	
// 		// 												Details : currentSENDCHATGUILD.Details,																														
// 		// 						                	});									                				                	
// 		// 							  			}													  							  			
// 		// 							  		}
// 		// 							  		connection.release();			 
// 		// 								}
// 		// 							}
// 		// 						})		            		
// 		// 	            	}
// 		// 	            }
// 		// 	        });															     
// 		//    		});		
// 		// 	});

// 		// 	//chat cá nhân
// 		// 	socket.on('S_CHAT_PRIVATE', function (data)
// 		// 	{				
// 		// 		currentSENDCHATPRIVATE = getcurrentSENDCHATPRIVATE(data);
// 		// 		console.log("data receive S_CHAT_PRIVATE============: "+ currentSENDCHATPRIVATE.UserName+"_"
// 		// 									+ currentSENDCHATPRIVATE.ClientTime+"_"											
// 		// 									+ currentSENDCHATPRIVATE.ColorText+"_"											
// 		// 									+ currentSENDCHATPRIVATE.ToUserName+"_"											
// 		// 									+ currentSENDCHATPRIVATE.Details);

// 		// 		database.getConnection(function(err,connection)
// 		// 		{	
// 		// 			var arrayAllGuildMember=[];
// 		// 			
//   //   				currentTime = Math.floor(new Date().getTime() / 1000);	
//   //   				connection.query("SELECT CheckCloseMessPrivateUser FROM `users` WHERE CheckCloseMessPrivateUser = 1 AND `UserName` = '"+currentSENDCHATPRIVATE.ToUserName+"'",function(error, rows)
// 		// 			{
// 		// 				if (!!error){DetailError = ('chatting: Error in the query 4');
// 		// 					
// 		// 					functions.writeLogErrror(DetailError);
// 		// 				}else
// 		// 				{
// 		// 					if (rows.length>0) 
// 		// 					{
// 		// 						connection.query("SELECT `idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail` FROM `blacklist` WHERE  (`UserName`='"+currentSENDCHATPRIVATE.UserName
// 		// 							+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows)
// 		// 						{
// 		// 							if (!!error){DetailError = ('chatting: Error in the query 5');
// 		// 								
// 		// 								functions.writeLogErrror(DetailError);
// 		// 							}else
// 		// 							{
// 		// 								if (rows.length<=0)										
// 		// 								{
// 		// 									connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
// 		// 									+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+1+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
// 		// 									+currentSENDCHATPRIVATE.ColorText+"')",function(error, result)
// 		// 									{
// 		// 							            if(!!err){DetailError = ('chatting: Error in the query 6');
// 		// 							            	
// 		// 											functions.writeLogErrror(DetailError);
// 		// 							            }else
// 		// 							            {
// 		// 							            	if (result.affectedRows > 0) 
// 		// 							            	{	            											            					            		
// 		// 												var GameServer = require("./../Login/login.js");
// 		// 												var gameServer = new GameServer();
// 		// 												exports.gameServer = gameServer;
// 		// 												if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
// 		// 									  			{															  				
// 		// 							                		console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
// 		// 							                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('R_CHAT_PRIVATE',
// 		// 													{
// 		// 														UserName : currentSENDCHATPRIVATE.UserName,									
// 		// 														ColorText : currentSENDCHATPRIVATE.ColorText,	
// 		// 														Details : currentSENDCHATPRIVATE.Details,																																
// 		// 								                	});					                	
// 		// 									  			}	
// 		// 									  			connection.release();	            		
// 		// 							            	}
// 		// 							            }
// 		// 							        });
// 		// 								}
// 		// 							}
// 		// 						});									
// 		// 					}else
// 		// 					{
// 		// 						connection.query("SELECT `idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail` FROM `blacklist` WHERE  (`UserName`='"+currentSENDCHATPRIVATE.UserName
// 		// 							+"'AND `WithUserName`='"+currentSENDCHATPRIVATE.ToUserName+"') OR (`WithUserName`='"+currentSENDCHATPRIVATE.UserName+"' AND `UserName`='"+currentSENDCHATPRIVATE.ToUserName+"')",function(error, rows)
// 		// 						{
// 		// 							if (!!error){DetailError = ('chatting: Error in the query 7');
// 		// 								
// 		// 								functions.writeLogErrror(DetailError);
// 		// 							}else
// 		// 							{
// 		// 								if (rows.length<=0) 
// 		// 								{
// 		// 									connection.query("INSERT INTO `chatting`(`idChatting`, `UserName`,`ToUserName`, `CheckCloseMessPrivate`, `Detail`, `ServerTime`, `ClientTime`, `Color`) VALUES ('"+""+"','"
// 		// 									+currentSENDCHATPRIVATE.UserName+"','"+currentSENDCHATPRIVATE.ToUserName+"','"+0+"','"+currentSENDCHATPRIVATE.Details+"','"+parseFloat(currentTime)+"','"+currentSENDCHATPRIVATE.ClientTime+"','"
// 		// 									+currentSENDCHATPRIVATE.ColorText+"')",function(error, result)
// 		// 									{
// 		// 							            if(!!err){DetailError = ('chatting: Error in the query 8');
// 		// 							            	
// 		// 											functions.writeLogErrror(DetailError);
// 		// 							            }else
// 		// 							            {
// 		// 							            	if (result.affectedRows > 0) 
// 		// 							            	{	            											            					            		
// 		// 												var GameServer = require("./../Login/login.js");
// 		// 												var gameServer = new GameServer();
// 		// 												exports.gameServer = gameServer;
// 		// 												if ((lodash.filter(gameServer.clients, x => x.name === currentSENDCHATPRIVATE.ToUserName)).length >0) 
// 		// 									  			{															  				
// 		// 							                		console.log("Gui cho MemberName"+"_"+currentSENDCHATPRIVATE.ToUserName+"_"+gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket);
// 		// 							                		socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDCHATPRIVATE.ToUserName)].idSocket).emit('R_CHAT_PRIVATE',
// 		// 													{
// 		// 														UserName : currentSENDCHATPRIVATE.UserName,									
// 		// 														ColorText : currentSENDCHATPRIVATE.ColorText,	
// 		// 														Details : currentSENDCHATPRIVATE.Details,																	

// 		// 								                	});	
// 		// 								                	connection.release();				                	
// 		// 									  			}		            		
// 		// 							            	}
// 		// 							            }
// 		// 							        });												
// 		// 								}
// 		// 							}
// 		// 						});																
// 		// 					}
// 		// 				}
// 		// 			});							

// 		//    		});		
// 		// 	});

// 		// 	//check message đã xem của private
// 		// 	socket.on('S_OPEN_CHAT_PRIVATE', function (data)
// 		// 	{				
// 		// 		currentSENDOPENCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
// 		// 		console.log("==============data receive S_OPEN_CHAT_PRIVATE============: "+ currentSENDOPENCHATPRIVATE.UserName);																		
// 		// 		database.getConnection(function(err,connection)
// 		// 		{	
// 		// 			connection.query("UPDATE users,chatting SET users.CheckCloseMessPrivateUser = 0, chatting.CheckCloseMessPrivate=0 WHERE chatting.ToUserName = users.UserName AND users.CheckCloseMessPrivateUser = 1 AND users.UserName = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result)
// 		// 			{
// 		// 				if(!!error){DetailError = ('chatting: Error in the query 9');
// 		// 					
// 		// 					functions.writeLogErrror(DetailError);
// 		// 				}else
// 		// 				{
// 		// 					if (result.affectedRows>0){connection.release();}
// 		// 				}
// 		// 			});																					     	
// 		//    		});		
// 		// 	});

// 		// 	//check message hủy xem của private
// 		// 	socket.on('S_CANCEL_CHAT_PRIVATE', function (data)
// 		// 	{				
// 		// 		currentSENDCANCELCHATPRIVATE = getcurrentSENDRESPONSECHAT(data);
// 		// 		console.log("data receive S_CANCEL_CHAT_PRIVATE============: "+ currentSENDCANCELCHATPRIVATE.UserName);

// 		// 		database.getConnection(function(err,connection)
// 		// 		{		
// 		// 			connection.query("UPDATE users SET CheckCloseMessPrivateUser = 1 WHERE CheckCloseMessPrivateUser = 0 AND `UserName` = '"+currentSENDOPENCHATPRIVATE.UserName+"'",function(error, result)
// 		// 			{
// 		// 				if(!!error){DetailError = ('chatting: Error in the query 10');
// 		// 						
// 		// 						functions.writeLogErrror(DetailError);
// 		// 				}else
// 		// 				{
// 		// 					if (result.affectedRows>0){connection.release();}
// 		// 				}
// 		// 			});																					     	
// 		//    		});			
// 		// 	});	

// 		// 	//check message đã xem của guild	
// 		// 	socket.on('S_OPEN_CHAT_GUILD', function (data)
// 		// 	{				
// 		// 		currentSENDOPENCHATGUILD = getcurrentSENDRESPONSECHAT(data);
// 		// 		console.log("data receive S_OPEN_CHAT_GUILD============: "+ currentSENDOPENCHATGUILD.UserName);

// 		// 		database.getConnection(function(err,connection)
// 		// 		{		
// 		// 			connection.query("UPDATE users SET CheckCloseMessGuild = 0 WHERE UserName = '"+currentSENDOPENCHATGUILD.UserName+"'",function(error, result)
// 		// 			{
// 		// 				if(!!error){DetailError = ('chatting: Error in the query 11');
// 		// 					
// 		// 					functions.writeLogErrror(DetailError);
// 		// 				}else
// 		// 				{
// 		// 					if (result.affectedRows>0){connection.release();}
// 		// 				}
// 		// 			});						     	
// 		//    		});		
// 		// 	});	

// 		// 	//check message hủy đã xem của guild
// 		// 	socket.on('S_CANCEL_CHAT_GUILD', function (data)
// 		// 	{				
// 		// 		currentSENDCANCELCHATGUILD = getcurrentSENDRESPONSECHAT(data);
// 		// 		console.log("data receive S_CANCEL_CHAT_GUILD=========================: "+ currentSENDCANCELCHATGUILD.UserName);

// 		// 		database.getConnection(function(err,connection)
// 		// 		{						
// 		// 			
//   //   				currentTime = Math.floor(new Date().getTime() / 1000);	
// 		// 			connection.query("UPDATE users SET TimeCancelGuild = '"+currentTime+"',CheckCloseMessGuild = 1 WHERE UserName = '"+currentSENDCANCELCHATGUILD.UserName+"' AND CheckCloseMessGuild = 0",function(error, result)
// 		// 			{
// 		// 				if(!!error){DetailError = ('chatting: Error in the query 12');
// 		// 					
// 		// 					functions.writeLogErrror(DetailError);
// 		// 				}else
// 		// 				{
// 		// 					if (result.affectedRows>0){connection.release();}
// 		// 				}
// 		// 			});								     	
// 		//    		});		
// 		// 	});						
// 		// });
// 		// cron.schedule('*/1 * * * * *',function()
// 		// {
// 		// 	//Gửi thông báo của hệ thống
// 		// 	var arrayMessageSystem = [];				
// 		// 	var query = database.query("SELECT Detail FROM `chatting` WHERE `SystemCheck` > 0",function(error, rows)
// 		// 	{
// 		// 		if (!!error){DetailError = ('chatting: Error in the query 13');
// 		// 			
// 		// 			functions.writeLogErrror(DetailError);
// 		// 		}else
// 		// 		{
// 		// 			if (rows.length>0) 
// 		// 			{
// 		// 				arrayMessageSystem =rows;		
// 		// 				var query = database.query("UPDATE chatting SET `SystemCheck` = 0 WHERE `SystemCheck` =1",function(error, result)
// 		// 				{
// 		// 					if(!!error){DetailError = ('chatting: Error in the query 14');
// 		// 						
// 		// 						functions.writeLogErrror(DetailError);
// 		// 					}else
// 		// 					{
// 		// 						if (result.affectedRows>0) 
// 		// 						{							
// 		// 							console.log("Gửi message System");
// 		// 							io.emit('R_MESSAGE_SYSTEM',
// 		// 							{
// 		// 								arrayMessageSystem:arrayMessageSystem,																																																																												
// 		// 		                	});																																	
// 		// 						}
// 		// 					}
// 		// 				});					
// 		// 			}
// 		// 		}
// 		// 	});	
// 		// });

// 	}
// }

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
