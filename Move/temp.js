'use strict';
var cron        = require('node-cron');
var datetime      = require('node-datetime');

var database      = require('./../Util/db.js');
var functions       = require("./../Util/functions.js");

var timeMoves=0;

var FarmConsumeInOffline, FarmRemainInOnline;
var posX,posZ,PositionX, PositionZ, PositionClickX,PositionClickZ;
var DetailError;

var current_S_FARM_CONSUME;

exports.updateUnitInLocation = function updateUnitInLocation (currentUser,currentTime) {
  database.query("SELECT * FROM `unitinlocations`",function(error,rows){
    if (!!error){DetailError =('move :Error select unitinlocations'); functions.writeLogErrror(DetailError);}
    calcMove(rows,currentUser,currentTime);
    
  });
}
function calcMove (rows,currentUser,currentTime) {
  for (var i = 0; i < rows.length; i++) {
    PositionX = parseFloat(posRet(rows[i].Position)[0]);
    PositionZ = parseFloat(posRet(rows[i].Position)[1]);
    PositionClickX = parseFloat(posRet(rows[i].PositionClick)[0]);
    PositionClickZ = parseFloat(posRet(rows[i].PositionClick)[1]);

    posX= PositionX+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(PositionClickX-PositionX))/parseFloat(rows[i].TimeMoveComplete);
    posZ= PositionZ+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(PositionClickZ-PositionZ))/parseFloat(rows[i].TimeMoveComplete);

    if (rows[i].UserName ===currentUser.name) { 

      if (parseFloat(rows[i].TimeMoveComplete)>0) {     
        timeMoves = parseFloat(rows[i].TimeMoveTotalComplete) - parseFloat(currentTime);
        FarmConsumeInOffline = (parseFloat(rows[i].Quality)*parseFloat(rows[i].MoveSpeedEach)*(parseFloat(rows[i].TimeMoveComplete)-parseFloat(timeMoves)));
        FarmRemainInOnline = (parseFloat(rows[i].Quality)*parseFloat(rows[i].MoveSpeedEach)*parseFloat(timeMoves));     
        updatePos(posX,posZ,currentTime,timeMoves,rows[i],FarmConsumeInOffline);
      }
      else {
        updatePos (PositionClickX,PositionClickZ,currentTime,timeMoves,rows[i],0);
      }
    }
    else{
      
      if (parseFloat(rows[i].TimeMoveComplete)>0) {
        updateAnotherUser (posX,posZ,rows[i]);
      }
      else{
        updateAnotherUser (PositionClickX,PositionClickZ,rows[i]);
      }
    }
  } 

}
function updateAnotherUser (posX,posZ,rows) {
  database.query("UPDATE unitinlocations SET PositionLogin = '"+ posX+","+posZ                                                                                                                                      
    +"' WHERE idUnitInLocations = '"+rows.idUnitInLocations+"'",function(error){
      if(!!error){DetailError =('move :Error updateAnotherUser '+rows.UserName);functions.writeLogErrror(DetailError);}
    }); 
}
function updatePos (posX,posZ,currentTime,timeMoves,rows,FarmConsumeInOffline) {
  database.query("UPDATE unitinlocations SET Position = '"+ posX+","+posZ     
    +"',PositionLogin = '"+ posX+","+posZ                                                                                       
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
function posRet (position) {
  var pos = []
  return pos = position.split(",");
}

var current_S_FARM_CONSUME;
exports.start = function start (io) {
  io.on('connection', function(socket){
    

    //S_FARM_CONSUME (socket);

  }); 
  
}
//
function S_FARM_CONSUME (socket) {
  socket.on('S_FARM_CONSUME',function (data) {
    current_S_FARM_CONSUME = getcurrent_S_FARM_CONSUME(data);
    console.log(current_S_FARM_CONSUME);
    database.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations = '"+current_S_FARM_CONSUME.idUnitInLocations+"'",function (error,rows) {
      if(!!error){DetailError =('move :Error SELECT S_FARM_CONSUME '+current_S_FARM_CONSUME.idUnitInLocations);functions.writeLogErrror(DetailError);}
      if (rows[0].FarmPortable>=rows[0].Quality) {
        console.log("Can Move");
        
      }   
    });
  });
}

//
function getcurrent_S_FARM_CONSUME(data)
{
  return current_S_FARM_CONSUME =
  {
    idUnitInLocations: data.idUnitInLocations,                
    PositionFrom: data.PositionFrom,
    PositionTo: data.PositionTo,                                
  }
}

//
// exports.updateTimeUnit = function updateTimeUnit (currentTime) {
//  database.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveTotalComplete` <"+currentTime+"`TimeSendToClient`>0",function (error,rows) {
//    if(!!error){DetailError =('move :Error update unitinlocations');functions.writeLogErrror(DetailError);}
//    if (rows.length>0) {
//      for (var i = 0; i < rows.length; i++) {
//        updateTimeSendToClient(rows[i]);
//      }
//    }
//  });
// }
// function updateTimeSendToClient (row) {
//  database.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveTotalComplete` <"+currentTime,function (error,rows) {

//  });
// }
//

// var pool       = require('./db');
// var functions    = require("./functions");
// var sqrt       = require( 'math-sqrt' );
// var math       = require('mathjs');
// var lodash     = require('lodash');
// var client       = require('./redis');
// var cron       = require('node-cron');
// var datetime     = require('node-datetime');



// var currentSENDFARMCONSUME,d,currentTime,arrayDetailBase =[],current_S_POSITION_CLICK, APosition, A, A1, A2, BPosition, B, B1, B2, 
// CPosition, C, C1, C2, TimeCheckMove, X, Z, timeMoves, newLocation, s, arrayAllCheckTimes = [], arrA = [], arrB = [], arrayAllSelect = [], 
// arraycheckUsers = [], arrayExpireTimeMove = [], arrC=[], XB, ZB, MoveSpeedEach, j, idUnitInLocations, 
// arrayAllPositionchange = [],DetailError;
// module.exports = 
// {
//     start: function(io) 
//     {
//         io.on('connection', function(socket) 
//         {
//          socket.on('S_FARM_CONSUME', function (data)
//      {
//        currentSENDFARMCONSUME = getcurrentSENDFARMCONSUME(data);
//        console.log('data receive S_FARM_CONSUME: '+currentSENDFARMCONSUME.idUnitInLocations+"_"+currentSENDFARMCONSUME.PositionFrom+"_"+currentSENDFARMCONSUME.PositionTo);        
//        var arrC=[],arrA=[],FarmPortableMove=0,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrC,arrB;            
//        d = new Date(); currentTime = Math.floor(d.getTime() / 1000);                                              

//        pool.getConnection(function(err,connection)
//        {           
//          connection.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations = '"+currentSENDFARMCONSUME.idUnitInLocations
//            +"'",function(error, rows,field)
//          {
//            if (!!error){DetailError = ('Move: Error in the query 1');

//                    functions.writeLogErrror(DetailError);  
//            }else
//            {
//              if(rows.length>0)
//              {
//                if ((parseFloat(rows[0].TimeSendToClient)>0)
//                  &&(parseFloat(rows[0].FarmPortable)>=parseFloat(rows[0].Quality))) 
//                {
//                  ///cập nhật tính thời gian đơn vị lẻ đã đi                      
//                  FarmPortableMove = parseFloat(rows[0].FarmPortable)-(parseFloat(rows[0].Quality)*parseFloat(rows[0].MoveSpeedEach)*((1/parseFloat(rows[0].MoveSpeedEach))-(parseFloat(rows[0].TimeSendToClient)-parseFloat(currentTime))));                                  
//                  var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(currentTime)
//                    +"',FarmPortable = '"+ parseFloat(FarmPortableMove) 
//                            +"',TimeSendToClient = 0,TimeCheck='"+parseFloat(currentTime)
//                            +"',timeClick='"+parseFloat(currentTime)
//                            +"',CheckMove = 0 WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
//                  {
//                    if(!!error){DetailError = ('Move: Error in the query 2');

//                      functions.writeLogErrror(DetailError);  
//                    }else
//                    {
//                      if ((parseFloat(FarmPortableMove)>=parseFloat(rows[0].Quality))) 
//                      {                         
//                        //gửi farm di chuyển lên cho client cập nhật UI
//                        io.emit('R_FARM_CONSUME_MOVE',
//                        { 
//                          message: 1,
//                          idUnitInLocations:rows[0].idUnitInLocations,                                        
//                          FarmPortableMove: FarmPortableMove,
//                          Position: currentSENDFARMCONSUME.PositionTo,                          
//                                }); 
//                                //cập nhật lại vị trí và thời gian di chuyển vào mysql
//                                arrA =  currentSENDFARMCONSUME.PositionFrom.split(",");
//                        arrC =  currentSENDFARMCONSUME.PositionTo.split(",");                 
//                        var time=sqrt(math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(rows[0].MoveSpeedEach);                       
//                        //=1
//                        updateFarmMove(currentSENDFARMCONSUME.PositionTo,currentTime,time,time,currentTime,rows[0].MoveSpeedEach,1,currentSENDFARMCONSUME.idUnitInLocations, function(err,data)
//                        {
//                          if (err){DetailError = ("ERROR ======: ",err);            

