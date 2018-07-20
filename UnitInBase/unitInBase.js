'use strict';
var database 		= require('./../Util/db.js');
var functions 		= require("./../Util/functions.js");



// var currentBaseComplete,
// arrayFarmBase = [],arrayWoodBase = [],arrayStoneBase = [],arrayMetalBase = [],arrayLevelBase = [],arrayTimeUnitComplete = [],arrayFarmSpent = [],
// arrayUserNamecomplete = [], arrayUnitTypecomplete = [],arrayQualitycomplete = [],arrayLevelcomplete = [],arrayWoodSpent = [],
// arrayStoneSpent = [],arrayMetalSpent =[];

var currentTime;
var DetailError;
var current_S_BUY_UNIT;
var objSetTime={};

exports.getarrayUnitBaseUser = function getarrayUnitBaseUser (currentUser,arrayUnitBaseUser) {
	database.query("SELECT  * FROM `unitinbase` WHERE `UserName` ='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('unitInBase: Error SELECT getarrayUnitBaseUser '+currentUser.name);functions.writeLogErrror(DetailError);}
			(rows.length>0)?arrayUnitBaseUser(rows):arrayUnitBaseUser(0);
	});
}
exports.getarrayUnitWaitBaseUser = function getarrayUnitWaitBaseUser (currentUser,arrayUnitWaitBaseUser) {
	database.query("SELECT `UserName`,`numberBase`, `UnitType`, `Quality`, `Level`,`timeRemain` FROM `unitwaitinbase` WHERE `timeRemain` !='0' AND `UserName` ='"+currentUser.name+"'",
		function(error, rows){
			if (!!error){DetailError =('unitInBase: Error SELECT getarrayUnitWaitBaseUser');functions.writeLogErrror(DetailError);}
			(rows.length>0)?arrayUnitWaitBaseUser(rows):arrayUnitWaitBaseUser(0);
			if (rows.length>0) {
				var userName ={};			
				for (var i = 0; i < rows.length; i++) {
					if (objSetTime[currentUser.name][rows[i].numberBase]===undefined) {
						userName[rows[i].numberBase]= rows[i].numberBase;
						objSetTime[currentUser.name]=userName;
						setTimeUpdateUnitWait (timeRemain,rows[i]);
					}					
				}
			}
		});
}
//
exports.start = function start (io) 
{
	io.on('connection',function getClientData(socket){
		S_BUY_UNIT (socket);
	});
}

function S_BUY_UNIT (socket) {
	socket.on('S_BUY_UNIT', function (data){
		current_S_BUY_UNIT= getcurrent_S_BUY_UNIT(data);
		
		console.log("data receive S_BUY_UNIT:"
			+"_"+current_S_BUY_UNIT.UserName
			+"_"+current_S_BUY_UNIT.numberBase
			+"_"+current_S_BUY_UNIT.UnitType
			+"_"+current_S_BUY_UNIT.Level
			+"_"+current_S_BUY_UNIT.Quality
			+"_"+current_S_BUY_UNIT.Farm
			+"_"+current_S_BUY_UNIT.Wood
			+"_"+current_S_BUY_UNIT.Stone
			+"_"+current_S_BUY_UNIT.Metal
			+"_"+current_S_BUY_UNIT.Diamond);

		
		database.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+current_S_BUY_UNIT.UserName
			+"' AND `numberBase` = '"+current_S_BUY_UNIT.numberBase+"'",function(error, rows){
				
				if (!!error){DetailError =('unitInBase :Error SELECT unitwaitinbase '+current_S_BUY_UNIT.UserName);functions.writeLogErrror(DetailError);}
				if (rows.length===0) {
					buyUnit();
				}else{
					socket.emit('R_TIME_WAIT_IN_BASE',
					{
						checkResource:0,
					});
				}
			});

	});	

}

