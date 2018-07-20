// 'use strict';
// var database 		= require('./../Util/db.js');
// var functions 		= require("./../Util/functions.js");



// var parseN = 10,timeRemaincomplete,currentSENDCHECKUNITINBASE,current_S_BUY_UNIT,d,currentTime,currentBaseComplete,
// arrayFarmBase = [],arrayWoodBase = [],arrayStoneBase = [],arrayMetalBase = [],arrayLevelBase = [],arrayTimeUnitComplete = [],arrayFarmSpent = [],
// arrayUserNamecomplete = [], arrayUnitTypecomplete = [],arrayQualitycomplete = [],arrayLevelcomplete = [],arrayWoodSpent = [],
// arrayStoneSpent = [],arrayMetalSpent =[];

// var DetailError;

// exports.getarrayUnitWaitBaseUser = function getarrayUnitWaitBaseUser (currentUser,arrayUnitWaitBaseUser) {
// 	database.query("SELECT `numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='0' AND `UserName` ='"+currentUser.name+"'",
// 		function(error, rows){
// 			if (!!error){DetailError =('unitInBase: Error SELECT getarrayUnitWaitBaseUser');functions.writeLogErrror(DetailError);}
// 			(rows.length>0)?arrayUnitWaitBaseUser(rows):arrayUnitWaitBaseUser(0);
// 		});
// }

// exports.startEvent = function startEvent (socket) 
// {
// 	socket.on('S_BUY_UNIT', function (data)
// 	{
// 		current_S_BUY_UNIT = getcurrent_S_BUY_UNIT(data);
// 		console.log("data receive S_BUY_UNIT============: "
// 			+    current_S_BUY_UNIT.UserName
// 			+"_"+current_S_BUY_UNIT.numberBase
// 			+"_"+current_S_BUY_UNIT.UnitType
// 			+"_"+current_S_BUY_UNIT.Level
// 			+"_"+current_S_BUY_UNIT.Quality
// 			+"_"+current_S_BUY_UNIT.Farm
// 			+"_"+current_S_BUY_UNIT.Wood
// 			+"_"+current_S_BUY_UNIT.Stone
// 			+"_"+current_S_BUY_UNIT.Metal
// 			+"_"+current_S_BUY_UNIT.Diamond);
// 		database.getdatabase(function(err,database)
// 		{
			
// 			database.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+current_S_BUY_UNIT.UserName
// 				+"' AND `numberBase` = '"+current_S_BUY_UNIT.numberBase+"'",function(error, rows)
// 				{
// 					if (!!error) {DetailError = ('unitinbase: Error in the query 1');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);
// 				}else
// 				{
// 					if (rows.length>0) 
// 					{
						
// 						socket.emit('R_TIME_WAIT_IN_BASE',
// 						{
// 							checkResource:0,
// 						});
// 					}else
// 					{
// 						database.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal, C.Diamond as DiamondBuy, C.Wood as WoodBuy,  C.Stone as StoneBuy, C.Farm as FarmBuy, C.Metal as MetalBuy, C.timeRemain FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourcebuyunit AS C ON C.Level = '"+current_S_BUY_UNIT.Level
// 							+"' WHERE A.UserName = '"+current_S_BUY_UNIT.UserName
// 							+"'AND B.numberBase = '"+current_S_BUY_UNIT.numberBase
// 							+"' AND C.UnitType = '"+current_S_BUY_UNIT.UnitType+"'",function(error, rows)
// 							{
// 								if (!!error){DetailError = ('unitinbase: Error in the query 2');
// 								console.log(DetailError);
// 								functions.writeLogErrror(DetailError);
// 							}else
// 							{
// 								if(rows.length > 0)
// 								{									
// 									//kiểm tra tài nguyên
// 									if (((parseFloat(rows[0].Farm) - parseFloat(rows[0].FarmBuy)*parseFloat(current_S_BUY_UNIT.Quality))===parseFloat(current_S_BUY_UNIT.Farm))&&

// 										((parseFloat(rows[0].Wood) - parseFloat(rows[0].WoodBuy)*parseFloat(current_S_BUY_UNIT.Quality))===parseFloat(current_S_BUY_UNIT.Wood))&&

