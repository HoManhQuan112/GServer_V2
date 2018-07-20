'use strict';
var database        = require('./../Util/db.js');
var functions       = require('./../Util/functions.js');



var cron 			= require('node-cron');
var client 			= require('./../redis');
var lodash		    = require('lodash');

var currentFRIENDS = [],DetailError, current_S_ADD_FRIEND = [],current_S_ACCEPT_FRIEND = [],current_S_CANCEL_FRIEND = [],current_S_REJECT_INVITE_FRIEND = [],d,currentTime;

// exports.getFriendRegion = function getFriendRegion (currentUser,currentTime,arrayWaitingFriend,arrayWaitedFriend,arrayAddedFriend,arrayCancelFriend) {
// 	getarrayWaitingFriend(currentUser,function (rows) {
// 		arrayWaitingFriend(rows);
// 	});
// 	getarrayWaitedFriend(currentUser,function (rows) {
// 		arrayWaitedFriend(rows);
// 	});
// 	getarrayAddedFriend(currentUser,function (rows) {
// 		arrayAddedFriend(rows);
// 	});
// 	getarrayCancelFriend(currentUser,currentTime,function (rows) {
// 		arrayCancelFriend(rows);
// 	});
// }

exports.getarrayWaitingFriend =function getarrayWaitingFriend(currentUser,arrayWaitingFriend) {
	database.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows){
		if (!!error){DetailError =('addFriend :Error SELECT getarrayWaitingFriend '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {arrayWaitingFriend(rows);}else{arrayWaitingFriend(0)};
	});	
}
exports.getarrayWaitedFriend =function getarrayWaitedFriend(currentUser,arrayWaitedFriend) {
	database.query("SELECT `UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendB`='"+currentUser.name+"' AND `ActiveStatus`=0",function(error, rows){
		if (!!error){DetailError =('addFriend :Error SELECT getarrayWaitedFriend '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {arrayWaitedFriend(rows);}else{arrayWaitedFriend(0)};		
	});	
}
exports.getarrayAddedFriend =function getarrayAddedFriend(currentUser,arrayAddedFriend) {
	database.query("SELECT `UserNameFriendA`,`UserNameFriendB` FROM `addfriend` WHERE `UserNameFriendA` = '"+currentUser.name+"' AND `ActiveStatus`=1",function (error,rows) {
		if (!!error){DetailError =('addFriend :Error SELECT getarrayAddedFriend '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {arrayAddedFriend(rows);}else{arrayAddedFriend(0)};
	});
}
exports.getarrayCancelFriend =function getarrayCancelFriend(currentUser,currentTime,arrayCancelFriend) {
	database.query("SELECT  `UserNameFriendA`,`UserNameFriendB`,`TimeCancelFriend` FROM `addfriend` WHERE (`UserNameFriendA` = '"+currentUser.name+"' AND `ActiveStatus` =2) OR (`UserNameFriendB` = '"+currentUser.name+"'  AND `ActiveStatus` =2)",function (error,rows) {
		if (!!error){DetailError =('addFriend :Error SELECT getarrayCancelFriend '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {arrayCancelFriend(rows);			
			for (var i = 0; i < rows.length; i++) {
				calcTimeCancelFriend(rows[i]);
			}
		}
		else{arrayCancelFriend("")};
	});
}
function calcTimeCancelFriend (rows) {
	if (rows.TimeCancelFriend>currentTime) {
		var timeOut = rows.TimeCancelFriend-currentTime;
		setTimeout(function (rows) {
			checkCancelFriend (rows);
		}, timeOut, rows);
	}

}

function checkCancelFriend (rows) {
	database.query("SELECT  * FROM `addfriend` WHERE `UserNameFriendA` = '"+rows.UserNameFriendA+"' AND `UserNameFriendB` = '"+rows.UserNameFriendB+"'",function (error,rows) {
		if (!!error){DetailError =('addFriend :Error SELECT checkCancelFriend '+rows.UserNameFriendA);functions.writeLogErrror(DetailError);}
		if (rows.ActiveStatus===2) {
			removeFriend (rows);
		}
	});
}
function removeFriend (rows) {
	database.query("DELETE FROM `addfriend` WHERE `UserNameFriendA` = '"+rows.UserNameFriendA+"' AND `UserNameFriendB` = '"+rows.UserNameFriendB+"'",function (error,rows){
		if (!!error){DetailError =('addFriend :Error removeFriend '+rows.UserNameFriendA);functions.writeLogErrror(DetailError);}
		console.log("Chưa lam remove friend gui den user");
	});
}
exports.start = function start (io) {
	io.on('connection', function(socket) {

		socket.on('S_ADD_FRIEND', function(data)
		{
			current_S_ADD_FRIEND = getcurrentFRIENDS(data);
			console.log("data receive S_ADD_FRIEND==========: "+current_S_ADD_FRIEND.UserNameFriendA+"_"+current_S_ADD_FRIEND.UserNameFriendB);				

			database.getConnection(function(err,connection)
			{	
				//kiểm tra đã là bạn chưa
				connection.query("SELECT * FROM `addfriend` WHERE (`UserNameFriendA`= '"+current_S_ADD_FRIEND.UserNameFriendA
					+"' AND `UserNameFriendB`='"+current_S_ADD_FRIEND.UserNameFriendB
					+"') OR (`UserNameFriendB`= '"+current_S_ADD_FRIEND.UserNameFriendA
					+"' AND `UserNameFriendA`='"+current_S_ADD_FRIEND.UserNameFriendB+"')",function(error, rows,field)
					{
						if (!!error){DetailError = ('addfriend: Error in the query 1');	
						console.log(DetailError);
						functions.writeLogErrror(DetailError);											
					}else
					{	
						if (rows.length<=0) 
						{
							connection.query("INSERT INTO `addfriend`(`idaddFriend`, `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus`) VALUES ('"+""+"','"+current_S_ADD_FRIEND.UserNameFriendA+"','"+current_S_ADD_FRIEND.UserNameFriendB+"','"+0+"')",function(error, result, field)
							{
								if (!!error){DetailError = ('addfriend: Error in the query 2');																		
								console.log(DetailError);
								functions.writeLogErrror(DetailError);
							}else
							{	
								if (result.affectedRows>0) 
								{
									//lưu kết bạn thanh cong																				
									var GameServer = require("./../Login/login.js");
									var gameServer = new GameServer();
									exports.gameServer = gameServer;		
									if (gameServer.clients.length>0) 
									{								
										for (var i = 0; i < gameServer.clients.length; i++) 
										{									
											if (gameServer.clients[i].name===current_S_ADD_FRIEND.UserNameFriendB) 
											{																																	
												socket.broadcast.to(gameServer.clients[i].idSocket).emit('R_ADD_FRIEND',
												{
													UserNameAddFriend:current_S_ADD_FRIEND.UserNameFriendA,
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

	});

}

// module.exports = {
// 	start: function(io) 
// 	{
// 		io.on('connection', function(socket) 
// 		{        	
// 			socket.on('S_ADD_FRIEND', function(data)
// 			{
// 				current_S_ADD_FRIEND = getcurrentFRIENDS(data);
// 				console.log("data receive S_ADD_FRIEND==========: "+current_S_ADD_FRIEND.UserNameFriendA+"_"+current_S_ADD_FRIEND.UserNameFriendB);				
// 				//kiểm tra socket client			
// 				database.getConnection(function(err,connection)
// 				{	
// 					//kiểm tra đã là bạn chưa
// 					connection.query("SELECT * FROM `addfriend` WHERE (`UserNameFriendA`= '"+current_S_ADD_FRIEND.UserNameFriendA
// 						+"' AND `UserNameFriendB`='"+current_S_ADD_FRIEND.UserNameFriendB
// 						+"') OR (`UserNameFriendB`= '"+current_S_ADD_FRIEND.UserNameFriendA
// 						+"' AND `UserNameFriendA`='"+current_S_ADD_FRIEND.UserNameFriendB+"')",function(error, rows,field)
// 						{
// 							if (!!error){DetailError = ('addfriend: Error in the query 1');	
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);											
// 						}else
// 						{	
// 							if (rows.length<=0) 
// 							{
// 								connection.query("INSERT INTO `addfriend`(`idaddFriend`, `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus`) VALUES ('"+""+"','"+current_S_ADD_FRIEND.UserNameFriendA+"','"+current_S_ADD_FRIEND.UserNameFriendB+"','"+0+"')",function(error, result, field)
// 								{
// 									if (!!error){DetailError = ('addfriend: Error in the query 2');																		
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);
// 								}else
// 								{	
// 									if (result.affectedRows>0) 
// 									{
// 										//lưu kết bạn thanh cong																				
// 										var GameServer = require("./../Login/login.js");
// 										var gameServer = new GameServer();
// 										exports.gameServer = gameServer;		
// 										if (gameServer.clients.length>0) 
// 										{								
// 											for (var i = 0; i < gameServer.clients.length; i++) 
// 											{									
// 												if (gameServer.clients[i].name===current_S_ADD_FRIEND.UserNameFriendB) 
// 												{																																	
// 													socket.broadcast.to(gameServer.clients[i].idSocket).emit('R_ADD_FRIEND',
// 													{
// 														UserNameAddFriend:current_S_ADD_FRIEND.UserNameFriendA,
// 													});							                	
// 												}
// 											}
// 										}
// 										connection.release();									
// 									}
// 								}
// 							});											
// 							}
// 						}
// 					});
// 				});
// 			});

// 			socket.on('S_ACCEPT_FRIEND', function (data)
// 			{							
// 				current_S_ACCEPT_FRIEND = getcurrentFRIENDS(data);
// 				console.log("S_ACCEPT_FRIEND=========="+current_S_ACCEPT_FRIEND.UserNameFriendA+"_"+current_S_ACCEPT_FRIEND.UserNameFriendB+"La bạn====================");		
// 				//kiểm tra gioi han bạn
// 				var query = database.query("SELECT `numberFriends`,`UserName` FROM `users` WHERE UserName ='"+current_S_ACCEPT_FRIEND.UserNameFriendA+"' UNION ALL SELECT `numberFriends`,`UserName` FROM `users` WHERE UserName ='"+current_S_ACCEPT_FRIEND.UserNameFriendB+"'",function(error, rows,field)
// 				{
// 					if (!!error){DetailError = ('addfriend: Error in the query 3');													
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);
// 				}else
// 				{
// 					if (rows.length>0 && ((parseFloat(rows[0].numberFriends)>=20)||(parseFloat(rows[1].numberFriends)>=20))) 
// 					{	
// 						//số lượng bạn đã full						
// 						socket.emit('R_FULL_FRIEND', 
// 						{
// 							UserNameFriendB : current_S_ACCEPT_FRIEND.UserNameFriendB,                    		
// 						});						
// 					}else if (rows.length>0)
// 					{
// 						var query = database.query("UPDATE users, addfriend SET users.numberFriends = users.numberFriends +1 ,addfriend.ActiveStatus = 1 where (users.UserName = '"+current_S_ACCEPT_FRIEND.UserNameFriendA
// 							+"' OR users.UserName = '"+current_S_ACCEPT_FRIEND.UserNameFriendB+"'  ) AND addfriend.UserNameFriendB = '"+current_S_ACCEPT_FRIEND.UserNameFriendA
// 							+"'AND addfriend.UserNameFriendA = '"+current_S_ACCEPT_FRIEND.UserNameFriendB+"'",function(error, result, field)
// 							{
// 								if(!!error){DetailError = ('addfriend: Error in the query 4');
// 								console.log(DetailError);
// 								functions.writeLogErrror(DetailError);
// 							}else
// 							{
// 								if (result.affectedRows>0) 
// 								{																		
// 									var GameServer = require("./../Login/login.js");
// 									var gameServer = new GameServer();
// 									exports.gameServer = gameServer;		
// 									if (gameServer.clients.length>0) 
// 									{									
// 										for (var i = 0; i < gameServer.clients.length; i++) 
// 										{																																
// 											if ((gameServer.clients[i].name===current_S_ACCEPT_FRIEND.UserNameFriendA)) 
// 											{
// 												console.log("Gửi thong bao ket ban đến user được gửi lời mời: "+current_S_ACCEPT_FRIEND.UserNameFriendA);
// 												socket.emit('R_SEND_ACCEPT_FRIEND',
// 												{
// 													UserNameAddFriendA:current_S_ACCEPT_FRIEND.UserNameFriendA,
// 													UserNameAddFriendB:current_S_ACCEPT_FRIEND.UserNameFriendB,
// 												});	
// 											}
// 											if(gameServer.clients[i].name===current_S_ACCEPT_FRIEND.UserNameFriendB) 
// 											{
// 												console.log("Gửi thong bao ket ban đến user gửi lời mời: "+current_S_ACCEPT_FRIEND.UserNameFriendB);
// 												socket.broadcast.to(gameServer.clients[i].idSocket).emit('R_SEND_ACCEPT_FRIEND',
// 												{
// 													UserNameAddFriendA:current_S_ACCEPT_FRIEND.UserNameFriendA,
// 													UserNameAddFriendB:current_S_ACCEPT_FRIEND.UserNameFriendB,
// 												});						                												
// 											}																																																
// 										}


// 										var query = database.query("SELECT `UserNameFriendA`, `UserNameFriendB`, `ActiveStatus` FROM `addfriend` WHERE `UserNameFriendB`= '"+current_S_ACCEPT_FRIEND.UserNameFriendA
// 											+"' AND `UserNameFriendA`='"+current_S_ACCEPT_FRIEND.UserNameFriendB+"'",function(error, rows,field)
// 											{
// 												if (!!error){DetailError = ('addfriend: Error in the query 5');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);
// 											}else
// 											{	
// 												if (rows.length>0) 
// 												{																																
// 													//update resid															        					
// 													client.set(rows[0].UserNameFriendA+rows[0].UserNameFriendB,JSON.stringify(rows[0]));			        																																				
// 												}
// 											}
// 										});
// 									}
// 								}
// 							}
// 						});							
// 					}
// 				}
// 			});
// 			});


// socket.on('S_REJECT_INVITE_FRIEND', function (data)
// {				
// 	current_S_REJECT_INVITE_FRIEND = getcurrentFRIENDS(data);
// 	console.log("data receive S_REJECT_INVITE_FRIEND ========================:"+current_S_REJECT_INVITE_FRIEND.UserNameFriendA+"_"+current_S_REJECT_INVITE_FRIEND.UserNameFriendB);

// 	var query = database.query("DELETE FROM `addfriend` WHERE ActiveStatus = 0 AND ((`UserNameFriendA`= '"+current_S_REJECT_INVITE_FRIEND.UserNameFriendA
// 		+"' AND `UserNameFriendB`='"+current_S_REJECT_INVITE_FRIEND.UserNameFriendB
// 		+"') OR (`UserNameFriendB`= '"+current_S_REJECT_INVITE_FRIEND.UserNameFriendA
// 		+"' AND `UserNameFriendA`='"+current_S_REJECT_INVITE_FRIEND.UserNameFriendB+"'))",function(error, result, field)
// 		{
// 			if(!!error){DetailError = ('addfriend: Error in the query 6');
// 			console.log(DetailError);
// 			functions.writeLogErrror(DetailError);
// 		}else
// 		{
// 			if (result.affectedRows>0) 
// 			{															
// 				var GameServer = require("./../Login/login.js");
// 				var gameServer = new GameServer();
// 				exports.gameServer = gameServer;		
// 				if (gameServer.clients.length>0) 
// 				{									
// 					for (var i = 0; i < gameServer.clients.length; i++) 
// 					{									
// 						if (gameServer.clients[i].name===current_S_REJECT_INVITE_FRIEND.UserNameFriendB) 
// 						{										
// 							console.log("Gửi thong bao huy loi moi ket ban đến user: "+current_S_REJECT_INVITE_FRIEND.UserNameFriendB);										
// 							socket.broadcast.to(gameServer.clients[i].idSocket).emit('R_REJECT_INVITE_FRIEND',
// 							{
// 								UserNameAddFriend:current_S_REJECT_INVITE_FRIEND.UserNameFriendA,
// 							});							                	
// 						}
// 					}					
// 				}													
// 			}
// 		}
// 	});
// });


// socket.on('S_CANCEL_FRIEND', function (data)
// {
// 	current_S_CANCEL_FRIEND = getcurrentFRIENDS(data);
	
// 	currentTime = Math.floor(new Date().getTime() / 1000);
// 	var arrayFriendCanceled =[]; 
// 	console.log("data receive S_CANCEL_FRIEND====================: "+current_S_CANCEL_FRIEND.UserNameFriendA+"_"+current_S_CANCEL_FRIEND.UserNameFriendB);
// 	var query = database.query("UPDATE addfriend,users SET users.numberFriends= users.numberFriends-1, addfriend.ActiveStatus = 2,addfriend.TimeCancelFriend = '"
// 		+(parseFloat(currentTime)+3600)
// 		+ "'WHERE (users.UserName = '"+current_S_CANCEL_FRIEND.UserNameFriendA
// 		+"' OR users.UserName='"+current_S_CANCEL_FRIEND.UserNameFriendB
// 		+"')AND addfriend.ActiveStatus = 1 AND ((addfriend.UserNameFriendA= '"+current_S_CANCEL_FRIEND.UserNameFriendA
// 		+"' AND addfriend.UserNameFriendB='"+current_S_CANCEL_FRIEND.UserNameFriendB
// 		+"') OR (addfriend.UserNameFriendB= '"+current_S_CANCEL_FRIEND.UserNameFriendA
// 		+"' AND addfriend.UserNameFriendA='"+current_S_CANCEL_FRIEND.UserNameFriendB+"'))",function(error, result, field)
// 		{
// 			if(!!error){DetailError = ('addfriend: Error in the query 7');
// 			console.log(DetailError);
// 			functions.writeLogErrror(DetailError);
// 		}else
// 		{
// 			if (result.affectedRows>0) 
// 			{							
// 				var query = database.query("SELECT * FROM `addfriend` WHERE ActiveStatus = 2 AND ((`UserNameFriendA`= '"+current_S_CANCEL_FRIEND.UserNameFriendA
// 					+"' AND `UserNameFriendB`='"+current_S_CANCEL_FRIEND.UserNameFriendB
// 					+"') OR (`UserNameFriendB`= '"+current_S_CANCEL_FRIEND.UserNameFriendA
// 					+"' AND `UserNameFriendA`='"+current_S_CANCEL_FRIEND.UserNameFriendB+"'))",function(error, rows,field)
// 					{
// 						if (!!error){DetailError = ('addfriend: Error in the query 8');																	
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);
// 					}else
// 					{	
// 						if (rows.length>0) 
// 						{										
// 							arrayFriendCanceled =rows;																		
// 							var GameServer = require("./../Login/login.js");
// 							var gameServer = new GameServer();
// 							exports.gameServer = gameServer;		
// 							if (gameServer.clients.length>0) 
// 							{												
// 								for (var i = 0; i < gameServer.clients.length; i++) 
// 								{															
// 									if (gameServer.clients[i].name===current_S_CANCEL_FRIEND.UserNameFriendB) 
// 									{															
// 										console.log("Gửi thong bao huy ket ban đến user: "+current_S_CANCEL_FRIEND.UserNameFriendB);										
// 										socket.broadcast.to(gameServer.clients[i].idSocket).emit('R_CANCEL_FRIEND',
// 										{
// 											UserNameCancelFriend:current_S_CANCEL_FRIEND.UserNameFriendA,
// 										});							                	
// 									}
// 								}					
// 							}	
// 						}
// 					}
// 				});							
// 			}
// 		}			
// 	});				
// });	
// });

// cron.schedule('*/1 * * * * *',function()
// {
	
// 	currentTime = Math.floor(new Date().getTime() / 1000);

// 	//kiểm tra thoi gian hủy kết bạn

// 	var arrayResetCancelFriend=[],arrayUserCanceled=[],arrayMember=[];     						
// 	var query = database.query("SELECT * FROM `addfriend` WHERE ActiveStatus = 2 AND TimeCancelFriend <= '"+parseFloat(currentTime)+"'",function(error, rows,field)
// 	{
// 		if (!!error)
// 		{
// 			DetailError = ('addfriend: Error in the query 9');
// 			console.log(DetailError);
// 			functions.writeLogErrror(DetailError);
// 		}else
// 		{
// 			if (rows.length>0) 
// 			{
// 				var GameServer = require("./../Login/login.js");
// 				var gameServer = new GameServer();
// 				exports.gameServer = gameServer;
// 				arrayUserCanceled = rows;
// 				for (var i = 0; i < arrayUserCanceled.length; i++) 
// 				{
// 					var index = i;	
// 					arrayMember.push(arrayUserCanceled[index].UserNameFriendA);
// 					arrayMember.push(arrayUserCanceled[index].UserNameFriendB);				  			
// 					var query = database.query("DELETE FROM addfriend WHERE ActiveStatus = 2 AND UserNameFriendA = '"+arrayUserCanceled[index].UserNameFriendA
// 						+"' AND UserNameFriendB = '"+arrayUserCanceled[index].UserNameFriendB+"'",function(error, result, field)
// 						{
// 							if(!!error){DetailError = ('addfriend: Error in the query 10');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);
// 						}else
// 						{
// 							if(result.affectedRows>0)
// 							{

// 								client.del(arrayUserCanceled[index].UserNameFriendA+arrayUserCanceled[index].UserNameFriendB);										
// 								if (gameServer.clients.length>0) 
// 								{		
// 									console.log("gửi TimeCancelFriend");							  			
// 									for (var k = 0; k < arrayMember.length; k++) 
// 									{
// 										if ((lodash.filter(gameServer.clients, x => x.name === arrayMember[k])).length >0) 
// 										{										  				
// 											io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayMember[k])].idSocket).emit('RECEIVECANCELFRIENDTIME',
// 											{
// 												arrayCancelFriend:arrayUserCanceled[index],
// 											});							                														  									  								                	
// 										}	
// 									}	
// 								}
// 							}
// 						}
// 					})				  			
// 				}			 
// 			}
// 		}
	// })
// });
// }

// }
function getcurrentFRIENDS(data)
{
	return currentFRIENDS =
	{
		UserNameFriendA:data.UserNameFriendA,
		UserNameFriendB:data.UserNameFriendB,																
	}	
}	

