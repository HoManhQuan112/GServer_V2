'use strict';
var cron 				= require('node-cron');
var datetime 			= require('node-datetime');

var socketEmit 			= require('./../index.js');
var database 			= require('./../Util/db.js');
var functions 			= require('./../Util/functions.js');



var FarmConsumeInOffline, FarmRemainInOnline;

var DetailError;

var current_S_FARM_CONSUME;

var current_S_POSITION_CLICK;
var current_S_FARM_CONSUME;
var farmMove = 1;

exports.updateUnitInLocation = function updateUnitInLocation (currentUser,currentTime) {
	database.query("SELECT * FROM `unitinlocations`",function(error,rows){
		if (!!error){DetailError =('move :Error select unitinlocations');	functions.writeLogErrror(DetailError);}
		calcMove(rows,currentUser,currentTime);		
	});
}

function calcMove (rows,currentUser,currentTime) {
	for (var i = 0; i < rows.length; i++) {
		var PositionX = parseFloat(posRet(rows[i].Position)[0]);
		var PositionZ = parseFloat(posRet(rows[i].Position)[1]);
		var PositionClickX = parseFloat(posRet(rows[i].PositionClick)[0]);
		var PositionClickZ = parseFloat(posRet(rows[i].PositionClick)[1]);

		var posX = PositionX+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(PositionClickX-PositionX))/parseFloat(rows[i].TimeMoveComplete);
		var posZ = PositionZ+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(PositionClickZ-PositionZ))/parseFloat(rows[i].TimeMoveComplete);

		if (rows[i].UserName ===currentUser.name) { 

			if (parseFloat(rows[i].TimeMoveComplete)>0) {     
				
				var timeMoves = parseFloat(rows[i].TimeMoveTotalComplete) - parseFloat(currentTime);
				FarmConsumeInOffline = (parseFloat(rows[i].Quality)*parseFloat(rows[i].MoveSpeedEach)*(parseFloat(rows[i].TimeMoveComplete)-parseFloat(timeMoves)));
				// FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[i].MoveSpeedEach)*parseFloat(timeMoves));
				updatePos (posX,posZ,currentTime,timeMoves,rows[i],FarmConsumeInOffline);

			}else {
				updatePos (PositionClickX,PositionClickZ,currentTime,timeMoves,rows[i],0);
			}

		}else{

			if (parseFloat(rows[i].TimeMoveComplete)>0) {
				updateAnotherUser (posX,posZ,rows[i]);
			}else{
				updateAnotherUser (PositionClickX,PositionClickZ,rows[i]);
			}

		}
	} 
}
function posRet (position) {
	return position.split(",");
}
function updateAnotherUser (posX,posZ,rows) {
	var pos = parseFloat(posX)+","+parseFloat(posZ)
	var stringQuery = "UPDATE unitinlocations SET PositionLogin = '"+ pos                												                			 			                													                			
	+"' WHERE idUnitInLocations = '"+rows.idUnitInLocations+"'";
	database.query(stringQuery,function(error){
		if(!!error){DetailError =('move :Error updateAnotherUser '+rows.UserName);functions.writeLogErrror(DetailError);}
	});	
}

function updatePos (posX,posZ,currentTime,timeMoves,rows,FarmConsumeInOffline) {
	database.query("UPDATE unitinlocations SET Position = '"+ parseFloat(posX)+","+parseFloat(posZ)     
		+"',PositionLogin = '"+parseFloat(posX)+","+parseFloat(posZ)                                                                                       
		+"',timeClick = '"+ parseFloat(currentTime)
		+"',TimeMoveComplete = '"+ parseFloat(timeMoves)                            
		+"',TimeMoveTotalComplete = '"+ (parseFloat(timeMoves)+parseFloat(currentTime))
		+"',FarmPortable = '"+parseFloat(parseFloat(rows.FarmPortable) - parseFloat(FarmConsumeInOffline))
		+"',TimeCheck = '"+ (parseFloat(timeMoves)+parseFloat(currentTime))
		+"',TimeSendToClient = '"+ parseFloat(currentTime)
		+"',CheckMove = 1,CheckMoveOff = 0 WHERE idUnitInLocations = '"+rows.idUnitInLocations+"'",function(error){
      // console.log("FarmConsumeInOffline: ");
      // console.log(FarmConsumeInOffline);   
      if(!!error){DetailError =('move :Error update unitinlocations');functions.writeLogErrror(DetailError);}   
  });
}