function buyUnit () {
	
	var resourceBUnit = resourceBuyUnit(current_S_BUY_UNIT.UnitType);
	var queryString = "SELECT A.Diamond, B.Farm, B.Wood, B.Stone, B.Metal, C.Diamond as DiamondBuy, C.Farm as FarmBuy, C.Wood as WoodBuy, C.Stone as StoneBuy, C.Metal as MetalBuy, C.TimeBuy"
	+" FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN "+resourceBUnit+" AS C ON C.Level = '"+current_S_BUY_UNIT.Level
	+"' WHERE A.UserName = '"+current_S_BUY_UNIT.UserName
	+"' AND B.numberBase = '"+current_S_BUY_UNIT.numberBase
	+"' AND C.UnitType = '"+current_S_BUY_UNIT.UnitType+"'";
	
	database.query(queryString,function(error, rows){
		if (!!error){DetailError =('unitInBase :Error SELECT buyUnit '+current_S_BUY_UNIT.UserName);functions.writeLogErrror(DetailError);}
		if(checkDataTrueFalse (rows[0], current_S_BUY_UNIT)===true){
			var TimeBuy = (rows[0].TimeBuy)*(current_S_BUY_UNIT.Quality);
			updateUserBase(current_S_BUY_UNIT);
			insertBuyNewUnit(current_S_BUY_UNIT,TimeBuy);
		}else{
			console.log("Hack buyUnit "+current_S_BUY_UNIT.UserName);
		}


	// 	if (((((data.Farm - FarmBuy)===current_S_BUY_UNIT.Farm)&&((data.Wood - WoodBuy)===current_S_BUY_UNIT.Wood))&&
	// 		(((data.Stone - StoneBuy)===current_S_BUY_UNIT.Stone)&&((data.Metal - MetalBuy)===current_S_BUY_UNIT.Metal)))&&(data.Diamond - DiamondBuy)===current_S_BUY_UNIT.Diamond) {
	// 		console.log("here");
	// 	updateUserBase(current_S_BUY_UNIT);
	// 	insertBuyNewUnit(current_S_BUY_UNIT,TimeBuy);
	// }
	// if(rows.length===0){
	// 	console.log("Hack "+current_S_BUY_UNIT.UserName);
	// }

});
}
function checkDataTrueFalse (data,user) {
	var check = true;
	var checkArray =[]
	var FarmBuy = (data.FarmBuy)*(user.Quality);
	var WoodBuy = (data.WoodBuy)*(user.Quality);
	var StoneBuy = (data.StoneBuy)*(user.Quality);
	var MetalBuy = (data.MetalBuy)*(user.Quality);
	var DiamondBuy = (data.DiamondBuy)*(user.Quality);
	
	
	if (data.Farm -FarmBuy ==user.Farm) {checkArray.push(true);}else{checkArray.push(false);}
	if (data.Wood -WoodBuy ==user.Wood) {checkArray.push(true);}else{checkArray.push(false);}
	if (data.Stone -StoneBuy ==user.Stone) {checkArray.push(true);}else{checkArray.push(false);}
	if (data.Metal -MetalBuy ==user.Metal) {checkArray.push(true);}else{checkArray.push(false);}
	if (data.Diamond -DiamondBuy ==user.Diamond) {checkArray.push(true); }else{checkArray.push(false);}

	for (var i = 0; i < checkArray.length; i++) {
		if (checkArray[i]===false) {check=false;break;}
	}
	return check;
}
function updateUserBase (current_S_BUY_UNIT) {

	database.query("UPDATE users, userbase SET"
		+" users.Diamond = '"+ (parseFloat(current_S_BUY_UNIT.Diamond))	
		+"',userbase.Farm = '"+ (parseFloat(current_S_BUY_UNIT.Farm))                			
		+"',userbase.Wood = '"+ (parseFloat(current_S_BUY_UNIT.Wood))
		+"',userbase.Stone = '"+ (parseFloat(current_S_BUY_UNIT.Stone))		
		+"',userbase.Metal = '"+ (parseFloat(current_S_BUY_UNIT.Metal))
		+"'WHERE users.UserName = userbase.UserName AND userbase.UserName = '"+current_S_BUY_UNIT.UserName
		+"'AND userbase.numberBase = '"+current_S_BUY_UNIT.numberBase+"'",function(error, result){
			if (!!error){DetailError =('unitInBase :Error Update updateUserBase '+current_S_BUY_UNIT.UserName);functions.writeLogErrror(DetailError);}
		});
}

function insertBuyNewUnit (current_S_BUY_UNIT,timeBuy) {

	var currentTime = Math.floor(new Date().getTime() / 1000);	
	var queryString = "INSERT INTO `unitwaitinbase` (`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`, `timeComplete`,`timeRemain`)"
	+" VALUES ('"+""+"','"
	+current_S_BUY_UNIT.UserName+"','"
	+current_S_BUY_UNIT.numberBase+"','"
	+current_S_BUY_UNIT.UnitType+"','"
	+current_S_BUY_UNIT.Quality+"','"
	+current_S_BUY_UNIT.Level+"','"
	+parseFloat(currentTime+timeBuy)+"','"+parseFloat(timeBuy)+"')";
	// console.log(queryString);
	database.query(queryString,function (error,result) {
		if (!!error){DetailError =('unitInBase :Error insertBuyNewUnit '+current_S_BUY_UNIT.UserName);functions.writeLogErrror(DetailError);}
	});
	setTimeUpdateUnitWait (timeBuy,current_S_BUY_UNIT);
}