//                            functions.writeLogErrror(DetailError);  
//                          } else 
//                          {            
//                            if (parseFloat(data)===1) 
//                            {                                                                                       
//                              updateRedis(currentSENDFARMCONSUME.idUnitInLocations);
//                            }
//                          }
//                        });
//                      }else
//                      {
//                        A = currentSENDFARMCONSUME.PositionFrom.split(",");
//                        A1 = Number((parseFloat(parseFloat(A[0])).toFixed(1)));
//                        A2 = Number((parseFloat(parseFloat(A[1])).toFixed(1)));
//                        PositionChange=A1+","+A2;
//                        if  (((parseFloat(A1) % 1) < 0.099) && ((parseFloat(Math.abs(A2))  % 1) < 0.099))
//                        {                         
//                          //Gừi lên farm và vị trí user đẩ cập nhật UI trong trường hợp thiếu farm và set lại vị trí chẵn
//                          io.emit('R_FARM_CONSUME_MOVE',
//                          { 
//                            message: 0,
//                            idUnitInLocations:rows[0].idUnitInLocations,                                        
//                            FarmPortableMove: FarmPortableMove,
//                            Position:PositionChange,                            
//                                  });                                 
//                                  //cập nhật lại farm và vị trí vào my sql  
//                                  //=2  
//                                  updateFarmMove(PositionChange,currentTime,0,currentTime,currentTime,0,0,rows[0].idUnitInLocations, function(err,data)
//                          {
//                            if (err){DetailError = ("ERROR ======: ",err);            

//                              functions.writeLogErrror(DetailError);  
//                            } else 
//                            {            
//                              if (parseFloat(data)===1) 
//                              {
//                                updateRedis(currentSENDFARMCONSUME.idUnitInLocations);
//                              }
//                            }
//                          });                             
//                        }else
//                        {                                                                           
//                            arrC = PositionChange.split(",");
//                          arrB = functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange).split(","); 
//                          var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);                                                    
//                          //Gửi lên client vị trí lẻ và farm thay đổi để cập nhật UI                          
//                          io.emit('R_FARM_CONSUME_MOVE',
//                          { 
//                            message: 0,
//                            idUnitInLocations:rows[0].idUnitInLocations,                                        
//                            FarmPortableMove: 0,
//                            Position: functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange),                           
//                                  }); 
//                                  console.log("Cập nhật postion click===============2");  
//                                  //cập nhật lại dũ liệu thay đổi vào mysql             
//                          var query = pool.query("UPDATE unitinlocations SET Position = '"+functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange)
//                            +"',timeClick = '"+parseFloat(currentTime)                                                     
//                            +"',TimeMoveTotalComplete  = '"+(parseFloat(time)+parseFloat(currentTime))
//                            +"',TimeCheck  = '"+(parseFloat(time)+parseFloat(currentTime))
//                            +"',PositionClick='"+functions.getNewLocationClickWithFarmMove(PositionChange,currentSENDFARMCONSUME.PositionTo,PositionChange)
//                            +"',FarmPortable = 0,TimeMoveComplete = 0,TimeSendToClient = 0,CheckMove = 0 WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
//                          {
//                            if(!!error){DetailError = ('Move: Error in the query 3');

//                              functions.writeLogErrror(DetailError);  
//                            }else
//                            {                                                                                                                                 
//                              updateRedis(currentSENDFARMCONSUME.idUnitInLocations);
//                            }
//                          });                                                     
//                        }                     
//                      }                     
//                    }
//                  });                 

//                }else if((parseFloat(rows[0].TimeSendToClient)===0) 
//                  &&parseFloat(rows[0].FarmPortable)>=parseFloat(rows[0].Quality))
//                {                 
//                  //cập nhật lại vi trí, farm và thời gian di chuyển khi lần đâu click 
//                          arrA =  currentSENDFARMCONSUME.PositionFrom.split(",");
//                  arrC =  currentSENDFARMCONSUME.PositionTo.split(",");                             
//                  var time=sqrt(math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(rows[0].MoveSpeedEach);                                   
//                  //=3
//                  updateFarmMove(currentSENDFARMCONSUME.PositionTo,currentTime,time,time,time,rows[0].MoveSpeedEach,1,currentSENDFARMCONSUME.idUnitInLocations, function(err,data)
//                  {
//                    if (err){DetailError = ("ERROR ======: ",err);            

//                      functions.writeLogErrror(DetailError);  
//                    } else 
//                    {            
//                      if (parseFloat(data)===1) 
//                      { 
//                        updateRedis(currentSENDFARMCONSUME.idUnitInLocations);
//                      }
//                    }
//                  });     
//                }else
//                { 
//                  console.log("R_FARM_CONSUME_MOVE 4: "+rows[0].idUnitInLocations);                               
//                  io.emit('R_FARM_CONSUME_MOVE',
//                  { 
//                    message: 0,
//                    idUnitInLocations:rows[0].idUnitInLocations,                                        
//                    FarmPortableMove: FarmPortableMove,
//                    Position: currentSENDFARMCONSUME.PositionTo,                    
//                          }); 
//                }                           
//              }
//            }
//          })            
//          });   
//      });

//      socket.on('S_POSITION_CLICK', function (data)
//      {
//        current_S_POSITION_CLICK = getcurrent_S_POSITION_CLICK(data);
//        console.log("data receive S_POSITION_CLICK: "+current_S_POSITION_CLICK.idUnitInLocations+"_"+current_S_POSITION_CLICK.Position
//          +"_"+current_S_POSITION_CLICK.PositionClick+"_"+current_S_POSITION_CLICK.timeMove
//          +"_"+current_S_POSITION_CLICK.idUnitInLocationsB+"_"+current_S_POSITION_CLICK.PositionB); 

//        if (current_S_POSITION_CLICK.idUnitInLocationsB.length===0||current_S_POSITION_CLICK.PositionB.length===0) 
//        { 
//          console.log("Cập nhật postion click===============3");      
//          pool.getConnection(function(err,connection)
//          {                             
//            d = new Date();
//              currentTime = Math.floor(d.getTime() / 1000);
//              //kiểm tra position move có chính xác không           
//              connection.query("SELECT * FROM `unitinlocations` WHERE `idUnitInLocations`='"+parseFloat(current_S_POSITION_CLICK.idUnitInLocations)+"'",function(error, rows,field)
//            {
//              if (!!error) {DetailError = ('Move: Error in the query 4');

//                functions.writeLogErrror(DetailError);  
//              }else
//              {
//                if (rows.length > 0) 
//                {                   
//                    APosition = rows[0].Position;               
//                    A = APosition.split(",");
//                  A1 = parseFloat(A[0]);
//                  A2 = parseFloat(A[1]);

//                  BPosition = rows[0].PositionClick;                
//                  B = BPosition.split(",");
//                  B1 = parseFloat(B[0]);
//                  B2 = parseFloat(B[1]);

//                  CPosition = current_S_POSITION_CLICK.Position;                
//                  C = CPosition.split(",");
//                  C1 = parseFloat(C[0]);
//                  C2 = parseFloat(C[1]);

//                  if (parseFloat(currentTime -rows[0].timeClick) > parseFloat(rows[0].TimeMoveComplete)) 
//                  {
//                    TimeCheckMove = parseFloat(rows[0].TimeMoveComplete);
//                  }else
//                  {
//                    TimeCheckMove = currentTime -rows[0].timeClick;                
//                  }
//                  //kiểm tra position client với position trên server nếu trùng 
//                  console.log("Cập nhật postion click=============== 4");             
//                  if (parseFloat(Math.round(C2 * 100))===parseFloat(Math.round(A2 * 100)))
//                  {                   
//                    updatePositionClick(current_S_POSITION_CLICK.PositionClick, (Math.round(current_S_POSITION_CLICK.timeMove * 100) / 100), Number((parseFloat(current_S_POSITION_CLICK.timeMove)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                    {
//                      if (err){DetailError = ("ERROR ======: ",err);            

//                        functions.writeLogErrror(DetailError);  
//                      } else 
//                      {            
//                        if (parseFloat(data)===1) 
//                        {                         
//                          console.log("R_POSITION_CLICK 6: "+current_S_POSITION_CLICK.idUnitInLocations);
//                          io.emit('R_POSITION_CLICK',
//                          {                           
//                            PositionClick:current_S_POSITION_CLICK.PositionClick,
//                            Position: current_S_POSITION_CLICK.Position,                          
//                            idUnitInLocations:parseInt(current_S_POSITION_CLICK.idUnitInLocations,10),
//                                  });
//                        }
//                      }
//                    }); 
//                  }else
//                  {