exports.start = function start (io) {
	io.on('connection', function(socket){
		S_POSITION_CLICK (socket);

		//S_FARM_CONSUME (socket);
	}); 
	
}

function S_POSITION_CLICK (socket) {
	socket.on('S_POSITION_CLICK',function (data) {
		current_S_POSITION_CLICK = get_current_S_POSITION_CLICK(data);
		//console.log(current_S_POSITION_CLICK);

		var stringQuery = "SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`= '"+current_S_POSITION_CLICK.idUnitInLocations+"'";
		// //console.log(stringQuery);
		var currentTime = Math.floor(new Date().getTime() / 1000);
		database.query(stringQuery,function (error,rows) {
			if(!!error){DetailError =('move :Error SELECT checkUserPosition '+current_S_POSITION_CLICK.idUnitInLocations);functions.writeLogErrror(DetailError);}
			var timeMove = checkTimeMove (current_S_POSITION_CLICK,rows[0]);
			console.log(timeMove);
			if (rows[0].FarmPortable>=rows[0].Quality) {
				if (currentTime<rows[0].TimeMoveTotalComplete) {calClickMove (rows[0],current_S_POSITION_CLICK);}

				updateClickPosition (current_S_POSITION_CLICK,currentTime,timeMove);// R_POSITION_CLICK (current_S_POSITION_CLICK,rows[0]); 
			}


		});
		
	});	
}
function calClickMove (row,dataEvent) {
	var retData = getPos(row,dataEvent);
	// console.log("retData");
	// console.log(retData);
	var currentTime = Math.floor(new Date().getTime() / 1000);
	var timeMoves = currentTime - row.TimeClick;

	var FarmConsume = 0;
	var FarmPortableUpdate = 0;
	var posClick = "";

	if (checkLocation (retData.ServerPositionX,retData.ServerPositionZ,retData.CurrentPositionX,retData.CurrentPositionZ)==true) {
		FarmConsume = (parseFloat(row.Quality)*parseFloat(row.MoveSpeedEach)*(parseFloat(timeMoves)));
	}
	FarmPortableUpdate = row.FarmPortable - FarmConsume;
	updateFarmPortable (dataEvent.idUnitInLocations,FarmPortableUpdate,currentTime);
	
	//R_FARM_CONSUME_MOVE(row.UserName,row.idUnitInLocations, parseInt(FarmPortableUpdate));
}
function updateFarmPortable (idUnit,FarmPortableUpdate,timeClick) {
	var queryString = "UPDATE `unitinlocations` SET "
	+"`FarmPortable`= '"+ FarmPortableUpdate
	+",`TimeClick`= '"+ timeClick
	+",`TimeCheck`= '"+ timeClick
	+"' WHERE `idUnitInLocations`='"+ idUnit+"'";
	//console.log(queryString);
	database.query(queryString,function (error,result) {
		if(!!error){DetailError =('move :Error update calClickMove '+idUnit);functions.writeLogErrror(DetailError);}
	});
}

function checkTimeMove (current_S_POSITION_CLICK,row) {
	var currentPos= current_S_POSITION_CLICK.Position;
	var positionClick = current_S_POSITION_CLICK.PositionClick;
	var timeMove = current_S_POSITION_CLICK.timeMove;

	var currentPosX = currentPos.split(",")[0];
	var currentPosZ = currentPos.split(",")[1];
	var positionClickX = positionClick.split(",")[0];
	var positionClickZ = positionClick.split(",")[1];

	var distanceX = parseFloat(positionClickX) - parseFloat(currentPosX);
	var distanceY = parseFloat(positionClickZ)- parseFloat(currentPosZ);

	var timeServer = magnitudeVector (distanceX,distanceY,row);
	var time = 0;
	console.log("\\");
	console.log("distanceX");
	console.log("distanceY");
	console.log("timeServer");
	console.log(distanceX);
	console.log(distanceY);
	console.log(timeServer);
	console.log("\\");

	if (parseFloat(timeMove) > parseFloat(timeServer+1)) {
		//console.log("Hack Time");
		time = timeServer;
	}else if (parseFloat(timeMove) < parseFloat(timeServer-1)) {
		//console.log("Hack Time");
		time = timeServer;
	}else{
		//console.log("correctTime :");
		time = timeMove;
	}
	return time;
}

