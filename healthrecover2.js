'use strict';
var pool = require('./db');
var functions 		= require("./functions");
var client 			= require('./redis');
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var lodash		    = require('lodash');
var currentSENDHEALTHRECOVER,d,createPositionTimelast,DetailError;

module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('S_HEALTH_RECOVER', function (data)
			{			
				currentSENDHEALTHRECOVER = getcurrentSENDHEALTHRECOVER(data);
				console.log("============S_HEALTH_RECOVER======"+"_"
					+currentSENDHEALTHRECOVER.idUnitInLocations+"_"
					+currentSENDHEALTHRECOVER.HealthRemain+"_"
					+currentSENDHEALTHRECOVER.Farm+"_"
					+currentSENDHEALTHRECOVER.Quality);		 
				pool.getConnection(function(err,connection)
				{		
					connection.query("SELECT HealthRemain,FarmEach,Quality,HealthEach, FarmPortable FROM `unitinlocations` WHERE `idUnitInLocations`='"+currentSENDHEALTHRECOVER.idUnitInLocations+"'",function(error, rows,field)
		        	{
						
						if(!!error){DetailError = ('healthrecover: Error in the query 1');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if(rows.length > 0)
							{							
								 if (parseFloat(currentSENDHEALTHRECOVER.HealthRemain) === (parseFloat(rows[0].Quality)*parseFloat(rows[0].HealthEach))
									&& parseFloat(currentSENDHEALTHRECOVER.Farm) === parseInt(rows[0].FarmPortable,10)-(parseFloat(rows[0].FarmEach)*0.5)
									&& parseFloat(currentSENDHEALTHRECOVER.Quality) === parseFloat(rows[0].Quality)) 
								{								
									//cập nhật HealthRemail và farm của user
									connection.query('UPDATE unitinlocations SET HealthRemain = ?, FarmPortable= ?  WHERE idUnitInLocations = ? ',
										[parseInt(rows[0].Quality*rows[0].HealthEach,10),parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].FarmEach)*0.5),currentSENDHEALTHRECOVER.idUnitInLocations],function(error, result, field)
									{
										if(!!error){DetailError = ('healthrecover: Error in the query 2');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if(result.affectedRows > 0)
											{	
												connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																						+currentSENDHEALTHRECOVER.idUnitInLocations+"'",function(error, rows,field)
												{
													if (!!error){DetailError = ('healthrecover: Error in the query 3');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{	
														//cập nhật máu trong redis																														
														client.set(currentSENDHEALTHRECOVER.idUnitInLocations,JSON.stringify(rows[0]));														

														//cập nhật máu trong mảng redis												
														var GameServer = require("./login2");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;
														if (lodash.filter(gameServer.redisarray, x => x.idUnitInLocations === parseFloat(currentSENDHEALTHRECOVER.idUnitInLocations)).length > 0 )
														{
														 	gameServer.redisarray[gameServer.redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDHEALTHRECOVER.idUnitInLocations))].HealthRemain = parseInt(rows[0].Quality*rows[0].HealthEach,10);																																        
														}
													}
												})																			
					        					io.emit('R_HEALTH_RECOVER',
												{
													CheckRECEIVEHEALTHRECOVER:1,												
							                	});
							                }
										}
									})								
								}
								else
								{
									DetailError = ('healthrecover:mail: Error in the query 4');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
									//gửi mail báo cáo								

									// setup email data with unicode symbols
									let mailOptions = {
									    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
									    to: "codergame@demandvi.com", // list of receivers
									    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
									    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
									    html:"<html><head><title>HTML Table</title></head>"+
										"<body><table border='1' width='100%'><thead><tr><td colspan='4' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
										"<tfoot><tr><td colspan='4' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
										"<tbody><tr bgcolor='#bfbfbf'><td>idUnitInLocations</td><td>HealthRemain</td><td>FarmEach</td><td>Quality</td></tr>"+
										"<tr><td>"+currentSENDHEALTHRECOVER.idUnitInLocations+"</td><td>"+parseFloat(rows[0].Quality*rows[0].HealthRemain)+"</td><td>"
										+parseFloat(rows[0].FarmEach)+"</td><td>"+parseFloat(rows[0].Quality)+"</td></tr>"+
										"<thead><tr><td colspan='4' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
										"<tr bgcolor='#bfbfbf'><td>idUnitInLocations</td><td>HealthRemain</td><td>FarmEach</td><td>Quality</td></tr>"+
										"<tr><td>"+currentSENDHEALTHRECOVER.idUnitInLocations+"</td><td>"+currentSENDHEALTHRECOVER.HealthRemain+"</td><td>"
										+currentSENDHEALTHRECOVER.Farm+"</td><td>"+currentSENDHEALTHRECOVER.Quality+"</td></tr></tbody></table></body></html>"
									};
									// send mail with defined transport object
									functions.sendMail(mailOptions);							
									socket.emit('R_HEALTH_RECOVER',
									{
										CheckRECEIVEHEALTHRECOVER:0,										
				                	});
								}							
			                }
						}
					})			
				});
			});          
        })
    }
}
function getcurrentSENDHEALTHRECOVER(data)
{	return currentSENDHEALTHRECOVER =
		{
			idUnitInLocations:data.idUnitInLocations,
			HealthRemain:data.HealthRemain,
			Farm:data.Farm,
			Quality:data.Quality,
		}
}