//                    X= A1+((TimeCheckMove)*(B1-A1))/parseFloat(rows[0].TimeMoveComplete);
//                    Z= A2+((TimeCheckMove)*(B2-A2))/parseFloat(rows[0].TimeMoveComplete);
//                    if (getNumberDifferent(rows[0].UnitType,X,Z,C1,C2) === true) 
//                      { 
//                      updatePositionClick(current_S_POSITION_CLICK.PositionClick, (Math.round(current_S_POSITION_CLICK.timeMove * 100) / 100), Number((parseFloat(current_S_POSITION_CLICK.timeMove)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                      {
//                        if (err){DetailError = ("ERROR ======: ",err);            

//                          functions.writeLogErrror(DetailError);  
//                        } else 
//                        {            
//                          if (parseFloat(data)===1) 
//                          {
//                            console.log("R_POSITION_CLICK 2: "+current_S_POSITION_CLICK.idUnitInLocations);
//                            io.emit('R_POSITION_CLICK',
//                            {                           
//                              PositionClick:current_S_POSITION_CLICK.PositionClick,
//                              Position: current_S_POSITION_CLICK.Position,                          
//                              idUnitInLocations:parseInt(current_S_POSITION_CLICK.idUnitInLocations,10),
//                                    });
//                          }
//                        }
//                      });
//                      }else
//                      { 
//                      updatePositionClick(current_S_POSITION_CLICK.PositionClick, (Math.round(current_S_POSITION_CLICK.timeMove * 100) / 100), Number((parseFloat(current_S_POSITION_CLICK.timeMove)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                      {
//                        if (err){DetailError = ("ERROR ======: ",err);            

//                          functions.writeLogErrror(DetailError);  
//                        } else 
//                        {            
//                          if (parseFloat(data)===1) 
//                          {
//                            console.log("R_POSITION_CLICK 3: "+current_S_POSITION_CLICK.idUnitInLocations);
//                            io.emit('R_POSITION_CLICK',
//                            {
//                              PositionClick:current_S_POSITION_CLICK.PositionClick,
//                              Position:current_S_POSITION_CLICK.Position,
//                              idUnitInLocations:parseInt(current_S_POSITION_CLICK.idUnitInLocations,10),
//                                    }); 
//                          }
//                        }
//                      });
//                      }                                                
//                  }           
//                }
//              }
//            });       
//          });

//        }else
//        {
//          console.log("==============================R_POSITION_CLICK 222222222222222222"); 
//          //cập nhật lại vị trí đánh nhau (1=)
//          //kiểm tra vị trí position click đã có người đứng chưa          

//          d = new Date(), currentTime = Math.floor(d.getTime() / 1000), arraycheckUsers = [], arrayAllCheckTimes=[];
//          //kiểm tra thời gian về 0 của unit location
//          //kiểm tra khi bắng thời gian của server
//          //thực hiện random tìm vị trí mới
//          //cập nhật lại biến mới đồi bắng 1(cho user đăng nhập kiểm tra liên tục. khi bằng 1 thì gửi lên tất cả client. sau đó set lại 0)  

//          var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE idUnitInLocations !='"+current_S_POSITION_CLICK.idUnitInLocations+"'",function(error, rows,field)
//          {
//            if (!!error){DetailError = ('Move: Error in the query 5');

//              functions.writeLogErrror(DetailError);  
//            }else
//            {
//              arraycheckUsers = rows;
//              console.log("idUnitInLocations cập nhật: "+current_S_POSITION_CLICK.idUnitInLocations);
//              console.log("Position check 1: "+current_S_POSITION_CLICK.PositionClick);
//              console.log("chieu dai mang arraycheckUsers 1: "+ parseFloat((lodash.filter(arraycheckUsers, x => x.Position === current_S_POSITION_CLICK.PositionClick)).length));                                             
//            }
//          })  

//          var query = pool.query("SELECT MoveSpeedEach FROM `unitinlocations` WHERE idUnitInLocations ='"+current_S_POSITION_CLICK.idUnitInLocations+"'",function(error, rows,field)
//          {
//            if (!!error){DetailError = ('Move: Error in the query 6');

//              functions.writeLogErrror(DetailError);  
//            }else
//            {
//              if (rows.length > 0) 
//              {
//                MoveSpeedEach = rows[0].MoveSpeedEach;
//              }
//            }

//          })              

//          //update vị trị sau cùng và time move
//          var query = pool.query("UPDATE unitinlocations SET timeClick='"+currentTime+"', PositionClick = ? , TimeMoveComplete = ?, TimeCheck = ? WHERE idUnitInLocations = ? AND CheckCreate !=1",[current_S_POSITION_CLICK.PositionClick,(Math.round(current_S_POSITION_CLICK.timeMove * 100) / 100),parseFloat(currentTime),current_S_POSITION_CLICK.idUnitInLocations],function(error, result, field)
//          {
//            if(!!error){DetailError = ('Move: Error in the query 7');

//              functions.writeLogErrror(DetailError);  
//            }else
//            {
//              if (result.affectedRows> 0) 
//              {                                 
//                var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
//                {
//                  if (!!error){DetailError = ('Move: Error in the query 8');

//                    functions.writeLogErrror(DetailError);  
//                  }else
//                  {
//                    arrayAllCheckTimes = rows;  
//                    console.log("Position check 12: "+current_S_POSITION_CLICK.PositionClick);
//                    console.log("chieu dai mang arrayAllCheckTimes 1: "+ parseFloat(lodash.filter(arrayAllCheckTimes, x => x.Position === current_S_POSITION_CLICK.PositionClick).length));                                                     
//                    if (parseFloat((lodash.filter(arraycheckUsers, x => x.Position === current_S_POSITION_CLICK.PositionClick)).length)
//                      +parseFloat(lodash.filter(arrayAllCheckTimes, x => x.PositionClick === current_S_POSITION_CLICK.PositionClick).length)>=1)
//                    { 
//                      const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],
//                          arrs = current_S_POSITION_CLICK.PositionB.split(",");                 
//                      var PositionX = parseFloat(arrs[0]), PositionZ = parseFloat(arrs[1]), Distance=1;
//                      PositionX = PositionX - Distance;
//                      PositionZ = PositionZ + Distance;
//                      var TopLeft= PositionX+","+PositionZ;                 
//                      arrayS.push(TopLeft);                 
//                      for (var i = 0; i < (Distance*2); i++)
//                      {
//                        PositionX +=1;                    
//                        arrayS.push(PositionX+","+PositionZ);                   
//                      }
//                      for (var k = 0; k < (Distance*2+1); k++)
//                      {
//                        var arr = arrayS[k].split(",");
//                        for (var i = 1; i < (Distance*2+1); i++)
//                        {
//                          var v =parseFloat(arr[1])-i;                      
//                          arrayS.push(arr[0]+","+v);                                            
//                        }           
//                      }

//                      for (var i = 0; i < arrayS.length; i++) 
//                      {
//                        if (parseFloat((lodash.filter(arraycheckUsers, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTimes, x => x.PositionClick === arrayS[i]).length)<=0)
//                        {
//                          arrayRandom.push(arrayS[i]);
//                        }
//                      } 
//                      if (arrayRandom.length>0) 
//                      {                           
//                        newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                           
//                        var time=0;                         
//                        console.log("Position Check: "+ current_S_POSITION_CLICK.PositionClick);
//                        console.log("chieu dai mang arraycheckUsers: "+ parseFloat((lodash.filter(arraycheckUsers, x => x.Position === current_S_POSITION_CLICK.PositionClick)).length));
//                        console.log("chieu dai mang arrayAllCheckTimes: "+ parseFloat(lodash.filter(arrayAllCheckTimes, x => x.Position === current_S_POSITION_CLICK.PositionClick).length));
//                        if (parseFloat((lodash.filter(arraycheckUsers, x => x.Position === current_S_POSITION_CLICK.PositionClick)).length)>=1)
//                        {
//                          arrA =  current_S_POSITION_CLICK.Position.split(",");
//                          arrC =  newLocation.split(",");                 
//                          time = sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(MoveSpeedEach);                                                      
//                          console.log("Thoi gian di chuyen set lại: "+ (Number((time).toFixed(0))));
//                          updatePositionClickRandom(newLocation, (Number((time).toFixed(0))), Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                          {
//                            if (err){DetailError = ("ERROR ======: ",err);            

//                              functions.writeLogErrror(DetailError);  
//                            } else 
//                            {            
//                              if (parseFloat(data)===1) 
//                              {                               
//                                receivePositionChange(current_S_POSITION_CLICK.idUnitInLocations, function(err, data, UserName, PositionClick, UnitOrder)
//                                {
//                                  if (err){DetailError = ("ERROR ======: ",err);            

