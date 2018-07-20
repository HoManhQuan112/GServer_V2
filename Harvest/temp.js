[AMineType 1,ALvMineType 2,AMineTypeHarvestTime 3,ACurrentLvMineType 4,AresourceupMineType 5,ACurrentLvMineType 6 ,current_S_HARVEST.UserName,current_S_HARVEST.numberBase]
module.exports = {
	start: function(io) 
	{
		io.on('database', function(socket) 
		{
			socket.on('S_HARVEST', function (data)
			{
				current_S_HARVEST = getcurrent_S_HARVEST(data);
				console.log("data receive S_HARVEST: "+current_S_HARVEST.UserName+"_"				
					+"_"+current_S_HARVEST.numberBase
					+"_"+current_S_HARVEST.MineType
					+"_"+current_S_HARVEST.MineTotal
					+"_"+current_S_HARVEST.MineHarvest);
				pool.getdatabase(function(err,database)
				{		
					d = new Date();
					currentTime = Math.floor(d.getTime() / 1000);	

					var AMineType = "A."+current_S_HARVEST.MineType, 
					ALvMineType = "A.Lv"+current_S_HARVEST.MineType,
					AMineTypeHarvestTime = "A."+current_S_HARVEST.MineType+"HarvestTime", 
					ACurrentLvMineType = "CurrentLv"+current_S_HARVEST.MineType,
					AresourceupMineType = "resourceup"+current_S_HARVEST.MineType;

					database.query("SELECT "
						+AMineType+" as MineType,"
						+ALvMineType+" as LvMineType,"
						+AMineTypeHarvestTime+" as MineTypeHarvestTime,"
						+ACurrentLvMineType+" as CurrentLvMineType, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN "
						+AresourceupMineType+" AS B ON B.Level = "
						+ACurrentLvMineType+" INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+current_S_HARVEST.UserName
						+"'AND A.numberBase = '"+current_S_HARVEST.numberBase+"'",function(error, rows){
							if (!!error)
							{
								DetailError = ('harvest: Error in the query 1');							
								console.log(DetailError);
								functions.writeLogErrror(DetailError);		
							}else
							{												
								if (rows.length > 0 && (parseFloat(rows[0].LvMineType)===parseFloat(rows[0].CurrentLvMineType))) 
								{		

									if ((parseFloat(currentTime) - parseFloat(rows[0].MineTypeHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
									{																				                		


										if ((parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
										{
											HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
											HarvestRemain = parseFloat(rows[0].HarvestContainer) - HarvestSurpass;			            					
											HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
											updateHarvast(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);		            					
										}else
										{
											updateHarvast(current_S_HARVEST.MineType,rows[0].HarvestContainer,currentTime,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);		            																
										}					                																			
									}else
									{											                			
										MineHarvestServer =(parseFloat(currentTime) - parseFloat(rows[0].MineTypeHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);

										if ((MineHarvestServer % 1 ) >= 0.5){
											MineHarvestServer=Number((MineHarvestServer).toFixed(0));
										}else{		
											MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
										}

										if (parseFloat(current_S_HARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].MineType))) 
										{							
											if ((parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
											{
												HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
												HarvestRemain = parseFloat(MineHarvestServer) - HarvestSurpass;
				            				//update tài nguyên còn lại của base						                									      
				            				HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));			                		
				            				updateHarvast(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);
				            				HarvestServer = parseFloat(rows[0].MineType) + parseFloat(HarvestRemain);																												
				            				socket.emit('R_HARVEST', 
				            				{
				            					MineType : current_S_HARVEST.MineType,
				            					HarvestSurpass :HarvestSurpass,
				            					HarvestServer :HarvestServer,
				            				});
				            			}else
				            			{
				            				updateHarvast(current_S_HARVEST.MineType,MineHarvestServer,currentTime,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);
				            				HarvestServer = parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer);												
				            				socket.emit('R_HARVEST', 
				            				{
				            					MineType : current_S_HARVEST.MineType,
				            					HarvestServer :HarvestServer,									                		
				            				});
				            			}																												
				            		}else
				            		{
										//update tài nguyên còn lại của base
										if ((parseFloat(rows[0].MineType) + parseFloat(current_S_HARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
										{
											HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(current_S_HARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
											HarvestRemain = parseFloat(current_S_HARVEST.MineHarvest) - HarvestSurpass;				            					
											HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))
											updateHarvast(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);			            						
										}else
										{
											updateHarvast(current_S_HARVEST.MineType,current_S_HARVEST.MineHarvest,currentTime,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);
										}			                		
									}										
								}

							} else if (rows.length > 0 && (parseFloat(rows[0].LvMineType)>parseFloat(rows[0].CurrentLvMineType))) 
							{	
								d = new Date();
								currentTime = Math.floor(d.getTime() / 1000);			
								if ((parseFloat(currentTime) - parseFloat(rows[0].MineTypeHarvestTime)) >= ((parseFloat(rows[0].HarvestContainer)*3600)/parseFloat(rows[0].HarvestPerHour))) 
								{																		
			                		//update tài nguyên còn lại của base				                		
		            				//Kiểm tra tài nguyên tổng và giới hạn granary
		            				if ((parseFloat(rows[0].MineType) + parseFloat(rows[0].HarvestContainer)) > parseFloat(rows[0].MaxStorage) ) 
		            				{
		            					HarvestSurpass = (parseFloat(rows[0].MineType)+ parseFloat(rows[0].HarvestContainer)) - parseFloat(rows[0].MaxStorage);
		            					HarvestRemain = parseFloat(rows[0].HarvestContainer) - HarvestSurpass;			            					
		            					HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
		            					updateHarvastwithLevel(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);					            					
		            				}else
		            				{
		            					updateHarvastwithLevel(current_S_HARVEST.MineType,rows[0].HarvestContainer,currentTime,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);		
		            				}					                																			
		            			}else
		            			{												                			
		            				MineHarvestServer =(parseFloat(currentTime) - parseFloat(rows[0].MineTypeHarvestTime))*(parseFloat(rows[0].HarvestPerHour)/3600);
		            				if ((MineHarvestServer % 1 ) >= 0.5)
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0));
		            				}else
		            				{
		            					MineHarvestServer=Number((MineHarvestServer).toFixed(0))+1;
		            				}										
		            				if (parseFloat(current_S_HARVEST.MineTotal) > (parseFloat(MineHarvestServer) + parseFloat(rows[0].MineType))) 
		            				{																		
		            					if ((parseFloat(rows[0].MineType)+ parseFloat(MineHarvestServer)) > parseFloat(rows[0].MaxStorage)) 
		            					{
		            						HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(MineHarvestServer)) - parseFloat(rows[0].MaxStorage);
		            						HarvestRemain = parseFloat(MineHarvestServer) - HarvestSurpass;					            					
			            					//update tài nguyên còn lại của base							                			
			            					HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600))             									                		
			            					updateHarvastwithLevel(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);						            					
			            					HarvestServer = parseFloat(rows[0].MineType) + parseFloat(HarvestRemain);				            					
			            					socket.emit('R_HARVEST', 
			            					{
			            						MineType : current_S_HARVEST.MineType,
			            						HarvestSurpass :HarvestSurpass,
			            						HarvestServer :HarvestServer,
			            					});	
			            				}else
			            				{
			            					updateHarvastwithLevel(current_S_HARVEST.MineType,MineHarvestServer,currentTime,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);		
			            					HarvestServer = parseFloat(rows[0].Farm) + parseFloat(MineHarvestServer);											
			            					socket.emit('R_HARVEST', 
			            					{
			            						MineType : current_S_HARVEST.MineType,
			            						HarvestServer :HarvestServer,
			            					});
			            				}																												
			            			}else
			            			{
										//update tài nguyên còn lại của base											
										if ((parseFloat(rows[0].MineType) + parseFloat(current_S_HARVEST.MineHarvest)) > parseFloat(rows[0].MaxStorage) ) 
										{
											HarvestSurpass = (parseFloat(rows[0].MineType) + parseFloat(current_S_HARVEST.MineHarvest)) - parseFloat(rows[0].MaxStorage);
											HarvestRemain = parseFloat(current_S_HARVEST.MineHarvest) - HarvestSurpass;
											HarvestTimeSurpass = parseFloat(currentTime) - (HarvestSurpass/(parseFloat(rows[0].HarvestPerHour)/3600));
											updateHarvastwithLevel(current_S_HARVEST.MineType,HarvestRemain,HarvestTimeSurpass,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);				            						
										}else
										{
											updateHarvastwithLevel(current_S_HARVEST.MineType,current_S_HARVEST.MineHarvest,currentTime,rows[0].LvMineType,current_S_HARVEST.UserName,current_S_HARVEST.numberBase);		
										}			                		
									}										
								}									
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

function getcurrent_S_HARVEST(data)
{
	return current_S_HARVEST =
	{
		UserName:data.UserName,		
		numberBase:data.numberBase,				
		MineType:data.MineType,
		MineTotal:data.MineTotal,
		MineHarvest:data.MineHarvest,													
	}
}


