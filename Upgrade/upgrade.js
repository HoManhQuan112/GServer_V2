'use strict';

var database            = require('./../Util/db.js');
var sendMail            = require('./../Util/sendMail.js');
var functions           = require('./../Util/functions.js');

var socketEmit          = require('./../index.js');

var upgradeBase         = require('./Base/base.js');
var upgradeMaket        = require('./Market/market.js');

var upgradeUnit         = require('./Unit/unit.js');
var upgradeSwordman     = require('./Unit/Swordman.js');
var upgradeBowman       = require('./Unit/Bowman.js');
var upgradeCrossbow     = require('./Unit/Crossbow.js');
var upgradeHorseman     = require('./Unit/Horseman.js');

var upgradeFarm         = require('./Building/Farm.js');
var upgradeWood         = require('./Building/Wood.js');
var upgradeStone        = require('./Building/Stone.js');
var upgradeMetal        = require('./Building/Metal.js');

var upgradeGranary      = require('./Building/Granary.js');
var upgradeTower        = require('./Building/Tower.js');

var checkErrorUpgrade   = require('./CheckError/CheckErrorUpgrade.js')

var lodash              = require('lodash');

var DetailError;
var currentTime;
var current_S_UPGRADE;
// var objSetTime="";
var objSetTime={};

exports.start = function start (io) {
  io.on('connection',function getClientData(socket) 
  {
    S_UPGRADE (socket);
  });  
}

