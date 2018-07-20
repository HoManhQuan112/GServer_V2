'use strict';
var pool = require('./db');
var CronJob 		= require('cron').CronJob;
var lodash		    = require('lodash');
var currentSENDUPGRADE,d,createPositionTimelast;

module.exports=
{
	start: function (io) 
	{
		io.on('connection',function getClientData(socket) 
		{
			socket.on('SENDUPGRADE',function getCData (data) 
			{
				currentSENDUPGRADE =
				{
					UserName:data.UserName,		
					numberBase:data.numberBase,		
					UpgradeWait:data.UpgradeWait,
					LevelUpgrade:data.LevelUpgrade,
					Farm:data.Farm,				
					Wood:data.Wood,
					Stone:data.Stone,
					Metal:data.Metal,				
					Diamond:data.Diamond,											
				}

				console.log("data receive  SENDUPGRADE ============: "
					+"_UserName: "+currentSENDUPGRADE.UserName
					+"_UpgradeWait: "+currentSENDUPGRADE.UpgradeWait
					+"_numberBase: "+currentSENDUPGRADE.numberBase
					+"_LevelUpgrade: "+currentSENDUPGRADE.LevelUpgrade
					+"_Farm: "+currentSENDUPGRADE.Farm
					+"_Wood: "+currentSENDUPGRADE.Wood
					+"_Stone: "+currentSENDUPGRADE.Stone
					+"_Metal: "+currentSENDUPGRADE.Metal
					+"_Diamond: "+currentSENDUPGRADE.Diamond);

				pool.getConnection(function getConnect(err,connection)
				{		
					var tabQuery = tableQuery(currentSENDUPGRADE.UpgradeWait);			
					if (currentSENDUPGRADE.UpgradeWait==="City") 
					{
                        //Nâng cấp city
						connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity,B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "
							+tabQuery+" AS C ON C.Level = '"
							+parseFloat(currentSENDUPGRADE.LevelUpgrade)
							+"' WHERE A.UserName = '"+currentSENDUPGRADE.UserName
							+"'AND B.numberBase = '"+parseFloat(currentSENDUPGRADE.numberBase)
							+"'",function (error, rows,field)
							{
								resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io);
							});
					}else
					{
						checkLvCity(currentSENDUPGRADE.UserName, currentSENDUPGRADE.numberBase,currentSENDUPGRADE.UpgradeWait, currentSENDUPGRADE.LevelUpgrade, function(err,data)
						{
							if (err) {						            
								console.log("ERROR ======: ",err);            
							} else {            
								if (parseFloat(data)==1) 
								{
									connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity,B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "
										+tabQuery+" AS C ON C.Level = '"
										+parseFloat(currentSENDUPGRADE.LevelUpgrade)
										+"' WHERE A.UserName = '"+currentSENDUPGRADE.UserName
										+"'AND B.numberBase = '"+parseFloat(currentSENDUPGRADE.numberBase)
										+"'",function (error, rows,field)
										{
											resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io);
										});
								}else
								{						           	
									socket.emit('RECIEVEUPGRADE', 
									{
										message : 0
									});
									console.log("gửi mail");
								}						            
							}    
						});
					}
				});
			});		


		});	
	}
}

//lấy tên bảng nâng cấp
function tableQuery(UpgradeWait) 
{
	var stRet="";
	switch (UpgradeWait) 
    {
		case "City":
    		stRet = "resourceupbase";
    		break;
		case "Swordman":
    		stRet = "resourceupswordman";
    		break;
		case "Farm":
    		stRet = "resourceupfarm";
    		break;
		case "Wood":
    		stRet = "resourceupwood";
    		break;
		case "Stone":
    		stRet = "resourceupStone";
    		break;
		case "Metal":
    		stRet = "resourceupmetal";
    		break;
		case "Bowman":
    		stRet = "resourceupbowman";
    		break;
		case "Granary":
    		stRet = "resourceupgranary";
    		break;
		case "Market":
    		stRet = "resourceupmarket";
    		break;
		case "CityWall":
    		stRet = "resourceupcitywall";
    		break;
		default:
		  break;

	}
	return stRet;
}