//                                    functions.writeLogErrror(DetailError);  
//                                  } else 
//                                  {            
//                                    if (parseFloat(data)===1) 
//                                    {
//                                      console.log(current_S_POSITION_CLICK.idUnitInLocations+" vị trí set lại: "+newLocation);
//                                      console.log(current_S_POSITION_CLICK.idUnitInLocations+" vị trí gửi: "+PositionClick);
//                                      console.log("=======================================================Thuc hien thay doi vi tri danh cron 6");                                                                      
//                                       //gửi vị trí cập nhật                                      
//                                          io.emit('R_POSITION_CHANGE',
//                                      {                                             
//                                              idUnitInLocations: parseFloat(current_S_POSITION_CLICK.idUnitInLocations),
//                                              UserName: UserName, 
//                                              PositionClick: newLocation,
//                                              UnitOrder: UnitOrder,

//                                          });  
//                                    }
//                                  }
//                                });
//                              }
//                            }
//                          });

//                        }else
//                        {                         
//                          updatePositionClickRandom(current_S_POSITION_CLICK.PositionClick, (Number((time).toFixed(0))), Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                          {
//                            if (err){DetailError = ("ERROR ======: ",err);            

//                              functions.writeLogErrror(DetailError);  
//                            } else 
//                            {            
//                              if (parseFloat(data)===1) 
//                              {                               
//                                receivePositionChange(current_S_POSITION_CLICK.idUnitInLocations, function(err, data, UserName, PositionClick, UnitOrder)
//                                {
//                                  if (err){DetailError = ("ERROR ======: ",err);            

//                                    functions.writeLogErrror(DetailError);  
//                                  } else 
//                                  {            
//                                    if (parseFloat(data)===1) 
//                                    {
//                                      console.log(current_S_POSITION_CLICK.idUnitInLocations+" vị trí set lại: "+PositionClick);
//                                      console.log("=============Thuc hien thay doi vi tri danh cron 68");                                                                     
//                                       //gửi vị trí cập nhật trùng vòng 1   
//                                          io.emit('R_POSITION_CHANGE',
//                                      {                                             
//                                              idUnitInLocations: parseFloat(current_S_POSITION_CLICK.idUnitInLocations),
//                                              UserName: UserName, 
//                                              PositionClick: current_S_POSITION_CLICK.PositionClick,
//                                              UnitOrder: UnitOrder,
//                                          });  
//                                    }
//                                  }
//                                });
//                              }
//                            }
//                          });
//                        }               

//                      }else
//                      {                                       
//                          var PositionX = parseFloat(arrs[0]), PositionZ =parseFloat(arrs[1]), Distance=2;
//                        PositionX = PositionX - Distance;
//                        PositionZ = PositionZ + Distance;
//                        var TopLeft= PositionX+","+PositionZ;
//                        arrayS1.push(TopLeft);
//                        for (var i = 0; i < (Distance*2); i++)
//                        {
//                          PositionX +=1;
//                          arrayS1.push(PositionX+","+PositionZ);
//                        }
//                        for (var k = 0; k < (Distance*2+1); k++)
//                        {
//                          var arr = arrayS1[k].split(",");
//                          for (var i = 1; i < (Distance*2+1); i++)
//                          {
//                            var v =parseFloat(arr[1])-i;
//                            if(arrayS.indexOf(arr[0]+","+v) > -1) {               
//                            }else
//                            {               
//                              arrayS1.push(arr[0]+","+v);     
//                            }             
//                          }           
//                        }

//                        for (var i = 0; i < arrayS1.length; i++) 
//                        {
//                          if (parseFloat((lodash.filter(arraycheckUsers, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTimes, x => x.PositionClick === arrayS1[i]).length)<=0)
//                          {
//                            arrayRandom.push(arrayS1[i]);
//                          }
//                        }
//                        if (arrayRandom.length >0 ) 
//                        {                           
//                          newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                   
//                          arrA =  newLocation.split(",");
//                          arrC =  current_S_POSITION_CLICK.PositionB.split(",");          

//                          updatePositionClickRandom(newLocation, time, Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                          {
//                            if (err){DetailError = ("ERROR ======: ",err);            

//                              functions.writeLogErrror(DetailError);  
//                            } else 
//                            {            
//                              if (parseFloat(data)===1) 
//                              {                               
//                                receivePositionChange(current_S_POSITION_CLICK.idUnitInLocations, function(err, data, UserName, PositionClick, UnitOrder)
//                                {
//                                  if (err){DetailError = ("ERROR ======: ",err);            

//                                    functions.writeLogErrror(DetailError);  
//                                  } else 
//                                  {            
//                                    if (parseFloat(data)===1) 
//                                    {
//                                      console.log("=============Thuc hien thay doi vi tri danh cron 5");                                                                                                                  
//                                       //gửi vị trí cập nhật trùng vòng 2                                   
//                                          io.emit('R_POSITION_CHANGE',
//                                      {

//                                              idUnitInLocations: parseFloat(current_S_POSITION_CLICK.idUnitInLocations),
//                                              UserName: UserName, 
//                                              PositionClick: newLocation,
//                                              UnitOrder: UnitOrder,

//                                          }); 
//                                    }
//                                  }
//                                });
//                              }
//                            }
//                          }); 
//                        }else
//                        {                           
//                            var PositionX = parseFloat(arrs[0]), PositionZ =parseFloat(arrs[1]), Distance=3;
//                          PositionX = PositionX - Distance;
//                          PositionZ = PositionZ + Distance;
//                          var TopLeft= PositionX+","+PositionZ;
//                          arrayS2.push(TopLeft);
//                          for (var i = 0; i < (Distance*2); i++)
//                          {
//                            PositionX +=1;
//                            arrayS2.push(PositionX+","+PositionZ);
//                          }
//                          for (var k = 0; k < (Distance*2+1); k++)
//                          {
//                            var arr = arrayS2[k].split(",");
//                            for (var i = 1; i < (Distance*2+1); i++)
//                            {
//                              var v =parseFloat(arr[1])-i;
//                              if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
//                              {               
//                              }else
//                              {               
//                                arrayS2.push(arr[0]+","+v);     
//                              } 
//                            }           
//                          }

//                          for (var i = 0; i < arrayS2.length; i++) 
//                          {
//                            if (parseFloat((lodash.filter(arraycheckUsers, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTimes, x => x.PositionClick === arrayS2[i]).length)<=0)
//                            {
//                              arrayRandom.push(arrayS2[i]);
//                            }
//                          }                                         
//                          if (arrayRandom.length>0) {                           
//                            newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                   
//                            arrA =  newLocation.split(",");
//                            arrC =  current_S_POSITION_CLICK.PositionB.split(",");                  
//                            var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTimes[j].MoveSpeedEach);
//                            time=0;                         

//                            updatePositionClickRandom(newLocation, time, Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)), currentTime, 0, current_S_POSITION_CLICK.idUnitInLocations, function(err,data)
//                            {
//                              if (err){DetailError = ("ERROR ======: ",err);            

//                                functions.writeLogErrror(DetailError);  
//                              } else 
//                              {            
//                                if (parseFloat(data)===1) 
//                                {                                 
//                                  receivePositionChange(current_S_POSITION_CLICK.idUnitInLocations, function(err, data, UserName, PositionClick, UnitOrder)
//                                  {
//                                    if (err){DetailError = ("ERROR ======: ",err);            

//                                      functions.writeLogErrror(DetailError);  
//                                    } else 
//                                    {            
//                                      if (parseFloat(data)===1) 
//                                      {
//                                        console.log("=============Thuc hien thay doi vi tri danh cron 4");                                                                                                                      
//                                         //gửi vị trí cập nhật trùng vòng 3                                      
//                                            io.emit('R_POSITION_CHANGE',
//                                        {

//                                                idUnitInLocations: parseFloat(current_S_POSITION_CLICK.idUnitInLocations),
//                                                UserName: UserName, 
//                                                PositionClick: newLocation,
//                                                UnitOrder: UnitOrder,
//                                            }); 
//                                      }
//                                    }
//                                  });
//                                }
//                              }
//                            });
//                          }
//                        }
//                      }             
//                    }else
//                    { 
//                      console.log("R_POSITION_CLICK 4: "+ current_S_POSITION_CLICK.idUnitInLocations);                  
//                      io.emit('R_POSITION_CLICK',
//                      {
//                        PositionClick:current_S_POSITION_CLICK.PositionClick, 
//                        Position: current_S_POSITION_CLICK.Position,                        
//                        idUnitInLocations:parseInt(current_S_POSITION_CLICK.idUnitInLocations,10),
//                              });                           
//                    }

//                    }
//                });

//              }           
//            }
//          });
//        }       
//      });               
//         })
//    cron.schedule('*/1 * * * * *',function()
//    {     
//      d = new Date();
//        currentTime = Math.floor(d.getTime() / 1000);

//        //thực hiện chức năng trừ farm khi unit di chuyển
//        var arraySendFarmAfterMoveConsume = [],arraySendFarmMoveConsume = [],FarmPortableMove,FarmPortableMoveOffComplete,
//        APosition,BPosition,A,A1,A2,B,B1,B2,X,Z,PositionChange,arrB,arrC,TimeMoveToOff=0,arraySendFarmMoveConsumeOffComplete = [],
//        APositionOff,BPositionOff,AOff,A1Off,A2Off,BOff,B1Off,B2Off,XOff,ZOff,PositionChangeOff,FarmPortableMoveOnOff,FarmPortableMoveOff,
//        FarmPortableMoveOffNotEnought,AverageFarmSecond,NumberSecondMoveOff,PositionChangeOffNotEnought,TimeMoveCompletes=0,arraycheckUserss,positionCheck;