function S_UPGRADE (socket) {
  socket.on('S_UPGRADE',function getCData(data) 
  {   
    current_S_UPGRADE = get_current_S_UPGRADE(data);
    console.log(current_S_UPGRADE);

    if (current_S_UPGRADE.UpgradeWait==="City"){
      getDataUpgrade (current_S_UPGRADE,socket);
    }else{
      checkLvCity(current_S_UPGRADE, function (data){
        if (parseFloat(data)===1){
          getDataUpgrade (current_S_UPGRADE,socket);         
        }else{
          socket.emit('R_UPGRADE', 
          {
            message : 0
          });
        }
      });

    }
  });

}
function checkLvCity(current_S_UPGRADE,callback){   
  database.query("SELECT LvCity FROM `userbase` WHERE UserName = '"+current_S_UPGRADE.UserName
    +"' AND numberBase = '"+current_S_UPGRADE.numberBase+"'",function (error, rows){
      if (!!error){DetailError =('upgrade :Error SELECT LvCity '+current_S_UPGRADE.UserName);functions.writeLogErrror(DetailError);callback(0);}      
      if (rows.length>0) 
      {
        if ((current_S_UPGRADE.UpgradeWait==="Bowman")||(current_S_UPGRADE.UpgradeWait==="Granary") 
          ||(current_S_UPGRADE.UpgradeWait==="Market")||(current_S_UPGRADE.UpgradeWait==="CityWall")){
          (((parseFloat(rows[0].LvCity))>=5) && (parseFloat(rows[0].LvCity) >= (parseFloat(current_S_UPGRADE.LevelUpgrade))))?callback(1): callback(0);          
      }else{
        (parseFloat(rows[0].LvCity) >= (parseFloat(current_S_UPGRADE.LevelUpgrade)))?callback(1): callback(0);
      } 
    }
  }); 
}
function getDataUpgrade (current_S_UPGRADE,socket) {
  var tabQuery = "resourceup"+current_S_UPGRADE.UpgradeWait;

  database.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal,B.LvCity,B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "
    +tabQuery+" AS C ON C.Level = '"+parseFloat(current_S_UPGRADE.LevelUpgrade)
    +"' WHERE A.UserName = '"+current_S_UPGRADE.UserName
    +"'AND B.numberBase = '"+parseFloat(current_S_UPGRADE.numberBase)
    +"'",function(error, rows){
      if (!!error){DetailError =('upgrade :Error SELECT S_UPGRADE '+current_S_UPGRADE.UserName);functions.writeLogErrror(DetailError);}
      resourceUpLv(rows,current_S_UPGRADE,socket);
    });
}
function resourceUpLv(rows,current_S_UPGRADE,socket){
  if (rows.length>0 && ((parseFloat(rows[0].UpdateCounter))===0)) 
  {
    if (((parseInt(rows[0].Farm,10) - parseFloat(rows[0].Farmconsumption))===parseFloat(current_S_UPGRADE.Farm))&&
      ((parseFloat(rows[0].Wood) - parseFloat(rows[0].Woodconsumption))===parseFloat(current_S_UPGRADE.Wood))&&
      ((parseFloat(rows[0].Stone) - parseFloat(rows[0].Stoneconsumption))===parseFloat(current_S_UPGRADE.Stone))&&
      ((parseFloat(rows[0].Metal) - parseFloat(rows[0].Metalconsumption))===parseFloat(current_S_UPGRADE.Metal))&&
      ((parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))===parseFloat(current_S_UPGRADE.Diamond))){
      currentTime = Math.floor(new Date().getTime() / 1000);

    database.query("UPDATE users, userbase SET users.Diamond = '"+ (parseFloat(current_S_UPGRADE.Diamond))
      +"',userbase.UpgradeWait = '"+ (current_S_UPGRADE.UpgradeWait)
      +"',userbase.TimeWait = '"+ (parseFloat(rows[0].TimeUp))
      +"',userbase.TimeWaitSum = '"+ (parseFloat(rows[0].TimeUp)+parseFloat(currentTime))
      +"',userbase.LevelUpgrade = '"+ (parseFloat(current_S_UPGRADE.LevelUpgrade))
      +"',userbase.Wood = '"+ (parseFloat(current_S_UPGRADE.Wood))
      +"',userbase.Stone = '"+ (parseFloat(current_S_UPGRADE.Stone))
      +"',userbase.Farm = '"+ (parseFloat(current_S_UPGRADE.Farm))
      +"',userbase.Metal = '"+ (parseFloat(current_S_UPGRADE.Metal))
      +"',userbase.UpdateCounter = 1 WHERE users.UserName = userbase.UserName AND userbase.UserName = '"+current_S_UPGRADE.UserName
      +"'AND userbase.numberBase = '"+current_S_UPGRADE.numberBase+"'",function UpdateResource(error, result){
        if (!!error){DetailError =('upgrade :Error UPDATE resourceUp'+current_S_UPGRADE.UserName);functions.writeLogErrror(DetailError);
      }else {
        GetUpGradeItem(current_S_UPGRADE, parseFloat(rows[0].TimeUp));
      }

    });
  }else{
checkErrorUpgrade.errorUpgrade(current_S_UPGRADE);
    socket.emit('R_UPGRADE',{
      message : 0
    });
  }
}
}
//kiểm tra thời gian hoàn tất để cập nhật level nâng cấp
function GetUpGradeItem(current_S_UPGRADE, TimeOut){
  var time = TimeOut*1000;    
  var stswitchGetUpGradeItem = "Lv"+current_S_UPGRADE.UpgradeWait;
  var stcurrentlv = "CurrentLv"+current_S_UPGRADE.UpgradeWait;

  if (objSetTime[current_S_UPGRADE.UserName]===undefined) {

    setTOutFunc(time,current_S_UPGRADE,stswitchGetUpGradeItem);
  }
  
}

//gửi level nâng cấp thành công lên client

function updateCurrentLevel(rowsData,stswitchGetUpGradeItem)
{
  var FarmHarvestTime =  rowsData.UpgradeWait+"HarvestTime";
  var CurrentLv = "CurrentLv"+rowsData.UpgradeWait;
  var currentTime = Math.floor(new Date().getTime() / 1000);

  database.query("UPDATE userbase SET "+FarmHarvestTime+" = '"+parseFloat(currentTime)
    +"',"+CurrentLv+" = 1 WHERE UserName = '"+rowsData.UserName
    +"'AND numberBase = '"+rowsData.NumberBase
    +"'AND "+stswitchGetUpGradeItem+" = 1", function (error, result) {
      if (!!error){DetailError = ('upgrade.js: Error updateCurrentLevel'+rowsData.UserName);functions.writeLogErrror(DetailError);}
    });
}


