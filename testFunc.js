'use strict';
// function checkkey(key){
// var ret;
// 	ret = check (key);
// return ret;
// }

// function check (key) {
// 		return (key==1)?1:0;
// 	}

// var check= checkkey("1");
// console.log(check);

// console.log((true)&&(true));

// var obj ={}

// var thisTes = addobj();

// function addobj () {

// 	obj["id"] ="2";
// 	console.log(obj);
// }

// var getNumber = parseInt(1.0)
// console.log(getNumber);
// function randomInt (low, high) {
//     return Math.floor(Math.random() * (high - low + 1) + low);
// }

// var da = Math.floor(new Date().getTime()/1000);
// console.log(da);

// 1525506532
// 1522486473

// var obj ={}
// var test = setS ();
// function addobj () {
// 	obj["key"]="key1";
// 	console.log(obj);
// }
// function setS(){
// 	console.log(obj["key2"]);
// }
// var AMineType, ALvMineType, AMineTypeHarvestTime, ACurrentLvMineType,AresourceupMineType;

// function get_queryMineType (MineType) {

// 	AMineType = "A."+MineType, 
// 	ALvMineType = "A.Lv"+MineType,
// 	AMineTypeHarvestTime = "A."+MineType+"HarvestTime", 
// 	ACurrentLvMineType = "CurrentLv"+MineType,
// 	AresourceupMineType = "resourceup"+MineType;
// }



// var run = getRun();

// function getRun () {
//  get_queryMineType("Miss");
// 	console.log(AMineType);
// 	console.log(ALvMineType);
// 	console.log(AMineTypeHarvestTime);
// 	console.log(ACurrentLvMineType);
// 	console.log(AresourceupMineType);

// }
// var objSetTime ={};
// var user={};
// user["Data"]="data";
// user["numberbase0"]=0;
// user["numberbase1"]=1;
// objSetTime["user"]=user;

// console.log(objSetTime);
// // delete objSetTime["user"];
// // console.log(objSetTime);
// delete user.numberbase1;
// delete user.numberbase0;
// console.log(objSetTime);
// console.log("user.length: "+Object.keys(user).length)
// if (Object.keys(user).length===1) {
// 	console.log("here")
// 	delete objSetTime.user;
// 	console.log(objSetTime);
// }

// var objSetTime ={};
// var user={};
// objSetTime["user"]=user;
// // var user1={};
// //user1["numberbase0"]=0;
// objSetTime["user"]["numberbase0"]=0
// objSetTime["user"]=user
// objSetTime["user"]["numberbase1"]=1
// console.log(objSetTime)
// user1["numberbase1"]=1;
// objSetTime["user1"]=user1;

// console.log(objSetTime["user1"]["numberbase0"]);
// // console.log(Object.keys(objSetTime["user"]).length)
// delete objSetTime["user1"]["numberbase0"];
// console.log(objSetTime);

// var userName ={};
// userName["manhquan4"]= "manhquan4";
// objSetTime["manhquan4"]=userName;
// console.log(objSetTime)

// function getBeforeDecimal (number) {
// 	return parseFloat(number.toString().split(".")[0]);
// }
// console.log(getBeforeDecimal(53.13)+1);

// console.log(parseInt(456456.999999999999999999999))


// function mag (x,y) {
// 	// console.log(x*x);
// 	// console.log(y*y);
// 	var test = Math.sqrt(4+(-109+108.0001)*(-109+108.0001))/0.1;
// 	console.log(test);
// 	console.log(test.toFixed(4));

// 	// return Math.sqrt(x*x + y*y);
// 	//return Math.sqrt(4+0.0001*0.0001);
// }

// console.log(Math.round(1232122.50));

var arraySetTo = [];
var t = setT ('1',3000);
var t1 = setT ('2',4000);
//var del1 = removeItem ('1',2000);

// var t1 = setT ('manh1');
// function setT (user) {
// 	setTo = setTimeout(function (user) {
// 		console.log("there: "+user)
// 		console.log(setTo);
// 	},3000,user);
// 	// if (setTo._timerArgs==user) {
// 	// 	console.log(setTo._timerArgs+" here");
// 	// }

// }

function setT (user,timeOut) {
	var setTo = setTimeout(function (user) {
		console.log("there: "+user)
		//console.log(setTo);
	},timeOut,user);

	arraySetTo.push(setTo);

	// setTimeout(function (user) {
	// 	if (setTo._timerArgs=='1') {
	// 		console.log("clearTime: "+user);clearTimeout(setTo);
	// 	}
	// },timeOut-1000,user);
	//console.log(setTo);
}
function removeItem (user,timeOut) {
	console.log(arraySetTo);
	setTimeout(function (user) {
		console.log("here: "+user);
		clearTimeout(arraySetTo.find(item=>item._timerArgs==user));
		arraySetTo = arraySetTo.filter(item=>item._timerArgs==user);
		console.log("arraySetTo");
		console.log(arraySetTo);
	}, timeOut, user);

}

// var setStop= clearTime('manh1');

// function clearTime (para) {
	
// if (setTo._timerArgs==para) {console.log("clearTime");clearTimeout(setTo);}

// }


// console.log(getBeforeDecimal (123.3));

// function getBeforeDecimal (para) {
// 	var retNumber = para.toString();
// 	if(retNumber.includes('.')){
// 		(retNumber=parseInt(retNumber.split(".")[0]))
// 	}else{		
// 		retNumber=retNumber;
// 	}
// 	return retNumber;

// }