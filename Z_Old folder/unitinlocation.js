'use strict';
var pool 		= require('./db');
var functions 	= require("./functions");
var client 		= require('./redis');
var lodash		= require('lodash');


module.exports = 
{
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	var d,createPositionTimelast, currentSENDCHECKUNITINLOCATION, LevelShare, UnitOrderShare, unitTypeShare, QualityShare, HealthEachShare,	
				FarmEachShare, FarmPortableShare, HealthRemailShare, dataTest ="", currentSENDUNITINLOCATIONSCOMPLETE;
			socket.on('SENDCHECKUNITINLOCATION', function (data)
			{
				currentSENDCHECKUNITINLOCATION =
				{
					idUnitInLocations:data.idUnitInLocations,
					UserName:data.UserName,
					numberBase:data.numberBase,				
					Quality:data.Quality,
					Farm:data.Farm,
					QualityAfterMerge:data.QualityAfterMerge,
					UnitOrder:data.UnitOrder,				
				}
				console.log('data receive SENDCHECKUNITINLOCATION" '+ currentSENDCHECKUNITINLOCATION.idUnitInLocations
																	+"_"+currentSENDCHECKUNITINLOCATION.UserName
																	+"_"+currentSENDCHECKUNITINLOCATION.numberBase
																	+"_"+currentSENDCHECKUNITINLOCATION.Quality
																	+"_"+currentSENDCHECKUNITINLOCATION.Farm
																	+"_"+currentSENDCHECKUNITINLOCATION.QualityAfterMerge
																	+"_"+currentSENDCHECKUNITINLOCATION.UnitOrder);		
				var GameServer = require("./login");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;  														
				pool.getConnection(function(err,connection)
				{             
					//Check tài khuyên
					connection.query("SELECT unitType,Level,UnitOrder,Quality,HealthEach,FarmEach,FarmPortable,HealthRemain FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDCHECKUNITINLOCATION.idUnitInLocations
						+"'AND `Quality` = '"+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)+"'",function(error, rows,field)
			        {
						if (!!error){console.log('Error in the query 230');
						}else
						{
							if(rows.length > 0)
							{							
								//gán giá trị select được
								LevelShare = rows[0].Level;
								UnitOrderShare = rows[0].UnitOrder;
								unitTypeShare = rows[0].unitType;
								QualityShare = rows[0].Quality;
								HealthEachShare = rows[0].HealthEach;
								FarmEachShare = rows[0].FarmEach;
								FarmPortableShare = rows[0].FarmPortable;
								HealthRemailShare = rows[0].HealthRemain;						
								
								//kiểm tra insert hay update
								connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
									+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
									+"'AND `UnitType` = '"+unitTypeShare
									+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
						        {
						        	if (!!error){console.log('Error in the query 231');
									}else
									{								
										if (rows.length>0) 
										{										
											//thực hiện update
											//kiểm tra unit đã đầy máu trước khi đưa vào thành
											if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
											{
												//đầy máu																			        																																
												//cập nhật farm trong thành											
												connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))
													+"' where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase+"'",function(error, result, field)
												{
													if(!!error){console.log('Error in the query 232');
													}else
													{													
														if (result.affectedRows > 0) 
														{
															//cập nhật và xóa base
															// kiểm tra và cập nhật unit in base
															connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																+"'AND `UnitType` = '"+unitTypeShare
																+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
													        {
																if (!!error){console.log('Error in the query 233');
																}else
																{
																	if(rows.length > 0)
																	{													
																		//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																		if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																		{
																			//gửi len client thong tin cap nhat dung
																			socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																			{
																				checkResource:1,
														                	});	
														                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)
														                			+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																			{
																				if(!!error){console.log('Error in the query 234');
																				}else
																				{
																					if (result.affectedRows > 0) 
																					{																				
																						//xóa unit in location và cập nhật lại unit order
																						client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																						if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)).length > 0 ) 
																						{																																							
																							gameServer.redisarray.splice(gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)), 1);									
																						}	

																						//check redis
																						//gửi lên client thông số id xóa
																						socket.broadcast.emit('RECEIVEUNITDELETE',
																						{
																							idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																	                	});
																	                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																						{
																							if(!!error){console.log('Error in the query 235');
																							}else
																							{
																								if(result.affectedRows > 0)
																								{
																									//update lại unit order																							
																									connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																											+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																									{
																										if (!!error){console.log('Error in the query 236');
																										}else
																										{
																											if(rows.length > 0)
																											{
																												for (var i = 0; i < rows.length; i++)
																												{
																													connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																													[(parseFloat(rows[i].UnitOrder)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseFloat(rows[i].UnitOrder))],function(error, result, field)
																													{
																														if(!!error){console.log('Error in the query 237');}
																													})
																												}

																											}
																										}
																									})	
																								}
																							}
																						})
																					}
																				}
																			});
																		}else
																		{
																			//gửi mail
																			connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
																	        {
																				if (!!error)
																				{
																					console.log('Error in the query 240');
																				}else
																				{
																					console.log('Mail Error in the database 1');

																					for (var i = 0; i < rows.length; i++)
																					{
																					 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																					 		+parseFloat(rows[i].UnitType)+"</td><td>"
																					 		+parseFloat(rows[i].Quality)+"</td><td>"
																							+parseFloat(rows[i].Level)+"</td><td>"
																							+parseFloat(rows[i].UnitOrder)+"</td></tr>";
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
																						"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
																						"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																						"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
																						+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
																						+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
																					};
																					// send mail with defined transport object
																					functions.sendMail(mailOptions);
																				}
																			})
																			socket.emit('RECEIVECHECKUNITINLOCATION',
																			{
																				checkResource:0,
									                						});
																		}
																	}
																}
															});
														}
													}
												});																				
														
											}else
											{											
												//không đầy máu
												connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
													+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 241');
													}else
													{
														if(rows.length > 0)
														{
															//Tính và cập nhật farm
															//Tính farm tiêu tốn	
															//kiểm tra unit location có đậy mau										
															
															//Cập nhật farm trong thành
															if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
															{															
																//cập nhật farm trong thành															
																connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))
																	+"' where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																	+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																	+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 242');
																	}else
																	{																	
																		if (result.affectedRows > 0) 
																		{
																			//cập nhật và xóa base
																			// kiểm tra và cập nhật unit in base
																			connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																				+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																				+"'AND `UnitType` = '"+unitTypeShare
																				+"'AND `Level` = '"+LevelShare
																				+"'",function(error, rows,field)
																	        {
																				if (!!error){console.log('Error in the query 243');
																				}else
																				{
																					if(rows.length > 0)
																					{													
																						//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																						if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																						{
																							//gửi len client thong tin cap nhat dung
																							socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																							{
																								checkResource:1,
																		                	});															                	
																		                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)
																		                		+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																							{
																								if(!!error){console.log('Error in the query 244');
																								}else
																								{
																									if (result.affectedRows > 0) 
																									{																									
																										//xóa unit in location và cập nhật lại unit order
																										client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																										//check redis
																										//gửi lên client thông số id xóa
																										socket.broadcast.emit('RECEIVEUNITDELETE',
																										{
																											idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																					                	});
																					                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																										{
																											if(!!error){console.log('Error in the query 245');
																											}else
																											{
																												if(result.affectedRows > 0)
																												{
																													//update lại unit order																												
																													connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																															+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																													{
																														if (!!error){console.log('Error in the query 246');
																														}else
																														{
																															if(rows.length > 0)
																															{
																																for (var i = 0; i < rows.length; i++)
																																{
																																	connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																																	[(parseFloat(rows[i].UnitOrder)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseFloat(rows[i].UnitOrder))],function(error, result, field)
																																	{
																																		if(!!error){console.log('Error in the query 247');
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
																								}
																							});
																						}else
																						{
																							//gửi mail
																							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																								+"'",function(error, rows,field)
																					        {
																								if (!!error){console.log('Error in the query 250');
																								}else
																								{
																									console.log('Mail Error in the database 2');
																									for (var i = 0; i < rows.length; i++)
																									{
																									 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																									 		+parseFloat(rows[i].UnitType)+"</td><td>"
																									 		+parseFloat(rows[i].Quality)+"</td><td>"
																											+parseFloat(rows[i].Level)+"</td><td>"
																											+parseFloat(rows[i].UnitOrder)+"</td></tr>";
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
																										"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
																										"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
																										"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
																										+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
																										+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
																									};
																									// send mail with defined transport object
																									functions.sendMail(mailOptions);
																								}
																							})
																							socket.emit('RECEIVECHECKUNITINLOCATION',
																							{
																								checkResource:0,
													                						});
																						}
																					}
																				}
																			});

																		}
																	}
																});

															}else
															{
																//gửi số 2
																console.log("khong du dieu kien thu ve thanh 251");
																socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																{
																	checkResource:2,
											                	});
															}										

														}										

													}
												});
											}		
										}else
										{	
											//Thực hiện Insert									
											if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
											{
												//đầy máu																			        																					
												//cập nhật farm trong thành											
												connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))
													+"' where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
													+"'",function(error, result, field)										{
													if(!!error){console.log('Error in the query 251');
													}else
													{													
														if (result.affectedRows > 0) 
														{
															//cập nhật và xóa base
															// kiểm tra và cập nhật unit in base
															connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
															+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
															+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
															{
													            if(!!error){console.log('Error in the query 252');
													            }else
													            {
													            	//xóa unit in location và cập nhật lại unit order												            	
																	client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																	//check redis
																	//gửi lên client thông số id xóa
																	socket.broadcast.emit('RECEIVEUNITDELETE',
																	{
																		idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
												                	});
												                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																	{
																		if(!!error){console.log('Error in the query 253');
																		}else
																		{
																			if(result.affectedRows > 0)
																			{
																				//update lại unit order																		
																				connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																						+"'AND `UnitOrder` > '"+UnitOrderShare
																						+"'",function(error, rows,field)
																				{
																					if (!!error){console.log('Error in the query 254');
																					}else
																					{
																						if(rows.length > 0)
																						{
																							for (var i = 0; i < rows.length; i++)
																							{
																								connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																								[(parseFloat(rows[i].UnitOrder)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseFloat(rows[i].UnitOrder))],function(error, result, field)
																								{
																									if(!!error){console.log('Error in the query 255');
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
													}
												});																															
											}else
											{											
												//không đầy máu
												connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
													+"'",function(error, rows,field)
										        {
													if (!!error){console.log('Error in the query 258');
													}else
													{
														if(rows.length > 0)
														{
															//Tính và cập nhật farm
															//Tính farm tiêu tốn	
															//kiểm tra unit location có đậy mau																												
															//Cập nhật farm trong thành
															if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
															{															
																//cập nhật farm trong thành															
																connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))
																	+"' where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																	+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																	+"'",function(error, result, field)
																{
																	if(!!error){console.log('Error in the query 259');
																	}else
																	{																	
																		if (result.affectedRows > 0) 
																		{
																			//insert và xóa base
																			// kiểm tra và cập nhật unit in base
																			connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
																			+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
																			+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
																			{
																	            if(!!error){console.log('Error in the query 260');
																	            }else
																	            {
																	            	//xóa unit in location và cập nhật lại unit order																            	
																					client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																					//check redis
																					//gửi lên client thông số id xóa
																					socket.broadcast.emit('RECEIVEUNITDELETE',
																					{
																						idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																                	});
																                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																					{
																						if(!!error){console.log('Error in the query 261');
																						}else
																						{
																							if(result.affectedRows > 0)
																							{
																								//update lại unit order																						
																								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																										+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																								{
																									if (!!error){console.log('Error in the query 262');
																									}else
																									{
																										if(rows.length > 0)
																										{
																											for (var i = 0; i < rows.length; i++)
																											{
																												connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																												[(parseFloat(rows[i].UnitOrder)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseFloat(rows[i].UnitOrder))],function(error, result, field)
																												{
																													if(!!error){console.log('Error in the query 263');
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
																	}
																});
															}else
															{
																//gửi số 2
																console.log("khong du dieu kien thu ve thanh 266");
																socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																{
																	checkResource:2,
											                	});
															}									

														}									

													}
												});
											}	

										}
									}
						        });									

							}else
							{            		
								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
						        {
									if (!!error){console.log('Error in the query 267');
									}else
									{
										console.log('Mail Error in the database 3');	
										for (var i = 0; i < rows.length; i++)
										{
										 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
										 		+parseFloat(rows[i].UnitType)+"</td><td>"
										 		+parseFloat(rows[i].Quality)+"</td><td>"
												+parseFloat(rows[i].Level)+"</td><td>"
												+parseFloat(rows[i].UnitOrder)+"</td></tr>";
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
											"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
											"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
											"<tr><td>"+currentSENDCHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDCHECKUNITINLOCATION.UnitType+"</td><td>"
											+currentSENDCHECKUNITINLOCATION.Quality+"</td><td>"+currentSENDCHECKUNITINLOCATION.Level+"</td><td>"
											+currentSENDCHECKUNITINLOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
										};
										// send mail with defined transport object
										functions.sendMail(mailOptions);
									}
								})
								socket.emit('RECEIVECHECKUNITINLOCATION',
								{
									checkResource:0,
			                	});
							}
						}
					});
				});
			});

			socket.on('SENDUNITINLOCATIONSCOMPLETE', function (data)
			{
				currentSENDUNITINLOCATIONSCOMPLETE =
				{
					UserName:data.UserName,
					numberBase:data.numberBase,
					UnitType:data.UnitType,
					Quality:data.Quality,
					Position:data.Position,
					Level:data.Level,
					UnitOrder:data.UnitOrder,
		    		Farm:data.Farm,
				}	
				console.log("=====================data receive SENDUNITINLOCATIONSCOMPLETE: "
						+ currentSENDUNITINLOCATIONSCOMPLETE.UserName
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Quality
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Position
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Level
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder
						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Farm);		 			
				pool.getConnection(function(err,connection)
				{								

					//Check số lượng lính trong unit in base
					connection.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
						+"'AND `numberBase` = '"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
						+"'AND `Level` = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)
						+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
			        {
						if (!!error){console.log('Error in the query 268');
						}else
						{
							if(rows.length > 0)					
							{	
								if(parseFloat(rows[0].Quality)>= parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))
								{
									//trừ lính trong unit in base và farm trong userbase								
									connection.query("UPDATE userbase SET Farm = Farm -'"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Farm)
										+"' WHERE UserName = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
										+"' AND numberBase = '"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
										+"'",function(error, result, field)
									{
										if(!!error){console.log('Error in the query 269');
										}else
										{										
											if(result.affectedRows>0)
											{
												connection.query("UPDATE unitinbase SET Quality = Quality - '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality)
															+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
												[currentSENDUNITINLOCATIONSCOMPLETE.UserName,currentSENDUNITINLOCATIONSCOMPLETE.numberBase, currentSENDUNITINLOCATIONSCOMPLETE.UnitType, 
														currentSENDUNITINLOCATIONSCOMPLETE.Level],function(error, result, field)
												{
													if(!!error){console.log('Error in the query 270');
													}else
													{													
														if(result.affectedRows>0)
														{
															connection.query("SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` where `Level` = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)
																+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
													        {
																if (!!error){console.log('Error in the query 271');
																}else
																{
																	if(rows.length > 0)
																	{
																		d = new Date();
													    				createPositionTimelast = Math.floor(d.getTime() / 1000);
																		//insert unit in locations26
																		connection.query("INSERT INTO `unitinlocations` (`idUnitInLocations`, `UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`TimeMoveComplete`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`, `userFight`,`FightRadius`) VALUES ('"+
																		""+"','"+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"','"
																		+(parseFloat(rows[0].Health)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
																		+parseFloat(rows[0].Health)+"','"
																		+(parseFloat(rows[0].Health)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
																		+(parseFloat(rows[0].Damage)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
																		+parseFloat(rows[0].Damage)+"','"+
																		+(parseFloat(rows[0].Defend)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
																		+parseFloat(rows[0].Defend)+"','"
																		+parseFloat(rows[0].Farm)+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.Farm+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"																	
																		+currentSENDUNITINLOCATIONSCOMPLETE.Quality+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.Level+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder+"','"
																		+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
																		+0+"','"+parseFloat(rows[0].MoveSpeed)+"','"
																		+createPositionTimelast+"','"
																		+createPositionTimelast+"','"
																		+0+"','"+1+"','"+1+"','"+0+"','"+0+"','"+""+"','"+4+"')",function(error, result, field)
																		{
																            if(!!err){console.log('Error in the query 272');
																            }else
																            {															            												            	
															                	connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																				{
																					if (!!error){console.log('Error in the query 273');
																					}else
																					{																						
																	        			socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																						{
																							idUnitInLocations:rows[0],																						
																	                	});
																	                	socket.broadcast.emit('RECEIVEUNITCREAT',
																						{
																							idUnitInLocations:rows[0],
																	                	});
																				        
																					}
																				})
															                	
															                	//insert unitlocation to redis
															                	connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																				{
																					if (!!error){console.log('Error in the query 274');
																					}else
																					{																															        					
																	        			client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));																		        
																					}
																				})


															                	connection.query('DELETE FROM unitinbase WHERE Quality = ?',[0],function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the query 275');
																					}
																				})
																            }
																		})
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
									socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
									{
										checkResource:0,
				                	});
								}
							}
						}
					})
				});
			});
        });
    }
}