// 										((parseFloat(rows[0].Stone) - parseFloat(rows[0].StoneBuy)*parseFloat(current_S_BUY_UNIT.Quality))===parseFloat(current_S_BUY_UNIT.Stone))&&

// 										((parseFloat(rows[0].Metal) - parseFloat(rows[0].MetalBuy)*parseFloat(current_S_BUY_UNIT.Quality))===parseFloat(current_S_BUY_UNIT.Metal))&&

// 										((parseFloat(rows[0].Diamond) - parseFloat(rows[0].DiamondBuy)*parseFloat(current_S_BUY_UNIT.Quality))===parseFloat(current_S_BUY_UNIT.Diamond))) 
// 									{
// 										//thực hiện
// 										database.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(current_S_BUY_UNIT.Diamond))	                			
// 											+"',userbase.Wood = '"+ (parseFloat(current_S_BUY_UNIT.Wood))
// 											+"',userbase.Stone = '"+ (parseFloat(current_S_BUY_UNIT.Stone))
// 											+"',userbase.Farm = '"+ (parseFloat(current_S_BUY_UNIT.Farm))
// 											+"',userbase.Metal = '"+ (parseFloat(current_S_BUY_UNIT.Metal))
// 											+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+current_S_BUY_UNIT.UserName
// 											+"'AND userbase.numberBase = '"+current_S_BUY_UNIT.numberBase+"'",function(error, result, field)
// 											{
// 												if(!!error){DetailError = ('unitinbase: Error in the query 3');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);
// 											}else
// 											{
// 												if (result.affectedRows>0) 
// 												{
// 													//insert vào bảng unitwaitinbase
// 													d = new Date();
// 													currentTime = Math.floor(d.getTime() / 1000);
// 													database.query("INSERT INTO `unitwaitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`, `timeComplete`,`timeRemain`) VALUES ('"+""+"','"
// 														+current_S_BUY_UNIT.UserName+"','"
// 														+current_S_BUY_UNIT.numberBase+"','"
// 														+current_S_BUY_UNIT.UnitType+"','"
// 														+current_S_BUY_UNIT.Quality+"','"
// 														+current_S_BUY_UNIT.Level+"','"
// 														+(parseFloat(currentTime)+(parseFloat(rows[0].timeRemain)*current_S_BUY_UNIT.Quality))+"','"
// 														+(parseFloat(rows[0].timeRemain)*current_S_BUY_UNIT.Quality)+"')",function(error, result, field)
// 														{								          
// 															if(!!err){DetailError = ('unitinbase: Insert unit wait in base thất bại');
// 															console.log(DetailError);
// 															functions.writeLogErrror(DetailError);
// 														}

// 														database.release();
// 													});
// 												}
// 											}
// 										});
// 									}else
// 									{	
// 										socket.emit('R_TIME_WAIT_IN_BASE',
// 										{
// 											checkResource:0,
// 										});
// 									}
// 								}else
// 								{									
// 									socket.emit('R_TIME_WAIT_IN_BASE',
// 									{
// 										checkResource:0,
// 									});
// 								}
// 							}
// 						})
// 					}
// 				}
// 			});						
// });
// });

// socket.on('S_CHECK_UNIT_IN_BASE', function (data)
// {		
// 	currentSENDCHECKUNITINBASE =getcurrentSENDCHECKUNITINBASE(data);
// 	console.log("=====S_CHECK_UNIT_IN_BASE: "+currentSENDCHECKUNITINBASE.UserName+"_"+currentSENDCHECKUNITINBASE.numberBase
// 		+"_"+currentSENDCHECKUNITINBASE.Quality+"_"+currentSENDCHECKUNITINBASE.Level+"_"+currentSENDCHECKUNITINBASE.UnitType);
// 	database.getdatabase(function(err,database)
// 	{      		
// 		//Check tài khuyên
// 		database.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINBASE.UserName+"'AND `numberBase` = '"+currentSENDCHECKUNITINBASE.numberBase
// 			+"'AND `Level` = '"+parseInt(currentSENDCHECKUNITINBASE.Level, parseN)+"'AND `UnitType` = '"+currentSENDCHECKUNITINBASE.UnitType+"'",function(error, rows)
// 			{
// 				if (!!error)
// 				{
// 					DetailError = ('unitinbase: Error in the query 4');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);
// 				}else
// 				{
// 					if(rows.length > 0)
// 					{

