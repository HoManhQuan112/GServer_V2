'use strict';
var pool = require('./db');
const nodemailer 	= require('nodemailer');
var lodash		    = require('lodash');
var functions 		= require("./functions");
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var cron 			= require('node-cron');
var datetime 		= require('node-datetime');
var client 			= require('./redis');

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {   
        	var currentdisconect;  

        	socket.on('disconnected', function (data)
			{			
				currentdisconect =
				{
					UserName:data.UserName,						
					idSocket:data.idSocket,															
				}					
				
				var arrayDistanceMove = [],arrayOnlineStatus=[],arraySendFarmAfterMoveConsume = [],arraySendFarmMoveConsume = [],FarmPortableMove,FarmPortableMoveOffComplete,
		    	APosition,BPosition,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrB,arrC,TimeMoveToOff=0,arraySendFarmMoveConsumeOffComplete = [],arraySendFarmMoveConsumeOff=[],
		    	APositionOff,BPositionOff,AOff,A1Off,A2Off,BOff,B1Off,B2Off,XOff,ZOff,PositionChangeOff,FarmPortableMoveOnOff,FarmPortableMoveOff,arrayUnitLocationsComplete = [],
		    	FarmPortableMoveOffNotEnought,AverageFarmSecond,NumberSecondMoveOff,PositionChangeOffNotEnought,TimeMoveCompletes=0,TimeMoveCompleteOffs =0,d,createPositionTimelast;
				console.log(currentdisconect.UserName+"_"+currentdisconect.idSocket);	
				var GameServer = require("./login");
			    var gameServer = new GameServer();
			    exports.gameServer = gameServer;  			    
				if (gameServer.clients.length>0
					&&(typeof currentdisconect.UserName !== 'undefined')&&(typeof currentdisconect.idSocket !== 'undefined')) 
				{							
					for (var i = 0; i < gameServer.clients.length; i++)
					{	
						if (typeof gameServer.clients !== 'undefined')
						{										
							if ((gameServer.clients[i].name === currentdisconect.UserName) && (gameServer.clients[i].idSocket === currentdisconect.idSocket))
							{													
								pool.getConnection(function(err,connection)
								{
								    if (err)
								    {
								      	return;
								    }
								    else
								    {
								    	//cập nhật thời gian logout
								    	d = new Date();
							    		createPositionTimelast = Math.floor(d.getTime() / 1000);

										//check khong xem tn guild						    			
										connection.query("UPDATE users SET TimeCancelGuild = '"+parseFloat(createPositionTimelast)+"' where UserName = '"+currentdisconect.UserName+"' AND CheckCloseMessGuild = 0",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 298');
											}else
											{
												if (result.affectedRows>0) 
												{												
												}
											}
										});	

										//check khong xem tin nhan cua private
										connection.query("UPDATE users SET CheckCloseMessPrivateUser = 1 where UserName = '"+currentdisconect.UserName+"' AND CheckCloseMessPrivateUser = 0",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 299');
											}else
											{
												if (result.affectedRows>0) 
												{												
												}
											}
										});							    		

										//Thực hiện kiểm tra vị trí với farm hiện tại khi user oflline
										var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1  AND TimeMoveTotalComplete  >'"+parseFloat(createPositionTimelast)+"'",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query 392c');
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
															console.log("Vị trị hiện tại đã di chuyển được là: "+ PositionChangeOff);
															console.log("Thoi gian vị trị tính đến hiện tại đa di duoc: "+ TimeMoveToOff);

															//kiểm tra lượng farm còn lại cho lần di chuyển kế tiếp													
															//FarmPortableMoveOnOff = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(TimeMoveToOff));														
															//console.log("Farm tinh khi di chuyển con lai sau khi di chuyen: "+ FarmPortableMoveOnOff);
															//kiểm tra lượng farm cho di chuyển oflline
															FarmPortableMoveOff = (parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*(parseFloat(arraySendFarmMoveConsumeOff[index].TimeMoveComplete)));														
															//console.log("Farm cân cho di chuyển offline: "+ FarmPortableMoveOff);							
															//console.log("Thời gian cần cho di chuyển oflline: "+(parseFloat(arraySendFarmMoveConsumeOff[index].TimeMoveComplete)));
															AverageFarmSecond =parseFloat(rows[index].Quality)/(1/parseFloat(rows[index].MoveSpeedEach));	
															//console.log("Farm moi giay cần có:==================== "+ FarmPortableMoveOff);					

															//tính trung bình mổi giay di được bao nhiêu farm
															if (FarmPortableMoveOff > parseFloat(rows[index].FarmPortable)) 
															{
																//Thiếu farm
																//console.log("=================Thiếu farm");																
																NumberSecondMoveOff = parseFloat(rows[index].FarmPortable)/AverageFarmSecond;
																//console.log("số lượng giay sẽ di được với số farm còn lại là: "+NumberSecondMoveOff);															
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
																	// if ((Math.abs(parseInt(B1Off,10) -parseInt(A1Off,10))===Math.abs(parseInt(B2Off,10) -parseInt(A2Off,10)))
																	// 	&&(parseFloat(rows[index].FarmPortable) >= (parseFloat(rows[index].Quality)*(1.4/(parseFloat(rows[i].MoveSpeedEach)))))) 
																	if ((Math.abs(parseInt(B1Off,10) -parseInt(A1Off,10))===Math.abs(parseInt(B2Off,10) -parseInt(A2Off,10)))) 
																	{
																		console.log("1: "+parseFloat(rows[index].FarmPortable));
																		console.log("2: "+parseFloat(rows[index].Quality));
																		console.log("3: "+(1.4/(parseFloat(rows[i].MoveSpeedEach))));
																		console.log(parseFloat(rows[index].FarmPortable)+"_"+(parseFloat(rows[index].Quality)*(14*(parseFloat(rows[i].MoveSpeedEach)))));
																		if (NumberSecondMoveOff<(1.4/(parseFloat(rows[i].MoveSpeedEach)))) 
																		{
																			NumberSecondMoveOff = (1.4/(parseFloat(rows[i].MoveSpeedEach)));																		
																		}else
																		{
																			NumberSecondMoveOff = NumberSecondMoveOff -(NumberSecondMoveOff%(1.4/(parseFloat(rows[i].MoveSpeedEach))));
																		}	
																		console.log("================Cập nhật vị trí le trong truong hop di chuyen cheo: "+NumberSecondMoveOff);
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
																		//console.log("Vị trí sau khi tinh toán với số farm còn lại: "+ PositionChangeOffNotEnought);

																	}else
																	{
																		console.log("==================Cập nhật vị trí le trong truong hop di chuyen khong xac dinh");
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
																		//console.log("Vị trí sau khi tinh toán với số farm còn lại: "+ PositionChangeOffNotEnought);
																	}
																	

																}
																
																//set lại vị trí chẳn nếu vị trí hết farm là lẻ
																if (((parseFloat(XOff) % 1 ) < 0.099) && ((parseFloat(Math.abs(ZOff)) % 1 ) < 0.099))
																{	
																	//console.log("Cập nhật vị trí chan");
																	TimeMoveCompletes = (parseFloat(createPositionTimelast)+parseFloat(NumberSecondMoveOff));
																	PositionChangeOffNotEnought = Number((parseFloat(XOff).toFixed(0)))+","+Number((parseFloat(ZOff).toFixed(0)));
																	//console.log("Thời gian set lai cho vi tri chan la: "+TimeMoveCompletes);
																	//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
																	var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+parseFloat(NumberSecondMoveOff)
											                			+"',TimeMoveTotalComplete = '"+parseFloat(TimeMoveCompletes)
											                			+"',Position = '"+ PositionChangeOff			                			
											                			+"',PositionClick = '"+ PositionChangeOffNotEnought
											                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
											                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 393s');
																		}else
																		{
																			//Kiểm tra data sau khi update
																			if (result.affectedRows>0)
																			{
																				//console.log("Cập nhật thanh cong trong trường hợp chẳn không đủ farm");
																				//gửi vị trí lên cho các thành viên khác																			
															                	io.emit('RECEIVEPOSITIONCLICK',
																				{						
																					PositionClick:PositionChangeOffNotEnought,
																					Position: PositionChangeOff,
																					idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
																            	});														     
																			}else
																			{
																				console.log("khong Cập nhật thanh con gtrong trường hợp không đủ farm");												
																			}																								
																		}
																	});					  								                							                								  									  								                	
														  														
																}else
																{	
																	//kiểm tra nếu đi trên đường thảng
																	//console.log("Cập nhật vị trí le");	
																	//console.log("Vị trí hiện tại PositionClick: "+rows[index].PositionClick);															
													  				arrC =	PositionChangeOffNotEnought.split(",");
																	arrB =	functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought).split(",");	
																	var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																
																	//console.log("Thời gian set lai vi tri chẵn không cần farm: "+time);
																	TimeMoveCompletes=(parseFloat(createPositionTimelast) + parseFloat(NumberSecondMoveOff) + Number((time).toFixed(0)));
																	TimeMoveCompleteOffs = parseFloat(NumberSecondMoveOff) + parseFloat(Number((time).toFixed(0)));
																	PositionClickChange = functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought)
																	//console.log("Vi tri duoc set lai là: "+functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought));																						                																			
												                	//cập nhật vị trí không đủ farm và dừng ở vị trí chẵn
																	var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+TimeMoveCompleteOffs
											                			+"',TimeMoveTotalComplete = '"+ parseFloat(TimeMoveCompletes)
											                			+"',Position = '"+ PositionChangeOff			                			
											                			+"',PositionClick = '"+ PositionClickChange
											                			+"',CheckMoveOff = 1, TimeSendToClient = 0, timeClick = '"+ parseFloat(createPositionTimelast)                			
											                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
																	{
																		if(!!error)
																		{
																			console.log('Error in the query 393s');
																		}else
																		{
																			//Kiểm tra data sau khi update
																			if (result.affectedRows>0)
																			{												
																				//console.log("Cập nhật thanh cong trong trường hợp lẻ không đủ farm: "+functions.getNewLocationClickWithFarm(PositionChangeOffNotEnought,rows[index].PositionClick,PositionChangeOffNotEnought));
																				//gửi vị trí lên cho các thành viên khác																			
															                	io.emit('RECEIVEPOSITIONCLICK',
																				{						
																					PositionClick:PositionClickChange,
																					Position: PositionChangeOff,
																					idUnitInLocations:parseFloat(rows[index].idUnitInLocations),
																            	});
															                	
																			}else
																			{
																				console.log("khong Cập nhật thanh con gtrong trường hợp không đủ farm");												
																			}																									
																		}
																	});	
																}									
															}else
															{
																//đủ farm
																//console.log("=======================Đủ farm");
																var query = pool.query("UPDATE unitinlocations SET CheckMoveOff = 1,TimeSendToClient = 0, CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the query 393a');
																	}else
																	{
																		//Kiểm tra data sau khi update
																		if (result.affectedRows>0)
																		{
																			//console.log("Cập nhật thanh cong trong trường hợp đủ farm");
																		}else
																		{
																			console.log(" khong Cập nhật thanh cong trong trường hợp đủ farm");
																		}														
																	}
																});	
															}	
														}																																																																														
													}														
												}
											}
										});

								    	connection.query('UPDATE users SET timeLogin = ?,idSocket=?,timeLogout = ?,timeResetMine = ? WHERE UserName = ?', ["","",createPositionTimelast,"", currentdisconect.UserName],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 306');
											}else
											{
												if(result)
												{

												}else
												{
													console.log('cap nhat that bai 307');
												}
											}
										});

										connection.query('UPDATE unitinlocations SET CheckOnline = 0 WHERE UserName = ?', [currentdisconect.UserName],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 308');
											}else
											{
												if (result.affectedRows> 0) 
												{												
													//cập nhật redis
													connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations`WHERE UserName = ?", [currentdisconect.UserName],function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 309');
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
													connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentdisconect.UserName+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 310');
														}else
														{
															arrayUnitLocationsComplete= rows;	
															connection.query("SELECT UserName FROM users WHERE 1",function(error, rows,field)
															{
																if (!!error)
																{
																	console.log('Error in the query 311');
																}else
																{
																	if (rows.length>0) 
																	{
																		arrayOnlineStatus = rows;																																			
																		for (var i = 0; i < arrayOnlineStatus.length; i++) 
																  		{
																  			if ((lodash.filter(gameServer.clients, x => x.name === arrayOnlineStatus[i].UserName)).length >0) 
																  			{	
															  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayOnlineStatus[i].UserName)].idSocket).emit('RECEIVESTATUSFORALL',
																				{
																					Status : 0,	
																					UserName : currentdisconect.UserName,	
																					idUnitInLocations: arrayUnitLocationsComplete,																																																					
															                	});
																  													  															  								                	
																  			}													  							  			
																  		}			 
																	}else
																	{

																	}			

																}
															})									
													        
													    }
													})
													
												}
												else
												{
													console.log('Hiện tại user chưa có unit in location 312');
												}
											}
										});	

										//cap nhat thoi gian cho user trong guid
										var dt = datetime.create();		
										//console.log(dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	
										connection.query("UPDATE guildlistmember SET Status = 0, TimeDetail = '"+dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33)+"' where MemberName = '"+currentdisconect.UserName+"'",function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query 313');
											}else
											{
												if (result.affectedRows>0) 
												{
													connection.query("SELECT B.MemberName FROM users AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE A.UserName ='"+currentdisconect.UserName+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 314');
														}else
														{
															if (rows.length>0) 
															{
																arrayNotisyStatus = rows;																																			
																for (var i = 0; i < arrayNotisyStatus.length; i++) 
														  		{													  			
														  			if ((lodash.filter(gameServer.clients, x => x.name === arrayNotisyStatus[i].MemberName)).length >0) 
														  			{													  			
													  					io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name === arrayNotisyStatus[i].MemberName)].idSocket).emit('RECEIVESTATUS',
																		{
																			Status : 0,
																			TimeDetail : dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
																			UserName : currentdisconect.UserName,																																							
													                	});
														  													  															  								                	
														  			}													  							  			
														  		}			 
															}else
															{
															}		
														}
													})

												}
											}
										});						
																		
								    }
								 });
								console.log("User: "+gameServer.clients[i].name+" && idSocket: "+gameServer.clients[i].idSocket+" has disconnected at: "+datetime.create().format('H:M:S d-m-Y'));
								gameServer.clients.splice(i,1);												

							}
						}else
						{
							console.log('=================================socket bi loi khi dang nhap 316');						
						}
					};				
				}else if ((typeof currentdisconect.UserName === 'undefined')||(typeof currentdisconect.idSocket === 'undefined'))
				{
					console.log("=================================Kết noi toi server mà chua login 317");
				}
			});	
			
			      	      	
        });
    }
}