'use strict';
var pool = require('./db');
const nodemailer 	= require('nodemailer');
var functions 		= require("./functions");
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var lodash		    = require('lodash');
var client 			= require('./redis');
var cron 			= require('node-cron');
var datetime 		= require('node-datetime');
var currentSENDFARMCONSUME,d,createPositionTimelast,arrayDetailBase =[],currentSENDPOSITIONCLICK, APosition, A, A1, A2, BPosition, B, B1, B2, 
CPosition, C, C1, C2, TimeCheckMove, X, Z, timeMoves, newLocation, s, arrayAllCheckTime = [], arrA = [], arrB = [], arrayAllSelect = [], 
arraycheckUser = [], arrayExpireTimeMove = [], arrC=[], XB, ZB, MoveSpeedEach, j, idUnitInLocations, 
arrayAllPositionchange = [];
module.exports = 
{
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('SENDFARMCONSUME', function (data)
			{
				currentSENDFARMCONSUME =
				{
					idUnitInLocations:data.idUnitInLocations,								
					PositionFrom:data.PositionFrom,
					PositionTo:data.PositionTo,																
				}
				console.log('data receive SENDFARMCONSUME: '+currentSENDFARMCONSUME.idUnitInLocations+"_"+currentSENDFARMCONSUME.PositionFrom+"_"+currentSENDFARMCONSUME.PositionTo);				
				var arrC=[],arrA=[],FarmPortableMove=0,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrC,arrB;		    		
				d = new Date(); createPositionTimelast = Math.floor(d.getTime() / 1000);																							
				
				pool.getConnection(function(err,connection)
				{						
					connection.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations = '"+currentSENDFARMCONSUME.idUnitInLocations
						+"'",function(error, rows,field)
					{
						if (!!error){console.log('Error in the query 1hfghf');
						}else
						{
							if(rows.length>0)
							{
								if ((parseFloat(rows[0].TimeSendToClient)>0)
									&&(parseFloat(rows[0].FarmPortable)>=parseFloat(rows[0].Quality))) 
								{
									///cập nhật tính thời gian đơn vị lẻ đã đi											
									FarmPortableMove = parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*((1/parseFloat(rows[0].MoveSpeedEach))-(parseFloat(rows[0].TimeSendToClient)-parseFloat(createPositionTimelast))));								
									var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
										+"',CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
			                			+"',TimeSendToClient = 0,TimeCheck='"+parseFloat(createPositionTimelast)
			                			+"',timeClick='"+parseFloat(createPositionTimelast)
			                			+"',CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
									{
										if(!!error){console.log('Error in the query11343SF4gfafd');
										}else
										{
											console.log("ipdate position 1");
											if ((parseFloat(FarmPortableMove)>=parseFloat(rows[0].Quality))) 
											{													
												//gửi farm di chuyển lên cho client cập nhật UI
												io.emit('RECEIVEFARMCONSUMEMOVE',
												{	
													message: 1,
													idUnitInLocations:rows[0].idUnitInLocations,																				
													FarmPortableMove: FarmPortableMove,
													Position: currentSENDFARMCONSUME.PositionTo,
							                	});	
							                	//cập nhật lại vị trí và thời gian di chuyển vào mysql
							                	arrA =	currentSENDFARMCONSUME.PositionFrom.split(",");
												arrC =	currentSENDFARMCONSUME.PositionTo.split(",");									
												var time=sqrt(math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(rows[0].MoveSpeedEach);												
												connection.query("UPDATE unitinlocations SET PositionClick = '"+ currentSENDFARMCONSUME.PositionTo 						                			
						                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
						                			+"',TimeMoveComplete = '"+ parseFloat(time)						                								                			
						                			+"',TimeMoveTotalComplete = '"+ (parseFloat(time)+parseFloat(createPositionTimelast))
						                			+"',TimeCheck = '"+ (parseFloat(createPositionTimelast))
						                			+"',TimeSendToClient = '"+ ((1/parseFloat(rows[0].MoveSpeedEach))+parseFloat(createPositionTimelast))
						                			+"',CheckMove = 1 where idUnitInLocations = '"+currentSENDFARMCONSUME.idUnitInLocations+"'",function(error, result, field)
												{
													if(!!error){console.log('Error in the query113434gfTYafd');
													}else
													{
														console.log("ipdate position 2");																														
														connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+currentSENDFARMCONSUME.idUnitInLocations+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query4');
															}else
															{																																															        				
																//Cập nhật lại farm và vị trí lại trong redis															        					
																client.set(currentSENDFARMCONSUME.idUnitInLocations,JSON.stringify(rows[0]));																															         
														        connection.release();																          
															}
														})							
														
													}
												});	
											}else
											{
												A = currentSENDFARMCONSUME.PositionFrom.split(",");
												A1 = Number((parseFloat(parseFloat(A[0])).toFixed(1)));
												A2 = Number((parseFloat(parseFloat(A[1])).toFixed(1)));
												PositionChange=A1+","+A2;
												if  (((parseFloat(A1) % 1) < 0.099) && ((parseFloat(Math.abs(A2))  % 1) < 0.099))
												{													
													//Gừi lên farm và vị trí user đẩ cập nhật UI trong trường hợp thiếu farm và set lại vị trí chẵn
													io.emit('RECEIVEFARMCONSUMEMOVE',
													{	
														message: 0,
														idUnitInLocations:rows[0].idUnitInLocations,																				
														FarmPortableMove: FarmPortableMove,
														Position:PositionChange,
								                	});								                	
								                	//cập nhật lại farm và vị trí vào my sql									
													var query = pool.query("UPDATE unitinlocations SET timeClick = '"+parseFloat(createPositionTimelast)														
														+"',PositionClick ='"+PositionChange														
														+"',TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
														+"',TimeCheck='"+parseFloat(createPositionTimelast)
														+"',TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query11343TY4gfafd');
														}else
														{
															console.log("ipdate position 3");
															connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
															{
																if (!!error){console.log('Error in the query4');
																}else
																{																																	
															        //cập nhật farm và vị trí vào redis														        					
																	client.set(currentSENDFARMCONSUME.idUnitInLocations,JSON.stringify(rows[0]));																																			         
															        connection.release();																          
																}
															})	
															
														}
													});														
												}else
												{																																	  				
									  				arrC = PositionChange.split(",");
													arrB = functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange).split(",");	
													var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																										
													//Gửi lên client vị trí lẻ và farm thay đổi để cập nhật UI													
													io.emit('RECEIVEFARMCONSUMEMOVE',
													{	
														message: 0,
														idUnitInLocations:rows[0].idUnitInLocations,																				
														FarmPortableMove: 0,
														Position: functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange),
								                	});	
								                	console.log("Cập nhật postion click===============2");	
								                	//cập nhật lại dũ liệu thay đổi vào mysql							
													var query = pool.query("UPDATE unitinlocations SET Position = '"+functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange)
														+"',timeClick = '"+parseFloat(createPositionTimelast)																											
														+"',TimeMoveTotalComplete  = '"+(parseFloat(time)+parseFloat(createPositionTimelast))
														+"',TimeCheck  = '"+(parseFloat(time)+parseFloat(createPositionTimelast))
														+"',PositionClick='"+functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange)
														+"',FarmPortable = 0,TimeMoveComplete = 0,TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
													{
														if(!!error){console.log('Error in the query113434STgfafd');
														}else
														{
															console.log("ipdate position 4");
															connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
															{
																if (!!error){console.log('Error in the query4');
																}else
																{																																			
															        //update resid		
															        //cập nhật lại farm và vị trí lẻ thay đổi vào redis													        					
																	client.set(currentSENDFARMCONSUME.idUnitInLocations,JSON.stringify(rows[0]));																																	         
															        connection.release();																	          
																}
															})																												                	
															
														}
													});																											
												}											
											}											
										}
									});		

								}else if((parseFloat(rows[0].TimeSendToClient)===0) 
									&&parseFloat(rows[0].FarmPortable)>=parseFloat(rows[0].Quality))
								{									
									//cập nhật lại vi trí, farm và thời gian di chuyển khi lần đâu click 
				                	arrA =	currentSENDFARMCONSUME.PositionFrom.split(",");
									arrC =	currentSENDFARMCONSUME.PositionTo.split(",");															
									var time=sqrt(math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(rows[0].MoveSpeedEach);																		
									connection.query("UPDATE unitinlocations SET PositionClick = '"+ currentSENDFARMCONSUME.PositionTo 			                			
			                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
			                			+"',TimeMoveComplete = '"+ parseFloat(time)			                			
			                			+"',TimeMoveTotalComplete = '"+ (parseFloat(time)+parseFloat(createPositionTimelast))
			                			+"',TimeCheck = '"+ (parseFloat(time)+parseFloat(createPositionTimelast))
			                			+"',TimeSendToClient = '"+ ((1/parseFloat(rows[0].MoveSpeedEach))+parseFloat(createPositionTimelast))
			                			+"',CheckMove = 1 where idUnitInLocations = '"+currentSENDFARMCONSUME.idUnitInLocations+"'",function(error, result, field)
									{
										if(!!error){console.log('Error in the query113434gSfafd');
										}else
										{
											console.log("ipdate position 5");
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDFARMCONSUME.idUnitInLocations)+"'",function(error, rows,field)
											{
												if (!!error){console.log('Error in the query4');
												}else
												{																																
											        //Cập nhật farm và vị trị lại trong redis														        					
													client.set(currentSENDFARMCONSUME.idUnitInLocations,JSON.stringify(rows[0]));																															         
											        connection.release();														          
												}
											})																				
											
										}
									});				
								}else
								{	
									console.log("RECEIVEFARMCONSUMEMOVE 4: "+rows[0].idUnitInLocations);																
									io.emit('RECEIVEFARMCONSUMEMOVE',
									{	
										message: 0,
										idUnitInLocations:rows[0].idUnitInLocations,																				
										FarmPortableMove: FarmPortableMove,
										Position: currentSENDFARMCONSUME.PositionTo,
				                	});	
								}														
							}
						}
					})						
		   		});		
			});

			socket.on('SENDPOSITIONCLICK', function (data)
			{
				currentSENDPOSITIONCLICK =
				{
					idUnitInLocations:data.idUnitInLocations,
					Position:data.Position,
					PositionClick:data.PositionClick,
					timeMove:data.timeMove,	
					idUnitInLocationsB:data.idUnitInLocationsB,
					PositionB:data.PositionB,	
				}	
				console.log("data receive SENDPOSITIONCLICK: "+currentSENDPOSITIONCLICK.idUnitInLocations+"_"+currentSENDPOSITIONCLICK.Position
					+"_"+currentSENDPOSITIONCLICK.PositionClick+"_"+currentSENDPOSITIONCLICK.timeMove
					+"_"+currentSENDPOSITIONCLICK.idUnitInLocationsB+"_"+currentSENDPOSITIONCLICK.PositionB);	

				if (currentSENDPOSITIONCLICK.idUnitInLocationsB.length===0||currentSENDPOSITIONCLICK.PositionB.length===0) {	
					console.log("Cập nhật postion click===============3");			
					pool.getConnection(function(err,connection)
					{						
		            	
						d = new Date();
		    			createPositionTimelast = Math.floor(d.getTime() / 1000);
		    			//kiểm tra position move có chính xác không	    			
		    			connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`='"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
						{
							if (!!error) {console.log('Error in the query 318');
							}else
							{
								if (rows.length > 0) 
								{										
		    						APosition = rows[0].Position;	    					
		    						A = APosition.split(",");
									A1 = parseFloat(A[0]);
									A2 = parseFloat(A[1]);
									BPosition = rows[0].PositionClick;								
									B = BPosition.split(",");
									B1 = parseFloat(B[0]);
									B2 = parseFloat(B[1]);
									CPosition = currentSENDPOSITIONCLICK.Position;								
									C = CPosition.split(",");
									C1 = parseFloat(C[0]);
									C2 = parseFloat(C[1]);
									
									if (parseFloat(createPositionTimelast -rows[0].timeClick) > parseFloat(rows[0].TimeMoveComplete)) 
									{
										TimeCheckMove = parseFloat(rows[0].TimeMoveComplete);
									}else
									{
										TimeCheckMove = createPositionTimelast -rows[0].timeClick;								
									}
									//kiểm tra position client với position trên server nếu trùng	
									console.log("Cập nhật postion click=============== 4");							
									if (parseFloat(Math.round(C2 * 100))===parseFloat(Math.round(A2 * 100)))
									{								
										connection.query("UPDATE unitinlocations SET  PositionClick = ?  , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
											[currentSENDPOSITIONCLICK.PositionClick,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
													currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
										{
											if(!!error){console.log('Error in the query 319');
											}else
											{
												console.log("ipdate position 6");
												if(result.affectedRows > 0)
												{	
													console.log("RECEIVEPOSITIONCLICK 6: "+currentSENDPOSITIONCLICK.idUnitInLocations);
													io.emit('RECEIVEPOSITIONCLICK',
													{														
														PositionClick:currentSENDPOSITIONCLICK.PositionClick,
														Position: currentSENDPOSITIONCLICK.Position,													
														idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
								                	});	
													connection.release();																									        					
								                }
											}
										})	
									}else
									{
										X= A1+((TimeCheckMove)*(B1-A1))/parseFloat(rows[0].TimeMoveComplete);
										Z= A2+((TimeCheckMove)*(B2-A2))/parseFloat(rows[0].TimeMoveComplete);
										if (getNumberDifferent(rows[0].UnitType,X,Z,C1,C2) === true) 
		    							{
		    								connection.query("UPDATE unitinlocations SET  PositionClick = ?   , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
												[currentSENDPOSITIONCLICK.PositionClick, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
														currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
											{
												if(!!error){console.log('Error in the query 360');
												}else
												{
													console.log("ipdate position 7");
													if(result.affectedRows > 0)
													{
														console.log("RECEIVEPOSITIONCLICK 2: "+currentSENDPOSITIONCLICK.idUnitInLocations);
														io.emit('RECEIVEPOSITIONCLICK',
														{														
															PositionClick:currentSENDPOSITIONCLICK.PositionClick,
															Position: currentSENDPOSITIONCLICK.Position,													
															idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
									                	});		
									                	connection.release();						                	
									                }
												}
											})	
		    							}else
		    							{	    				 			
											connection.query("UPDATE unitinlocations SET PositionClick = ?   , TimeMoveComplete = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ",
												[currentSENDPOSITIONCLICK.PositionClick, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
														currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
											{
												if(!!error){console.log('Error in the query 361');
												}else
												{
													if(result.affectedRows > 0)
													{
														console.log("ipdate position 8");
														console.log("RECEIVEPOSITIONCLICK 3: "+currentSENDPOSITIONCLICK.idUnitInLocations);
														io.emit('RECEIVEPOSITIONCLICK',
														{
															PositionClick:currentSENDPOSITIONCLICK.PositionClick,
															Position:currentSENDPOSITIONCLICK.Position,
															idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
									                	});	
									                	connection.release();							                	
									                }
												}
											})	
		    							}							  								    						 
									}						
								}
							}
						});				
					});

				}else
				{
					console.log("==============================RECEIVEPOSITIONCLICK 222222222222222222");	
					//cập nhật lại vị trí đánh nhau (1=)
					//kiểm tra vị trí position click đã có người đứng chưa
					

					d = new Date(), createPositionTimelast = Math.floor(d.getTime() / 1000), arraycheckUser = [];
					//kiểm tra thời gian về 0 của unit location
					//kiểm tra khi bắng thời gian của server
					//thực hiện random tìm vị trí mới
					//cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)	

					var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE 1",function(error, rows,field)
					{
						if (!!error){console.log('Error in the query 363');
						}else
						{
							arraycheckUser = rows;
						}
					})								
														
					//update vị trị sau cùng và time move
					var query = pool.query("UPDATE unitinlocations SET timeClick='"+createPositionTimelast+"', PositionClick = ? , TimeMoveComplete = ?, TimeCheck = ? WHERE idUnitInLocations = ? AND CheckCreate !=1",[currentSENDPOSITIONCLICK.PositionClick,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),parseFloat(createPositionTimelast),currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
					{
						if(!!error){console.log('Error in the query 365');
						}else
						{
							if (result.affectedRows> 0) 
							{	
								console.log("ipdate position 9");																
								var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
								{
									if (!!error){console.log('Error in the query 366');
									}else
									{
										arrayAllCheckTime = rows;													        											
										if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === currentSENDPOSITIONCLICK.PositionClick)).length)
											+parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === currentSENDPOSITIONCLICK.PositionClick).length)>=1)
										{	
											const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = currentSENDPOSITIONCLICK.PositionB.split(",");									
											var X = parseFloat(arrs[0]), 
											Y =parseFloat(arrs[1]), N=1;
											X = X - N;
											Y = Y + N;
											var TopLeft= X+","+Y;									
											arrayS.push(TopLeft);									
											for (var i = 0; i < (N*2); i++)
											{
												X +=1;										
												arrayS.push(X+","+Y);										
											}
											for (var k = 0; k < (N*2+1); k++)
											{
												var arr = arrayS[k].split(",");
												for (var i = 1; i < (N*2+1); i++)
												{
													var v =parseFloat(arr[1])-i;											
													arrayS.push(arr[0]+","+v);																						
												}						
											}

											for (var i = 0; i < arrayS.length; i++) 
											{
												if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
												{
													arrayRandom.push(arrayS[i]);
												}
											}	
											if (arrayRandom.length>0) 
											{														
												newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
												arrA =	newLocation.split(",");
												arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
												var time=0;													
												console.log("Position Check: "+ currentSENDPOSITIONCLICK.PositionClick);
												console.log("chieu dai mang arraycheckUser: "+ parseFloat((lodash.filter(arraycheckUser, x => x.Position === currentSENDPOSITIONCLICK.PositionClick)).length));
												console.log("chieu dai mang arrayAllCheckTime: "+ parseFloat(lodash.filter(arrayAllCheckTime, x => x.Position === currentSENDPOSITIONCLICK.PositionClick).length));
												if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === currentSENDPOSITIONCLICK.PositionClick)).length)
													+parseFloat(lodash.filter(arrayAllCheckTime, x => x.Position === currentSENDPOSITIONCLICK.PositionClick).length)>=1)
												{
													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
													{
														if(!!error){console.log('Error in the query 367');
														}else
														{
															console.log("ipdate position 10");
															if (result.affectedRows> 0) 
															{															
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 368');
																	}else
																	{
																		if (rows.length >0)
																		{
																			console.log(rows[0].idUnitInLocations+" vị trí set lại: "+newLocation);
																			console.log(rows[0].idUnitInLocations+" vị trí gửi: "+rows[0].PositionClick);
																			console.log("=======================================================Thuc hien thay doi vi tri danh cron 6");																																			
																			 //gửi vị trí cập nhật																			
																	      	io.emit('RECEIVEPOSITIONCHANGE',
																			{															            		
															            		idUnitInLocations: parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations),
															            		UserName: rows[0].UserName, 
															            		PositionClick: newLocation,
															            		UnitOrder: rows[0].UnitOrder,

															        		});	 														        																			       
																	    }
																	}
																})
															}
														}
													})

												}else
												{
													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [currentSENDPOSITIONCLICK.PositionClick,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
													{
														if(!!error){console.log('Error in the query 367');
														}else
														{
															console.log("ipdate position 11");
															if (result.affectedRows> 0) 
															{															
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 368');
																	}else
																	{
																		if (rows.length >0)
																		{
																			console.log(rows[0].idUnitInLocations+" vị trí set lại: "+rows[0].PositionClick);
																			console.log("=============Thuc hien thay doi vi tri danh cron 68");																																			
																			 //gửi vị trí cập nhật trùng vòng 1		
															        		io.emit('RECEIVEPOSITIONCHANGE',
																			{															            		
															            		idUnitInLocations: parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations),
															            		UserName: rows[0].UserName, 
															            		PositionClick: currentSENDPOSITIONCLICK.PositionClick,
															            		UnitOrder: rows[0].UnitOrder,
															        		});	    													        																			       
																	    }
																	}
																})
															}
														}
													})
												}								
												
											}else
											{																	  		
											  	var X = parseFloat(arrs[0]), 
												Y =parseFloat(arrs[1]), N=2;
												X = X - N;
												Y = Y + N;
												var TopLeft= X+","+Y;
												arrayS1.push(TopLeft);
												for (var i = 0; i < (N*2); i++)
												{
													X +=1;
													arrayS1.push(X+","+Y);
												}
												for (var k = 0; k < (N*2+1); k++)
												{
													var arr = arrayS1[k].split(",");
													for (var i = 1; i < (N*2+1); i++)
													{
														var v =parseFloat(arr[1])-i;
														if(arrayS.indexOf(arr[0]+","+v) > -1) {								
														}else
														{								
															arrayS1.push(arr[0]+","+v);			
														}							
													}						
												}

												for (var i = 0; i < arrayS1.length; i++) 
												{
													if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
													{
														arrayRandom.push(arrayS1[i]);
													}
												}
												if (arrayRandom.length >0 ) 
												{														
													newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
													arrA =	newLocation.split(",");
													arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");					
													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
													{
														if(!!error){console.log('Error in the query 370s');
														}else
														{
															console.log("ipdate position 12");
															if (result.affectedRows> 0) {
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error){console.log('Error in the query 371');
																	}else
																	{
																		if (rows.length >0)
																		{
																			console.log("=============Thuc hien thay doi vi tri danh cron 5");																																																									
																			 //gửi vị trí cập nhật trùng vòng 2																	  
															        		io.emit('RECEIVEPOSITIONCHANGE',
																			{
															            		
															            		idUnitInLocations: parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations),
															            		UserName: rows[0].UserName, 
															            		PositionClick: newLocation,
															            		UnitOrder: rows[0].UnitOrder,

															        		});													        		       																	       
																	    }
																	}
																})
															}
														}
													})		
												}else
												{											  		
											  		var X = parseFloat(arrs[0]), 
													Y =parseFloat(arrs[1]), N=3;
													X = X - N;
													Y = Y + N;
													var TopLeft= X+","+Y;
													arrayS2.push(TopLeft);
													for (var i = 0; i < (N*2); i++)
													{
														X +=1;
														arrayS2.push(X+","+Y);
													}
													for (var k = 0; k < (N*2+1); k++)
													{
														var arr = arrayS2[k].split(",");
														for (var i = 1; i < (N*2+1); i++)
														{
															var v =parseFloat(arr[1])-i;
															if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
															{								
															}else
															{								
																arrayS2.push(arr[0]+","+v);			
															}	
														}						
													}


													for (var i = 0; i < arrayS2.length; i++) 
													{
														if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
														{
															arrayRandom.push(arrayS2[i]);
														}
													}																					
													if (arrayRandom.length>0) {														
														newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
														arrA =	newLocation.split(",");
														arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
														var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
														time=0;														
														var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
														{
															if(!!error){console.log('Error in the query 373');
															}else
															{
																console.log("ipdate position 13");
																if (result.affectedRows> 0) {
																	var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																	{
																		if (!!error){console.log('Error in the query 374');
																		}else
																		{
																			if (rows.length >0)
																			{
																				console.log("=============Thuc hien thay doi vi tri danh cron 4");																																																											
																				 //gửi vị trí cập nhật trùng vòng 3																		   
																        		io.emit('RECEIVEPOSITIONCHANGE',
																				{
																            		
																            		idUnitInLocations: parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations),
																            		UserName: rows[0].UserName, 
																            		PositionClick: newLocation,
																            		UnitOrder: rows[0].UnitOrder,

																        		}); 
																        		connection.release();   																	        
																		    }
																		}
																	})
																}
															}
														})	
													}
												}
											}							
										}else
										{	
											console.log("RECEIVEPOSITIONCLICK 4: "+ currentSENDPOSITIONCLICK.idUnitInLocations);									
											io.emit('RECEIVEPOSITIONCLICK',
											{
												PositionClick:currentSENDPOSITIONCLICK.PositionClick,	
												Position: currentSENDPOSITIONCLICK.Position,												
												idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
						                	});					                	
										}
								        
								    }
								});

							}						
						}
					});
				}
				socket.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);			
				socket.broadcast.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);
			});					    	
        })
		cron.schedule('*/1 * * * * *',function()
		{
			//console.log("check time");
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);

	    	//thực hiện chức năng trừ farm khi unit di chuyển
	    	var arraySendFarmAfterMoveConsume = [],arraySendFarmMoveConsume = [],FarmPortableMove,FarmPortableMoveOffComplete,
	    	APosition,BPosition,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrB,arrC,TimeMoveToOff=0,arraySendFarmMoveConsumeOffComplete = [],
	    	APositionOff,BPositionOff,AOff,A1Off,A2Off,BOff,B1Off,B2Off,XOff,ZOff,PositionChangeOff,FarmPortableMoveOnOff,FarmPortableMoveOff,
	    	FarmPortableMoveOffNotEnought,AverageFarmSecond,NumberSecondMoveOff,PositionChangeOffNotEnought,TimeMoveCompletes=0;

	    	//thực hiện cập nhật farm khi di chuyển
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE  TimeMoveComplete >10 AND CheckMove = 1 AND CheckOnline = 1 AND TimeSendToClient='"+createPositionTimelast+"'",function(error, rows,field)
			{
				if (!!error){ole.log('Error in the query 392a');
				}else
				{
					if (rows.length>0) 
					{						
						arraySendFarmMoveConsume =rows;												
						for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
						{							
							var index = i;		
							//kiểm tra lượng farm cho lần di chuyển kế tiếp							
							FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality));	

							//	tính vị trí di chuyển sau 10s
							APosition = rows[index].Position;
							A = APosition.split(",");
							A1 = parseFloat(A[0]);
							A2 = parseFloat(A[1]);
							BPosition = rows[index].PositionClick;
							B = BPosition.split(",");
							B1 = parseFloat(B[0]);
							B2 = parseFloat(B[1]);
							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B1-A1))/parseFloat(rows[i].TimeMoveComplete);
							X=Number((parseFloat(X).toFixed(1)));
							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B2-A2))/parseFloat(rows[i].TimeMoveComplete);
							Z=Number((parseFloat(Z).toFixed(1)));							
							PositionChange = X+","+Z;
							var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast))
								+"',TimeMoveComplete = '"+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast))
	                			+"',TimeMoveTotalComplete = '"+ (parseFloat(createPositionTimelast)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast)))
	                			+"',TimeCheck = '"+ (parseFloat(createPositionTimelast)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(createPositionTimelast)))
	                			+"',FarmPortable = '"+ parseFloat(FarmPortableMove)		                			
	                			+"',Position = '"+ PositionChange	                			
	                			+"',TimeSendToClient = '"+ (10+parseFloat(createPositionTimelast))	
	                			+"',timeClick = '"+ parseFloat(createPositionTimelast)                			
	                			+"',CheckMove = 1 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error){console.log('Error in the query 393');
								}else
								{
									console.log("ipdate position 1");
									//Kiểm tra data sau khi update
									if (result.affectedRows>0)
									{
										var query = pool.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations='"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 392b');
											}else
											{
												if (rows.length>0) 
												{	
													
													if (parseFloat(FarmPortableMove)>=parseFloat(rows[0].Quality))
													{		
														console.log("RECEIVEFARMCONSUMEMOVE 1: "+rows[0].idUnitInLocations);																		
									                	//gửi lên cho từng user									      	
									    				io.emit('RECEIVEFARMCONSUMEMOVE',
														{
															message: 1,
															idUnitInLocations:rows[0].idUnitInLocations,																				
															FarmPortableMove: parseInt(FarmPortableMove,10),
															Position:rows[0].PositionClick,
									                	});	

									                	//Cập nhật redis
									                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations='"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
														{
															if (!!error){console.log('Error in the query 394');
															}else
															{
																console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm dang còn============================= ");
																//update resid															        					
																client.set(parseFloat(rows[0].idUnitInLocations),JSON.stringify(rows[0]));	
															}	
														})				                							                								  									  								                	
											  			
													}else if (parseFloat(FarmPortableMove)<parseFloat(rows[0].Quality))
													{
														if (((parseFloat(X) % 1 ) < 0.099) && ((parseFloat(Math.abs(Z)) % 1 ) < 0.099))
														{		
															
											  				//io.in(clients[clients.findIndex(item => item.name === arraySendFarmMoveConsume[index].UserName)].idSocket).emit('RECEIVEFARMCONSUMEMOVE',
											  				PositionChange = Number((parseFloat(X).toFixed(0)))+","+Number((parseFloat(Z).toFixed(1)));	
											  				console.log("RECEIVEFARMCONSUMEMOVE 7: "+rows[0].idUnitInLocations);										  				
											  				io.emit('RECEIVEFARMCONSUMEMOVE',
															{
																message: 0,
																idUnitInLocations:rows[0].idUnitInLocations,																				
																FarmPortableMove: parseInt(FarmPortableMove,10),
																Position:PositionChange,
										                	});								                	

										                	//cập nhật lại data									
															var query = pool.query("UPDATE unitinlocations SET  TimeMoveComplete = 0,TimeCheck = '"+parseFloat(createPositionTimelast)
																+"',Position = '"+PositionChange
																+"',timeClick = '"+parseFloat(createPositionTimelast)																
																+"',PositionClick='"+PositionChange
																+"',TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(createPositionTimelast)
																+"',TimeSendToClient = 0,CheckMove = 0 where idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
															{
																if(!!error){console.log('Error in the query 395');
																}else
																{
																	console.log("ipdate position 14");
																	if (result.affectedRows>0) 
																	{	
																		//cập nhật redis
																		var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
																		{
																			if (!!error){console.log('Error in the query 396');
																			}else
																			{		
																				console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm khong còn vị trí chẳn============================= ");
																				//update resid															        					
																				client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));	

																				//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (2=)																					
																				CheckPosition(io);																																																		        																		         
																			}
																		})															
																	}
																}
															});										
														}
														else
														{													  				
											  				arrC =	PositionChange.split(",");
															arrB =	functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange).split(",");	
															var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);																																
															console.log("RECEIVEFARMCONSUMEMOVE 8: "+rows[0].idUnitInLocations);
															io.emit('RECEIVEFARMCONSUMEMOVE',
															{
																message: 0,
																idUnitInLocations:rows[0].idUnitInLocations,																				
																FarmPortableMove: parseInt(FarmPortableMove,10),
																Position: functions.getNewLocationClickWithFarm(PositionChange,arraySendFarmMoveConsume[index].PositionClick,PositionChange),
										                	});		

										                	//cập nhật lại data									
															var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange)
																+"',timeClick = '"+(parseFloat(createPositionTimelast)+Number((time).toFixed(0)))																	
																+"',FarmPortable = '"+parseFloat(FarmPortableMove)																	
																+"',TimeMoveComplete = '"+time																	
																+"',TimeMoveTotalComplete = '"+ (time+parseFloat(createPositionTimelast))
																+"',TimeCheck = '"+ (time+parseFloat(createPositionTimelast))
																+"',TimeSendToClient = 0,CheckMove = 1 where idUnitInLocations = '"+parseFloat(arraySendFarmMoveConsume[index].idUnitInLocations)+"'",function(error, result, field)
															{
																if(!!error){console.log('Error in the query 398');
																}else
																{
																	console.log("ipdate position 15");
																	if (result.affectedRows>0) 
																	{		
																		console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm vị trí lẻ=============================");																		
																		//cập nhật lại redis
																		var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, rows,field)
																		{
																			if (!!error){console.log('Error in the query 399');
																			}else
																			{																						
																				//update resid															        					
																				client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));																						
																			}
																		})																																															                	
																	}
																}
															});																									  								                							                								  									  								                												  				
														}																								
													}
												}
											}
										});
									}															
								}
							});																								
						}														
					}
				}
			});

			//Thực hiện cập nhật farm khi user đứng lại
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1 AND CheckOnline = 1 AND TimeMoveTotalComplete ='"+createPositionTimelast+"'",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query 402');
				}else
				{
					if (rows.length>0) 
					{
						arraySendFarmMoveConsume =rows;	
						for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
						{
							var index = i;														
							FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete));								
							if (parseFloat(rows[index].FarmPortable)<(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete)))
							{
								FarmPortableMove = 0;
							}

							var query = pool.query("UPDATE unitinlocations SET Position = PositionClick ,TimeMoveComplete = 0,CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove)	
	                			+"',timeClick = '"+ parseFloat(createPositionTimelast)
	                			+"',TimeSendToClient = 0,CheckMove = 0,CheckMoveOff = 0 where idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error){console.log('Error in the query 403s');
								}else
								{
									console.log("ipdate position 16");
									if (result.affectedRows>0) 
									{
										console.log("RECEIVEFARMCONSUMEMOVE : "+rows[0].idUnitInLocations+" PositionClick: "+rows[index].PositionClick);
										//gửi lên cho từng user					    
					                	io.emit('RECEIVEFARMCONSUMEMOVE',
										{
											message: 1,
											idUnitInLocations:rows[index].idUnitInLocations,																				
											FarmPortableMove: parseInt(FarmPortableMove,10),
											Position:rows[index].PositionClick,
					                	});	

					                	//console.log("ci tri gửi len sau khi hoan thanh: "+ rows[index].PositionClick);
					                	//cập nhật redis
					                	var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, rows,field)
										{
											if (!!error){console.log('Error in the query 404');
											}else
											{
												//update resid	
												console.log(parseFloat(rows[0].idUnitInLocations)+"===================================================================================cập nhật redis khi di chuyên xong: "+parseFloat(rows[0].FarmPortable));
												client.set(parseFloat(rows[0].idUnitInLocations),JSON.stringify(rows[0])); 											          
											}
										})	
										//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (3=)										
										CheckPosition(io);              							                								  									  								                								  			
									}
								}
							});				
														
						}
														
					}
				}
			});	


			//Cập nhật vi tri và farm khi di chuyển hoàn tất offline
			var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMoveOff=1 AND CheckOnline=0 AND TimeMoveTotalComplete ='"+parseFloat(createPositionTimelast)+"' AND CheckCreate !=1",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query 402');
				}else
				{
					if (rows.length>0) 
					{
						arraySendFarmMoveConsumeOffComplete =rows;	
						for (var i = 0; i < arraySendFarmMoveConsumeOffComplete.length; i++) 
						{
							var index = i;														
							FarmPortableMoveOffComplete = parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)-(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete));								
							if (parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)<(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete)))
							{
								FarmPortableMoveOffComplete = 0;
							}

							var query = pool.query("UPDATE unitinlocations SET Position = PositionClick,TimeMoveTotalComplete='"+parseFloat(createPositionTimelast)
								+"', TimeMoveComplete = 0,TimeCheck = '"+parseFloat(createPositionTimelast)
								+"', CheckMoveOff = 0,CheckMove = 0,timeClick='"+parseFloat(createPositionTimelast)
								+"', FarmPortable='"+parseFloat(FarmPortableMoveOffComplete)
								+"',DistanceMoveLogoff='' WHERE idUnitInLocations='"+parseFloat(arraySendFarmMoveConsumeOffComplete[index].idUnitInLocations)+"'",function(error, result, field)
							{
								if(!!error){console.log('Error in the query 468a');
								}else
								{
									console.log("ipdate position 17");
									if (result.affectedRows> 0) 
									{		
										console.log("============Cập nhật vị trí và farm khi di chuyển offline hoàn tất: "+parseFloat(rows[index].FarmPortable));
										io.emit('RECEIVEFARMCONSUMEMOVE',
										{
											message: 1,
											idUnitInLocations:rows[index].idUnitInLocations,																				
											FarmPortableMove: parseFloat(FarmPortableMoveOffComplete),
											Position:rows[index].PositionClick,
					                	});

										//kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (4=)										
										CheckPosition(io);
									}								
								}
							});																
						}														
					}
				}
			});	
												
			//update vị trị sau cùng và time move
			var query = pool.query('UPDATE unitinlocations SET Position = PositionClick ,CheckMove=0,DistanceMoveLogoff="" WHERE CheckOnline=1 AND TimeMoveTotalComplete =? AND CheckCreate !=1',[parseFloat(createPositionTimelast)],function(error, result, field)
			{
				if(!!error){console.log('Error in the query 468');
				}else
				{
					if (result.affectedRows> 0) 
					{	
						console.log("ipdate position 18");						
						//kiểm tra vị trí trùng sau khi hết thời gian di chuyển (5=)						
						CheckPosition(io);			
					}					
				}
			});    	 		    			    					
		});	
    }
}

function updateFarmMove(PositionClick,timeClick,TimeMoveComplete,TimeMoveTotalComplete,TimeCheck,TimeSendToClient,idUnitInLocations)
{
	d = new Date(); createPositionTimelast = Math.floor(d.getTime() / 1000);
	var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+ PositionClick 			                			
		+"',timeClick = '"+ parseFloat(timeClick)
		+"',TimeMoveComplete = '"+ parseFloat(TimeMoveComplete)			                			
		+"',TimeMoveTotalComplete = '"+ (parseFloat(TimeMoveComplete)+parseFloat(createPositionTimelast))
		+"',TimeCheck = '"+ (parseFloat(TimeMoveComplete)+parseFloat(createPositionTimelast))
		+"',TimeSendToClient = '"+ ((1/parseFloat(TimeSendToClient))+parseFloat(createPositionTimelast))
		+"',CheckMove = 1 where idUnitInLocations = '"+idUnitInLocations+"'",function(error, result, field)
	{
		if(!!error){console.log('Error in the query113434gSfafd');
		}else
		{			
			connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
			{
				if (!!error){console.log('Error in the query4');
				}else
				{																																
			        //Cập nhật farm và vị trị lại trong redis														        					
					client.set(idUnitInLocations,JSON.stringify(rows[0]));																															         			        												          
				}
			})																				
			
		}
	});	
}
function updateFarmMove(PositionClick,timeClick,TimeMoveComplete,TimeMoveTotalComplete,TimeCheck,TimeSendToClient,idUnitInLocations,callback) 
{   
   	d = new Date(); createPositionTimelast = Math.floor(d.getTime() / 1000);
	var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+ PositionClick 			                			
		+"',timeClick = '"+ parseFloat(timeClick)
		+"',TimeMoveComplete = '"+ parseFloat(TimeMoveComplete)			                			
		+"',TimeMoveTotalComplete = '"+ (parseFloat(TimeMoveComplete)+parseFloat(createPositionTimelast))
		+"',TimeCheck = '"+ (parseFloat(TimeMoveComplete)+parseFloat(createPositionTimelast))
		+"',TimeSendToClient = '"+ ((1/parseFloat(TimeSendToClient))+parseFloat(createPositionTimelast))
		+"',CheckMove = 1 where idUnitInLocations = '"+idUnitInLocations+"'",function(error, result, field)
	{
        if (error) 
        {
            console.log("Error in the query UpgradeDatabase");
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                if ((UpgradeWait==="Bowman")||(UpgradeWait==="Granary") 
                    ||(UpgradeWait==="Market") ||(UpgradeWait==="CityWall")) 
                {                      
                    if ( ((parseFloat(rows[0].LvCity))>=5) && (parseFloat(rows[0].LvCity) >= (parseFloat(LevelUpgrade))) )
                    {                   
                        callback(null,1);                   
                    }else
                    {                   
                        callback(null,0);
                    }
                }else
                {                     
                    if (parseFloat(rows[0].LvCity) >= (parseFloat(LevelUpgrade))) 
                    {                   
                        callback(null,1);                   
                    }else
                    {                   
                        callback(null,0);
                    }
                }               
            }
        }
    }); 
}



function getNumberDifferent(UN,A1,A2,B1,B2)
{
    var S1, S2; 
    if (parseFloat(UN)===0) 
    {
        if (A1>B1) 
        {
            S1 = parseFloat(A1) - parseFloat(B1);
            if (A2>B2) 
            {
                S2 = parseFloat(A2) - parseFloat(B2); 
                if (S1 >=0.2 || S2 >= 0.2) {
                    return false;
                }else
                {
                    return true;
                }
            }else
            {
                S2 = parseFloat(B2) - parseFloat(A2);
                if (S1 >=0.2|| S2 >= 0.2) {
                    return false;
                }else
                {
                    return true;
                }
            }
        }else
        {
            S1 = parseFloat(B1) - parseFloat(A1);
            if (A2>B2) 
            {
                S2 = parseFloat(A2) - parseFloat(B2); 
                if (S1 >=0.2 || S2 >= 0.2) {
                    return false;
                }else
                {
                    return true;
                }
            }else
            {
                S2 = parseFloat(B2) - parseFloat(A2);
                if (S1 >=0.2 || S2 >= 0.2) {
                    return false;
                }else
                {
                    return true;
                }
            }
        }
    }       
}


function CheckPosition(io)
{
	console.log("===============Call function check position=================");
    var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [];
    var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;           
    var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
    {
        if (!!error){console.log('Error in the query 466');
        }else
        {
            arraycheckUser=rows;                                                                                        
            var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
            {
                if (!!error){console.log('Error in the query 469');
                }else
                {
                    for (var k = 0; k < rows.length; k++)
                    {
                         arrayAllCheckTime.push(rows[k]);
                    }
                    for (var j = 0; j < arrayAllCheckTime.length; j++)
                    {                               
                        if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length)
                            +parseFloat(lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length)>=2)
                        {
                            const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTime[j].Position.split(","),idUnitInLocations=arrayAllCheckTime[j].idUnitInLocations;                                  
                            var X = parseFloat(arrs[0]), 
                            Y =parseFloat(arrs[1]), N=1;
                            X = X - N;
                            Y = Y + N;
                            var TopLeft= X+","+Y;                                   
                            arrayS.push(TopLeft);                                   
                            for (var i = 0; i < (N*2); i++)
                            {
                                X +=1;                                      
                                arrayS.push(X+","+Y);                                       
                            }
                            for (var k = 0; k < (N*2+1); k++)
                            {
                                var arr = arrayS[k].split(",");
                                for (var i = 1; i < (N*2+1); i++)
                                {
                                    var v =parseFloat(arr[1])-i;                                            
                                    arrayS.push(arr[0]+","+v);                                                                                      
                                }                       
                            }

                            for (var i = 0; i < arrayS.length; i++) 
                            {
                                if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS[i]).length)<=0)
                                {
                                    arrayRandom.push(arrayS[i]);
                                }
                            }                                                                                   
                            if (arrayRandom.length>0) 
                            {                                                       
                                newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
                                arrayAllCheckTime[j].PositionClick = newLocation;
                                arrA =  newLocation.split(",");
                                arrC =  arrayAllCheckTime[j].Position.split(",");                                                               
                                var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach)).toFixed(0));                            
                                //time=0;                                   
                                var farmtest =  (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));                                                                 
                                if (parseFloat(arrayAllCheckTime[j].FarmPortable) < (parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time))) 
                                {
                                    FarmConsumeChangePositionDuplicate=0;
                                }else
                                {
                                    FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTime[j].FarmPortable)-(parseFloat(arrayAllCheckTime[j].Quality)*parseFloat(arrayAllCheckTime[j].MoveSpeedEach)*parseFloat(time));
                                }
                                var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',TimeSendToClient='"+(parseFloat(createPositionTimelast)+10)+"',CheckMove=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),0,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
                                {
                                    if(!!error){console.log('Error in the query 470');
                                    }else
                                    {
                                    	console.log("ipdate position 19");
                                        if (result.affectedRows> 0) 
                                        {                                       
                                            var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
                                            {
                                                if (!!error){console.log('Error in the query 471');
                                                }else
                                                {
                                                    if (rows.length >0)
                                                    {                  
                                                    	console.log("=============Thuc hien thay doi vi tri danh cron circle 1");	                                                                                                     
                                                        //gửi vị trí cập nhật trùng vòng 1                                                        
                                                        io.emit('RECEIVEPOSITIONCHANGE',
														{
										            		
										            		idUnitInLocations: parseFloat(idUnitInLocations),
										            		UserName: rows[0].UserName, 
										            		PositionClick: newLocation,
										            		UnitOrder: rows[0].UnitOrder,

										        		});	                                                                      
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })  
                            }else
                            {                                               
                                
                                var X = parseFloat(arrs[0]), 
                                Y =parseFloat(arrs[1]), N=2;
                                X = X - N;
                                Y = Y + N;
                                var TopLeft= X+","+Y;
                                arrayS1.push(TopLeft);
                                for (var i = 0; i < (N*2); i++)
                                {
                                    X +=1;
                                    arrayS1.push(X+","+Y);
                                }
                                for (var k = 0; k < (N*2+1); k++)
                                {
                                    var arr = arrayS1[k].split(",");
                                    for (var i = 1; i < (N*2+1); i++)
                                    {
                                        var v =parseFloat(arr[1])-i;
                                        if(arrayS.indexOf(arr[0]+","+v) > -1) {                             
                                        }else
                                        {                               
                                            arrayS1.push(arr[0]+","+v);         
                                        }                           
                                    }                       
                                }

                                for (var i = 0; i < arrayS1.length; i++) 
                                {
                                    if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS1[i]).length)<=0)
                                    {
                                        arrayRandom.push(arrayS1[i]);
                                    }
                                }
                                if (arrayRandom.length >0 ) 
                                {                                                       
                                    newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
                                    arrayAllCheckTime[j].PositionClick = newLocation;
                                    arrA =  newLocation.split(",");
                                    arrC =  arrayAllCheckTime[j].Position.split(",");                                   
                                    var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
                                    time=0;                                    
                                    //var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
                                    var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
                                    {
                                        if(!!error) { console.log('Error in the query 473');
                                        }else
                                        {
                                        	console.log("ipdate position 20");
                                            if (result.affectedRows> 0) 
                                            {                                                       
                                                var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
                                                {
                                                    if (!!error){console.log('Error in the query 474');
                                                    }else
                                                    {
                                                        if (rows.length >0)
                                                        {                         
                                                        	console.log("=============Thuc hien thay doi vi tri danh cron circle 2");	                                   
                                                            //gửi vị trí cập nhật vòng 2                                                            
                                                            io.emit('RECEIVEPOSITIONCHANGE',
															{											            		
											            		idUnitInLocations: parseFloat(idUnitInLocations),
											            		UserName: rows[0].UserName, 
											            		PositionClick: newLocation,
											            		UnitOrder: rows[0].UnitOrder,
											        		});	
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })      
                                }else
                                {                                                       
                                    var X = parseFloat(arrs[0]), 
                                    Y =parseFloat(arrs[1]), N=3;
                                    X = X - N;
                                    Y = Y + N;
                                    var TopLeft= X+","+Y;
                                    arrayS2.push(TopLeft);
                                    for (var i = 0; i < (N*2); i++)
                                    {
                                        X +=1;
                                        arrayS2.push(X+","+Y);
                                    }
                                    for (var k = 0; k < (N*2+1); k++)
                                    {
                                        var arr = arrayS2[k].split(",");
                                        for (var i = 1; i < (N*2+1); i++)
                                        {
                                            var v =parseFloat(arr[1])-i;
                                            if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
                                            {                               
                                            }else
                                            {                               
                                                arrayS2.push(arr[0]+","+v);         
                                            }   
                                        }                       
                                    }
                                    for (var i = 0; i < arrayS2.length; i++) 
                                    {
                                        if (parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayS2[i]).length)<=0)
                                        {
                                            arrayRandom.push(arrayS2[i]);
                                        }
                                    }                                                                                   
                                    if (arrayRandom.length>0) 
                                    {                                                       
                                        newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
                                        arrayAllCheckTime[j].PositionClick = newLocation;
                                        arrA =  newLocation.split(",");
                                        arrC =  arrayAllCheckTime[j].Position.split(",");                                   
                                        var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
                                        time=0;                                     

                                        //var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
                                        var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
                                        {
                                            if(!!error){console.log('Error in the query 476');
                                            }else
                                            {
                                            	console.log("ipdate position 21");
                                                if (result.affectedRows> 0) {                                                           
                                                    var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
                                                    {
                                                        if (!!error){console.log('Error in the query 477');
                                                        }else
                                                        {
                                                            if (rows.length >0)
                                                            {               
                                                            	console.log("=============Thuc hien thay doi vi tri danh cron circle 3");	                                                                                                                     
                                                                //gửi vị trí cập nhật vòng 3                                                                 
                                                                
                                                                io.emit('RECEIVEPOSITIONCHANGE',
																{												            		
												            		idUnitInLocations: parseFloat(idUnitInLocations),
												            		UserName: rows[0].UserName, 
												            		PositionClick: newLocation,
												            		UnitOrder: rows[0].UnitOrder,
												        		});	                                                                                 
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        })  
                                    }
                                }
                            }       
                        }
                    }
                }
            });
        }
    })
}