// 						if((parseInt(rows[0].Quality, parseN) === parseInt(currentSENDCHECKUNITINBASE.Quality, parseN)))
// 						{
// 							socket.emit('R_CHECK_UNIT_IN_BASE',
// 							{
// 								checkResource:1,
// 							});
// 						}else
// 						{
// 							DetailError = ('unitinbase: mail Error in the query 4');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);
// 							// setup email data with unicode symbols
// 							let mailOptions = {
// 							    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 							    to: 'codergame@demandvi.com', // list of receivers
// 							    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 							    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 							    html:"<html><head><title>HTML Table</title></head>"+
// 							    "<body><table border='1' width='100%'><thead><tr><td colspan='5' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 							    "<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 							    "<tbody><tr bgcolor='#bfbfbf'><td>Tên</td><td>numberBase</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
// 							    "<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+parseInt(rows[0].numberBase, parseN)+"</td><td>"
// 							    +parseInt(rows[0].Quality, parseN)+"</td><td>"+parseInt(rows[0].Level, parseN)+"</td><td>"
// 							    +parseInt(rows[0].UnitType, parseN)+"</td></tr>"+
// 							    "<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
// 							    "<tr bgcolor='#bfbfbf'><td>Tên</td><td> numberBase</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
// 							    "<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+currentSENDCHECKUNITINBASE.numberBase+"</td><td>"
// 							    +currentSENDCHECKUNITINBASE.Quality+"</td><td>"+currentSENDCHECKUNITINBASE.Level+"</td><td>"
// 							    +currentSENDCHECKUNITINBASE.UnitType+"</td></tr></tbody></table></body></html>"
// 							};
// 							// send mail with defined transport object
// 							functions.sendMail(mailOptions);	

// 							socket.emit('R_CHECK_UNIT_IN_BASE',
// 							{
// 								checkResource:0,
// 							});
// 						}
// 					}
// 				}
// 			})
// 	});			
// });

// socket.on('S_TIME_WAIT_IN_BASE_COMPLETE', function (data)
// {
// 	//Nhận thời gian complete từ client
// 	currentBaseComplete = getcurrentBaseComplete(data);
// 	console.log("data receive S_TIME_WAIT_IN_BASE_COMPLETE: "
// 		+currentBaseComplete.UserName
// 		+"_"+currentBaseComplete.numberBase
// 		+"_"+currentBaseComplete.UnitType);
// 	database.getdatabase(function(err,database)
// 	{
// 		database.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentBaseComplete.UserName
// 			+"' AND `numberBase` = '"+currentBaseComplete.numberBase
// 			+"' AND `UnitType` = '"+currentBaseComplete.UnitType+"'",function(error, rows)
// 			{
// 				if (!!error) {DetailError = ('unitinbase: Error in the query 5');
// 				console.log(DetailError);
// 				functions.writeLogErrror(DetailError);
// 			}else
// 			{
// 				//check hoàn tất mua lính
// 				if (rows.length>0) 
// 				{
// 					d = new Date();
// 					currentTime = Math.floor(d.getTime() / 1000);			    		
// 					if (parseFloat(currentTime)>=(parseFloat(rows[0].timeComplete)-1))
// 					{
// 						// update vào bảng unitinbase và remove data					
// 						database.query("UPDATE unitinbase SET Quality = Quality +'"+parseFloat(rows[0].Quality)+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
// 							[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType,rows[0].Level],function(error, result, field)
// 							{
// 								if(!!error){DetailError = ('unitinbase: Error in the query 6');
// 								console.log(DetailError);
// 								functions.writeLogErrror(DetailError);
// 							}else
// 							{
// 								if (result.affectedRows > 0) 
// 								{										
// 									database.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
// 										[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType],function(error, result, field)
// 										{
// 											if(!!error){DetailError = ('unitinbase: Error in the query 7');
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);
// 										}									  		
// 										database.release();
// 									});
// 								}else
// 								{
// 									//nếu không cập nhật thì insert																		
// 									database.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`numberBase`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
// 										+currentBaseComplete.UserName+"','"+currentBaseComplete.numberBase+"','"+currentBaseComplete.UnitType+"','"+rows[0].Quality+"','"
// 										+rows[0].Level+"')",function(error, result, field)
// 										{
// 											if(!!err){DetailError = ('unitinbase: Error in the query 8');
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);
// 										}else
// 										{
// 											if (result.affectedRows > 0) 
// 											{								            		
// 												database.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
// 													[currentBaseComplete.UserName,currentBaseComplete.numberBase,currentBaseComplete.UnitType],function(error, result, field)
// 													{
// 														if(!!error){DetailError = ('unitinbase: Error in the query 9');
// 														console.log(DetailError);
// 														functions.writeLogErrror(DetailError);
// 													}
// 													database.release();
// 												})
// 											}else
// 											{								            		
// 												socket.emit('R_UNIT_IN_BASE_SUCCESS',
// 												{
// 													message:0,									
// 												});
// 											}								            	
// 										}
// 									})								
// 								}									
// 							}
// 						})
// 					}else
// 					{							
// 						socket.emit('R_UNIT_IN_BASE_SUCCESS',
// 						{
// 							message:0,									
// 						});
// 					}
// 				}else
// 				{						
// 					socket.emit('R_UNIT_IN_BASE_SUCCESS',
// 					{
// 						message:0,									
// 					});
// 				}
// 			}
// 		});
// 	});		
// });

