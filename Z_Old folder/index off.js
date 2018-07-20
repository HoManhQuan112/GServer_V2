'use strict';
var express			= require('express');
var app				= express();
var server			= require('http').createServer(app);
//var io 				= require('socket.io').listen(server);
var io 				= require('socket.io')(3000);
var shortId 		= require('shortid');
var mysql           = require("mysql");
var Chance  		= require('chance');
const nodemailer 	= require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var shortId 		= require('shortid');
var cron 			= require('node-cron');
var CronJob 		= require('cron').CronJob;
var sortBy 			= require('sort-by');
var lodash		    = require('lodash');
var Promise 		= require('promise');
var sqrt 			= require( 'math-sqrt' );
var math 			= require('mathjs');
var datetime 		= require('node-datetime');
var crypto 			= require('crypto');
//const spawn 		= require('threads').spawn;
const redis 		= require("redis"),
    client 			= redis.createClient({host: '127.0.0.1', port: 6379,
    flush_strategy (options) 
    {
	    if (options.attempt >= 3) 
	    {
	      // flush all pending commands with this error
	      return new Error('Redis unavailable')
	    }
	    // let the connection come up again on its own
	    return null;
  	},
  	// this strategy handles the reconnect of a failing redis
  	retry_strategy (options) 
  	{
	    if (options.total_retry_time > 1000 * 60 * 60) {
	      // The connection is never going to get up again
	      // kill the client with the error event
	      return new Error('Retry time exhausted');
	    }
    	// attempt reconnect after this delay
    	return Math.min(options.attempt * 100, 3000)
  	}});     

//var redis 			= require('socket.io-redis');
//io.adapter(redis( {host: '127.0.0.1', port: 6379 , auth_pass: "test123" }));
var async 			= require("async");
var threads 		= require('threads');
var spawn   		= threads.spawn;
var thread  		= spawn(function() {});
//-----------------------------------
var pool    =    mysql.createPool({
//var pool    =    mysql.createConnection({
      connectionLimit   :   100,
      host              :   'localhost',
      user              :   'gamevae',
      password          :   'GWgUi2]&]aa',
      database          :   'gamevae',
      debug             :   false,
      charset			: 	'utf8_unicode_ci'

});

//---------------------------------------
app.set('port', process.env.PORT || 3000);
process.setMaxListeners(0);
var clients	= [],redisarray = [];

client.on('ready',function() {
 console.log("Redis is ready");
});

client.on('error',function() {
 console.log("Error in Redis");
});

//client.auth("test123");
client.on("error", function (err) {
    console.log("Error " + err);
});

var lastPosition="",numberDistanceMine,numberDistance,checkResetMine,timeSend=0, hourReset=14,minuteReset = 33,seconReset=0,
timeResetMines = '00 33 14 * * 0-6', timeCreateMines = '00 46 10 * * 0-6', timeSendMinestoClient = '00 47 10 * * 0-6';
var parseN = 10, limitNumber = 200;
var d,createPositionTimelast, arrayFightOffline = [], arrayFightOnlinevsOffline = [], arrayFightOnlinevsOnline = [], arrayAvsB = [];