function setTimeUpdateUnitWait (timeBuy,current_S_BUY_UNIT) {

	var userName ={};
	userName[current_S_BUY_UNIT.numberBase]=current_S_BUY_UNIT.numberBase;
	objSetTime[current_S_BUY_UNIT.UserName]=userName;
	setTimeout(function update_Unit_Finished (current_S_BUY_UNIT) {
		updateUnitFinished (current_S_BUY_UNIT);
		checkDelObj (objSetTime,current_S_BUY_UNIT)
	}, timeBuy,current_S_BUY_UNIT);
}
function updateUnitFinished (rows) {
	database.query("UPDATE unitinbase SET Quality = Quality + '"+parseFloat(rows.Quality)
		+"' WHERE UserName = ? AND numberBase = ? AND UnitType = ? AND Level = ?",
		[rows.UserName,rows.numberBase,rows.UnitType,rows.Level],function(error, result){
			if (!!error){DetailError =('unitInBase: Error update unitinbase');functions.writeLogErrror(DetailError);}
			if (result.affectedRows===0) {
				insertNewUnit (rows);
			}
			deleteUnitWaitInBase (rows);
		});	
}
function deleteUnitWaitInBase (rows) {
	database.query("DELETE FROM unitwaitinbase WHERE UserName = ? AND numberBase = ? AND UnitType = ?",
		[rows.UserName,rows.numberBase,rows.UnitType],function(error, result){
			if(!!error){DetailError =('unitInBase :Error delete unitwaitinbase '+rows.UserName);functions.writeLogErrror(DetailError);}
		});
}
function insertNewUnit (rows) {
	var queryString = "INSERT INTO `unitinbase`(`idUNBase`, `UserName`, `numberBase`, `UnitType`, `Quality`, `Level`)"
		+" VALUES ('+','"+rows.UserName+"',"+rows.numberBase+","+rows.UnitType+","+rows.Quality+","+rows.Level+")";
	console.log(queryString);
	database.query(queryString,function (error,result) {
			if (!!error){DetailError =('unitInBase: Error insertNewUnit '+rows.UserName);functions.writeLogErrror(DetailError);}
		});
}

function checkDelObj (objSetTime,data) { 
	delete objSetTime[data.UserName][data.numberBase];
	if (Object.keys(objSetTime[data.UserName]).length===0) {
		delete objSetTime[data.UserName]
	}
}
function resourceBuyUnit (UnitType) {
	var retResourceBuyUnit ="";
	switch (UnitType) {
		case "0":
		retResourceBuyUnit = "resourcebuyunit";
		break;
		case "1":
		console.log("1");

		break;
		case "2":
		console.log("2");

		break;
	}
	return retResourceBuyUnit;
}
function getcurrent_S_BUY_UNIT(data)
{
	return current_S_BUY_UNIT =
	{
		UserName:data.UserName,
		numberBase:data.numberBase,
		UnitType:data.UnitType,
		Level:data.Level,
		Quality:data.Quality,
		Farm:data.Farm,
		Wood:data.Wood,
		Stone:data.Stone,
		Metal:data.Metal,
		Diamond:data.Diamond,
	}
}
//
exports.updateTimeBuyUnit = function updateTimeBuyUnit (currentUser,currentTime) {
	updateTimeBuy (currentUser,currentTime);
}
//updateUnitWaitInBase
exports.updateUnitWaitInBase = function updateUnitWaitInBase (currentUser,currentTime) {
	database.query("SELECT * FROM `unitwaitinbase` WHERE `UserName` = '"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('unitInBase: Error select unitwaitinbase');functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			for (var i = 0; i < rows.length; i++) {
				if(parseFloat(rows[i].timeComplete)>parseFloat(currentTime)){
					updateUnitWait (rows[i],currentTime);
				}else{
					updateUnitFinished (rows[i]);
				}
			}
		}
	});
}