// }

// exports.updateTimeBuyUnit = function updateTimeBuyUnit (currentUser,currentTime) {
// 	updateTimeBuy (currentUser,currentTime);
// }

// //updateUnitWaitInBase
// exports.updateUnitWaitInBase = function updateUnitWaitInBase (currentUser,currentTime) {
// 	database.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows){
// 		if (!!error){DetailError =('unitInBase: Error select unitwaitinbase');functions.writeLogErrror(DetailError);}
// 		if (rows.length>0) {
// 			for (var i = 0; i < rows.length; i++) {
// 				if(parseFloat(rows[i].timeComplete)>parseFloat(currentTime)){
// 					updateUnitWait (rows[i],currentTime);
// 				}else{
// 					updateUnitFinished (rows[i]);
// 				}
// 			}
// 		}
// 	});
// }
// function updateUnitFinished (rows) {
// 	database.query("UPDATE unitinbase SET Quality = Quality + '"+parseFloat(rows.Quality)
// 		+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
// 		[rows.UserName,rows.numberBase,rows.UnitType,rows.Level],function(error, result){
// 			if (!!error){DetailError =('unitInBase: Error update unitinbase');functions.writeLogErrror(DetailError);}
// 			if (rows.length>0) {
// 				deleteUnitWaitInBase (rows);
// 			}else{
// 				insertNewUnit (rows);
// 			}

