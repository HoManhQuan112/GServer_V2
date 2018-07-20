'use strict';
var pool = require('./db');
var functions   = require("./functions");
var parseN = 10,timeRemaincomplete,currentSENDCHECKUNITINBASE,currentBaseSend,d,createPositionTimelast,currentBaseComplete,
arrayFarmBase = [],arrayWoodBase = [],arrayStoneBase = [],arrayMetalBase = [],arrayLevelBase = [],arrayTimeUnitComplete = [],arrayFarmSpent = [],
arrayUserNamecomplete = [], arrayUnitTypecomplete = [],arrayQualitycomplete = [],arrayLevelcomplete = [],arrayWoodSpent = [],
arrayStoneSpent = [],arrayMetalSpent =[],DetailError;

module.exports = function (socket) 
{

	socket.on('S_BUY_UNIT', function (data)
	{
		currentBaseSend = getcurrentBaseSend(data);
		console.log("data receive S_BUY_UNIT============: "+ currentBaseSend.UserName+"_"
									+"_"+currentBaseSend.numberBase+"_"
									+"_"+currentBaseSend.UnitType+"_"
									+currentBaseSend.Level
									+"_"+currentBaseSend.Quality+"_"
									+currentBaseSend.Farm+
									"_"+currentBaseSend.Wood+
									"_"+currentBaseSend.Stone+
									"_"+currentBaseSend.Metal+
									"_"+currentBaseSend.Diamond);
		pool.getConnection(function(err,connection)
		{
			//kiểm tra face thời gian
			connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentBaseSend.UserName
				+"' AND `numberBase` = '"+currentBaseSend.numberBase+"'",function(error, rows,field)
			{
				if (!!error) {DetailError = ('unitinbase: Error in the query 1');
					console.log(DetailError);
                    functions.writeLogErrror(DetailError);
				}else
				{
					if (rows.length>0) 
					{
						//gửi mail						
						socket.emit('R_TIME_WAIT_IN_BASE',
						{
							checkResource:0,
	                	});
					}else
					{
						connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal, C.Diamond as DiamondBuy, C.Wood as WoodBuy,  C.Stone as StoneBuy, C.Farm as FarmBuy, C.Metal as MetalBuy, C.timeRemain FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourcebuyunit AS C ON C.Level = '"+currentBaseSend.Level
							+"' WHERE A.UserName = '"+currentBaseSend.UserName
							+"'AND B.numberBase = '"+currentBaseSend.numberBase
							+"' AND C.UnitType = '"+currentBaseSend.UnitType+"'",function(error, rows,field)
				        {
							if (!!error){DetailError = ('unitinbase: Error in the query 2');
								console.log(DetailError);
                                functions.writeLogErrror(DetailError);
							}else
							{
								if(rows.length > 0)
								{									
									//kiểm tra tài nguyên
									if (((parseFloat(rows[0].Farm) - parseFloat(rows[0].FarmBuy)*parseFloat(currentBaseSend.Quality))===parseFloat(currentBaseSend.Farm))&&

										((parseFloat(rows[0].Wood) - parseFloat(rows[0].WoodBuy)*parseFloat(currentBaseSend.Quality))===parseFloat(currentBaseSend.Wood))&&

										((parseFloat(rows[0].Stone) - parseFloat(rows[0].StoneBuy)*parseFloat(currentBaseSend.Quality))===parseFloat(currentBaseSend.Stone))&&

										((parseFloat(rows[0].Metal) - parseFloat(rows[0].MetalBuy)*parseFloat(currentBaseSend.Quality))===parseFloat(currentBaseSend.Metal))&&

										((parseFloat(rows[0].Diamond) - parseFloat(rows[0].DiamondBuy)*parseFloat(currentBaseSend.Quality))===parseFloat(currentBaseSend.Diamond))) 
									{
										//thực hiện
										connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentBaseSend.Diamond))	                			
				                			+"',userbase.Wood = '"+ (parseFloat(currentBaseSend.Wood))
				                			+"',userbase.Stone = '"+ (parseFloat(currentBaseSend.Stone))
				                			+"',userbase.Farm = '"+ (parseFloat(currentBaseSend.Farm))
				                			+"',userbase.Metal = '"+ (parseFloat(currentBaseSend.Metal))
				                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentBaseSend.UserName
				                			+"'AND userbase.numberBase = '"+currentBaseSend.numberBase+"'",function(error, result, field)
										{
											if(!!error){DetailError = ('unitinbase: Error in the query 3');
												console.log(DetailError);
                                				functions.writeLogErrror(DetailError);
											}else
											{
												if (result.affectedRows>0) 
												{
													//insert vào bảng unitwaitinbase
													d = new Date();
												    createPositionTimelast = Math.floor(d.getTime() / 1000);
													connection.query("INSERT INTO `unitwaitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`, `timeComplete`,`timeRemain`) VALUES ('"+""+"','"
														+currentBaseSend.UserName+"','"
														+currentBaseSend.numberBase+"','"
														+currentBaseSend.UnitType+"','"
														+currentBaseSend.Quality+"','"
														+currentBaseSend.Level+"','"
														+(parseFloat(createPositionTimelast)+(parseFloat(rows[0].timeRemain)*currentBaseSend.Quality))+"','"
														+(parseFloat(rows[0].timeRemain)*currentBaseSend.Quality)+"')",function(error, result, field)
													{								          
											            if(!!err){DetailError = ('unitinbase: Insert unit wait in base thất bại');
											            	console.log(DetailError);
                                							functions.writeLogErrror(DetailError);
											        	}

											            connection.release();
													});
												}
											}
										});
									}else
									{	
										socket.emit('R_TIME_WAIT_IN_BASE',
										{
											checkResource:0,
					                	});
									}
								}else
								{									
									socket.emit('R_TIME_WAIT_IN_BASE',
									{
										checkResource:0,
				                	});
								}
							}
						})
					}
				}
			});						
		});
	});

	socket.on('S_CHECK_UNIT_IN_BASE', function (data)
	{		

		currentSENDCHECKUNITINBASE =getcurrentSENDCHECKUNITINBASE(data);
		console.log("=====S_CHECK_UNIT_IN_BASE: "+currentSENDCHECKUNITINBASE.UserName+"_"+currentSENDCHECKUNITINBASE.numberBase
			+"_"+currentSENDCHECKUNITINBASE.Quality+"_"+currentSENDCHECKUNITINBASE.Level+"_"+currentSENDCHECKUNITINBASE.UnitType);
		pool.getConnection(function(err,connection)
		{      		
			//Check tài khuyên
			connection.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINBASE.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINBASE.numberBase
				+"'AND `Level` = '"+parseInt(currentSENDCHECKUNITINBASE.Level, parseN)+"'AND `UnitType` = '"+currentSENDCHECKUNITINBASE.UnitType+"'",function(error, rows,field)
	        {
				if (!!error)
				{
					DetailError = ('unitinbase: Error in the query 4');
					console.log(DetailError);
                    functions.writeLogErrror(DetailError);
				}else
				{
					if(rows.length > 0)
					{

						if((parseInt(rows[0].Quality, parseN) === parseInt(currentSENDCHECKUNITINBASE.Quality, parseN)))
						{
							socket.emit('R_CHECK_UNIT_IN_BASE',
							{
								checkResource:1,
		                	});
						}else
						{
							DetailError = ('unitinbase: mail Error in the query 4');
							console.log(DetailError);
                            functions.writeLogErrror(DetailError);
							// setup email data with unicode symbols
							let mailOptions = {
							    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
							    to: 'codergame@demandvi.com', // list of receivers
							    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
							    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
							    html:"<html><head><title>HTML Table</title></head>"+
								"<body><table border='1' width='100%'><thead><tr><td colspan='5' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
								"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
								"<tbody><tr bgcolor='#bfbfbf'><td>Tên</td><td>numberBase</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
								"<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+parseInt(rows[0].numberBase, parseN)+"</td><td>"
								+parseInt(rows[0].Quality, parseN)+"</td><td>"+parseInt(rows[0].Level, parseN)+"</td><td>"
								+parseInt(rows[0].UnitType, parseN)+"</td></tr>"+
								"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
								"<tr bgcolor='#bfbfbf'><td>Tên</td><td> numberBase</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
								"<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+currentSENDCHECKUNITINBASE.numberBase+"</td><td>"
								+currentSENDCHECKUNITINBASE.Quality+"</td><td>"+currentSENDCHECKUNITINBASE.Level+"</td><td>"
								+currentSENDCHECKUNITINBASE.UnitType+"</td></tr></tbody></table></body></html>"
							};
							// send mail with defined transport object
							functions.sendMail(mailOptions);	

							socket.emit('R_CHECK_UNIT_IN_BASE',
							{
								checkResource:0,
		                	});
						}
					}
				}
			})
		});			
	});

	socket.on('S_TIME_WAIT_IN_BASE_COMPLETE', function (data)
	{
		//Nhận thời gian complete từ client
		currentBaseComplete = getcurrentBaseComplete(data);
		console.log("data receive S_TIME_WAIT_IN_BASE_COMPLETE: "
			+currentBaseComplete.UserName
			+"_"+currentBaseComplete.numberBase
			+"_"+currentBaseComplete.UnitType);
		pool.getConnection(function(err,connection)
		{
			connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentBaseComplete.UserName
				+"' AND `numberBase` = '"+currentBaseComplete.numberBase
				+"' AND `UnitType` = '"+currentBaseComplete.UnitType+"'",function(error, rows,field)
			{
				if (!!error) {DetailError = ('unitinbase: Error in the query 5');
					console.log(DetailError);
                    functions.writeLogErrror(DetailError);
				}else
				{
					//check hoàn tất mua lính
					if (rows.length>0) 
					{
						d = new Date();
			    		createPositionTimelast = Math.floor(d.getTime() / 1000);			    		
						if (parseFloat(createPositionTimelast)>=(parseFloat(rows[0].timeComplete)-1))
						{
							// update vào bảng unitinbase và remove data					
							connection.query("UPDATE unitinbase SET Quality = Quality +'"+parseFloat(rows[0].Quality)+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
									[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType,rows[0].Level],function(error, result, field)
							{
								if(!!error){DetailError = ('unitinbase: Error in the query 6');
									console.log(DetailError);
                                	functions.writeLogErrror(DetailError);
								}else
								{
									if (result.affectedRows > 0) 
									{										
										connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
										[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType],function(error, result, field)
									  	{
									  		if(!!error){DetailError = ('unitinbase: Error in the query 7');
									  			console.log(DetailError);
                                				functions.writeLogErrror(DetailError);
									  		}									  		
									  		connection.release();
									  	});
									}else
									{
										//nếu không cập nhật thì insert																		
										connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`numberBase`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
										+currentBaseComplete.UserName+"','"+currentBaseComplete.numberBase+"','"+currentBaseComplete.UnitType+"','"+rows[0].Quality+"','"
										+rows[0].Level+"')",function(error, result, field)
										{
								            if(!!err){DetailError = ('unitinbase: Error in the query 8');
								            	console.log(DetailError);
                                				functions.writeLogErrror(DetailError);
								            }else
								            {
								            	if (result.affectedRows > 0) 
								            	{								            		
								            		connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
													[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType],function(error, result, field)
												  	{
														if(!!error){DetailError = ('unitinbase: Error in the query 9');
															console.log(DetailError);
                                							functions.writeLogErrror(DetailError);
														}
														connection.release();
													})
								            	}else
								            	{								            		
								            		socket.emit('R_UNIT_IN_BASE_SUCCESS',
													{
														message:0,									
													});
								            	}								            	
								            }
										})								
									}									
								}
							})
						}else
						{							
							socket.emit('R_UNIT_IN_BASE_SUCCESS',
							{
								message:0,									
							});
						}
					}else
					{						
						socket.emit('R_UNIT_IN_BASE_SUCCESS',
						{
							message:0,									
						});
					}
			    }
			});
		});		
	});

};

function getcurrentSENDCHECKUNITINBASE(data)
{
	return currentSENDCHECKUNITINBASE =
		{
			UserName:data.UserName,
			numberBase:data.numberBase,
			Quality:data.Quality,
			Level:data.Level,
			UnitType:data.UnitType,
		}
}

function getcurrentBaseSend(data)
{
	return currentBaseSend =
		{
			UserName:data.UserName,
			numberBase:data.numberBase,
			UnitType:data.UnitType,
			Level:data.Level,
			Quality:data.Quality,
			Farm:data.Farm,
			Wood:data.Wood,
			Stone:data.Stone,
			Metal:data.Metal,
			Diamond:data.Diamond,
		}
}

function getcurrentBaseComplete(data)
{
	return currentBaseComplete =
	{
		UserName:data.UserName,
		numberBase:data.numberBase,
		UnitType:data.UnitType,			
	}
}