function updateClickPosition (current_S_POSITION_CLICK,currentTime,timeMove) {
	var queryString = "UPDATE `unitinlocations` SET "
	+" `Position`= '"+ current_S_POSITION_CLICK.Position
	+"',`PositionClick`= '"+ current_S_POSITION_CLICK.PositionClick
	+"',`TimeClick`= '"+ currentTime
	+"',`TimeMoveComplete`= '"+ timeMove
	+"',`TimeMoveTotalComplete`= '"+ (parseFloat(currentTime)+parseFloat(timeMove))
	+"' WHERE `idUnitInLocations`='"+ current_S_POSITION_CLICK.idUnitInLocations+"'";
	//console.log(queryString);
	database.query(queryString,function (error,result) {
		if(!!error){DetailError =('move: Error updateClickPosition '+current_S_POSITION_CLICK.idUnitInLocations);functions.writeLogErrror(DetailError);}
	});

}
function R_FARM_CONSUME_MOVE (UserName,idUnitInLocations,FarmPortable) {
	var dataValue = {
		idUnitInLocations: idUnitInLocations,                                        
		FarmPortableMove: FarmPortable,
	}
	socketEmit.socketEmit(UserName, 'R_FARM_CONSUME_MOVE', dataValue);
}
function getPos(row,dataEvent){

	var retData = {};
	var ServerPositionX = parseFloat(posRet(row.Position)[0]);
	var ServerPositionZ = parseFloat(posRet(row.Position)[1]);
	var CurrentPositionX = parseFloat(posRet(dataEvent.Position)[0]);
	var CurrentPositionZ = parseFloat(posRet(dataEvent.Position)[1]);
	return retData = {
		ServerPositionX: ServerPositionX,
		ServerPositionZ: ServerPositionZ,
		CurrentPositionX: CurrentPositionX,
		CurrentPositionZ: CurrentPositionZ,
	}
}


function checkLocation (ServerPositionX,ServerPositionZ,CurrentPositionX,CurrentPositionZ) {
	var BoolX = false;
	var BoolZ = false;
	var boolCheck = false;
	if (getBeforeDecimal(ServerPositionX)==getBeforeDecimal(CurrentPositionX)) {BoolX=true;}
	if (getBeforeDecimal(ServerPositionZ)==getBeforeDecimal(CurrentPositionZ)) {BoolZ=true;}
	if (BoolX==false||BoolZ==false) {boolCheck = true;}
	return boolCheck;
}


function R_POSITION_CLICK (current_S_POSITION_CLICK,row) {
	var dataEvent =  {                           
		Position: current_S_POSITION_CLICK.Position, 
		PositionClick:current_S_POSITION_CLICK.PositionClick,                         
		idUnitInLocations:parseInt(current_S_POSITION_CLICK.idUnitInLocations),
	};
	socketEmit.socketEmitAnother(row.UserName,'R_POSITION_CLICK',dataEvent);
}

function magnitudeVector (distanceX,distanceY,row) {
	var timeServer = Math.sqrt(distanceX*distanceX+distanceY*distanceY)/row.MoveSpeedEach;
	return parseFloat(timeServer.toFixed(5));
}

function getBeforeDecimal (number) {
	var retNumber = number.toString(); 
	if (retNumber.includes('.')) {
		retNumber=parseInt(retNumber.toString().split(".")[0]);
	}else{
		retNumber=parseInt(retNumber);
	}
	return retNumber;
}


