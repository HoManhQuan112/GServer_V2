

// // if (process.argv.length <= 2) {
// //     console.log("Usage: " + __filename + " SOME_PARAM");
// //     process.exit(-1);
// // }

// // var param = funParam(process.argv[2]);

// // function funParam (param) {
// // 	console.log('Param here: ' + param);
// // }

// // var myVar;
// // var myVar2;

// // function getVa () {
// // 	return myVar;
// // }
// // function callback() {
// //   console.log(myVar);
// //   getVa();
// // }

// // setTimeout(function() { 
// //     myVar = "some value"; 
// //     callback();
// // }, 0);

// // console.log(getVa ());
// // cron.schedule('*/1 * * * * *',function(){
// // 	var currentTime = Math.floor(new Date().getTime() / 1000);
// // 	console.log(currentTime);
// // });

// // var cron 			    = require('node-cron');
// // var functions 			= require('./Util/functions.js');

// // cron.schedule('0 0 0,4,8,12,16,20 * * * *',function(){
// // 	var currentTime = Math.floor(new Date().getTime() / 1000);
// // 	console.log(currentTime);

// // });



// // var task =cron.schedule('*/5 * * * * * *',function(){
// // 	var currentTime = Math.floor(new Date().getTime());
// // 	console.log("currentTime:"+functions.timeConverter(currentTime))
// // 	console.log(task.getTimeout());

// // })
// // var test = testF("this");

// // function testF (argument) {
// // 	console.log(argument);
// // 	var currentTime = Math.floor(new Date().getTime() / 1000);
// // 	console.log(functions.timeConverter(currentTime));
// // }

// // function timeConverterResetMine(UNIX_timestamp)
// // {
// //     var a = new Date(UNIX_timestamp * 1000);
// //     //var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
// //     var year = a.getFullYear();
// //     var month = a.getMonth();
// //     var date = a.getDate();
// //     var hour = a.getHours();
// //     var min = a.getMinutes();
// //     var sec = a.getSeconds();
// //     var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
// //     return time;
// // }
// // //console.log(new Date());
// // var getTime = timeConverterResetMine(new Date("04/14/2018 3:0:0 GMT+0700").getTime()/1000);
// // console.log(getTime);
// // var getTime = new Date("04/14/2018 15:0:0").getTime()/1000;
// // console.log(getTime);


// // var arrayTimeResetserver;

// // const doSomething= function () {
// //   return new Promise((resolve, reject) => {
// //     database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
// //         var currentTime = Math.floor(new Date().getTime() / 1000);
// //         var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //         arrayTimeResetserver = resetTime - currentTime;
// //         console.log('arrayTimeResetserver: '+arrayTimeResetserver);
// //         resolve();
// //     });
// // });

// // }
// // var test = testPromise();

// // function testPromise() {
// //     var result;
// //     var p = new Promise((resolve, reject)=>{
// //      database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
// //         result=rows[0].NextTimeReset;
// //         resolve();
// //       //   setTimeout(function () {
// //       //     resolve();
// //       // });

// //   });
// //  });
// //     p.then(function () {
// //         console.log("result:"+rows[0].NextTimeReset);

// //     });

// //     // p.then(function () {
// //     //  //   console.log(result);
// //     //      return result;
// //     // });



// // }

// // var thisTime = new Promise((resolve,reject)=>{
// //     testPromise2();
// // }).then(function () {
// //   console.log("here:"+thisTime);
// //    console.log(Promise.resolve());
// // });

// // function testPromise2 () {
// //  //    var promiseItem = new Promise((resolve,reject)=>{
// //  //        getTimeResetMine (resolve);
// //  // });
// //  //    promiseItem.then(function () {
// //  //        console.log(resolve());
// //  //    });
// // }




// //  var p = new Promise ((resolve,reject)=>{  
// //     setTimeout(()=>{
// //        database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
// //         if (!!error){DetailError = ('login.js: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
// //         var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //         var currentTime = Math.floor(new Date().getTime() / 1000);
// //         timeResetMine = resetTime - currentTime;

// //     })
// //     //    database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
// //     //     if (!!error){DetailError = ('login.js: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
// //     //     var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //     //     // var currentTime = Math.floor(new Date().getTime() / 1000);
// //     //     // timeResetMine = resetTime - currentTime;

// //     // });
// //        resolve();
// //    }, 0);

// //     // database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
// //     //     if (!!error){DetailError = ('login.js: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
// //     //     var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //     //     var currentTime = Math.floor(new Date().getTime() / 1000);
// //     //     timeResetMine = resetTime - currentTime;

// //     // });
// //     // database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows) {
// //     //     if (!!error){DetailError = ('login.js: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
// //     //     var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //     //     var currentTime = Math.floor(new Date().getTime() / 1000);
// //     //     timeResetMine = resetTime - currentTime;

// //     // });
// //     // resolve();
// // }).then(function () {

// //     // thisTime=timeResetMine;
// //     console.log(timeResetMine);
// //     console.log("resetTime: "+resetTime);
// // });

// // }


// // function getTimeResetMine (resolve) {

