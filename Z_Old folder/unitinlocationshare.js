'use strict';
var pool = require('./db');
var functions 		= require("./functions");
var client 			= require('./redis');
var lodash		    = require('lodash');


module.exports = 
{
    start: function(io) 
    {
        io.on('connection', function(socket) 
        { 
			var currentSENDEXCHANGECHECKUNITINLOCATION,UserNameExchange, HealthExchangeLeft, HealthExchangeRight, UnitOrderZero; 
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
				console.login("========data receive SENDEXCHANGECHECKUNITINLOCATION: "
					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft
					+"-----"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight
					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight);			
				pool.getConnection(function(err,connection)
				{		
					var GameServer = require("./login");
				    var gameServer = new GameServer();
				    exports.gameServer = gameServer;	
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
												connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
													+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 281');
													}else
													{																															
														client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
														if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
														{
															//cập nhật tình trạng ofllie cho unit location
															gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
															gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);														
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
												connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
													+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
												{
													if (!!error)
													{
														console.log('Error in the query 283');
													}else
													{																															
														client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));	
														if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
														{
															//cập nhật tình trạng ofllie cho unit location
															gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
															gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);														
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

										//Cập nhật số lại id left và del right															
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
																					connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																						+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
																					{
																						if (!!error)
																						{
																							console.log('Error in the query 288');
																						}else
																						{																															
																							client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																							client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight);
																							if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																							{
																								//cập nhật tình trạng ofllie cho unit location
																								gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																								gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																				
																							}	
																							if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)).length > 0 ) 
																							{
																								//cập nhật tình trạng ofllie cho unit location																							
																								gameServer.redisarray.splice(gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)), 1);									
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
																					connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																						+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
																					{
																						if (!!error)
																						{
																							console.log('Error in the query 293');
																						}else
																						{																															
																							client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																							client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft);	
																							if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																							{
																								//cập nhật tình trạng ofllie cho unit location
																								gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																								gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																					
																							}
																							if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)).length > 0 ) 
																							{																							
																								gameServer.redisarray.splice(gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)), 1);									
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
											functions.sendMail(mailOptions);
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
										functions.sendMail(mailOptions);
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
			});
		});
    }
}