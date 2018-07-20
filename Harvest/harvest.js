'use strict';
var database 			= require('./../Util/db.js');
var functions           = require('./../Util/functions.js');



exports.updateTimeHarvest = function updateTimeHarvest (rows,currentTime) {
	updateMineInBase(rows,currentTime);
}

function updateMineInBase (rows,currentTime) {
	updateTimeFarm (rows,currentTime);
	updateTimeWood (rows,currentTime);
	updateTimeStone(rows,currentTime);
	updateTimeMetal(rows,currentTime);
}
//Metal
function updateTimeMetal (rows,currentTime) {
	database.query("SELECT A.Metal,A.LvMetal,A.UserName,A.numberBase,A.MetalHarvestTime,A.CurrentLvMetal, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupmetal AS B ON B.Level =  A.CurrentLvMetal"
		+" WHERE A.UserName = '"+rows.UserName+"'AND A.numberBase = '"+rows.numberBase+"'",function(error,result){
			if (!!error){DetailError =('harvest :Error updateTimeMetal '+rows.UserName);functions.writeLogErrror(DetailError);}
			if (result.length>0) {
				for (var i = 0; i < result.length; i++) {
					var MineHarvestServer = (parseFloat(currentTime) - parseFloat(result[i].MetalHarvestTime))*(parseFloat(result[i].HarvestPerHour)/3600);
					if (MineHarvestServer >= parseFloat(result[i].HarvestContainer)) {
						MineHarvestServer = result[i].HarvestContainer;	
					}else{	
						MineHarvestServer = retFixedNumber(MineHarvestServer);
					}
					updateCurrentHarvestMetal (result[i], MineHarvestServer);
				}
			}
		});
}
function updateCurrentHarvestMetal (rows,harvestQuality) {
	var stringQuery = "UPDATE userbase SET CurrenHarvestMetal = '"+ (parseFloat(harvestQuality))                				                	                	
	+"' WHERE UserName = '"+rows.UserName+"'AND numberBase = '"+parseFloat(rows.numberBase)+"'";	
	database.query(stringQuery,function(error){
		if (!!error){DetailError =("harvest: error updateCurrentHarvestMetal "+rows.UserName);	functions.writeLogErrror(DetailError);}
	});
}
//Stone
function updateTimeStone (rows,currentTime) {
	database.query("SELECT A.Stone,A.LvStone,A.UserName,A.numberBase,A.StoneHarvestTime,A.CurrentLvStone, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupstone AS B ON B.Level =  A.CurrentLvStone WHERE A.UserName = '"
		+rows.UserName+"'AND A.numberBase = '"+rows.numberBase+"'",function(error,result){
			if (!!error){DetailError =('harvest :Error updateTimeWood '+rows.UserName);functions.writeLogErrror(DetailError);}
			if (result.length>0) {				
				for (var i = 0; i < result.length; i++) {
					var MineHarvestServer = (parseFloat(currentTime) - parseFloat(result[i].StoneHarvestTime))*(parseFloat(result[i].HarvestPerHour)/3600);
					if (MineHarvestServer >= parseFloat(result[i].HarvestContainer)) {
						MineHarvestServer= result[i].HarvestContainer;	
					}else{	
						MineHarvestServer = retFixedNumber(MineHarvestServer);
					}
					updateCurrentHarvestStone (result[i], MineHarvestServer);
				}
			}
		});
}
function updateCurrentHarvestStone (rows,harvestQuality) {
	var stringQuery = "UPDATE userbase SET CurrenHarvestStone = '"+ (parseFloat(harvestQuality))                				                	                	
		+"'WHERE UserName = '"+rows.UserName+"'AND numberBase = '"+parseFloat(rows.numberBase)+"'";
	database.query(stringQuery,function(error){
			if (!!error){DetailError =("harvest: error updateCurrentHarvestStone "+rows.UserName);	functions.writeLogErrror(DetailError);}
		});
}
//Wood
function updateTimeWood (rows,currentTime) {
	database.query("SELECT A.Wood,A.LvWood,A.UserName,A.numberBase,A.WoodHarvestTime,A.CurrentLvWood, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupwood AS B ON B.Level =  A.CurrentLvWood WHERE A.UserName = '"
		+rows.UserName+"'AND A.numberBase = '"+rows.numberBase+"'",function(error,result){
			if (!!error){DetailError =('harvest :Error updateTimeWood '+rows.UserName);functions.writeLogErrror(DetailError);}
			if (result.length>0) {
				for (var i = 0; i < result.length; i++) {
					var MineHarvestServer = (parseFloat(currentTime) - parseFloat(result[i].WoodHarvestTime))*(parseFloat(result[i].HarvestPerHour)/3600);
					if (MineHarvestServer >= parseFloat(result[i].HarvestContainer)) {
						MineHarvestServer= result[i].HarvestContainer;	
					}else{	
						MineHarvestServer = retFixedNumber(MineHarvestServer);
					}
					updateCurrentHarvestWood (result[i], MineHarvestServer);
				}
			}
		});
}
function updateCurrentHarvestWood (rows,harvestQuality) {
	database.query("UPDATE userbase SET CurrenHarvestWood = '"+ (parseFloat(harvestQuality))                				                	                	
		+"'WHERE UserName = '"+rows.UserName+"'AND numberBase = '"+parseFloat(rows.numberBase)+"'",function(error){
			if (!!error){DetailError =("harvest: error updateCurrentHarvestWood "+rows.UserName);	functions.writeLogErrror(DetailError);}
		});
}
//Farm
function updateTimeFarm (rows,currentTime) {
	database.query("SELECT A.Farm,A.LvFarm,A.UserName,A.numberBase,A.FarmHarvestTime,A.CurrentLvFarm, B.HarvestPerHour, B.HarvestContainer FROM userbase AS A INNER JOIN resourceupfarm AS B ON B.Level =  A.CurrentLvFarm WHERE A.UserName = '"
		+rows.UserName +"'AND A.numberBase = '"+rows.numberBase+"'",function(error,result){
			if (!!error){DetailError =("harvest: error updateTimeFarm "+rows.UserName);functions.writeLogErrror(DetailError);}
			if (result.length>0) {
				for (var i = 0; i < result.length; i++) {
				var MineHarvestServer = (parseFloat(currentTime) - parseFloat(result[i].FarmHarvestTime))*(parseFloat(result[i].HarvestPerHour)/3600);
					if (MineHarvestServer >= parseFloat(result[i].HarvestContainer)) {
						MineHarvestServer= result[i].HarvestContainer;	
					}else{	
						MineHarvestServer = retFixedNumber(MineHarvestServer);
					}
					updateCurrentHarvestFarm (result[i], MineHarvestServer);
				}				
			}
		});
}
function updateCurrentHarvestFarm (rows,harvestQuality) {
	database.query("UPDATE userbase SET CurrenHarvestFarm = '"+ (parseFloat(harvestQuality))			                		                	                		
		+"'WHERE UserName = '"+rows.UserName+"'AND numberBase = '"+parseFloat(rows.numberBase)+"'",function(error){
			if (!!error){DetailError =("harvest: error updateTimeHarvestFarm "+rows.UserName);	functions.writeLogErrror(DetailError);}
		});
}
//
var current_S_HARVEST;
var currentTime;