// //   database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
// //     if (!!error){DetailError = ('login.js: Error getTimeResetMine');functions.writeLogErrror(DetailError);}
// //     var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
// //     var currentTime = Math.floor(new Date().getTime() / 1000);
// //     var timeResetMine = resetTime - currentTime;
// //     resolve();
// // });

// // }

// var database        = require('./Util/db');
// var Promise         = require('promise');
// var timeResetMine;
// var resetTime2;
// var arrayTest =[];

// var test = myFuncReset3();

// function myFuncReset()
// {            
//   const k = [0];
//   var asyncFunc = (timeout) => {
//    return new Promise((resolve,reject)=>{
//      database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//        var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//        var currentTime = Math.floor(new Date().getTime() / 1000);
//        timeResetMine = resetTime - currentTime;
//        resolve(); 
//      });
//    }).then(()=>{
//     return new Promise((resolve,reject)=>{
//      database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//       resetTime2 = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//       resolve(); 
//     });
//    });
//   }).then(function () {
//    console.log('resetTime2: '+resetTime2);
//    console.log('timeResetMine: '+timeResetMine);
//  });

// }
// //
// k.reduce((promise, timeout) => { 
//   return promise.then(() => asyncFunc(timeout));
// }, Promise.resolve());
// //
// }

// function myFuncReset2()
// {            
//   const timeOut = [0];
//    var date = new Date().getTime()/1000;
//    console.log(date);
//   var asyncFunc = (timeout) => {
//     return new Promise((resolve,reject)=>{
//       querySelector1(resolve);
//     }).then(()=>{
//       return new Promise((resolve,reject)=>{
//        querySelector2(resolve);
//      });
//     }).then(function () {
//      console.log('resetTime2: '+resetTime2);
//      console.log('timeResetMine: '+timeResetMine);
//      date = new Date().getTime()/1000;
//      console.log(date);
//    });

//  //     return new Promise((resolve,reject)=>{
//  //       database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//  //         var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//  //         var currentTime = Math.floor(new Date().getTime() / 1000);
//  //         timeResetMine = resetTime - currentTime;
//  //         resolve(); 
//  //     });
//  //   }).then(()=>{
//  //      return new Promise((resolve,reject)=>{
//  //         database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//  //            resetTime2 = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//  //            resolve(); 
//  //        });
//  //     });
//  //  }).then(function () {
//  //     console.log('resetTime2: '+resetTime2);
//  //     console.log('timeResetMine: '+timeResetMine);
//  // });

// }
// //
// timeOut.reduce((promise, timeout) => { 
//   return promise.then(() => asyncFunc(timeout));
// }, Promise.resolve());
// //
// }

// function myFuncReset3()
// { 
//   var date = new Date().getTime()/1000;
//   console.log(date);
//   return new Promise((resolve,reject)=>{
//     querySelector1(resolve);
//   }).then(function () {
//    return new Promise((resolve,reject)=>{
//      querySelector2(resolve);
//    }); 
//  }).then(function () {
//   console.log('resetTime2: '+resetTime2);
//   console.log('timeResetMine: '+timeResetMine);
//   date = new Date().getTime()/1000;
//   console.log(date);
// });
// }
// function querySelector1 (resolve) {
//   database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//    var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//    var currentTime = Math.floor(new Date().getTime() / 1000);
//    timeResetMine = resetTime - currentTime;
//    resolve();
//  });}
//   function querySelector2 (resolve) {
//     database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//      resetTime2 = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//      resolve();
//    });}

//  // var asyncFunc = (timeout) => {
//  //        return new Promise((resolve,reject) => {
//  //            setTimeout(() => {
//  //             database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//  //               var resetTime = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//  //               var currentTime = Math.floor(new Date().getTime() / 1000);
//  //               timeResetMine = resetTime - currentTime;
//  //               resolve(); 
//  //           });
//  //         },timeout);
//  //        }).then(()=>{
//  //            console.log(timeResetMine);


//  //            // return new Promise((resolve,reject)=>{
//  //            //     setTimeout(()=>{
//  //            //         database.query("SELECT * FROM `task` WHERE `DetailTask`='ResetMine'",function (error,rows,field) {
//  //            //            resetTime2 = Math.floor(new Date(rows[0].NextTimeReset).getTime() / 1000);
//  //            //            resolve(); 
//  //            //        }, timeout);
//  //            //     }).then(function (result) {
//  //            //      console.log('timeResetMine:'+timeResetMine)
//  //            //  });
//  //            // });

//  //        });

//  //    }


var database        = require('./Util/db');
var Promise         = require('promise');
var result;

var tst = testFunc ();
// console.log(testFunc(callback));

function testFunc () {
	//database.query("INSERT INTO `task`(`DetailBool`, `DetailTime`, `DetailMore`, `LastTimeReset`, `NextTimeReset`, `CheckSend`, `TimeServer`) VALUES ('0','0','0','0','0','0','0')",function (error,rows) {
    // database.query("UPDATE `task` SET `DetailTask`=0 WHERE ? = 5",['idTask'],function (error,rows) {
    	var idTask ='idTask';
    	var task =`task`;
    // database.query("UPDATE `task` SET `DetailTask`=0 WHERE @idTask = 5",function (error,rows) {
     	database.query("SELECT * FROM `task` WHERE 1",function (error,rows) {
     		console.log(rows);
     	});

     }