function get_current_S_UPGRADE (data) {
  return current_S_UPGRADE =
  {
    UserName: data.UserName,
    numberBase: data.numberBase,
    UpgradeWait: data.UpgradeWait,
    LevelUpgrade: data.LevelUpgrade,
    Farm: data.Farm,
    Wood: data.Wood,
    Stone: data.Stone,
    Metal: data.Metal,
    Diamond: data.Diamond,
  }
}

// updade for Login
exports.updateCurrentUpgrade = function updateCurrentUpgrade (rowsData,currentTime) {
  if (rowsData.UpgradeWait!=="None") {
    var stswitchGetUpGradeItem = "Lv"+rowsData.UpgradeWait;   
    if (parseFloat(rowsData.TimeWaitSum)>parseFloat(currentTime)) {
      updateSetTimeWait(rowsData,parseFloat(rowsData.TimeWaitSum)-parseFloat(currentTime)); 
    }else{ 
      database.query("UPDATE userbase SET UpgradeWait = 'None',TimeWait = 0,"
        +stswitchGetUpGradeItem+"="+stswitchGetUpGradeItem+"+1,LevelUpgrade = 0,UpdateCounter = 0 WHERE UserName = '"+ rowsData.UserName
        +"'AND numberBase = '"+ rowsData.numberBase+"'",function (error){
          if (!!error){DetailError = ('upgrade.js: Error UpgradeDatabase '+ rowsData.UserName);functions.writeLogErrror(DetailError);}
        });
    }
  } 

}
function updateSetTimeWait (rowsData,timeWait) {
  database.query("UPDATE userbase SET TimeWait = '"+ timeWait+"' WHERE UserName = '"+rowsData.UserName+"'AND numberBase = '"+rowsData.numberBase+"'",function (error) {
    if (!!error){DetailError = ('login.js: Error updateSetTimeWait '+rowsData.UserName);functions.writeLogErrror(DetailError);}     
  }); 
  setUpgradeItem (rowsData,timeWait); 
}
function setUpgradeItem (rowsData,timeWait) {

  var time = timeWait*1000;    
  var stswitchGetUpGradeItem = "Lv"+rowsData.UpgradeWait;   

  if (objSetTime[rowsData.UserName]===undefined) {
    setTOutFunc(time,rowsData,stswitchGetUpGradeItem);
  }

}

function setTOutFunc (time,data,stswitchGetUpGradeItem) {
  
  var userName ={};
  userName[data.numberBase]= data.numberBase;
  objSetTime[data.UserName]=userName;
  //console.log(objSetTime);
  setTimeout(function (data,stswitchGetUpGradeItem){
    if (((data.UpgradeWait.toString().trim() === "Farm") 
      || (data.UpgradeWait.toString().trim() === "Wood") 
      || (data.UpgradeWait.toString().trim() === "Stone") 
      || (data.UpgradeWait.toString().trim() === "Metal"))&&parseFloat(data.LevelUpgrade)===1) {
      updateFirstLevel(data,stswitchGetUpGradeItem);
  }


  database.query("UPDATE userbase SET UpgradeWait = 'None',TimeWait = 0,"+stswitchGetUpGradeItem+"="+stswitchGetUpGradeItem+"+1,LevelUpgrade = 0,UpdateCounter = 0 WHERE UserName = '"+data.UserName
    +"'AND numberBase = '"+data.numberBase+"'",function (error){
      if (!!error){DetailError = ('upgrade.js: Error UpgradeDatabaseInGetUpgradeItem '+data.UserName);functions.writeLogErrror(DetailError);}
      R_UPGRADE_COMPLETE(data.UserName,data.numberBase,data.UpgradeWait,data.LevelUpgrade);
      checkDelObj (objSetTime,data);
      //delete objSetTime[data.UserName];
    });


},time,data,stswitchGetUpGradeItem);
}

