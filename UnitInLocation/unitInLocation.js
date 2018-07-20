'use strict';

var lodash		= require('lodash');

var database 			= require('./../Util/db.js');
var redisData 			= require('./../Util/redis');
var functions 			= require('./../Util/functions.js');


// var LevelShare, UnitOrderShare, unitTypeShare, QualityShare, HealthEachShare,	
// FarmEachShare, FarmPortableShare, HealthRemailShare, RootFarm, RemainFarm, dataTest ="", currentSENDUNITINLOCATIONSCOMPLETE;

var DetailError;
var currentTime;
var current_S_CHECK_UNIT_IN_LOCATION;
var current_S_DELOY_UNIT;

exports.getarrayUnitLocationsComplete = function getarrayUnitLocationsComplete (currentUser,arrayUnitLocationsComplete) {
	database.query("SELECT `UserName`, `PositionLogin` as `Position`,`PositionClick`,`idUnitInLocations`,`TimeMoveComplete`,`UnitType`,`Quality`,`Level`,`UnitOrder`,`Health`,`HealthRemain`,`FarmPortable` FROM `unitinlocations` WHERE `UserName`='"+currentUser.name+"'",
		function(error, rows){
			if (!!error){DetailError =('unitInLocation: Error SELECT getarrayUnitLocationsComplete '+currentUser.name);functions.writeLogErrror(DetailError);}
			if (rows.length>0) {arrayUnitLocationsComplete(rows);}else{arrayUnitLocationsComplete(0);}
		});	
}

exports.getarrayAllUnitLocationsComplete = function getarrayAllUnitLocationsComplete (arrayAllUnitLocationsComplete) {
	database.query("SELECT `idUnitInLocations`, `UserName`, `UnitOrder`, `UnitType`, `Quality`, `Health`, `HealthRemain`, `PositionLogin` as `Position`, `Level`, `PositionClick`, `CheckOnline` FROM `unitinlocations`",
		function (error,rows) {
			if (!!error){DetailError =('unitInLocation: Error SELECT getarrayAllUnitLocationsComplete ');functions.writeLogErrror(DetailError);}
			if (rows.length>0) {arrayAllUnitLocationsComplete(rows);}else{arrayAllUnitLocationsComplete(0);}
		});	
}

