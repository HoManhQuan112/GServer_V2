'use strict';
var database 		= require('./../Util/db');
var async           = require('async');
var util 			= require('util'); 

var specialSymbol = "/";

/*gioi han ban do*/
var minX= 0;
var maxX= 199;
var minZ= 0;
var maxZ = -199;
//
var offlineDict={};
var removeDict ={};
var offlineDict2 = {"key4":"123","key3":"val1143","key5":"fadsf"};
var offlineDict3 = {"key6":"6","key8":"8","key7":"7"};


exports.offlineDict = offlineDict;
exports.removeDict = removeDict;

exports.addValue =function addValue(unitPosition,idUnit,rangeUnit) 
{  
	//checkValueDict(unitPosition,idUnit);
	////console.log("addKey: "+unitPosition+"_value: "+offlineDict[unitPosition]);//vi tri hien tai
	// var rangeUnit = 3; //Query database
	/*Range =1: 8 điểm còn lại*/
	checkRange(rangeUnit,unitPosition,idUnit);
	// let arr = Array(1e6).fill("some string");
 //    arr.reverse();
 //    const used = process.memoryUsage().heapUsed / 1024 / 1024;
 //    //console.log(`The script uses approximately ${used} MB`);
//	//console.log(offlineDict);
}
exports.addValueF =function addValueF(unitPosition,idUnit,rangeUnit,callback) 
{  
	var callRet;
	checkRange(rangeUnit,unitPosition,idUnit);
	
	callRet= offlineDict;
	callback(callRet);
}

exports.removeValue = function removeValue(idUnit,dict) 
{
	////console.log(offlineDict);
	var val  = Object.getOwnPropertyNames(dict);
	//duyệt object tìm phần tử
	for (var i = val.length - 1; i >= 0; i--) {
		if (dict[val[i]].includes(specialSymbol+idUnit)) 
		{
			cutDownStringValue(val[i],idUnit,dict);	
		}	
	}
	//console.log(dict);
}

function checkRange(range,unitPosition,idUnit) 
{
	var position = unitPosition.split(",");
	var positionX = parseInt(position[0]) ;
	var positionZ = parseInt(position[1]) ;
	switch (range) 
	{
		case 1:
		// //console.log("range 1");
		range1(positionX,positionZ,idUnit);		
		break;
		case 2:
		////console.log("range 2");
		range2(positionX,positionZ,idUnit);		
		break;
		case 3:
		////console.log("range 3");
		range3(positionX,positionZ,idUnit);
		break;
	}
}

function range1(positionX,positionZ,idUnit) 
{	
	var positionArr=getRange1(positionX,positionZ);	
	for (var i = 0; i < positionArr.length; i++) {
		checkValueDict(positionArr[i],idUnit);
	}	
}
function getRange1 (positionX,positionZ) {
	var positionArr=[];
	var posX=[];
	var posY=[];
	if (positionX>minX&&positionX<maxX) 
	{
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);	
	}
	else if (positionX===minX) 
	{
		posX.push(positionX);
		posX.push(positionX+1);
	}
	else if (positionX===maxX) 
	{
		posX.push(positionX-1);
		posX.push(positionX);
	}
//	//console.log("posX: "+posX);
if (positionZ<minZ&&positionZ>maxZ) 
{
	posY.push(positionZ-1);
	posY.push(positionZ);
	posY.push(positionZ+1);	
}
else if (positionZ===minZ) 
{
	posY.push(positionZ);
	posY.push(positionZ-1);
}
else if (positionZ===maxZ)
{
	posY.push(positionZ);
	posY.push(positionZ+1);
}
//	//console.log("posY:"+posY);
for (var i = 0; i < posX.length; i++) {
	for (var j= 0; j < posY.length; j++) {
		positionArr.push(posX[i]+","+posY[j])
	}
}
return positionArr;
}

function range2(positionX,positionZ,idUnit) 
{
	var posX=[];
	var posY=[];
	var positionArr=[];	
	if (positionX>minX+1&&positionX<maxX-1) 
	{
		posX.push(positionX-2);
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);
		posX.push(positionX+2);
	}
	else if (positionX===minX) 
	{
		posX.push(positionX);
		posX.push(positionX+1);
		posX.push(positionX+2);
	}
	else if (positionX===minX+1) 
	{
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);
		posX.push(positionX+2);
	}
	else if (positionX===maxX-1) 
	{
		posX.push(positionX-2);
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);
	}
	else if (positionX===maxX) 
	{
		posX.push(positionX-2);
		posX.push(positionX-1);
		posX.push(positionX);
	}
//	//console.log("posX: "+posX);
if (positionZ<minZ-1&&positionZ>maxZ+1) 
{
	posY.push(positionZ-2);
	posY.push(positionZ-1);
	posY.push(positionZ);
	posY.push(positionZ+1);
	posY.push(positionZ+2);	
}
else if (positionZ===minZ) 
{
	posY.push(positionZ);
	posY.push(positionZ-1);
	posY.push(positionZ-2);
}
else if (positionZ===minZ-1) 
{
	posY.push(positionZ+1);
	posY.push(positionZ);
	posY.push(positionZ-1);
	posY.push(positionZ-2);
}
else if (positionZ===maxZ+1) 
{
	posY.push(positionZ-1);
	posY.push(positionZ);
	posY.push(positionZ+1);
	posY.push(positionZ+2);
}
else if (positionZ===maxZ) 
{
	posY.push(positionZ);
	posY.push(positionZ+1);
	posY.push(positionZ+2);
}
	////console.log("posY:"+posY);
	for (var i = 0; i < posX.length; i++) {
		for (var j= 0; j < posY.length; j++) {
			positionArr.push(posX[i]+","+posY[j])
		}
	}
	for (var i = 0; i < positionArr.length; i++) {
		checkValueDict(positionArr[i],idUnit);
	}	
}

