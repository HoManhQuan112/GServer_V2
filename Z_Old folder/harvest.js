'use strict';
var pool = require('./db');
var currentSENDSENDHARVEST,d,createPositionTimelast,MineHarvestServer=0,
FarmHarvestServer=0,WoodHarvestServer=0,StoneHarvestServer=0,MetalHarvestServer=0,
FarmHarvestRemain=0,WoodHarvestRemain=0,StoneHarvestRemain=0,MetalHarvestRemain=0,
FarmHarvestSurpass=0,WoodHarvestSurpass=0,StoneHarvestSurpass=0,MetalHarvestSurpass=0
,FarmHarvestTimeSurpass,WoodHarvestTimeSurpass,StoneHarvestTimeSurpass,MetalHarvestTimeSurpass;

module.exports = function (socket) 
{ 
	socket.on('SENDHARVEST', function (data)
	{
		currentSENDSENDHARVEST =
		{
			UserName:data.UserName,		
			numberBase:data.numberBase,				
			MineType:data.MineType,
			MineTotal:data.MineTotal,
			MineHarvest:data.MineHarvest,													
		}
		console.log("data receive harvest: "+currentSENDSENDHARVEST.UserName+"_"				
				+"_"+currentSENDSENDHARVEST.numberBase
				+"_"+currentSENDSENDHARVEST.MineType
				+"_"+currentSENDSENDHARVEST.MineTotal
				+"_"+currentSENDSENDHARVEST.MineHarvest);
		pool.getConnection(function(err,connection)
		{				
			switch(currentSENDSENDHARVEST.MineType) 
			{	 
			    case "Farm":
			    	{
						console.log("Thu hoach Farm");												
						connection.query("SELECT A.Farm,A.LvFarm,A.FarmHarvestTime,A.CurrentLvFarm, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN resourceupfarm AS B ON B.Level =  A.CurrentLvFarm INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDSENDHARVEST.UserName
							+"'AND A.numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the queryhg2sdftfh1');
								socket.emit('RECIEVEHARVEST', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}else
							{								
								if (rows.length > 0 && (parseFloat(rows[0].LvFarm)===parseFloat(rows[0].CurrentLvFarm))) 
								{				
									console.log("2 Level bẳng nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);			            			
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");																					                		
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Farm) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					FarmHarvestSurpass = (parseFloat(rows[0].Farm) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					FarmHarvestRemain = parseFloat(rows[0].HarvestContainer) - FarmHarvestSurpass;
			            					d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
			            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
				            					
			            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))
						                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Farm thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Farm thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Farm))) 
										{		
											console.log("Cập nhật thu hoạch theo server");	
											d = new Date();
				            				createPositionTimelast = Math.floor(d.getTime() / 1000);						
						            		if ((parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					FarmHarvestSurpass = (parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
					            				FarmHarvestRemain = parseFloat(MineHarvestServer) - FarmHarvestSurpass;
					            					//update tài nguyên còn lại của base						                									      
				            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))			                		
							                		
				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
							                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))	
							                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))						                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the qugry113434gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															FarmHarvestServer = parseFloat(rows[0].Farm) + parseFloat(FarmHarvestRemain);
															console.log("Thu hoach Farm thanh cong: "+ FarmHarvestServer);	
															console.log("farm hien tai: "+ parseFloat(rows[0].Farm));
															console.log("Farm set lai: "+ FarmHarvestSurpass);																
															socket.emit('RECIEVEHARVEST', 
															{
										                		FarmHarvestSurpass :FarmHarvestSurpass,
										                		FarmHarvestServer :FarmHarvestServer,
										            		});																	
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(MineHarvestServer))
						                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																FarmHarvestServer = parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer);
																console.log("farm hien tai: "+ parseFloat(rows[0].Farm));
																console.log("Thu hoach Farm thanh cong: "+ FarmHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		FarmHarvestServer :FarmHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base
											d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
											
			            					if ((parseFloat(rows[0].Farm) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					FarmHarvestSurpass = (parseFloat(rows[0].Farm) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					FarmHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - FarmHarvestSurpass;				            					
				            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))
						                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))	                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Farm thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestFarm = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Farm thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								} else if (rows.length > 0 && (parseFloat(rows[0].LvFarm)>parseFloat(rows[0].CurrentLvFarm))) 
								{				
									console.log("2 Level khác nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);
			            			console.log((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)));
			            			console.log(parseFloat(createPositionTimelast));
			            			console.log(parseFloat(rows[0].FarmHarvestTime));
			            			console.log(parseFloat(rows[0].HarvestContainer));
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");	
										d = new Date();
					            		createPositionTimelast = Math.floor(d.getTime() / 1000);																		
				                		//update tài nguyên còn lại của base	
				                		console.log("data update Farm: "+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(createPositionTimelast)
			            					+"_"+currentSENDSENDHARVEST.UserName
			            					+"_"+currentSENDSENDHARVEST.numberBase);
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Farm) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					FarmHarvestSurpass = (parseFloat(rows[0].Farm)+ parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					FarmHarvestRemain = parseFloat(rows[0].HarvestContainer) - FarmHarvestSurpass;			            					
			            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

			            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))
						                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))	
						                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Farm thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestFarm = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))	
					                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Farm thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].FarmHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Farm))) 
										{		
											console.log("Cập nhật thu hoạch theo server");							
						            		if ((parseFloat(rows[0].Farm)+ parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					FarmHarvestSurpass = (parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
				            					FarmHarvestRemain = parseFloat(MineHarvestServer) - FarmHarvestSurpass;					            					
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			   
				            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             		
							                		
				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
							                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))	
							                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))
							                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))							                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the qugry113434gfafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	FarmHarvestServer = parseFloat(rows[0].Farm) + parseFloat(FarmHarvestRemain);
																	console.log("Thu hoach Farm thanh cong: "+ FarmHarvestServer);	
																	console.log("farm hien tai: "+ parseFloat(rows[0].Farm));
																	console.log("Farm set lai: "+ FarmHarvestSurpass);																
																	socket.emit('RECIEVEHARVEST', 
																	{
												                		FarmHarvestSurpass :FarmHarvestSurpass,
												                		FarmHarvestServer :FarmHarvestServer,
												            		});																	
																	//gửi lên client load lại
																}else
																{
																	console.log("update khong thanh cong");
																}

															}
														});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(MineHarvestServer))
						                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))	
						                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																FarmHarvestServer = parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer);
																console.log("farm hien tai: "+ parseFloat(rows[0].Farm));
																console.log("Thu hoach Farm thanh cong: "+ FarmHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		FarmHarvestServer :FarmHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base	
											
			            					if ((parseFloat(rows[0].Farm) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					FarmHarvestSurpass = (parseFloat(rows[0].Farm) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					FarmHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - FarmHarvestSurpass;
												d = new Date();
			            						createPositionTimelast = Math.floor(d.getTime() / 1000);
				            					FarmHarvestTimeSurpass = parseFloat(createPositionTimelast) - (FarmHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(FarmHarvestRemain))
						                			+"',CurrenHarvestFarm = '"+ (parseFloat(FarmHarvestRemain))
						                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))	
						                			+"',FarmHarvestTime = '"+ (parseFloat(FarmHarvestTimeSurpass))		                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Farm thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Farm = Farm +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestFarm = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrentLvFarm = '"+ (parseFloat(rows[0].LvFarm))	
					                			+"',FarmHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Farm thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								}else
								{
									console.log("dữ liệu không đủ");
									socket.emit('RECIEVEHARVEST', 
									{
			                    		message : 0
			                		});
									console.log("gửi mail");
								}
							}

						});	
					}			        
			        break;
			    case "Wood":
			    	{
						console.log("Thu hoach Wood");												
						connection.query("SELECT A.Wood,A.LvWood,A.WoodHarvestTime,A.CurrentLvWood, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN resourceupWood AS B ON B.Level =  A.CurrentLvWood INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDSENDHARVEST.UserName
							+"'AND A.numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the queryhg2sdftfh2');
								socket.emit('RECIEVEHARVEST', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}else
							{								
								if (rows.length > 0 && (parseFloat(rows[0].LvWood)===parseFloat(rows[0].CurrentLvWood))) 
								{				
									console.log("2 Level bẳng nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);			            			
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");																					                		
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Wood) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					WoodHarvestRemain = parseFloat(rows[0].HarvestContainer) - WoodHarvestSurpass;
			            					d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
			            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
				            					
			            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))
						                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Wood thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Wood thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Wood))) 
										{		
											console.log("Cập nhật thu hoạch theo server");	
											d = new Date();
				            				createPositionTimelast = Math.floor(d.getTime() / 1000);						
						            		if ((parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
					            				WoodHarvestRemain = parseFloat(MineHarvestServer) - WoodHarvestSurpass;
					            					//update tài nguyên còn lại của base						                									      
				            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))			                		
							                		
				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
							                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))	
							                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))						                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the qugry113434gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															WoodHarvestServer = parseFloat(rows[0].Wood) + parseFloat(WoodHarvestRemain);
															console.log("Thu hoach Wood thanh cong: "+ WoodHarvestServer);	
															console.log("Wood hien tai: "+ parseFloat(rows[0].Wood));
															console.log("Wood set lai: "+ WoodHarvestSurpass);																
															socket.emit('RECIEVEHARVEST', 
															{
										                		WoodHarvestSurpass :WoodHarvestSurpass,
										                		WoodHarvestServer :WoodHarvestServer,
										            		});																	
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(MineHarvestServer))
						                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																WoodHarvestServer = parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer);
																console.log("Wood hien tai: "+ parseFloat(rows[0].Wood));
																console.log("Thu hoach Wood thanh cong: "+ WoodHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		WoodHarvestServer :WoodHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base
											d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
											
			            					if ((parseFloat(rows[0].Wood) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					WoodHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - WoodHarvestSurpass;				            					
				            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))
						                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))	                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Wood thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestWood = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Wood thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								} else if (rows.length > 0 && (parseFloat(rows[0].LvWood)>parseFloat(rows[0].CurrentLvWood))) 
								{				
									console.log("2 Level khác nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);
			            			console.log((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)));
			            			console.log(parseFloat(createPositionTimelast));
			            			console.log(parseFloat(rows[0].WoodHarvestTime));
			            			console.log(parseFloat(rows[0].HarvestContainer));
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");	
										d = new Date();
					            		createPositionTimelast = Math.floor(d.getTime() / 1000);																		
				                		//update tài nguyên còn lại của base	
				                		console.log("data update Wood: "+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(createPositionTimelast)
			            					+"_"+currentSENDSENDHARVEST.UserName
			            					+"_"+currentSENDSENDHARVEST.numberBase);
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Wood) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					WoodHarvestRemain = parseFloat(rows[0].HarvestContainer) - WoodHarvestSurpass;			            					
			            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

			            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))
						                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))	
						                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Wood thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestWood = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))	
					                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Wood thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].WoodHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Wood))) 
										{		
											console.log("Cập nhật thu hoạch theo server");							
						            		if ((parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
				            					WoodHarvestRemain = parseFloat(MineHarvestServer) - WoodHarvestSurpass;					            					
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			   
				            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             		
							                		
				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
							                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))	
							                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))
							                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))							                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the qugry113434gfafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	WoodHarvestServer = parseFloat(rows[0].Wood) + parseFloat(WoodHarvestRemain);
																	console.log("Thu hoach Wood thanh cong: "+ WoodHarvestServer);	
																	console.log("Wood hien tai: "+ parseFloat(rows[0].Wood));
																	console.log("Wood set lai: "+ WoodHarvestSurpass);																
																	socket.emit('RECIEVEHARVEST', 
																	{
												                		WoodHarvestSurpass :WoodHarvestSurpass,
												                		WoodHarvestServer :WoodHarvestServer,
												            		});																	
																	//gửi lên client load lại
																}else
																{
																	console.log("update khong thanh cong");
																}

															}
														});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(MineHarvestServer))
						                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))	
						                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																WoodHarvestServer = parseFloat(rows[0].Wood) + parseFloat(MineHarvestServer);
																console.log("Wood hien tai: "+ parseFloat(rows[0].Wood));
																console.log("Thu hoach Wood thanh cong: "+ WoodHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		WoodHarvestServer :WoodHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base	
											
			            					if ((parseFloat(rows[0].Wood) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					WoodHarvestSurpass = (parseFloat(rows[0].Wood) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					WoodHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - WoodHarvestSurpass;
												d = new Date();
			            						createPositionTimelast = Math.floor(d.getTime() / 1000);
				            					WoodHarvestTimeSurpass = parseFloat(createPositionTimelast) - (WoodHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(WoodHarvestRemain))
						                			+"',CurrenHarvestWood = '"+ (parseFloat(WoodHarvestRemain))
						                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))	
						                			+"',WoodHarvestTime = '"+ (parseFloat(WoodHarvestTimeSurpass))		                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Wood thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Wood = Wood +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestWood = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrentLvWood = '"+ (parseFloat(rows[0].LvWood))	
					                			+"',WoodHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Wood thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								}else
								{
									console.log("dữ liệu không đủ");
									socket.emit('RECIEVEHARVEST', 
									{
			                    		message : 0
			                		});
									console.log("gửi mail");
								}
							}

						});		
					}			        
			        break;
			    case "Stone":
			    	{
						console.log("Thu hoach Stone");		
											
						connection.query("SELECT A.Stone,A.LvStone,A.StoneHarvestTime,A.CurrentLvStone, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN resourceupStone AS B ON B.Level =  A.CurrentLvStone INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDSENDHARVEST.UserName
							+"'AND A.numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the queryhg2sdftfh3');
								socket.emit('RECIEVEHARVEST', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}else
							{								
								if (rows.length > 0 && (parseFloat(rows[0].LvStone)===parseFloat(rows[0].CurrentLvStone))) 
								{				
									console.log("2 Level bẳng nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);			            			
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");																					                		
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Stone) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					StoneHarvestRemain = parseFloat(rows[0].HarvestContainer) - StoneHarvestSurpass;
			            					d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
			            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
				            					
			            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))
						                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Stone thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Stone thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Stone))) 
										{		
											console.log("Cập nhật thu hoạch theo server");	
											d = new Date();
				            				createPositionTimelast = Math.floor(d.getTime() / 1000);			            				

						            		if ((parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
					            				StoneHarvestRemain = parseFloat(MineHarvestServer) - StoneHarvestSurpass;
					            					//update tài nguyên còn lại của base						                									      
				            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))			                		
							                		
				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
							                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))	
							                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))						                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the qugry113434gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															StoneHarvestServer = parseFloat(rows[0].Stone) + parseFloat(StoneHarvestRemain);
															console.log("Thu hoach Stone thanh cong: "+ StoneHarvestServer);	
															console.log("Stone hien tai: "+ parseFloat(rows[0].Stone));
															console.log("Stone set lai: "+ StoneHarvestSurpass);																
															socket.emit('RECIEVEHARVEST', 
															{
										                		StoneHarvestSurpass :StoneHarvestSurpass,
										                		StoneHarvestServer :StoneHarvestServer,
										            		});																	
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(MineHarvestServer))
						                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																StoneHarvestServer = parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer);
																console.log("Stone hien tai: "+ parseFloat(rows[0].Stone));
																console.log("Thu hoach Stone thanh cong: "+ StoneHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		StoneHarvestServer :StoneHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	
				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base
											d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
											
			            					if ((parseFloat(rows[0].Stone) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					StoneHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - StoneHarvestSurpass;				            					
				            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))
						                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))	                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Stone thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestStone = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Stone thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								} else if (rows.length > 0 && (parseFloat(rows[0].LvStone)>parseFloat(rows[0].CurrentLvStone))) 
								{				
									console.log("2 Level khác nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);
			            			console.log((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)));
			            			console.log(parseFloat(createPositionTimelast));
			            			console.log(parseFloat(rows[0].StoneHarvestTime));
			            			console.log(parseFloat(rows[0].HarvestContainer));
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");	
										d = new Date();
					            		createPositionTimelast = Math.floor(d.getTime() / 1000);																		
				                		//update tài nguyên còn lại của base	
				                		console.log("data update Stone: "+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(createPositionTimelast)
			            					+"_"+currentSENDSENDHARVEST.UserName
			            					+"_"+currentSENDSENDHARVEST.numberBase);
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Stone) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					StoneHarvestRemain = parseFloat(rows[0].HarvestContainer) - StoneHarvestSurpass;			            					
			            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

			            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))
						                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))	
						                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Stone thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestStone = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))	
					                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Stone thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].StoneHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Stone))) 
										{		
											console.log("Cập nhật thu hoạch theo server");							
						            		if ((parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
				            					StoneHarvestRemain = parseFloat(MineHarvestServer) - StoneHarvestSurpass;					            					
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			   
				            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             		
							                		
				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
							                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))	
							                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))
							                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))							                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the qugry113434gfafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	StoneHarvestServer = parseFloat(rows[0].Stone) + parseFloat(StoneHarvestRemain);
																	console.log("Thu hoach Stone thanh cong: "+ StoneHarvestServer);	
																	console.log("Stone hien tai: "+ parseFloat(rows[0].Stone));
																	console.log("Stone set lai: "+ StoneHarvestSurpass);																
																	socket.emit('RECIEVEHARVEST', 
																	{
												                		StoneHarvestSurpass :StoneHarvestSurpass,
												                		StoneHarvestServer :StoneHarvestServer,
												            		});																	
																	//gửi lên client load lại
																}else
																{
																	console.log("update khong thanh cong");
																}

															}
														});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(MineHarvestServer))
						                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))	
						                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																StoneHarvestServer = parseFloat(rows[0].Stone) + parseFloat(MineHarvestServer);
																console.log("Stone hien tai: "+ parseFloat(rows[0].Stone));
																console.log("Thu hoach Stone thanh cong: "+ StoneHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		StoneHarvestServer :StoneHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}
														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base	
											
			            					if ((parseFloat(rows[0].Stone) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					StoneHarvestSurpass = (parseFloat(rows[0].Stone) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					StoneHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - StoneHarvestSurpass;
												d = new Date();
			            						createPositionTimelast = Math.floor(d.getTime() / 1000);
				            					StoneHarvestTimeSurpass = parseFloat(createPositionTimelast) - (StoneHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(StoneHarvestRemain))
						                			+"',CurrenHarvestStone = '"+ (parseFloat(StoneHarvestRemain))
						                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))	
						                			+"',StoneHarvestTime = '"+ (parseFloat(StoneHarvestTimeSurpass))		                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Stone thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}
														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Stone = Stone +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestStone = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrentLvStone = '"+ (parseFloat(rows[0].LvStone))	
					                			+"',StoneHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Stone thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								}else
								{
									console.log("dữ liệu không đủ");
									socket.emit('RECIEVEHARVEST', 
									{
			                    		message : 0
			                		});
									console.log("gửi mail");
								}
							}

						});		
					}		        
			        break;
			    case "Metal":
			    	{
						console.log("Thu hoach Metal");		
											
						connection.query("SELECT A.Metal,A.LvMetal,A.MetalHarvestTime,A.CurrentLvMetal, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN resourceupMetal AS B ON B.Level =  A.CurrentLvMetal INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDSENDHARVEST.UserName
							+"'AND A.numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the queryhg2sdftfh4');
								socket.emit('RECIEVEHARVEST', 
								{
			                		message : 0
			            		});
								console.log("gửi mail");
							}else
							{								
								if (rows.length > 0 && (parseFloat(rows[0].LvMetal)===parseFloat(rows[0].CurrentLvMetal))) 
								{				
									console.log("2 Level bẳng nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);			            			
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");																					                		
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Metal) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					MetalHarvestRemain = parseFloat(rows[0].HarvestContainer) - MetalHarvestSurpass;
			            					d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
			            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
				            					
			            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))
						                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Metal thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Metal thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Metal))) 
										{		
											console.log("Cập nhật thu hoạch theo server");	
											d = new Date();
				            				createPositionTimelast = Math.floor(d.getTime() / 1000);			            				

						            		if ((parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
					            				MetalHarvestRemain = parseFloat(MineHarvestServer) - MetalHarvestSurpass;
					            					//update tài nguyên còn lại của base						                									      
				            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))			                		
							                		
				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
							                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))	
							                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))						                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the qugry113434gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															MetalHarvestServer = parseFloat(rows[0].Metal) + parseFloat(MetalHarvestRemain);
															console.log("Thu hoach Metal thanh cong: "+ MetalHarvestServer);	
															console.log("Metal hien tai: "+ parseFloat(rows[0].Metal));
															console.log("Metal set lai: "+ MetalHarvestSurpass);																
															socket.emit('RECIEVEHARVEST', 
															{
										                		MetalHarvestSurpass :MetalHarvestSurpass,
										                		MetalHarvestServer :MetalHarvestServer,
										            		});																	
															//gửi lên client load lại
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MineHarvestServer))
						                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																MetalHarvestServer = parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer);
																console.log("Metal hien tai: "+ parseFloat(rows[0].Metal));
																console.log("Thu hoach Metal thanh cong: "+ MetalHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		MetalHarvestServer :MetalHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base
											d = new Date();
			            					createPositionTimelast = Math.floor(d.getTime() / 1000);
											
			            					if ((parseFloat(rows[0].Metal) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					MetalHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - MetalHarvestSurpass;				            					
				            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))
						                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))	                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Metal thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestMetal = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Metal thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								} else if (rows.length > 0 && (parseFloat(rows[0].LvMetal)>parseFloat(rows[0].CurrentLvMetal))) 
								{				
									console.log("2 Level khác nhau");
									d = new Date();
			            			createPositionTimelast = Math.floor(d.getTime() / 1000);
			            			console.log((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)));
			            			console.log(parseFloat(createPositionTimelast));
			            			console.log(parseFloat(rows[0].MetalHarvestTime));
			            			console.log(parseFloat(rows[0].HarvestContainer));
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{
										console.log("thu hoach khi max store");	
										d = new Date();
					            		createPositionTimelast = Math.floor(d.getTime() / 1000);																		
				                		//update tài nguyên còn lại của base	
				                		console.log("data update Metal: "+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(rows[0].HarvestContainer)
			            					+"_"+parseFloat(createPositionTimelast)
			            					+"_"+currentSENDSENDHARVEST.UserName
			            					+"_"+currentSENDSENDHARVEST.numberBase);
			            				//Kiểm tra tài nguyên tổng và giới hạn granary
			            				if ((parseFloat(rows[0].Metal) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
			            				{
			            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
			            					MetalHarvestRemain = parseFloat(rows[0].HarvestContainer) - MetalHarvestSurpass;			            					
			            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

			            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))
						                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))	
						                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))						                						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query1134as34gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Metal thanh cong");														
														}else
														{
															console.log("update khong thanh cong");
														}
													}
												});
			            					
			            				}else
				            			{
				            				connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrenHarvestMetal = '"+ (parseFloat(rows[0].HarvestContainer))
					                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))	
					                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))				                						                		
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1134as34gfafd');
												}else
												{
													if (result.affectedRows>0) 
													{
														console.log("Thu hoach Metal thanh cong");
													}else
													{
														console.log("update khong thanh cong");
													}
												}
											});		
				            			}					                																			
									}else
									{
										console.log("thu hoach khi chua dat max store");
										d = new Date();
			            				createPositionTimelast = Math.floor(d.getTime() / 1000);												                			
										MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MetalHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
										if ((MineHarvestServer % 1 ) >= 0.5)
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else
										{
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}
										console.log("MineHarvestServer============: "+MineHarvestServer);
										if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].Metal))) 
										{		
											console.log("Cập nhật thu hoạch theo server");							
						            		if ((parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
				            				{
				            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
				            					MetalHarvestRemain = parseFloat(MineHarvestServer) - MetalHarvestSurpass;					            					
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			   
				            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             		
							                		
				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
							                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))	
							                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))
							                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))							                								                						                		
							                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
							                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
														{
															if(!!error)
															{
																console.log('Error in the qugry113434gfafd');
															}else
															{
																if (result.affectedRows>0) 
																{
																	MetalHarvestServer = parseFloat(rows[0].Metal) + parseFloat(MetalHarvestRemain);
																	console.log("Thu hoach Metal thanh cong: "+ MetalHarvestServer);	
																	console.log("Metal hien tai: "+ parseFloat(rows[0].Metal));
																	console.log("Metal set lai: "+ MetalHarvestSurpass);																
																	socket.emit('RECIEVEHARVEST', 
																	{
												                		MetalHarvestSurpass :MetalHarvestSurpass,
												                		MetalHarvestServer :MetalHarvestServer,
												            		});																	
																	//gửi lên client load lại
																}else
																{
																	console.log("update khong thanh cong");
																}

															}
														});	

				            					
				            				}else
				            				{
				            					//update tài nguyên còn lại của base							                			
						                		d = new Date();
				            					createPositionTimelast = Math.floor(d.getTime() / 1000);			                		
						                		connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MineHarvestServer))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MineHarvestServer))
						                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))	
						                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))						                						                		
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the qugry113434gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{																
																MetalHarvestServer = parseFloat(rows[0].Metal) + parseFloat(MineHarvestServer);
																console.log("Metal hien tai: "+ parseFloat(rows[0].Metal));
																console.log("Thu hoach Metal thanh cong: "+ MetalHarvestServer);
																socket.emit('RECIEVEHARVEST', 
																{
											                		MetalHarvestServer :MetalHarvestServer,
											            		});
																//gửi lên client load lại
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});	

				            				}
																												
										}else
										{
											console.log("Cập nhật thu hoạch theo client");
											//update tài nguyên còn lại của base	
											
			            					if ((parseFloat(rows[0].Metal) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
				            				{

				            					MetalHarvestSurpass = (parseFloat(rows[0].Metal) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
				            					MetalHarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - MetalHarvestSurpass;
												d = new Date();
			            						createPositionTimelast = Math.floor(d.getTime() / 1000);
				            					MetalHarvestTimeSurpass = parseFloat(createPositionTimelast) - (MetalHarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))

				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(MetalHarvestRemain))
						                			+"',CurrenHarvestMetal = '"+ (parseFloat(MetalHarvestRemain))
						                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))	
						                			+"',MetalHarvestTime = '"+ (parseFloat(MetalHarvestTimeSurpass))		                							                			
						                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
						                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query14gfafd');
														}else
														{
															if (result.affectedRows>0) 
															{
																console.log("Thu hoach Metal thanh cong");															
															}else
															{
																console.log("update khong thanh cong");
															}

														}
													});

				            						
				            				}else
				            				{
				            					connection.query("UPDATE userbase SET Metal = Metal +'"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrenHarvestMetal = '"+ (parseFloat(currentSENDSENDHARVEST.MineHarvest))
					                			+"',CurrentLvMetal = '"+ (parseFloat(rows[0].LvMetal))	
					                			+"',MetalHarvestTime = '"+ (parseFloat(createPositionTimelast))		                							                			
					                			+"'where UserName = '"+currentSENDSENDHARVEST.UserName
					                			+"'AND numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query14gfafd');
													}else
													{
														if (result.affectedRows>0) 
														{
															console.log("Thu hoach Metal thanh cong");
														}else
														{
															console.log("update khong thanh cong");
														}

													}
												});	
				            				}			                		
										}										
									}
									
								}else
								{
									console.log("dữ liệu không đủ");
									socket.emit('RECIEVEHARVEST', 
									{
			                    		message : 0
			                		});
									console.log("gửi mail");
								}
							}

						});		
					}		        
			        break;			  
			    default:
		        	console.log(" mac dinh");
			}				
    				     	
   		});

	});
};