//        //thực hiện cập nhật farm khi di chuyển
//      var query = pool.query("SELECT * FROM `unitinlocations` WHERE  TimeMoveComplete >10 AND CheckMove = 1 AND CheckOnline = 1 AND TimeSendToClient='"+currentTime+"'",function(error, rows,field)
//      {
//        if (!!error){ole.log('Move: Error in the query 9');
//        }else
//        {
//          if (rows.length>0) 
//          {           
//            arraySendFarmMoveConsume =rows;                       
//            for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
//            {             
//              var index = i;    
//              //kiểm tra lượng farm cho lần di chuyển kế tiếp             
//              FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality));  

//              //  tính vị trí di chuyển sau 10s
//              APosition = rows[index].Position;
//              A = APosition.split(",");
//              A1 = parseFloat(A[0]);
//              A2 = parseFloat(A[1]);
//              BPosition = rows[index].PositionClick;
//              B = BPosition.split(",");
//              B1 = parseFloat(B[0]);
//              B2 = parseFloat(B[1]);
//              X= A1+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(B1-A1))/parseFloat(rows[i].TimeMoveComplete);
//              X=Number((parseFloat(X).toFixed(1)));
//              Z= A2+((parseFloat(currentTime) - parseFloat(rows[i].timeClick))*(B2-A2))/parseFloat(rows[i].TimeMoveComplete);
//              Z=Number((parseFloat(Z).toFixed(1)));             
//              PositionChange = X+","+Z;
//              var query = pool.query("UPDATE unitinlocations SET TimeMoveComplete = '"+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(currentTime))               
//                        +"',TimeMoveTotalComplete = '"+ (parseFloat(currentTime)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(currentTime)))
//                        +"',TimeCheck = '"+ (parseFloat(currentTime)+(parseFloat(rows[index].TimeMoveTotalComplete)-parseFloat(currentTime)))
//                        +"',FarmPortable = '"+ parseFloat(FarmPortableMove)                         
//                        +"',Position = '"+ PositionChange                       
//                        +"',TimeSendToClient = '"+ (10+parseFloat(currentTime))  
//                        +"',timeClick = '"+ parseFloat(currentTime)                      
//                        +"',CheckMove = 1 WHERE idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
//              {
//                if(!!error){DetailError = ('Move: Error in the query 10');

//                  functions.writeLogErrror(DetailError);  
//                }else
//                {
//                  console.log("Cập nhật position: "+ PositionChange);
//                  //Kiểm tra data sau khi update
//                  if (result.affectedRows>0)
//                  {
//                    var query = pool.query("SELECT * FROM `unitinlocations` WHERE idUnitInLocations='"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, rows,field)
//                    {
//                      if (!!error){DetailError = ('Move: Error in the query 11');

//                        functions.writeLogErrror(DetailError);  
//                      }else
//                      {
//                        if (rows.length>0) 
//                        { 

//                          if (parseFloat(FarmPortableMove)>=parseFloat(rows[0].Quality))
//                          {   
//                            console.log("R_FARM_CONSUME_MOVE 1: "+rows[0].idUnitInLocations);                                   
//                                    //gửi lên cho từng user                         
//                              io.emit('R_FARM_CONSUME_MOVE',
//                            {
//                              message: 1,
//                              idUnitInLocations:rows[0].idUnitInLocations,                                        
//                              FarmPortableMove: parseInt(FarmPortableMove,10),
//                              Position:rows[0].PositionClick,                             
//                                    }); 

//                                    //Cập nhật redis                                    
//                            updateRedis(rows[0].idUnitInLocations);   
//                            console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm dang còn============================= ");                                                                                                                        

//                          }else if (parseFloat(FarmPortableMove)<parseFloat(rows[0].Quality))
//                          {
//                            if (((parseFloat(X) % 1 ) < 0.099) && ((parseFloat(Math.abs(Z)) % 1 ) < 0.099))
//                            {   

//                                //io.in(clients[clients.findIndex(item => item.name === arraySendFarmMoveConsume[index].UserName)].idSocket).emit('R_FARM_CONSUME_MOVE',
//                                PositionChange = Number((parseFloat(X).toFixed(0)))+","+Number((parseFloat(Z).toFixed(1))); 
//                                console.log("R_FARM_CONSUME_MOVE 7: "+rows[0].idUnitInLocations);                             
//                                io.emit('R_FARM_CONSUME_MOVE',
//                              {
//                                message: 0,
//                                idUnitInLocations:rows[0].idUnitInLocations,                                        
//                                FarmPortableMove: parseInt(FarmPortableMove,10),
//                                Position:PositionChange,                                
//                                      });                                 

//                                      //cập nhật lại data                 
//                              var query = pool.query("UPDATE unitinlocations SET  TimeMoveComplete = 0,TimeCheck = '"+parseFloat(currentTime)
//                                +"',Position = '"+PositionChange
//                                +"',timeClick = '"+parseFloat(currentTime)                               
//                                +"',PositionClick='"+PositionChange
//                                +"',TimeMoveComplete = 0,TimeMoveTotalComplete = '"+parseFloat(currentTime)
//                                +"',TimeSendToClient = 0,CheckMove = 0 WHERE idUnitInLocations = '"+parseFloat(rows[0].idUnitInLocations)+"'",function(error, result, field)
//                              {
//                                if(!!error){DetailError = ('Move: Error in the query 12');

//                                  functions.writeLogErrror(DetailError);  
//                                }else
//                                {
//                                  if (result.affectedRows>0) 
//                                  { 
//                                    //cập nhật redis                                      
//                                    updateRedis(rows[0].idUnitInLocations);
//                                    CheckPosition(io);                                                                
//                                  }
//                                }
//                              });                   
//                            }
//                            else
//                            {                                   
//                                arrC =  PositionChange.split(",");
//                              arrB =  functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange).split(",");  
//                              var time=sqrt( math.square(parseFloat(arrB[0])-parseFloat(arrC[0])) + math.square(parseFloat(arrB[1])-parseFloat(arrC[1])))/parseFloat(rows[0].MoveSpeedEach);                                                                
//                              console.log("R_FARM_CONSUME_MOVE 8: "+rows[0].idUnitInLocations);
//                              io.emit('R_FARM_CONSUME_MOVE',
//                              {
//                                message: 0,
//                                idUnitInLocations:rows[0].idUnitInLocations,                                        
//                                FarmPortableMove: parseInt(FarmPortableMove,10),
//                                Position: functions.getNewLocationClickWithFarm(PositionChange,arraySendFarmMoveConsume[index].PositionClick,PositionChange),                               
//                                      });   

//                                      //cập nhật lại data                 
//                              var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+functions.getNewLocationClickWithFarm(PositionChange,rows[0].PositionClick,PositionChange)
//                                +"',timeClick = '"+(parseFloat(currentTime)+Number((time).toFixed(0)))                                 
//                                +"',FarmPortable = '"+parseFloat(FarmPortableMove)                                  
//                                +"',TimeMoveComplete = '"+time                                  
//                                +"',TimeMoveTotalComplete = '"+ (time+parseFloat(currentTime))
//                                +"',TimeCheck = '"+ (time+parseFloat(currentTime))
//                                +"',TimeSendToClient = 0,CheckMove = 1 WHERE idUnitInLocations = '"+parseFloat(arraySendFarmMoveConsume[index].idUnitInLocations)+"'",function(error, result, field)
//                              {
//                                if(!!error){DetailError = ('Move: Error in the query 13');

//                                  functions.writeLogErrror(DetailError);  
//                                }else
//                                {
//                                  if (result.affectedRows>0) 
//                                  {   
//                                    console.log(parseFloat(rows[0].idUnitInLocations)+" =================Cap nhật khi di chuyển mot don vi thanh cong khi farm vị trí lẻ=============================");                                    
//                                    //cập nhật lại redis
//                                    updateRedis(rows[0],idUnitInLocations);                                                                                                             
//                                  }
//                                }
//                              });                                                                                                                                                                                                                         
//                            }                                               
//                          }
//                        }
//                      }
//                    });
//                  }                             
//                }
//              });                                               
//            }                           
//          }
//        }
//      });

//      //Thực hiện cập nhật farm khi user đứng lại
//      var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMove = 1 AND CheckOnline = 1 AND TimeMoveTotalComplete ='"+currentTime+"'",function(error, rows,field)
//      {
//        if (!!error){DetailError = ('Move: Error in the query 14');