function updateUnitWait (rows,currentTime) {
	database.query("UPDATE unitwaitinbase SET timeRemain = '"+(parseFloat(rows.timeComplete)-parseFloat(currentTime))
		+"' WHERE UserName = '"+rows.UserName
		+"' AND numberBase = '"+parseFloat(rows.numberBase)
		+"' AND UnitType = '"+parseFloat(rows.UnitType)+"'",function(error, result){
			if (!!error){DetailError =('unitInBase: Error update unitwaitinbase TimeRemain '+rows.UserName);functions.writeLogErrror(DetailError);}
		});
}
//Cập nhật thời gian mua unit in base
function updateTimeBuy (currentUser,currentTime) {
	database.query("SELECT * FROM `unitinbase` WHERE `UserName` = '"+currentUser.name+"'",function (error,rows) {
		if (!!error){DetailError =('unitInBase: Error selectTimeBuyUnit');functions.writeLogErrror(DetailError);}
		if (rows.length>0 && (parseFloat(currentTime) < parseFloat(rows[0].TimeCompleteUnitMoveSpeed))) {
			for (var i = 0; i < rows.length; i++) {
				if (parseFloat(currentTime)<parseFloat(rows[i].TimeCompleteUnitMoveSpeed)) {
					database.query(updateTimeWaitUnitMoveSpeed (TimeCompleteUnitMoveSpeed,currentTime,rows[i]),function(error){
						if(!!error){DetailError =('unitInBase: Error updateTimeWaitUnitMoveSpeed '+currentUser.name);functions.writeLogErrror(DetailError);}
					});
				}
				if (((parseFloat(currentTime) >= parseFloat(rows[i].TimeCompleteUnitMoveSpeed))&&(parseFloat(rows[i].TimeCompleteUnitMoveSpeed)>0))){
					database.query(updateUnitInBase(rows[i]),function (error,result) {
						if(!!error){DetailError =('unitInBase: Error updateUnitInBase '+currentUser.name);functions.writeLogErrror(DetailError);}
						if (result.affectedRows>0) {
							deleteUnitInBase(currentUser);
						}
					});
				}
			}
		}
	});
}
function updateTimeWaitUnitMoveSpeed (TimeCompleteUnitMoveSpeed,currentTime,rows) {
	return "UPDATE unitinbase SET TimeWaitUnitMoveSpeed ='"+ (parseFloat(rows.TimeCompleteUnitMoveSpeed)-parseFloat(currentTime))			                					        						                				                						                				                			
	+"'WHERE UserName = '"+rows.UserName
	+"'AND numberBase = '"+parseFloat(rows.numberBase)		        			
	+"'AND UnitType = '"+parseFloat(rows.UnitType)
	+"'AND Level = '"+parseFloat(rows.Level)+"'";
}
function updateUnitInBase (rows) {
	return "UPDATE unitinbase SET Quality = Quality + '"+ (parseFloat(rows.QualityWait))
	+" QualityWait = 0,numberBaseReceive =0,TimeCompleteUnitMoveSpeed=0, TimeWaitUnitMoveSpeed=0 "			                					        						                				                						                				                			
	+"'WHERE UserName = '"+rows.UserName
	+"'AND numberBase = '"+parseFloat(rows.numberBaseReceive)		        			
	+"'AND UnitType = '"+parseFloat(rows.UnitType)
	+"'AND Level = '"+parseFloat(rows.Level)+"'";
}
function deleteUnitInBase (currentUser) {
	database.query("DELETE FROM unitinbase WHERE Quality = 0 AND `UserName` = '"+currentUser.name+"'",function (error) {
		if(!!error){DetailError =('login: Error deleteUnitInBase '+currentUser.name);functions.writeLogErrror(DetailError);}
	});
}
//
function getcurrent_S_BUY_UNIT(data)
{
	return current_S_BUY_UNIT =
	{
		UserName:data.UserName,
		numberBase:data.numberBase,
		UnitType:data.UnitType,
		Level:data.Level,
		Quality:data.Quality,
		Farm:data.Farm,
		Wood:data.Wood,
		Stone:data.Stone,
		Metal:data.Metal,
		Diamond:data.Diamond,
	}
}

// function getcurrentBaseComplete(data)
// {
// 	return currentBaseComplete =
// 	{
// 		UserName:data.UserName,
// 		numberBase:data.numberBase,
// 		UnitType:data.UnitType,			
// 	}
// }
// function getcurrentSENDCHECKUNITINBASE(data)
// {
// 	return currentSENDCHECKUNITINBASE =
// 	{
// 		UserName:data.UserName,
// 		numberBase:data.numberBase,
// 		Quality:data.Quality,
// 		Level:data.Level,
// 		UnitType:data.UnitType,
// 	}
// }