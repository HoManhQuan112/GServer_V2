'use strict';
var pool 		= require('./db');
var functions 	= require("./functions");
var client 		= require('./redis');
var lodash		= require('lodash');

var d,createPositionTimelast, currentSENDCHECKUNITINLOCATION, LevelShare, UnitOrderShare, unitTypeShare, QualityShare, HealthEachShare,	
				FarmEachShare, FarmPortableShare, HealthRemailShare, RootFarm, RemainFarm, dataTest ="", currentSENDUNITINLOCATIONSCOMPLETE,DetailError;
module.exports = 
{
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	
			socket.on('S_CHECK_UNIT_IN_LOCATION', function (data)
			{
				currentSENDCHECKUNITINLOCATION = getcurrentSENDCHECKUNITINLOCATION(data);
				console.log("data receive S_CHECK_UNIT_IN_LOCATION:  "+ currentSENDCHECKUNITINLOCATION.idUnitInLocations
																	+"_"+currentSENDCHECKUNITINLOCATION.UserName
																	+"_"+currentSENDCHECKUNITINLOCATION.numberBase
																	+"_"+currentSENDCHECKUNITINLOCATION.Quality
																	+"_"+currentSENDCHECKUNITINLOCATION.Farm
																	+"_"+currentSENDCHECKUNITINLOCATION.QualityAfterMerge
																	+"_"+currentSENDCHECKUNITINLOCATION.UnitOrder);		
				var GameServer = require("./login2");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;  														
				pool.getConnection(function(err,connection)
				{             
					//Check tài khuyên
					connection.query("SELECT unitType,Level,UnitOrder,Quality,HealthEach,FarmEach,FarmPortable,HealthRemain FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDCHECKUNITINLOCATION.idUnitInLocations
						+"'AND `Quality` = '"+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)+"'",function(error, rows,field)
			        {
						if (!!error){DetailError = ('unitlocation: Error in the query 1');
							console.log(DetailError);
                            functions.writeLogErrror(DetailError);
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
						        	if (!!error){DetailError = ('unitlocation: Error in the query 2');
						        		console.log(DetailError);
                                		functions.writeLogErrror(DetailError);
									}else
									{								
										if (rows.length>0) 
										{										
											//thực hiện update
											//kiểm tra unit đã đầy máu trước khi đưa vào thành
											if(parseFloat(HealthRemailShare) === parseFloat(HealthEachShare)*parseFloat(QualityShare))
											{
												//đầy máu														
												//kiểm tra và cập nhật unit in base
												//kiểm tra số lượng merge với bảng unitinbase có đúng không?												
												if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) === parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
												{
													//gửi len client thong tin cap nhat dung														
								                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)
								                			+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
													{
														if(!!error){DetailError = ('unitlocation: Error in the query 3');
															console.log(DetailError);
                                							functions.writeLogErrror(DetailError);
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
																socket.broadcast.emit('R_UNIT_DELETE',
																{
																	idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
											                	});
																connection.release();
											                	UpdateUnitOrderNull(currentSENDCHECKUNITINLOCATION.idUnitInLocations, function(err,data)
																{
																	if (err) {DetailError = ("ERROR ======: ",err);            
																		console.log(DetailError);
                                										functions.writeLogErrror(DetailError);
																	}else 
																	{            
																		if (parseFloat(data)===1) 
																		{
																			//update lại unit order																							
																			UpdateUnitOrder(currentSENDCHECKUNITINLOCATION.UserName,UnitOrderShare);
																			
																			connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																				+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																				+"'",function(error, rows,field)
																	        {
																				if (!!error){DetailError = ('unitlocation: Error in the query 4');
																					console.log(DetailError);
                                													functions.writeLogErrror(DetailError);
																				}else
																				{
																					if(rows.length > 0)
																					{																						
																						//cập nhật lại farm	
																						RootFarm = parseFloat(rows[0].Farm) + FarmPortableShare;
																						UpdateFarm(RootFarm,currentSENDCHECKUNITINLOCATION.UserName,currentSENDCHECKUNITINLOCATION.numberBase);
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
													//gửi mail
													connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
											        {
														if (!!error){DetailError = ('unitlocation: Error in the query 5');
															console.log(DetailError);
                                							functions.writeLogErrror(DetailError);
														}else
														{
															DetailError = ('unitlocation: Mail Error in the database 1');
															console.log(DetailError);
                                							functions.writeLogErrror(DetailError);
															connection.release();
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
													socket.emit('R_CHECK_UNIT_IN_LOCATION',
													{
														checkResource:0,
			                						});
												}												
																																																																		
											}else
											{											
												////không đầy máu												
												connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
													+"'",function(error, rows,field)
										        {
													if (!!error){DetailError = ('unitlocation: Error in the query 6');
														console.log(DetailError);
                                						functions.writeLogErrror(DetailError);
													}else
													{
														if(rows.length > 0)
														{
															RootFarm = parseFloat(rows[0].Farm);
															//Tính và cập nhật farm
															//Tính farm tiêu tốn	
															//kiểm tra unit location có đậy mau																								
															//Cập nhật farm trong thành
															if (RootFarm + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >= 0) 
															{		
																//cập nhật và xóa base
																// kiểm tra và cập nhật unit in base
																connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																	+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																	+"'AND `UnitType` = '"+unitTypeShare
																	+"'AND `Level` = '"+LevelShare
																	+"'",function(error, rows,field)
														        {
																	if (!!error){DetailError = ('unitlocation: Error in the query 7');
																		console.log(DetailError);
                                										functions.writeLogErrror(DetailError);
																	}else
																	{
																		if(rows.length > 0)
																		{													
																			//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																			if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																			{																																			                	
															                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)
															                		+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																				{
																					if(!!error){DetailError = ('unitlocation: Error in the query 8');
																						console.log(DetailError);
                                														functions.writeLogErrror(DetailError);
																					}else
																					{
																						if (result.affectedRows > 0) 
																						{																									
																							//xóa unit in location và cập nhật lại unit order
																							client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																							//check redis
																							//gửi lên client thông số id xóa
																							socket.broadcast.emit('R_UNIT_DELETE',
																							{
																								idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																		                	});
																		                	UpdateUnitOrderNull(currentSENDCHECKUNITINLOCATION.idUnitInLocations, function(err,data)
																							{
																								if (err) {DetailError = ("ERROR ======: ",err);            
																									console.log(DetailError);
                                																	functions.writeLogErrror(DetailError);
																								}else 
																								{            
																									if (parseFloat(data)===1) 
																									{
																										//update lại unit order																												
																										UpdateUnitOrder(currentSENDCHECKUNITINLOCATION.UserName,UnitOrderShare);	

																										//cập nhật farm trong thành															
																										RemainFarm = (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)));
																										UpdateFarm(RemainFarm,currentSENDCHECKUNITINLOCATION.UserName,currentSENDCHECKUNITINLOCATION.numberBase);
																										connection.release();
																									}
																								}
																							});																		   
																						}
																					}
																				});
																			}else
																			{
																				//gửi mail
																				connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																					+"'",function(error, rows,field)
																		        {
																					if (!!error){DetailError = ('unitlocation: Error in the query 9');
																						console.log(DetailError);
                                														functions.writeLogErrror(DetailError);
																					}else
																					{
																						connection.release();
																						DetailError = ('unitlocation: Mail Error in the database 2');
																						console.log(DetailError);
                                														functions.writeLogErrror(DetailError);
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
																				socket.emit('R_CHECK_UNIT_IN_LOCATION',
																				{
																					checkResource:0,
										                						});
																			}
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
											//Thực hiện Insert		
											console.log("Thực hiện Insert");							
											if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
											{
												//đầy máu																			        																					
												//cập nhật farm trong thành	
												//cập nhật và xóa base
												// kiểm tra và cập nhật unit in base
												connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
												+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
												+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
												{
										            if(!!error){DetailError = ('unitlocation: Error in the query 10');
										            	console.log(DetailError);
                                						functions.writeLogErrror(DetailError);
										            }else
										            {
										            	//xóa unit in location và cập nhật lại unit order												            	
														client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
														//check redis
														//gửi lên client thông số id xóa
														socket.broadcast.emit('R_UNIT_DELETE',
														{
															idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
									                	});
									                	UpdateUnitOrderNull(currentSENDCHECKUNITINLOCATION.idUnitInLocations, function(err,data)
														{
															if (err) {DetailError = ("ERROR ======: ",err);            
																console.log(DetailError);
                                								functions.writeLogErrror(DetailError);
															}else 
															{            
																if (parseFloat(data)===1) 
																{
																	connection.release();
																		//update lại unit order																		
																	UpdateUnitOrder(currentSENDCHECKUNITINLOCATION.UserName,UnitOrderShare);

																	//update farm																																																		
																	connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																		+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
																		+"'",function(error, rows,field)
															        {
																		if (!!error){DetailError = ('unitlocation: Error in the query 11');
																			console.log(DetailError);
                                											functions.writeLogErrror(DetailError);
																		}else
																		{
																			if(rows.length > 0)
																			{																						
																				//cập nhật lại farm	
																				RootFarm = parseFloat(rows[0].Farm) + FarmPortableShare;
																				UpdateFarm(RootFarm,currentSENDCHECKUNITINLOCATION.UserName,currentSENDCHECKUNITINLOCATION.numberBase);
																			}
																		}
																	});	
																}
															}
														});									    
										            }
												})										
																																										
											}else
											{											
												//không đầy máu
												connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
													+"'AND `numberBase` = '"+currentSENDCHECKUNITINLOCATION.numberBase
													+"'",function(error, rows,field)
										        {
													if (!!error){DetailError = ('unitlocation: Error in the query 12');
														console.log(DetailError);
                                						functions.writeLogErrror(DetailError);
													}else
													{
														if(rows.length > 0)
														{
															RootFarm = parseFloat(rows[0].Farm);
															//Tính và cập nhật farm
															//Tính farm tiêu tốn	
															//kiểm tra unit location có đậy mau																												
															//Cập nhật farm trong thành
															if (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
															{	
																//insert và xóa base
																// kiểm tra và cập nhật unit in base
																connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
																+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.numberBase+"','"+unitTypeShare+"','"
																+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
																{
														            if(!!error){DetailError = ('unitlocation: Error in the query 13');
														            	console.log(DetailError);
                                										functions.writeLogErrror(DetailError);
														            }else
														            {
														            	//xóa unit in location và cập nhật lại unit order																            	
																		client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																		//check redis
																		//gửi lên client thông số id xóa
																		socket.broadcast.emit('R_UNIT_DELETE',
																		{
																			idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
													                	});
													                	UpdateUnitOrderNull(currentSENDCHECKUNITINLOCATION.idUnitInLocations, function(err,data)
																		{
																			if (err) {DetailError = ("ERROR ======: ",err);            
																				console.log(DetailError);
                                												functions.writeLogErrror(DetailError);
																			}else 
																			{            
																				if (parseFloat(data)===1) 
																				{
																					connection.release();
																					//update lại unit order																																									
																					UpdateUnitOrder(currentSENDCHECKUNITINLOCATION.UserName,UnitOrderShare);

																					//cập nhật farm trong thành															
																					RemainFarm = (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)));
																					UpdateFarm(RemainFarm,currentSENDCHECKUNITINLOCATION.UserName,currentSENDCHECKUNITINLOCATION.numberBase);																				
																				}
																			}
																		});													     
														            }
																})													
																
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
									if (!!error){DetailError = ('unitlocation: Error in the query 14');
										console.log(DetailError);
                                		functions.writeLogErrror(DetailError);
									}else
									{
										DetailError = ('unitlocation: Mail Error in the database 3');	
										console.log(DetailError);
                                		functions.writeLogErrror(DetailError);	
										connection.release();
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
								socket.emit('R_CHECK_UNIT_IN_LOCATION',
								{
									checkResource:0,
			                	});
							}
						}
					});
				});
			});

			socket.on('S_UNIT_IN_LOCATIONS_COMPLETE', function (data)
			{
				currentSENDUNITINLOCATIONSCOMPLETE = getcurrentSENDUNITINLOCATIONSCOMPLETE(data);
				console.log("=====================data receive S_UNIT_IN_LOCATIONS_COMPLETE: "
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
						if (!!error){DetailError = ('unitlocation: Error in the query 15');
							console.log(DetailError);
                            functions.writeLogErrror(DetailError);
						}else
						{
							if(rows.length > 0)					
							{	
								if(parseFloat(rows[0].Quality)>= parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))
								{
									//trừ lính trong unitinbase và farm trong userbase
									connection.query("UPDATE userbase, unitinbase SET userbase.Farm = userbase.Farm - '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Farm)
										+"', unitinbase.Quality = unitinbase.Quality - '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality)
										+"' WHERE userbase.UserName = unitinbase.UserName AND userbase.numberBase = unitinbase.numberBase AND unitinbase.UserName = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
										+"' AND unitinbase.numberBase = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.numberBase)
										+"' AND unitinbase.UnitType = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.UnitType)
										+"' AND Level = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)+"'",function(error, result, field)
									{
										if(!!error){DetailError = ('unitlocation: Error in the query 16');
											console.log(DetailError);
                                			functions.writeLogErrror(DetailError);
										}else
										{
											if(result.affectedRows>0)
											{
												connection.query("SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` where `Level` = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)
													+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
										        {
													if (!!error){DetailError = ('unitlocation: Error in the query 17');
														console.log(DetailError);
                                						functions.writeLogErrror(DetailError);
													}else
													{
														if(rows.length > 0)
														{
															d = new Date();
										    				createPositionTimelast = Math.floor(d.getTime() / 1000);
															//insert unit in locations26
															connection.query("INSERT INTO `unitinlocations` (`idUnitInLocations`, `UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`TimeMoveComplete`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`, `userFight`,`FightRadius`) "
																+"VALUES ('"+""+"','"+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"','"
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
													            if(!!err){DetailError = ('unitlocation: Error in the query 18');
													            	console.log(DetailError);
                                									functions.writeLogErrror(DetailError);
													            }else
													            {		
													            	connection.release();												            												            													              	
																	//Send info of unit to clieny
																	SendUnitToClient(socket,result.insertId)
												                	
												                	//insert unitlocation to redis
												                	InsertRedis(result.insertId);

												                	//update quality
												                	UpdateQualityNull();															                	
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
						}
					})
				});
			});
        });
    }
}
function getcurrentSENDCHECKUNITINLOCATION(data)
{
	return currentSENDCHECKUNITINLOCATION =
		{
			idUnitInLocations:data.idUnitInLocations,
			UserName:data.UserName,
			numberBase:data.numberBase,				
			Quality:data.Quality,
			Farm:data.Farm,
			QualityAfterMerge:data.QualityAfterMerge,
			UnitOrder:data.UnitOrder,				
		}
}

function getcurrentSENDUNITINLOCATIONSCOMPLETE(data)
{
	return currentSENDUNITINLOCATIONSCOMPLETE =
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
}

function SendUnitToClient(socket,insertId)
{
	var query = pool.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+parseFloat(insertId)+"'",function(error, rows,field)
	{
		if (!!error){DetailError = ('unitlocation: Error in the query 19');
			console.log(DetailError);
            functions.writeLogErrror(DetailError);
		}else
		{
			if (rows.length > 0) 
			{
				socket.emit('R_UNIT_IN_LOCATIONS_COMPLETE',
				{
					idUnitInLocations:rows[0],																						
	        	});
	        	socket.broadcast.emit('R_UNIT_CREATE',
				{
					idUnitInLocations:rows[0],
	        	});
			}
		}
	})
}

function InsertRedis(insertId)
{
	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"+insertId+"'",function(error, rows,field)
	{
		if (!!error){DetailError = ('unitlocation: Error in the query 20');
			console.log(DetailError);
            functions.writeLogErrror(DetailError);
		}else
		{																															        					
			client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));																		        
		}
	})
}

function UpdateQualityNull()
{
	var query = pool.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
	{
		if(!!error){DetailError = ('unitlocation: Error in the query 21');
			console.log(DetailError);
            functions.writeLogErrror(DetailError);
		}
	})
}

function UpdateUnitOrder(UserName,UnitOrderShare)
{
	var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder - 1  WHERE UserName = '"+UserName
			+"' AND UnitOrder >'"+UnitOrderShare+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('unitlocation: Error in the query 22');
				console.log(DetailError);
                functions.writeLogErrror(DetailError);
			}
		})
}

function UpdateFarm(RemainFarm,UserName,numberBase)
{
	var query = pool.query("UPDATE userbase SET Farm = '"+parseFloat(RemainFarm)
		+"' where `UserName` = '"+UserName
		+"'AND `numberBase` = '"+numberBase
		+"'",function(error, result, field)
	{
		if(!!error){DetailError = ('unitlocation: Error in the query 23');
			console.log(DetailError);
            functions.writeLogErrror(DetailError);
		}
	});
}

function UpdateUnitOrderNull(idUnitInLocations,callback)
{
	var query = pool.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[idUnitInLocations],function(error, result, field)
	{
		if(!!error){DetailError = ('unitlocation: Error in the query 24');
			console.log(DetailError);
          	functions.writeLogErrror(DetailError);
			callback(error,null);
		}else
		{
			if(result.affectedRows > 0)
			{
				callback(null,1);
			}
		}
	});
}