//          functions.writeLogErrror(DetailError);  
//        }else
//        {
//          if (rows.length>0) 
//          {
//            arraySendFarmMoveConsume =rows; 
//            for (var i = 0; i < arraySendFarmMoveConsume.length; i++) 
//            {
//              var index = i;                            
//              FarmPortableMove = parseFloat(rows[index].FarmPortable)-(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete));               
//              if (parseFloat(rows[index].FarmPortable)<(parseFloat(rows[index].Quality)*parseFloat(rows[index].MoveSpeedEach)*parseFloat(rows[index].TimeMoveComplete)))
//              {
//                FarmPortableMove = 0;
//              }
//              positionCheck = rows[index].PositionClick;
//              var query = pool.query("UPDATE unitinlocations SET Position = PositionClick ,TimeMoveComplete = 0,CheckMove = 0,FarmPortable = '"+ parseFloat(FarmPortableMove) 
//                        +"',timeClick = '"+ parseFloat(currentTime)
//                        +"',TimeSendToClient = 0,CheckMove = 0,CheckMoveOff = 0 WHERE idUnitInLocations = '"+parseFloat(rows[index].idUnitInLocations)+"'",function(error, result, field)
//              {
//                if(!!error){DetailError = ('Move: Error in the query 15');

//                  functions.writeLogErrror(DetailError);  
//                }else
//                {
//                  if (result.affectedRows>0) 
//                  {
//                    console.log("R_FARM_CONSUME_MOVE : "+rows[0].idUnitInLocations+" PositionClick: "+rows[index].PositionClick);
//                    //gửi lên cho từng user             
//                            io.emit('R_FARM_CONSUME_MOVE',
//                    {
//                      message: 1,
//                      idUnitInLocations:rows[index].idUnitInLocations,                                        
//                      FarmPortableMove: parseInt(FarmPortableMove,10),
//                      Position:rows[index].PositionClick,                     
//                            });                             

//                            //cập nhật redis                            
//                    console.log(parseFloat(rows[index].idUnitInLocations)+"==cập nhật khi di chuyên xong: "+FarmPortableMove);  
//                    updateRedis(rows[index].idUnitInLocations);
//                    //kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (3=)  
//                    var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE idUnitInLocations !='"+rows[index].idUnitInLocations+"'",function(error, rows,field)
//                    {
//                      if (!!error){DetailError = ('Move: Error in the query 16');

//                        functions.writeLogErrror(DetailError);  
//                      }else
//                      {                       
//                        arraycheckUserss = rows;
//                        if (parseFloat((lodash.filter(arraycheckUserss, x => x.Position === positionCheck)).length)>=1)
//                        {                                               
//                          CheckPosition(io);                            
//                        }                     
//                      }
//                    })                    

//                  }
//                }
//              });                               
//            }                           
//          }
//        }
//      }); 


//      //Cập nhật vi tri và farm khi di chuyển hoàn tất offline
//      var query = pool.query("SELECT * FROM `unitinlocations` WHERE CheckMoveOff=1 AND CheckOnline=0 AND TimeMoveTotalComplete ='"+parseFloat(currentTime)+"' AND CheckCreate !=1",function(error, rows,field)
//      {
//        if (!!error){DetailError = ('Move: Error in the query 17');

//          functions.writeLogErrror(DetailError);  
//        }else
//        {
//          if (rows.length>0) 
//          {
//            arraySendFarmMoveConsumeOffComplete =rows;  
//            for (var i = 0; i < arraySendFarmMoveConsumeOffComplete.length; i++) 
//            {
//              var index = i;                            
//              FarmPortableMoveOffComplete = parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)-(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete));                
//              if (parseFloat(arraySendFarmMoveConsumeOffComplete[index].FarmPortable)<(parseFloat(arraySendFarmMoveConsumeOffComplete[index].Quality)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].MoveSpeedEach)*parseFloat(arraySendFarmMoveConsumeOffComplete[index].TimeMoveComplete)))
//              {
//                FarmPortableMoveOffComplete = 0;
//              }

//              var query = pool.query("UPDATE unitinlocations SET Position = PositionClick,TimeMoveTotalComplete='"+parseFloat(currentTime)
//                +"', TimeMoveComplete = 0,TimeCheck = '"+parseFloat(currentTime)
//                +"', CheckMoveOff = 0,CheckMove = 0,timeClick='"+parseFloat(currentTime)
//                +"', FarmPortable='"+parseFloat(FarmPortableMoveOffComplete)
//                +"',DistanceMoveLogoff='' WHERE idUnitInLocations='"+parseFloat(arraySendFarmMoveConsumeOffComplete[index].idUnitInLocations)+"'",function(error, result, field)
//              {
//                if(!!error){DetailError = ('Move: Error in the query 18');

//                  functions.writeLogErrror(DetailError);  
//                }else
//                {
//                  if (result.affectedRows> 0) 
//                  {   
//                    console.log("============Cập nhật vị trí và farm khi di chuyển offline hoàn tất: "+parseFloat(rows[index].FarmPortable));
//                    io.emit('R_FARM_CONSUME_MOVE',
//                    {
//                      message: 1,
//                      idUnitInLocations:rows[index].idUnitInLocations,                                        
//                      FarmPortableMove: parseFloat(FarmPortableMoveOffComplete),
//                      Position:rows[index].PositionClick,                     
//                            });

//                    //kiểm tra vị trí trùng saukhi di chuyển tới điểm đến (4=)                    
//                    var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1 UNION ALL SELECT Position FROM `unitinlocations` WHERE idUnitInLocations !='"+rows[index].idUnitInLocations+"'",function(error, rows,field)
//                    {
//                      if (!!error){DetailError = ('Move: Error in the query 19');

//                        functions.writeLogErrror(DetailError);  
//                      }else
//                      {
//                        arraycheckUserss = rows;
//                        if (parseFloat((lodash.filter(arraycheckUserss, x => x.Position === rows[index].PositionClick)).length)>=1)
//                        {                                               
//                          CheckPosition(io);  
//                        }                     
//                      }
//                    })                      
//                  }               
//                }
//              });                               
//            }                           
//          }
//        }
//      });                         

//    }); 
//     }
// }

// function getcurrentSENDFARMCONSUME(data)
// {
//  return currentSENDFARMCONSUME =
//  {
//    idUnitInLocations:data.idUnitInLocations,               
//    PositionFrom:data.PositionFrom,
//    PositionTo:data.PositionTo,                               
//  }
// }
// function getcurrent_S_POSITION_CLICK(data)
// {
//  return current_S_POSITION_CLICK =
//  {
//    idUnitInLocations:data.idUnitInLocations,
//    Position:data.Position,
//    PositionClick:data.PositionClick,
//    timeMove:data.timeMove, 
//    idUnitInLocationsB:data.idUnitInLocationsB,
//    PositionB:data.PositionB, 
//  } 
// }
// function updateFarmMove(PositionClick,timeClick,TimeMoveComplete,TimeMoveTotalComplete,TimeCheck,TimeSendToClient,CheckMove,idUnitInLocations,callback) 
// {   
//      d = new Date(); currentTime = Math.floor(d.getTime() / 1000);
//      console.log("=====timeClick: "+timeClick);
//  var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+ PositionClick                            
//    +"',timeClick = '"+ parseFloat(timeClick)
//    +"',TimeMoveComplete = '"+ parseFloat(TimeMoveComplete)                           
//    +"',TimeMoveTotalComplete = '"+ (parseFloat(TimeMoveComplete)+parseFloat(currentTime))
//    +"',TimeCheck = '"+ (parseFloat(TimeMoveComplete)+parseFloat(currentTime))
//    +"',TimeSendToClient = '"+ ((1/parseFloat(TimeSendToClient))+parseFloat(currentTime))
//    +"',CheckMove = "+CheckMove+" WHERE idUnitInLocations = '"+idUnitInLocations+"'",function(error, result, field)
//  {
//         if (!!error) 
//         {
//             DetailError = ("move: Error in the query updateFarmMove");

//      functions.writeLogErrror(DetailError);  
//             callback(error,null);
//         }else 
//         {
//          console.log("update updateFarmMove: "+ idUnitInLocations);
//             if (result.affectedRows>0) 
//             {                
//                callback(null,1);                   
//             }else
//             {                   
//                 callback(null,0);
//             }
//         }
//     }); 
// }

// function updatePositionClick(PositionClick, TimeMoveComplete, TimeCheck, timeClick, CheckCreate, idUnitInLocations, callback)
// {
//  console.log(PositionClick+"_"
//    +TimeMoveComplete+"_"
//    +TimeCheck+"_"
//    +timeClick+"_"
//    +CheckCreate+"_"
//    +idUnitInLocations);
//  var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+PositionClick
//    +"',TimeMoveComplete = '"+parseFloat(TimeMoveComplete)
//    +"',TimeCheck = '"+parseFloat(TimeCheck)
//    +"',timeClick = '"+parseFloat(timeClick)
//    +"',CheckCreate = '"+parseFloat(CheckCreate)+"' WHERE idUnitInLocations = '"+idUnitInLocations+"'",function(error, result, field)
//  {
//     if (!!error) 
//         {
//             DetailError = ("move: Error in the query updateFarmMove");