if (app.get('port') === 3000)
{	
	io.on('connection', function (socket)
	{
		var portIdarray =[3000,4000,5000,6000,7000];
		var portId,numRows,HealthRecover=0,currentUser,currentBaseSend,currentSENDUNITAvsB,currentSENDUNITAoutB,currentSYNCANIMATION,currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove,currentSENDPOSITIONFIGHTONLINEvsOFFLINE,currentSENDPOSITIONFIGHTONLINE,currentSENDPOSITIONFIGHTONLINEoutOFFLINE,currentSENDPOSITIONFIGHTOFFLINEvsONLINE,currentSENDPOSITIONCLICK,UnitOrderZero,currentSENDFIGHTINGUNIT,currentSENDHEALTHRECOVER,currentSENDEXCHANGECHECKUNITINLOCATION,currentSENDCHECKUNITINLOCATION,
		currentSENDCHECKTIMEWAITINBASE,currentSENDCHECKUNITINBASE,currentSENDRECOVERPASSWORD,currentCONFIRMRECOVERPASSWORD,currentSENDUNITINLOCATIONSCOMPLETE,currentBaseComplete,timeLogin,timeLogout,timeRemains,timeRemaincomplete,timeResetMine,idLastPage, checkResetM,UserNameLogin,EmailLogin,PortLogin;
		var userPosition="", newLocation ="",newLocationMine ="",dataTest ="",dataTestExchange ="",idUnitInLocationstemp,unitTypeShare,LevelShare,UnitOrderShare,UserNameExchange,QualityShare,HealthEachShare,FarmEachShare,FarmPortableShare,HealthRemailShare,
		HealthExchangeLeft,HealthExchangeRight,TimeCheckMove;
		var picked ="", pickedMine = "", pickedMineUser = "",EmailSend="", X,Z,timeMoves,APosition,A,A1,A2,BPosition,CPosition,C,C1,C2,B,B1,B2,HealthRemain,F="",FU="",SU="",S="",C=""
		,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,X2,Z2,timeMoves2,APosition2,A2,A12,A22,BPosition2,B2,B12,B22;
		var createPositionTime = 0, idLastBase, timeCompleteClient=0,unitTimeCompleteServer=0,m=0;
		var arrayAllUser = [],arrayAllUserposition = [],arrayAllMinepositionTrue = [],arrayBaseResource = [],arrayUserBaseResource = [],arrayAllPositionclick = [],
		arrayMineposition = [],arrayMineId = [], arrayAllMine = [], arrayAllMineName = [],
		arrayAllMinePosition = [], arrayAllMineMerger = [],arrayidResource =[],arrayBaseUser =[],
		arrayUserName, arrayidCity, arrayUnitType, arrayQuality, arrayQualityunit, arrayLevel,arrayUnitBaseUser =[],arrayUnitWaitBaseUser =[],arrayPositionClickUser =[],arraychecksend =[],
		arrayUserNames=[], arrayidCitys=[], arrayUnitTypes=[], arrayQualitys=[], arrayLevels=[],
		arrayUserNamecomplete=[], arrayidCitycomplete=[], arrayUnitTypecomplete=[], arrayQualitycomplete=[], arrayLevelcomplete=[],
		arrayFarmBase=[], arrayWoodBase=[], arrayStoneBase=[], arrayMetalBase=[], arrayLevelBase=[],
		arrayFarmSpent=[], arrayWoodSpent=[], arrayStoneSpent=[], arrayMetalSpent=[],arrayTimeUnitComplete=[],arrayAllresourcebuyunit =[],arraytest =[],arraycheckUserlg=[],
		arrayUnitLocationsComplete=[],arrayAllUnitLocationsComplete=[],arrayAllUnitLocationsCompletefirst=[],arrayAllPositionchange=[],
		arraycheckUserlg = [],arrayAllCheckTimelg = [];			

		socket.on('USER_CONNECT', function ()
		{
				console.log('Users Connected ');
				console.log('User Online: '+clients.length);
				for (var i = 0; i < clients.length; i++)
				{

						socket.emit('USER_CONNECTED',
						{
							name:clients[i].name,
							id:clients[i].id,
							position:clients[i].position
						});
						console.log('User name '+clients[i].name+' is connected..');

				};
		});

		socket.on('Login', function (data)
		{
			console.log("so luong redis login:"+redisarray.length);
			console.log("User"+data.name+"is connected");
			var s;
			currentUser =
			{
				name:data.name,
				password:data.password,
				id:shortId.generate(),
				position:data.position
			}

			pool.getConnection(function(err,connection)
			{
		        if (err)
		        {
		          return;
		        }
		        connection.query("SELECT * FROM `userbase` where `Position`!='' ORDER BY `CreateTime` DESC LIMIT 1",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						lastPosition=rows[0].Position;
					}
				})
				connection.query("SELECT `Position` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' AND `Position`!=''",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query2');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
							arrayAllUser.push(rows[i]);
							arrayAllUserposition.push(rows[i].Position);
				        }
					}
				})
				connection.query("SELECT * FROM `userasset` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query3');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
	        				arrayAllMinePosition.push(rows[i].Position);
				        }
					}
				})
				connection.query("SELECT * FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' OR `baseCity`!='"+0+"'",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query3');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
	        				arrayBaseResource.push(rows[i]);
				        }
					}
				})


				connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query4');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
	        				arrayAllMinepositionTrue.push(rows[i]);
				        }
					}
				})
				//Đồng bộ giữa redis và my sql
				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query4');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{																	        					
							//update resid															        					
							client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
							//update array memory
							if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
							{
								//cập nhật tình trạng ofllie cho unit location
								redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
							}
				        }       
					}
				})	

				connection.query("SELECT * FROM `resourcebuyunit` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query4');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
	        					arrayAllresourcebuyunit.push(rows[i]);
				        }
					}
				})
				connection.query('UPDATE unitinlocations SET CheckOnline = 1 WHERE UserName = ?', [ currentUser.name],function(error, result, field)
				{
					if(!!error)
					{
						console.log('Error in the querygvh');
					}else
					{
						if (result.affectedRows> 0) {
						//console.log("cập nhật location thanh cong: ");
						}
						else
						{
							console.log('khong co time remain duoc cap nhat 8');
						}
					}
				});
				connection.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 1ghjgh');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
		    				arraycheckUserlg.push(rows[i]);
				        }

					}
				})
				//cập nhật vi trí unit location
				connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the queryjhg23235');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{


							d = new Date();
    						createPositionTimelast = Math.floor(d.getTime() / 1000);
    						APosition = rows[i].Position;
    						A = APosition.split(",");
							A1 = parseFloat(A[0]);
							A2 = parseFloat(A[1]);
							BPosition = rows[i].PositionClick;
							B = BPosition.split(",");
							B1 = parseFloat(B[0]);
							B2 = parseFloat(B[1]);
							//kiểm tra trùng và set lại
							idUnitInLocationstemp = rows[i].idUnitInLocations;

    						if( (parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick)) < parseFloat(rows[i].timeMove) )
    						{
    							X= A1+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B1-A1))/parseFloat(rows[i].timeMove);
    							Z= A2+((parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick))*(B2-A2))/parseFloat(rows[i].timeMove);
    							timeMoves = parseFloat(rows[i].timeMove) - (parseFloat(createPositionTimelast) - parseFloat(rows[i].timeClick));
    						}else
    						{
								X = B1;
								Z = B2;
								timeMoves = 0;
    						}

    						//update vị trị sau cùng và time move
    						connection.query('UPDATE unitinlocations SET Position = ? , timeMove = ?, timeClick = ? WHERE UserName = ? AND UnitOrder = ?', [X+","+Z, timeMoves,parseFloat(createPositionTimelast),rows[i].UserName, rows[i].UnitOrder],function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query11drtr');
								}else
								{
									if (result.affectedRows> 0) {
										//console.log("cập nhật location: "+X+","+Z);
										  //cập nhật unit locations
									}
									else
									{
										console.log('khong co time remain duoc cap nhat 7');
									}

								}
							})

				        }

				        connection.query("SELECT * FROM `unitinlocations` WHERE `timeMove`=0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
						{
							if (!!error) {
								console.log('Error in the queryjhg434');
							}else
							{
								for (var k = 0; k < rows.length; k++)
								{
									arrayAllUnitLocationsCompletefirst.push(rows[k]);
									//console.log(arrayAllUnitLocationsCompletefirst[k].PositionClick);
						        }

						        for (var j = 0; j < arrayAllUnitLocationsCompletefirst.length; j++)
								{
									//console.log((lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length);
									if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)>=2)									
									{
										 for (var M = 0; M <= 36; M++) 
										{
											var arr = arrayAllUnitLocationsCompletefirst[j].PositionClick.split(",");
											var i = 1;
											var K=M;
											if(M > 7 && M < 16)
											{
												i = 2;
												K = M-7;
											}else if(M > 15 && M < 36)
											{
												i = 3;
												K = M-15;
											}
											newLocation =getNewLocationClick(arr[0],arr[1],i,K);
											arrayAllUnitLocationsCompletefirst[j].PositionClick = newLocation;
											//console.log("sl2: "+parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length));
											if (parseFloat((lodash.filter(arraycheckUserlg, x => x.Position === arrayAllUnitLocationsCompletefirst[j].PositionClick)).length+lodash.filter(arrayAllUnitLocationsCompletefirst, x => x.PositionClick === arrayAllUnitLocationsCompletefirst[j].PositionClick).length)<=1)
											{												
												break;
											}
										}
										//arrayAllMineMerger.push(newLocation);
										console.log("vị trí: "+newLocation);
										//cập nhật position mới trung vào data
										connection.query('UPDATE unitinlocations SET Position = ?,PositionClick = ?  WHERE idUnitInLocations = ?', [newLocation, newLocation,arrayAllUnitLocationsCompletefirst[j].idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query11drt');
											}else
											{
												if (result.affectedRows> 0) {
													//console.log("cập nhật location: thanh cong");
												}
												else
												{
													console.log('khong co time remain duoc cap nhat 6');
												}

											}
										})
									}
						        }


							}
						})

						connection.query("SELECT * FROM `unitinlocations` WHERE 1",function(error, rows,field)
						{
							if (!!error) {
								console.log('Error in the queryjhg434');
							}else
							{
								//console.log("GỬI location 1");
								for (var i = 0; i < rows.length; i++)
								{
	                					arrayAllUnitLocationsComplete.push(rows[i]);
						        }
							}
							connection.query("SELECT * FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the queryjhg23234');
								}else
								{
								//console.log("GỬI location 2");
									for (var i = 0; i < rows.length; i++)
									{
			            				arrayUnitLocationsComplete.push(rows[i]);
							        }
							    }
							})
						})

					}
				})
				
	
				// test cap nhat time remain
				connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the queryhjkhjk');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
        					//arrayidResource.push(rows[i].idResource);
        					d = new Date();
			    			createPositionTimelast = Math.floor(d.getTime() / 1000);

        					if((rows[i].timeComplete-createPositionTimelast ) > 0)
        					{
        						timeRemains = rows[i].timeComplete-createPositionTimelast;
        					}else if(createPositionTimelast > rows[i].timeComplete)
        					{
        						timeRemains = 0;
        					}else
        					{
        						timeRemains = 0;
        					}
        					connection.query('UPDATE unitwaitinbase SET timeRemain = ? WHERE idUNBase = ?', [timeRemains, rows[i].idUNBase],function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query11trtrsdt');
								}else
								{
									if (result.affectedRows> 0) {}
									else
									{
										console.log('khong co time remain duoc cap nhat 5');
									}

								}
							})
				        }

				        connection.query("SELECT `UserName`, `idCity`, `UnitType`, `Quality`, `Level` FROM `unitwaitinbase` WHERE `UserName`='"+currentUser.name+"' AND `timeRemain`='"+0+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the query23');
							}else
							{
								for (var i = 0; i < rows.length; i++)
								{

	                				arrayUserNames.push(rows[i].UserName);
	                				arrayidCitys.push(rows[i].idCity);
	                				arrayUnitTypes.push(rows[i].UnitType);
	                				arrayQualitys.push(rows[i].Quality);
	                				arrayLevels.push(rows[i].Level);

	                			}
	                			for (var k = 0; k <arrayLevels.length; k++)
								{
									var index=-1;
									connection.query("SELECT * FROM `unitinbase` WHERE `UserName`='"+arrayUserNames[k]+"' AND`idCity`='"+arrayidCitys[k]
										+"' AND `UnitType`='"+arrayUnitTypes[k]+"' AND `Level`='"+arrayLevels[k]+"'",function(error, rows,field)
									{
										index++;
										if (!!error)
										{
											console.log('Error in the query12');
										}else
										{
											if (rows.length >0)
											{
												//cap nhật
												connection.query('UPDATE unitinbase SET Quality = ? WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
														[(rows[0].Quality+arrayQualitys[index]),arrayUserNames[index],arrayidCitys[index],arrayUnitTypes[index],arrayLevels[index]],function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query11dgd');
													}else
													{
														if(!!result)
														{
															connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
															[arrayUserNames[index],arrayidCitys[index],arrayUnitTypes[index],arrayLevels[index]],function(error, result, field)
														  	{
																if(!!error)
																{
																	console.log('Error in the queryfgfg44');
																}else
																{
																	if(result)
																	{
																		console.log('Delete sau khi update thanh cong');

																	}else
																	{
																		console.log('khong co gi update');
																	}
																}
															})

														}else{
															console.log('Cập nhật unit wait in base thành công');
														}


													}
												})

											}
											else
											{
												//insert
												connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`idCity`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
												+arrayUserNames[index]+"','"+arrayidCitys[index]+"','"+arrayUnitTypes[index]+"','"+arrayQualitys[index]+"','"
												+arrayLevels[index]+"')",function(error, result, field)
												{
										            if(!!err)
										            {
										            	console.log('Error in the query34');
										            }else
										            {
										            	connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
														[arrayUserNames[index],arrayidCitys[index],arrayUnitTypes[index],arrayLevels[index]],function(error, result, field)
													  	{
															if(!!error)
															{
																console.log('Error in the queryfgfg55676');
															}else
															{
																if(result)
																{
																	console.log('Delete sau khi insert thanh cong');

																}else
																{
																	console.log('khong co gi update');
																}
															}
														})
										            }
												})
											}
											//delete dong cập nhật
										}
									})
								}
							}
						})
					}
				})
		        connection.query("SELECT * FROM `users` WHERE `UserName`='"+currentUser.name+"' AND `UserPass`='"+currentUser.password+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query5');
					}else
					{
						numRows = rows.length;
						if (numRows>0)
						{
							UserNameLogin = rows[0].UserName;
							EmailLogin =  rows[0].UserEmail;
							PortLogin = rows[0].Port;
							var today = new Date();

							//thời gian mỗi ngày reset
							var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hourReset, minuteReset, seconReset);
							var resetMine = Math.floor(myToday.getTime() / 1000);

							//thời gian mỗi ngày reset công thêm 1 ngày
							var myTodaynext = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, hourReset, minuteReset, seconReset);
							var resetMineNext = Math.floor(myTodaynext.getTime() / 1000);

							//thời gian hiện tại
							var timeNow = Math.floor(today.getTime() / 1000);

							if(timeNow < resetMine)
							{
								timeSend = resetMine - timeNow;
							}else
							{
								timeSend = resetMineNext - timeNow;
							}


							//kiem tra trong bảng page user đã tạo chưa
							connection.query("SELECT `Position`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`,`baseCity` FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
					        {
								if (!!error)
								{
									console.log('Error in the query6');
								}else
								{
									//đã tồn tại page cho user dn lần đầu						
	
									if (rows.length>0){
										for (var i = 0; i < rows.length; i++) 
										{
		                					arrayBaseUser.push(rows[i]);
							        	}
										//load không phải tạo page
										d = new Date();
						    			createPositionTimelast = Math.floor(d.getTime() / 1000);
										connection.query('UPDATE users SET timeLogin = ?,timeLogout =?,timeResetMine = ? WHERE UserName = ?', [createPositionTimelast,"",createPositionTimelast, currentUser.name],function(error, result, field)
										{
										//connection.release();
											if(!!error)
											{
												console.log('Error in the query7');
											}else
											{
												if(result)
												{
													//update checkResetMine for page

													connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query1q34q2341');
														}else
														{
															//console.log("cong dong update45srtgdt======================: "+result.affectedRows);
															if(result)
															{
																connection.query("SELECT  `idCity`, `UnitType`, `Quality`, `Level` FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the queryfgfg55');
																	}else
																	{
																		for (var i = 0; i < rows.length; i++) 
																		{
											                				arrayUnitBaseUser.push(rows[i]);
																        }
																        connection.query("SELECT  `idCity`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='"+0+"' AND `UserName` ='"+currentUser.name+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the queryghj');
																			}else
																			{

																				for (var i = 0; i < rows.length; i++) {
													                				arrayUnitWaitBaseUser.push(rows[i]);
																		        }
																		        //cập nhật online cho redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query4');
																					}else
																					{
																						for (var i = 0; i < rows.length; i++)
																						{		
																							//update resid															        					
																        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																        					//update array memory
																        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																							{
																								//cập nhật tình trạng ofllie cho unit location
																								redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																							}
																				        }
																				        socket.emit('loginSuccess',
																						{
																	                    	message : '1',
																	                    	name : UserNameLogin,
																	                    	UserEmail : EmailLogin,
																	                    	Port : PortLogin,
																	                    	getAllUser: arrayAllUser,
																	                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																	                    	getBaseResource: arrayBaseResource,
																	                    	getBaseUser: arrayBaseUser,
																	                    	getUnitBaseUser: arrayUnitBaseUser,
																	                    	getUnitWaitBaseUser: arrayUnitWaitBaseUser,
																	                    	getUnitLocationsComplete: arrayUnitLocationsComplete,
																	                    	getTimeResetserver: timeSend,
																	                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																	                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																	                	});
																					}
																				})	

																				
																			}
																		})
																	}

																})

															}else
															{
																console.log('cap nhat that bai');
															}
														}
													});


												}else
												{
													console.log('cap nhat that bai');
												}
											}
										});
									}else
									{
										//tạo page mới cho user dn lần đầu
										d = new Date();
						    			createPositionTimelast = Math.floor(d.getTime() / 1000);
										var arr = lastPosition.split(",");
										var lastLocationjson = arr[0]+","+arr[1];
										var i = getRandomIntInclusive(1,8), M=0;
										arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
										newLocation =getNewLocation(arr[0],arr[1],i,M);
										while(arrayAllMineMerger.indexOf(newLocation)>=1)
										{
											i = getRandomIntInclusive(1,8);
											newLocation =getNewLocation(arr[0],arr[1],i,M);
										}
										arrayAllMineMerger.push(newLocation);

										//insert page, soldier and resource
										connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `Position`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `baseCity`,`sizeUnitInBase`, `checkResetMine`) VALUES ('"
											+""+"','"+UserNameLogin+"','"+newLocation+"','"+1+"','"+10000+"','"+10000+"','"+10000+"','"+10000+"','"+createPositionTimelast+"','"+0+"','"+0+"','"+1+"')",function(error, result, field)
										{
								            if(!!err) {
								            	console.log('insert thất bại');
								            }else
								            {
								            	idLastBase = result.insertId;
										        connection.query('UPDATE users SET timeLogin = ?,timeLogout =?,timeResetMine = ? WHERE UserName = ?', [createPositionTimelast,"",createPositionTimelast, currentUser.name],function(error, result, field)
												{
												//connection.release();
													if(!!error)
													{
														console.log('Error in the query7');
													}else
													{
														if(result)
														{
															//update checkResetMine for page
															connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query11saer3q');
																}else
																{
																	console.log("cong dong updaterdst45======================: "+result.affectedRows);
																	if(result)
																	{
																		connection.query("SELECT `Position`, `Level`, `Farm`, `Wood`, `Stone`, `Metal`,`baseCity` FROM `userbase` WHERE `idBase` ='"+idLastBase+"'",function(error, rows,field)
																		{
																			if (!!error)
																			{
																				console.log('Error in the querybgh');
																			}else{
																				console.log("GỬI location3");
																				//cập nhật online cho redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query4');
																					}else
																					{
																						for (var i = 0; i < rows.length; i++)
																						{		
																							//update resid															        					
																        					client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));
																        					//update array memory
																        					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
																							{
																								//cập nhật tình trạng ofllie cho unit location
																								redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "1";														
																							}
																				        }
																				        socket.emit('loginSuccess',
																						{
																	                    	message : '1',
																	                    	name : UserNameLogin,
																	                    	UserEmail : EmailLogin,
																	                    	Port : PortLogin,
																	                    	getAllUser: arrayAllUser,
																	                    	getAllMinePositionOfUser: arrayAllMinepositionTrue,
																	                    	getBaseResource: arrayBaseResource,
																	                    	getBaseUser: rows[0],
																	                    	getUnitBaseUser: '0',
																	                    	getUnitWaitBaseUser: '0',
																	                    	getUnitLocationsComplete: '0',
																	                    	getTimeResetserver: timeSend,
																	                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
																	                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
																	                	});
																					}
																				})	
																				
																			}
																		})
																	}else
																	{
																		console.log('cap nhat that bai');
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
								        });

									}

								}
							});

							d = new Date();
				    		createPositionTimelast = Math.floor(d.getTime() / 1000);
							cron.schedule('*/1 * * * * *', function()
							{
					 	 		//check reset server of user
					 	 		var arrayAllMinepositionupdate = [];
				 	 			connection.query("SELECT `checkResetMine` FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
								{
									if (!!error) {
										console.log('Error in the query9');
									}else
									{
										if (rows[0].checkResetMine === 1)
										{
											connection.query("SELECT Position,idMine FROM `userasset` WHERE 1",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query10');
												}else
												{
													for (var i = 0; i < rows.length; i++)
													{
								        				arrayAllMinepositionupdate.push(rows[i]);
											        }
													socket.emit('loginUnsuccessMine',
													{
							                    		getAllIDMineOfUser: arrayAllMinepositionupdate,
							                    		gettimeSendRepeat : 86400,
							                		});
							                		connection.query('UPDATE userbase SET checkResetMine = ? WHERE UserName = ?', [0, currentUser.name],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query11as4q3w4');
														}else
														{
															console.log("cong dong updatefgyh5e6======================: "+result.affectedRows);
															if(result)
															{
																console.log('cap nhat tinh trang reset server cho user thanh cong');
															}else
															{
																console.log('cap nhat that bai');
															}
														}
													});

												}
											})
										}else{
											//console.log("server chưa reset clearMine");
											//console.log(new Date().toString());
										}

									}
								})

							});					
						}else
						{
						console.log("GỬI location 4");
							socket.emit('loginSuccess',
							{
		                    	message : '0',
		                    	name : '0',
		                    	UserEmail : '0',
		                    	Port : '0',
		                    	getAllUser : '0',
		                    	getAllMineOfUser : '0',
		                    	getBaseResource: '0',
		                    	getBaseUser : '0',
		                    	getUnitBaseUser: '0',
		                    	getUnitWaitBaseUser: '0',
		                    	getUnitLocationsComplete: '0',
		                    	getTimeResetserver: timeSend,
		                    	getarrayAllUnitLocationsComplete: arrayAllUnitLocationsComplete,
		                    	getarrayAllresourcebuyunit: arrayAllresourcebuyunit,
		                	});
						}
					}
				})
		    });
		    clients.push(currentUser);
			socket.emit('Login',currentUser );
			//socket.emit('USER_CONNECTED',currentUser );
			socket.broadcast.emit('USER_CONNECTED',currentUser);

		});
		socket.on('SENDCHECKTIMEWAITINBASE', function (data)
		{
			currentSENDCHECKTIMEWAITINBASE =
			{
				UserName:data.UserName,
				idCity:data.idCity,
				Farm:data.Farm,
				Wood:data.Wood,
				Stone:data.Stone,
				Metal:data.Metal,
			}
			pool.getConnection(function(err,connection)
			{
      			connection.query("SELECT `UserEmail` FROM `users` where `UserName` = '"+currentSENDCHECKTIMEWAITINBASE.UserName+"'",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 0)
						{
							EmailSend = "codergame@demandvi.com";
						}else
						{
							console.log("Không tìm thấy địa chỉ email");
						}
					}
				})
				//Check tài khuyên
				connection.query("SELECT * FROM `userbase` where `UserName` = '"+currentSENDCHECKTIMEWAITINBASE.UserName+"'AND `baseCity` = '"+currentSENDCHECKTIMEWAITINBASE.idCity+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 0)
						{

							if((parseInt(rows[0].Farm, parseN) === parseInt(currentSENDCHECKTIMEWAITINBASE.Farm, parseN)) && (parseInt(rows[0].Wood, parseN) === parseInt(currentSENDCHECKTIMEWAITINBASE.Wood, parseN))
								&& (parseInt(rows[0].Stone, parseN) === parseInt(currentSENDCHECKTIMEWAITINBASE.Stone, parseN)) && (parseInt(rows[0].Metal, parseN) === parseInt(currentSENDCHECKTIMEWAITINBASE.Metal, parseN)))
							{
								rows = [];
								socket.emit('RECEIVECHECKTIMEWAITINBASE',
								{
									checkResource:1,
			                	});
							}else
							{

								let transporter = nodemailer.createTransport({
								    service: 'gmail',
								    auth: {
								        user: 'aloevera.hoang@gmail.com',
								        pass: '123456@A'
								    }
								});

								// setup email data with unicode symbols
								let mailOptions = {
								    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
								    to: EmailSend, // list of receivers
								    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
								    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
								    html:"<html><head><title>HTML Table</title></head>"+
									"<body><table border='1' width='100%'><thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
									"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
									"<tbody><tr bgcolor='#bfbfbf'><td>Tên</td><td>idCity</td><td>Farm</td><td>Wood</td><td>Stone</td><td>Metal</td></tr>"+
									"<tr><td>"+currentSENDCHECKTIMEWAITINBASE.UserName+"</td><td>"+currentSENDCHECKTIMEWAITINBASE.idCity+"</td><td>"
									+parseInt(rows[0].Farm, parseN)+"</td><td>"+parseInt(rows[0].Wood, parseN)+"</td><td>"
									+parseInt(rows[0].Stone, parseN)+"</td><td>"+parseInt(rows[0].Metal, parseN)+"</td></tr>"+
									"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
									"<tr bgcolor='#bfbfbf'><td>Tên</td><td>idCity</td><td>Farm</td><td>Wood</td><td>Stone</td><td>Metal</td></tr>"+
									"<tr><td>"+currentSENDCHECKTIMEWAITINBASE.UserName+"</td><td>"+currentSENDCHECKTIMEWAITINBASE.idCity+"</td><td>"
									+currentSENDCHECKTIMEWAITINBASE.Farm+"</td><td>"+currentSENDCHECKTIMEWAITINBASE.Wood+"</td><td>"
									+currentSENDCHECKTIMEWAITINBASE.Stone+"</td><td>"+currentSENDCHECKTIMEWAITINBASE.Metal+"</td></tr></tbody></table></body></html>"
								};
								// send mail with defined transport object
								transporter.sendMail(mailOptions, (error, info) => {
								    if (error) {
								        return console.log(error);
								    }
								    console.log('Message %s sent: %s', info.messageId, info.response);
								});
								rows = [];
								socket.emit('RECEIVECHECKTIMEWAITINBASE',
								{
									checkResource:0,
			                	});
							}

						}else
						{
							console.log("lỗi select");
						}

					}
				})


			});

			socket.emit('CHECKSENDTIMEWAITINBASE',currentSENDCHECKTIMEWAITINBASE);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDCHECKTIMEWAITINBASE);
		});

		socket.on('SENDCHECKUNITINBASE', function (data)
		{
			console.log("RUN");
			currentSENDCHECKUNITINBASE =
			{
				UserName:data.UserName,
				idCity:data.idCity,
				Quality:data.Quality,
				Level:data.Level,
				UnitType:data.UnitType,
			}
			console.log(currentSENDCHECKUNITINBASE.UserName+"_"+currentSENDCHECKUNITINBASE.idCity
				+"_"+currentSENDCHECKUNITINBASE.Quality+"_"+currentSENDCHECKUNITINBASE.Level+"_"+currentSENDCHECKUNITINBASE.UnitType);
			pool.getConnection(function(err,connection)
			{
	      		connection.query("SELECT `UserEmail` FROM `users` where `UserName` = '"+currentSENDCHECKUNITINBASE.UserName+"'",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 0)
						{
							EmailSend = "codergame@demandvi.com";
						}else
						{
							console.log("Không tìm thấy địa chỉ email");
						}
					}
				})
				//Check tài khuyên
				connection.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINBASE.UserName+"'AND `idCity` = '"+currentSENDCHECKUNITINBASE.idCity
					+"'AND `Level` = '"+parseInt(currentSENDCHECKUNITINBASE.Level, parseN)+"'AND `UnitType` = '"+currentSENDCHECKUNITINBASE.UnitType+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 0)
						{

							if((parseInt(rows[0].Quality, parseN) === parseInt(currentSENDCHECKUNITINBASE.Quality, parseN)))
							{
								socket.emit('RECEIVECHECKUNITINBASE',
								{
									checkResource:1,
			                	});
							}else
							{

								let transporter = nodemailer.createTransport({
								    service: 'gmail',
								    auth: {
								        user: 'aloevera.hoang@gmail.com',
								        pass: '123456@A'
								    }
								});

								// setup email data with unicode symbols
								let mailOptions = {
								    from: '"Game VAE" <gameVae@demandvi.com>', // sender address
								    to: EmailSend, // list of receivers
								    subject: 'Thông báo tài khoản không đồng bộ với máy chủ ✕ ', // Subject line
								    text: 'Đồng bộ tài khoản của bạn với máy chủ thất bại! ', // plain text body
								    html:"<html><head><title>HTML Table</title></head>"+
									"<body><table border='1' width='100%'><thead><tr><td colspan='5' bgcolor='#b3ccff'><b>Dữ liệu bạn hiện tại bạn đang có:</b></td></tr></thead>"+
									"<tfoot><tr><td colspan='6' bgcolor='#b3ccff'><font color='red'>Vui lòng đăng nhập lại để đồng bộ dữ liệu</font></td></tr></tfoot>"+
									"<tbody><tr bgcolor='#bfbfbf'><td>Tên</td><td>idCity</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
									"<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+parseInt(rows[0].idCity, parseN)+"</td><td>"
									+parseInt(rows[0].Quality, parseN)+"</td><td>"+parseInt(rows[0].Level, parseN)+"</td><td>"
									+parseInt(rows[0].UnitType, parseN)+"</td></tr>"+
									"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu hiện tại không đồng bộ:</b></td></tr></thead>"+
									"<tr bgcolor='#bfbfbf'><td>Tên</td><td>idCity</td><td>Quality</td><td>Level</td><td>UnitType</td></tr>"+
									"<tr><td>"+currentSENDCHECKUNITINBASE.UserName+"</td><td>"+currentSENDCHECKUNITINBASE.idCity+"</td><td>"
									+currentSENDCHECKUNITINBASE.Quality+"</td><td>"+currentSENDCHECKUNITINBASE.Level+"</td><td>"
									+currentSENDCHECKUNITINBASE.UnitType+"</td></tr></tbody></table></body></html>"
								};
								// send mail with defined transport object
								transporter.sendMail(mailOptions, (error, info) => {
								    if (error) {
								        return console.log(error);
								    }
								    console.log('Message %s sent: %s', info.messageId, info.response);
								});
								socket.emit('RECEIVECHECKUNITINBASE',
								{
									checkResource:0,
			                	});
							}

						}else
						{
							console.log("lỗi select");
						}

					}
				})


			});

			socket.emit('SENDCHECKUNITINBASE',currentSENDCHECKUNITINBASE );
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDCHECKUNITINBASE);
		});

		socket.on('SENDTIMEWAITINBASE', function (data)
		{
			currentBaseSend =
			{
				UserName:data.UserName,
				idCity:data.idCity,
				UnitType:data.UnitType,
				Quality:data.Quality,

			}
			pool.getConnection(function(err,connection)
			{
				//Check tài khuyên và level của base
				connection.query("SELECT * FROM `userbase` where `UserName` = '"+currentBaseSend.UserName+"'AND `baseCity` = '"+currentBaseSend.idCity+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 0)
						{
							arrayFarmBase.push(rows[0].Farm);
            				arrayWoodBase.push(rows[0].Wood);
            				arrayStoneBase.push(rows[0].Stone);
            				arrayMetalBase.push(rows[0].Metal);
            				arrayLevelBase.push(rows[0].Level);
            					//kiem tra và tính toán tài nguyên tiêu hao
							connection.query("SELECT * FROM `resourcebuyunit` where `UnitType` = '"+currentBaseSend.UnitType+"'AND `Level` = '"+arrayLevelBase[0]+"'",function(error, rows,field)
					        {
								if (!!error)
								{
									console.log('Error in the query1');
								}else
								{
									if(rows.length > 0)
									{
										arrayFarmSpent.push(rows[0].Farm);
										arrayWoodSpent.push(rows[0].Wood)
										arrayStoneSpent.push(rows[0].Stone);
										arrayMetalSpent.push(rows[0].Metal);
										arrayTimeUnitComplete.push(rows[0].timeRemain);
										arrayFarmSpent[0] = parseInt(arrayFarmSpent[0],10)*parseInt(currentBaseSend.Quality,10);
			            				arrayWoodSpent[0] = parseInt(arrayWoodSpent[0],10)*parseInt(currentBaseSend.Quality,10);
			            				arrayStoneSpent[0] = parseInt(arrayStoneSpent[0],10)*parseInt(currentBaseSend.Quality,10);
			            				arrayMetalSpent[0] = parseInt(arrayMetalSpent[0],10)*parseInt(currentBaseSend.Quality,10);
			            				//console.log("tai nguyen bi tru"+arrayFarmSpent[0]+"_"+arrayWoodSpent[0]+"_"+arrayStoneSpent[0]+"_"+arrayMetalSpent[0]);
			            				if ((parseInt(arrayFarmSpent[0],10)<=parseInt(arrayFarmBase[0],10))&&(parseInt(arrayWoodSpent[0],10)<=parseInt(arrayWoodBase[0],10))&&
			            					(parseInt(arrayStoneSpent[0],10)<=parseInt(arrayStoneBase[0],10))&&(parseInt(arrayMetalSpent[0],10)<=parseInt(arrayMetalBase[0],10)))
			            				{

											//update tài nguyên base
											console.log("update SENDTIMEWAITINBASE");
											connection.query('UPDATE userbase SET  Farm = ?, Wood = ?, Stone = ?, Metal =? WHERE UserName = ? AND baseCity = ?',
												[(parseInt(arrayFarmBase[0],10)-parseInt(arrayFarmSpent[0],10)),(parseInt(arrayWoodBase[0],10)-parseInt(arrayWoodSpent[0],10)),
												(parseInt(arrayStoneBase[0],10)-parseInt(arrayStoneSpent[0],10)),(parseInt(arrayMetalBase[0],10)-parseInt(arrayMetalSpent[0],10)),
													currentBaseSend.UserName,currentBaseSend.idCity],function(error, result, field)
											{
											//console.log("tai nguyen bi tru 2"+arrayFarmSpent[0]+"_"+arrayWoodSpent[0]+"_"+arrayStoneSpent[0]+"_"+arrayMetalSpent[0]);
												if(!!error)
												{
													console.log('Error in the queryasqq11');
												}else
												{
													console.log("cong dong update343q4aer======================: "+result.affectedRows);
													if(result)
													{
														//console.log("tai nguyen bi tru 3"+arrayFarmSpent[0]+"_"+arrayWoodSpent[0]+"_"+arrayStoneSpent[0]+"_"+arrayMetalSpent[0]);
														//insert unit wait in base
														d = new Date();
													    createPositionTimelast = Math.floor(d.getTime() / 1000);
														//timeCompleteClient =  parseInt(createPositionTimelast, 10) +  parseInt(currentBaseSend.timeComplete, 10);
														unitTimeCompleteServer 	= parseInt(createPositionTimelast, 10) +  (parseInt(arrayTimeUnitComplete[0], 10)*currentBaseSend.Quality);
														connection.query("INSERT INTO `unitwaitinbase` (`idUNBase`, `UserName`, `idCity`, `UnitType`, `Quality`, `Level`, `timeComplete`, `timeRemain`) VALUES ('"+""+"','"
															+currentBaseSend.UserName+"','"+currentBaseSend.idCity+"','"+currentBaseSend.UnitType+"','"+currentBaseSend.Quality+"','"+arrayLevelBase[0]+"','"
															+unitTimeCompleteServer+"','"+(parseInt(arrayTimeUnitComplete[0], 10)*currentBaseSend.Quality)+"')",function(error, result, field)
														{
													            connection.release();
													            if(!!err)
													            {
													            	console.log('Insert unit wait in base thất bại');
													            }else
													            {
													            	if (result)
													            	{
																		arrayFarmSpent=[];
																		arrayWoodSpent =[];
																		arrayStoneSpent = [];
																		arrayMetalSpent = [];
																		arrayFarmBase=[];
																		arrayWoodBase =[];
																		arrayStoneBase = [];
																		arrayMetalBase = [];
																		arrayTimeUnitComplete = [];
													            	}else
													            	{
													            		console.log('Insert unit wait in base khong thành công');
													            	}
																}

															});


													}else
													{
														console.log('cap nhat that bai');
													}
												}
											});

											socket.emit('RECEIVETIMEWAITINBASE',
											{
												checkResource:1,
						                	});
			            				}else
			            				{
			            					arrayFarmSpent=[];
											arrayWoodSpent =[];
											arrayStoneSpent = [];
											arrayMetalSpent = [];
											arrayFarmBase=[];
											arrayWoodBase =[];
											arrayStoneBase = [];
											arrayMetalBase = [];
											socket.emit('RECEIVETIMEWAITINBASE',
											{
												checkResource:0,
						                	});

			            				}

									}else
									{
										console.log("lỗi select 2");
									}

								}
							})

						}else
						{
							console.log("lỗi select1 ");
						}

					}
				})


			});

			socket.emit('SENDTIMEWAITINBASE',currentBaseSend );
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentBaseSend);
		});

		socket.on('SENDUNITINLOCATIONSCOMPLETE', function (data)
		{
			currentSENDUNITINLOCATIONSCOMPLETE =
			{
				UserName:data.UserName,
				idCity:data.idCity,
				UnitType:data.UnitType,
				Quality:data.Quality,
				Position:data.Position,
				Level:data.Level,
				UnitOrder:data.UnitOrder,
        		Farm:data.Farm,
			}
				console.log("dua unit ra thanh: "+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"_"+currentSENDUNITINLOCATIONSCOMPLETE.idCity
				+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Quality+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Level+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType
				+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Position+"_"+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Farm);
			pool.getConnection(function(err,connection)
			{

				//Check số lượng lính trong unit in base
				connection.query("SELECT * FROM `unitinbase` where `UserName` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UserName
					+"'AND `idCity` = '"+currentSENDUNITINLOCATIONSCOMPLETE.idCity
					+"'AND `Level` = '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Level, 10)
					+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{

						if(rows.length > 0)
						{
							if(parseInt(rows[0].Quality, 10)>= parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality, 10))
							{

								//trừ lính trong unit in base và farm trong userbase
								console.log("tru farm: " +currentSENDUNITINLOCATIONSCOMPLETE.UserName+"_"+currentSENDUNITINLOCATIONSCOMPLETE.idCity+"_"+currentSENDUNITINLOCATIONSCOMPLETE.Farm);
								connection.query("UPDATE userbase SET Farm = Farm -'"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Farm, 10)+"' WHERE UserName = '"
									+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"' AND baseCity = '"+currentSENDUNITINLOCATIONSCOMPLETE.idCity+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query1123');
									}else
									{
										console.log("cong dong updatedtr4t5======================: "+result.affectedRows);
										if(result.affectedRows>0)
										{
											connection.query("UPDATE unitinbase SET Quality = Quality - '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality, 10)
														+"' WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?",
											[currentSENDUNITINLOCATIONSCOMPLETE.UserName,currentSENDUNITINLOCATIONSCOMPLETE.idCity, currentSENDUNITINLOCATIONSCOMPLETE.UnitType, 
													currentSENDUNITINLOCATIONSCOMPLETE.Level],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query1124');
												}else
												{
													console.log("so song update: "+result.affectedRows);
													if(result.affectedRows>0)
													{
														connection.query("SELECT `Health`, `Damage`, `Defend`,`MoveSpeed`,`Farm` FROM `resourcebuyunit` where `Level` = '"+parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Level, 10)
															+"'AND `UnitType` = '"+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"'",function(error, rows,field)
												        {
															if (!!error)
															{
																console.log('Error in the query1');
															}else
															{
																if(rows.length > 0)
																{
																	d = new Date();
												    				createPositionTimelast = Math.floor(d.getTime() / 1000);
																	//insert unit in locations26


																	connection.query("INSERT INTO `unitinlocations` (`idUnitInLocations`, `UserName`, `unitType`, `Health`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`,`Defend`, `DefendEach`,`FarmEach`,`FarmPortable`, `Position`,`PositionClickTemp`, `Quality`, `Level`, `UnitOrder`,`PositionClick`,`timeMove`,`MoveSpeedEach`,`TimeCheck`,`timeClick`,`CheckLog`,`CheckOnline`,`CheckCreate`, `TimeFight`, `CheckFight`, `userFight`,`FightRadius`) VALUES ('"+
																	""+"','"+currentSENDUNITINLOCATIONSCOMPLETE.UserName+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.UnitType+"','"
																	+(parseInt(rows[0].Health,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Health,10)+"','"
																	+(parseInt(rows[0].Health,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+(parseInt(rows[0].Damage,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Damage,10)+"','"+
																	+(parseInt(rows[0].Defend,10)*parseInt(currentSENDUNITINLOCATIONSCOMPLETE.Quality,10))+"','"
																	+parseInt(rows[0].Defend,10)+"','"
																	+parseInt(rows[0].Farm,10)+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Farm+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Quality+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Level+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.UnitOrder+"','"
																	+currentSENDUNITINLOCATIONSCOMPLETE.Position+"','"
																	+0+"','"+parseFloat(rows[0].MoveSpeed)+"','"
																	+createPositionTimelast+"','"
																	+createPositionTimelast+"','"
																	+0+"','"+1+"','"+1+"','"+0+"','"+0+"','"																	
																	+""+"','"+4+"')",function(error, result, field)
																	{
															            if(!!err)
															            {
															            	console.log('Error in the query34');
															            }else
															            {															            	
														                	connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query4');
																				}else
																				{	
																					console.log("Gưi id len client: " +rows[0].idUnitInLocations);
																        			socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																					{
																						idUnitInLocations:rows[0],																						
																                	});
																                	socket.broadcast.emit('RECEIVEUNITCREAT',
																					{
																						idUnitInLocations:rows[0],
																                	});
																			        
																				}
																			})
														                	
														                	//insert unitlocation to redis
														                	connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"+result.insertId+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query4');
																				}else
																				{																	
																        					
																        			client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																			        
																				}
																			})


														                	connection.query('DELETE FROM unitinbase WHERE Quality = ?',[0],function(error, result, field)
																			{
																				if(!!error)
																				{
																					console.log('Error in the queryfgfg657');
																				}else
																				{
																					if(result)
																					{
																						console.log('Delete sau khi UPDATE thanh cong');

																					}else
																					{
																						console.log('khong co gi delete');

																					}
																				}
																			})
															            }
																	})
																}
															}
														})

													}else
													{
														console.log('cap nhat that bai');
													}
												}
											});


										}
									}
								});						

							}else
							{
								socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
								{
									checkResource:0,
			                	});
							}

						}else
						{
							console.log("lỗi select");
						}

					}
				})

			});

			socket.emit('SENDUNITINLOCATIONSCOMPLETE',currentSENDUNITINLOCATIONSCOMPLETE );
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDUNITINLOCATIONSCOMPLETE);
		});

		socket.on('SENDTIMEWAITINBASECOMPLETE', function (data)
		{
			//Nhận thời gian complete từ client
			currentBaseComplete =
			{
				UserName:data.UserName,
				idCity:data.idCity,
				UnitType:data.UnitType,
				Quality:data.Quality,
				Level:data.Level,
				timeComplete:data.timeComplete,
			}
			pool.getConnection(function(err,connection)
			{
				connection.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentBaseComplete.UserName+"'",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the queryhjkhjk');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
        					//arrayidResource.push(rows[i].idResource);
        					d = new Date();
			    			createPositionTimelast = Math.floor(d.getTime() / 1000);

        					if((rows[i].timeComplete-createPositionTimelast ) > 0)
        					{
        						timeRemaincomplete = rows[i].timeComplete-createPositionTimelast;
        					}else if(createPositionTimelast > rows[i].timeComplete)
        					{
        						timeRemaincomplete = 0;
        					}else
        					{
        						timeRemaincomplete = 0;
        					}
        					if (timeRemaincomplete === 1){
        						timeRemaincomplete = 0;
        					}
        					connection.query('UPDATE unitwaitinbase SET timeRemain = ? WHERE idUNBase = ?', [timeRemaincomplete, rows[i].idUNBase],function(error, result, field)
							{
								if(!!error)
								{
									console.log('Error in the query11as4q3');
								}else
								{
									console.log('cập nhật success time remain');
									//kiểm tra timecomplete từ client của user trả về

								}
							})
				        }

						connection.query("SELECT `UserName`, `idCity`, `UnitType`, `Quality`, `Level` FROM `unitwaitinbase` WHERE `UserName`='"+currentBaseComplete.UserName+"' AND `timeRemain`='"+0+"'",function(error, rows,field)
						{
							if (!!error)
							{
								console.log('Error in the query23');
							}else
							{
								if(rows.length>0)
								{

									arrayUserNamecomplete = [];
	                				arrayidCitycomplete = [];
	                				arrayUnitTypecomplete = [];
	                				arrayQualitycomplete = [];
	                				arrayLevelcomplete = [];
									for (var i = 0; i < rows.length; i++)
									{
		                				arrayUserNamecomplete.push(rows[i].UserName);
		                				arrayidCitycomplete.push(rows[i].idCity);
		                				arrayUnitTypecomplete.push(rows[i].UnitType);
		                				arrayQualitycomplete.push(rows[i].Quality);
		                				arrayLevelcomplete.push(rows[i].Level);

		                			}
		                			for (var k = 0; k <arrayLevelcomplete.length; k++)
									{
										var index=-1;
										connection.query("SELECT * FROM `unitinbase` WHERE `UserName`='"+arrayUserNamecomplete[k]+"' AND`idCity`='"+arrayidCitycomplete[k]
											+"' AND `UnitType`='"+arrayUnitTypecomplete[k]+"' AND `Level`='"+arrayLevelcomplete[k]+"'",function(error, rows,field)
										{
											index++;
											if (!!error)
											{
												console.log('Error in the query12');
											}else
											{
												if (rows.length >0)
												{
													//cap nhật
													connection.query('UPDATE unitinbase SET Quality = ? WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
															[(rows[0].Quality+arrayQualitycomplete[index]),arrayUserNamecomplete[index],arrayidCitycomplete[index],arrayUnitTypecomplete[index],arrayLevelcomplete[index]],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query11sadeq34');
														}else
														{

																connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
																[arrayUserNamecomplete[index],arrayidCitycomplete[index],arrayUnitTypecomplete[index],arrayLevelcomplete[index]],function(error, result, field)
															  	{
																	if(!!error)
																	{
																		console.log('Error in the queryfgfg776');
																	}else
																	{
																		if(result)
																		{

																			//gửi data unit in base lên client
																			socket.emit('ReceiveUnitInBaseSuccess',
																			{
																				UserName:currentBaseComplete.UserName,
																				idCity:currentBaseComplete.idCity,
																				UnitType:currentBaseComplete.UnitType,
																				Quality:currentBaseComplete.Quality,
																				Level:currentBaseComplete.Level,
																				timeComplete:currentBaseComplete.timeComplete,

														                	});

																		}else
																		{
																			socket.emit('ReceiveUnitInBaseSuccess',
																			{
																				UserName:'',
																				idCity:'',
																				UnitType:'',
																				Quality:'',
																				Level:'',
																				timeComplete:'',
																			});
																		}
																	}
																})

														}
													})

												}
												else
												{
													//insert
													connection.query("INSERT INTO `unitinbase` (`idUNBase`,`UserName`,`idCity`,`UnitType`,`Quality`,`Level`) VALUES ('"+""+"','"
													+arrayUserNamecomplete[index]+"','"+arrayidCitycomplete[index]+"','"+arrayUnitTypecomplete[index]+"','"+arrayQualitycomplete[index]+"','"
													+arrayLevelcomplete[index]+"')",function(error, result, field)
													{
											            if(!!err)
											            {
											            	console.log('Error in the query34');
											            }else
											            {

											            	connection.query('DELETE FROM unitwaitinbase WHERE UserName = ? AND idCity = ? AND UnitType = ? AND Level = ?',
															[arrayUserNamecomplete[index],arrayidCitycomplete[index],arrayUnitTypecomplete[index],arrayLevelcomplete[index]],function(error, result, field)
														  	{
																if(!!error)
																{
																	console.log('Error in the queryfgfg7567');
																}else
																{
																	if(result)
																	{

																		//gửi data unit in base lên client
																		socket.emit('ReceiveUnitInBaseSuccess',
																		{
													                    	UserName:currentBaseComplete.UserName,
																			idCity:currentBaseComplete.idCity,
																			UnitType:currentBaseComplete.UnitType,
																			Quality:currentBaseComplete.Quality,
																			Level:currentBaseComplete.Level,
																			timeComplete:currentBaseComplete.timeComplete,
													                	});

																	}else
																	{

																		socket.emit('ReceiveUnitInBaseSuccess',
																		{
																			UserName:'',
																			idCity:'',
																			UnitType:'',
																			Quality:'',
																			Level:'',
																			timeComplete:'',
																		});
																	}
																}
															})
											            }
													})
												}

											}
										})
									}

								}else{

									socket.emit('ReceiveUnitInBaseSuccess',
									{
										UserName:'1',
										idCity:'1',
										UnitType:'1',
										Quality:'1',
										Level:'1',
										timeComplete:'1',
									});

								}
							}
						})


				    }
				});


			});

			socket.emit('SENDTIMEWAITINBASECOMPLETE',currentBaseComplete );
			//socket.emit('USER_CONNECTED',currentBaseComplete );
			socket.broadcast.emit('USER_CONNECTED',currentBaseComplete);
		});

		socket.on('SENDCHECKUNITINLOCATION', function (data)
		{
			currentSENDCHECKUNITINLOCATION =
			{
				idUnitInLocations:data.idUnitInLocations,
				UserName:data.UserName,
				idCity:data.idCity,				
				Quality:data.Quality,
				Farm:data.Farm,
				QualityAfterMerge:data.QualityAfterMerge,
				UnitOrder:data.UnitOrder,				
			}
			console.log("data from client: "
				+currentSENDCHECKUNITINLOCATION.idUnitInLocations
				+"_"+currentSENDCHECKUNITINLOCATION.UserName
				+"_"+currentSENDCHECKUNITINLOCATION.idCity
				+"_"+currentSENDCHECKUNITINLOCATION.Quality
				+"_"+currentSENDCHECKUNITINLOCATION.Farm
				+"_"+currentSENDCHECKUNITINLOCATION.QualityAfterMerge
				+"_"+currentSENDCHECKUNITINLOCATION.UnitOrder);
			pool.getConnection(function(err,connection)
			{             
				//Check tài khuyên
				connection.query("SELECT unitType,Level,UnitOrder,Quality,HealthEach,FarmEach,FarmPortable,HealthRemain FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDCHECKUNITINLOCATION.idUnitInLocations
					+"'AND `Quality` = '"+parseInt(currentSENDCHECKUNITINLOCATION.Quality, 10)+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
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
							
							//kiểm tra cập nhật hay update
							connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `idCity` = '"+currentSENDCHECKUNITINLOCATION.idCity
											+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
					        {
					        	if (!!error)
								{
									console.log('Error in the query1');
								}else
								{
									if (rows.length>0) {
										console.log("Cap nhat");
										//thực hiện update
										//kiểm tra unit đã đầy máu trước khi đưa vào thành
										if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
										{
											//đầy máu		
											console.log("đầy máu");					
									        																					
											//console.log("test"++(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"_")
											//cập nhật farm trong thành
											console.log("cong fram farm 4: " +currentSENDCHECKUNITINLOCATION.UserName+"_"+currentSENDCHECKUNITINLOCATION.idCity);
											connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))+"' where `UserName` = '"
												+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query113434gfd');
												}else
												{
													console.log("cong dong updatedfsdf======================: "+result.affectedRows);
													if (result.affectedRows > 0) 
													{
														//cập nhật và xóa base
														// kiểm tra và cập nhật unit in base
														connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `idCity` = '"+currentSENDCHECKUNITINLOCATION.idCity
														+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
												        {
															if (!!error)
															{
																console.log('Error in the query13434');
															}else
															{
																if(rows.length > 0)
																{													
																	//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																	if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																	{
																		//gửi len client thong tin cap nhat dung
																		socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																		{
																			checkResource:1,
													                	});	
													                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query113434');
																			}else
																			{
																				if (result.affectedRows > 0) 
																				{
																					
																					//xóa unit in location và cập nhật lại unit order
																					client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)).length > 0 ) 
																					{																				
																						
																						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations)), 1);									
																					}	

																					//check redis
																					//gửi lên client thông số id xóa
																					socket.broadcast.emit('RECEIVEUNITDELETE',
																					{
																						idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																                	});
																                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																					{
																						if(!!error)
																						{
																							console.log('Error in the queryfgfg659');
																						}else
																						{
																							if(result.affectedRows > 0)
																							{
																								//update lại unit order
																								console.log("update lại unit order day mau: "+currentSENDCHECKUNITINLOCATION.idUnitInLocations);

																								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																										+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																								{
																									if (!!error)
																									{
																										console.log('Error in the query134323');
																									}else
																									{
																										if(rows.length > 0)
																										{
																											for (var i = 0; i < rows.length; i++)
																											{
																												connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																												[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																												{
																													if(!!error)
																													{
																														console.log('Error in the query1135454');
																													}else
																													{
																														if(result.affectedRows > 0)
																														{
																															console.log('update unit order locations thành công');
																														}else
																														{
																															console.log('update unit order locations khong66 thành công');

																														}

																													}
																												})

																											}

																										}
																									}
																								})
																								// connection.query('UPDATE unitinlocations SET UnitOrder = UnitOrder - 1 WHERE UserName = ? AND UnitOrder > ?',
																								// [currentSENDCHECKUNITINLOCATION.UserName, currentSENDCHECKUNITINLOCATION.UnitOrder],function(error, result, field)
																								// {
																								// 	if(!!error)
																								// 	{
																								// 		console.log('Error in the query1135454');
																								// 	}else
																								// 	{
																								// 		if(result.affectedRows > 0)
																								// 		{
																								// 			console.log('update unit order locations thành công');
																								// 		}else
																								// 		{
																								// 			console.log('update unit order locations khong66 thành công');

																								// 		}

																								// 	}
																								// })

																							}else
																							{
																								console.log('khong co gi delete location');

																							}
																						}
																					})
																				}
																			}
																		});
																	}else
																	{
																		//gửi mail
																		connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
																        {
																			if (!!error)
																			{
																				console.log('Error in the query124323');
																			}else
																			{

																				for (var i = 0; i < rows.length; i++)
																				{
																				 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																				 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
																				 		+parseInt(rows[i].Quality, 10)+"</td><td>"
																						+parseInt(rows[i].Level, 10)+"</td><td>"
																						+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
																				}


																				let transporter = nodemailer.createTransport({
																				    service: 'gmail',
																				    auth: {
																				        user: 'aloevera.hoang@gmail.com',
																				        pass: '123456@A'
																				    }
																				});

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
																				transporter.sendMail(mailOptions, (error, info) => {
																				    if (error) {
																				        return console.log(error);
																				    }
																				    console.log('Message %s sent: %s', info.messageId, info.response);
																				});


																			}
																		})
																		socket.emit('RECEIVECHECKUNITINLOCATION',
																		{
																			checkResource:0,
								                						});
																	}
																}
															}
														});

													}
												}
											});																				
													
										}else
										{
											console.log("không đầy máu");					
											//không đầy máu
											connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, rows,field)
									        {
												if (!!error)
												{
													console.log('Error in the query1');
												}else
												{
													if(rows.length > 0)
													{
														//Tính và cập nhật farm
														//Tính farm tiêu tốn	
														//kiểm tra unit location có đậy mau										
														
														//Cập nhật farm trong thành
														if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
														{
															//console.log("test"++(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"_")
															//cập nhật farm trong thành
															console.log("cong farm 1: " +currentSENDCHECKUNITINLOCATION.UserName+"_"+currentSENDCHECKUNITINLOCATION.idCity);
															connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"' where `UserName` = '"
																+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query113434gfd');
																}else
																{
																	console.log("so dong update 1223: "+result.affectedRows);
																	if (result.affectedRows > 0) 
																	{
																		//cập nhật và xóa base
																		// kiểm tra và cập nhật unit in base
																		connection.query("SELECT Quality,idUNBase FROM `unitinbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `idCity` = '"+currentSENDCHECKUNITINLOCATION.idCity
																		+"'AND `UnitType` = '"+unitTypeShare+"'AND `Level` = '"+LevelShare+"'",function(error, rows,field)
																        {
																			if (!!error)
																			{
																				console.log('Error in the query13434');
																			}else
																			{
																				if(rows.length > 0)
																				{													
																					//kiểm tra số lượng merge với bảng unitinbase có đúng không?														
																					if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDCHECKUNITINLOCATION.Quality)) ===parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)) 
																					{
																						//gửi len client thong tin cap nhat dung
																						socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
																						{
																							checkResource:1,
																	                	});															                	
																	                	connection.query("UPDATE unitinbase SET Quality = '"+parseFloat(currentSENDCHECKUNITINLOCATION.QualityAfterMerge)+"' WHERE idUNBase = ?",[rows[0].idUNBase],function(error, result, field)
																						{
																							if(!!error)
																							{
																								console.log('Error in the query113434');
																							}else
																							{
																								if (result.affectedRows > 0) 
																								{
																									console.log("Cap nhat unit in base thanh cong");
																									//xóa unit in location và cập nhật lại unit order
																									client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																									//check redis
																									//gửi lên client thông số id xóa
																									socket.broadcast.emit('RECEIVEUNITDELETE',
																									{
																										idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
																				                	});
																				                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																									{
																										if(!!error)
																										{
																											console.log('Error in the queryfgfg659');
																										}else
																										{
																											if(result.affectedRows > 0)
																											{
																												//update lại unit order
																												console.log("update lại unit order khong day mau");
																												connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																														+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																												{
																													if (!!error)
																													{
																														console.log('Error in the query134323');
																													}else
																													{
																														if(rows.length > 0)
																														{
																															for (var i = 0; i < rows.length; i++)
																															{
																																connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																																[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																																{
																																	if(!!error)
																																	{
																																		console.log('Error in the query1135454');
																																	}else
																																	{
																																		if(result.affectedRows > 0)
																																		{
																																			console.log('update unit order locations thành công');
																																		}else
																																		{
																																			console.log('update unit order locations khong66 thành công');

																																		}

																																	}
																																})

																															}

																														}
																													}
																												})

																											}else
																											{
																												console.log('khong co gi delete location');

																											}
																										}
																									})
																								}
																							}
																						});
																					}else
																					{
																						//gửi mail
																						connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'",function(error, rows,field)
																				        {
																							if (!!error)
																							{
																								console.log('Error in the query124323');
																							}else
																							{

																								for (var i = 0; i < rows.length; i++)
																								{
																								 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
																								 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
																								 		+parseInt(rows[i].Quality, 10)+"</td><td>"
																										+parseInt(rows[i].Level, 10)+"</td><td>"
																										+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
																								}


																								let transporter = nodemailer.createTransport({
																								    service: 'gmail',
																								    auth: {
																								        user: 'aloevera.hoang@gmail.com',
																								        pass: '123456@A'
																								    }
																								});

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
																								transporter.sendMail(mailOptions, (error, info) => {
																								    if (error) {
																								        return console.log(error);
																								    }
																								    console.log('Message %s sent: %s', info.messageId, info.response);
																								});


																							}
																						})
																						socket.emit('RECEIVECHECKUNITINLOCATION',
																						{
																							checkResource:0,
												                						});
																					}
																				}
																			}
																		});

																	}
																}
															});

														}else
														{
															//gửi số 2
															console.log("khong du dieu kien thu ve thanh");
															socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
															{
																checkResource:2,
										                	});
														}										

													}										

												}
											});
										}		
									}else
									{
										console.log("insert");
										if(parseFloat(HealthRemailShare)===parseFloat(HealthEachShare)*parseFloat(QualityShare))
										{
											//đầy máu		
											console.log("đầy máu");					
									        																					
											//console.log("kiem tra mau: "+(parseFloat(rows[0].Farm)+"_"+ (parseFloat(FarmPortableShare)+"_"+parseFloat(FarmEachShare*0.5))));
											//cập nhật farm trong thành
											console.log("cong farm 2: " +currentSENDCHECKUNITINLOCATION.UserName+"_"+currentSENDCHECKUNITINLOCATION.idCity);
											connection.query("UPDATE userbase SET Farm = Farm + '"+ (parseFloat(FarmPortableShare))+"' where `UserName` = '"
												+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query113434gfd');
												}else
												{
													console.log("cong dong update 454 5======================: "+result.affectedRows);
													if (result.affectedRows > 0) 
													{
														//cập nhật và xóa base
														// kiểm tra và cập nhật unit in base
														connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `idCity`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
														+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.idCity+"','"+unitTypeShare+"','"
														+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
														{
												            if(!!err)
												            {
												            	console.log('Error in the query34');
												            }else
												            {
												            	//xóa unit in location và cập nhật lại unit order
												            	console.log("xóa unit in location và cập nhật lại unit order: "+currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																//check redis
																//gửi lên client thông số id xóa
																socket.broadcast.emit('RECEIVEUNITDELETE',
																{
																	idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
											                	});
											                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																{
																	if(!!error)
																	{
																		console.log('Error in the queryfgfg659');
																	}else
																	{
																		if(result.affectedRows > 0)
																		{
																			//update lại unit order
																			console.log("update lại unit order day mau: "+currentSENDCHECKUNITINLOCATION.idUnitInLocations);

																			connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																					+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																			{
																				if (!!error)
																				{
																					console.log('Error in the query134323');
																				}else
																				{
																					if(rows.length > 0)
																					{
																						for (var i = 0; i < rows.length; i++)
																						{
																							connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																							[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																							{
																								if(!!error)
																								{
																									console.log('Error in the query1135454');
																								}else
																								{
																									if(result.affectedRows > 0)
																									{
																										console.log('update unit order locations thành công');
																									}else
																									{
																										console.log('update unit order locations khong66 thành công');

																									}

																								}
																							})

																						}

																					}
																				}
																			})																		

																		}else
																		{
																			console.log('khong co gi delete location');

																		}
																	}
																})
												            }
														})

													}
												}
											});																				
													
										}else
										{
											console.log("không đầy máu");					
											//không đầy máu
											connection.query("SELECT idBase,Farm FROM `userbase` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, rows,field)
									        {
												if (!!error)
												{
													console.log('Error in the query1');
												}else
												{
													if(rows.length > 0)
													{
														//Tính và cập nhật farm
														//Tính farm tiêu tốn	
														//kiểm tra unit location có đậy mau	
														console.log("kiem tra mau: "+(parseFloat(rows[0].Farm)+"_"+ (parseFloat(FarmPortableShare)+"_"+parseFloat(FarmEachShare*0.5))));							
														
														//Cập nhật farm trong thành
														if (parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)) >=0 ) 
														{
															//console.log("test"++(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"_")
															//cập nhật farm trong thành
															console.log("cong farm 3: " +currentSENDCHECKUNITINLOCATION.UserName+"_"+currentSENDCHECKUNITINLOCATION.idCity);
															connection.query("UPDATE userbase SET Farm = '"+(parseFloat(rows[0].Farm) + (parseFloat(FarmPortableShare) - parseFloat(FarmEachShare*0.5)))+"' where `UserName` = '"
																+currentSENDCHECKUNITINLOCATION.UserName+"'AND `baseCity` = '"+currentSENDCHECKUNITINLOCATION.idCity+"'",function(error, result, field)
															{
																if(!!error)
																{
																	console.log('Error in the query113434gfd');
																}else
																{
																	console.log("cong dong update hgdhdh======================: "+result.affectedRows);
																	if (result.affectedRows > 0) 
																	{
																		//insert và xóa base
																		// kiểm tra và cập nhật unit in base
																		connection.query("INSERT INTO `unitinbase` (`idUNBase`, `UserName`, `idCity`, `UnitType`, `Quality`, `Level`) VALUES ('"+""+"','"
																		+currentSENDCHECKUNITINLOCATION.UserName+"','"+currentSENDCHECKUNITINLOCATION.idCity+"','"+unitTypeShare+"','"
																		+currentSENDCHECKUNITINLOCATION.QualityAfterMerge+"','"+LevelShare+"')",function(error, result, field)
																		{
																            if(!!err)
																            {
																            	console.log('Error in the query34');
																            }else
																            {
																            	//xóa unit in location và cập nhật lại unit order
																            	console.log("xóa unit in location và cập nhật lại unit order: "+currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																				client.del(currentSENDCHECKUNITINLOCATION.idUnitInLocations);
																				//check redis
																				//gửi lên client thông số id xóa
																				socket.broadcast.emit('RECEIVEUNITDELETE',
																				{
																					idUnitInLocations:parseFloat(currentSENDCHECKUNITINLOCATION.idUnitInLocations),
															                	});
															                	connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDCHECKUNITINLOCATION.idUnitInLocations],function(error, result, field)
																				{
																					if(!!error)
																					{
																						console.log('Error in the queryfgfg659');
																					}else
																					{
																						if(result.affectedRows > 0)
																						{
																							//update lại unit order
																							console.log("update lại unit order day mau: "+currentSENDCHECKUNITINLOCATION.idUnitInLocations);

																							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDCHECKUNITINLOCATION.UserName
																									+"'AND `UnitOrder` > '"+UnitOrderShare+"'",function(error, rows,field)
																							{
																								if (!!error)
																								{
																									console.log('Error in the query134323');
																								}else
																								{
																									if(rows.length > 0)
																									{
																										for (var i = 0; i < rows.length; i++)
																										{
																											connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																											[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDCHECKUNITINLOCATION.UserName, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																											{
																												if(!!error)
																												{
																													console.log('Error in the query1135454');
																												}else
																												{
																													if(result.affectedRows > 0)
																													{
																														console.log('update unit order locations thành công');
																													}else
																													{
																														console.log('update unit order locations khong66 thành công');

																													}

																												}
																											})

																										}

																									}
																								}
																							})
																							// connection.query('UPDATE unitinlocations SET UnitOrder = UnitOrder - 1 WHERE UserName = ? AND UnitOrder > ?',
																							// [currentSENDCHECKUNITINLOCATION.UserName, currentSENDCHECKUNITINLOCATION.UnitOrder],function(error, result, field)
																							// {
																							// 	if(!!error)
																							// 	{
																							// 		console.log('Error in the query1135454');
																							// 	}else
																							// 	{
																							// 		if(result.affectedRows > 0)
																							// 		{
																							// 			console.log('update unit order locations thành công');
																							// 		}else
																							// 		{
																							// 			console.log('update unit order locations khong66 thành công');

																							// 		}

																							// 	}
																							// })

																						}else
																						{
																							console.log('khong co gi delete location');

																						}
																					}
																				})
																            }
																		})

																	}
																}
															});

														}else
														{
															//gửi số 2
															console.log("khong du dieu kien thu ve thanh");
															socket.emit('RECEIVEUNITINLOCATIONSCOMPLETE',
															{
																checkResource:2,
										                	});
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
								if (!!error)
								{
									console.log('Error in the query1');
								}else
								{

									for (var i = 0; i < rows.length; i++)
									{
									 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
									 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
									 		+parseInt(rows[i].Quality, 10)+"</td><td>"
											+parseInt(rows[i].Level, 10)+"</td><td>"
											+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
									}


									let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
									    }
									});

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
									transporter.sendMail(mailOptions, (error, info) => {
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});


								}
							})
							socket.emit('RECEIVECHECKUNITINLOCATION',
							{
								checkResource:0,
		                	});
						}

					}
				});


			});

			socket.emit('SENDCHECKUNITINLOCATION',currentSENDCHECKUNITINLOCATION);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDCHECKUNITINLOCATION);
		});

		socket.on('SENDEXCHANGECHECKUNITINLOCATION', function (data)
		{
			currentSENDEXCHANGECHECKUNITINLOCATION =
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

			
			console.log("data from client: "+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"_"+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight+"_"
				+currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight);
			pool.getConnection(function(err,connection)
			{			
				//Check số lượng của từng unit
				connection.query("SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft							
								+"'UNION ALL SELECT Quality,UnitOrder,UserName,HealthEach,FarmPortable FROM `unitinlocations` where `idUnitInLocations` = '"+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight															
								+"'",function(error, rows,field)
		        {
					if (!!error)
					{
						console.log('Error in the query1');
					}else
					{
						if(rows.length > 1)
						{	
						console.log((parseFloat(rows[0].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft))
							+"_"+(parseFloat(rows[1].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight)));	

		                	if ((parseFloat(rows[0].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10)
		                		&&(parseFloat(rows[1].Quality)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10)
		                		&&(parseFloat(rows[0].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeLeft))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft, 10)
		                		&&(parseFloat(rows[1].FarmPortable)+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmMergeRight))===parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight, 10))
		                	{
		                		//gán giá trị sau khi select
		                		UserNameExchange = rows[0].UserName;
		                		HealthExchangeLeft = rows[0].HealthEach;
		                		HealthExchangeRight = rows[1].HealthEach;
		                		socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
								{
									checkResource:1,
			                	});			                	
			                	//kiểm tra xem có số lượng nào bẳng 0 để lấy unit order
								if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10))===0)
			                	{
			                		UnitOrderZero = rows[0].UnitOrder;
			                	}else
			                	{
			                		UnitOrderZero = rows[1].UnitOrder;
			                	}
			                	//kiểm tra unit inlocation còn lại và gửi cho tất cả user khác
								if ((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0 &&
									(parseInt(rows[1].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, 10)) > 0)
								{							
									//console.log(rows[0].idUnitInLocations+"_"+(parseInt(rows[0].Quality, 10)-parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)));
									//console.log(rows[1].idUnitInLocations+"_"+(parseInt(rows[1].Quality, 10)-parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, 10)));
									//gửi cho những user khác cập nhật									
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
										idUnitInLocations1: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
										Quality1:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
				                	});
									//Cập nhật số lại hai id left và right
									// 1 - cập nhật id Left
									connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft)*parseFloat(HealthExchangeLeft))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft)+"'  WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11as4eq3');
										}else
										{
											console.log("ID Left complete update");
											//check redis
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
												+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query4567');
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
				               		// 2 - cập nhật id Right
									connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight)*parseFloat(HealthExchangeRight))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight)+"' WHERE idUnitInLocations = ?",
										[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11aserq324');
										}else
										{
											console.log("ID Right complete update");															    	
											//check redis
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
												+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query4567');
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
								}else if((parseInt(rows[0].Quality, 10)+parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)) > 0)
								{
									//console.log(rows[0].idUnitInLocations+"_"+(parseInt(rows[0].Quality, 10)-parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft, 10)));
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),
				                	});
				                	socket.broadcast.emit('RECEIVEUNITDELETE',
									{
										idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight),
				                	});
									//Cập nhật số lại id left và del right									
									connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeLeft)*parseFloat(HealthExchangeLeft))
										+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterLeft)+"' WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterLeft, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11saer3q');
										}else
										{
											console.log("ID Left complete update");

											connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the queryfgfg645');
												}else
												{
													if(result.affectedRows > 0)
													{
														//update lại unit order																
														connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+UserNameExchange
																+"'AND `UnitOrder` > '"+UnitOrderZero+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query1');
															}else
															{
																if(rows.length > 0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																		[(parseInt(rows[i].UnitOrder, 10)-1),UserNameExchange, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query11awer3q2');
																			}else
																			{
																				//check redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query4567');
																					}else
																					{																															
																						client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																						client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight);
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																				
																						}	
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location																							
																							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight)), 1);									
																						}																			        
																					}
																				})
																			}
																		})
																	}
																}
															}
														})

													}
												}
											})
											

										}
									})									
									
								}else
								{
									//console.log(rows[1].idUnitInLocations+"_"+(parseInt(rows[0].Quality, 10)-parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight, 10)));
									//Cập nhật số lại id right và del left 
									socket.broadcast.emit('RECEIVEUNITSHARED',
									{
										idUnitInLocations: currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight,
										Quality:parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),
				                	});
				                	socket.broadcast.emit('RECEIVEUNITDELETE',
									{
										idUnitInLocations:parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft),
				                	});

				                	connection.query("UPDATE unitinlocations SET Quality = ?,HealthRemain = HealthRemain +'"+(parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.QualityMergeRight)*parseFloat(HealthExchangeRight))
				                	+"' ,FarmPortable ='"+parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.FarmAfterRight)+"' WHERE idUnitInLocations = ?",
									[parseInt(currentSENDEXCHANGECHECKUNITINLOCATION.QualityAfterRight, 10),currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query1143q4q');
										}else
										{
											console.log("ID Left complete update");

											connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ?',[currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the queryfgfg645');
												}else
												{
													if(result.affectedRows > 0)
													{
														//update lại unit order																
														connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+UserNameExchange
																+"'AND `UnitOrder` > '"+UnitOrderZero+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query1');
															}else
															{
																if(rows.length > 0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
																		[(parseInt(rows[i].UnitOrder, 10)-1),UserNameExchange, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
																		{
																			if(!!error)
																			{
																				console.log('Error in the query11sdarq3');
																			}else
																			{
																				//check redis
																				connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																					+currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationRight+"'",function(error, rows,field)
																				{
																					if (!!error)
																					{
																						console.log('Error in the query4567');
																					}else
																					{																															
																						client.set(rows[0].idUnitInLocations,JSON.stringify(rows[0]));
																						client.del(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft);	
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[0].idUnitInLocations)).length > 0 ) 
																						{
																							//cập nhật tình trạng ofllie cho unit location
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].Quality = parseFloat(rows[0].Quality);
																							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[0].idUnitInLocations))].HealthRemain = parseFloat(rows[0].HealthRemain);																																					
																						}
																						if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)).length > 0 ) 
																						{																							
																							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDEXCHANGECHECKUNITINLOCATION.idUnitInLocationLeft)), 1);									
																						}																				        
																					}
																				})
																			}
																		})
																	}
																}
															}
														})
													}
												}
											})										
										}
									})
								}	                	
							}else
							{
								console.log("lỗi 1");
								connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentUser.name+"'",function(error, rows,field)
						        {
									if (!!error)
									{
										console.log('Error in the query1');
									}else
									{

										for (var i = 0; i < rows.length; i++)
										{
										 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
										 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
										 		+parseInt(rows[i].Quality, 10)+"</td><td>"
												+parseInt(rows[i].Level, 10)+"</td><td>"
												+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
										}


										let transporter = nodemailer.createTransport({
										    service: 'gmail',
										    auth: {
										        user: 'aloevera.hoang@gmail.com',
										        pass: '123456@A'
										    }
										});

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
											"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
											"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
											"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
											"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
											+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
											"</tbody></table></body></html>"
										};
										// send mail with defined transport object
										transporter.sendMail(mailOptions, (error, info) => {
										    if (error) {
										        return console.log(error);
										    }
										    console.log('Message %s sent: %s', info.messageId, info.response);
										});


									}
								})
								console.log("không đủ số lượng linh ngoài thành");
								socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
								{
									checkResource:0,
			                	});
							}

						}else
						{
							console.log("lỗi 2");
              				//kiểm tra dữ liệu hiện có của user
							connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentUser.name+"'",function(error, rows,field)
					        {
								if (!!error)
								{
									console.log('Error in the query1');
								}else
								{

									for (var i = 0; i < rows.length; i++)
									{
									 dataTest +="<tr><td>"+rows[i].UserName+"</td><td>"
									 		+parseInt(rows[i].UnitType, 10)+"</td><td>"
									 		+parseInt(rows[i].Quality, 10)+"</td><td>"
											+parseInt(rows[i].Level, 10)+"</td><td>"
											+parseInt(rows[i].UnitOrder, 10)+"</td></tr>";
									}


									let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
									    }
									});

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
										"<thead><tr><td colspan='6' bgcolor='#b3ccff'><b>Dữ liệu lính hiện tại trao đổi không đồng bộ:</b></td></tr></thead>"+
										"<tr bgcolor='#bfbfbf'><td>UserName</td><td>UnitType</td><td>Quality</td><td>Level</td><td>UnitOrder</td></tr>"+
										"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeLeft+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.QualityLeft+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelLeft+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderLeft+"</td></tr>"+
										"<tr><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UserName+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.UnitTypeRight+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.QualityRight+"</td><td>"+currentSENDEXCHANGECHECKUNITINLOCATION.LevelRight+"</td><td>"
										+currentSENDEXCHANGECHECKUNITINLOCATION.UnitOrderRight+"</td></tr>"+
										"</tbody></table></body></html>"
									};
									// send mail with defined transport object
									transporter.sendMail(mailOptions, (error, info) => {
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});


								}
							})
							console.log("không đủ số lượng linh ngoài thành");
							socket.emit('RECEIVEEXCHANGECHECKUNITINLOCATION',
							{
								checkResource:0,
		                	});
						}

					}
				})


			});

			socket.emit('SENDEXCHANGECHECKUNITINLOCATION',currentSENDEXCHANGECHECKUNITINLOCATION);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('USER_CONNECTED',currentSENDEXCHANGECHECKUNITINLOCATION);
		});

		socket.on('disconnect', function (){
			socket.broadcast.emit('USER_DISCONNECTED',currentUser);
			console.log('User Online: '+clients.length);
			for (var i = 0; i < clients.length; i++)
			{
				//console.log("clients[i].name"+clients[i].name+"currentUser.name"+currentUser.name+"clients[i].id"
				//	+clients[i].id+"currentUser.id"+currentUser.id);
				if (typeof currentUser !== 'undefined')
				{
					if (clients[i].name === currentUser.name && clients[i].id === currentUser.id )
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
						    	connection.query('UPDATE users SET timeLogin = ?,timeLogout = ?,timeResetMine = ? WHERE UserName = ?', ["",createPositionTimelast,"", currentUser.name],function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the querygvh');
									}else
									{
										if(result)
										{

										}else
										{
											console.log('cap nhat that bai');
										}
									}
								});
								connection.query('UPDATE unitinlocations SET CheckOnline = 0 WHERE UserName = ?', [ currentUser.name],function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the querygvh');
									}else
									{
										if (result.affectedRows> 0) 
										{
											//console.log("cập nhật location thanh cong: ");
											//cập nhật redis
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations`WHERE UserName = ?", [ currentUser.name],function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query4');
												}else
												{
													for (var i = 0; i < rows.length; i++)
													{																	        					
														client.set(rows[i].idUnitInLocations,JSON.stringify(rows[i]));													
														if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(rows[i].idUnitInLocations)).length > 0 ) 
														{
															//cập nhật tình trạng ofllie cho unit location
															redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(rows[i].idUnitInLocations))].CheckOnline = "0";														
														}								
											        }									        
											        
												}
											})	
										}
										else
										{
											console.log('khong co time remain duoc cap nhat 3');
										}
									}
								});								

						    }
						 });
						console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected");
						clients.splice(i,1);
					};
				}else
				{
					//console.log('User chưa đăng nhập');
					console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected");
					clients.splice(i,1);
				}
			};
		});

		socket.on('REGISTER', function (data)
		{
			currentUser =
			{
				name:data.name,
				password:data.password,
				email:data.email,
			}
			pool.getConnection(function(err,connection)
			{
				if (!!err)
				{
						console.log('Error in connection');
				}
				connection.query("SELECT `UserID` FROM `users` ORDER BY `UserID` DESC LIMIT 1",function(error, rows,field)
				{
					if (!!error) {
						console.log('Error in the queryhj');
					}else
					{
						if ((parseInt(rows[0].UserID)) <=39) {
							portId = portIdarray[0];
						}else if ((parseInt(rows[0].UserID)) >=40 && (parseInt(rows[0].UserID)) <=44 ){
							portId = portIdarray[1];
						}else if ((parseInt(rows[0].UserID)) >=45 && (parseInt(rows[0].UserID)) <=47) {
							portId = portIdarray[2];
						}else if ((parseInt(rows[0].UserID)) >=48 && (parseInt(rows[0].UserID)) <=49) {
							portId = portIdarray[3];
						}else{
							portId = portIdarray[4];
						}
					}
				})

	        	connection.query("SELECT * FROM `users` WHERE `UserName`='"+currentUser.name+"' OR `UserEmail`='"+currentUser.email+"'",function(error, rows,field)
	        	{
					if (!!error)
					{
						console.log('Error in the queryhgtfh');
					}else
					{
						numRows = rows.length;
						if (numRows>0) {
							socket.emit('RegisterUnsuccess', {
	                        	message : '0'
	                    	});
						}else
						{
							timeLogin = 0; timeLogout = 0; timeResetMine = 0;
							connection.query("INSERT INTO `users` (`UserID`,`UserName`,`UserPass`,`password_recover_key`,`password_recover_key_expire`,`UserEmail`,`Port`,`timeLogin`,`timeLogout`,`timeResetMine`) VALUES ('"+""+"','"
								+currentUser.name+"','"+currentUser.password+"','"+""+"','"+""+"','"+currentUser.email+"','"+portId+"','"+timeLogin+"','"+timeLogout+"','"+timeResetMine+"')",function(error, result, field){
					            connection.release();
					            if(!!err) {
					            	console.log('Error in the querygfvhgf');
					            	socket.emit('RegisterUnsuccess', {
			                        	message : '1'
			                    	});
					            }else
					            {
									//console.log('right\n');

									let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
									    }
									});

									// setup email data with unicode symbols
									let mailOptions = {
									    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
									    to: currentUser.email, // list of receivers
									    subject: 'Thông báo đăng kí tài khoản ✔', // Subject line
									    text: 'Đăng kí tài khoản thành công?', // plain text body
									    html: '<b>Bạn đã đăng kí tài khoản thành công với tên: '+currentUser.name+ ' và email:'+currentUser.email+'</b>' // html body
									};

									// send mail with defined transport object
									transporter.sendMail(mailOptions, (error, info) => {
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});
									socket.emit('RegisterUnsuccess', {
			                        	message : '2'
			                    	});
								if (app.get('port') === 3000){
									console.log('3000\n');
								}else{
									console.log('3000\n');
								}

					            }
					        });
					     	connection.on('error', function(err) {
					              return;
				        	});
						}

					}
				})


	   		});

			socket.emit('REGISTER',currentUser );
			socket.emit('USER_CONNECTED',currentUser );
			socket.broadcast.emit('USER_CONNECTED',currentUser);
		});
		socket.on('SENDRECOVERPASSWORD', function (data)
		{
			currentSENDRECOVERPASSWORD =
			{
				username:data.username,
				email:data.email,				
			}
			console.log(currentSENDRECOVERPASSWORD.email+currentSENDRECOVERPASSWORD.username);
			var stRecover;
			pool.getConnection(function(err,connection)
			{				
	        	connection.query("SELECT UserEmail,password_recover_key FROM `users` WHERE `UserEmail`='"+currentSENDRECOVERPASSWORD.email+"' AND `UserName`='"+currentSENDRECOVERPASSWORD.username+"'",function(error, rows,field)
	        	{
					if (!!error)
					{
						console.log('Error in the queryhgtfh');
					}else
					{						
						if (rows.length > 0) 
						{		
							if (rows[0].password_recover_key.length>0) {				
																	
			                    	socket.emit('SENDRECOVERPASSWORDSUCCESS', 
									{
			                        	message : 2,
			                    	});
									let transporter = nodemailer.createTransport({
								    service: 'gmail',
								    auth: {
								        user: 'aloevera.hoang@gmail.com',
								        pass: '123456@A'
									    }
									});

									// setup email data with unicode symbols
									let mailOptions = 
									{
									    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
									    to: currentSENDRECOVERPASSWORD.email, // list of receivers
									    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
									    text: 'Đổi mật khẩu tài được xác nhận', // plain text body
									    html: '<b>Vui lòng copy mã xác nhận này: '+stRecover
									    + ' vào Phần Thay đổi mật khẩu trong game, nhập cùng với password mà bạn muốn thay đổi.'
									    +' Mã này tồn tại đến … (thời gian). Đoạn mã này sẽ tự hủy sau khi bạn thay đổi password.'
									    +' Please copy and paste this code: :'+stRecover+ ' at Reset Password in game, and input'
									    +' your new password. This code available unitil…(time). After changing your password, '
									    +'this code isn’t available..</b>' // html body
									};
									// send mail with defined transport object
									transporter.sendMail(mailOptions, (error, info) => 
									{
									    if (error) {
									        return console.log(error);
									    }
									    console.log('Message %s sent: %s', info.messageId, info.response);
									});								
									

							}else
							{
								//tạo chuổi key recovery gửi mail cho user và lưu vào data   
		                    	stRecover = randomValueHex(4)+"-"+randomValueHex(4)+"-"+randomValueHex(4);	
		                    	d = new Date();
						    	createPositionTimelast = Math.floor(d.getTime() / 1000);					

								connection.query("UPDATE `users` SET `password_recover_key`='"+stRecover+"',`password_recover_key_expire`='"+(parseFloat(createPositionTimelast)+86400)+"' WHERE `UserEmail`= '"+rows[0].UserEmail+"'",function(error, result, field){					           
						            if(!!err) {
						            	console.log('Error in the querygfvhghgf');					            	
						            }else
						            {
										if (result.affectedRows > 0) 
										{
											socket.emit('SENDRECOVERPASSWORDSUCCESS', 
											{
					                        	message : 1,
					                    	});
											let transporter = nodemailer.createTransport({
										    service: 'gmail',
										    auth: {
										        user: 'aloevera.hoang@gmail.com',
										        pass: '123456@A'
											    }
											});

											// setup email data with unicode symbols
											let mailOptions = 
											{
											    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
											    to: currentSENDRECOVERPASSWORD.email, // list of receivers
											    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
											    text: 'Đổi mật khẩu tài được xác nhận', // plain text body
											    html: '<b>Vui lòng copy mã xác nhận này: '+stRecover
											    + ' vào Phần Thay đổi mật khẩu trong game, nhập cùng với password mà bạn muốn thay đổi.'
											    +' Mã này tồn tại đến … (thời gian). Đoạn mã này sẽ tự hủy sau khi bạn thay đổi password.'
											    +' Please copy and paste this code: :'+stRecover+ ' at Reset Password in game, and input'
											    +' your new password. This code available unitil…(time). After changing your password, '
											    +'this code isn’t available..</b>' // html body
											};
											// send mail with defined transport object
											transporter.sendMail(mailOptions, (error, info) => 
											{
											    if (error) {
											        return console.log(error);
											    }
											    console.log('Message %s sent: %s', info.messageId, info.response);
											});	
										}else
										{
											socket.emit('SENDRECOVERPASSWORDSUCCESS', 
											{
					                        	message : 0,
					                    	});
											console.log("khong co dong user nao update");
										}
																									
						            }
						        });	

							}						
	                    					     	

						}else
						{
							socket.emit('SENDRECOVERPASSWORDSUCCESS', 
							{
	                        	message : 0,
	                    	});							
						}

					}
				})


	   		});

			socket.emit('SENDRECOVERPASSWORD',currentSENDRECOVERPASSWORD );			
			socket.broadcast.emit('SENDRECOVERPASSWORD',currentSENDRECOVERPASSWORD);
		});
		socket.on('CONFIRMRECOVERPASSWORD', function (data)
		{
			currentCONFIRMRECOVERPASSWORD =
			{
				username:data.username,				
				stRecover:data.stRecover,
				passRecover:data.passRecover,								
			}
			
			pool.getConnection(function(err,connection)
			{	
				connection.query("SELECT UserEmail FROM `users` where `UserName`= '"+currentCONFIRMRECOVERPASSWORD.username+"'",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the queryhgtfh');
					}else
					{						
						if (rows.length > 0) 
						{
							connection.query("UPDATE `users` SET `UserPass`='"+currentCONFIRMRECOVERPASSWORD.passRecover
			        			+"',`password_recover_key`='',`password_recover_key_expire`='' WHERE `UserName`= '"+currentCONFIRMRECOVERPASSWORD.username
			        			+"' AND `password_recover_key`= '"+currentCONFIRMRECOVERPASSWORD.stRecover+"'",function(error, result, field)
			        		{					           
					            if(!!err) {
					            	console.log('Error in the querygfvhghgf');					            	
					            }else
					            {
									if (result.affectedRows > 0) 
									{
										socket.emit('CONFIRMRECOVERPASSWORDSUCCESS', 
										{
				                        	message : 1,
				                    	});
										let transporter = nodemailer.createTransport({
									    service: 'gmail',
									    auth: {
									        user: 'aloevera.hoang@gmail.com',
									        pass: '123456@A'
										    }


										});

										// setup email data with unicode symbols
										console.log("Da gửi mail tới: "+rows[0].email);
										let mailOptions = {
										    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
										    to: rows[0].email, // list of receivers
										    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
										    text: 'Đổi mật khẩu tài thành công', // plain text body
										    html: '<b>Chúc mừng bạn đã thay đổi mật khẩu thành công. Vui lòng vào game để đăng nhập.</b>' // html body
										};
										// send mail with defined transport object
										transporter.sendMail(mailOptions, (error, info) => {
										    if (error) {
										        return console.log(error);
										    }
										    console.log('Message %s sent: %s', info.messageId, info.response);
										});	
									}else
									{
										socket.emit('CONFIRMRECOVERPASSWORDSUCCESS', 
										{
				                        	message : 0,
				                    	});
										console.log("khong co dong user nao update");
									}
																								
					            }
					        });	

						}
					}

				});		
        				     	
	   		});

			socket.emit('CONFIRMRECOVERPASSWORD',currentCONFIRMRECOVERPASSWORD );			
			socket.broadcast.emit('CONFIRMRECOVERPASSWORD',currentCONFIRMRECOVERPASSWORD);
		});

		socket.on('RESETMINE', function (data){
			socket.emit('ResetMineSuccess',
			{
	        	message : '0',
	    	});
			socket.broadcast.emit('RESETMINE', currentUser);

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

			console.log("===========================================client gửi position Click: "+currentSENDPOSITIONCLICK.idUnitInLocations
				+"_"+currentSENDPOSITIONCLICK.Position
				+"_"+currentSENDPOSITIONCLICK.PositionClick
				+"_"+currentSENDPOSITIONCLICK.timeMove+"_"
				+"_"+currentSENDPOSITIONCLICK.idUnitInLocationsB+"_"
				+"_"+currentSENDPOSITIONCLICK.PositionB+"_");
			//console.log("Client gửi Position==========: "+currentSENDPOSITIONCLICK.Position);

			if (currentSENDPOSITIONCLICK.idUnitInLocationsB.length===0||currentSENDPOSITIONCLICK.PositionB.length===0) {
				pool.getConnection(function(err,connection)
				{
					io.emit('RECEIVEPOSITIONCLICK',
					{
						PositionClick:currentSENDPOSITIONCLICK.PositionClick,
						idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
	            	});
					d = new Date();
	    			createPositionTimelast = Math.floor(d.getTime() / 1000);
	    			//kiểm tra position move có chính xác không
	    			//console.log("currentSENDPOSITIONCLICK.idUnitInLocations: "+currentSENDPOSITIONCLICK.idUnitInLocations);
	    			connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`='"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
					{
						if (!!error) {
							console.log('Error in the queryhj');
						}else
						{
							if (rows.length > 0) 
							{	
								d = new Date();
	    						createPositionTimelast = Math.floor(d.getTime() / 1000);
	    						APosition = rows[0].Position;
	    						//console.log("Position: "+rows[0].Position);
	    						A = APosition.split(",");
								A1 = parseFloat(A[0]);
								A2 = parseFloat(A[1]);
								BPosition = rows[0].PositionClick;
								//console.log("PositionClick: "+BPosition);
								B = BPosition.split(",");
								B1 = parseFloat(B[0]);
								B2 = parseFloat(B[1]);
								CPosition = currentSENDPOSITIONCLICK.Position;
								//console.log("currentSENDPOSITIONCLICK.Position :"+CPosition);
								C = CPosition.split(",");
								C1 = parseFloat(C[0]);
								C2 = parseFloat(C[1]);
								
								if (parseFloat(createPositionTimelast -rows[0].timeClick) > parseFloat(rows[0].timeMove)) 
								{
									TimeCheckMove = parseFloat(rows[0].timeMove);
								}else
								{
									TimeCheckMove = createPositionTimelast -rows[0].timeClick;								
								}
								//console.log("du lieu tinh toan: "+A+"_"+A1+"_"+A2+"_"+B+"_"+B1+"_"+B2+"_"
								//	+C1+"_"+C2+"_"+APosition+"_"+BPosition+"_"+CPosition);
								//kiểm tra position client với position trên server nếu trùng							
								if (parseFloat(Math.round(C2 * 100))===parseFloat(Math.round(A2 * 100)))
								{								
									connection.query('UPDATE unitinlocations SET Position = ? , PositionClick = ?  ,PositionClickTemp = ?  , timeMove = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ',
										[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick,currentSENDPOSITIONCLICK.Position,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
												currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11sdar34');
										}else
										{
											if(result.affectedRows > 0)
											{
												console.log("dữ liệu đúng");										
					        					
							                }
										}
									})	
								}else
								{
									X= A1+((TimeCheckMove)*(B1-A1))/parseFloat(rows[0].timeMove);
									Z= A2+((TimeCheckMove)*(B2-A2))/parseFloat(rows[0].timeMove);
									//console.log("===========2");		
									//console.log("vi tri set lai======= 2 : "+X+","+Z);
	    							if (getNumberDifferent(rows[0].UnitType,X,Z,C1,C2) === true) 
	    							{
	    								//console.log("===========2.1");
	    								connection.query('UPDATE unitinlocations SET Position = ? , PositionClick = ?  ,PositionClickTemp = ?  , timeMove = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ',
											[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick,currentSENDPOSITIONCLICK.Position, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
													currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query11safrwer');
											}else
											{
												if(result.affectedRows > 0)
												{
													//console.log("RECEIVEPOSITIONCLICK"+currentSENDPOSITIONCLICK.PositionClick);
						        					io.emit('RECEIVEPOSITIONCLICK',
													{
														PositionClick:currentSENDPOSITIONCLICK.PositionClick,													
														idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
								                	});
								                }
											}
										})	
	    							}else
	    							{
	    								//console.log("===========2.2");
	    								connection.query('UPDATE unitinlocations SET Position = ? , PositionClick = ?  ,PositionClickTemp = ?  , timeMove = ? ,TimeCheck = ?,timeClick = ?,CheckCreate = 0 WHERE idUnitInLocations = ? ',
											[X+","+Z,currentSENDPOSITIONCLICK.PositionClick,X+","+Z, (Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),Number((parseFloat(currentSENDPOSITIONCLICK.timeMove)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,
													currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query11ser3wq4');
											}else
											{
												if(result.affectedRows > 0)
												{
													//console.log("RECEIVEPOSITIONCLICK"+currentSENDPOSITIONCLICK.PositionClick);
						        					io.emit('RECEIVEPOSITIONCLICK',
													{
														PositionClick:currentSENDPOSITIONCLICK.PositionClick,
														Position:X+","+Z,
														idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
								                	});
								                }
											}
										})	
	    							}							  								    						 
								}								

							}else
							{
								console.log(" tang ca");
							}
						}
					});				
				});

			}else
			{
				//console.log("===========================================Cap nhat lai vi tri danh=====================================");
				//cập nhật lại vị trí đánh nhau
				//kiểm tra vị trí position click đã có người đứng chưa
				//console.log('running after 1 giây');
				var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [],arrayPositionClick = [];
				var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations;

				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				//kiểm tra thời gian về 0 của unit location
				//kiểm tra khi bắng thời gian của server
				//thực hiện random tìm vị trí mới
				//cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)	

				var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 1hfghf');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
		    				arraycheckUser.push(rows[i]);
				        }

					}
				})
				var query = pool.query("SELECT PositionClick FROM `unitinlocations` WHERE 1 ",function(error, rows,field)
				{
					if (!!error)
					{
						console.log('Error in the query 1gf');
					}else
					{
						for (var i = 0; i < rows.length; i++)
						{
		    				arrayPositionClick.push(rows[i]);
				        }

					}
				})				
													
				//update vị trị sau cùng và time move
				var query = pool.query('UPDATE unitinlocations SET Position =?, PositionClick = ? , timeMove = ?, TimeCheck = ? WHERE idUnitInLocations = ? AND CheckCreate !=1',[currentSENDPOSITIONCLICK.Position,currentSENDPOSITIONCLICK.PositionClick,(Math.round(currentSENDPOSITIONCLICK.timeMove * 100) / 100),parseFloat(createPositionTimelast),currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
				{
					if(!!error)
					{
						console.log('Error in the query113gfhgyuhgtfuy');
					}else
					{
						if (result.affectedRows> 0) {
							//console.log("Update location thanh cong khi het thoi gian");
							var query = pool.query("SELECT * FROM `unitinlocations` WHERE `timeMove`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
							{
								if (!!error)
								{
									console.log('Error in the query 2ghfgh');
								}else
								{
									for (var k = 0; k < rows.length; k++)
									{
										 arrayAllCheckTime.push(rows[k]);
							        }							        
										
									// console.log("so luong test : "+parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length));
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
										//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
										//	console.log("Chieu dai mang rong: "+arrayRandom.length);																				
										if (arrayRandom.length>0) 
										{														
											newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
											//arrayAllCheckTime[j].PositionClick = newLocation;
											arrA =	newLocation.split(",");
											arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
											//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
											//var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
											//console.log("s======= "+time);	
											var time=0;
											d = new Date();
											createPositionTimelast = Math.floor(d.getTime() / 1000);
											var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query112');
												}else
												{
													if (result.affectedRows> 0) {
														//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
														var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 2');
															}else
															{
																if (rows.length >0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		//arrayAllPositionchange.push(rows[i]);
																		console.log("Gui vi tri len client PositionClick============: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																		 //gửi vị trí cập nhật
																        io.emit('RECEIVEPOSITIONCHANGE',
																		{
														            		arrayAllPositionchange: rows[i],
														        		});		       
															        }

															    }
															}
														})
													}
													else
													{
														console.log('khong co time remain duoc cap nhat');
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
											//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
											//console.log("Chieu dai mang rong: "+arrayRandom.length);																					
											if (arrayRandom.length >0 ) {														
												newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
												//arrayAllCheckTime[j].PositionClick = newLocation;
												arrA =	newLocation.split(",");
												arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
												//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
												//var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
												//console.log("s======= "+time);	
												var time=0;
												d = new Date();
												createPositionTimelast = Math.floor(d.getTime() / 1000);
												var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query112');
													}else
													{
														if (result.affectedRows> 0) {
															//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
															var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
															{
																if (!!error)
																{
																	console.log('Error in the query 2');
																}else
																{
																	if (rows.length >0)
																	{
																		for (var i = 0; i < rows.length; i++)
																		{
																			//arrayAllPositionchange.push(rows[i]);
																			console.log("Gui vi tri len client PositionClick===========================: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																			 //gửi vị trí cập nhật
																	        io.emit('RECEIVEPOSITIONCHANGE',
																			{
															            		arrayAllPositionchange: rows[i],
															        		});		       
																        }

																    }
																}
															})
														}
														else
														{
															console.log('khong co time remain duoc cap nhat');
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
												//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
												//console.log("Chieu dai mang rong: "+arrayRandom.length);
												if (arrayRandom.length>0) {														
													newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
													//arrayAllCheckTime[j].PositionClick = newLocation;
													arrA =	newLocation.split(",");
													arrC =	currentSENDPOSITIONCLICK.PositionB.split(",");									
													//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
													var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
													//console.log("s======= "+time);	
													time=0;
													d = new Date();
													createPositionTimelast = Math.floor(d.getTime() / 1000);
													var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,currentSENDPOSITIONCLICK.idUnitInLocations],function(error, result, field)
													{
														if(!!error)
														{
															console.log('Error in the query112');
														}else
														{
															if (result.affectedRows> 0) {
																//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
																var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(currentSENDPOSITIONCLICK.idUnitInLocations)+"'",function(error, rows,field)
																{
																	if (!!error)
																	{
																		console.log('Error in the query 2');
																	}else
																	{
																		if (rows.length >0)
																		{
																			for (var i = 0; i < rows.length; i++)
																			{
																				//arrayAllPositionchange.push(rows[i]);
																				console.log("Gui vi tri len client PositionClick====================: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																				 //gửi vị trí cập nhật
																		        io.emit('RECEIVEPOSITIONCHANGE',
																				{
																            		arrayAllPositionchange: rows[i],
																        		});		       
																	        }

																	    }
																	}
																})
															}
															else
															{
																console.log('khong co time remain duoc cap nhat');
															}
														}
													})	
												}
											}

										}				
			
			

									}else
									{
										console.log("Đến vị trí do client set"+currentSENDPOSITIONCLICK.PositionB+"_"
											+currentSENDPOSITIONCLICK.idUnitInLocations+"_"
											+currentSENDPOSITIONCLICK.Position+"_"
											+currentSENDPOSITIONCLICK.PositionClick);
										io.emit('RECEIVEPOSITIONCLICK',
										{
											PositionClick:currentSENDPOSITIONCLICK.PositionClick,													
											idUnitInLocations:parseInt(currentSENDPOSITIONCLICK.idUnitInLocations,10),
					                	});

									}
							        
							    }
							});

						}
						else
						{
							//console.log('khong co time remain duoc cap nhat');
						}

					}
				});


			}
			

			socket.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONCLICK',currentSENDPOSITIONCLICK);
		});
		socket.on('SYNCANIMATION', function (data)
		{
			socket.broadcast.emit('RECEIVESYNCANIMATION',data);	
		});
		socket.on('SYNCCLICKATTACK', function (data)
		{
			socket.broadcast.emit('RECEIVESYNCCLICKATTACK',data);	
		});

		socket.on('SENDHEALTHRECOVER', function (data)
		{
			console.log("data"+data.idUnitInLocations);
			currentSENDHEALTHRECOVER =
			{
				idUnitInLocations:data.idUnitInLocations,
				HealthRemain:data.HealthRemain,
				Farm:data.Farm,
				Quality:data.Quality,
			}

			 console.log(currentSENDHEALTHRECOVER.idUnitInLocations+"_"+currentSENDHEALTHRECOVER.HealthRemain+"_"+currentSENDHEALTHRECOVER.Farm
			 		+"_"+currentSENDHEALTHRECOVER.Quality);
			pool.getConnection(function(err,connection)
			{		
				connection.query("SELECT HealthRemain,FarmEach,Quality,HealthEach, FarmPortable FROM `unitinlocations` WHERE `idUnitInLocations`='"+currentSENDHEALTHRECOVER.idUnitInLocations+"'",function(error, rows,field)
	        	{
					
					if(!!error)
					{
						console.log('Error in the query11rfwer34q');
					}else
					{
						if(rows.length > 0)
						{
							 console.log("tim thay");
							 console.log("1: "+currentSENDHEALTHRECOVER.idUnitInLocations+"_"+currentSENDHEALTHRECOVER.HealthRemain+"_"+currentSENDHEALTHRECOVER.Farm
							 	+"_"+currentSENDHEALTHRECOVER.Quality);
							 console.log("2: "+currentSENDHEALTHRECOVER.idUnitInLocations+"_"+parseFloat(rows[0].Quality)*parseFloat(rows[0].HealthEach)+"_"+parseFloat(rows[0].FarmEach)*0.5
							 		+"_"+rows[0].Quality);
							if (parseFloat(currentSENDHEALTHRECOVER.HealthRemain) === (parseFloat(rows[0].Quality)*parseFloat(rows[0].HealthEach))
								&& parseFloat(currentSENDHEALTHRECOVER.Farm) === parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].FarmEach)*0.5)
								&& parseFloat(currentSENDHEALTHRECOVER.Quality) === parseFloat(rows[0].Quality)) 
							{
								// console.log("dung du lieu");
								//cập nhật HealthRemail và farm của user
								connection.query('UPDATE unitinlocations SET HealthRemain = ?, FarmPortable= ?  WHERE idUnitInLocations = ? ',
									[parseInt(rows[0].Quality*rows[0].HealthEach,10),parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].FarmEach)*0.5),currentSENDHEALTHRECOVER.idUnitInLocations],function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query11sdf43');
									}else
									{
										if(result.affectedRows > 0)
										{	
											connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																					+currentSENDHEALTHRECOVER.idUnitInLocations+"'",function(error, rows,field)
											{
												if (!!error)
												{
													console.log('Error in the query4567');
												}else
												{																															
													client.set(currentSENDHEALTHRECOVER.idUnitInLocations,JSON.stringify(rows[0]));														
													if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDHEALTHRECOVER.idUnitInLocations)).length > 0 )
													{
														redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDHEALTHRECOVER.idUnitInLocations))].HealthRemain = parseInt(rows[0].Quality*rows[0].HealthEach,10);																																        
													}
												}
											})																			
				        					io.emit('RECEIVEHEALTHRECOVER',
											{
												CheckRECEIVEHEALTHRECOVER:1,												
						                	});
						                }
									}
								})								
							}
							else
							{
								//gửi mail báo cáo
								let transporter = nodemailer.createTransport({
								    service: 'gmail',
								    auth: {
								        user: 'aloevera.hoang@gmail.com',
								        pass: '123456@A'
								    }
								});

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
								transporter.sendMail(mailOptions, (error, info) => {
								    if (error) {
								        return console.log(error);
								    }
								    console.log('Message %s sent: %s', info.messageId, info.response);
								});
								// console.log("sai du lieu");
								io.emit('RECEIVEHEALTHRECOVER',
								{
									CheckRECEIVEHEALTHRECOVER:0,	
									idUnitInLocations:currentSENDHEALTHRECOVER.idUnitInLocations,
									HealthRemain:parseFloat(rows[0].Quality*rows[0].HealthEach),
									Farm:parseFloat(rows[0].FarmPortable),
									Quality:parseFloat(rows[0].Quality),		

			                	});
							}							
		                }
					}
				})			


			});

			socket.emit('SENDHEALTHRECOVER',currentSENDHEALTHRECOVER);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDHEALTHRECOVER',currentSENDHEALTHRECOVER);
		});

		socket.on('SENDFIGHTINGUNIT', function (data)
		{			
        	currentSENDFIGHTINGUNIT =
  			{
  				UnitOrderA:data.UnitOrderA,
  				UnitOrderB:data.UnitOrderB,
  				idUnitInLocationsA:data.idUnitInLocationsA,
  				idUnitInLocationsB:data.idUnitInLocationsB,
  				UserNameA:data.UserNameA,
  				UserNameB:data.UserNameB,
  			}  	
  			d = new Date();
			createPositionTimelast = Math.floor(d.getTime() / 1000);
			console.log("Client gửi Online=========================: "+ createPositionTimelast);		
			console.log("Data receive: "+ currentSENDFIGHTINGUNIT.UnitOrderA+"__"+ currentSENDFIGHTINGUNIT.UnitOrderB +"__"+currentSENDFIGHTINGUNIT.idUnitInLocationsA+"__"+
			currentSENDFIGHTINGUNIT.idUnitInLocationsB+"__"+currentSENDFIGHTINGUNIT.UserNameA+"__"+currentSENDFIGHTINGUNIT.UserNameB);
			//typeof arraysum[arraysum.findIndex(item => item.idUnitInLocations === 3)]  
			console.log("so luong danh:"+redisarray.length);				 			
			console.log("A: "+redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)));
			console.log("A lodash: "+lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)).length);
			console.log("B: "+redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)));  
			console.log("B lodash: "+lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)).length);  				
			
			if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)).length === 0 
				&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)).length === 0) {
				client.get(currentSENDFIGHTINGUNIT.idUnitInLocationsA, function (err, replies) 
				{  
					if (!replies) 
					{
						//  			
					console.log(currentSENDFIGHTINGUNIT.idUnitInLocationsA+ "is lose");					
					io.emit('RECEIVEFIGHTINGUNIT',
					{
						idUnitInLocations: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
						UserName:currentSENDFIGHTINGUNIT.UserNameA,
						UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderA),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
		   			});						   			

					}else
					{
						redisarray.push(JSON.parse(replies));
						console.log("Add array redis AB");
					} 								
						  																		
				});
				client.get(currentSENDFIGHTINGUNIT.idUnitInLocationsB, function (err, replies) 
				{    														
					if (!replies) 
					{
					console.log(currentSENDFIGHTINGUNIT.idUnitInLocationsB+ "is lose");
					io.emit('RECEIVEFIGHTINGUNIT',
					{
						idUnitInLocations: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
						UserName:currentSENDFIGHTINGUNIT.UserNameB,
						UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderB),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
		   			});						   			

					}else
					{
						redisarray.push(JSON.parse(replies));
						console.log("Add array redis AB");
					}	  																		
				});
			}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)).length === 0 ) 
			{						
				client.get(currentSENDFIGHTINGUNIT.idUnitInLocationsA, function (err, replies) 
				{  
					if (!replies) 
					{
						//  			
					console.log(currentSENDFIGHTINGUNIT.idUnitInLocationsA+ "is lose");					
					io.emit('RECEIVEFIGHTINGUNIT',
					{
						idUnitInLocations: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
						UserName:currentSENDFIGHTINGUNIT.UserNameA,
						UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderA),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
		   			});						   			

					}else
					{
						redisarray.push(JSON.parse(replies));
						console.log("Add array redis A");
					} 								
						  																		
				});	
			}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)).length === 0 ) 
			{
				client.get(currentSENDFIGHTINGUNIT.idUnitInLocationsB, function (err, replies) 
				{    														
					if (!replies) 
					{
					console.log(currentSENDFIGHTINGUNIT.idUnitInLocationsB+ "is lose");
					io.emit('RECEIVEFIGHTINGUNIT',
					{
						idUnitInLocations: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
						UserName:currentSENDFIGHTINGUNIT.UserNameB,
						UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderB),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
		   			});						   			

					}else
					{
						redisarray.push(JSON.parse(replies));
						console.log("Add array redis B");
					}	  																		
				});
			}

			// console.log("chieu dai array 1: "+ redisarray.length);
			// console.log("Dữ liệu ban đầu A: "+rows[0].HealthRemain+"_"+rows[0].DamageEach+"_"+rows[0].DefendEach+"_"+rows[0].Quality);
			// console.log("Dữ liệu ban đầu B: "+rows[1].HealthRemain+"_"+rows[1].DamageEach+"_"+rows[1].DefendEach+"_"+rows[1].Quality);
			//Tính Quality chênh lệch
			//if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)).length > 0 
			//	&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)).length > 0) 
			pool.getConnection(function(err,connection)
  			{
  				if (( parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA))].CheckOnline) 
  					+ parseFloat(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].CheckOnline)) ===2)
  				{  				
  					console.log("Hai user online");
  					if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA)).length > 0 && lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)).length > 0) 
	  				{
						QualityUnEqual = 0;
						//QualityUnEqual = parseInt(rows[0].Quality,10)/parseInt(rows[1].Quality,10);
						QualityUnEqual = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA))].Quality,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].Quality,10);
						// console.log("QualityUnEqual3: "+QualityUnEqual);
						if (QualityUnEqual < 1)
						{
							QualityUnEqual=1;
						}
						// Tính Defent tổng
						DefendSum = 0;
						//DefendSum = parseInt(rows[0].DamageEach,10)/parseInt(rows[1].HealthEach,10);
						DefendSum = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA))].DamageEach,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].HealthEach,10);
						console.log("DefendSumDefendSum3: "+DefendSum);
						if ((DefendSum % 1 ) >= 0.5)
						{
							DefendSum = Number((DefendSum).toFixed(0)); 								
						}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
						{
							DefendSum = Number((DefendSum).toFixed(0))+1;  								
						}else
						{
							DefendSum	= parseInt(DefendSum,10);  								
						}

						//HealthRemain = parseInt(rows[1].HealthRemain,10) -(parseFloat(QualityUnEqual)*parseInt(rows[0].DamageEach,10) - parseInt(DefendSum,10)* parseInt(rows[1].DefendEach,10)); 							
						HealthRemain = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].HealthRemain,10)
						 -(parseFloat(QualityUnEqual)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA))].DamageEach,10) 
						 	- parseInt(DefendSum,10)* parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].DefendEach,10)); 							
						
						console.log("Mau hien tai===========: "+HealthRemain);					
						if (HealthRemain<=0)
						{
							//xóa trong memory
							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB)), 1);									
							//xóa trong redis
							client.del(currentSENDFIGHTINGUNIT.idUnitInLocationsB);
							console.log(currentSENDFIGHTINGUNIT.idUnitInLocationsB+' is lose');
							io.emit('RECEIVEFIGHTINGUNIT',
							{
								idUnitInLocations: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
								UserName:currentSENDFIGHTINGUNIT.UserNameB,
								UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderB),
								HealthRemain:0,
								Quality:0,
								idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
				   			});				   			
							//Xóa trong database
							connection.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ? ',
							[currentSENDFIGHTINGUNIT.idUnitInLocationsB],function(error, result, field)
						  	{
								if(!!error)
								{
									console.log('Error in the queryfgfg');
								}else
								{
									if(result.affectedRows > 0)
									{
										//update lại unit order
										connection.query("SELECT * FROM `unitinlocations` where `UserName` = '"+currentSENDFIGHTINGUNIT.UserNameB
												+"'AND `UnitOrder` > '"+currentSENDFIGHTINGUNIT.UnitOrderB+"'",function(error, rows,field)
										{
											if (!!error)
											{
												console.log('Error in the query1');
											}else
											{
												if(rows.length > 0)
												{
													for (var i = 0; i < rows.length; i++)
													{
														connection.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
														[(parseInt(rows[i].UnitOrder, 10)-1),currentSENDFIGHTINGUNIT.UserNameB, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
														{
															if(!!error)
															{
	                          									console.log('Error in the query11sdfsdfjhg');

															}else
															{
																//connection.release();						  											
																//update userFight and checkFight																	

															}
														})
													}
													connection.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
													[currentSENDFIGHTINGUNIT.idUnitInLocationsA],function(error, result, field)
													{
														if(!!error)
														{
                          									console.log('Error in the query11sdf43');

														}else
														{
															//connection.release();						  											
															//update userFight and checkFight
															
														}
													})
												}
											}
										})

									}else
									{
										console.log('khong co gi update');
									}
								}
							})
						}else
						{
							QualityRemain = 0;
							//QualityRemain = parseInt(HealthRemain,10)/parseInt(rows[1].HealthEach,10);
							QualityRemain = parseInt(HealthRemain,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].HealthEach,10);

							if ((QualityRemain % 1 ) >= 0.5)
							{
								QualityEnd = Number((QualityRemain).toFixed(0));  									

							}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
							{
								QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
							}else
							{
								QualityEnd	= parseInt(QualityRemain,10);  									
							}
							//console.log("================Data send: "+rows[1].idUnitInLocations+"_"+HealthRemain+"_"+QualityEnd);
				           // d = new Date();
				            //console.log("Milisecond: "+Math.floor(d.getTime()));
				            io.emit('RECEIVEFIGHTINGUNIT',
				            {
				                idUnitInLocations:parseInt(currentSENDFIGHTINGUNIT.idUnitInLocationsB),
				                UserName:currentSENDFIGHTINGUNIT.UserNameB,
				                UnitOrder:parseFloat(currentSENDFIGHTINGUNIT.UnitOrderB),
				                HealthRemain:HealthRemain,
				                Quality:QualityEnd,
				                idUnitInLocationsA: parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsA),
				            });	           
				   
							//DamageRemain = parseInt(QualityEnd,10)*parseInt(rows[1].DamageEach,10);
							DamageRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].DamageEach,10);
							//DefendRemain = parseInt(QualityEnd,10)*parseInt(rows[1].DefendEach,10);
							DefendRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].DefendEach,10);
							//cập nhật các thông số còn lại trong memory
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].HealthRemain = HealthRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].Damage = DamageRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].Defend = DefendRemain;
							redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))].Quality = QualityEnd;
							//cập nhật redis và data base
							console.log(HealthRemain+"_"+DamageRemain+"_"+DefendRemain+"_"+QualityEnd);	
							//console.log("du lieu luu redis: "+JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))]));											
							client.set(currentSENDFIGHTINGUNIT.idUnitInLocationsB,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDFIGHTINGUNIT.idUnitInLocationsB))]), redis.print);
							client.mget(currentSENDFIGHTINGUNIT.idUnitInLocationsB, function (err, replies) 
							{
								if (err) 
								{
									console.log(err);
								}else
								{									
							       	var objectValue = JSON.parse(replies);	
							       	d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);							         
									connection.query("UPDATE unitinlocations SET userFight = '"+currentSENDFIGHTINGUNIT.idUnitInLocationsA+"' ,HealthRemain = '"+parseFloat(objectValue['HealthRemain'])+"' , Damage = '"+parseFloat(objectValue['Damage'])+"' , Defend = '"+parseFloat(objectValue['Defend'])+"' , Quality = '"+parseFloat(objectValue['Quality'])+"', TimeFight = '"+parseFloat(createPositionTimelast)+"', CheckFight = 1  WHERE idUnitInLocations = '"+currentSENDFIGHTINGUNIT.idUnitInLocationsB+"'",function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query11dsf');
										}else
										{  										
											if(result.affectedRows > 0)
											{ 	
												connection.query("UPDATE unitinlocations SET userFight = '"+currentSENDFIGHTINGUNIT.idUnitInLocationsB+"' ,TimeFight = '"+parseFloat(createPositionTimelast)+"',CheckFight = 1 WHERE idUnitInLocations = '"+currentSENDFIGHTINGUNIT.idUnitInLocationsA+"'",function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query11dsfdfdfe');
													}else
													{  										
														if(result.affectedRows > 0)
														{ 											 
															connection.release();
														}
													}
												})									 
												
											}
										}
									}) 										
							    									
								}
							    
							});
						}
					}else
					{
						console.log("LOSE");
					}
  				}  							
  					
			});
			
						
			socket.emit('SENDFIGHTINGUNIT',currentSENDFIGHTINGUNIT);
			socket.broadcast.emit('SENDFIGHTINGUNIT',currentSENDFIGHTINGUNIT);
		});
		socket.on('SENDUNITAvsB', function (data)
		{
			currentSENDUNITAvsB =
			{
				idUnitInLocationsA:data.idUnitInLocationsA,	
				UserNameA: data.UserNameA,
				UnitOrderA: data.UnitOrderA,

				idUnitInLocationsB: data.idUnitInLocationsB,	
				UserNameB: data.UserNameB,
				UnitOrderB: data.UnitOrderB,			
						
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			console.log("nhan data client  vào tam danh: ====================================="+currentSENDUNITAvsB.idUnitInLocationsA				
				+"_"+currentSENDUNITAvsB.UserNameA
				+"_"+currentSENDUNITAvsB.UnitOrderA				
				+"_"+currentSENDUNITAvsB.idUnitInLocationsB
				+"_"+currentSENDUNITAvsB.UserNameB				
				+"_"+currentSENDUNITAvsB.UnitOrderB);	

			if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(currentSENDUNITAvsB.idUnitInLocationsA)).length === 0 
			&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDUNITAvsB.idUnitInLocationsB)).length === 0) {				
				client.get(currentSENDUNITAvsB.idUnitInLocationsA, function (err, replies) 
				{  
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					} 								
						  																		
				});
				client.get(currentSENDUNITAvsB.idUnitInLocationsB, function (err, replies) 
				{    														
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					}	  																		
				});
			}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDUNITAvsB.idUnitInLocationsA)).length === 0 ) 
			{								
				client.get(currentSENDUNITAvsB.idUnitInLocationsA, function (err, replies) 
				{  
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					} 								
						  																		
				});	
			}else 
			{
				client.get(currentSENDUNITAvsB.idUnitInLocationsB, function (err, replies) 
				{    														
					if (!replies){}else
					{	redisarray.push(JSON.parse(replies));						
					}	  																		
				});
			}	


			if (arrayAvsB.length > 0) 
			{			
				if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === currentSENDUNITAvsB.idUnitInLocationsA)).length===0) 
				{					
					arrayAvsB.push(currentSENDUNITAvsB);					
				}else
				{
					console.log("đa ton tai va danh tiep");					
				}
			}else
			{			
				arrayAvsB.push(currentSENDUNITAvsB);							
								
			}	
			console.log("chieu dai mang sau khi add vao tam danh: "+arrayAvsB.length );			
								

			socket.emit('SENDPOSITIONFIGHTOFFLINEvsONLINE',currentSENDUNITAvsB);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTOFFLINEvsONLINE',currentSENDUNITAvsB);
		});
		socket.on('SENDUNITAoutB', function (data)
		{
			console.log("chieu dai mang sau khi ra khoi tam danh tam danh SENDUNITAoutB: "+arrayAvsB.length );	
			currentSENDUNITAoutB =
			{
				idUnitInLocationsA:data.idUnitInLocationsA,				
				idUnitInLocationsB:data.idUnitInLocationsB,			
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			console.log("ra khoi tam danh:======================================="+ currentSENDUNITAoutB.idUnitInLocationsA+"_"+currentSENDUNITAoutB.idUnitInLocationsB);
			console.log("chieu dai id oflline: "+currentSENDUNITAoutB.idUnitInLocationsA.length);
			console.log("Thoi gian nhan SENDUNITAoutB: "+ createPositionTimelast);				
			if (arrayAvsB.length > 0) 
			{
				if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === currentSENDUNITAoutB.idUnitInLocationsA)).length > 0) 
				{
					arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === currentSENDUNITAoutB.idUnitInLocationsA), 1);	
					//cập nhật memory redis
					if (parseFloat((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === currentSENDUNITAoutB.idUnitInLocationsA)).length
						+((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === currentSENDUNITAoutB.idUnitInLocationsA)).length) === 0)) 
					{
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDUNITAoutB.idUnitInLocationsA)), 1);					
					}																							
													
					if (parseFloat((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === currentSENDUNITAoutB.idUnitInLocationsB)).length
						+((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === currentSENDUNITAoutB.idUnitInLocationsB)).length) === 0)) 
					{
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDUNITAoutB.idUnitInLocationsB)), 1);																	
					}	
					pool.getConnection(function(err,connection)
					{
						//cập nhật my sql
						connection.query("UPDATE unitinlocations SET CheckFight = 0  WHERE idUnitInLocations = '"+currentSENDUNITAoutB.idUnitInLocationsA+"'",function(error, result, field)
						{
							if(!!error)
							{
								console.log('Error in the query11dsf');
							}else
							{  										
								if(result.affectedRows > 0)
								{ 	
									
									connection.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`, `Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`CheckFight` FROM `unitinlocations` WHERE `idUnitInLocations` = '"
																			+currentSENDUNITAoutB.idUnitInLocationsA+"'",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query4567');
										}else
										{	
											if (rows.length > 0) 
											{
												console.log("======================UserNameA"+ currentSENDUNITAoutB.idUnitInLocationsA+"roi kgoi tầm đánh=============="+currentSENDUNITAoutB.idUnitInLocationsB)
												//cập nhật redis
												client.set(currentSENDUNITAoutB.idUnitInLocationsA,JSON.stringify(rows[0]));
												//cập nhật mảng đánh												
												connection.release();
											}																													
											
										}
									})
			
								}
							}
						})
					});
					
				}

			}					
			socket.emit('SENDPOSITIONFIGHTONLINEoutOFFLINE',currentSENDUNITAoutB);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTONLINEoutOFFLINE',currentSENDUNITAoutB);
		});
		socket.on('SENDPOSITIONFIGHTOFFLINEvsONLINE', function (data)
		{
			currentSENDPOSITIONFIGHTOFFLINEvsONLINE =
			{
				idUnitInLocationsOffline:data.idUnitInLocationsOffline,	
				UserNameOffline: data.UserNameOffline,
				UnitOrderOffline: data.UnitOrderOffline,

				idUnitInLocationsOnline: data.idUnitInLocationsOnline,	
				UserNameOnline: data.UserNameOnline,
				UnitOrderOnline: data.UnitOrderOnline,

				idUnitInLocationsTemp: data.idUnitInLocationsTemp,	
				UserNameTemp: data.UserNameTemp,
				UnitOrderTemp: data.UnitOrderTemp,
						
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			console.log("nhan data client SENDPOSITIONFIGHTOFFLINEvsONLINE: "+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline				
				+"_"+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.UserNameOffline
				+"_"+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.UnitOrderOffline				
				+"_"+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOnline
				+"_"+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.UserNameOnline				
				+"_"+currentSENDPOSITIONFIGHTOFFLINEvsONLINE.UnitOrderOnline);	

			if (lodash.filter(redisarray, x => x.idUnitInLocations ===  parseFloat(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline)).length === 0 
			&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOnline)).length === 0) {				
				client.get(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline, function (err, replies) 
				{  
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					} 								
						  																		
				});
				client.get(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOnline, function (err, replies) 
				{    														
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					}	  																		
				});
			}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline)).length === 0 ) 
			{								
				client.get(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline, function (err, replies) 
				{  
					if (!replies) {}else
					{
						redisarray.push(JSON.parse(replies));						
					} 								
						  																		
				});	
			}else 
			{
				client.get(currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOnline, function (err, replies) 
				{    														
					if (!replies){}else
					{	redisarray.push(JSON.parse(replies));						
					}	  																		
				});
			}	


			if (arrayFightOffline.length > 0) 
			{			
				if ((lodash.filter(arrayFightOffline, x => x.idUnitInLocationsOffline === currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline)).length===0) 
				{					
					arrayFightOffline.push(currentSENDPOSITIONFIGHTOFFLINEvsONLINE);					
				}else
				{
					console.log("đa ton tai va danh tiep");					
				}
			}else
			{			
				arrayFightOffline.push(currentSENDPOSITIONFIGHTOFFLINEvsONLINE);							
								
			}	
			console.log("chieu dai mang sau khi add vao tam danh: "+arrayFightOffline.length );					
								

			socket.emit('SENDPOSITIONFIGHTOFFLINEvsONLINE',currentSENDPOSITIONFIGHTOFFLINEvsONLINE);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTOFFLINEvsONLINE',currentSENDPOSITIONFIGHTOFFLINEvsONLINE);
		});
		socket.on('SENDPOSITIONFIGHTONLINEoutOFFLINE', function (data)
		{
			console.log("chieu dai mang sau khi ra khoi tam danh tam danh: "+arrayFightOffline.length );	
			currentSENDPOSITIONFIGHTONLINEoutOFFLINE =
			{
				idUnitInLocationsOnline:data.idUnitInLocationsOnline,				
				idUnitInLocationsOffline:data.idUnitInLocationsOffline,			
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			// console.log("ra khoi tam danh: "+ currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOnline				
			// 	+"_"+currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOffline);
			// console.log("chieu dai id oflline: "+currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOffline.length);
			// console.log("Thoi gian nhan: "+ createPositionTimelast);				
			if (arrayFightOffline.length > 0) 
			{
				if ((lodash.filter(arrayFightOffline, x => x.idUnitInLocationsOffline === currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOffline)).length > 0) {
					arrayFightOffline.splice(arrayFightOffline.findIndex(item => item.idUnitInLocationsOffline === currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOffline), 1);														
					redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOffline)), 1);					
					//lodash.filter(arraysum, x => x.idUnitInLocationsOnline === "393").length
					if (((lodash.filter(arrayFightOffline, x => x.idUnitInLocationsOnline === currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOnline)).length === 0)) 
					{
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEoutOFFLINE.idUnitInLocationsOnline)), 1);					
						console.log("===============unit rởi khỏi tầm đánh offline=======================================" );
					}
				}



			}					
			socket.emit('SENDPOSITIONFIGHTONLINEoutOFFLINE',currentSENDPOSITIONFIGHTONLINEoutOFFLINE);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTONLINEoutOFFLINE',currentSENDPOSITIONFIGHTONLINEoutOFFLINE);
		});
		socket.on('SENDPOSITIONFIGHTONLINEvsOFFLINE', function (data)
		{
			currentSENDPOSITIONFIGHTONLINEvsOFFLINE =
			{
				idUnitInLocationsOnline: data.idUnitInLocationsOnline,	
				UserNameOnline: data.UserNameOnline,
				UnitOrderOnline: data.UnitOrderOnline,

				idUnitInLocationsOffline:data.idUnitInLocationsOffline,	
				UserNameOffline: data.UserNameOffline,
				UnitOrderOffline: data.UnitOrderOffline,		
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			console.log("nhan data client: "+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline				
				+"_"+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.UserNameOnline
				+"_"+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.UnitOrderOnline				
				+"_"+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline
				+"_"+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.UserNameOffline				
				+"_"+currentSENDPOSITIONFIGHTONLINEvsOFFLINE.UnitOrderOffline);	
			if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline)).length === 0 
				&& lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline)).length === 0) {
					console.log("===========111111111====="); 
					client.get(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline, function (err, replies) 
					{ 
						if (!replies) 
						{					  			
							

						}else
						{
							redisarray.push(JSON.parse(replies));
							console.log("Add array redis AB");
						} 								
							  																		
					});
					client.get(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline, function (err, replies) 
					{    														
						if (!replies) 
						{											   			

						}else
						{
							redisarray.push(JSON.parse(replies));
							console.log("Add array redis AB");
						}	  																		
					});
				}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline)).length === 0 ) 
				{										
					client.get(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline, function (err, replies) 
					{  
						if (!replies) 
						{										   			

						}else
						{
							redisarray.push(JSON.parse(replies));
							console.log("Add array redis A");
						} 								
							  																		
					});	
				}else if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline)).length === 0 ) 
				{
					console.log("===========1111111113333333333333====="); 
					client.get(currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline, function (err, replies) 
					{    														
						if (!replies) 
						{													   			

						}else
						{
							redisarray.push(JSON.parse(replies));
							console.log("Add array redis B");
						}	  																		
					});
				}		


			if (arrayFightOnlinevsOffline.length > 0) {			
				if ((lodash.filter(arrayFightOnlinevsOffline, x => x.idUnitInLocationsOnline === currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOnline)).length===0) 
				{
					// console.log("lay gia tri trong mang: "
					// 	+arrayFightOffline[arrayFightOffline.findIndex(item => item.idUnitInLocationsOffline === currentSENDPOSITIONFIGHTONLINEvsOFFLINE.idUnitInLocationsOffline)].idUnitInLocationsOffline);						
					console.log("add vao mang");
					arrayFightOnlinevsOffline.push(currentSENDPOSITIONFIGHTONLINEvsOFFLINE);
					console.log("chieu dai mang sau khi add vao tam danh: "+arrayFightOnlinevsOffline.length);
				}else
				{
					console.log("đa ton tai va danh tiep");					
				}
			}else
			{				
				console.log("add vao mang lan dau ");
				arrayFightOnlinevsOffline.push(currentSENDPOSITIONFIGHTONLINEvsOFFLINE);
				console.log("chieu dai mang sau khi add vao tam danh: "+arrayFightOnlinevsOffline.length );					
			}					
								

			socket.emit('SENDPOSITIONFIGHTONLINEvsOFFLINE',currentSENDPOSITIONFIGHTONLINEvsOFFLINE);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTONLINEvsOFFLINE',currentSENDPOSITIONFIGHTONLINEvsOFFLINE);
		});
		socket.on('SENDPOSITIONFIGHTONLINEoutOFFLINEmove', function (data)
		{
			currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove =
			{
				idUnitInLocationsOnline:data.idUnitInLocationsOnline,				
				idUnitInLocationsOffline:data.idUnitInLocationsOffline,			
			}
			d = new Date();
    		createPositionTimelast = Math.floor(d.getTime()); 
    		
			// console.log("ra khoi tam danh: "+ currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOnline				
			// 	+"_"+currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOffline);
			// console.log("chieu dai id oflline: "+currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOffline.length);
			// console.log("Thoi gian nhan: "+ createPositionTimelast);
			if (arrayFightOnlinevsOffline.length > 0) 
			{
				if ((lodash.filter(arrayFightOnlinevsOffline, x => x.idUnitInLocationsOnline === currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOnline)).length > 0) {
					// console.log("lay gia tri trong mang: "
					// 	+arrayFightOffline[arrayFightOffline.findIndex(item => item.idUnitInLocationsOffline === currentSENDPOSITIONFIGHTOFFLINEvsONLINE.idUnitInLocationsOffline)].idUnitInLocationsOffline);
					arrayFightOnlinevsOffline.splice(arrayFightOnlinevsOffline.findIndex(item => item.idUnitInLocationsOnline === currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOnline), 1);														
					redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove.idUnitInLocationsOnline)), 1);
				}		
			}					
			socket.emit('SENDPOSITIONFIGHTONLINEoutOFFLINEmove',currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove);
			//socket.emit('USER_CONNECTED',currentBaseSend );
			socket.broadcast.emit('SENDPOSITIONFIGHTONLINEoutOFFLINEmove',currentSENDPOSITIONFIGHTONLINEoutOFFLINEmove);
		});			
	});	
	
	function getRandomIntInclusive(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
	  	return Math.floor(Math.random() * (max - min + 1)) + min;
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
					if (S1 >=0.1 || S2 >= 0.1) {
						return false;
					}else
					{
						return true;
					}
				}else
				{
					S2 = parseFloat(B2) - parseFloat(A2);
					if (S1 >=0.1 || S2 >= 0.1) {
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
					if (S1 >=0.1 || S2 >= 0.1) {
						return false;
					}else
					{
						return true;
					}
				}else
				{
					S2 = parseFloat(B2) - parseFloat(A2);
					if (S1 >=0.1 || S2 >= 0.1) {
						return false;
					}else
					{
						return true;
					}
				}
			}
		}		
	}
	
	function getNewLocation(X,Z,N,M)
	{
		if (M===0) {
			numberDistance = parseInt(getRandomIntInclusive(2, 6),parseN);
		}else{
			numberDistance = parseInt(getRandomIntInclusive(1, 4),parseN);
		}

		X = parseInt(X, parseN);
		Z = parseInt(Z, parseN);
		switch(N)
		{
			//random theo đường thẳng
			case 1:
				if(X>=0 && X<=(limitNumber - numberDistance))
				{
					X = X + numberDistance;
				}
				break;
			case 2:
				if(X>=numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
			  	break;
			case 3:
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 4:
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}
			  	break;
			  	//random theo đường chéo

			case 5:
				if(X>=0 && X<=(limitNumber -numberDistance))
				{
					X = X + numberDistance;
				}
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}

				break;
			case 6:
				if(X>=0 && X<=(limitNumber - numberDistance))
				{
					X = X + numberDistance;
				}
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 7:
				if(X>=numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 8:
				if(X>= numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}
			  	break;

		}
		return X+","+Z;
	}

	function getNewLocationClick(X,Z,N,M)
	{
		numberDistance = parseInt(N,parseN);
		X = parseInt(X, parseN);
		Z = parseInt(Z, parseN);
		switch(M)
		{
			//random theo đường thẳng
			case 1:
				if(X>=0 && X<=(limitNumber - numberDistance))
				{
					X = X + numberDistance;
				}
				break;
			case 2:
				if(X>=numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
			  	break;
			case 3:
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 4:
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}
			  	break;
			  	//random theo đường chéo

			case 5:
				if(X>=0 && X<=(limitNumber -numberDistance))
				{
					X = X + numberDistance;
				}
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}

				break;
			case 6:
				if(X>=0 && X<=(limitNumber - numberDistance))
				{
					X = X + numberDistance;
				}
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 7:
				if(X>=numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
				if(Z <= -numberDistance && Z>=-limitNumber)
				{
					Z = Z + numberDistance;
				}
			  	break;
			case 8:
				if(X>= numberDistance && X<=limitNumber)
				{
					X = X - numberDistance;
				}
				if(Z<=0 && Z>=(-limitNumber + numberDistance))
				{
					Z = Z - numberDistance;
				}
			  	break;

		}
		return X+","+Z;
	}

	function myFuncReset()
	{
		var arrayAllUserposition = [],arrayMineposition = [],
		arrayAllMine = [], arrayAllMineName = [], arrayAllMinePosition = [], arrayAllMineMerger = [];			
		const k = [1000];
		const asyncFunc = (timeout) => {
			return new Promise((resolve,reject) => {
				setTimeout(() => { 
					//console.log('1: ', timeout); 
					//reset mine
					var query = pool.query('DELETE FROM userasset WHERE userNameOwner = ?', [""],function(error, result, field)
				  	{
						if(!!error)
						{
							console.log('Error in the queryfgfg34');
						}else
						{
							if(result)
							{
								console.log('Format mine chưa co nguoi chiem thanh cong');
							}else
							{
								console.log('Format mine chưa co nguoi chiem that bai');
							}
						}
					})

					resolve(); 
				}, timeout)
		    }).then(() => {
				return new Promise((resolve,reject) => {
				  setTimeout(() => { 
				  	//console.log('2: ', timeout);
				  	//select tất cả vị trí 
				  	var query = pool.query("SELECT Position FROM `userbase` WHERE `Position`!='' UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 1');
						}else
						{
							for (var i = 0; i < rows.length; i++)
							{
		        				arrayAllUserposition.push(rows[i].Position);
					        }

						}
					})
					var query = pool.query("SELECT PositionClick FROM `unitinlocations` WHERE timeMove = 0",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the queryghgf');
						}else
						{
							for (var i = 0; i < rows.length; i++)
							{
		        				arrayAllMinePosition.push(rows[i].PositionClick);
					        }
						}
					})
				  	resolve(); 
				  }, timeout)
		        });
			}).then(() => {
				return new Promise((resolve,reject) => {
				  setTimeout(() => { 
				  	//console.log('2: ', timeout); 
				  	//create mine	
				  	var query = pool.query("SELECT * FROM `itemmine` WHERE 1",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 2fgjgj');
						}else
						{
							for (var i = 0; i < rows.length; i++)
							{
								arrayAllMine.push(rows[i].IDMine);
								arrayAllMineName.push(rows[i].NameMine);
					        }
						    arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
						    for (var k = 0; k <arrayAllUserposition.length; k++)
						    {
								for (var i = 0; i <4; i++)
								{
									var iMine = getRandomIntInclusive(1,8), M=1;
									var arrMine = arrayAllUserposition[k].split(",");
									arrayMineposition[i] = getNewLocation(arrMine[0],arrMine[1],iMine,M);
									while(arrayAllMineMerger.indexOf(arrayMineposition[i])>=1)
									{
										iMine = getRandomIntInclusive(1,8);
										arrayMineposition[i] = getNewLocation(arrMine[0],arrMine[1],iMine,M);
									}
									arrayAllMineMerger.push(arrayMineposition[i]);
								}
								//Insert mine
								var records = [
						            ["",arrayAllMine[0],arrayAllMineName[0], arrayMineposition[0],1,1],
						            ["",arrayAllMine[1],arrayAllMineName[1], arrayMineposition[1],1,1],
						            ["",arrayAllMine[2],arrayAllMineName[2], arrayMineposition[2],1,1],
						            ["",arrayAllMine[3],arrayAllMineName[3], arrayMineposition[3],1,1]
								];
								var sql = "INSERT INTO userasset (userNameOwner,idMine,nameMine,Position,Level,Time) VALUES ?";
								var query = pool.query(sql, [records], function(err, result)
								{
								    if(!!err)
								    {
							         	console.log('Error in the query 3');
						            }else
						            {
										if(result)
										{
											console.log('Create mine thanh cong');
										}else
										{
											console.log('Create mine that bai');
										}
						            }
								});
							}
						}
					})				  	
				  	resolve(); 
				  }, timeout)
		        });
			}).then(() => {
				return new Promise((resolve,reject) => {
				  setTimeout(() => { 
				  	//console.log('2: ', timeout);
					//Cập nhật time reset mine cho user
					d = new Date();
					createPositionTimelast = Math.floor(d.getTime() / 1000);
			    	var query = pool.query('UPDATE users SET timeResetMine = ? WHERE timeResetMine != ?', [createPositionTimelast, ""],function(error, result, field)
					{
						if(!!error)
						{
							console.log('Error in the queryhgjh');
						}else
						{
							if(result)
							{
								console.log('cap nhat thời gian reset server cho user đang đăng nhập thanh cong');
							}else
							{
								console.log('cap nhat that bai');
							}
						}
					});
				  	resolve(); 
				  }, timeout)
		        });
			}).then(() => {
				return new Promise((resolve,reject) => {
				  setTimeout(() => { 
				  	//console.log('2: ', timeout);
				  	//update check
				  	var query = pool.query('UPDATE userbase SET checkResetMine = ? WHERE Position != ?', [1, ""],function(error, result, field)
					{
						if(!!error)
						{
							console.log('Error in the queryghg');
						}else
						{
							console.log("cong dong updatedgdfgdg======================: "+result.affectedRows);
							if(result)
							{
								console.log('cap nhat tinh trang reset server cho user thanh cong');
							}else
							{
								console.log('cap nhat that bai');
							}
						}
					}); 
				  	resolve(); 
				  }, timeout)
		        });
			});
		}
		k.reduce((promise, item) => {
		  return promise.then(() => asyncFunc(item));
		}, Promise.resolve());
	}	
	function randomValueHex (len) {
	    return crypto.randomBytes(Math.ceil(len/2))
	        .toString('hex') // convert to hexadecimal format
	        .slice(0,len).toUpperCase();   // return required number of characters
	}

	var jobResetMine = new CronJob(
	{
		//cronTime: '00 55 08 * * 0-6',
	  	cronTime: timeResetMines,
	  	onTick: function()
	  	{
	    	console.log('reset Mine');
	    	myFuncReset();
	    	jobResetMine.stop();
	  	},
	  	onComplete: function()
	  	{
	    	//jobCreateMine.start();
	    	//console.log('jobResetMine status', jobResetMine.running);
			//console.log('jobCreateMine status', jobCreateMine.running);
	 	},
	  	start: false,
	  	timeZone: 'Asia/Ho_Chi_Minh'
	});
	jobResetMine.start();

	//Cập nhật liên tục cho các dữ liệu cần kiểm tra
	cron.schedule('*/1 * * * * *', function()
	{
		//cập nhật lai data passrecover 
		d = new Date();
    	createPositionTimelast = Math.floor(d.getTime() / 1000);	
		var query = pool.query("UPDATE `users` SET `password_recover_key`='',`password_recover_key_expire`='' WHERE `password_recover_key_expire`= '"+parseFloat(createPositionTimelast)+"'",function(error, result, field)
		{					           
            if(!!error) 
            {	
            	console.log('Error in the querygfvhgh56gf');
            }else
            {

            }
		});
	});

	//kiểm tra vị trí trùng sau khi hết thời gian di chuyển
	cron.schedule('*/1 * * * * *', function()
	{		
		//console.log('running after 1 giây');
		var arrayAllCheckTime = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUser = [], arrayExpireTimeMove = [],arrayPositionClick = [];
		var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,MoveSpeedEach,j,idUnitInLocations;

		d = new Date();
		createPositionTimelast = Math.floor(d.getTime() / 1000);
		//kiểm tra thời gian về 0 của unit location
		//kiểm tra khi bắng thời gian của server
		//thực hiện random tìm vị trí mới
		//cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)		

		var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
		{
			if (!!error)
			{
				console.log('Error in the query 1hfghf');
			}else
			{
				for (var i = 0; i < rows.length; i++)
				{
    				arraycheckUser.push(rows[i]);
		        }

			}
		})
		var query = pool.query("SELECT PositionClick FROM `unitinlocations` WHERE 1 ",function(error, rows,field)
		{
			if (!!error)
			{
				console.log('Error in the query 1gf');
			}else
			{
				for (var i = 0; i < rows.length; i++)
				{
    				arrayPositionClick.push(rows[i]);
		        }

			}
		})
		
											
		//update vị trị sau cùng và time move
		var query = pool.query('UPDATE unitinlocations SET Position = PositionClick , timeMove = ? WHERE TimeCheck =? AND CheckCreate !=1',[0,parseFloat(createPositionTimelast)],function(error, result, field)
		{
			if(!!error)
			{
				console.log('Error in the query113gfhjfgj65');
			}else
			{
				if (result.affectedRows> 0) {
					//console.log("Update location thanh cong khi het thoi gian");
					var query = pool.query("SELECT * FROM `unitinlocations` WHERE `timeMove`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
					{
						if (!!error)
						{
							console.log('Error in the query 2ghfgh');
						}else
						{
							for (var k = 0; k < rows.length; k++)
							{
								 arrayAllCheckTime.push(rows[k]);
					        }
					        for (var j = 0; j < arrayAllCheckTime.length; j++)
							{
								
								// console.log("so luong test : "+parseFloat((lodash.filter(arraycheckUser, x => x.Position === arrayAllCheckTime[j].PositionClick)).length+lodash.filter(arrayAllCheckTime, x => x.PositionClick === arrayAllCheckTime[j].PositionClick).length));
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
									//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
									//	console.log("Chieu dai mang rong: "+arrayRandom.length);																				
									if (arrayRandom.length>0) 
									{														
										newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
										arrayAllCheckTime[j].PositionClick = newLocation;
										arrA =	newLocation.split(",");
										arrC =	arrayAllCheckTime[j].Position.split(",");									
										//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
										var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
										//console.log("s======= "+time);	
										time=0;
										d = new Date();
										createPositionTimelast = Math.floor(d.getTime() / 1000);
										var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
										{
											if(!!error)
											{
												console.log('Error in the query112');
											}else
											{
												if (result.affectedRows> 0) {
													//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
													var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
													{
														if (!!error)
														{
															console.log('Error in the query 2');
														}else
														{
															if (rows.length >0)
															{
																for (var i = 0; i < rows.length; i++)
																{
																	//arrayAllPositionchange.push(rows[i]);
																	//console.log("Gui vi tri len client Duplicate: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																	 //gửi vị trí cập nhật
															        io.emit('RECEIVEPOSITIONCHANGE',
																	{
													            		arrayAllPositionchange: rows[i],
													        		});		       
														        }

														    }
														}
													})
												}
												else
												{
													console.log('khong co time remain duoc cap nhat');
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
										//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
										//console.log("Chieu dai mang rong: "+arrayRandom.length);																					
										if (arrayRandom.length >0 ) {														
											newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
											arrayAllCheckTime[j].PositionClick = newLocation;
											arrA =	newLocation.split(",");
											arrC =	arrayAllCheckTime[j].Position.split(",");									
											//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
											var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
											//console.log("s======= "+time);	
											time=0;
											d = new Date();
											createPositionTimelast = Math.floor(d.getTime() / 1000);
											var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query112');
												}else
												{
													if (result.affectedRows> 0) {
														//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
														var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
														{
															if (!!error)
															{
																console.log('Error in the query 2');
															}else
															{
																if (rows.length >0)
																{
																	for (var i = 0; i < rows.length; i++)
																	{
																		//arrayAllPositionchange.push(rows[i]);
																		//console.log("Gui vi tri len client Duplicate: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																		 //gửi vị trí cập nhật
																        io.emit('RECEIVEPOSITIONCHANGE',
																		{
														            		arrayAllPositionchange: rows[i],
														        		});		       
															        }

															    }
															}
														})
													}
													else
													{
														console.log('khong co time remain duoc cap nhat');
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
											//console.log("Chieu dai random: "+getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1));
											//console.log("Chieu dai mang rong: "+arrayRandom.length);
											if (arrayRandom.length>0) {														
												newLocation=arrayRandom[getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];									 									
												arrayAllCheckTime[j].PositionClick = newLocation;
												arrA =	newLocation.split(",");
												arrC =	arrayAllCheckTime[j].Position.split(",");									
												//console.log("Kiem tra du lieu truoc khi rondom: "+newLocation+"_"+arrC+"__"+PositionClickCheckTime+"__"+arrA[0]+"__"+arrC[0]+"__"+arrA[1]+"__"+arrC[1]);
												var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTime[j].MoveSpeedEach);
												//console.log("s======= "+time);	
												time=0;
												d = new Date();
												createPositionTimelast = Math.floor(d.getTime() / 1000);
												var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(createPositionTimelast)).toFixed(0)),createPositionTimelast,arrayAllCheckTime[j].idUnitInLocations],function(error, result, field)
												{
													if(!!error)
													{
														console.log('Error in the query112');
													}else
													{
														if (result.affectedRows> 0) {
															//console.log("cập nhật location: thanh cong khi random=========="+ idUnitInLocations);
															var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
															{
																if (!!error)
																{
																	console.log('Error in the query 2');
																}else
																{
																	if (rows.length >0)
																	{
																		for (var i = 0; i < rows.length; i++)
																		{
																			//arrayAllPositionchange.push(rows[i]);
																			//console.log("Gui vi tri len client Duplicate: "+rows[i].idUnitInLocations+"__"+rows[i].PositionClick+"__"+rows[i].UserName+"__"+rows[i].PositionClick);
																			 //gửi vị trí cập nhật
																	        io.emit('RECEIVEPOSITIONCHANGE',
																			{
															            		arrayAllPositionchange: rows[i],
															        		});		       
																        }

																    }
																}
															})
														}
														else
														{
															console.log('khong co time remain duoc cap nhat');
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
				else
				{
					//console.log('khong co time remain duoc cap nhat');
				}

			}
		});
	});
	//Cập nhật tầm đánh liên tục
	cron.schedule('*/1 * * * * *',function()
	{		
		d = new Date();
		createPositionTimelast = Math.floor(d.getTime() / 1000);
		var query = pool.query("SELECT idUnitInLocations,Position FROM `unitinlocations` WHERE TimeCheck ='"+createPositionTimelast+"' ORDER BY `TimeCheck` DESC",function(error, rows,field)
		{
			if (!!error)
			{
				console.log('Error in the query 2ghfgh');				
			}else
			{
				if (rows.length > 0) 
				{
					for (var i = 0; i < rows.length; i++) 
					{					

						const s = [250],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = rows[i].Position.split(","), idUnitInLocations = rows[i].idUnitInLocations;
						const asyncFunc = (timeout) => {
							return new Promise((resolve,reject) => {
								setTimeout(() => { 
									//console.log('1: ', timeout); 
									//var arrs = rows[i].Position.split(",");
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
									
									resolve(); 
								}, timeout)
						    }).then(() => {
								return new Promise((resolve,reject) => {
								  setTimeout(() => { 
								  	//console.log('2: ', timeout); 
								  	//var arrs = rows[i].Position.split(",");
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
								  	resolve(); 
								  }, timeout)
						        });
							}).then(() => {
								return new Promise((resolve,reject) => {
								  setTimeout(() => { 
								  	//console.log('3: ', timeout); 
								  	//var arrs = rows[i].Position.split(",");
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
									//console.log(i+": "+arrayS);
							  	resolve(); 
								  }, timeout)
						        });
							}).then(() => {
								return new Promise((resolve,reject) => {
								  setTimeout(() => { 								  	
									var query = pool.query('UPDATE unitinlocations SET FightRadiusPosition = ?, FightRadiusPosition1 = ?, FightRadiusPosition2 = ? WHERE idUnitInLocations = ?', [arrayS.toString(),arrayS1.toString(),arrayS2.toString(),parseFloat(idUnitInLocations)],function(error, result, field)
									{
										if(!!error)
										{
											console.log('Error in the query113ghfg');
										}else
										{
											if (result.affectedRows> 0) 
											{
												//console.log("Update position radius thành công");
											}
											else
											{
												console.log('khong co time remain duoc cap nhat 2');
											}

										}
									})
								  	resolve(); 
								  }, timeout)
						        });
							});
						}
						s.reduce((promise, item) => {
						  return promise.then(() => asyncFunc(item));
						}, Promise.resolve());					
						
						
					}
				}
			}
		});	
	});
	//Thực hiện chức năng unit A đánh nhau B
	cron.schedule('*/1 * * * * *',function()
	{			 
		if (arrayAvsB.length > 0) 
		{
			var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameB,UnitOrderB,
			 UserNameA,UnitOrderA;			
			for (var i = 0; i < arrayAvsB.length; i++) 
			{

				console.log("==================================="+arrayAvsB[i].idUnitInLocationsA+"==VS=="+arrayAvsB[i].idUnitInLocationsB);
				A=arrayAvsB[i].idUnitInLocationsA;
				UserNameA=arrayAvsB[i].UserNameA;
			 	UnitOrderA=arrayAvsB[i].UnitOrderA;	
			 	B=arrayAvsB[i].idUnitInLocationsB;	
				UserNameB=arrayAvsB[i].UserNameB;
				UnitOrderB=arrayAvsB[i].UnitOrderB;		 		
				if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(A)).length > 0 && lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(B)).length > 0) 
				{
					QualityUnEqual = 0;					
					QualityUnEqual = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality,10);					
					if (QualityUnEqual < 1)
					{
						QualityUnEqual=1;
					}
					// Tính Defent tổng
					DefendSum = 0;					
					DefendSum = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);					
					if ((DefendSum % 1 ) >= 0.5)
					{
						DefendSum = Number((DefendSum).toFixed(0)); 								
					}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
					{
						DefendSum = Number((DefendSum).toFixed(0))+1;  								
					}else
					{
						DefendSum	= parseInt(DefendSum,10);  								
					}
					
					HealthRemain = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain,10)
					 -(parseFloat(QualityUnEqual)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10) 
					 	- parseInt(DefendSum,10)* parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10)); 							
					
					console.log(+B+": Mau hien tai===========: "+HealthRemain);					
					if (HealthRemain<=0)
					{
						//xóa trong memory
						if (arrayAvsB.length > 0) 
						{
							if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsB === B)).length > 0) {
								arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsB === B), 1);														
							}	
						}
						//xóa torng redis						
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);	
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);								
						//xóa trong redis
						client.del(B);												
						io.emit('RECEIVEUNITAvsB',
						{
							idUnitInLocations: parseFloat(B),
							UserName:UserNameB,
							UnitOrder:parseFloat(UnitOrderB),
							HealthRemain:0,
							Quality:0,
							idUnitInLocationsA: parseFloat(A),
							});				   			
						//Xóa trong database
						var query = pool.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ? ',
						[B],function(error, result, field)
					  	{
							if(!!error)
							{
								console.log('Error in the queryfgfg');
							}else
							{
								if(result.affectedRows > 0)
								{									
									var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder-1  WHERE `UserName` = '"+UserNameB+"'AND `UnitOrder` > '"+UnitOrderB+"'",function(error, result, field)
									{
										if(!!error)
										{
	      									console.log('Error in the query11sdfsdfhjkh7');

										}else
										{
											console.log("==========Cap nhat thanh cong==========");																										

										}
									})												
									//Cập nhật trang thái cho unit đánh bại online
									var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
									[A],function(error, result, field)
									{
										if(!!error)
										{
	      									console.log('Error in the query11sdf43');
										}else
										{												
											
										}
									})

								}else
								{
									console.log('khong co gi update');
								}
							}
						})
					}else
					{
						QualityRemain = 0;						
						QualityRemain = parseInt(HealthRemain,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);
						if ((QualityRemain % 1 ) >= 0.5)
						{
							QualityEnd = Number((QualityRemain).toFixed(0));  									
						}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
						{
							QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
						}else
						{
							QualityEnd	= parseInt(QualityRemain,10);  									
						}						
				        io.emit('RECEIVEUNITAvsB',
				        {
				            idUnitInLocations:parseInt(B),
				            UserName:UserNameB,
				            UnitOrder:parseFloat(UnitOrderB),
				            HealthRemain:HealthRemain,
				            Quality:QualityEnd,
				            idUnitInLocationsA: parseFloat(A),
				        });	           						
						DamageRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DamageEach,10);						
						DefendRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10);						
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain = HealthRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Damage = DamageRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Defend = DefendRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality = QualityEnd;
						//cập nhật redis và data base
						console.log(HealthRemain+"_"+DamageRemain+"_"+DefendRemain+"_"+QualityEnd);																
						client.set(B,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))]), redis.print);
						client.mget(B, function (err, replies) 
						{
							if (err) 
							{
								console.log(err);
							}else
							{									
						       	var objectValue = JSON.parse(replies);	
						       	d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);							         
								var query = pool.query("UPDATE unitinlocations SET userFight = '"+A+"' ,HealthRemain = '"+parseFloat(objectValue['HealthRemain'])+"' , Damage = '"+parseFloat(objectValue['Damage'])+"' , Defend = '"+parseFloat(objectValue['Defend'])+"' , Quality = '"+parseFloat(objectValue['Quality'])+"', TimeFight = '"+parseFloat(createPositionTimelast)+"', CheckFight = 1  WHERE idUnitInLocations = '"+B+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query11dsf');
									}else
									{  										
										if(result.affectedRows > 0)
										{ 	
											var query = pool.query("UPDATE unitinlocations SET userFight = '"+B+"' ,TimeFight = '"+parseFloat(createPositionTimelast)+"',CheckFight = 1 WHERE idUnitInLocations = '"+A+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query11dsfdfdfe');
												}else
												{  										
													if(result.affectedRows > 0)
													{ 											 
														//connection.release();
													}
												}
											})									 
											
										}
									}
								}) 										
						    									
							}
						    
						});
					}
				}else
				{					
					io.emit('RECEIVEUNITAvsB',
					{
						idUnitInLocations: parseFloat(B),
						UserName:UserNameB,
						UnitOrder:parseFloat(UnitOrderB),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(A),
					});	
					if (arrayAvsB.length > 0) 
					{
						if ((lodash.filter(arrayAvsB, x => x.idUnitInLocationsA === A)).length > 0) {						
							arrayAvsB.splice(arrayAvsB.findIndex(item => item.idUnitInLocationsA === A), 1);	
							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);
							//Cập nhật trang thái cho unit đánh unit online sau khi đã bại trận
							var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
							[A],function(error, result, field)
							{if(!!error){console.log('Error in the query11sdf43');}else{}
							})		

						}	

					}

				}
			}
		}else
		{
			//console.log("Chua vao tam danh");
		}	
	});
	//Thực hiện chức năng offline đánh online=> khi online vào tầm đánh của offline
	cron.schedule('*/1 * * * * *',function()
	{	
		 
		if (arrayFightOffline.length > 0) 
		{
			var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameOnline,UnitOrderOnline,
			 UserNameOffline,UnitOrderOffline;			
			for (var i = 0; i < arrayFightOffline.length; i++) 
			{
				A=arrayFightOffline[i].idUnitInLocationsOffline;
				UserNameOffline=arrayFightOffline[i].UserNameOffline;
			 	UnitOrderOffline=arrayFightOffline[i].UnitOrderOffline;				 	
			 	if (arrayFightOffline[i].idUnitInLocationsOnline.length===0) 
			 	{
			 		B=arrayFightOffline[i].idUnitInLocationsTemp;	
					UserNameOnline=arrayFightOffline[i].UserNameTemp;
					UnitOrderOnline=arrayFightOffline[i].UnitOrderTemp;				
			 	}else
			 	{
			 		B=arrayFightOffline[i].idUnitInLocationsOnline;	
					UserNameOnline=arrayFightOffline[i].UserNameOnline;
					UnitOrderOnline=arrayFightOffline[i].UnitOrderOnline;
			 	}	
				if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(A)).length > 0 && lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(B)).length > 0) 
				{
					QualityUnEqual = 0;					
					QualityUnEqual = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality,10);					
					if (QualityUnEqual < 1)
					{
						QualityUnEqual=1;
					}
					// Tính Defent tổng
					DefendSum = 0;					
					DefendSum = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);					
					if ((DefendSum % 1 ) >= 0.5)
					{
						DefendSum = Number((DefendSum).toFixed(0)); 								
					}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
					{
						DefendSum = Number((DefendSum).toFixed(0))+1;  								
					}else
					{
						DefendSum	= parseInt(DefendSum,10);  								
					}
					
					HealthRemain = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain,10)
					 -(parseFloat(QualityUnEqual)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10) 
					 	- parseInt(DefendSum,10)* parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10)); 							
					
					console.log(+B+": Mau hien tai===========: "+HealthRemain);					
					if (HealthRemain<=0)
					{
						//xóa trong memory
						if (arrayFightOffline.length > 0) 
						{
							if ((lodash.filter(arrayFightOffline, x => x.idUnitInLocationsOnline === B)).length > 0) {
								arrayFightOffline.splice(arrayFightOffline.findIndex(item => item.idUnitInLocationsOnline === B), 1);														
							}			

						}
						//xóa torng redis						
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);	
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);								
						//xóa trong redis
						client.del(B);												
						io.emit('RECEIVEPOSITIONFIGHTOFFLINEvsONLINE',
						{
							idUnitInLocations: parseFloat(B),
							UserName:UserNameOnline,
							UnitOrder:parseFloat(UnitOrderOnline),
							HealthRemain:0,
							Quality:0,
							idUnitInLocationsA: parseFloat(A),
							});				   			
						//Xóa trong database
						var query = pool.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ? ',
						[B],function(error, result, field)
					  	{
							if(!!error)
							{
								console.log('Error in the queryfgfg');
							}else
							{
								if(result.affectedRows > 0)
								{									
									var query = pool.query("UPDATE unitinlocations SET UnitOrder = UnitOrder-1  WHERE `UserName` = '"+UserNameOnline+"'AND `UnitOrder` > '"+UnitOrderOnline+"'",function(error, result, field)
									{
										if(!!error)
										{
          									console.log('Error in the query11sdfsdfhjkh7');

										}else
										{
											console.log("==========Cap nhat thanh cong==========");																											

										}
									})												
									//Cập nhật trang thái cho unit đánh bại online
									var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
									[A],function(error, result, field)
									{
										if(!!error)
										{
	      									console.log('Error in the query11sdf43');
										}else
										{												
											
										}
									})

								}else
								{
									console.log('khong co gi update');
								}
							}
						})
					}else
					{
						QualityRemain = 0;						
						QualityRemain = parseInt(HealthRemain,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);
						if ((QualityRemain % 1 ) >= 0.5)
						{
							QualityEnd = Number((QualityRemain).toFixed(0));  									
						}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
						{
							QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
						}else
						{
							QualityEnd	= parseInt(QualityRemain,10);  									
						}						
				        io.emit('RECEIVEPOSITIONFIGHTOFFLINEvsONLINE',
				        {
				            idUnitInLocations:parseInt(B),
				            UserName:UserNameOnline,
				            UnitOrder:parseFloat(UnitOrderOnline),
				            HealthRemain:HealthRemain,
				            Quality:QualityEnd,
				            idUnitInLocationsA: parseFloat(A),
				        });	           						
						DamageRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DamageEach,10);						
						DefendRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10);						
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain = HealthRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Damage = DamageRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Defend = DefendRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality = QualityEnd;
						//cập nhật redis và data base
						console.log(HealthRemain+"_"+DamageRemain+"_"+DefendRemain+"_"+QualityEnd);																
						client.set(B,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))]), redis.print);
						client.mget(B, function (err, replies) 
						{
							if (err) 
							{
								console.log(err);
							}else
							{									
						       	var objectValue = JSON.parse(replies);	
						       	d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);							         
								var query = pool.query("UPDATE unitinlocations SET userFight = '"+A+"' ,HealthRemain = '"+parseFloat(objectValue['HealthRemain'])+"' , Damage = '"+parseFloat(objectValue['Damage'])+"' , Defend = '"+parseFloat(objectValue['Defend'])+"' , Quality = '"+parseFloat(objectValue['Quality'])+"', TimeFight = '"+parseFloat(createPositionTimelast)+"', CheckFight = 1  WHERE idUnitInLocations = '"+B+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query11dsf');
									}else
									{  										
										if(result.affectedRows > 0)
										{ 	
											var query = pool.query("UPDATE unitinlocations SET userFight = '"+B+"' ,TimeFight = '"+parseFloat(createPositionTimelast)+"',CheckFight = 1 WHERE idUnitInLocations = '"+A+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query11dsfdfdfe');
												}else
												{  										
													if(result.affectedRows > 0)
													{ 											 
														//connection.release();
													}
												}
											})									 
											
										}
									}
								}) 										
						    									
							}
						    
						});
					}
				}else
				{					
					io.emit('RECEIVEPOSITIONFIGHTOFFLINEvsONLINE',
					{
						idUnitInLocations: parseFloat(B),
						UserName:UserNameOnline,
						UnitOrder:parseFloat(UnitOrderOnline),
						HealthRemain:0,
						Quality:0,
						idUnitInLocationsA: parseFloat(A),
					});	
					if (arrayFightOffline.length > 0) 
					{
						if ((lodash.filter(arrayFightOffline, x => x.idUnitInLocationsOffline === A)).length > 0) {						
							arrayFightOffline.splice(arrayFightOffline.findIndex(item => item.idUnitInLocationsOffline === A), 1);	
							redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);
							//Cập nhật trang thái cho unit đánh unit online sau khi đã bại trận
							var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
							[A],function(error, result, field)
							{if(!!error){console.log('Error in the query11sdf43');}else{}
							})		

						}	

					}

				}
			}
		}else
		{
			//console.log("Chua vao tam danh");
		}
	});
	//Thực hiện chức năng online đánh offline khi online quyết định đánh oflline
	cron.schedule('*/1 * * * * *',function()
	{			
		if (arrayFightOnlinevsOffline.length > 0) 
		{
			var A,B,HealthRemain,QualityRemain,QualityUnEqual,DefendSum,QualityEnd,DamageRemain,DefendRemain,  UserNameOnline,UnitOrderOnline,
			 UserNameOffline,UnitOrderOffline;
			console.log("Chiều dai mang arrayFightOnlinevsOffline=========: "+ arrayFightOnlinevsOffline.length);			
			for (var i = 0; i < arrayFightOnlinevsOffline.length; i++) 
			{
				A=arrayFightOnlinevsOffline[i].idUnitInLocationsOnline;
				UserNameOffline=arrayFightOnlinevsOffline[i].UserNameOnline;
			 	UnitOrderOffline=arrayFightOnlinevsOffline[i].UnitOrderOnline;		

				B=arrayFightOnlinevsOffline[i].idUnitInLocationsOffline;	
				UserNameOnline=arrayFightOnlinevsOffline[i].UserNameOffline;
				UnitOrderOnline=arrayFightOnlinevsOffline[i].UnitOrderOffline;			
			 	
				console.log("danh: "+A+"_"+B);	
				console.log("A redis online: "+lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(A)).length);
				console.log("B redis online: "+lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(B)).length);
				console.log("Mang redis hiện tại: "+redisarray.length);			
				

				//offline danh online

				if (lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(A)).length > 0 && lodash.filter(redisarray, x => x.idUnitInLocations === parseFloat(B)).length > 0) 
				{
					QualityUnEqual = 0;
					QualityUnEqual = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].Quality,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality,10);					
					if (QualityUnEqual < 1)
					{
						QualityUnEqual=1;
					}
					// Tính Defent tổng
					DefendSum = 0;					
					DefendSum = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);
					console.log("DefendSumDefendSum3: "+DefendSum);
					if ((DefendSum % 1 ) >= 0.5)
					{
						DefendSum = Number((DefendSum).toFixed(0)); 								
					}else if ((DefendSum % 1 ) < 0.5 && (DefendSum % 1 ) > 0)
					{
						DefendSum = Number((DefendSum).toFixed(0))+1;  								
					}else
					{
						DefendSum	= parseInt(DefendSum,10);  								
					}
					
					HealthRemain = parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain,10)
					 -(parseFloat(QualityUnEqual)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A))].DamageEach,10) 
					 	- parseInt(DefendSum,10)* parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10)); 							
					
					console.log("Mau hien tai===========: "+HealthRemain);					
					if (HealthRemain<=0)
					{
						console.log("xóa khoi mang thanh cong 1: "+ A);						
						//xóa trong memory
							
						if (arrayFightOnlinevsOffline.length > 0) 
						{								
							if ((lodash.filter(arrayFightOnlinevsOffline, x => x.idUnitInLocationsOnline === A)).length > 0) {
								arrayFightOnlinevsOffline.splice(arrayFightOnlinevsOffline.findIndex(item => item.idUnitInLocationsOnline === A), 1);
																					
							}		
						}
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(A)), 1);
						redisarray.splice(redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B)), 1);									
						//xóa trong redis
						client.del(B);
						console.log(B+' is lose111111');
						io.emit('RECEIVEPOSITIONFIGHTONLINEvsOFFLINE',
						{
							idUnitInLocations: parseFloat(B),
							UserName:UserNameOnline,
							UnitOrder:parseFloat(UnitOrderOnline),
							HealthRemain:0,
							Quality:0,
							idUnitInLocationsA: parseFloat(A),
							});				   			
						//Xóa trong database
						var query = pool.query('DELETE FROM unitinlocations WHERE idUnitInLocations = ? ',
						[B],function(error, result, field)
					  	{
							if(!!error)
							{
								console.log('Error in the queryfgfg');
							}else
							{
								if(result.affectedRows > 0)
								{
									//update lại unit order
									var query = pool.query("SELECT * FROM `unitinlocations` where `UserName` = '"+UserNameOnline
											+"'AND `UnitOrder` > '"+UnitOrderOnline+"'",function(error, rows,field)
									{
										if (!!error)
										{
											console.log('Error in the query1');
										}else
										{
											if(rows.length > 0)
											{
												for (var i = 0; i < rows.length; i++)
												{
													var query = pool.query('UPDATE unitinlocations SET UnitOrder = ? WHERE UserName = ? AND UnitOrder = ?',
													[(parseInt(rows[i].UnitOrder, 10)-1),UserNameOnline, (parseInt(rows[i].UnitOrder, 10))],function(error, result, field)
													{
														if(!!error)
														{
				          									console.log('Error in the query11sdfsdfkjhik78');

														}else
														{																										

														}
													})
												}
												var query = pool.query('UPDATE unitinlocations SET checkFight = 0, userFight = "" WHERE idUnitInLocations = ?',
												[A],function(error, result, field)
												{
													if(!!error)
													{
				      									console.log('Error in the query11sdf43');

													}else
													{													
															
													}
												})
											}
										}
									})

								}else
								{
									console.log('khong co gi update');
								}
							}
						})
					}else
					{
						QualityRemain = 0;						
						QualityRemain = parseInt(HealthRemain,10)/parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthEach,10);

						if ((QualityRemain % 1 ) >= 0.5)
						{
							QualityEnd = Number((QualityRemain).toFixed(0));  									

						}else if ((QualityRemain % 1 ) < 0.5 && (QualityRemain % 1 ) > 0)
						{
							QualityEnd = Number((QualityRemain).toFixed(0))+1;  									
						}else
						{
							QualityEnd	= parseInt(QualityRemain,10);  									
						}						
				        io.emit('RECEIVEPOSITIONFIGHTONLINEvsOFFLINE',
				        {
				            idUnitInLocations:parseInt(B),
				            UserName:UserNameOnline,
				            UnitOrder:parseFloat(UnitOrderOnline),
				            HealthRemain:HealthRemain,
				            Quality:QualityEnd,
				            idUnitInLocationsA: parseFloat(A),
				        });	           						
						DamageRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DamageEach,10);						
						DefendRemain = parseInt(QualityEnd,10)*parseInt(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].DefendEach,10);
						//cập nhật các thông số còn lại trong memory
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].HealthRemain = HealthRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Damage = DamageRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Defend = DefendRemain;
						redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))].Quality = QualityEnd;
						//cập nhật redis và data base
						client.set(B,JSON.stringify(redisarray[redisarray.findIndex(item => item.idUnitInLocations === parseFloat(B))]), redis.print);
						client.mget(B, function (err, replies) 
						{
							if (err) 
							{
								console.log(err);
							}else
							{									
						       	var objectValue = JSON.parse(replies);	
						       	d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);							         
								var query = pool.query("UPDATE unitinlocations SET userFight = '"+A+"' ,HealthRemain = '"+parseFloat(objectValue['HealthRemain'])+"' , Damage = '"+parseFloat(objectValue['Damage'])+"' , Defend = '"+parseFloat(objectValue['Defend'])+"' , Quality = '"+parseFloat(objectValue['Quality'])+"', TimeFight = '"+parseFloat(createPositionTimelast)+"', CheckFight = 1  WHERE idUnitInLocations = '"+B+"'",function(error, result, field)
								{
									if(!!error)
									{
										console.log('Error in the query11dsf');
									}else
									{  										
										if(result.affectedRows > 0)
										{ 	
											var query = pool.query("UPDATE unitinlocations SET userFight = '"+B+"' ,TimeFight = '"+parseFloat(createPositionTimelast)+"',CheckFight = 1 WHERE idUnitInLocations = '"+A+"'",function(error, result, field)
											{
												if(!!error)
												{
													console.log('Error in the query11dsfdfdfe');
												}else
												{  										
													if(result.affectedRows > 0)
													{ 										 
														
													}
												}
											})									 
											
										}
									}
								}) 										
						    									
							}
						    
						});
					}
				}else
				{
					console.log("LOSE");
					if (arrayFightOnlinevsOffline.length > 0) 
					{								
						if ((lodash.filter(arrayFightOnlinevsOffline, x => x.idUnitInLocationsOnline === A)).length > 0) {
							arrayFightOnlinevsOffline.splice(arrayFightOnlinevsOffline.findIndex(item => item.idUnitInLocationsOnline === A), 1);																				
						}		
					}	
					//cập nhật giá trị đang đánh cho mảng
				}
			}
		}else
		{
			// console.log("Chua vao tam danh");
		}
	});
	//quét tầm đánh liên tục của các con offline
	cron.schedule('*/1 * * * * *',function()
	{
	/*	var arrayCheckFightUserOffline  = [],PositionOffline,CheckFightOffline,idUnitInLocationsOffline,k;
		var query = pool.query("SELECT idUnitInLocations,UserName,UnitOrder,position,FightRadiusPosition FROM `unitinlocations` WHERE CheckOnline = 0 AND CheckFight =0 ORDER BY `TimeCheck` DESC",function(error, rows,field)
		{
			if (!!error)
			{
				console.log('Error in the query 2ghfgsdh');				
			}else
			{
				if (rows.length > 0) 
				{
					arrayCheckFightUserOffline = rows;
					for (var i = 0; i < arrayCheckFightUserOffline.length; i++) 
					{	
						//lấy position
						idUnitInLocationsOffline = arrayCheckFightUserOffline[i].idUnitInLocations;
						PositionOffline = arrayCheckFightUserOffline[i].position;
						CheckFightOffline = arrayCheckFightUserOffline[i].CheckFight;
						while(k < arrayCheckFightUserOffline.length)
						{
							var arrayRadiusPosition = [];
							arrayRadiusPosition.push(arrayCheckFightUserOffline[k].FightRadiusPosition);
							//check
							if(arrayRadiusPosition.indexOf(PositionOffline) > -1) {
								console.log("tim thay")
								//cập nhật vào data

							}else
							{
								console.log("khong tim thay");
							}

							k++;
						}

					}

				}
			}
		});*/

	});
	//function test
	cron.schedule('*/1 * * * * *', function()
	{		

		//function chạy tuần tự
		/*(function (exports) {
		  'use strict';

		  var Sequence = exports.Sequence || require('sequence').Sequence
		    , sequence = Sequence.create()
		    , err
		    ;

		  sequence
		    .then(function (next) {
		      setTimeout(function () {
		        next(err, "Hi", "World!");
		        console.log("1111111111");

		      }, 120);
		    })
		    .then(function (next, err, a, b) {
		      setTimeout(function () {
		        next(err, "Hello", b);
		        console.log("111111111122222222222");
		      }, 270);
		    })
		    .then(function (next, err, a, b) {
		      setTimeout(function () {
		        console.log(a, b);
		        console.log("33333333333333333");
		        next();
		      }, 50);
		    });

		// so that this example works in browser and node.js
		}('undefined' !== typeof exports && exports || new Function('return this')()));*/

		//---------------------------------------------------------------------
		//sử dụng thread
		/*var s= "123";
		const thread = spawn(function(input,s, done) {
		  // Everything we do here will be run in parallel in another execution context.
		  // Remember that this function will be executed in the thread's context,
		  // so you cannot reference any value of the surrounding code.
		  console.log("tinh toan function-----------------"+s);
		  done({ string : input.string, integer : parseInt(input.string) });
		});

		thread
		  .send({ string : '123' })
		  // The handlers come here: (none of them is mandatory)
		  .on('message', function(response) {
		    console.log('123 * 2 = ', response.integer * 2);
		    thread.kill();
		  })
		  .on('error', function(error) {
		    console.error('Worker errored:', error);
		  })
		  .on('exit', function() {
		    console.log('hoàn thành task');
		  });
		*/
		/*  var s = 10;
		  const thread = spawn(function ([a, b,c,d,e,f]) {
			  // Remember that this function will be run in another execution context.
			  var arrayStoneBase = [];
			  arrayStoneBase.push(a+b);
			  arrayStoneBase.push(c+d);
			  arrayStoneBase.push(e+f);
			  return new Promise(resolve => {
			    resolve(arrayStoneBase)
			  })
			});

			thread
			  .send([ s, 12 ,"A","B",8,9])
			  // The handlers come here: (none of them is mandatory)
			  .on('message', function(response) {
			  	//gửi kết quả len client
			    console.log('9 + 12 = ', response[0]);
			    thread.kill();
			  });*/



		//------------------------------------------------
		//sử dụng async
	/*	async.parallel([
		    function(callback){
		        setTimeout(function(){
		           //callback(null, 'one');
		            console.log("one");
		        }, 200);
		    },
		    function(callback){
		        setTimeout(function(){
		           // callback(null, 'two');
		            console.log("two");
		        }, 100);
		    }
		],
		// optional callback
		function(err, results){
			console.log("one+two----------------------");
		    // the results array will equal ['one','two'] even though
		    // the second function had a shorter timeout.
		});*/
		//-----------------------------------------------------------
		//sử dụng async
	/*	const k = [1000, 3000, 6000];
		const asyncFunc = (timeout) => {
			return new Promise((resolve,reject) => {
				setTimeout(() => { console.log('1: ', timeout); resolve(); }, timeout)
		    }).then(() => {
				return new Promise((resolve,reject) => {
				  setTimeout(() => { console.log('2: ', timeout); resolve(); }, timeout)
		        });
			});
		}
		k.reduce((promise, item) => {
		  return promise.then(() => asyncFunc(item));
		}, Promise.resolve());*/

	});


	server.listen( app.get('3000'), function ()
	{
		console.log("------- server is running 3000-------");
		console.log("Time Now: "+new Date().toString());
		//var s = new Date().toString();
		//console.log(new Date().toString().slice(25, 33));
		var dt = datetime.create();
		var formatted = dt.format('d-m-Y H:M:S');
		console.log(dt.format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33));	
	} );
}