function range3 (positionX,positionZ,idUnit) 
{
	var posX=[];
	var posY=[];
	var positionArr=[];	
	if (positionX>minX+2&&positionX<maxX-2) 
	{
		posX.push(positionX-3);
		posX.push(positionX-2);
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);
		posX.push(positionX+2);
		posX.push(positionX+3);
	}
	else if (positionX===minX) 
	{
		posX.push(positionX);
		posX.push(positionX+1)
		posX.push(positionX+2);
		posX.push(positionX+3);
	}
	else if (positionX===minX+1)
	{
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1)
		posX.push(positionX+2);
		posX.push(positionX+3);
	}
	else if (positionX===minX+2) 
	{
		posX.push(positionX-2);
		posX.push(positionX-1);
		posX.push(positionX);
		posX.push(positionX+1);
		posX.push(positionX+2);
		posX.push(positionX+3);
	}
	else if (positionX===maxX) 
	{
		posX.push(positionX);
		posX.push(positionX-1);
		posX.push(positionX-2);
		posX.push(positionX-3);
	}
	else if (positionX===maxX-1) 
	{
		posX.push(positionX+1);
		posX.push(positionX);
		posX.push(positionX-1);
		posX.push(positionX-2);
		posX.push(positionX-3);	
	}
	else if (positionX===maxX-2) 
	{
		posX.push(positionX+2);
		posX.push(positionX+1);
		posX.push(positionX);
		posX.push(positionX-1);
		posX.push(positionX-2);
		posX.push(positionX-3);	
	}
	////console.log("posX: "+posX);
	if (positionZ<minZ-2&&positionZ>maxZ+2) 
	{
		posY.push(positionZ-3);
		posY.push(positionZ-2);
		posY.push(positionZ-1);
		posY.push(positionZ);
		posY.push(positionZ+1);
		posY.push(positionZ+2);	
		posY.push(positionZ+3);
	}
	else if (positionZ===minZ) 
	{
		posY.push(positionZ);
		posY.push(positionZ-1);
		posY.push(positionZ-2);
		posY.push(positionZ-3);
	}
	else if (positionZ===minZ-1) 
	{
		posY.push(positionZ+1);
		posY.push(positionZ);
		posY.push(positionZ-1);
		posY.push(positionZ-2);
	}
	else if (positionZ===minZ-2) 
	{
		posY.push(positionZ+2);
		posY.push(positionZ+1);
		posY.push(positionZ);
		posY.push(positionZ-1);
		posY.push(positionZ-2);
		posY.push(positionZ-3);
	}
	else if (positionZ===maxZ) 
	{		
		posY.push(positionZ);
		posY.push(positionZ+1);
		posY.push(positionZ+2);
		posY.push(positionZ+3);
	}
	else if (positionZ===maxZ+1) 
	{		
		posY.push(positionZ-1);
		posY.push(positionZ);
		posY.push(positionZ+1);
		posY.push(positionZ+2);
		posY.push(positionZ+3);
	}
	else if (positionZ===maxZ+2) 
	{
		posY.push(positionZ-2);
		posY.push(positionZ-1);
		posY.push(positionZ);
		posY.push(positionZ+1);
		posY.push(positionZ+2);
		posY.push(positionZ+3);
	}
//	//console.log("posY:"+posY);
for (var i = 0; i < posX.length; i++) {
	for (var j= 0; j < posY.length; j++) {
		positionArr.push(posX[i]+","+posY[j])
	}
}

var removeRange1 = getRange1(positionX,positionZ);	
for (var i = 0; i < removeRange1.length; i++) {
	positionArr = positionArr.filter(function (item) {
		return item !== removeRange1[i];
	},removeRange1[i]);
}

for (var i = 0; i < positionArr.length; i++) {
	checkValueDict(positionArr[i],idUnit);
}	
}

function checkValueDict(position,idUnit) 
{
	var stringValue = offlineDict[position];
	//offlineDict[position]+=(specialSymbol+idUnit);	
	if (stringValue === undefined) {
		offlineDict[position]=specialSymbol+idUnit;	
	}else{
		if (checkVal(offlineDict[position],idUnit)===false) {
			offlineDict[position]+=(specialSymbol+idUnit);	
		}
	}
}
function checkVal (dictPos,idUnit) {
	var check;
	var stringRet = dictPos.replace(specialSymbol,"");
	(stringRet==idUnit)?check=true:check = false;
	return check;
}
function cutDownStringValue(val,idUnit) {
	offlineDict[val]= offlineDict[val].replace((specialSymbol+idUnit),'');
	if (offlineDict[val]==='') 
	{
		delete offlineDict[val];
	}
}
function cutDownStringValue(val,idUnit,dict) {
	dict[val]= dict[val].replace((specialSymbol+idUnit),'');
	if (dict[val]==='') 
	{
		delete dict[val];
	}
}

//remove khi Unit Online


/*function kiểm tra unit đi đến vị trí của offline*/
function unitMoveTo (unitPostion,idUnitMoveTo) {
	////console.log(offlineDict[unitPostion]);
	if (offlineDict[unitPostion]!==undefined) {
		var arrIDUnit = offlineDict[unitPostion].split(specialSymbol);
		for (var i = arrIDUnit.length - 1; i >= 1; i--) {
			checkAtt(arrIDUnit[i],idUnitMoveTo);
		////console.log(arrIDUnit[i]);
	}
}

}

function checkAtt (unitIDdict,idUnitMoveTo) {
	/*chú ý trường hợp friend, guild*/
	//console.log(" check unit %i trong dictionary danh %i",unitIDdict,idUnitMoveTo);
}