function checkDelObj (objSetTime,data) { 
  delete objSetTime[data.UserName][data.numberBase];
  if (Object.keys(objSetTime[data.UserName]).length===0) {
    delete objSetTime[data.UserName]
  }
}

function R_UPGRADE_COMPLETE(UserName,numberBase,UpgradeWait,LevelUpgrade){
  socketEmit.socketEmit(UserName,'R_UPGRADE_COMPLETE',{
    numberBase:parseFloat(numberBase),
    UpgradeWait:UpgradeWait,
    LevelUpgradeComplete: parseFloat(LevelUpgrade),
  });
}
//cập nhật current level đầu tiên 
function updateFirstLevel(rowsData,stswitchGetUpGradeItem){
  var FarmHarvestTime =  rowsData.UpgradeWait+"HarvestTime";
  var CurrentLv = "CurrentLv"+rowsData.UpgradeWait;
  var currentTime = Math.floor(new Date().getTime() / 1000);

  database.query( "UPDATE userbase SET "+FarmHarvestTime+" = '"+parseFloat(currentTime)
    +"',"+CurrentLv+" = 1 "
    +" WHERE UserName = '"+rowsData.UserName
    +"'AND numberBase = '"+rowsData.numberBase+"'", function (error, result) {
     if (!!error){DetailError = ('upgrade.js: Error updateFirstLevel '+rowsData.UserName);functions.writeLogErrror(DetailError);}
   });
  checkDelObj (objSetTime,rowsData);
 // delete objSetTime[rowsData.UserName];

}
//
exports.getUpgradeInfo = function getUpgradeInfo (
  arrayAllresourcebuybase,arrayAllresourceupbase,
  arrayAllresourceupMarket,arrayAllResourceToDiamond,
  arrayAllresourceupSwordman,arrayAllresourceupBowman,arrayAllresourceupCrossbow, arrayAllresourceupHorseman,
  arrayAllresourcebuyunit,
  arrayAllresourceupFarm,arrayAllresourceupWood,arrayAllresourceupStone,arrayAllresourceupMetal,
  arrayAllresourceupGranary, arrayAllresourceupTower
  ) {
  upgradeBase.getarrayAllresourcebuybase(function (rows) {
    arrayAllresourcebuybase(rows);
  });
  upgradeBase.getarrayAllresourceupbase(function (rows) {
    arrayAllresourceupbase(rows);
  });
  //
  upgradeMaket.getarrayAllresourceupMarket(function (rows) {
   arrayAllresourceupMarket(rows);
 });
  upgradeMaket.getarrayAllResourceToDiamond(function (rows) {
    arrayAllResourceToDiamond(rows);
  });
  //
  upgradeSwordman.getarrayAllresourceupSwordman(function (rows) {
    arrayAllresourceupSwordman(rows);
  });
  upgradeBowman.getarrayAllresourceupBowman(function (rows) {
    arrayAllresourceupBowman(rows);
  });
  upgradeCrossbow.getarrayAllresourceupCrossbow(function (rows) {
    arrayAllresourceupCrossbow(rows);
  });
  upgradeHorseman.getarrayAllresourceupHorseman(function (rows) {
    arrayAllresourceupHorseman(rows);
  });
  upgradeUnit.getarrayAllresourcebuyunit(function (rows) {
    arrayAllresourcebuyunit(rows);
  });
  //
  upgradeFarm.getarrayAllresourceupFarm(function (rows) {
    arrayAllresourceupFarm(rows);
  });
  upgradeWood.getarrayAllresourceupWood(function (rows) {
    arrayAllresourceupWood(rows);
  });
  upgradeStone.getarrayAllresourceupStone(function (rows) {
    arrayAllresourceupStone(rows);
  });
  upgradeMetal.getarrayAllresourceupMetal(function (rows) {
    arrayAllresourceupMetal(rows);
  });
  //
  upgradeGranary.getarrayAllresourceupGranary(function (rows) {
    arrayAllresourceupGranary(rows);
  });
  upgradeTower.getarrayAllresourceupTower(function (rows) {
    arrayAllresourceupTower(rows);
  });
}