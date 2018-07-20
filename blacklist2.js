'use strict';
var pool = require('./db');
var lodash = require('lodash');
var cron = require('node-cron');
var functions = require("./functions");
var d, createPositionTimelast, currentSENDBLACKLIST = [], currentSENDREMOVEBLACKLIST = [], currentBLACKLISTS = [], DetailError;


module.exports = {
    start: function (io) {
        io.on('connection', function (socket) {
            //blacklist
            socket.on('S_BLACK_LIST', function (data) {
                currentSENDBLACKLIST = getcurrentBLACKLIST(data);
                console.log("data receive S_BLACK_LIST========================: " + currentSENDBLACKLIST.UserName + "_"
                    + currentSENDBLACKLIST.WithUserName);
                pool.getConnection(function (err, connection) {
                    var arrayAllGuildMember = [];
                    d = new Date();
                    createPositionTimelast = Math.floor(d.getTime() / 1000);
                    connection.query("INSERT INTO `blacklist`(`idBlackList`, `UserName`, `WithUserName`, `TimeCreate`, `Detail`) VALUES ('" + "" + "','"
                        + currentSENDBLACKLIST.UserName + "','" + currentSENDBLACKLIST.WithUserName + "','" + parseFloat(createPositionTimelast) + "','" + '' + "')", function (error, result, field) {
                            if (!!err) {
                                DetailError = ('blacklist: Error in the query 1');
                                console.log(DetailError);
                                functions.writeLogErrror(DetailError);
                            } else {
                                if (result.affectedRows > 0) {
                                    var GameServer = require("./login2");
                                    var gameServer = new GameServer();
                                    exports.gameServer = gameServer;
                                    if ((lodash.filter(gameServer.clients, x => x.name === currentSENDBLACKLIST.WithUserName)).length > 0) {
                                        console.log("Gui cho MemberName" + "_" + currentSENDBLACKLIST.WithUserName + "_" + gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDBLACKLIST.WithUserName)].idSocket);
                                        socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDBLACKLIST.WithUserName)].idSocket).emit('RECEIVEBLOCKEDBYUSER',
                                            {
                                                UserName: currentSENDBLACKLIST.UserName,
                                            });
                                        connection.release();
                                    }
                                }
                            }
                        });

                });
            });

            //remove blacklist
            socket.on('S_REMOVE_BLACK_LIST', function (data) {
                currentSENDREMOVEBLACKLIST = getcurrentBLACKLIST(data);
                console.log("data receive S_REMOVE_BLACK_LIST========================: " + currentSENDREMOVEBLACKLIST.UserName + "_"
                    + currentSENDREMOVEBLACKLIST.WithUserName);

                pool.getConnection(function (err, connection) {
                    connection.query("DELETE FROM `blacklist` WHERE UserName ='" + currentSENDREMOVEBLACKLIST.UserName
                        + "'AND WithUserName ='" + currentSENDREMOVEBLACKLIST.WithUserName + "'", function (error, result, field) {
                            if (!!error) {
                                DetailError = ('blacklist: Error in the query 2');
                                console.log(DetailError);
                                functions.writeLogErrror(DetailError);
                            } else {
                                if (result.affectedRows > 0) {
                                    var GameServer = require("./login2");
                                    var gameServer = new GameServer();
                                    exports.gameServer = gameServer;
                                    if ((lodash.filter(gameServer.clients, x => x.name === currentSENDREMOVEBLACKLIST.WithUserName)).length > 0) {
                                        console.log("Gui cho MemberName" + "_" + currentSENDREMOVEBLACKLIST.WithUserName + "_" + gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDREMOVEBLACKLIST.WithUserName)].idSocket);
                                        socket.broadcast.to(gameServer.clients[gameServer.clients.findIndex(item => item.name === currentSENDREMOVEBLACKLIST.WithUserName)].idSocket).emit('R_DISABLE_BLOCKED_BY_USER',
                                            {
                                                UserName: currentSENDREMOVEBLACKLIST.UserName,
                                            });
                                        connection.release();
                                    }
                                }
                            }

                        });
                });
            });

        });
    }
}
function getcurrentBLACKLIST(data) {
    return currentBLACKLISTS =
        {
            UserName: data.UserName,
            WithUserName: data.WithUserName,
        }
}