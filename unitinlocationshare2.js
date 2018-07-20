'use strict';
var pool = require('./db');
var functions 		= require("./functions");
var client 			= require('./redis');
var lodash		    = require('lodash');

var currentSENDEXCHANGECHECKUNITINLOCATION,UserNameExchange, HealthExchangeLeft, HealthExchangeRight, UnitOrderZero, dataTest,DetailError; 
exports.start = function start (io) {
	io.on('connection', function(socket){
		console.log('empty function');
	});
}
// module.exports = 
// {
// 	start: function(io) 
// 	{
// 		io.on('connection', function(socket) 
// 		{ 
			
// 			socket.on('S_EXCHANGE_UNIT_IN_LOCATION', function (data)
// 			{
// 				currentSENDEXCHANGECHECKUNITINLOCATION = getcurrentSENDEXCHANGECHECKUNITINLOCATION(data);
// 				console.log("========data receive S_EXCHANGE_UNIT_IN_LOCATION: "
// 					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight
// 					+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight);			
// 				pool.getConnection(function(err,connection)
// 				{		
// 					var GameServer = require("./login2");
// 					var gameServer = new GameServer();
// 					exports.gameServer = gameServer;	
// 					//Check số lượng của từng unit
// 					connection.query("SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft							
// 						+"'UNION ALL SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight															
// 						+"'",function(error, rows,field)
// 						{
// 							if (!!error){DetailError = ('unitlocationshare: Error in the query 1');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);
// 						}else
// 						{
// 							if(rows.length > 1)
// 							{							
// 								//Cập nhật tỷ lệ farm trừ khi đánh nhau cho hai unit
// 								if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10)
// 									&&(parseFloat(rows[1].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10)
// 									&&(parseFloat(rows[0].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft, 10)
// 									&&(parseFloat(rows[1].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight, 10))
// 								{
// 			                		//gán giá trị sau khi select
// 			                		UserNameExchange = rows[0].UserName;
// 			                		HealthExchangeLeft = rows[0].HealthEach;
// 			                		HealthExchangeRight = rows[1].HealthEach;
// 			                		socket.emit('R_EXCHANGE_CHECK_UNIT_IN_LOCATION',
// 			                		{
// 			                			checkResource:1,
// 			                		});			                	
// 				                	//kiểm tra xem có số lượng nào bẳng 0 để lấy unit order
// 				                	if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10))===0)
// 				                	{
// 				                		UnitOrderZero = rows[0].UnitOrder;
// 				                	}else
// 				                	{
// 				                		UnitOrderZero = rows[1].UnitOrder;
// 				                	}
// 				                	//kiểm tra unit inlocation còn lại và gửi cho tất cả user khác
// 				                	if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0 &&
// 				                		(parseInt(rows[1].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, 10)) > 0)
// 				                	{							
// 										//gửi cho những user khác cập nhật									
// 										socket.broadcast.emit('R_UNIT_SHARED',
// 										{
// 											idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
// 											Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
// 											idUnitInLocations1: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
// 											Quality1:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
// 										});

// 										//Cập nhật số lại hai id left và right
// 										// 1 - cập nhật id Left	
// 										UpdateUnitShare(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, HealthExchangeLeft,currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft, currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft, gameServer.redisarray);								
										
// 					               		// 2 - cập nhật id Right	
// 					               		UpdateUnitShare(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, HealthExchangeRight,currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight, currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight, gameServer.redisarray);		               												

// 					               	}else if((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0)
// 					               	{
// 					               		socket.broadcast.emit('R_UNIT_SHARED',
// 					               		{
// 					               			idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
// 					               			Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
// 					               		});
// 					               		socket.broadcast.emit('R_UNIT_DELETE',
// 					               		{
// 					               			idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight),
// 					               		});

// 										//Cập nhật số lại id left và del right
// 										UpdateUnitShareAll(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 
// 											currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, HealthExchangeLeft, currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft, 
// 											currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft, currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight, 
// 											UserNameExchange, UnitOrderZero, gameServer.redisarray)													

// 									}else
// 									{
// 										//Cập nhật số lại id right và del left 							
// 										socket.broadcast.emit('R_UNIT_SHARED',
// 										{
// 											idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
// 											Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
// 										});
// 										socket.broadcast.emit('R_UNIT_DELETE',
// 										{
// 											idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft),
// 										});

// 										UpdateUnitShareAll(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, HealthExchangeRight, 
// 											currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight, currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight, currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft, 
// 											UserNameExchange, UnitOrderZero, gameServer.redisarray);					              
// 									}	                	
// 								}else
// 								{								
// 									connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+rows[0].UserName+"'",function(error, rows,field)
// 									{
// 										if (!!error){DetailError = ('unitlocationshare: Error in the query 2');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);
// 									}else
// 									{
// 										connection.release();
// 										DetailError = ('unitlocationshare:Mail Error in the database 4');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);
// 										for (var i = 0; i < rows.length; i++)
// 										{
// 											dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
// 											+parseInt(rows[i].UnitType, 10)+"</td><td>"
// 											+parseInt(rows[i].Quality, 10)+"</td><td>"
// 											+parseInt(rows[i].Level, 10)+"</td><td>"
// 											+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
// 										}									

