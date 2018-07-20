'use strict';
var dataBase 		= require('./../db');
var lodash		    = require('lodash');
var cron 			= require('node-cron');
var client 			= require('./../redis');
var Promise 		= require('promise');
var async 			= require("async");
var functions 		= require("./../functions");

var arrayFightOffline =[];
var currentSENDPOSITIONFIGHTOFFLINEvsONLINE;
module.exports = 
{
	start:function (io) 
	{
		io.on('connection', function(socket) 
		{
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
		});
	}
}

cron.schedule('*/1 * * * * *',function(){
	
	//console.log("R_POSITION_FIGHT_OFFLINEvsONLINE");

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