// 		});	
// }
// function insertNewUnit (rows) {
// 	database.query("INSERT INTO `unitinbase`(`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`)"
// 		+" VALUES (+,"+rows.UserName+","+rows.numberBase+","+rows.UnitType+","+rows.Quality+","+rows.Level+")",function (error,result) {
// 			if (!!error){DetailError =('unitInBase: Error insertNewUnit '+rows.UserName);functions.writeLogErrror(DetailError);}
// 		});
// }
// function deleteUnitWaitInBase (rows) {
// 	database.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?',
// 		[rows.UserName,rows.numberBase,rows.UnitType],function(error, result){
// 			if(!!error){DetailError =('unitInBase :Error delete unitwaitinbase '+rows.UserName);functions.writeLogErrror(DetailError);}
// 		});
// }
// function updateUnitWait (rows,currentTime) {
// 	database.query("UPDATE unitwaitinbase SET timeRemain = '"+(parseFloat(rows.timeComplete)-parseFloat(currentTime))
// 		+"' WHERE UserName = '"+rows.UserName
// 		+"' AND numberBase = '"+parseFloat(rows.numberBase)
// 		+"' AND UnitType = '"+parseFloat(rows.UnitType)+"'",function(error, result){
// 			if (!!error){DetailError =('unitInBase: Error update unitwaitinbase timeRemain '+rows.UserName);functions.writeLogErrror(DetailError);}
// 		});
// }
// //Cập nhật thời gian mua unit in base
// function updateTimeBuy (currentUser,currentTime) {
// 	database.query("SELECT * FROM `unitinbase` WHERE `UserName` = '"+currentUser.name+"'",function (error,rows) {
// 		if (!!error){DetailError =('unitInBase: Error selectTimeBuyUnit');functions.writeLogErrror(DetailError);}
// 		if (rows.length>0 && (parseFloat(currentTime) < parseFloat(rows[0].TimeCompleteUnitMoveSpeed))) {
// 			for (var i = 0; i < rows.length; i++) {
// 				if (parseFloat(currentTime)<parseFloat(rows[i].TimeCompleteUnitMoveSpeed)) {
// 					database.query(updateTimeWaitUnitMoveSpeed (TimeCompleteUnitMoveSpeed,currentTime,rows[i]),function(error){
// 						if(!!error){DetailError =('unitInBase: Error updateTimeWaitUnitMoveSpeed '+currentUser.name);functions.writeLogErrror(DetailError);}
// 					});
// 				}
// 				if (((parseFloat(currentTime) >= parseFloat(rows[i].TimeCompleteUnitMoveSpeed))&&(parseFloat(rows[i].TimeCompleteUnitMoveSpeed)>0))){
// 					database.query(updateUnitInBase(rows[i]),function (error,result) {
// 						if(!!error){DetailError =('unitInBase: Error updateUnitInBase '+currentUser.name);functions.writeLogErrror(DetailError);}
// 						if (result.affectedRows>0) {
// 							deleteUnitInBase(currentUser);
// 						}
// 					});
// 				}
// 			}
// 		}
// 	});
// }
// function updateTimeWaitUnitMoveSpeed (TimeCompleteUnitMoveSpeed,currentTime,rows) {
// 	return "UPDATE unitinbase SET TimeWaitUnitMoveSpeed ='"+ (parseFloat(rows.TimeCompleteUnitMoveSpeed)-parseFloat(currentTime))			                					        						                				                						                				                			
// 	+"'WHERE UserName = '"+rows.UserName
// 	+"'AND numberBase = '"+parseFloat(rows.numberBase)		        			
// 	+"'AND UnitType = '"+parseFloat(rows.UnitType)
// 	+"'AND Level = '"+parseFloat(rows.Level)+"'";
// }
// function updateUnitInBase (rows) {
// 	return "UPDATE unitinbase SET Quality = Quality + '"+ (parseFloat(rows.QualityWait))
// 	+" QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 "			                					        						                				                						                				                			
// 	+"'WHERE UserName = '"+rows.UserName
// 	+"'AND numberBase = '"+parseFloat(rows.numberBaseReceive)		        			
// 	+"'AND UnitType = '"+parseFloat(rows.UnitType)
// 	+"'AND Level = '"+parseFloat(rows.Level)+"'";
// }
// function deleteUnitInBase (currentUser) {
// 	database.query("DELETE FROM unitinbase WHERE Quality = 0 AND `UserName` = '"+currentUser.name+"'",function (error) {
// 		if(!!error){DetailError =('login: Error deleteUnitInBase '+currentUser.name);functions.writeLogErrror(DetailError);}
// 	});
// }
// //
// function getcurrentSENDCHECKUNITINBASE(data)
// {
// 	return currentSENDCHECKUNITINBASE =
// 	{
// 		UserName:data.UserName,
// 		numberBase:data.numberBase,
// 		Quality:data.Quality,
// 		Level:data.Level,
// 		UnitType:data.UnitType,
// 	}
// }

// function getcurrent_S_BUY_UNIT(data)
// {
// 	return current_S_BUY_UNIT =
// 	{
// 		UserName:data.UserName,
// 		numberBase:data.numberBase,
// 		UnitType:data.UnitType,
// 		Level:data.Level,
// 		Quality:data.Quality,
// 		Farm:data.Farm,
// 		Wood:data.Wood,
// 		Stone:data.Stone,
// 		Metal:data.Metal,
// 		Diamond:data.Diamond,
// 	}
// }

// function getcurrentBaseComplete(data)
// {
// 	return currentBaseComplete =
// 	{
// 		UserName:data.UserName,
// 		numberBase:data.numberBase,
// 		UnitType:data.UnitType,			
// 	}
// }

var test = fun(8);
console.log('result: '+test);

function fun (num) {
	var result;
	if (num===0||num===1) {
		result = 1;
	}
	else{
		result = fun(num -1)+fun(num-2);

	}	
	return result;
}