var DetailError;

var AMineType, ALvMineType, AMineTypeHarvestTime, ACurrentLvMineType,AresourceupMineType;
var currentHarvest;
var QualityUpdate;
var TimeLeft;

var HarvestServer;
var updateTimeDatabase;

var delayHarvest = 2;
exports.start = function start (io) {
	io.on('connection',function getClientData(socket) {
		S_HARVEST (socket);
	});
}

function S_HARVEST (socket) {
	socket.on('S_HARVEST',function getCData(data){

		current_S_HARVEST = get_current_S_HARVEST(data);
		// console.log('current_S_HARVEST');
		// console.log(current_S_HARVEST);
		currentTime = Math.floor(new Date().getTime() / 1000);			
		get_queryMineType(current_S_HARVEST.MineType);
		queryResourceUpGranary(socket);
	});
	
}

function queryResourceUpGranary(socket) {
	
	database.query("SELECT "
		+AMineType+" as MineQuality,"
		+ALvMineType+" as LvMineType,"
		+AMineTypeHarvestTime+" as MineTypeHarvestTime,"
		+ACurrentLvMineType+" as CurrentLvMineType, B.HarvestPerHour, B.HarvestContainer,C.MaxStorage FROM userbase AS A INNER JOIN "
		+AresourceupMineType+" AS B ON B.Level = "
		+ACurrentLvMineType+" INNER JOIN resourceupgranary AS C ON C.Level = A.LvGranary WHERE A.UserName = '"+current_S_HARVEST.UserName
		+"'AND A.numberBase = '"+current_S_HARVEST.numberBase+"'",function (error,rows) {
			if (!!error){DetailError =('harvest :Error queryResourceUpGranary '+current_S_HARVEST.UserName);functions.writeLogErrror(DetailError);}
			if (rows.length>0) {
				var harvestPerSecond = parseFloat(rows[0].HarvestPerHour)/3600;
				var currentHarvestTime = (currentTime - parseFloat(rows[0].MineTypeHarvestTime));
				var maxHarvestTime = parseFloat(rows[0].HarvestContainer)*3600/parseFloat(rows[0].HarvestPerHour);

				if (currentHarvestTime>=maxHarvestTime) {
					currentHarvest = rows[0].HarvestContainer;
				}else{
					currentHarvest=retFixedNumber(currentHarvestTime*(rows[0].HarvestPerHour/3600));
				}

				QualityUpdate = currentHarvest+rows[0].MineQuality;
				
				updateTimeDatabase = currentTime;
				var HarvestRemain = 0;
				if (QualityUpdate >= parseFloat(rows[0].MaxStorage)) {
					HarvestRemain = QualityUpdate - rows[0].MaxStorage;
					if (HarvestRemain<0) {HarvestRemain=0;}
					QualityUpdate = rows[0].MaxStorage;
					updateTimeDatabase	= Math.floor(currentTime - (HarvestRemain/harvestPerSecond));
				}			

				if ((parseFloat(current_S_HARVEST.MineTotal) >= QualityUpdate+delayHarvest)) {
					TimeLeft = (maxHarvestTime-((current_S_HARVEST.MineTotal - QualityUpdate)/harvestPerSecond));	
				}else{
					QualityUpdate = current_S_HARVEST.MineTotal;
					TimeLeft = maxHarvestTime;
				}

				if (parseFloat(rows[0].LvMineType)===parseFloat(rows[0].CurrentLvMineType)) {
					updateHarvestDatabase(current_S_HARVEST,QualityUpdate,HarvestRemain,updateTimeDatabase);
				}else if (parseFloat(rows[0].LvMineType)>parseFloat(rows[0].CurrentLvMineType)) {
					updateHarvestLvUp (current_S_HARVEST,QualityUpdate,HarvestRemain,updateTimeDatabase,rows[0]);
				}

				R_HARVEST (socket,current_S_HARVEST.MineType,TimeLeft,QualityUpdate);

			}else{
				DetailError =('Hack Harvest '+current_S_HARVEST.UserName);functions.writeLogErrror(DetailError);				
			}
		});
}
function R_HARVEST (socket,MineType,TimeLeft,QualityUpdate) {
	var data;
	switch (MineType) {
		case "Farm":
		data = {
			Farm : parseFloat(QualityUpdate),
			numberBase: parseFloat(current_S_HARVEST.numberBase),
			FarmTimeLeft : TimeLeft,		
		}
		break;
		case "Wood":
		data = {
			Wood : parseFloat(QualityUpdate),
			numberBase: parseFloat(current_S_HARVEST.numberBase),
			WoodTimeLeft : TimeLeft,		
		}
		break;
		case "Stone":
		data = {
			Stone : parseFloat(QualityUpdate),
			numberBase: parseFloat(current_S_HARVEST.numberBase),
			StoneTimeLeft : TimeLeft,		
		}
		break;
		case "Metal":
		data = {
			Metal : parseFloat(QualityUpdate),
			numberBase: parseFloat(current_S_HARVEST.numberBase),
			MetalTimeLeft : TimeLeft,		
		}
		break;
	}
	socket.emit('R_HARVEST',data);	
}
function updateHarvestLvUp (current_S_HARVEST,QualityUpdate,harvestRemain,updateTimeDatabase,row){
	var CurrenHarvestType="CurrenHarvest"+current_S_HARVEST.MineType;
	var HarvestTimeType = current_S_HARVEST.MineType+"HarvestTime";
	var CurrentLvType = "CurrentLv"+current_S_HARVEST.MineType;
	var stringQuery ="UPDATE userbase SET "
	+current_S_HARVEST.MineType+" = '"+QualityUpdate
	+"',"+CurrenHarvestType+" = '"+ (parseFloat(harvestRemain))
	+"',"+HarvestTimeType+" = '"+ (parseFloat(updateTimeDatabase))
	+"',"+CurrentLvType+" = '"+ (parseFloat(row.LvMineType))                	                	                		
	+"' WHERE UserName = '"+current_S_HARVEST.UserName
	+"' AND numberBase = '"+current_S_HARVEST.numberBase+"'";
	// console.log(stringQuery);
	database.query("UPDATE userbase SET "
		+current_S_HARVEST.MineType+" = '"+QualityUpdate
		+"',"+CurrenHarvestType+" = '"+ (parseFloat(harvestRemain))
		+"',"+HarvestTimeType+" = '"+ (parseFloat(updateTimeDatabase))
		+"',"+CurrentLvType+" = '"+ (parseFloat(row.LvMineType))                	                	                		
		+"' WHERE UserName = '"+current_S_HARVEST.UserName
		+"' AND numberBase = '"+current_S_HARVEST.numberBase+"'",function(error,result){
			if (!!error){DetailError =('harvest :Error updateHarvestLvUp '+current_S_HARVEST.UserName);functions.writeLogErrror(DetailError);}			
		});	
}
function updateHarvestDatabase (current_S_HARVEST,QualityUpdate,harvestRemain,updateTimeDatabase) {
	var CurrenHarvestType="CurrenHarvest"+current_S_HARVEST.MineType;
	var HarvestTimeType = current_S_HARVEST.MineType+"HarvestTime";
	var stringQuery ="UPDATE userbase SET "
	+current_S_HARVEST.MineType+" = '"+QualityUpdate
	+"',"+CurrenHarvestType+" = '"+ (parseFloat(harvestRemain))
	+"',"+HarvestTimeType+" = '"+ (parseFloat(updateTimeDatabase))	                	                	                		
	+"' WHERE UserName = '"+current_S_HARVEST.UserName
	+"' AND numberBase = '"+current_S_HARVEST.numberBase+"'"
	// console.log(stringQuery);
	database.query("UPDATE userbase SET "
		+current_S_HARVEST.MineType+" = '"+QualityUpdate
		+"',"+CurrenHarvestType+" = '"+ (parseFloat(harvestRemain))
		+"',"+HarvestTimeType+" = '"+ (parseFloat(updateTimeDatabase))	                	                	                		
		+"' WHERE UserName = '"+current_S_HARVEST.UserName
		+"' AND numberBase = '"+current_S_HARVEST.numberBase+"'",function(error,result){
			if (!!error){DetailError =('harvest :Error updateHarvestDatabase '+current_S_HARVEST.UserName);functions.writeLogErrror(DetailError);}	
		});	
}
function retFixedNumber (number) {
	var retNumber;
	((number%1)>0.5)?retNumber = Number(number.toFixed(0)):retNumber = Number(number.toFixed(0))+1;		
	return retNumber;
}
function get_current_S_HARVEST (data) {
	return current_S_HARVEST =
	{
		UserName: data.UserName,		
		numberBase: data.numberBase,				
		MineType: data.MineType,
		MineTotal: data.MineTotal,
		MineHarvest: data.MineHarvest,
	}
}
function get_queryMineType (MineType) {

	AMineType = "A."+current_S_HARVEST.MineType, 
	ALvMineType = "A.Lv"+current_S_HARVEST.MineType,
	AMineTypeHarvestTime = "A."+current_S_HARVEST.MineType+"HarvestTime", 
	ACurrentLvMineType = "CurrentLv"+current_S_HARVEST.MineType,
	AresourceupMineType = "resourceup"+current_S_HARVEST.MineType;
}