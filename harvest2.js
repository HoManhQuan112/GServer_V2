'use strict';
var pool = require('./db');
var functions 	= require("./functions");
var currentSENDSENDHARVEST,d,createPositionTimelast,MineHarvestServer=0,
HarvestServer=0,HarvestRemain=0,HarvestSurpass=0,HarvestTimeSurpass,DetailError;

module.exports = {
	start: function(io) 
	{
		io.on('connection', function(socket) 
		{
			socket.on('S_HARVEST', function (data)
			{
				currentSENDSENDHARVEST = getcurrentSENDSENDHARVEST(data);
				console.log("data receive S_HARVEST: "+currentSENDSENDHARVEST.UserName+"_"				
					+"_"+currentSENDSENDHARVEST.numberBase
					+"_"+currentSENDSENDHARVEST.MineType
					+"_"+currentSENDSENDHARVEST.MineTotal
					+"_"+currentSENDSENDHARVEST.MineHarvest);
				pool.getConnection(function(err,connection)
				{		
					d = new Date();
					createPositionTimelast = Math.floor(d.getTime() / 1000);					
					var AMineType = "A."+currentSENDSENDHARVEST.MineType, ALvMineType = "A.Lv"+currentSENDSENDHARVEST.MineType,
					AMineTypeHarvestTime = "A."+currentSENDSENDHARVEST.MineType+"HarvestTime", ACurrentLvMineType = "CurrentLv"+currentSENDSENDHARVEST.MineType,
					AresourceupMineType = "resourceup"+currentSENDSENDHARVEST.MineType;		    		
					connection.query("SELECT "+AMineType+" as MineType,"
						+ALvMineType+" as LvMineType,"
						+AMineTypeHarvestTime+" as MineTypeHarvestTime,"
						+ACurrentLvMineType+" as CurrentLvMineType, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN "+AresourceupMineType+" AS B ON B.Level = "+ACurrentLvMineType+" INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+currentSENDSENDHARVEST.UserName
						+"'AND A.numberBase = '"+currentSENDSENDHARVEST.numberBase+"'",function(error, rows,field)
						{
							if (!!error)
							{
								DetailError = ('harvest: Error in the query 1');							
								console.log(DetailError);
								functions.writeLogErrror(DetailError);		
							}else
							{												
								if (rows.length > 0 && (parseFloat(rows[0].LvMineType)===parseFloat(rows[0].CurrentLvMineType))) 
								{		
									d = new Date();
									createPositionTimelast = Math.floor(d.getTime() / 1000);																					            			
									if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MineTypeHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{																				                		
		            				//Kiểm tra tài nguyên tổng và giới hạn granary
		            				
		            				if ((parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
		            				{
		            					HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
		            					HarvestRemain = parseFloat(rows[0].HarvestContainer) - HarvestSurpass;			            					
		            					HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
		            					updateHarvast(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);		            					
		            				}else
		            				{
		            					updateHarvast(currentSENDSENDHARVEST.MineType,rows[0].HarvestContainer,createPositionTimelast,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);		            																
		            				}					                																			
		            			}else
		            			{											                			
		            				MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MineTypeHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
		            				if ((MineHarvestServer % 1 ) >= 0.5)
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0));
		            				}else
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
		            				}										
		            				if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].MineType))) 
		            				{							
		            					if ((parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
		            					{
		            						HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
		            						HarvestRemain = parseFloat(MineHarvestServer) - HarvestSurpass;
				            				//update tài nguyên còn lại của base						                									      
				            				HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));			                		
				            				updateHarvast(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);
				            				HarvestServer = parseFloat(rows[0].MineType) + parseFloat(HarvestRemain);

				            				console.log(currentSENDSENDHARVEST.MineType);
				            				console.log(HarvestSurpass);
				            				console.log(HarvestServer);

				            				socket.emit('R_HARVEST', 
				            				{
				            					MineType : currentSENDSENDHARVEST.MineType,
				            					HarvestSurpass :HarvestSurpass,
				            					HarvestServer :HarvestServer,
				            				});
				            			}else
				            			{
				            				updateHarvast(currentSENDSENDHARVEST.MineType,MineHarvestServer,createPositionTimelast,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);
				            				HarvestServer = parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer);

				            				console.log(currentSENDSENDHARVEST.MineType);
				            				console.log(HarvestSurpass);
				            				console.log(HarvestServer);

				            				socket.emit('R_HARVEST', 
				            				{
				            					MineType : currentSENDSENDHARVEST.MineType,
				            					HarvestServer :HarvestServer,									                		
				            				});
				            			}																												
				            		}else
				            		{
										//update tài nguyên còn lại của base
										if ((parseFloat(rows[0].MineType) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
										{
											HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
											HarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - HarvestSurpass;				            					
											HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))
											updateHarvast(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);			            						
										}else
										{
											updateHarvast(currentSENDSENDHARVEST.MineType,currentSENDSENDHARVEST.MineHarvest,createPositionTimelast,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);
										}			                		
									}										
								}
								
							} else if (rows.length > 0 && (parseFloat(rows[0].LvMineType)>parseFloat(rows[0].CurrentLvMineType))) 
							{	
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);			
								if ((parseFloat(createPositionTimelast) - parseFloat(rows[0].MineTypeHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
								{																		
			                		//update tài nguyên còn lại của base				                		
		            				//Kiểm tra tài nguyên tổng và giới hạn granary
		            				if ((parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
		            				{
		            					HarvestSurpass = (parseFloat(rows[0].MineType)+ parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
		            					HarvestRemain = parseFloat(rows[0].HarvestContainer) - HarvestSurpass;			            					
		            					HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
		            					updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);					            					
		            				}else
		            				{
		            					updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,rows[0].HarvestContainer,createPositionTimelast,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);		
		            				}					                																			
		            			}else
		            			{												                			
		            				MineHarvestServer =(parseFloat(createPositionTimelast) - parseFloat(rows[0].MineTypeHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
		            				if ((MineHarvestServer % 1 ) >= 0.5)
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0));
		            				}else
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
		            				}										
		            				if (parseFloat(currentSENDSENDHARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].MineType))) 
		            				{																		
		            					if ((parseFloat(rows[0].MineType)+ parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
		            					{
		            						HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
		            						HarvestRemain = parseFloat(MineHarvestServer) - HarvestSurpass;					            					
			            					//update tài nguyên còn lại của base							                			
			            					HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             									                		
			            					updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);						            					
			            					HarvestServer = parseFloat(rows[0].MineType) + parseFloat(HarvestRemain);
			            						console.log(currentSENDSENDHARVEST.MineType);
				            				console.log(HarvestSurpass);
				            				console.log(HarvestServer);			            					
			            					socket.emit('R_HARVEST', 
			            					{
			            						MineType : currentSENDSENDHARVEST.MineType,
			            						HarvestSurpass :HarvestSurpass,
			            						HarvestServer :HarvestServer,
			            					});	
			            				}else
			            				{
			            					updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,MineHarvestServer,createPositionTimelast,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);		
			            					HarvestServer = parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer);			
			            					console.log(currentSENDSENDHARVEST.MineType);
				            				console.log(HarvestSurpass);
				            				console.log(HarvestServer);								
			            					socket.emit('R_HARVEST', 
			            					{
			            						MineType : currentSENDSENDHARVEST.MineType,
			            						HarvestServer :HarvestServer,
			            					});
			            				}																												
			            			}else
			            			{
										//update tài nguyên còn lại của base											
										if ((parseFloat(rows[0].MineType) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
										{
											HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(currentSENDSENDHARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
											HarvestRemain = parseFloat(currentSENDSENDHARVEST.MineHarvest) - HarvestSurpass;
											HarvestTimeSurpass = parseFloat(createPositionTimelast) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
											updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);				            						
										}else
										{
											updateHarvastwithLevel(currentSENDSENDHARVEST.MineType,currentSENDSENDHARVEST.MineHarvest,createPositionTimelast,rows[0].LvMineType,currentSENDSENDHARVEST.UserName,currentSENDSENDHARVEST.numberBase);		
										}			                		
									}										
								}
								console.log(currentSENDSENDHARVEST.MineType);
				            				console.log(HarvestSurpass);
				            				console.log(HarvestServer);											
							}else
							{
								DetailError = ("login: dữ liệu không đủ");								
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						}

					});										    				     	
});
});
});
}
}


