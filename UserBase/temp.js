//#region kiem tra user base đã tạo chưa. Nếu chưa thì insert.							
connection.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows,field)
{
	if (!!error){DetailError =('login :Error in the query 81');

	functions.writeLogErrror(DetailError);	
}else
{	
	//tạo Base mới cho user dn lần đầu				
	if (rows.length<=0)
	{	
		//Lấy vị trí sau cùng của base mới tạo	
		connection.query("SELECT * FROM `userbase` where `Position`!='' ORDER BY `CreateTime` DESC LIMIT 1",function(error, rows,field)
		{
			if (!!error){DetailError =('login :Error in the query 82');

			functions.writeLogErrror(DetailError);	
		}else
		{
			lastPosition=rows[0].Position;	
				//Lấy position của những base khác không phải là base của user đăng nhập
				connection.query("SELECT `Position` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"' AND `Position`!=''",function(error, rows,field)
				{
					if (!!error){DetailError =('login :Error in the query 83');

					functions.writeLogErrror(DetailError);	
				}else
				{
					for (var i = 0; i < rows.length; i++)
					{											
						arrayAllUserposition.push(rows[i].Position);
					}
				        //Lấy position của user asset và unit in location để tạo base mới không trùng
				        connection.query("SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE 1",function(error, rows,field)
				        {
				        	if (!!error){DetailError =('login :Error in the query 84');

				        	functions.writeLogErrror(DetailError);	
				        }else
				        {
				        	for (var i = 0; i < rows.length; i++)
				        	{
				        		arrayAllMinePosition.push(rows[i].Position);
				        	}
				        	var arr = lastPosition.split(",");											
				        	var i = functions.getRandomIntInclusive(1,8), M=0;												
				        	arrayAllMineMerger = arrayAllUserposition.concat(arrayAllMinePosition);
				        	newLocation = functions.getNewLocation(arr[0],arr[1],i,M);									
				        	while(arrayAllMineMerger.indexOf(newLocation)>=1)
				        	{	
				        		i = functions.getRandomIntInclusive(1,8);
				        		newLocation = functions.getNewLocation(arr[0],arr[1],i,M);	
				        	}
				        	arrayAllMineMerger.push(newLocation);

								//thêm Base mới tạo
								connection.query("SELECT * FROM `resourcebuybase` WHERE `numberBase` = 0",function(error, rows,field)
								{
									if (!!error){DetailError =('login :Error in the query 85');

									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length > 0)
									{		
									//insert Base mới tạo
									connection.query("INSERT INTO `userbase`(`idBase`, `UserName`, `MaxStorage`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`) VALUES ('"
										+""+"','"+currentUser.name+"','"+10000+"','"+newLocation+"','"+1+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady+"','"+createPositionTimelast+"','"+rows[0].numberBase+"','"+0+"','"+0+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"')",function(error, result, field)
										{
											if(!!err){DetailError =('login: insert thất bại 86');

											functions.writeLogErrror(DetailError);	
										}
									});	
								}
							}
						});


							}
						})
				    }
				})								
			}
		})	