//kiểm tra nâng cấp level nào
function switchGetUpGradeItem(UpgradeWait) 
{
   var stUpgrate="";
    switch (UpgradeWait) 
    {
        case "City":
            stUpgrate = "LvCity";
            break;
        case "Swordman":
            stUpgrate = "LvSwordman";
            break;
        case "Farm":
            stUpgrate = "LvFarm";
            break;
        case "Wood":
            stUpgrate = "LvWood";
            break;
        case "Stone":
            stUpgrate = "LvStone";
            break;
        case "Metal":
            stUpgrate = "LvMetal";
            break;
        case "Bowman":
            stUpgrate = "LvBowman";
            break;
        case "Granary":
            stUpgrate = "LvGranary";
            break;
        case "Market":
            stUpgrate = "LvMarket";
            break;
        case "CityWall":
            stUpgrate = "LvCityWall";
            break;
        default:
          break;

    }
    return stUpgrate;
}

//Tính lượng tài nguyên tiêu hao
function resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io) 
{
    if (!!error) 
    {
        console.log("Error in the query Database Upgrade: "+currentSENDUPGRADE.UserName);
    }
    else 
    {
        console.log("Resource upgrade SENDUPGRADE: "+rows.length+"_"+(parseFloat(rows[0].UpdateCounter))+"_"+
            (parseFloat(currentSENDUPGRADE.LevelUpgrade)-parseFloat(rows[0].LvCity))+"_"+
            (parseFloat(rows[0].Farm) - parseFloat(rows[0].Farmconsumption))+"="+parseFloat(currentSENDUPGRADE.Farm)+"_"+
            (parseFloat(rows[0].Wood) - parseFloat(rows[0].Woodconsumption))+"="+parseFloat(currentSENDUPGRADE.Wood)+"_"+
            (parseFloat(rows[0].Stone) - parseFloat(rows[0].Stoneconsumption))+"="+parseFloat(currentSENDUPGRADE.Stone)+"_"+
            (parseFloat(rows[0].Metal) - parseFloat(rows[0].Metalconsumption))+"="+parseFloat(currentSENDUPGRADE.Metal)+"_"+
            (parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))+"="+parseFloat(currentSENDUPGRADE.Diamond));
        if (rows.length>0 && ((parseFloat(rows[0].UpdateCounter))===0)) 
        {

            if (((parseFloat(rows[0].Farm) - parseFloat(rows[0].Farmconsumption))===parseFloat(currentSENDUPGRADE.Farm))&&
                ((parseFloat(rows[0].Wood) - parseFloat(rows[0].Woodconsumption))===parseFloat(currentSENDUPGRADE.Wood))&&
                ((parseFloat(rows[0].Stone) - parseFloat(rows[0].Stoneconsumption))===parseFloat(currentSENDUPGRADE.Stone))&&
                ((parseFloat(rows[0].Metal) - parseFloat(rows[0].Metalconsumption))===parseFloat(currentSENDUPGRADE.Metal))&&
                ((parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))===parseFloat(currentSENDUPGRADE.Diamond)))
            {
                d = new Date();
                createPositionTimelast = Math.floor(d.getTime() / 1000);

                connection.query("UPDATE users, userbase SET users.Diamond = '"
                    + (parseFloat(currentSENDUPGRADE.Diamond))
                    +"',userbase.UpgradeWait = '"+ (currentSENDUPGRADE.UpgradeWait)
                    +"',userbase.TimeWait = '"+ (parseFloat(rows[0].TimeUp))
                    +"',userbase.TimeWaitSum = '"+ (parseFloat(rows[0].TimeUp)+parseFloat(createPositionTimelast))                                                              
                    +"',userbase.LevelUpgrade = '"+ (parseFloat(currentSENDUPGRADE.LevelUpgrade))
                    +"',userbase.Wood = '"+ (parseFloat(currentSENDUPGRADE.Wood))
                    +"',userbase.Stone = '"+ (parseFloat(currentSENDUPGRADE.Stone))
                    +"',userbase.Farm = '"+ (parseFloat(currentSENDUPGRADE.Farm))
                    +"',userbase.Metal = '"+ (parseFloat(currentSENDUPGRADE.Metal))
                    +"',userbase.UpdateCounter = 1 where users.UserName = userbase.UserName AND userbase.UserName = '"+currentSENDUPGRADE.UserName
                    +"'AND userbase.numberBase = '"+currentSENDUPGRADE.numberBase+"'",function checkError (error, result) 
                {
                    if (!!error) 
                    {
                        console.log("Error in the query: "+currentSENDUPGRADE.UserName);
                    } else 
                    {
                    	GetUpGradeItem(
                        currentSENDUPGRADE.UserName,
                        currentSENDUPGRADE.numberBase,
                        currentSENDUPGRADE.UpgradeWait,
                        parseFloat(currentSENDUPGRADE.LevelUpgrade),
                        parseFloat(rows[0].TimeUp),io);
                        if (result.affectedRows>0) 
                        {                           
                            console.log("update thanh cong: "+ currentSENDUPGRADE.UpgradeWait+"_UserName: "+currentSENDUPGRADE.UserName);
                            connection.release();
                        }
                        else 
                        {
                            console.log("update khong thanh cong: "+currentSENDUPGRADE.UpgradeWait+"_UserName: "+currentSENDUPGRADE.UserName);
                        }   
                    }
                });
            }else 
            {
                socket.emit('RECIEVEUPGRADE', 
                {
                    message : 0
                });
                console.log("gửi mail");
            }
        }
    }   
}