//      functions.writeLogErrror(DetailError);  
//             callback(error,null);
//         }else 
//         {
//          console.log("update updatePositionClick: "+ idUnitInLocations);
//             if (result.affectedRows>0) 
//             {                
//                callback(null,1);                   
//             }else
//             {                   
//                 callback(null,0);
//             }
//         }
//  })
// }

// function receivePositionChange(idUnitInLocations, callback)
// {
//  var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
//  {
//    if (!!error) 
//         {
//             DetailError = ("move: Error in the query receivePositionChange");

//      functions.writeLogErrror(DetailError);  
//             callback(error,null);
//         }else 
//         {
//             if (rows.length>0) 
//             {                
//                callback(null,1,rows[0].UserName,rows[0].PositionClick,rows[0].UnitOrder);    
//                console.log("================receivePositionChange thanh cong");               
//             }else
//             {                   
//                 callback(null,0,0,0,0);
//             }
//         }
//  })
// }

// function updatePositionClickRandom(PositionClick, TimeMoveComplete, TimeCheck, timeClick, CheckLog, idUnitInLocations, callback)
// {
//  console.log("====================================updatePositionClickRandom: "+PositionClick+"_"
//    +TimeMoveComplete+"_"
//    +TimeCheck+"_"
//    +timeClick+"_"
//    +CheckLog+"_"
//    +idUnitInLocations);
//  d = new Date(), currentTime = Math.floor(d.getTime() / 1000);
//  var query = pool.query("UPDATE unitinlocations SET PositionClick = '"+PositionClick
//    +"',TimeMoveComplete = '"+parseFloat(TimeMoveComplete)
//    +"',TimeMoveTotalComplete = '"+(parseFloat(TimeMoveComplete)+parseFloat(currentTime))
//    +"',TimeCheck = '"+parseFloat(TimeCheck)
//    +"',timeClick = '"+parseFloat(timeClick)
//    +"',CheckLog = '"+parseFloat(CheckLog)+"' WHERE idUnitInLocations = '"+idUnitInLocations+"'",function(error, result, field)
//  {
//     if (!!error) 
//         {
//             DetailError = ("move: Error in the query updateFarmMove");

//      functions.writeLogErrror(DetailError);  
//             callback(error,null);
//         }else 
//         {
//             if (result.affectedRows>0) 
//             {                
//                callback(null,1);    
//                console.log("================updatePositionClickRandom thanh cong");               
//             }else
//             {     
//              console.log("update updatePositionClickRandom: "+ idUnitInLocations);              
//                 callback(null,0);
//             }
//         }
//  })
// }

// function updateRedis(idUnitInLocations)
// {
//  var query = pool.query("SELECT `idUnitInLocations`,`UserName`,`HealthEach`,`HealthRemain`,`FarmPortable`,`Damage`,`DamageEach`, `Defend`,`DefendEach`, `Quality`,`UnitOrder`,`CheckOnline`,`userFight`,`CheckFight` FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
//  {
//    if (!!error){DetailError = ('move: Error in the updateRedis');

//      functions.writeLogErrror(DetailError);  
//    }else
//    {                                                               
//          //Cập nhật farm và vị trị lại trong redis                                             
//      client.set(idUnitInLocations,JSON.stringify(rows[0]));

//    }
//  })  
// }

// function getNumberDifferent(UN,A1,A2,B1,B2)
// {
//     var S1, S2; 
//     if (parseFloat(UN)===0) 
//     {
//         if (A1>B1) 
//         {
//             S1 = parseFloat(A1) - parseFloat(B1);
//             if (A2>B2) 
//             {
//                 S2 = parseFloat(A2) - parseFloat(B2); 
//                 if (S1 >=0.2 || S2 >= 0.2) {
//                     return false;
//                 }else
//                 {
//                     return true;
//                 }
//             }else
//             {
//                 S2 = parseFloat(B2) - parseFloat(A2);
//                 if (S1 >=0.2|| S2 >= 0.2) {
//                     return false;
//                 }else
//                 {
//                     return true;
//                 }
//             }
//         }else
//         {
//             S1 = parseFloat(B1) - parseFloat(A1);
//             if (A2>B2) 
//             {
//                 S2 = parseFloat(A2) - parseFloat(B2); 
//                 if (S1 >=0.2 || S2 >= 0.2) {
//                     return false;
//                 }else
//                 {
//                     return true;
//                 }
//             }else
//             {
//                 S2 = parseFloat(B2) - parseFloat(A2);
//                 if (S1 >=0.2 || S2 >= 0.2) {
//                     return false;
//                 }else
//                 {
//                     return true;
//                 }
//             }
//         }
//     }       
// }

// function CheckPosition(io)
// {
//  console.log("===============Call function check position=================");
//     var arrayAllCheckTimec = [],arrA = [],arrB = [],arrayAllSelect = [],arraycheckUserc = [], arrayExpireTimeMove = [];
//     var  X,Z,timeMoves,APosition,A,A1,A2,BPosition,B,B1,B2,newLocation,s,arrA,arrB,arrC,XB,ZB,j,idUnitInLocations,FarmConsumeChangePositionDuplicate=0;           
//     var query = pool.query("SELECT Position FROM `userbase` WHERE 1 UNION ALL SELECT Position FROM `userasset` WHERE 1",function(error, rows,field)
//     {
//         if (!!error){DetailError = ('Move: Error in the query 20');

//      functions.writeLogErrror(DetailError);  
//         }else
//         {
//             arraycheckUserc=rows;                                                                                        
//             var query = pool.query("SELECT * FROM `unitinlocations` WHERE `TimeMoveComplete`= 0 AND CheckCreate !=1 ORDER BY `TimeCheck` DESC",function(error, rows,field)
//             {
//                 if (!!error){DetailError = ('Move: Error in the query 21');

//          functions.writeLogErrror(DetailError);  
//                 }else
//                 {
//                     for (var k = 0; k < rows.length; k++)
//                     {
//                          arrayAllCheckTimec.push(rows[k]);
//                     }
//                     for (var j = 0; j < arrayAllCheckTimec.length; j++)
//                     {                               
//                         if (parseFloat((lodash.filter(arraycheckUserc, x => x.Position === arrayAllCheckTimec[j].PositionClick)).length)
//                             +parseFloat(lodash.filter(arrayAllCheckTimec, x => x.PositionClick === arrayAllCheckTimec[j].PositionClick).length)>=2)
//                         {
//                             const s = [250],arrayRandom=[],arrayS = [],arrayS1 = [],arrayS2 = [],arrs = arrayAllCheckTimec[j].Position.split(","),idUnitInLocations=arrayAllCheckTimec[j].idUnitInLocations;                                  
//                             var X = parseFloat(arrs[0]), 
//                             Y =parseFloat(arrs[1]), N=1;
//                             X = X - N;
//                             Y = Y + N;
//                             var TopLeft= X+","+Y;                                   
//                             arrayS.push(TopLeft);                                   
//                             for (var i = 0; i < (N*2); i++)
//                             {
//                                 X +=1;                                      
//                                 arrayS.push(X+","+Y);                                       
//                             }
//                             for (var k = 0; k < (N*2+1); k++)
//                             {
//                                 var arr = arrayS[k].split(",");
//                                 for (var i = 1; i < (N*2+1); i++)
//                                 {
//                                     var v =parseFloat(arr[1])-i;                                            
//                                     arrayS.push(arr[0]+","+v);                                                                                      
//                                 }                       
//                             }

//                             for (var i = 0; i < arrayS.length; i++) 
//                             {
//                                 if (parseFloat((lodash.filter(arraycheckUserc, x => x.Position === arrayS[i])).length+lodash.filter(arrayAllCheckTimec, x => x.PositionClick === arrayS[i]).length)<=0)
//                                 {
//                                     arrayRandom.push(arrayS[i]);
//                                 }
//                             }                                                                                   
//                             if (arrayRandom.length>0) 
//                             {                                                       
//                                 newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
//                                 arrayAllCheckTimec[j].PositionClick = newLocation;
//                                 arrA =  newLocation.split(",");
//                                 arrC =  arrayAllCheckTimec[j].Position.split(",");                                                               
//                                 var time=Number((sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTimec[j].MoveSpeedEach)).toFixed(0));                            
//                                 //time=0;                                   
//                                 var farmtest =  (parseFloat(arrayAllCheckTimec[j].Quality)*parseFloat(arrayAllCheckTimec[j].MoveSpeedEach)*parseFloat(time));                                                                 
//                                 if (parseFloat(arrayAllCheckTimec[j].FarmPortable) < (parseFloat(arrayAllCheckTimec[j].Quality)*parseFloat(arrayAllCheckTimec[j].MoveSpeedEach)*parseFloat(time))) 
//                                 {
//                                     FarmConsumeChangePositionDuplicate=0;
//                                 }else
//                                 {
//                                     FarmConsumeChangePositionDuplicate = parseFloat(arrayAllCheckTimec[j].FarmPortable)-(parseFloat(arrayAllCheckTimec[j].Quality)*parseFloat(arrayAllCheckTimec[j].MoveSpeedEach)*parseFloat(time));
//                                 }
//                                 var query = pool.query("UPDATE unitinlocations SET FarmPortable='"+parseFloat(FarmConsumeChangePositionDuplicate)+"',TimeSendToClient='"+(parseFloat(currentTime)+10)+"',CheckMove=1,PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?", [newLocation,time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),0,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),currentTime,arrayAllCheckTimec[j].idUnitInLocations],function(error, result, field)
//                                 {
//                                     if(!!error){DetailError = ('Move: Error in the query 22');