function get_current_S_POSITION_CLICK(data){
	return current_S_POSITION_CLICK ={
		idUnitInLocations: data.idUnitInLocations,
		Position: data.Position,
		PositionClick: data.PositionClick,
		timeMove: data.timeMove, 
		idUnitInLocationsB: data.idUnitInLocationsB,
		PositionB: data.PositionB, 
	} 
}
//
function S_FARM_CONSUME (socket) {
	socket.on('S_FARM_CONSUME',function (data) {
		current_S_FARM_CONSUME = getcurrent_S_FARM_CONSUME(data);
		//console.log(current_S_FARM_CONSUME);
		// database.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations = '"+current_S_FARM_CONSUME.idUnitInLocations+"'",function (error,rows) {
		// 	if(!!error){DetailError =('move :Error SELECT S_FARM_CONSUME '+current_S_FARM_CONSUME.idUnitInLocations);functions.writeLogErrror(DetailError);}
		// 	if (rows[0].FarmPortable>=rows[0].Quality) {				
		// 		calFarm (rows[0],current_S_FARM_CONSUME);
		// 	}else{
		// 		updateMoveClick (rows[0]);
		// 	}

		// });

	});
}
// function updateMoveClick (row) {
// 	//updateTimeMove(row);
// 	R_FARM_CONSUME_MOVE(row.UserName,row.idUnitInLocations,parseInt(row.FarmPortable));
// }
function updateTimeMove (row) {
	console.log("row");
	console.log(row);
	var currentTime = Math.floor(new Date().getTime() / 1000);

	var newPosX = Math.round(row.Position.toString().split(",")[0]);
	var newPosZ = Math.round(row.Position.toString().split(",")[1]);
	var newPos = newPosX+","+newPosZ;
	
	var queryString = "UPDATE `unitinlocations` SET "
	+" `Position`= '"+ row.Position
	+"',`PositionClick`= '"+ newPos
	+"',`TimeClick`= '"+ currentTime
	+"',`TimeMoveComplete`= '0"
	+"',`TimeMoveTotalComplete`= '0" 
	+"' WHERE `idUnitInLocations`='"+ row.idUnitInLocations+"'";
	console.log(queryString);
	database.query(queryString,function (error,result) {
		if(!!error){DetailError =('move :Error updateTimeMove '+dataEvent.idUnitInLocations);functions.writeLogErrror(DetailError);}

	});
	database.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`='"+ row.idUnitInLocations+"'",function (error,result) {
		if (result.length>0) {
			// R_POSITION_CLICK_UPDATE(result[0]);
			// R_POSITION_CLICK (result[0],row)
		}

	});

}
function R_POSITION_CLICK_UPDATE (data) {
	var dataValue={
		Position: data.Position, 
		PositionClick: data.PositionClick,                         
		idUnitInLocations: parseInt(data.idUnitInLocations),
	};
	socketEmit.socketEmit(data.UserName,'R_POSITION_CLICK_UPDATE', dataValue);
}

function calFarm (row,dataEvent) {
	var ServerPositionX = parseFloat(posRet(row.Position)[0]);
	var ServerPositionZ = parseFloat(posRet(row.Position)[1]);
	var CurrentPositionX = parseFloat(posRet(dataEvent.Position)[0]);
	var CurrentPositionZ = parseFloat(posRet(dataEvent.Position)[1]);

	var currentTime = Math.floor(new Date().getTime() / 1000);
	var timeMoves = currentTime - row.TimeClick;

	var FarmConsume = 0;

	if (checkLocation (ServerPositionX,ServerPositionZ,CurrentPositionX,CurrentPositionZ)==true) {
		FarmConsume = (parseFloat(row.Quality)*parseFloat(row.MoveSpeedEach)*(parseFloat(timeMoves)));
	}
	var FarmPortableUpdate = row.FarmPortable - FarmConsume;
	var timeMoveComplete = row.TimeMoveTotalComplete - currentTime; 

	var queryString = "UPDATE `unitinlocations` SET "
	+" `Position`= '"+ dataEvent.Position
	+"',`FarmPortable`= '"+ FarmPortableUpdate
	+"',`TimeClick`= '"+ currentTime
	+"',`TimeMoveComplete`= '"+ timeMoveComplete
	+"' WHERE `idUnitInLocations`='"+ dataEvent.idUnitInLocations+"'";
	//console.log(queryString);
	database.query(queryString,function (error,result) {
		if(!!error){DetailError =('move :Error update calFarm '+dataEvent.idUnitInLocations);functions.writeLogErrror(DetailError);}
	});
//	R_FARM_CONSUME_MOVE(row.UserName,row.idUnitInLocations, parseInt(FarmPortableUpdate));
}

function getcurrent_S_FARM_CONSUME(data){
	return current_S_FARM_CONSUME = {
		idUnitInLocations: data.idUnitInLocations,
		Position: data.Position,									
	}
}