// 											// setup email data with unicode symbols
// 											let mailOptions = {
// 											    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 											    to: "codergame@demandvi.com", // list of receivers
// 											    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 											    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 											    html:"<html><head><title>HTML Table</title></head>"+
// 											    "<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 											    "<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 											    "<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 											    dataTest+
// 											    "<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
// 											    "<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 											    "<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
// 											    +currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
// 											    +currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
// 											    "<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
// 											    +currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
// 											    +currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
// 											    "</tbody></table></body></html>"
// 											};
// 											// send mail with defined transport object
// 											functions.sendMail(mailOptions);
// 										}
// 									})
// 									console.log("không đủ số lượng linh ngoài thành 295");
// 									socket.emit('R_EXCHANGE_CHECK_UNIT_IN_LOCATION',
// 									{
// 										checkResource:0,
// 									});
// 								}

// 							}else
// 							{							
// 		          				//kiểm tra dữ liệu hiện có của user
// 		          				connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+rows[0].UserName+"'",function(error, rows,field)
// 		          				{
// 		          					if (!!error){DetailError = ('unitlocationshare: Error in the query 3');
// 		          					console.log(DetailError);
// 		          					functions.writeLogErrror(DetailError);
// 		          				}else
// 		          				{
// 		          					DetailError = ('unitlocationshare:Mail Error in the database 5');
// 		          					console.log(DetailError);
// 		          					functions.writeLogErrror(DetailError);	
// 		          					connection.release();
// 		          					for (var i = 0; i < rows.length; i++)
// 		          					{
// 		          						dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
// 		          						+parseInt(rows[i].UnitType, 10)+"</td><td>"
// 		          						+parseInt(rows[i].Quality, 10)+"</td><td>"
// 		          						+parseInt(rows[i].Level, 10)+"</td><td>"
// 		          						+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
// 		          					}

// 										// setup email data with unicode symbols
// 										let mailOptions = {
// 										    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 										    to: "codergame@demandvi.com", // list of receivers
// 										    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 										    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 										    html:"<html><head><title>HTML Table</title></head>"+
// 										    "<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 										    "<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 										    "<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 										    dataTest+
// 										    "<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
// 										    "<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 										    "<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
// 										    +currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
// 										    +currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
// 										    "<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
// 										    +currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
// 										    +currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
// 										    "</tbody></table></body></html>"
// 										};
// 										// send mail with defined transport object
// 										functions.sendMail(mailOptions);
// 									}
// 								})
// 		          				console.log("không đủ số lượng linh ngoài thành 297");
// 		          				socket.emit('R_EXCHANGE_CHECK_UNIT_IN_LOCATION',
// 		          				{
// 		          					checkResource:0,
// 		          				});
// 		          			}
// 		          		}
// 		          	})
// });
// });
// });
// }
// }

function getcurrentSENDEXCHANGECHECKUNITINLOCATION(data)
{
	return currentSENDEXCHANGECHECKUNITINLOCATION =
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
}

function UpdateUnitShare(QualityAfter, QualityMerge, HealthExchange,FarmAfter,idUnitInLocation,redisarray)
{
	var query = pool.query("UPDATE unitinlocations SET Quality = '"+parseFloat(QualityAfter)
		+"',HealthRemain = HealthRemain +'"+(parseFloat(QualityMerge)*parseFloat(HealthExchange))
		+"',FarmPortable ='"+parseFloat(FarmAfter)
		+"'WHERE idUnitInLocations = '"+parseFloat(idUnitInLocation)
		+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('unitlocationshare: Error in the query 4');
			console.log(DetailError);
			functions.writeLogErrror(DetailError);
		}else
		{											
			//check redis
			var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
				+idUnitInLocation+"'",function(error, rows,field)
				{
					if (!!error){DetailError = ('unitlocationshare: Error in the query 5');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);
				}else
				{																															
					client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
					{
						//cập nhật tình trạng ofllie cho unit location
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);														
					}																				        
				}
			})
		}
	})
}

function UpdateUnitShareAll(QualityAfter, QualityMerge, HealthExchange, FarmAfter, idUnitInLocation, idUnitInLocationNull, UserNameExchange, UnitOrderZero, redisarray)
{
	var query = pool.query("UPDATE unitinlocations SET Quality = '"+parseFloat(QualityAfter)
		+"',HealthRemain = HealthRemain +'"+(parseFloat(QualityMerge)*parseFloat(HealthExchange))
		+"' ,FarmPortable ='"+parseFloat(FarmAfter)
		+"' WHERE idUnitInLocations = '"+parseFloat(idUnitInLocation)
		+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('unitlocationshare: Error in the query 6');
			console.log(DetailError);
			functions.writeLogErrror(DetailError);
		}else
		{										
			var query = pool.query("DELETE FROM unitinlocations WHERE idUnitInLocations = '"+idUnitInLocationNull
				+"'",function(error, result, field)
				{
					if(!!error){DetailError = ('unitlocationshare: Error in the query 7');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);
				}
				else			
				{
					if(result.affectedRows > 0)
					{						
						//update lại unit order																					
						var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder - 1  WHERE UserName = '"+UserNameExchange
							+"' AND UnitOrder >'"+UnitOrderZero+"'",function(error, result, field)
							{
								if(!!error){DetailError = ('unitlocationshare: Error in the query 8');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);
							}
							if (result.affectedRows > 0) 
							{
								//check redis
								var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
									+parseFloat(idUnitInLocation)+"'",function(error, rows,field)
									{
										if (!!error){DetailError = ('unitlocationshare: Error in the query 9');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);
									}else
									{																															
										client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
										client.del(idUnitInLocationNull);

										if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
										{
											//cập nhật tình trạng ofllie cho unit location
											redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
											redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																					
										}

										if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(idUnitInLocationNull)).length > 0 ) 
										{																							
											redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(idUnitInLocationNull)), 1);									
										}																				        
									}
								})
							}
						})								
					}
				}
			})										
		}
	})
}