exports.updateLoginUser = function updateLoginUser (currentUser,currentTime) {
	database.query("SELECT `CheckOnline` FROM `unitinlocations` WHERE `UserName`='"+currentUser.name+"'",function (error,rows) {
		if (!!error){DetailError =('unitInLocation: Error SELECT updateLoginUser '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			database.query('UPDATE unitinlocations SET CheckOnline = 1 WHERE UserName = ?', [currentUser.name],function(error){
				if(!!error){DetailError =('login :Error UPDATE unitinlocations '+currentUser.name);	functions.writeLogErrror(DetailError);}
			});	
		}
	});	
}

exports.start = function start (io) {
	io.on('connection', function(socket){
		S_DELOY_UNIT(socket);
		//S_CHECK_UNIT_IN_LOCATION(socket);
	});	
}
function S_DELOY_UNIT (socket) {
	socket.on('S_DELOY_UNIT', function getClientData (data){
		current_S_DELOY_UNIT = getcurrent_S_DELOY_UNIT(data);
		console.log(current_S_DELOY_UNIT);

		var stringQuery = "SELECT * FROM `unitinbase` WHERE"
		+" `UserName` = '"+current_S_DELOY_UNIT.UserName
		+"' AND `numberBase` = '"+current_S_DELOY_UNIT.numberBase
		+"' AND `Level` = '"+parseFloat(current_S_DELOY_UNIT.Level)
		+"' AND `UnitType` = '"+current_S_DELOY_UNIT.UnitType+"'";
		console.log(stringQuery);
		database.query(stringQuery,function (error,rows) {
			if(!!error){DetailError =('login :Error SELECT unitinlocations '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}
			if (rows.length>0) {
				updateUnitRemain (current_S_DELOY_UNIT);
				SetUpdateUnitLocation (current_S_DELOY_UNIT,socket);
				if (rows[0].Quality == current_S_DELOY_UNIT.Quality) {
					deleteUnitInBase (current_S_DELOY_UNIT);
				}

			}else{
				console.log('Load lai du lieu nguoi dung');
			}

		});
	});
}
function SetUpdateUnitLocation (current_S_DELOY_UNIT,socket){
	var queryString = "SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` where `Level` = '"+parseFloat(current_S_DELOY_UNIT.Level)
	+"'AND `UnitType` = '"+current_S_DELOY_UNIT.UnitType+"'";
	database.query(queryString,function(error, rows){
		if(!!error){DetailError =('login :Error SetUpdateUnitLocation '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}
		updateUnitLocation (rows[0],current_S_DELOY_UNIT,socket);
	});
}
function updateUnitLocation (rows,current_S_DELOY_UNIT,socket) {
	console.log(rows);
	console.log(current_S_DELOY_UNIT);
	var currentTime = Math.floor(new Date().getTime() / 1000);
	var queryString = "INSERT INTO `unitinlocations` (`UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`TimeMoveComplete`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`) "
	+"VALUES ('"+current_S_DELOY_UNIT.UserName+"','"
	+current_S_DELOY_UNIT.UnitType+"','"
	+(parseFloat(rows.Health)*parseFloat(current_S_DELOY_UNIT.Quality))+"','"
	+ parseFloat(rows.Health)+"','"
	+(parseFloat(rows.Health)*parseFloat(current_S_DELOY_UNIT.Quality))+"','"
	+(parseFloat(rows.Damage)*parseFloat(current_S_DELOY_UNIT.Quality))+"','"
	+ parseFloat(rows.Damage)+"','"
	+(parseFloat(rows.Defend)*parseFloat(current_S_DELOY_UNIT.Quality))+"','"
	+ parseFloat(rows.Defend)+"','"
	+ parseFloat(rows.Farm)+"','"
	+current_S_DELOY_UNIT.Farm+"','"
	+current_S_DELOY_UNIT.Position+"','"																	
	+current_S_DELOY_UNIT.Quality+"','"
	+current_S_DELOY_UNIT.Level+"','"
	+current_S_DELOY_UNIT.UnitOrder+"','"
	+current_S_DELOY_UNIT.Position+"','"
	+0+"','"+parseFloat(rows.MoveSpeed)+"','"
	+currentTime+"','"
	+currentTime+"','"
	+0+"','"+1+"','"+1+"','"+0+"','"+0+"')";

	console.log(queryString);
	database.query(queryString,function(error, result){
		if(!!error){DetailError =('login :Error updateUnitLocation '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}
		sendToClient (socket,result.insertId);
	});
}
function sendToClient (socket,insertId) {
	var queryString = "SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+parseFloat(insertId)+"'";
	console.log(queryString);
	database.query(queryString,function(error, rows){
		if(!!error){DetailError =('login :Error updateUnitLocation '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}
		
		R_UNIT_IN_LOCATIONS_COMPLETE(socket,rows);
		R_UNIT_CREATE (socket,rows);
	});
}
function R_UNIT_IN_LOCATIONS_COMPLETE (socket,rows) {
	socket.emit('R_UNIT_IN_LOCATIONS_COMPLETE',
	{
		idUnitInLocations:rows[0],																						
	});
}
function R_UNIT_CREATE (socket,rows) {
	socket.broadcast.emit('R_UNIT_CREATE',
	{
		idUnitInLocations:rows[0],
	});
}
function updateUnitRemain (current_S_DELOY_UNIT) {
	var stringQuery = "UPDATE userbase, unitinbase SET userbase.Farm = userbase.Farm - '"+parseFloat(current_S_DELOY_UNIT.Farm)
	+"', unitinbase.Quality = unitinbase.Quality - '"+parseFloat(current_S_DELOY_UNIT.Quality)
	+"' WHERE userbase.UserName = unitinbase.UserName AND userbase.numberBase = unitinbase.numberBase"
	+" AND unitinbase.UserName = '"+current_S_DELOY_UNIT.UserName
	+"' AND unitinbase.numberBase = '"+parseFloat(current_S_DELOY_UNIT.numberBase)
	+"' AND unitinbase.UnitType = '"+parseFloat(current_S_DELOY_UNIT.UnitType)
	+"' AND Level = '"+parseFloat(current_S_DELOY_UNIT.Level)+"'";
	console.log(stringQuery);
	database.query(stringQuery,function(error, result){
		if(!!error){DetailError =('login :Error Update updateUnitRemain '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}

	});
}
function deleteUnitInBase (current_S_DELOY_UNIT) {
	var stringQuery = "DELETE FROM unitinbase WHERE Quality = 0 AND UserName ='"+current_S_DELOY_UNIT.UserName+"' AND numberBase ='"+current_S_DELOY_UNIT.numberBase+"'";
	console.log(stringQuery);
	database.query(stringQuery,function(error, result){
		if(!!error){DetailError =('login :Error deleteUnitInBase '+current_S_DELOY_UNIT.UserName);functions.writeLogErrror(DetailError);}
	});
}
function getcurrent_S_DELOY_UNIT (data) {
	return current_S_DELOY_UNIT ={
		UserName: data.UserName,
		numberBase: data.numberBase,
		UnitType: data.UnitType,
		Quality: data.Quality,
		Position: data.Position,
		Level: data.Level,
		UnitOrder: data.UnitOrder,
		Farm: data.Farm,
	}
}

function S_CHECK_UNIT_IN_LOCATION (socket) {
	socket.on('S_CHECK_UNIT_IN_LOCATION', function getClientData (data){
		current_S_CHECK_UNIT_IN_LOCATION = getcurrent_S_CHECK_UNIT_IN_LOCATION(data);
		console.log(current_S_CHECK_UNIT_IN_LOCATION);
		if (current_S_CHECK_UNIT_IN_LOCATION.UnitOrder==10) {
			console.log('check Unit Order Max '+ current_S_CHECK_UNIT_IN_LOCATION.UserName);
		}
		database.query("SELECT * FROM `unitinbase`"
			+" WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
			+"' AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
			+"' AND `Level` = '"+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.Level)
			+"' AND `UnitType` = '"+current_S_CHECK_UNIT_IN_LOCATION.UnitType+"'",function(error, rows){
				if (!!error){DetailError = ('unitInLocation: SELECT unitinbase '+current_S_CHECK_UNIT_IN_LOCATION.UserName); functions.writeLogErrror(DetailError);}
				if (rows.length > 0) {

				}else{
					console.log('Hack quality '+current_S_CHECK_UNIT_IN_LOCATION.UserName);
				}

			});
	});
}

function getcurrent_S_CHECK_UNIT_IN_LOCATION(data)
{
	return current_S_CHECK_UNIT_IN_LOCATION =
	{
		idUnitInLocations: data.idUnitInLocations,
		UserName: data.UserName,
		numberBase: data.numberBase,				
		Quality: data.Quality,
		Farm: data.Farm,
		QualityAfterMerge: data.QualityAfterMerge,
		UnitOrder: data.UnitOrder,				
	}
}



// function SendUnitToredisData(socket,insertId)
// {
// 	var query = database.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+parseFloat(insertId)+"'",function(error, rows,field)
// 	{
// 		if (!!error){DetailError = ('unitlocation: Error in the query 19');

// 		functions.writeLogErrror(DetailError);
// 	}else
// 	{
// 		if (rows.length > 0) 
// 		{
// 			socket.emit('R_UNIT_IN_LOCATIONS_COMPLETE',
// 			{
// 				idUnitInLocations:rows[0],																						
// 			});
// 			socket.broadcast.emit('R_UNIT_CREATE',
// 			{
// 				idUnitInLocations:rows[0],
// 			});
// 		}
// 	}
// })
// }

// function InsertRedis(insertId)
// {
// 	var query = database.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"+insertId+"'",function(error, rows,field)
// 	{
// 		if (!!error){DetailError = ('unitlocation: Error in the query 20');

// 		functions.writeLogErrror(DetailError);
// 	}else
// 	{																															        					
// 		redisData.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));																		        
// 	}
// })
// }

// function UpdateQualityNull()
// {
// 	var query = database.query('DELETE FROM unitinbase WHERE Quality = 0',function(error, result, field)
// 	{
// 		if(!!error){DetailError = ('unitlocation: Error in the query 21');

// 		functions.writeLogErrror(DetailError);
// 	}
// })
// }

function UpdateUnitOrder(UserName,UnitOrderShare)
{
	var query = database.query("UPDATE unitinlocations SET UnitOrder = UnitOrder - 1  WHERE UserName = '"+UserName
		+"' AND UnitOrder >'"+UnitOrderShare+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('unitlocation: Error in the query 22');

			functions.writeLogErrror(DetailError);
		}
	})
}

function UpdateFarm(RemainFarm,UserName,numberBase)
{
	var query = database.query("UPDATE userbase SET Farm = '"+parseFloat(RemainFarm)
		+"' WHERE `UserName` = '"+UserName
		+"'AND `numberBase` = '"+numberBase
		+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('unitlocation: Error in the query 23');

			functions.writeLogErrror(DetailError);
		}
	});
}

function UpdateUnitOrderNull(idUnitInLocations,callback)
{
	var query = database.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[idUnitInLocations],function(error, result, field)
	{
		if(!!error){DetailError = ('unitlocation: Error in the query 24');

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

// module.exports = 
// {
//     start: function(io) 
//     {
//         io.on('connection', function(socket) 
//         {

// 			socket.on('S_CHECK_UNIT_IN_LOCATION', function (data)
// 			{
// 				current_S_CHECK_UNIT_IN_LOCATION = getcurrent_S_CHECK_UNIT_IN_LOCATION(data);
// 				console.log("data receive S_CHECK_UNIT_IN_LOCATION:  "+ current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.Quality
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.Farm
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge
// 																	+"_"+current_S_CHECK_UNIT_IN_LOCATION.UnitOrder);		
// 				var GameServer = require("./login2");
// 			    var gameServer = new GameServer();
// 			    exports.gameServer = gameServer;  														
// 				database.getConnection(function(err,connection)
// 				{             
// 					//Check tài khuyên
// 					connection.query("SELECT unitType,Level,UnitOrder,Quality,HealthEach,FarmEach,FarmPortable,HealthRemain FROM `unitinlocations` WHERE `idUnitInLocations` = '"+current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations
// 						+"'AND `Quality` = '"+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.Quality)+"'",function(error, rows,field)
// 			        {
// 						if (!!error){DetailError = ('unitlocation: Error in the query 1');
// 							
//                             functions.writeLogErrror(DetailError);
// 						}else
// 						{
// 							if(rows.length > 0)
// 							{							
// 								//gán giá trị select được
// 								LevelShare = rows[0].Level;
// 								UnitOrderShare = rows[0].UnitOrder;
// 								unitTypeShare = rows[0].unitType;
// 								QualityShare = rows[0].Quality;
// 								HealthEachShare = rows[0].HealthEach;
// 								FarmEachShare = rows[0].FarmEach;
// 								FarmPortableShare = rows[0].FarmPortable;
// 								HealthRemailShare = rows[0].HealthRemain;						

// 								//kiểm tra insert hay update
// 								connection.query("SELECT Quality,idUNBase FROM `unitinbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 									+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 									+"'AND `UnitType` = '"+unitTypeShare
// 									+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
// 						        {
// 						        	if (!!error){DetailError = ('unitlocation: Error in the query 2');
// 						        		
//                                 		functions.writeLogErrror(DetailError);
// 									}else
// 									{								
// 										if (rows.length>0) 
// 										{										
// 											//thực hiện update
// 											//kiểm tra unit đã đầy máu trước khi đưa vào thành
// 											if(parseFloat(HealthRemailShare) === parseFloat(HealthEachShare)*parseFloat(QualityShare))
// 											{
// 												//đầy máu														
// 												//kiểm tra và cập nhật unit in base
// 												//kiểm tra số lượng merge với bảng unitinbase có đúng không?												
// 												if ((parseFloat(rows[0].Quality)+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.Quality)) === parseFloat(current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge)) 
// 												{
// 													//gửi len redisData thong tin cap nhat dung														
// 								                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge)
// 								                			+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
// 													{
// 														if(!!error){DetailError = ('unitlocation: Error in the query 3');
// 															
//                                 							functions.writeLogErrror(DetailError);
// 														}else
// 														{
// 															if (result.affectedRows > 0) 
// 															{																				
// 																//xóa unit in location và cập nhật lại unit order
// 																redisData.del(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations);
// 																if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations)).length > 0 ) 
// 																{																																							
// 																	gameServer.redisarray.splice(gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations)), 1);									
// 																}	

// 																//check redis
// 																//gửi lên redisData thông số id xóa
// 																socket.broadcast.emit('R_UNIT_DELETE',
// 																{
// 																	idUnitInLocations:parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations),
// 											                	});
// 																connection.release();
// 											                	UpdateUnitOrderNull(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations, function(err,data)
// 																{
// 																	if (err) {DetailError = ("ERROR ======: ",err);            
// 																		
//                                 										functions.writeLogErrror(DetailError);
// 																	}else 
// 																	{            
// 																		if (parseFloat(data)===1) 
// 																		{
// 																			//update lại unit order																							
// 																			UpdateUnitOrder(current_S_CHECK_UNIT_IN_LOCATION.UserName,UnitOrderShare);

// 																			connection.query("SELECT idBase,Farm FROM `userbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 																				+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 																				+"'",function(error, rows,field)
// 																	        {
// 																				if (!!error){DetailError = ('unitlocation: Error in the query 4');
// 																					
//                                 													functions.writeLogErrror(DetailError);
// 																				}else
// 																				{
// 																					if(rows.length > 0)
// 																					{																						
// 																						//cập nhật lại farm	
// 																						RootFarm = parseFloat(rows[0].Farm) + FarmPortableShare;
// 																						UpdateFarm(RootFarm,current_S_CHECK_UNIT_IN_LOCATION.UserName,current_S_CHECK_UNIT_IN_LOCATION.numberBase);
// 																					}
// 																				}
// 																			});																			
// 																		}
// 																	}
// 																});
// 															}
// 														}
// 													});
// 												}else
// 												{
// 													//gửi mail
// 													connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName+"'",function(error, rows,field)
// 											        {
// 														if (!!error){DetailError = ('unitlocation: Error in the query 5');
// 															
//                                 							functions.writeLogErrror(DetailError);
// 														}else
// 														{
// 															DetailError = ('unitlocation: Mail Error in the database 1');
// 															
//                                 							functions.writeLogErrror(DetailError);
// 															connection.release();
// 															for (var i = 0; i < rows.length; i++)
// 															{
// 															 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
// 															 		+parseFloat(rows[i].UnitType)+"</td><td>"
// 															 		+parseFloat(rows[i].Quality)+"</td><td>"
// 																	+parseFloat(rows[i].Level)+"</td><td>"
// 																	+parseFloat(rows[i].UnitOrder)+"</td></tr>";
// 															}

// 															// setup email data with unicode symbols
// 															let mailOptions = {
// 															    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 															    to: "codergame@demandvi.com", // list of receivers
// 															    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 															    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 															    html:"<html><head><title>HTML Table</title></head>"+
// 																"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 																"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 																"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 																dataTest+
// 																"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
// 																"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 																"<tr><td>"+current_S_CHECK_UNIT_IN_LOCATION.UserName+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.UnitType+"</td><td>"
// 																+current_S_CHECK_UNIT_IN_LOCATION.Quality+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.Level+"</td><td>"
// 																+current_S_CHECK_UNIT_IN_LOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
// 															};
// 															// send mail with defined transport object
// 															functions.sendMail(mailOptions);
// 														}
// 													})
// 													socket.emit('R_CHECK_UNIT_IN_LOCATION',
// 													{
// 														checkResource:0,
// 			                						});
// 												}												

// 											}else
// 											{											
// 												////không đầy máu												
// 												connection.query("SELECT idBase,Farm FROM `userbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 													+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 													+"'",function(error, rows,field)
// 										        {
// 													if (!!error){DetailError = ('unitlocation: Error in the query 6');
// 														
//                                 						functions.writeLogErrror(DetailError);
// 													}else
// 													{
// 														if(rows.length > 0)
// 														{
// 															RootFarm = parseFloat(rows[0].Farm);
// 															//Tính và cập nhật farm
// 															//Tính farm tiêu tốn	
// 															//kiểm tra unit location có đậy mau																								
// 															//Cập nhật farm trong thành
// 															if (RootFarm + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >= 0) 
// 															{		
// 																//cập nhật và xóa base
// 																// kiểm tra và cập nhật unit in base
// 																connection.query("SELECT Quality,idUNBase FROM `unitinbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 																	+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 																	+"'AND `UnitType` = '"+unitTypeShare
// 																	+"'AND `Level` = '"+LevelShare
// 																	+"'",function(error, rows,field)
// 														        {
// 																	if (!!error){DetailError = ('unitlocation: Error in the query 7');
// 																		
//                                 										functions.writeLogErrror(DetailError);
// 																	}else
// 																	{
// 																		if(rows.length > 0)
// 																		{													
// 																			//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
// 																			if ((parseFloat(rows[0].Quality)+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.Quality)) ===parseFloat(current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge)) 
// 																			{																																			                	
// 															                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge)
// 															                		+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
// 																				{
// 																					if(!!error){DetailError = ('unitlocation: Error in the query 8');
// 																						
//                                 														functions.writeLogErrror(DetailError);
// 																					}else
// 																					{
// 																						if (result.affectedRows > 0) 
// 																						{																									
// 																							//xóa unit in location và cập nhật lại unit order
// 																							redisData.del(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations);
// 																							//check redis
// 																							//gửi lên redisData thông số id xóa
// 																							socket.broadcast.emit('R_UNIT_DELETE',
// 																							{
// 																								idUnitInLocations:parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations),
// 																		                	});
// 																		                	UpdateUnitOrderNull(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations, function(err,data)
// 																							{
// 																								if (err) {DetailError = ("ERROR ======: ",err);            
// 																									
//                                 																	functions.writeLogErrror(DetailError);
// 																								}else 
// 																								{            
// 																									if (parseFloat(data)===1) 
// 																									{
// 																										//update lại unit order																												
// 																										UpdateUnitOrder(current_S_CHECK_UNIT_IN_LOCATION.UserName,UnitOrderShare);	

// 																										//cập nhật farm trong thành															
// 																										RemainFarm = (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)));
// 																										UpdateFarm(RemainFarm,current_S_CHECK_UNIT_IN_LOCATION.UserName,current_S_CHECK_UNIT_IN_LOCATION.numberBase);
// 																										connection.release();
// 																									}
// 																								}
// 																							});																		   
// 																						}
// 																					}
// 																				});
// 																			}else
// 																			{
// 																				//gửi mail
// 																				connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 																					+"'",function(error, rows,field)
// 																		        {
// 																					if (!!error){DetailError = ('unitlocation: Error in the query 9');
// 																						
//                                 														functions.writeLogErrror(DetailError);
// 																					}else
// 																					{
// 																						connection.release();
// 																						DetailError = ('unitlocation: Mail Error in the database 2');
// 																						
//                                 														functions.writeLogErrror(DetailError);
// 																						for (var i = 0; i < rows.length; i++)
// 																						{
// 																						 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
// 																					 		+parseFloat(rows[i].UnitType)+"</td><td>"
// 																					 		+parseFloat(rows[i].Quality)+"</td><td>"
// 																							+parseFloat(rows[i].Level)+"</td><td>"
// 																							+parseFloat(rows[i].UnitOrder)+"</td></tr>";
// 																						}

// 																						// setup email data with unicode symbols
// 																						let mailOptions = {
// 																						    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 																						    to: "codergame@demandvi.com", // list of receivers
// 																						    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 																						    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 																						    html:"<html><head><title>HTML Table</title></head>"+
// 																							"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 																							"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 																							"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 																							dataTest+
// 																							"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
// 																							"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 																							"<tr><td>"+current_S_CHECK_UNIT_IN_LOCATION.UserName+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.UnitType+"</td><td>"
// 																							+current_S_CHECK_UNIT_IN_LOCATION.Quality+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.Level+"</td><td>"
// 																							+current_S_CHECK_UNIT_IN_LOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
// 																						};
// 																						// send mail with defined transport object
// 																						functions.sendMail(mailOptions);
// 																					}
// 																				})
// 																				socket.emit('R_CHECK_UNIT_IN_LOCATION',
// 																				{
// 																					checkResource:0,
// 										                						});
// 																			}
// 																		}
// 																	}
// 																});																												
// 															}									
// 														}										

// 													}
// 												});
// 											}		
// 										}else
// 										{	
// 											//Thực hiện Insert		
// 											console.log("Thực hiện Insert");							
// 											if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
// 											{
// 												//đầy máu																			        																					
// 												//cập nhật farm trong thành	
// 												//cập nhật và xóa base
// 												// kiểm tra và cập nhật unit in base
// 												connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
// 												+current_S_CHECK_UNIT_IN_LOCATION.UserName+"','"+current_S_CHECK_UNIT_IN_LOCATION.numberBase+"','"+unitTypeShare+"','"
// 												+current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
// 												{
// 										            if(!!error){DetailError = ('unitlocation: Error in the query 10');
// 										            	
//                                 						functions.writeLogErrror(DetailError);
// 										            }else
// 										            {
// 										            	//xóa unit in location và cập nhật lại unit order												            	
// 														redisData.del(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations);
// 														//check redis
// 														//gửi lên redisData thông số id xóa
// 														socket.broadcast.emit('R_UNIT_DELETE',
// 														{
// 															idUnitInLocations:parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations),
// 									                	});
// 									                	UpdateUnitOrderNull(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations, function(err,data)
// 														{
// 															if (err) {DetailError = ("ERROR ======: ",err);            
// 																
//                                 								functions.writeLogErrror(DetailError);
// 															}else 
// 															{            
// 																if (parseFloat(data)===1) 
// 																{
// 																	connection.release();
// 																		//update lại unit order																		
// 																	UpdateUnitOrder(current_S_CHECK_UNIT_IN_LOCATION.UserName,UnitOrderShare);

// 																	//update farm																																																		
// 																	connection.query("SELECT idBase,Farm FROM `userbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 																		+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 																		+"'",function(error, rows,field)
// 															        {
// 																		if (!!error){DetailError = ('unitlocation: Error in the query 11');
// 																			
//                                 											functions.writeLogErrror(DetailError);
// 																		}else
// 																		{
// 																			if(rows.length > 0)
// 																			{																						
// 																				//cập nhật lại farm	
// 																				RootFarm = parseFloat(rows[0].Farm) + FarmPortableShare;
// 																				UpdateFarm(RootFarm,current_S_CHECK_UNIT_IN_LOCATION.UserName,current_S_CHECK_UNIT_IN_LOCATION.numberBase);
// 																			}
// 																		}
// 																	});	
// 																}
// 															}
// 														});									    
// 										            }
// 												})										

// 											}else
// 											{											
// 												//không đầy máu
// 												connection.query("SELECT idBase,Farm FROM `userbase` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName
// 													+"'AND `numberBase` = '"+current_S_CHECK_UNIT_IN_LOCATION.numberBase
// 													+"'",function(error, rows,field)
// 										        {
// 													if (!!error){DetailError = ('unitlocation: Error in the query 12');
// 														
//                                 						functions.writeLogErrror(DetailError);
// 													}else
// 													{
// 														if(rows.length > 0)
// 														{
// 															RootFarm = parseFloat(rows[0].Farm);
// 															//Tính và cập nhật farm
// 															//Tính farm tiêu tốn	
// 															//kiểm tra unit location có đậy mau																												
// 															//Cập nhật farm trong thành
// 															if (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
// 															{	
// 																//insert và xóa base
// 																// kiểm tra và cập nhật unit in base
// 																connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
// 																+current_S_CHECK_UNIT_IN_LOCATION.UserName+"','"+current_S_CHECK_UNIT_IN_LOCATION.numberBase+"','"+unitTypeShare+"','"
// 																+current_S_CHECK_UNIT_IN_LOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
// 																{
// 														            if(!!error){DetailError = ('unitlocation: Error in the query 13');
// 														            	
//                                 										functions.writeLogErrror(DetailError);
// 														            }else
// 														            {
// 														            	//xóa unit in location và cập nhật lại unit order																            	
// 																		redisData.del(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations);
// 																		//check redis
// 																		//gửi lên redisData thông số id xóa
// 																		socket.broadcast.emit('R_UNIT_DELETE',
// 																		{
// 																			idUnitInLocations:parseFloat(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations),
// 													                	});
// 													                	UpdateUnitOrderNull(current_S_CHECK_UNIT_IN_LOCATION.idUnitInLocations, function(err,data)
// 																		{
// 																			if (err) {DetailError = ("ERROR ======: ",err);            
// 																				
//                                 												functions.writeLogErrror(DetailError);
// 																			}else 
// 																			{            
// 																				if (parseFloat(data)===1) 
// 																				{
// 																					connection.release();
// 																					//update lại unit order																																									
// 																					UpdateUnitOrder(current_S_CHECK_UNIT_IN_LOCATION.UserName,UnitOrderShare);

// 																					//cập nhật farm trong thành															
// 																					RemainFarm = (parseFloat(RootFarm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)));
// 																					UpdateFarm(RemainFarm,current_S_CHECK_UNIT_IN_LOCATION.UserName,current_S_CHECK_UNIT_IN_LOCATION.numberBase);																				
// 																				}
// 																			}
// 																		});													     
// 														            }
// 																})													

// 															}
// 														}								
// 													}
// 												});
// 											}

// 										}
// 									}
// 						        });									

// 							}else
// 							{            		
// 								connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+current_S_CHECK_UNIT_IN_LOCATION.UserName+"'",function(error, rows,field)
// 						        {
// 									if (!!error){DetailError = ('unitlocation: Error in the query 14');
// 										
//                                 		functions.writeLogErrror(DetailError);
// 									}else
// 									{
// 										DetailError = ('unitlocation: Mail Error in the database 3');	
// 										
//                                 		functions.writeLogErrror(DetailError);	
// 										connection.release();
// 										for (var i = 0; i < rows.length; i++)
// 										{
// 										 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
// 										 		+parseFloat(rows[i].UnitType)+"</td><td>"
// 										 		+parseFloat(rows[i].Quality)+"</td><td>"
// 												+parseFloat(rows[i].Level)+"</td><td>"
// 												+parseFloat(rows[i].UnitOrder)+"</td></tr>";
// 										}

// 										// setup email data with unicode symbols
// 										let mailOptions = {
// 										    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
// 										    to: "codergame@demandvi.com", // list of receivers
// 										    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
// 										    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
// 										    html:"<html><head><title>HTML Table</title></head>"+
// 											"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
// 											"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
// 											"<tbody><tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 											dataTest+
// 											"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
// 											"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
// 											"<tr><td>"+current_S_CHECK_UNIT_IN_LOCATION.UserName+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.UnitType+"</td><td>"
// 											+current_S_CHECK_UNIT_IN_LOCATION.Quality+"</td><td>"+current_S_CHECK_UNIT_IN_LOCATION.Level+"</td><td>"
// 											+current_S_CHECK_UNIT_IN_LOCATION.UnitOrder+"</td></tr></tbody></table></body></html>"
// 										};
// 										// send mail with defined transport object
// 										functions.sendMail(mailOptions);
// 									}
// 								})
// 								socket.emit('R_CHECK_UNIT_IN_LOCATION',
// 								{
// 									checkResource:0,
// 			                	});
// 							}
// 						}
// 					});
// 				});
// 			});

// 			socket.on('S_DELOY_UNIT', function (data)
// 			{
// 				currentSENDUNITINLOCATIONSCOMPLETE = getcurrentSENDUNITINLOCATIONSCOMPLETE(data);
// 				console.log("=====================data receive S_DELOY_UNIT: "
// 						+ currentSENDUNITINLOCATIONSCOMPLETE.UserName
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Quality
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Position
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Level
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder
// 						+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Farm);		 			
// 				database.getConnection(function(err,connection)
// 				{							
// 					//Check số lượng lính trong unit in base
// 					connection.query("SELECT * FROM `unitinbase` WHERE `UserName` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
// 						+"'AND `numberBase` = '"+currentSENDUNITINLOCATIONSCOMPLETE.numberBase
// 						+"'AND `Level` = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)
// 						+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
// 			        {
// 						if (!!error){DetailError = ('unitlocation: Error in the query 15');
// 							
//                             functions.writeLogErrror(DetailError);
// 						}else
// 						{
// 							if(rows.length > 0)					
// 							{	
// 								if(parseFloat(rows[0].Quality)>= parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))
// 								{
// 									//trừ lính trong unitinbase và farm trong userbase
// 									connection.query("UPDATE userbase, unitinbase SET userbase.Farm = userbase.Farm - '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Farm)
// 										+"', unitinbase.Quality = unitinbase.Quality - '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality)
// 										+"' WHERE userbase.UserName = unitinbase.UserName AND userbase.numberBase = unitinbase.numberBase AND unitinbase.UserName = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
// 										+"' AND unitinbase.numberBase = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.numberBase)
// 										+"' AND unitinbase.UnitType = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.UnitType)
// 										+"' AND Level = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)+"'",function(error, result, field)
// 									{
// 										if(!!error){DetailError = ('unitlocation: Error in the query 16');
// 											
//                                 			functions.writeLogErrror(DetailError);
// 										}else
// 										{
// 											if(result.affectedRows>0)
// 											{
// 												connection.query("SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` WHERE `Level` = '"+parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Level)
// 													+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
// 										        {
// 													if (!!error){DetailError = ('unitlocation: Error in the query 17');
// 														
//                                 						functions.writeLogErrror(DetailError);
// 													}else
// 													{
// 														if(rows.length > 0)
// 														{

// 										    				currentTime = Math.floor(new Date.getTime() / 1000);
// 															//insert unit in locations26
// 															connection.query("INSERT INTO `unitinlocations` (`idUnitInLocations`, `UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`TimeMoveComplete`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`, `userFight`,`FightRadius`) VALUES ('"+
// 																""+"','"+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"','"
// 																+(parseFloat(rows[0].Health)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
// 																+parseFloat(rows[0].Health)+"','"
// 																+(parseFloat(rows[0].Health)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
// 																+(parseFloat(rows[0].Damage)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
// 																+parseFloat(rows[0].Damage)+"','"+
// 																+(parseFloat(rows[0].Defend)*parseFloat(currentSENDUNITINLOCATIONSCOMPLETE.Quality))+"','"
// 																+parseFloat(rows[0].Defend)+"','"
// 																+parseFloat(rows[0].Farm)+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.Farm+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"																	
// 																+currentSENDUNITINLOCATIONSCOMPLETE.Quality+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.Level+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder+"','"
// 																+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
// 																+0+"','"+parseFloat(rows[0].MoveSpeed)+"','"
// 																+currentTime+"','"
// 																+currentTime+"','"
// 																+0+"','"+1+"','"+1+"','"+0+"','"+0+"','"+""+"','"+4+"')",function(error, result, field)
// 															{
// 													            if(!!err){DetailError = ('unitlocation: Error in the query 18');
// 													            	
//                                 									functions.writeLogErrror(DetailError);
// 													            }else
// 													            {		
// 													            	connection.release();												            												            													              	
// 																	//Send info of unit to clieny
// 																	SendUnitToredisData(socket,result.insertId)

// 												                	//insert unitlocation to redis
// 												                	InsertRedis(result.insertId);

// 												                	//update quality
// 												                	UpdateQualityNull();															                	
// 													            }
// 															})
// 														}
// 													}
// 												})
// 											}
// 										}
// 									});														
// 								}
// 							}
// 						}
// 					})
// 				});
// 			});
//         });
//     }
// }
