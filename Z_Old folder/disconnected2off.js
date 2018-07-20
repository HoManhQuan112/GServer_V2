'use strict';
var pool = require('./db');
var lodash		   		= require('lodash');
var functions 			= require("./functions");
var sqrt 				= require( 'math-sqrt' );
var math 				= require('mathjs');
var cron 				= require('node-cron');
var datetime 			= require('node-datetime');
var client 				= require('./redis');
var currentdisconect 	= [];
var DetailError; 

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {         	 
        	socket.on('S_DISCONNECTED', function (data)
			{			
				currentdisconect = getcurrentdisconect(data);	
				var arrayOnlineStatus = [], X, Z, arrB, arrC, TimeMoveToOff = 0, arraySendFarmMoveConsumeOff=[], APositionOff, BPositionOff, AOff, A1Off, A2Off, 
		    	BOff, B1Off, B2Off, XOff, ZOff, PositionChangeOff, FarmPortableMoveOnOff, FarmPortableMoveOff, arrayUnitLocationsComplete = [],
		    	AverageFarmSecond, NumberSecondMoveOff, PositionChangeOffNotEnought, TimeMoveCompletes=0, TimeMoveCompleteOffs = 0, d, createPositionTimelast,
		    	arrayNotisyStatus,timeMoveLogout, PositionLogout,timeGetDetail,arrayDistanceMove=[];
		    	if (currentdisconect.UserName.length>0) 
		    	{
		    		console.log(currentdisconect.UserName+" "+currentdisconect.idSocket);			    		
		    	}				
				var GameServer = require("./login2");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer; 	    
				if (gameServer.clients.length>0
					&&(currentdisconect.UserName.length > 0)&&(currentdisconect.idSocket.length>0)) 
				{																					
					if (((lodash.filter(gameServer.clients, x => x.idSocket === currentdisconect.idSocket)).length) >= 1)
					{																									    	
				    	d = new Date();
			    		createPositionTimelast = Math.floor(d.getTime() / 1000);

						//cập nhật khong xem tn guild						    			
						var query = pool.query("UPDATE users SET TimeCancelGuild = '"+parseFloat(createPositionTimelast)+"' where UserName = '"+currentdisconect.UserName+"' AND CheckCloseMessGuild = 0",function(error, result, field)
						{
							if(!!error){DetailError = ('disconected: Error in the query 1');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						});	

						//cập nhật khong xem tin nhan cua private
						var query = pool.query("UPDATE users SET CheckCloseMessPrivateUser = 1 where UserName = '"+currentdisconect.UserName+"' AND CheckCloseMessPrivateUser = 0",function(error, result, field)
						{
							if(!!error){DetailError = ('disconected: Error in the query 2');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						});		

						//cập nhật thời gian
				    	var query = pool.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout = ?,timeResetMine = ? WHERE UserName = ?', ["","",createPositionTimelast,"", currentdisconect.UserName],function(error, result, field)
						{
							if(!!error){DetailError = ('disconected: Error in the query 3');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						});			

						//cập nhật guild											
						var query = pool.query('UPDATE guildlistmember SET Status = 0 WHERE MemberName = ?', [currentdisconect.UserName],function(error, result, field)
						{													
							if(!!error){DetailError = ('disconected: Error in the query 4');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						});	
						//cập nhật time move ,time check và time click ngay lúc log out	
			    		var query = pool.query("SELECT `idUnitInLocations`,`TimeMoveComplete`,`TimeCheck`,`timeClick` FROM `unitinlocations`WHERE TimeMoveComplete > 0 AND UserName = ?",[currentdisconect.UserName],function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the query4');
							}else
							{
								if (rows.length>0) 
								{
									console.log("1");
									for (var i = 0; i < rows.length; i++) 
									{
										if ((parseFloat(rows[i].TimeCheck)-parseFloat(createPositionTimelast))>0) 
										{
											timeMoveLogout = (parseFloat(rows[i].TimeCheck)-parseFloat(createPositionTimelast));

										}else
										{
											timeMoveLogout =0;
										}

										var query = pool.query('UPDATE unitinlocations SET TimeMoveComplete = ?,TimeCheck = ?,timeClick = ? WHERE idUnitInLocations = ?', [parseFloat(timeMoveLogout),(parseFloat(createPositionTimelast) + parseFloat(timeMoveLogout)),parseFloat(createPositionTimelast), rows[i].idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the querygvh');
											}else
											{
												if(result)
												{
													console.log("2");
													//cập nhật vị trị mổi giây unit off đi
													var query = pool.query("SELECT `idUnitInLocations`,`Position`,`PositionClick`,`TimeMoveComplete` FROM `unitinlocations`WHERE TimeMoveComplete > 0 AND UserName = ?",[currentdisconect.UserName],function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query4');
														}else
														{
															if (rows.length>0) 
															{
																console.log("3");
																var APosition, BPosition, A,A1,A2,B,B1,B2,XB,ZB,XL,ZL,k;
																d = new Date();
																createPositionTimelast = Math.floor(d.getTime() / 1000);
																for (var i = 0; i < rows.length; i++)
																{																			
																	APosition = rows[i].Position;
																	A = APosition.split(",");
																	A1 = parseFloat(A[0]);
																	A2 = parseFloat(A[1]);
																	BPosition = rows[i].PositionClick;
																	B = BPosition.split(",");
																	B1 = parseFloat(B[0]);
																	B2 = parseFloat(B[1]);
																	//kiểm tra trùng và set lại
																	console.log("4");
																	for (var k = 1; k <= rows[i].TimeMoveComplete; k++) 
																	{	
																		console.log("5");

																		if (k===1) 
																		{
																			XB= A1+((k)*(B1-A1))/parseFloat(rows[i].TimeMoveComplete);
																			ZB= A2+((k)*(B2-A2))/parseFloat(rows[i].TimeMoveComplete);
																			PositionLogout = XB+","+ZB;
																			timeGetDetail = k+createPositionTimelast;
																			arrayDistanceMove.push(XB+","+ZB+"=>"+timeConverter(timeGetDetail));																					
																		}else
																		{
																			XB= parseInt(A1+((k-1)*(B1-A1))/parseFloat(rows[i].TimeMoveComplete),10);
																			ZB= parseInt(A2+((k-1)*(B2-A2))/parseFloat(rows[i].TimeMoveComplete),10);
																			XL= parseInt(A1+((k)*(B1-A1))/parseFloat(rows[i].TimeMoveComplete),10);
																			ZL= parseInt(A2+((k)*(B2-A2))/parseFloat(rows[i].TimeMoveComplete),10);
																			if ((XB!==XL)||(ZB!==ZL)) 
																			{
																				timeGetDetail = k+createPositionTimelast;
																				//arrayDistanceMove.push(XB+","+ZB+"=>"+functions.timeConverter(timeGetDetail));
																				arrayDistanceMove.push(XL+","+ZL+"=>"+timeConverter(timeGetDetail));
																			}


																		}

																																																	
																	}										

																	//update vị trị sau cùng và time move
																	var query = pool.query('UPDATE unitinlocations SET DistanceMoveLogoff = ? WHERE idUnitInLocations = ?', [arrayDistanceMove.toString(),rows[i].idUnitInLocations],function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query11drtr');
																		}else
																		{
																			if (result.affectedRows> 0) {
																				console.log("666666666666666666666666");																								
																			}
																			else
																			{
																				console.log('khong co time remain duoc cap nhat 7');
																			}

																		}
																	})

														        }	


															}
														}
													});

												}else
												{
													console.log('cap nhat that bai');
												}
											}
										});
									}
									
								}else
								{
									console.log("Khong có dòng nào được chọn");
								}
							}
						});			    		

						//Thực hiện kiểm tra vị trí với farm hiện tại khi user oflline
						var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1  AND TimeMoveTotalComplete  >'"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
						{
							if (!!error){DetailError = ('disconected: Error in the query 5');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (rows.length>0) 
								{						
									arraySendFarmMoveConsumeOff =rows;	
									console.log("tong thoi gian vi tri di toi diem den: "+ rows[0].TimeMoveComplete);						
									for (var i = 0; i < arraySendFarmMoveConsumeOff.length; i++) 
									{	
										var index = i,PositionClickChange;
										if (arraySendFarmMoveConsumeOff[index].UserName === currentdisconect.UserName) 
										{
											//tính lượng farm và lấy vị trí hiện tại đi cho đoạn đường đi từ vị trí sau cùng							
											//thời gian mà user đã di chuyển được từ điểm cuối
											TimeMoveToOff = parseFloat(createPositionTimelast)-parseFloat(arraySendFarmMoveConsumeOff[index].timeClick);													
											APositionOff = rows[index].Position;
											AOff = APositionOff.split(",");
											A1Off = parseFloat(AOff[0]);
											A2Off = parseFloat(AOff[1]);
											BPositionOff = rows[index].PositionClick;
											BOff = BPositionOff.split(",");
											B1Off = parseFloat(BOff[0]);
											B2Off = parseFloat(BOff[1]);
											XOff= A1Off+((parseFloat(TimeMoveToOff))*(B1Off-A1Off))/parseFloat(rows[i].TimeMoveComplete);
											XOff=Number((parseFloat(XOff).toFixed(1)));
											ZOff= A2Off+((parseFloat(TimeMoveToOff))*(B2Off-A2Off))/parseFloat(rows[i].TimeMoveComplete);
											ZOff=Number((parseFloat(ZOff).toFixed(1)));							
											PositionChangeOff = XOff+","+ZOff;																													

											//kiểm tra lượng farm còn lại cho lần di chuyển kế tiếp																										
											FarmPortableMoveOff = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(arraySendFarmMoveConsumeOff[index].TimeMoveComplete)));														
											AverageFarmSecond =parseFloat(rows[index].Quality)/(1/parseFloat(rows[index].MoveSpeedEach));																

											//tính trung bình mổi giay di được bao nhiêu farm
											if (FarmPortableMoveOff > parseFloat(rows[index].FarmPortable)) 
											{
												//Thiếu farm																															
												NumberSecondMoveOff = parseFloat(rows[index].FarmPortable)/AverageFarmSecond;																														
												if ((parseInt(A1Off,10)===parseInt(B1Off,10))
													||(parseInt(A2Off,10)===parseInt(B2Off,10))) 
												{																	
													NumberSecondMoveOff = NumberSecondMoveOff -(NumberSecondMoveOff%(1/(parseFloat(rows[i].MoveSpeedEach))));																
													//tính lại vị trí đi được với số farm còn lại
													APositionOff = rows[index].Position;
													AOff = APositionOff.split(",");
													A1Off = parseFloat(AOff[0]);
													A2Off = parseFloat(AOff[1]);
													BPositionOff = rows[index].PositionClick;
													BOff = BPositionOff.split(",");
													B1Off = parseFloat(BOff[0]);
													B2Off = parseFloat(BOff[1]);
													XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
													XOff=Number((parseFloat(XOff).toFixed(1)));
													ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
													ZOff=Number((parseFloat(ZOff).toFixed(1)));							
													PositionChangeOffNotEnought = XOff+","+ZOff;																																													

												}else
												{
													//tính lại vị trí thiếu farm theo đơn vị thời gian
													//kiểm tra di chuyển là vị trí chéo
													if ((Math.abs(parseInt(B1Off,10) -parseInt(A1Off,10))===Math.abs(parseInt(B2Off,10) -parseInt(A2Off,10)))) 
													{
														if (NumberSecondMoveOff<(1.4/(parseFloat(rows[i].MoveSpeedEach)))) 
														{
															NumberSecondMoveOff = (1.4/(parseFloat(rows[i].MoveSpeedEach)));																		
														}else
														{
															NumberSecondMoveOff = NumberSecondMoveOff -(NumberSecondMoveOff%(1.4/(parseFloat(rows[i].MoveSpeedEach))));
														}																			
														//tính lại vị trí đi được với số farm còn lại
														APositionOff = rows[index].Position;
														AOff = APositionOff.split(",");
														A1Off = parseFloat(AOff[0]);
														A2Off = parseFloat(AOff[1]);
														BPositionOff = rows[index].PositionClick;
														BOff = BPositionOff.split(",");
														B1Off = parseFloat(BOff[0]);
														B2Off = parseFloat(BOff[1]);
														XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
														XOff=Number((parseFloat(XOff).toFixed(1)));
														ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
														ZOff=Number((parseFloat(ZOff).toFixed(1)));							
														PositionChangeOffNotEnought = XOff+","+ZOff;																	
													}else
													{																		
														//tính lại vị trí đi được với số farm còn lại
														APositionOff = rows[index].Position;
														AOff = APositionOff.split(",");
														A1Off = parseFloat(AOff[0]);
														A2Off = parseFloat(AOff[1]);
														BPositionOff = rows[index].PositionClick;
														BOff = BPositionOff.split(",");
														B1Off = parseFloat(BOff[0]);
														B2Off = parseFloat(BOff[1]);
														XOff= A1Off+((parseFloat(NumberSecondMoveOff))*(B1Off-A1Off))/(parseFloat(rows[i].TimeMoveComplete));
														XOff=Number((parseFloat(XOff).toFixed(1)));
														ZOff= A2Off+((parseFloat(NumberSecondMoveOff))*(B2Off-A2Off))/(parseFloat(rows[i].TimeMoveComplete));
														ZOff=Number((parseFloat(ZOff).toFixed(1)));							
														PositionChangeOffNotEnought = XOff+","+ZOff;																		
													}																
												}
												
												//set lại vị trí chẳn nếu vị trí hết farm là lẻ
												if (((parseFloat(XOff) % 1 ) < 0.099) && ((parseFloat(Math.abs(ZOff)) % 1 ) < 0.099))
												{																		
													TimeMoveCompletes = (parseFloat(createPositionTimelast)+parseFloat(NumberSecondMoveOff));
													PositionChangeOffNotEnought = Number((parseFloat(XOff).toFixed(0)))+","+Number((parseFloat(ZOff).toFixed(0)));																	
													//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
													var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+parseFloat(NumberSecondMoveOff)
							                			+"',TimeMoveTotalComplete = '"+parseFloat(TimeMoveCompletes)
							                			+"',Position = '"+ PositionChangeOff			                			
							                			+"',PositionClick = '"+ PositionChangeOffNotEnought
							                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
							                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
													{
														if(!!error){DetailError = ('disconected: Error in the query 6');
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}else
														{
															//Kiểm tra data sau khi update
															if (result.affectedRows>0)
															{																				
																//gửi vị trí lên cho các thành viên khác																			
											                	io.emit('R_POSITION_CLICK',
																{						
																	PositionClick:PositionChangeOffNotEnought,
																	Position: PositionChangeOff,
																	idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
												            	});														     
															}																								
														}
													});					  								                							                								  									  								                	
										  														
												}else
												{	
													//kiểm tra nếu đi trên đường thảng
													arrC =	PositionChangeOffNotEnought.split(",");
													arrB =	functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought).split(",");	
													var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																																	
													TimeMoveCompletes=(parseFloat(createPositionTimelast) + parseFloat(NumberSecondMoveOff) + Number((time).toFixed(0)));
													TimeMoveCompleteOffs = parseFloat(NumberSecondMoveOff) + parseFloat(Number((time).toFixed(0)));
													PositionClickChange = functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought)
													
								                	//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
													var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+TimeMoveCompleteOffs
							                			+"',TimeMoveTotalComplete = '"+ parseFloat(TimeMoveCompletes)
							                			+"',Position = '"+ PositionChangeOff			                			
							                			+"',PositionClick = '"+ PositionClickChange
							                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
							                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
													{
														if(!!error){DetailError = ('disconected: Error in the query 7');
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}else
														{
															//Kiểm tra data sau khi update
															if (result.affectedRows>0)
															{												
																//gửi vị trí lên cho các thành viên khác																			
											                	io.emit('R_POSITION_CLICK',
																{						
																	PositionClick:PositionClickChange,
																	Position: PositionChangeOff,
																	idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
												            	});															                	
															}																									
														}
													});	
												}									
											}else
											{
												//đủ farm																
												var query = pool.query("UPDATE unitinlocations SET CheckMoveOff = 1,TimeSendToClient = 0, CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
												{
													if(!!error){DetailError = ('disconected: Error in the query 8');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}
												});	
											}	
										}																																																																														
									}														
								}
							}
						});									
						
				    	//cập nhật trạng thái
						var query = pool.query('UPDATE unitinlocations SET CheckOnline = 0 WHERE UserName = ?', [currentdisconect.UserName],function(error, result, field)
						{
							if(!!error){DetailError = ('disconected: Error in the query 9');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (result.affectedRows> 0) 
								{												
									//cập nhật redis
									var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations`WHERE UserName = ?", [currentdisconect.UserName],function(error, rows,field)
									{
										if (!!error){DetailError = ('disconected: Error in the query 10');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											for (var i = 0; i < rows.length; i++)
											{																	        					
												client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));													
												if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
												{
												 	//cập nhật tình trạng ofllie cho unit location
													gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "0";														
												}								
									        }								        													        
										}
									})	
									//gửi tình trạng on/off cho tất cả các user												
									var query = pool.query("SELECT idUnitInLocations FROM `unitinlocations` WHERE `UserName` = '"+currentdisconect.UserName+"'",function(error, rows,field)
									{
										if (!!error){DetailError = ('disconected: Error in the query 11');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											arrayUnitLocationsComplete= rows;	
											var query = pool.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
											{
												if (!!error){DetailError = ('disconected: Error in the query 12');
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (rows.length>0) 
													{
														arrayOnlineStatus = rows;																																			
														for (var i = 0; i < arrayOnlineStatus.length; i++) 
												  		{
												  			if ((lodash.filter(gameServer.clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
												  			{	
											  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('R_STATUS_FOR_ALL',
																{
																	Status : 0,	
																	UserName : currentdisconect.UserName,	
																	idUnitInLocations: arrayUnitLocationsComplete,																																																					
											                	});
												  													  															  								                	
												  			}													  							  			
												  		}			 
													}
												}
											})																					        
									    }
									})
									
								}
							}
						});	

						//cap nhat thoi gian cho user trong guid
						var dt = datetime.create();												
						var query = pool.query("UPDATE guildlistmember SET Status = 0, TimeDetail = '"+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentdisconect.UserName+"'",function(error, result, field)
						{
							if(!!error){DetailError = ('disconected: Error in the query 13');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (result.affectedRows>0) 
								{
									var query = pool.query("SELECT B.MemberName FROM users AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE A.UserName ='"+currentdisconect.UserName+"'",function(error, rows,field)
									{
										if (!!error){DetailError = ('disconected: Error in the query 14');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arrayNotisyStatus = rows;																																			
												for (var i = 0; i < arrayNotisyStatus.length; i++) 
										  		{													  			
										  			if ((lodash.filter(gameServer.clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
										  			{													  			
									  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('R_STATUS',
														{
															Status : 0,
															TimeDetail : dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
															UserName : currentdisconect.UserName,																																							
									                	});														  													  															  								                	
										  			}													  							  			
										  		}			 
											}		
										}
									})
								}
							}
						});																							
						    
						console.log("User: "+currentdisconect.UserName+" && idSocket: "+currentdisconect.idSocket+" has disconnected: "+datetime.create().format('H:M:S d-m-Y'));
						gameServer.clients.splice(gameServer.clients.findIndex(item => item.idSocket === currentdisconect.idSocket),1);												
					}									
				}else if ((currentdisconect.UserName.length === 0)&&(currentdisconect.idSocket.length === 0))
				{
					//console.log("=================================Kết noi toi server mà chua login");
				}
			});						      	      
        });
    }
}
function getcurrentdisconect(data)
{
	return	currentdisconect =
	{
		UserName:data.UserName,						
		idSocket:data.idSocket,															
	}
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}