//Kiểm tra level của city phải lớn hơn mới được nâng cấp: Bowman, Granary, Market, CityWall
function checkLvCity(UserName, NumberBase,UpgradeWait,LevelUpgrade,callback) 
{   
    var query = pool.query("SELECT LvCity FROM `userbase` WHERE UserName = '"+UserName
        +"' AND numberBase = '"+NumberBase+"'",function (error, rows,field)
    {
        if (error) 
        {
            console.log("Error in the query UpgradeDatabase: "+UserName);
            callback(err,null);
        }else 
        {
            if (rows.length>0) 
            {                
                if ((UpgradeWait==="Bowman")||(UpgradeWait==="Granary") 
                    ||(UpgradeWait==="Market") ||(UpgradeWait==="CityWall")) 
                {                      
                    if ( ((parseFloat(rows[0].LvCity))>=5) && (parseFloat(rows[0].LvCity) >= (parseFloat(LevelUpgrade))) )
                    {                   
                        callback(null,1);                   
                    }else
                    {                   
                        callback(null,0);
                    }
                }else
                {                     
                    if (parseFloat(rows[0].LvCity) >= (parseFloat(LevelUpgrade))) 
                    {                   
                        callback(null,1);                   
                    }else
                    {                   
                        callback(null,0);
                    }
                }               
            }
        }
    }); 
}

//kiểm tra thời gian hoàn tất để cập nhật level nâng cấp
function GetUpGradeItem(UserName, NumberBase, UpgradeWait,LevelUpgrade, TimeOut,io) 
{   
    var time = TimeOut*1000;    
    var stswitchGetUpGradeItem = switchGetUpGradeItem(UpgradeWait);   

    setTimeout(function UpgradeDatabase(UserName, NumberBase, UpgradeWait, LevelUpgrade,io) 
    {  
        var query = pool.query("UPDATE userbase SET UpgradeWait = 'None',TimeWait = 0,"+stswitchGetUpGradeItem+"="+stswitchGetUpGradeItem+"+1,LevelUpgrade = 0,UpdateCounter = 0 where UserName = '"+UserName
            +"'AND numberBase = '"+NumberBase+"'",function(error, result, field){
                if (!!error) {
                    console.log("Error in the query UpgradeDatabase: "+UserName);
                }else {
                    if (result.affectedRows>0){

                        ClientRUpgradeComplete(UserName,NumberBase,UpgradeWait,LevelUpgrade,io);                                
                    }else {
                        console.log("update khong thanh cong City: "+UserName);
                    }
                }
            });
    },time,UserName, NumberBase, UpgradeWait, LevelUpgrade,io,stswitchGetUpGradeItem); 
}

//gửi level nâng cấp thành công lên client
function ClientRUpgradeComplete (UserName,NumberBase,UpgradeWait,LvUpgrade,io) 
{
    var GameServer = require("./login");
    var gameServer = new GameServer();
    exports.gameServer = gameServer;    

    console.log("LvUpgrade send client: "+LvUpgrade);

    if ((lodash.filter(gameServer.clients, x => x.name ===UserName)).length >0) {
        io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name ===UserName)].idSocket).emit('RECEIVEUPGRADECOMPLETE',
        {
            numberBase:parseFloat(NumberBase),                                                                              
            UpgradeWait:UpgradeWait,
            LevelUpgradeComplete: parseFloat(LvUpgrade),
        }); 
    }
}
