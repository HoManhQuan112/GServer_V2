'use strict';
var pool = require('./db');
var functions 	= require("./functions");

var currentSENDBUYBASE,d,createPositionTimelast,arrayDetailBase =[],DetailError;
module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('S_BUY_BASE', function (data)
			{
				currentSENDBUYBASE =
				{
					UserName:data.UserName,		
					numberBase:data.numberBase,		
					Position:data.Position,			
					Farm:data.Farm,				
					Wood:data.Wood,
					Stone:data.Stone,
					Metal:data.Metal,				
					Diamond:data.Diamond,
					FarmRemain:data.FarmRemain,				
					WoodRemain:data.WoodRemain,
					StoneRemain:data.StoneRemain,
					MetalRemain:data.MetalRemain,				
					DiamondRemain:data.DiamondRemain,
					LevelBaseCenter:data.LevelBaseCenter,											
				}
				console.log("data receive S_BUY_BASE ============: "+ currentSENDBUYBASE.UserName+"_"
											+ currentSENDBUYBASE.numberBase+"_"
											+ currentSENDBUYBASE.Position+"_"
											+ currentSENDBUYBASE.Farm+"_"
											+ currentSENDBUYBASE.Wood+"_"
											+ currentSENDBUYBASE.Stone+"_"
											+ currentSENDBUYBASE.Metal+"_"
											+ currentSENDBUYBASE.Diamond+"_"
											+ currentSENDBUYBASE.FarmRemain+"_"
											+ currentSENDBUYBASE.WoodRemain+"_"
											+ currentSENDBUYBASE.StoneRemain+"_"
											+ currentSENDBUYBASE.MetalRemain+"_"
											+ currentSENDBUYBASE.DiamondRemain+"_"
											+ currentSENDBUYBASE.LevelBaseCenter);						
				
				pool.getConnection(function(err,connection)
				{				
					connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.numberBase, C.UpgradeWait, C.ResourceMoveSpeed, C.UnitMoveSpeed, C.UnitNumberLimitTransfer, C.FarmReady, C.WoodReady, C.StoneReady, C.MetalReady, C.DiamondReady, C.LimitLevelBaseCenter FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourcebuybase AS C ON C.numberBase = '"+parseFloat(currentSENDBUYBASE.numberBase)+"' WHERE A.UserName = '"
											+currentSENDBUYBASE.UserName+"'AND B.numberBase = 0 AND B.LvCity = '"+currentSENDBUYBASE.LevelBaseCenter+"'",function(error, rows,field)
					{
						if (!!error){DetailError = ('userbase: Error in the query 1');							
							console.log(DetailError);
            				functions.writeLogErrror(DetailError);
						}else
						{											
							if (rows.length > 0 
								&&(parseFloat(rows[0].LvCity)>=parseFloat(rows[0].LimitLevelBaseCenter))
								&&((parseFloat(rows[0].Farm) - parseFloat(rows[0].Farmconsumption))===parseFloat(currentSENDBUYBASE.FarmRemain))&&

									((parseFloat(rows[0].Wood) - parseFloat(rows[0].Woodconsumption))===parseFloat(currentSENDBUYBASE.WoodRemain))&&

									((parseFloat(rows[0].Stone) - parseFloat(rows[0].Stoneconsumption))===parseFloat(currentSENDBUYBASE.StoneRemain))&&

									((parseFloat(rows[0].Metal) - parseFloat(rows[0].Metalconsumption))===parseFloat(currentSENDBUYBASE.MetalRemain))&&

									((parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))===parseFloat(currentSENDBUYBASE.DiamondRemain))) 
							{						
								
		                		//update tài nguyên còn lại của base
		                		d = new Date();
		        				createPositionTimelast = Math.floor(d.getTime() / 1000);

		                		connection.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(currentSENDBUYBASE.DiamondRemain))                			
		                			+"',userbase.Wood = '"+ (parseFloat(currentSENDBUYBASE.WoodRemain))
		                			+"',userbase.Stone = '"+ (parseFloat(currentSENDBUYBASE.StoneRemain))
		                			+"',userbase.Farm = '"+ (parseFloat(currentSENDBUYBASE.FarmRemain))
		                			+"',userbase.Metal = '"+ (parseFloat(currentSENDBUYBASE.MetalRemain))
		                			+"'where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDBUYBASE.UserName
		                			+"'AND userbase.numberBase = 0",function(error, result, field)
								{
									if(!!error)
									{
										DetailError = ('userbase: Error in the query 2');
										console.log(DetailError);
            							functions.writeLogErrror(DetailError);
									}else
									{
										if (result.affectedRows>0) 
										{											
											//insert userbase vào data
											connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`,`MaxStorage`) VALUES ('"
													+""+"','"+currentSENDBUYBASE.UserName+"','"+currentSENDBUYBASE.Position+"','"+0+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady
																																				+"','"+createPositionTimelast+"','"+rows[0].numberBase+"','"+0+"','"+1+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"','"+10000+"')",function(error, result, field)
											{
									            if(!!err) {DetailError = ('userbase: Error insert thất bại');
									            	console.log(DetailError);
            										functions.writeLogErrror(DetailError);
									            }else
									            {
									            	if (rows.length>0) 
									            	{									            										            		
									            		connection.query("SELECT * FROM `userbase` WHERE idBase='"+parseFloat(result.insertId)+"'",function(error, rows,field)
														{
															if (!!error)
															{
																DetailError = ('userbase: Error in the query 3');																										
																console.log(DetailError);
            													functions.writeLogErrror(DetailError);	
															}else
															{	
																if (rows.length>0) 
																{
																	arrayDetailBase = rows;
																	console.log("Gui chi tiet base moi tao cho cac user khac");
																	io.emit('R_BUY_BASE_ALL_USER',
																	{
																		arrayDetailBase:arrayDetailBase,
												                	});
																}
															}
														});									            		
									            	}
									            }
									        });
										}
									}
								});
							}else
							{
								console.log("Không đủ tài nguyên mua base");
							}
						}
					});					     	
		   		});		
			});      	            
        })
    }
}