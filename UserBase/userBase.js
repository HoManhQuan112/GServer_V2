'use strict';
var database 			= require('./../Util/db.js');
var functions 			= require('./../Util/functions.js');
var Promise 			= require('promise');

var arrayAllMerger=[];
var arrayAllUserposition=[];
var arrayAllMineAndUnitPosition=[];

var newUserMaxStorage = 10000;

var newLocation;
var DetailError;
// var lastPosition;

exports.getUserInfo = function getUserInfo (currentUser,arrayUserLogin,arrayBaseUser) {
	getarrayUserLogin (currentUser,function (rows) {
		arrayUserLogin(rows);
	});
	getarrayBaseUser (currentUser,function (rows){
		arrayBaseUser(rows);
	});

}
function getarrayBaseUser (currentUser,arrayBaseUser) {
	database.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('userBase :Error SELECT getarrayBaseUser '+currentUser.name);functions.writeLogErrror(DetailError);}
		arrayBaseUser(rows);
	});
}
function getarrayUserLogin (currentUser,arrayUserLogin) {
	database.query("SELECT `UserName`,`Diamond` FROM `users` WHERE `UserName`='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('userBase :Error SELECT getarrayUserLogin '+currentUser.name);functions.writeLogErrror(DetailError);}
		arrayUserLogin(rows);
	});
}
//
exports.getarrayBaseResource = function getarrayBaseResource (currentUser,arrayBaseResource) {
	database.query("SELECT `idBase`, `UserName`, `numberBase`, `Position`, `LvCity`, `Farm`,`Wood`,`Stone`, `Metal` FROM `userbase` WHERE `UserName`!='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('userBase :Error SELECT getarrayBaseResource');functions.writeLogErrror(DetailError);}
		arrayBaseResource(rows);
	});
}

exports.getarrayAllUsers = function getarrayAllUsers (currentUser,arrayAllUsers) {
	database.query("SELECT `UserName`,`GuildName` FROM `users` WHERE `UserName`!='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('userBase :Error SELECT getarrayAllUsers');functions.writeLogErrror(DetailError);}
		arrayAllUsers(rows);
	});
}

exports.createNewUserBase =function createNewUserBase (currentUser,currentTime) {

	database.query("SELECT * FROM `userbase` WHERE `UserName`='"+currentUser.name+"'",function (error,rows) {
		if (!!error){DetailError =('userBase :Error SELECT userBase '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length==0) {
			return new Promise((resolve,reject)=>{
				getBaseData(resolve);
			}).then(function () {
				return new Promise((resolve,reject)=>{
					getMineAndUnitData (resolve);
				});
			}).then(function () {
				arrayAllMerger = arrayAllMineAndUnitPosition.concat(arrayAllUserposition);
				var randomPos = functions.randomInt(1,9);

				database.query("SELECT * FROM `spawnlocation`",function (error,rows) {
					if (!!error){DetailError =('userBase :Error SELECT spawnlocation ');functions.writeLogErrror(DetailError);}
					for (var i = 0; i < rows.length; i++) {
						arrayAllMerger.push(rows[i]);						
					}

					for (var i = 1; i < rows.length; i++) {
						if (parseInt(rows[i].Item) ===parseInt(randomPos)) {
							console.log('rows[i].Item '+rows[i].Item);
							getNewPos (currentUser,rows[i].LastPosition,currentTime,rows[i].Item);
							break;
						}						
					}

				});
			});
		}
	});
}

function getNewPos (currentUser,lastPos,currentTime,posItem) {		
	var arr = lastPos.split(",");											
	var i = functions.getRandomIntInclusive(1,8), M=0;
	var newLocation = functions.getNewLocation(arr[0],arr[1],i,M);
	while(arrayAllMerger.indexOf(newLocation)>=1)
	{	
		i = functions.getRandomIntInclusive(1,8);
		newLocation = functions.getNewLocation(arr[0],arr[1],i,M);	
	}
	
	arrayAllMerger.push(newLocation);

	database.query("SELECT * FROM `resourcebuybase` WHERE `numberBase` = 0",function(error,rows){
		if (!!error){DetailError =('userBase :Error SELECT resourcebuybase');functions.writeLogErrror(DetailError);}
		database.query("INSERT INTO `userbase`(`idBase`, `UserName`, `MaxStorage`, `Position`, `LvCity`, `Farm`, `Wood`, `Stone`, `Metal`, `CreateTime`, `numberBase`,`sizeUnitInBase`, `checkResetMine`, `UpgradeWait`, `ResourceMoveSpeed`, `UnitMoveSpeed`, `UnitNumberLimitTransfer`) VALUES ('"
			+""+"','"+currentUser.name+"','"+newUserMaxStorage+"','"+newLocation+"','"+1+"','"+rows[0].FarmReady+"','"+rows[0].WoodReady+"','"+rows[0].StoneReady+"','"+rows[0].MetalReady+"','"+currentTime+"','"+rows[0].numberBase+"','"+0+"','"+0+"','"+rows[0].UpgradeWait+"','"+rows[0].ResourceMoveSpeed+"','"+rows[0].UnitMoveSpeed+"','"+rows[0].UnitNumberLimitTransfer+"')",function(error){
				if (!!error){DetailError =('userBase :Error insert getNewPos '+currentUser.name);functions.writeLogErrror(DetailError);}
			});
	});
	database.query("UPDATE `spawnlocation` SET`LastPosition`='"+newLocation+"' WHERE `Item`='"+posItem+"'",function (error) {
		if (!!error){DetailError =('userBase :Error UPDATE spawnlocation '+currentUser.name);functions.writeLogErrror(DetailError);}
	});
}

function getBaseData (resolve) {	
	database.query("SELECT * FROM `userbase` ORDER BY `CreateTime` DESC",function (error,rows) {
		if (!!error){DetailError =('userBase :Error SELECT getBaseData');functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			// lastPosition = rows[0].Position;
			for (var i = 0; i < rows.length; i++) {
				arrayAllUserposition.push(rows[i].Position);
			}
			resolve();
		}
	});
}
function getMineAndUnitData (resolve) {
	database.query("SELECT Position FROM `userasset` UNION ALL SELECT Position FROM `unitinlocations`",function(error, rows){
		if (!!error){DetailError =('userBase :Error SELECT getMineAndUnitData');functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			for (var i = 0; i < rows.length; i++) {
				arrayAllMineAndUnitPosition.push(rows[i].Position);
			}
			resolve();
		}
	});
}