//                    functions.writeLogErrror(DetailError);  
//                                     }else
//                                     {
//                                         if (result.affectedRows> 0) 
//                                         {                                       
//                                             var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
//                                             {
//                                                 if (!!error){DetailError = ('Move: Error in the query 23');

//                          functions.writeLogErrror(DetailError);  
//                                                 }else
//                                                 {
//                                                     if (rows.length >0)
//                                                     {                  
//                                                      console.log("=============Thuc hien thay doi vi tri danh cron circle 1");                                                                                                      
//                                                         //gửi vị trí cập nhật trùng vòng 1                                                        
//                                                         io.emit('R_POSITION_CHANGE',
//                            {                                   
//                                    idUnitInLocations: parseFloat(idUnitInLocations),
//                                    UserName: rows[0].UserName, 
//                                    PositionClick: newLocation,
//                                    UnitOrder: rows[0].UnitOrder,
//                                });                                                                       
//                                                     }
//                                                 }
//                                             })
//                                         }
//                                     }
//                                 })  
//                             }else
//                             {                                                                              
//                                 var X = parseFloat(arrs[0]), 
//                                 Y =parseFloat(arrs[1]), N=2;
//                                 X = X - N;
//                                 Y = Y + N;
//                                 var TopLeft= X+","+Y;
//                                 arrayS1.push(TopLeft);
//                                 for (var i = 0; i < (N*2); i++)
//                                 {
//                                     X +=1;
//                                     arrayS1.push(X+","+Y);
//                                 }
//                                 for (var k = 0; k < (N*2+1); k++)
//                                 {
//                                     var arr = arrayS1[k].split(",");
//                                     for (var i = 1; i < (N*2+1); i++)
//                                     {
//                                         var v =parseFloat(arr[1])-i;
//                                         if(arrayS.indexOf(arr[0]+","+v) > -1) {                             
//                                         }else
//                                         {                               
//                                             arrayS1.push(arr[0]+","+v);         
//                                         }                           
//                                     }                       
//                                 }

//                                 for (var i = 0; i < arrayS1.length; i++) 
//                                 {
//                                     if (parseFloat((lodash.filter(arraycheckUserc, x => x.Position === arrayS1[i])).length+lodash.filter(arrayAllCheckTimec, x => x.PositionClick === arrayS1[i]).length)<=0)
//                                     {
//                                         arrayRandom.push(arrayS1[i]);
//                                     }
//                                 }
//                                 if (arrayRandom.length >0 ) 
//                                 {                                                       
//                                     newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
//                                     arrayAllCheckTimec[j].PositionClick = newLocation;
//                                     arrA =  newLocation.split(",");
//                                     arrC =  arrayAllCheckTimec[j].Position.split(",");                                   
//                                     var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTimec[j].MoveSpeedEach);
//                                     time=0;                                    
//                                     //var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),currentTime,arrayAllCheckTimec[j].idUnitInLocations],function(error, result, field)
//                                     var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),currentTime,arrayAllCheckTimec[j].idUnitInLocations],function(error, result, field)
//                                     {
//                                         if(!!error) { DetailError = ('EMove: Error in the query 24');

//                      functions.writeLogErrror(DetailError);  
//                                         }else
//                                         {
//                                             if (result.affectedRows> 0) 
//                                             {                                                       
//                                                 var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
//                                                 {
//                                                     if (!!error){DetailError = ('Move: Error in the query 25');

//                            functions.writeLogErrror(DetailError);  
//                                                     }else
//                                                     {
//                                                         if (rows.length >0)
//                                                         {                         
//                                                          console.log("=============Thuc hien thay doi vi tri danh cron circle 2");                                    
//                                                             //gửi vị trí cập nhật vòng 2                                                            
//                                                             io.emit('R_POSITION_CHANGE',
//                              {                                     
//                                      idUnitInLocations: parseFloat(idUnitInLocations),
//                                      UserName: rows[0].UserName, 
//                                      PositionClick: newLocation,
//                                      UnitOrder: rows[0].UnitOrder,
//                                  }); 
//                                                         }
//                                                     }
//                                                 })
//                                             }
//                                         }
//                                     })      
//                                 }else
//                                 {                                                       
//                                     var X = parseFloat(arrs[0]), 
//                                     Y =parseFloat(arrs[1]), N=3;
//                                     X = X - N;
//                                     Y = Y + N;
//                                     var TopLeft= X+","+Y;
//                                     arrayS2.push(TopLeft);
//                                     for (var i = 0; i < (N*2); i++)
//                                     {
//                                         X +=1;
//                                         arrayS2.push(X+","+Y);
//                                     }
//                                     for (var k = 0; k < (N*2+1); k++)
//                                     {
//                                         var arr = arrayS2[k].split(",");
//                                         for (var i = 1; i < (N*2+1); i++)
//                                         {
//                                             var v =parseFloat(arr[1])-i;
//                                             if(arrayS1.indexOf(arr[0]+","+v) > -1||arrayS.indexOf(arr[0]+","+v) > -1) 
//                                             {                               
//                                             }else
//                                             {                               
//                                                 arrayS2.push(arr[0]+","+v);         
//                                             }   
//                                         }                       
//                                     }
//                                     for (var i = 0; i < arrayS2.length; i++) 
//                                     {
//                                         if (parseFloat((lodash.filter(arraycheckUserc, x => x.Position === arrayS2[i])).length+lodash.filter(arrayAllCheckTimec, x => x.PositionClick === arrayS2[i]).length)<=0)
//                                         {
//                                             arrayRandom.push(arrayS2[i]);
//                                         }
//                                     }                                                                                   
//                                     if (arrayRandom.length>0) 
//                                     {                                                       
//                                         newLocation=arrayRandom[functions.getRandomIntInclusive(0,parseFloat(arrayRandom.length)-1)];                                                                       
//                                         arrayAllCheckTimec[j].PositionClick = newLocation;
//                                         arrA =  newLocation.split(",");
//                                         arrC =  arrayAllCheckTimec[j].Position.split(",");                                   
//                                         var time=sqrt( math.square(parseFloat(arrC[0])-parseFloat(arrA[0])) + math.square(parseFloat(arrC[1])-parseFloat(arrA[1])))/parseFloat(arrayAllCheckTimec[j].MoveSpeedEach);
//                                         time=0;                                     

//                                         //var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,timeMove = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),currentTime,arrayAllCheckTimec[j].idUnitInLocations],function(error, result, field)
//                                         var query = pool.query('UPDATE unitinlocations SET PositionClick = ?,TimeMoveComplete = ?,TimeMoveTotalComplete = ?,TimeMoveComplete = ?,TimeCheck = ?, timeClick = ?, CheckLog = 0  WHERE idUnitInLocations = ?', [newLocation,time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),time,Number((parseFloat(time)+parseFloat(currentTime)).toFixed(0)),currentTime,arrayAllCheckTimec[j].idUnitInLocations],function(error, result, field)
//                                         {
//                                             if(!!error){DetailError = ('Move: Error in the query 26');

//                        functions.writeLogErrror(DetailError);  
//                                             }else
//                                             {
//                                                 if (result.affectedRows> 0) {                                                           
//                                                     var query = pool.query("SELECT idUnitInLocations,UserName,PositionClick,UnitOrder FROM `unitinlocations` WHERE idUnitInLocations = '"+parseFloat(idUnitInLocations)+"'",function(error, rows,field)
//                                                     {
//                                                         if (!!error){DetailError = ('Move: Error in the query 27');

//                              functions.writeLogErrror(DetailError);  
//                                                         }else
//                                                         {
//                                                             if (rows.length >0)
//                                                             {               
//                                                              console.log("=============Thuc hien thay doi vi tri danh cron circle 3");                                                                                                                      
//                                                                 //gửi vị trí cập nhật vòng 3                                                                 

//                                                                 io.emit('R_POSITION_CHANGE',
//                                {                                       
//                                        idUnitInLocations: parseFloat(idUnitInLocations),
//                                        UserName: rows[0].UserName, 
//                                        PositionClick: newLocation,
//                                        UnitOrder: rows[0].UnitOrder,
//                                    });                                                                                  
//                                                             }
//                                                         }
//                                                     })
//                                                 }
//                                             }
//                                         })  
//                                     }
//                                 }
//                             }       
//                         }
//                     }
//                 }
//             });
//         }
//     })
// }