function updateHarvast(MineType,MineTypeHarvestRemain,MineTypeHarvestTimeSurpass,UserName,numberBase)
{
	var CurrenHarvest="CurrenHarvest"+MineType, HarvestTime = MineType+"HarvestTime";
	var query = pool.query("UPDATE userbase SET "+MineType+" = "+MineType+" +'"+ (parseFloat(MineTypeHarvestRemain))
		+"',"+CurrenHarvest+" = '"+ (parseFloat(MineTypeHarvestRemain))
		+"',"+HarvestTime+" = '"+ (parseFloat(MineTypeHarvestTimeSurpass))						                						                						                		
		+"'where UserName = '"+UserName
		+"'AND numberBase = '"+numberBase+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('harvest: Error in the query 2');
			console.log(DetailError);
			functions.writeLogErrror(DetailError);	
		}		
	});	
}

function updateHarvastwithLevel(MineType,MineTypeHarvestRemain,MineTypeHarvestTimeSurpass,LvMineType,UserName,numberBase)
{
	var CurrenHarvest="CurrenHarvest"+MineType, HarvestTime = MineType+"HarvestTime", CurrentLv = "CurrentLv"+MineType;
	var query = pool.query("UPDATE userbase SET "+MineType+" = "+MineType+" +'"+ (parseFloat(MineTypeHarvestRemain))
		+"',"+CurrenHarvest+" = '"+ (parseFloat(MineTypeHarvestRemain))
		+"',"+HarvestTime+" = '"+ (parseFloat(MineTypeHarvestTimeSurpass))	
		+"',"+CurrentLv+" = '"+ (parseFloat(LvMineType))						                						                						                		
		+"'where UserName = '"+UserName
		+"'AND numberBase = '"+numberBase+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('harvest: Error in the query 3');
			console.log(DetailError);
			functions.writeLogErrror(DetailError);	
		}				
	});	
}

function getcurrentSENDSENDHARVEST(data)
{
	return currentSENDSENDHARVEST =
	{
		UserName:data.UserName,		
		numberBase:data.numberBase,				
		MineType:data.MineType,
		MineTotal:data.MineTotal,
		MineHarvest:data.MineHarvest,													
	}
}


