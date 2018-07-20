'use strict';
var pool = require('./db');
var CronJob 		= require('cron').CronJob;
var lodash		    = require('lodash');
var functions   = require("./functions");
var currentSENDUPGRADE,d,createPositionTimelast,DetailError;

module.exports=
{
	start: function (io) 
	{
		io.on('connection',function getClientData(socket) 
		{
			socket.on('S_UPGRADE',function getCData(data) 
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

				console.log("data receive  S_UPGRADE ============: "
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
					var tabQuery = "resourceup"+currentSENDUPGRADE.UpgradeWait;			
					if (currentSENDUPGRADE.UpgradeWait==="City") 
					{
                        //Nâng cấp city
						connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity,B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "
							+tabQuery+" AS C ON C.Level = '"
							+parseFloat(currentSENDUPGRADE.LevelUpgrade)
							+"' WHERE A.UserName = '"+currentSENDUPGRADE.UserName
							+"'AND B.numberBase = '"+parseFloat(currentSENDUPGRADE.numberBase)
							+"'",function UpdateCity(error, rows,field)
							{
								resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io);
							});
					}else
					{
						checkLvCity(currentSENDUPGRADE.UserName, currentSENDUPGRADE.numberBase,currentSENDUPGRADE.UpgradeWait, currentSENDUPGRADE.LevelUpgrade, function CheckLimitLevel(err,data)
						{
							if (err) {	DetailError = ("ERROR ======: ",err);            
                                console.log(DetailError);
                                functions.writeLogErrror(DetailError);
							} else {            
								if (parseFloat(data)===1) 
								{
									connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity,B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "
										+tabQuery+" AS C ON C.Level = '"
										+parseFloat(currentSENDUPGRADE.LevelUpgrade)
										+"' WHERE A.UserName = '"+currentSENDUPGRADE.UserName
										+"'AND B.numberBase = '"+parseFloat(currentSENDUPGRADE.numberBase)
										+"'",function getResource(error, rows,field)
									{
										resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io);                                        
									});
								}else
								{						           	
									socket.emit('R_UPGRADE', 
									{
										message : 0
									});									
								}						            
							}    
						});
					}
				});
			});		


		});	
	}
}

//Tính lượng tài nguyên tiêu hao
function resourceUpLv(error, rows,field,currentSENDUPGRADE,connection,socket,io) 
{
    if (!!error){console.log("upgrade: Error in the query Database Upgrade: "+currentSENDUPGRADE.UserName);
    }
    else 
    {
        if (rows.length>0 && ((parseFloat(rows[0].UpdateCounter))===0)) 
        {
            if (((parseInt(rows[0].Farm,10) - parseFloat(rows[0].Farmconsumption))===parseFloat(currentSENDUPGRADE.Farm))&&
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
                    +"'AND userbase.numberBase = '"+currentSENDUPGRADE.numberBase+"'",function UpdateResource(error, result) 
                {
                    if (!!error){DetailError = ("upgrate: Error in the query 1: "+currentSENDUPGRADE.UserName);
                        console.log(DetailError);
                        functions.writeLogErrror(DetailError);
                    } else 
                    {
                    	GetUpGradeItem(currentSENDUPGRADE.UserName, currentSENDUPGRADE.numberBase, currentSENDUPGRADE.UpgradeWait, parseFloat(currentSENDUPGRADE.LevelUpgrade), parseFloat(rows[0].TimeUp), io);
                        if (result.affectedRows>0){connection.release();}   
                    }
                });
            }else 
            {
                socket.emit('R_UPGRADE', 
                {
                    message : 0
                });                
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
            DetailError = ("upgrate: Error in the query UpgradeDatabase: "+UserName);
            console.log(DetailError);
            functions.writeLogErrror(DetailError);
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
    var stswitchGetUpGradeItem = "Lv"+UpgradeWait;   
    console.log(stswitchGetUpGradeItem);
    var stcurrentlv = "CurrentLv"+UpgradeWait;  //,"+stcurrentlv+"="+stcurrentlv+"+1

    setTimeout(function UpgradeDatabase(UserName, NumberBase, UpgradeWait, LevelUpgrade,io) 
    {  
        var query = pool.query("UPDATE userbase SET UpgradeWait = 'None',TimeWait = 0,"+stswitchGetUpGradeItem+"="+stswitchGetUpGradeItem+"+1,LevelUpgrade = 0,UpdateCounter = 0 where UserName = '"+UserName
            +"'AND numberBase = '"+NumberBase+"'",function(error, result, field){
                if (!!error){DetailError = ("upgrate: Error in the query UpgradeDatabase: "+UserName);
                    console.log(DetailError);
                    functions.writeLogErrror(DetailError);
                }else {
                    if (result.affectedRows>0){
                        ClientRUpgradeComplete(UserName,NumberBase,UpgradeWait,LevelUpgrade,io); 
                        //kiểm tra update currentlv(farm, wood, stone, metal)
                        if ((UpgradeWait.toString().trim() === "Farm") 
                            || (UpgradeWait.toString().trim() === "Wood") 
                            || (UpgradeWait.toString().trim() === "Stone") 
                            || (UpgradeWait.toString().trim() === "Metal")) 
                        {
                            updateCurrentLevel(UserName, NumberBase, UpgradeWait,stswitchGetUpGradeItem);
                        }
                    }
                }
            });
    },time,UserName, NumberBase, UpgradeWait, LevelUpgrade,io,stswitchGetUpGradeItem); 
}

//cập nhật current level đầu tiên 
function updateCurrentLevel(UserName, NumberBase,UpgradeWait,stswitchGetUpGradeItem)
{
    var FarmHarvestTime =  UpgradeWait+"HarvestTime", CurrentLvFarm = "CurrentLv"+UpgradeWait;
    d = new Date();
    createPositionTimelast = Math.floor(d.getTime() / 1000);

    var query = pool.query("UPDATE userbase SET "+FarmHarvestTime+" = '"+parseFloat(createPositionTimelast)
        +"',"+CurrentLvFarm+" = 1 where UserName = '"+UserName
        +"'AND numberBase = '"+NumberBase
        +"'AND "+stswitchGetUpGradeItem+" = 1", function (error, result, field) {
            if (!!error) {DetailError = ("upgrate: Error in the query 2");
                console.log(DetailError);
                functions.writeLogErrror(DetailError);
            }
        }
    );
}

//gửi level nâng cấp thành công lên client
function ClientRUpgradeComplete(UserName,NumberBase,UpgradeWait,LvUpgrade,io) 
{
    var GameServer = require("./login2");
    var gameServer = new GameServer();
    exports.gameServer = gameServer;
    console.log(UpgradeWait+" "+LvUpgrade+" Thanh cong");
    if ((lodash.filter(gameServer.clients, x => x.name ===UserName)).length >0) {
        io.in(gameServer.clients[gameServer.clients.findIndex(item => item.name ===UserName)].idSocket).emit('R_UPGRADE_COMPLETE',
        {
            numberBase:parseFloat(NumberBase),                                                                              
            UpgradeWait:UpgradeWait,
            LevelUpgradeComplete: parseFloat(LvUpgrade),
        }); 
    }
}
