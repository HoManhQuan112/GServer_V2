'use strict';
var database 			= require('./../Util/db.js');
var functions           = require('./../Util/functions.js');

var lodash		    = require('lodash');
var datetime 		= require('node-datetime');
var cron 			= require('node-cron');

var DetailError;
var currentSENDREQUESTENTERTOGUILD = [], currentSENDREQUESTETOCREATEGUILD = [], currentSENDCHANGERESOURCEDIAMONDGUILD = [], currentSENDREMOVEMEMBERINGUILD = []
,currentSENDPOLICYOFGUILD = [], currentSENDACCEPTINVITEWITHGUILD = [], currentSENDTRANSFERRESOURCEDOFGUILDTOUSER = [], currentSENDMEMBEROOUTGUILD = []
,currentSENDREQUESTENTERTOGUILDBYUSER = [] , d,createPositionTimelast ,arrayResponseInviteByGuild =[],currentSENDINFOGUILD = []
,currentSENDREJECTINVITEWITHGUILD = [], currentSENDCHANGERESOURCEGUILD = [], arrayLeader =[], currentSENDREJECTINVITEWITHGUILDBYLEADER = [],currentSENDACCEPTJOINGUILDBYLEADER = [],SENDUPGUILD,currentSENDDOWNMEMBERINGUILD = [],currentSENDUPMEMBERINGUILD =[],arraySendUpMember =[]
,arrayResponseAcceptJoinGuildByLeader =[],arrayALLLeader =[],arrayPolicyChange = [],arrayGuildDonate = [],arrayGuildNotify =[], currentSENDUPGUILD =[],
currentSENDREJECTJOINGUILDBYLEADER = [],currentSENDRESOURCEDONATE = [], arrayDonateofGuild =[], arrayDonateComplete=[],arrayAllMemberGuilds=[], arrayPolicy = []
, arrayAllMemberGuild = [];

exports.updateLoginUser = function updateLoginUser (currentUser,currentTime) {
	database.query("SELECT `Status` FROM `guildlistmember` WHERE `MemberName`='"+currentUser.name+"'",function (error,rows) {
		if (!!error){DetailError =('guildManager :Error SELECT updateLoginUser ');functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			database.query("UPDATE guildlistmember SET Status = 1 WHERE MemberName = '"+currentUser.name+"'",function(error){
				if(!!error){DetailError =('guildManager :Error UPDATE guildlistmember '+currentUser.name);	functions.writeLogErrror(DetailError);}
			});
		}
	});
}
exports.getarrayAllGuildList = function getarrayAllGuildList (arrayAllGuildList) {
	database.query("SELECT * FROM `guildlist`",function(error,rows){
		if (!!error){DetailError =('guildManager :Error SELECT getarrayAllGuildList ');functions.writeLogErrror(DetailError);}
		arrayAllGuildList(rows);
	});
}

exports.getarrayAllresourceupguild = function getarrayAllresourceupguild(arrayAllresourceupguild){
	database.query("SELECT * FROM `resourceupguild`",function (error,rows) {
		if (!!error){DetailError =('guildManager :Error SELECT getarrayAllResourceUpguild ');functions.writeLogErrror(DetailError);}
		arrayAllresourceupguild(rows);
	});
}

exports.getarrayAllRequestJoinGuildByUser=function getarrayAllRequestJoinGuildByUser (currentUser,arrayAllRequestJoinGuildByUser) {
	database.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`!='' AND MemberName = '"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error SELECT getarrayAllRequestJoinGuildByUser '+currentUser.name);functions.writeLogErrror(DetailError);}
		arrayAllRequestJoinGuildByUser(rows);
	});
	
}

exports.getTimeCancelGuild = function getTimeCancelGuild (currentUser,arrayMessGuildMember) {
	database.query("SELECT `GuildName`,`TimeCancelGuild` FROM `users` WHERE `UserName`='"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error SELECT getTimeCancelGuild '+currentUser.name);functions.writeLogErrror(DetailError);}
		getarrayMessGuildMember (rows[0],arrayMessGuildMember);
	});
}
function getarrayMessGuildMember (data,arrayMessGuildMember) {
	database.query("SELECT * FROM `chatting` WHERE `GuildName`='"+data.GuildName+"' AND `ServerTime` >= '"+parseFloat(data.TimeCancelGuild)+"' ",function(error, rows){
		if (!!error){DetailError =('guildManager :Error SELECT getarrayMessGuildMember '+currentUser.name);functions.writeLogErrror(DetailError);}		
		if (rows.length>0) {arrayMessGuildMember(rows);}else{arrayMessGuildMember(0)};
	});
}
//
exports.updateTimeGuildInvite = function updateTimeGuildInvite (currentUser,currentTime,arrayRequestJoinGuild) {
	database.query("SELECT * FROM `guildlistmember` WHERE MemberName = ?",[currentUser.name],function(error, rows){
		if (!!error){DetailError =('guildManager :Error SELECT updateTimeGuildInvite '+currentUser.name);functions.writeLogErrror(DetailError);}		
		if (rows.length>0) {

			var TimeRemain = 0;
			if (parseFloat(rows[0].TimeComplete) >parseFloat(currentTime)) {
				TimeRemain = (parseFloat(rows[0].TimeComplete)-parseFloat(currentTime));
				updateTimeRemain (TimeRemain,currentUser,arrayRequestJoinGuild);
			}else{
				getRequestJoinGuild (currentUser,arrayRequestJoinGuild);
			}			
			
		}else{
			arrayRequestJoinGuild(0);
		}
	});
	
}
function getRequestJoinGuild (currentUser,arrayRequestJoinGuild) {
	database.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error getRequestJoinGuild '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {arrayRequestJoinGuild(rows);}else{arrayRequestJoinGuild(0);}
	});

}
function updateTimeRemain (TimeRemain,currentUser,arrayRequestJoinGuild) {
	database.query("UPDATE guildlistmember SET TimeRemain = '"+ parseFloat(TimeRemain)+"' WHERE MemberName = ?",currentUser.name,function(error){
		if (!!error){DetailError =('guildManager :Error updateTimeRemain '+currentUser.name);functions.writeLogErrror(DetailError);}
		getRequestJoinGuild (currentUser,arrayRequestJoinGuild);		
	});
	
}
//
exports.getArrayRequestJoinGuild = function getArrayRequestJoinGuild (currentUser,socket,redisDatas,arrayRequestJoinGuild,getarrayAllInviteByGuild,getarrayPolicy,arrayAllMemberGuild) {
	var currentTime = Math.floor(new Date().getTime() / 1000);
	database.query("SELECT * FROM `guildlistmember` WHERE `InviteByUser`='' AND `MemberName` = '"+currentUser.name+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error SELECT getArrayRequestJoinGuild '+currentUser.name);functions.writeLogErrror(DetailError);}		
		if (rows.length>0) {
			if (rows[0].ActiveStatus===1||rows[0].ActiveStatus===2) {
				updateGuildListMember(currentUser,rows[0],socket,redisDatas,getarrayAllInviteByGuild,getarrayPolicy,arrayAllMemberGuild);	
				arrayRequestJoinGuild(rows);	
			}else if ((parseFloat(currentTime)>=parseFloat(rows[0].TimeReset))&&(rows[0].ActiveStatus===0)) {
				deleteInvite (currentUser,arrayRequestJoinGuild);
			}else{
				arrayRequestJoinGuild(rows);
			}			
		}else{
			arrayRequestJoinGuild(0);
			getarrayAllInviteByGuild(0);
			getarrayPolicy(0);
			arrayAllMemberGuild(0);
		}
	});	
}

function deleteInvite (currentUser,arrayRequestJoinGuild) {
	database.query("DELETE FROM guildlistmember WHERE `InviteByUser`='' AND MemberName = '"+currentUser.name+"'",function(error, result){
		if (!!error){DetailError =('guildManager :Error SELECT getArrayRequestJoinGuild '+currentUser.name);functions.writeLogErrror(DetailError);}
		if (result.affectedRows>0){arrayRequestJoinGuild("");}
	});


}
function updateGuildListMember (currentUser,dataGuild,socket,redisDatas,getarrayAllInviteByGuild,getarrayPolicy,arrayAllMemberGuild) {
	database.query("UPDATE guildlistmember SET Status = 1, TimeDetail = '"+datetime.create().format('d-m-Y H:M:S')+" "
		+ new Date().toString().slice(25, 33)+"' WHERE MemberName = '"+currentUser.name
		+"'AND GuildName = '"+dataGuild.GuildName+"'",function(error,result){
			if (!!error){DetailError =('guildManager :Error updateGuildListMember '+dataGuild.GuildName);functions.writeLogErrror(DetailError);}
			if (result.affectedRows>0) {
				getArrayAllInviteByGuild (dataGuild,getarrayAllInviteByGuild);
				getArrayPolicy (dataGuild,getarrayPolicy);
				R_STATUS (dataGuild,currentUser,socket,redisDatas,arrayAllMemberGuild);

			}
		});	
}
function R_STATUS (dataGuild,currentUser,socket,redisDatas,arrayAllMemberGuild) {
	database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+dataGuild.GuildName+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error getOnlineMember '+dataGuild.GuildName);functions.writeLogErrror(DetailError);}
		if (rows.length>0) {
			arrayAllMemberGuild(rows);
		}else{
			arrayAllMemberGuild(0);
		}
		for (var i = 0; i < rows.length; i++) {
			if ((lodash.filter(redisDatas, x => x.name === rows[i].MemberName)).length >0) 
			{	

				// io.in(redisDatas[redisDatas.findIndex(item => item.name === rows[i].MemberName)].idSocket).emit('R_STATUS',
				// {
				// 	Status : 1,
				// 	TimeDetail : datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
				// 	UserName : currentUser.name,																																							
				// });	//need check
				socket.in(redisDatas[redisDatas.findIndex(item => item.name === rows[i].MemberName)].idSocket).emit('R_STATUS',
				{
					Status : 1,
					TimeDetail : datetime.create().format('d-m-Y H:M:S')+" "+ new Date().toString().slice(25, 33),	
					UserName : currentUser.name,																																							
				});																  													  															  								                	
			}
		}
	});
}

function getArrayAllInviteByGuild (dataGuild,getarrayAllInviteByGuild) {
	database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND GuildName = '"+dataGuild.GuildName+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error getArrayAllInviteByGuild ');functions.writeLogErrror(DetailError);}
		getarrayAllInviteByGuild(rows);
	});
}
function getArrayPolicy (dataGuild,getarrayPolicy) {
	database.query("SELECT * FROM `policys` where GuildName='"+dataGuild.GuildName+"'",function(error, rows){
		if (!!error){DetailError =('guildManager :Error getArrayPolicy ');functions.writeLogErrror(DetailError);}
		getarrayPolicy(rows);
	});
}
//
function SendUpgrateDonateGuild(GuildName,io)
{
	var query = database.query("SELECT Farm, Wood, Stone, Metal FROM `guildlist` WHERE GuildName = '"+GuildName+"'",function(error, rows)
	{												
		if (!!error){DetailError = ('guildmanager: Error in query 83');
		console.log(DetailError);
		functions.writeLogErrror(DetailError);	
	}else
	{
		if (rows.length>0) 
		{
			arrayDonateofGuild =rows;
			var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+GuildName+"'",function(error, rows)
			{
				if (!!error){DetailError = ('guildmanager: Error in query 84');
				console.log(DetailError);
				functions.writeLogErrror(DetailError);	
			}else
			{
				if (rows.length>0) 
				{
					arrayAllMemberGuilds = rows;																	
					var GameServer = require("./../Login/Login/login.js");
					var gameServer = new GameServer();
					exports.gameServer = gameServer;
					for (var k = 0; k < arrayAllMemberGuilds.length; k++) 
					{
						if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllMemberGuilds[k].MemberName)).length >0) 
						{	
							io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllMemberGuilds[k].MemberName)].idSocket).emit('R_DONATE_COMPLETE',
							{
								arrayCompleteDonate:arrayDonateofGuild,
							});							                														  									  								                	
						}	
					}													
				}
			}
		});
		}
	}
});
}

function TransferUpdate(NameResourceFrom,QualityResourceFrom,NameResourceTo,PercentChange,DiamondUse,GuildName)
{
	var query = database.query("UPDATE guildlist SET "+NameResourceFrom+" = "+NameResourceFrom+" - '"+parseFloat(QualityResourceFrom)
		+"',"+NameResourceTo+" = "+NameResourceTo+" +'"+parseFloat(PercentChange)
		+"',Diamond = Diamond -'"+parseFloat(DiamondUse)
		+"'  where GuildName = '"+GuildName+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('guildmanager: Error in query 85');}
			console.log(DetailError);
			functions.writeLogErrror(DetailError);	
			if (result.affectedRows>0) 
			{
				console.log("Transfer thanh cong: "+NameResourceFrom+"=>"
					+NameResourceTo);
			}
		});
}


function UpdateResourceToDiamond(Quality,NameResourceFrom,GuildName,io)
{
	var query = database.query("UPDATE guildlist SET "+NameResourceFrom+" = "+NameResourceFrom+" - '"+parseFloat(Quality)														
		+"',Diamond = Diamond + 1,numberResourceToDiamon =numberResourceToDiamon+1 where GuildName = '"+GuildName+"'",function(error, result, field)
		{
			if(!!error){DetailError = ('guildmanager: Error in query 86');
			console.log(DetailError);
			functions.writeLogErrror(DetailError);	
		}else
		{
			if (result.affectedRows>0) 
			{																	
				var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+GuildName+"'",function(error, rows)
				{
					if (!!error){DetailError = ('guildmanager: Error in query 87');
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{
					if (rows.length>0) 
					{
						arrayGuildNotify = rows;
						var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+GuildName+"'",function(error, rows)
						{
							if (!!error){DetailError = ('guildmanager: Error in query 88');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (rows.length>0) 
							{
								var GameServer = require("./../Login/Login/login.js");
								var gameServer = new GameServer();
								exports.gameServer = gameServer;																
								for (var i = 0; i < arrayGuildNotify.length; i++) 
								{								  			
									if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
									{	
										io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_RESOURCE_CHANGE_DIAMOND',
										{
											arrayResourceChange:rows[0],																																																																												
										});																					                	 										  													  															  								                	
									}													  							  			
								}								  		
							}
						}
					});													 
					}
				}
			})									
			}
		}
	});
}
function getcurrentSENDINFOGUILD(data)
{
	return currentSENDINFOGUILD =
	{
		UserName:data.UserName,		
		GuildName:data.GuildName,															
	}
}

function getcurrentSENDREQUESTENTERTOGUILDBYUSER(data)
{
	return currentSENDREQUESTENTERTOGUILDBYUSER =
	{
		UserName:data.UserName,		
		GuildName:data.GuildName,
		InviteByUser:data.InviteByUser,															
	}
}


function getcurrentSENDACCEPTJOINGUILDBYLEADER(data)
{
	return currentSENDACCEPTJOINGUILDBYLEADER =
	{
		UserName:data.UserName,		
		GuildName:data.GuildName,	
		LeaderAccept: data.LeaderAccept,														
	}
}

function getcurrentSENDREJECTJOINGUILDBYLEADER(data)
{
	return currentSENDREJECTJOINGUILDBYLEADER =
	{
		UserName:data.UserName,		
		GuildName:data.GuildName,
		LeaderReject: data.LeaderReject,															
	}
}

function getcurrentSENDPOLICYOFGUILD(data)
{
	return currentSENDPOLICYOFGUILD =
	{							
		GuildName : data.GuildName,
		LeaderName : data.LeaderName,	
		Details : data.Details,
	}
}

function getcurrentSENDRESOURCEDONATE(data)
{
	return currentSENDRESOURCEDONATE =
	{							
		GuildName : data.GuildName,
		UserName : data.UserName,
		GuildLevel : data.GuildLevel,
		numberBase: data.numberBase,	
		Diamond : data.Diamond,					
		DiamondQuality : data.DiamondQuality,
		Farm : data.Farm,														
		FarmQuality : data.FarmQuality,
		Wood : data.Wood,									
		WoodQuality : data.WoodQuality,
		Stone : data.Stone,									
		StoneQuality : data.StoneQuality,
		Metal : data.Metal,														
		MetalQuality : data.MetalQuality,
	}
}

function getcurrentSENDUPGUILD(data)
{
	return currentSENDUPGUILD =
	{							
		GuildName : data.GuildName,					
	}
}



function getcurrentSENDCHANGERESOURCEGUILD(data)
{
	return currentSENDCHANGERESOURCEGUILD =
	{							
		GuildName : data.GuildName,
		UserName : data.UserName,
		NameResourceFrom: data.NameResourceFrom,
		QualityResourceFrom: data.QualityResourceFrom,
		NameResourceTo: data.NameResourceTo,					
		DiamondUse: data.DiamondUse, 
	}
}

function getcurrentSENDCHANGERESOURCEDIAMONDGUILD(data)
{
	return currentSENDCHANGERESOURCEDIAMONDGUILD =
	{							
		GuildName : data.GuildName,					
		NameResourceFrom: data.NameResourceFrom,					
	}
}

function getcurrentSENDTRANSFERRESOURCEDOFGUILDTOUSER(data)
{
	return currentSENDTRANSFERRESOURCEDOFGUILDTOUSER =
	{							
		GuildName : data.GuildName,					
		UserName: data.UserName,
		idBase: data.idBase,	
		Farm: data.Farm,
		Wood: data.Wood,
		Stone: data.Stone,
		Metal: data.Metal,				
	}
}


exports.start = function start (io) {
	io.on('connection', function(socket) 
	{
        	//user gửi request tham gia guild
        	socket.on('S_REQUEST_ENTER_TO_GUILD', function (data)
        	{
        		currentSENDREQUESTENTERTOGUILD = getcurrentSENDINFOGUILD(data);
        		console.log("data receive S_REQUEST_ENTER_TO_GUILD ============: "+ currentSENDREQUESTENTERTOGUILD.UserName+"_"
        			+ currentSENDREQUESTENTERTOGUILD.GuildName);					

        		database.getConnection(function(err,connection)
        		{				
        			connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName
        				+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILD.UserName+"'",function(error, rows)
        				{
        					if (!!error)
        					{											
        						DetailError = ("guildmanager: Error in query 1");
        						console.log(DetailError);
        						functions.writeLogErrror(DetailError);	
        					}else
        					{											
        						if (rows.length > 0) 
        						{															
        							connection.release();
        							DetailError = ("login: GuildName đã tồn tại user");
        							console.log(DetailError);
        							functions.writeLogErrror(DetailError);	
        						}else
        						{
        							connection.query("SELECT GuildName FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName
        								+"'UNION ALL SELECT timeLogin FROM `users` WHERE `UserName` = '"+currentSENDREQUESTENTERTOGUILD.UserName+"'",function(error, rows)
        								{
        									if (!!error)
        									{	
        										DetailError = ("guildmanager: Error in query 2");
        										console.log(DetailError);
        										functions.writeLogErrror(DetailError);	
        									}else
        									{											
        										if (rows.length > 0) 
        										{
        											d = new Date();
        											createPositionTimelast = Math.floor(d.getTime() / 1000);
        											var Status = 0;
        											if (parseFloat(rows[1].GuildName) > 0) 
        											{
        												Status = 1; 					        					
        											}					        				
        											connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`,`Status`) VALUES ('"+""+"','"
        												+currentSENDREQUESTENTERTOGUILD.GuildName+"','"
        												+parseFloat(rows[0].GuildName)+"','"
        												+currentSENDREQUESTENTERTOGUILD.UserName+"','"+0+"','"
        												+(parseFloat(createPositionTimelast)+14400)+"','"
        												+0+"','"+""+"','"+"Member"+"','"+Status+"')",function(error, result, field)
        												{
        													if(!!err){DetailError = ('guildmanager: Error in query 3');
        													console.log(DetailError);
        													functions.writeLogErrror(DetailError);	
        												}else
        												{
        													if (result.affectedRows>0) 
        													{										            		
        														connection.query("SELECT MemberName FROM `guildlistmember` WHERE PositionGuild = 'Leader' AND `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName+"'",function(error, rows)
        														{
        															if (!!error){DetailError = ('guildmanager: Error in query 4');
        															console.log(DetailError);
        															functions.writeLogErrror(DetailError);	
        														}else
        														{
        															if (rows.length>0) 
        															{
        																arrayALLLeader = rows;
        																var GameServer = require("./../Login/Login/login.js");
        																var gameServer = new GameServer();
        																exports.gameServer = gameServer;
        																for (var i = 0; i < arrayALLLeader.length; i++) 
        																{															  																	  			
        																	if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayALLLeader[i].MemberName)).length >0) 
        																	{												  																	                		
        																		socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayALLLeader[i].MemberName)].idSocket).emit('R_JOIN_GUILD_TO_LEADER',
        																		{
        																			UserName:currentSENDREQUESTENTERTOGUILD.UserName,																																				
        																		});					                	
        																	}													  							  			
        																}
        																connection.release();			 
        															}
        														}
        													})
        													}
        												}
        											});
        										}
        									}
        								});								
        						}
        					}

        				});					     	
});		
}); 

        	//Leader gửi lời mời user khác tham gia guild
        	socket.on('S_REQUEST_ENTER_TO_GUILD_BY_USER', function (data)
        	{
        		currentSENDREQUESTENTERTOGUILDBYUSER = getcurrentSENDREQUESTENTERTOGUILDBYUSER(data);
        		console.log("data receive S_REQUEST_ENTER_TO_GUILD_BY_USER ============: "+ currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"_"
        			+ currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser+"_"
        			+ currentSENDREQUESTENTERTOGUILDBYUSER.GuildName);									
        		database.getConnection(function(err,connection)
        		{	
        			connection.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"' ",function(error, rows)
        			{
        				if (!!error){DetailError = ('guildmanager: Error in query 5');							
        				console.log(DetailError);
        				functions.writeLogErrror(DetailError);	
        			}else
        			{															
        				if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
        				{								
        					connection.query("SELECT idguildlist,`GuildName`,`Level` FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
        						+"' UNION ALL SELECT idguildlistmember,`GuildName`,`LevelGuild` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
        						+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
        						+"' AND `InviteByUser` !='' UNION ALL SELECT `UserName`,`UserEmail`,`timeLogin` FROM `users` WHERE `UserName` = '"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
        						+"'",function(error, rows)
        						{
        							if (!!error)
        							{	
        								DetailError = ("guildmanager: Error in query 6");
        								console.log(DetailError);
        								functions.writeLogErrror(DetailError);	
        							}else
        							{											
        								if (rows.length <= 2) 
        								{												
        									d = new Date();
        									createPositionTimelast = Math.floor(d.getTime() / 1000);					        				
        									var Status = 0;
        									if (parseFloat(rows[1].Level) > 0) 
        									{
        										Status = 1; 					        					
        									}					        				
        									connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`,`Status`) VALUES ('"+""+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
        										+"','"+parseFloat(rows[0].Level)+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"','"+0+"','"
        										+(parseFloat(createPositionTimelast)+14400)
        										+"','"+0
        										+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser
        										+"','"+"Member"+"','"+Status+"')",function(error, result, field)
        										{
        											if(!!err){DetailError = ('guildmanager: Error in query 7');
        											console.log(DetailError);
        											functions.writeLogErrror(DetailError);	
        										}else
        										{
        											if (result.affectedRows>0) 
        											{			

									            		//gui chi tiết lời mời lên cho các leader khác đang online và user được mời
									            		connection.query("SELECT MemberName,PositionGuild FROM `guildlistmember` WHERE (MemberName ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
									            			+"' OR PositionGuild = 'Leader' OR PositionGuild='CoLeader') AND GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"'",function(error, rows)
									            			{
									            				if (!!error){DetailError = ('guildmanager: Error in query 8');
									            				console.log(DetailError);
									            				functions.writeLogErrror(DetailError);	
									            			}else
									            			{
									            				if (rows.length>0) 
									            				{																	
									            					arrayResponseInviteByGuild = rows;
									            					var GameServer = require("./../Login/Login/login.js");
									            					var gameServer = new GameServer();
									            					exports.gameServer = gameServer;
									            					for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
									            					{															  			
									            						if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
									            						{															  				
									            							if (arrayResponseInviteByGuild[i].PositionGuild === 'Member') 
									            							{									  												
									            								io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_MEMBER',
									            								{																			
									            									GuildName:currentSENDREQUESTENTERTOGUILDBYUSER.GuildName,																	
									            								});
									            							}else
									            							{															                		
									            								io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_LEADER',
									            								{
									            									UserName:currentSENDREQUESTENTERTOGUILDBYUSER.UserName,																		
									            									InviteByUser:currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser,
									            								});
									            							}				                	
									            						}													  							  			
									            					}
									            					connection.release();			 
									            				}
									            			}
									            		})
									            	}
									            }
									        });
        								}
        							}
        						});	
}
}
});											     	
});		
});  

			//Gửi request tạo guild
			socket.on('S_REQUEST_TO_CREATE_GUILD', function (data)
			{
				currentSENDREQUESTETOCREATEGUILD = getcurrentSENDINFOGUILD(data); 
				console.log("data receive S_REQUEST_TO_CREATE_GUILD============: "+ currentSENDREQUESTETOCREATEGUILD.UserName+"_"
					+ currentSENDREQUESTETOCREATEGUILD.GuildName);
				database.getConnection(function(err,connection)
				{				
					connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE  ActiveStatus = 1 AND (`MemberName` ='"+currentSENDREQUESTETOCREATEGUILD.UserName
						+"' OR `GuildName` ='"+currentSENDREQUESTETOCREATEGUILD.GuildName+"')",function(error, rows)
						{
							if (!!error)
							{
								DetailError = ("guildmanager: Error in query 9");
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{											
								if (rows.length > 0) 
								{								
									socket.emit('R_REQUEST_TO_CREATE_GUILD', 
									{
										message : 0,
									});
									connection.release();								
								}else
								{	
									connection.query("SELECT A.Diamond,C.MaxStorage, C.Diamond as Diamondconsumption FROM users AS A INNER JOIN resourceupguild AS C ON C.Level =0 AND A.UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, rows)
									{
										if (!!error)
										{
											DetailError = ("guildmanager: Error in query 10");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{											
											if (rows.length > 0) 
											{
												d = new Date();
												createPositionTimelast = Math.floor(d.getTime() / 1000);
												connection.query("INSERT INTO `guildlist`(`idGuildList`, `GuildName`, `LeaderName`, `Level`,`MaxStorage`, `Diamond`, `Quality`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"',0,'"+rows[0].MaxStorage+"',0,1)",function(error, result, field)
												{
													if(!!error){DetailError = ('guildmanager: Error in query 11');
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (result.affectedRows > 0) 
													{										            										            		
														connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`, `InviteByUser`, `PositionGuild`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"',0,'"+currentSENDREQUESTETOCREATEGUILD.UserName+"',1,0,0,'','Leader')",function(error, result, field)
														{
															if(!!error){DetailError = ('guildmanager: Error in query 12');
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}else
														{
															if (result.affectedRows > 0) 
															{													            		
																socket.emit('R_REQUEST_ENTER_TO_GUILD', 
																{
																	Diamond : (parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))
																});
																connection.query("UPDATE users SET GuildName = '"+currentSENDREQUESTETOCREATEGUILD.GuildName
																	+"',Diamond = Diamond - '"+parseFloat(rows[0].Diamondconsumption)
																	+"' WHERE UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, result, field)
																	{
																		if(!!error){DetailError = ('guildmanager: Error in query 13');
																		console.log(DetailError);
																		functions.writeLogErrror(DetailError);	
																	}else
																	{
																		if (result.affectedRows>0) 
																		{																				
																			io.emit('R_USER_CREATE_GUILD',{
																				UserName:currentSENDREQUESTETOCREATEGUILD.UserName,		
																				GuildName:currentSENDREQUESTETOCREATEGUILD.GuildName,
																			});	
														                    	 //insert policy
														                    	 connection.query("INSERT INTO `policys`(`idPolicys`, `GuildName`, `LeaderName`, `Details`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"','')",function(error, result, field)
														                    	 {
														                    	 	if(!!error) {DetailError = ('guildmanager: Error in query 14');
														                    	 	console.log(DetailError);
														                    	 	functions.writeLogErrror(DetailError);	
														                    	 }																		            
														                    	 else{connection.release();}
														                    	});
														                    	}
														                    }
														                });
															}
														}
													});

													}
												}
											});									       
											}
										}
									});	
								}
							}
						});					     	
});	
});   

			//User được mời chấp nhận vào vào guild
			socket.on('S_ACCEPT_INVITE_WITH_GUILD', function (data)
			{
				currentSENDACCEPTINVITEWITHGUILD = getcurrentSENDINFOGUILD(data);
				console.log("data receive S_ACCEPT_INVITE_WITH_GUILD============: "+ currentSENDACCEPTINVITEWITHGUILD.UserName+"_"
					+ currentSENDACCEPTINVITEWITHGUILD.GuildName);
				var query = database.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"' ",function(error, rows)
				{
					if (!!error){DetailError = ('guildmanager: Error in query 15');							
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{											
					if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
					{
						var query = database.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTINVITEWITHGUILD.GuildName)	                			
							+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.InviteByUser != '' AND guildlistmember.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName
							+"'AND guildlistmember.ActiveStatus = 0 AND guildlistmember.MemberName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"'",function(error, result, field)
							{
								if(!!error){DetailError = ('Eguildmanager: Error in query 16');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (result.affectedRows>0) 
								{		
										//dữ liệu của toàn bộ thành viên guild
										var query = database.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 17');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length >0) 
											{
												arrayAllMemberGuild = rows;
													//dữ liệu policy
													var query = database.query("SELECT * FROM `policys` where GuildName='"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
													{
														if (!!error){DetailError = ('guildmanager: Error in query 18');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (rows.length >0) 
														{
															arrayPolicy = rows;
															var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
															{
																if (!!error){DetailError = ('guildmanager: Error in query 19');
																console.log(DetailError);
																functions.writeLogErrror(DetailError);	
															}else
															{
																if (rows.length>0) 
																{														
																	arrayResponseInviteByGuild = rows;
																	var GameServer = require("./../Login/Login/login.js");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;
																	for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
																	{											  			
																		if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
																		{
																			if (arrayResponseInviteByGuild[i].MemberName===currentSENDACCEPTINVITEWITHGUILD.UserName) 
																			{										  																  					
																				socket.emit(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_NEW_MEMBER',
																				{																				
																					arrayResponseInviteByGuild:arrayResponseInviteByGuild,	
																					Details: arrayPolicy[0].Details,
																					arrayAllMemberGuild:arrayAllMemberGuild,																
																				});
																			}else
																			{
																				socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_ALL_MEMBER',
																				{
																					UserName:(arrayResponseInviteByGuild[arrayResponseInviteByGuild.findIndex(item => item.MemberName === currentSENDACCEPTINVITEWITHGUILD.UserName)]),																		
																				});
																			}									  															  								                	
																		}													  							  			
																	}			 
																}
															}
														})
														}

													}
												});	
												}															
											}
										})		


										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
										var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 20');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												io.emit('R_INFOMATION_GUILD',{
													GuildName : rows,
												});
											}
										}
									});											
									}
								}
							});
}
}
});	
}); 

			//hủy lời mời tham gia guild bởi user    
			socket.on('S_REJECT_INVITE_WITH_GUILD', function (data)
			{
				currentSENDREJECTINVITEWITHGUILD = getcurrentSENDINFOGUILD(data);
				console.log("data receive S_REJECT_INVITE_WITH_GUILD============: "+ currentSENDREJECTINVITEWITHGUILD.UserName+"_"
					+ currentSENDREJECTINVITEWITHGUILD.GuildName);					

				database.getConnection(function(err,connection)
				{				
					connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILD.GuildName
						+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILD.UserName+"'",function(error, result, field)
						{
							if(!!error){DetailError = ('guildmanager: Error in query 21');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (result.affectedRows>0) 
							{								
								connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDREJECTINVITEWITHGUILD.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 22');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length>0) 
									{
										arrayLeader = rows;
										var GameServer = require("./../Login/Login/login.js");
										var gameServer = new GameServer();
										exports.gameServer = gameServer;
										for (var i = 0; i < arrayLeader.length; i++) 
										{									  			
											if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[i].MemberName)).length >0) 
											{
												socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[i].MemberName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_MEMBER',
												{
													UserName:currentSENDREJECTINVITEWITHGUILD.UserName,																		
												});									  													  															  								                
											}													  							  			
										}
										connection.release();			 
									}			
								}
							})						
							}
						}
					});				     	
				});		
			}); 

			//hủy lời mời tham gia guild bởi leader    
			socket.on('S_REJECT_INVITE_WITH_GUILD_BY_LEADER', function (data)
			{
				currentSENDREJECTINVITEWITHGUILDBYLEADER = getcurrentSENDINFOGUILD(data);
				console.log("data receive S_REJECT_INVITE_WITH_GUILD_BY_LEADER============: "+ currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"_"
					+ currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName);					

				database.getConnection(function(err,connection)
				{	
					var arrayResetJoin=[],arrayLeader=[]; 
					connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName
						+"'AND GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"'",function(error, rows)
						{
							if (!!error){DetailError = ('guildmanager: Error in query 23');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (rows.length>0) 
							{
								arrayResetJoin = rows;
								connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName
									+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"'",function(error, result, field)
									{
										if(!!error){DetailError = ('guildmanager: Error in query 24');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (result.affectedRows>0) 
										{											
											var GameServer = require("./../Login/Login/login.js");
											var gameServer = new GameServer();
											exports.gameServer = gameServer;
											if (gameServer.redisDatas.length>0) 
											{	
												//gửi client
												if ((lodash.filter(gameServer.redisDatas, x => x.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)).length >0) 
												{	
													io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_LEADER',
													{
														ExpireInviteToJoinGuild:arrayResetJoin[0],
													});							                							                	

												}	
									  			//gửi leader					  			
									  			connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
									  			{													
									  				if (!!error){DetailError = ('guildmanager: Error in query 25');
									  				console.log(DetailError);
									  				functions.writeLogErrror(DetailError);	
									  			}else
									  			{
									  				if (rows.length>0) 
									  				{
									  					arrayLeader = rows;												
									  					for (var k = 0; k < arrayLeader.length; k++) 
									  					{
									  						if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[k].MemberName)).length >0) 
									  						{	
									  							io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_LEADER',
									  							{
									  								ExpireInviteToJoinGuild:arrayResetJoin[0],
									  							});							                														  									  								                	
									  						}	
									  					}	
									  					connection.release();												
									  				}
									  			}
									  		});
									  		}						
									  	}
									  }
									});									
							}
						}
					});									     	
				});		
			});

			//Leader chấp nhận lời yêu cầu vào guild 
			socket.on('S_ACCEPT_JOIN_GUILD_BY_LEADER', function (data)
			{
				currentSENDACCEPTJOINGUILDBYLEADER = getcurrentSENDACCEPTJOINGUILDBYLEADER(data);
				console.log("data receive S_ACCEPT_JOIN_GUILD_BY_LEADER============: "+ currentSENDACCEPTJOINGUILDBYLEADER.UserName+"_"
					+ currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"_"+currentSENDACCEPTJOINGUILDBYLEADER.LeaderAccept);																
				var query = database.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTJOINGUILDBYLEADER.GuildName)	                			
					+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName
					+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.ActiveStatus = 0 AND guildlistmember.GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName
					+"'AND guildlistmember.MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"'",function(error, result, field)
					{
						if(!!error){DetailError = ('guildmanager: Error in query 26');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{
						if (result.affectedRows>0) 
							{	var query = database.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
							{
								if (!!error){DetailError = ('guildmanager: Error in query 27');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (rows.length >0) 
								{										
									arrayAllMemberGuild = rows;
										//dữ liệu policy
										var query = database.query("SELECT * FROM `policys` where GuildName='"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 28');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length >0) 
											{													
												arrayPolicy = rows;
												var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
												{
													if (!!error){DetailError = ('guildmanager: Error in query 29');
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (rows.length>0) 
													{																								
														arrayResponseAcceptJoinGuildByLeader = rows;
														var GameServer = require("./../Login/Login/login.js");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;
														for (var i = 0; i < arrayResponseAcceptJoinGuildByLeader.length; i++) 
														{
															if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)).length >0) 
															{
																if (arrayResponseAcceptJoinGuildByLeader[i].MemberName===currentSENDACCEPTJOINGUILDBYLEADER.UserName) 
																{															  													  					
																	socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_NEW_MEMBER',
																	{
																		arrayResponseAcceptJoinGuildByLeader:arrayResponseAcceptJoinGuildByLeader,	
																		Details: arrayPolicy[0].Details,
																		arrayAllMemberGuild:arrayAllMemberGuild,																	
																	});
																}else
																{
																	socket.emit(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_ALL_MEMBER',
																	{
																		UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
																	});

																	socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_ALL_MEMBER',
																	{
																		UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
																	});
																}									  															  								                	
															}													  							  			
														}			 
													}			
												}
											})
											}

										}
									});	
									}															
								}
							})									

							//Gửi thông tin cho tất cả các người chơi về gui hiện tại
							var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
							{
								if (!!error){DetailError = ('guildmanager: Error in query 30');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if (rows.length>0) 
								{
									io.emit('R_INFOMATION_GUILD',{
										GuildName : rows,
									});
								}
							}
						});
							//xóa các lời mời của guild khác và lời join
							var query = database.query("DELETE FROM guildlistmember WHERE MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"' AND ActiveStatus = 0",function(error, result, field)
							{
								if(!!error){DetailError = ('guildmanager: Error in query 31');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}
						})
						}
					}
				});				     	

});     			


			//Send Up Member
			socket.on('S_UP_MEMBER_IN_GUILD', function (data)
			{
				currentSENDUPMEMBERINGUILD = getcurrentSENDINFOGUILD(data); 
				console.log("data receive S_UP_MEMBER_IN_GUILD============: "+ currentSENDUPMEMBERINGUILD.UserName+"_"											
					+ currentSENDUPMEMBERINGUILD.GuildName);
				var arrayMemberDown = [],arrayMemberChange = [];															
				var query = database.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, rows)
				{
					if (!!error){DetailError = ('guildmanager: Error in query 32');							
					console.log(DetailError);
					functions.writeLogErrror(DetailError);	
				}else
				{											
					if (rows.length > 0)
					{
						arraySendUpMember = rows;
						if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDUPMEMBERINGUILD.UserName)].PositionGuild==="Member") 
						{
							if((lodash.filter(arraySendUpMember, x => x.PositionGuild === "CoLeader")).length<4)
							{
									//nâng cấp member lên CoLeader và thông báo cho các user khác
									var query = database.query("UPDATE guildlistmember SET PositionGuild = 'CoLeader' where GuildName = '"+
										currentSENDUPMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, result, field)
										{
											if(!!error){DetailError = ('guildmanager: Error in query 33');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (result.affectedRows>0) 
											{													
												var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
													+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, rows)
													{
														if (!!error){DetailError = ('guildmanager: Error in query 34');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (rows.length>0) 
														{
															arrayMemberChange = rows;																
															var GameServer = require("./../Login/Login/login.js");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arraySendUpMember.length; i++) 
															{														  			
																if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
																{	
																	io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_UP_MEMBER_IN_GUILD',
																	{
																		arrayMemberChange:arrayMemberChange,																		
																	});														  													  															  								                	
																}													  							  			
															}			 
														}
													}
												})
											}
										}
									});
								}
							}else
							{											
								var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
									+"' AND PositionGuild = 'Leader'",function(error, rows)
									{
										if (!!error){DetailError = ('guildmanager: Error in query 35');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (rows.length>0) 
										{
											arrayMemberDown = rows;
											var query = database.query("UPDATE guildlistmember SET PositionGuild = CASE WHEN GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
												+"' AND PositionGuild = 'Leader' THEN 'CoLeader' WHEN  GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
												+"' AND `MemberName` = '"+currentSENDUPMEMBERINGUILD.UserName
												+"' THEN 'Leader' ELSE PositionGuild END",function(error, result, field)
												{
													if(!!error){DetailError = ('guildmanager: Error in query 36');
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (result.affectedRows>0) 
													{
														var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
															+"' AND (MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"' OR MemberName = '"+arrayMemberDown[0].MemberName+"')",function(error, rows)
															{
																if (!!error){DetailError = ('guildmanager: Error in query 37');
																console.log(DetailError);
																functions.writeLogErrror(DetailError);	
															}else
															{
																if (rows.length>0) 
																{
																	arrayMemberChange = rows;
																	var GameServer = require("./../Login/Login/login.js");
																	var gameServer = new GameServer();
																	exports.gameServer = gameServer;																
																	for (var i = 0; i < arraySendUpMember.length; i++) 
																	{
																		if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
																		{	
																			io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_UP_MEMBER_IN_GUILD',
																			{
																				arrayMemberChange:arrayMemberChange,																		
																			});													  													  															  								                	
																		}													  							  			
																	}			 
																}	
															}
														})	
														//cập nhật policy
														var query = database.query("UPDATE policys SET LeaderName = '"+currentSENDUPMEMBERINGUILD.UserName+"' where GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, result, field)
														{
															if(!!error){DetailError = ('guildmanager: Error in query 38');
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}															
													});																										  	
													}
												}
											});														 
										}		
									}
								})						
							}
						}
					}
				});								
}); 

			//Send Down Member
			socket.on('S_DOWN_MEMBER_IN_GUILD', function (data)
			{
				currentSENDDOWNMEMBERINGUILD = getcurrentSENDINFOGUILD(data);
				console.log("data receive S_DOWN_MEMBER_IN_GUILD============: "+ currentSENDDOWNMEMBERINGUILD.UserName+"_"											
					+ currentSENDDOWNMEMBERINGUILD.GuildName);
				var arrayMemberDown = [],arrayMemberChange = [];												

				database.getConnection(function(err,connection)
				{	
					connection.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName+"'",function(error, rows)
					{
						if (!!error){DetailError = ('guildmanager: Error in query 39');							
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{											
						if (rows.length > 0)
						{
							arraySendUpMember = rows;
							if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDDOWNMEMBERINGUILD.UserName)].PositionGuild==="CoLeader") 
							{									
									//nâng cấp member lên CoLeader và thông báo cho các user khác
									connection.query("UPDATE guildlistmember SET PositionGuild = 'Member' where GuildName = '"+
										currentSENDDOWNMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, result, field)
										{
											if(!!error){DetailError = ('guildmanager: Error in query 40');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (result.affectedRows>0) 
											{												
												connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName
													+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, rows)
													{
														if (!!error){DetailError = ('guildmanager: Error in query 41');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (rows.length>0) 
														{
															arrayMemberChange = rows;															
															var GameServer = require("./../Login/Login/login.js");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arraySendUpMember.length; i++) 
															{
																if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
																{	
																	io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_DOWN_MEMBER_IN_GUILD',
																	{
																		arrayMemberChange:arrayMemberChange,																		
																	});													  													  															  								                	
																}													  							  			
															}
															connection.release();			 
														}
													}
												})
											}
										}
									});
								}
							}
						}
					});														     	
				});		
			});

			//Policy
			socket.on('S_POLICY_OF_GUILD', function (data)
			{				
				currentSENDPOLICYOFGUILD = getcurrentSENDPOLICYOFGUILD(data);
				console.log("data receive S_POLICY_OF_GUILD============: "+ currentSENDPOLICYOFGUILD.Details+"_"
					+ currentSENDPOLICYOFGUILD.LeaderName+"_"											
					+ currentSENDPOLICYOFGUILD.GuildName);																		
				database.getConnection(function(err,connection)
				{	
					//nâng cấp member lên CoLeader và thông báo cho các user khác
					connection.query("UPDATE policys SET Details = '"+ currentSENDPOLICYOFGUILD.Details+"' where GuildName = '"+
						currentSENDPOLICYOFGUILD.GuildName+"' AND LeaderName = '"+currentSENDPOLICYOFGUILD.LeaderName+"'",function(error, result, field)
						{
							if(!!error){DetailError = ('guildmanager: Error in query 42');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (result.affectedRows>0) 
							{
								connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDPOLICYOFGUILD.GuildName+"'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 43');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length>0) 
									{
										arrayPolicyChange = rows;
										var GameServer = require("./../Login/Login/login.js");
										var gameServer = new GameServer();
										exports.gameServer = gameServer;																
										for (var i = 0; i < arrayPolicyChange.length; i++) 
										{
											if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayPolicyChange[i].MemberName)).length >0) 
											{	
												io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayPolicyChange[i].MemberName)].idSocket).emit('R_POLICY_CHANGE',
												{
													GuildName : currentSENDPOLICYOFGUILD.GuildName,
													LeaderName : currentSENDPOLICYOFGUILD.LeaderName,	
													Details : currentSENDPOLICYOFGUILD.Details,																																
												});								  															  								                	
											}													  							  			
										}	
										connection.release();		 
									}		
								}
							})	
							}
						}
					});													     	
				});		
			});	

			//Đóng góp cho guild
			socket.on('S_RESOURCE_DONATE', function (data)
			{				
				currentSENDRESOURCEDONATE = getcurrentSENDRESOURCEDONATE(data);
				console.log("data receive S_RESOURCE_DONATE============: "+ currentSENDRESOURCEDONATE.GuildName+"_"
					+ currentSENDRESOURCEDONATE.UserName+"_"
					+ currentSENDRESOURCEDONATE.Diamond+"_"
					+ currentSENDRESOURCEDONATE.numberBase+"_"
					+ currentSENDRESOURCEDONATE.DiamondQuality+"_"
					+ currentSENDRESOURCEDONATE.Farm+"_"
					+ currentSENDRESOURCEDONATE.FarmQuality+"_"
					+ currentSENDRESOURCEDONATE.Wood+"_"
					+ currentSENDRESOURCEDONATE.WoodQuality+"_"
					+ currentSENDRESOURCEDONATE.Stone+"_"
					+ currentSENDRESOURCEDONATE.StoneQuality+"_"
					+ currentSENDRESOURCEDONATE.Metal+"_"
					+ currentSENDRESOURCEDONATE.MetalQuality);																		
				database.getConnection(function(err,connection)
				{	
					var arrayDiamondGuild = [];
					//Lấy diamond
					connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal, C.TimeTransport FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourceupguild AS C ON C.Level = '"+
						currentSENDRESOURCEDONATE.GuildLevel+"' WHERE A.UserName = '"+currentSENDRESOURCEDONATE.UserName+"'AND B.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, rows)
						{
							if (!!error) {DetailError = ('guildmanager: Error in query 44');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							console.log((parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Diamond)
								+"_"+(parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCEDONATE.FarmQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Farm)
								+"_"+(parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCEDONATE.WoodQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Wood)
								+"_"+(parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCEDONATE.StoneQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Stone)
								+"_"+(parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCEDONATE.MetalQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Metal));

							if ((rows.length>0)
								&&((parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
								&&(parseFloat(currentSENDRESOURCEDONATE.FarmQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.WoodQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.StoneQuality)=== 0)
								&&(parseFloat(currentSENDRESOURCEDONATE.MetalQuality)=== 0))  
							{
								//update tài nguyên còn lại của base		                		
								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.TimeComplete ='"+0
									+"',guildlistmember.TimeRemain ='"+0								
									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
									{
										if(!!error){DetailError = ('guildmanager: Error in query 45');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows)
											{
												if (!!error){DetailError = ('guildmanager: Error in query 46');
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (rows.length>0) 
												{
													arrayDiamondGuild = rows;
													connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows)
													{
														if (!!error){DetailError = ('guildmanager: Error in query 47');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (rows.length>0) 
														{
															arrayGuildDonate = rows;
															var GameServer = require("./../Login/Login/login.js");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arrayGuildDonate.length; i++) 
															{
																if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
																{	
																	io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('R_RESOURCE_DIAMOND_DONATE',
																	{
																		Diamond:arrayDiamondGuild,																																																																								
																	});								  															  								                	
																}													  							  			
															}	
															connection.release();		 
														}
													}
												})
												}
											}
										});											
										}
									}
								});					
}else if ((rows.length>0)
	&&((parseFloat(rows[0].Diamond) -parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
	&&((parseFloat(rows[0].Farm) -parseFloat(currentSENDRESOURCEDONATE.FarmQuality))=== parseFloat(currentSENDRESOURCEDONATE.Farm))
	&&((parseFloat(rows[0].Wood) -parseFloat(currentSENDRESOURCEDONATE.WoodQuality))=== parseFloat(currentSENDRESOURCEDONATE.Wood))
	&&((parseFloat(rows[0].Stone) -parseFloat(currentSENDRESOURCEDONATE.StoneQuality))=== parseFloat(currentSENDRESOURCEDONATE.Stone))
	&&((parseFloat(rows[0].Metal) -parseFloat(currentSENDRESOURCEDONATE.MetalQuality))=== parseFloat(currentSENDRESOURCEDONATE.Metal)))  
{
								//update tài nguyên còn lại của base
								d = new Date();
								createPositionTimelast = Math.floor(d.getTime() / 1000);
								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
									+"',guildlistmember.TimeComplete ='"+(parseFloat(rows[0].TimeTransport)+parseFloat(createPositionTimelast))
									+"',guildlistmember.TimeRemain ='"+parseFloat(rows[0].TimeTransport)
									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
									{
										if(!!error){DetailError = ('guildmanager: Error in query 48');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows)
											{
												if (!!error){DetailError = ('guildmanager: Error in query 49');
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (rows.length>0) 
												{
													arrayDiamondGuild = rows;
													connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows)
													{
														if (!!error){DetailError = ('guildmanager: Error in query 50');
														console.log(DetailError);
														functions.writeLogErrror(DetailError);	
													}else
													{
														if (rows.length>0) 
														{
															arrayGuildDonate = rows;
															var GameServer = require("./../Login/Login/login.js");
															var gameServer = new GameServer();
															exports.gameServer = gameServer;																
															for (var i = 0; i < arrayGuildDonate.length; i++) 
															{
																if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
																{	
																	io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('R_RESOURCE_DIAMOND_DONATE',
																	{
																		Diamond:arrayDiamondGuild,																																																																												
																	});								  															  								                	
																}													  							  			
															}
															connection.release();			 
														}
													}
												})
												}
											}
										});											
										}
									}
								});				

}
}
});						     	
});		
});	

			//Update guild
			socket.on('S_UP_GUILD', function (data)
			{
				var arrayAfterUpdate = [], arrayGuildDonate = [],DiamondRemain =0; 			
				currentSENDUPGUILD = getcurrentSENDUPGUILD(data);
				console.log("data receive S_UP_GUILD=========: "+currentSENDUPGUILD.GuildName);														
				database.getConnection(function(err,connection)
				{	
					connection.query("SELECT A.Diamond As DiamondConsumption, A.Level, B.Diamond FROM resourceupguild AS A INNER JOIN guildlist AS B WHERE B.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND  A.Level = B.Level + 1",function(error, rows)
					{
						if (!!error){DetailError = ('guildmanager: Error in query 51');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{	 
						if ((rows.length>0))  
						{
								//tính toán dử liệu sau khi nâng cấp								
								arrayAfterUpdate.push(rows[0].Level);
								arrayAfterUpdate.push(currentSENDUPGUILD.GuildName);
								DiamondRemain = parseFloat(rows[0].Diamond - rows[0].DiamondConsumption);

								//thực hiện nâng cấp guild
								connection.query("UPDATE guildlist,guildlistmember SET guildlist.Diamond = '"+DiamondRemain+"',guildlist.Level = '"+rows[0].Level+"', guildlistmember.LevelGuild = '"+rows[0].Level
									+"' where guildlist.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND guildlistmember.GuildName = '"+currentSENDUPGUILD.GuildName+"'",function(error, result, field)
									{
										if(!!error){DetailError = ('guildmanager: Error in query 52');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (result.affectedRows>0) 
										{
											connection.query("SELECT UserName FROM `users` WHERE 1",function(error, rows)
											{
												if (!!error){DetailError = ('guildmanager: Error in query 53');
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (rows.length>0) 
												{
													arrayAfterUpdate.push(DiamondRemain); 
													arrayGuildDonate = rows;
													var GameServer = require("./../Login/Login/login.js");
													var gameServer = new GameServer();
													exports.gameServer = gameServer;																
													for (var i = 0; i < arrayGuildDonate.length; i++) 
													{
														if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].UserName)).length >0) 
														{	
															io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].UserName)].idSocket).emit('R_DATA_UP_GUILD',
															{
																arrayAfterUpdate:arrayAfterUpdate,																																																																					
															});								  															  								                	
														}													  							  			
													}
													connection.release();			 
												}
											}
										})
										}
									}
								});

							}
						}
					});
				});
			});

			//remove member in guild 
			socket.on('S_REMOVE_MEMBER_IN_GUILD', function (data)
			{				
				currentSENDREMOVEMEMBERINGUILD = getcurrentSENDINFOGUILD(data);
				var arrayUserRemoved =[],arrayAllUsers =[];
				console.log("===============data receive S_REMOVE_MEMBER_IN_GUILD: "+currentSENDREMOVEMEMBERINGUILD.GuildName+"_"+currentSENDREMOVEMEMBERINGUILD.UserName);

				//update tài nguyên còn lại của base
				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				var query = database.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
					+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDREMOVEMEMBERINGUILD.UserName
					+"'AND guildlist.GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName									
					+"'AND guildlistmember.MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, result, field)
					{
						if(!!error){DetailError = ('guildmanager: Error in query 54');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{
						if (result.affectedRows>0) 
						{
							var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName
								+"' AND MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 55');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);
								}else
								{
									if (rows.length>0) 
									{
										arrayUserRemoved =rows;
										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 56');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arrayGuildNotify = rows;
												var GameServer = require("./../Login/Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;																
												for (var i = 0; i < arrayGuildNotify.length; i++) 
												{
													if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
													{	
														io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_REMOVE_MEMBER_IN_GUILD',
														{
															arrayUserRemoved:arrayUserRemoved,																																																																												
														});											  													  															  								                	
													}													  							  			
												}			 
											}
										}
									})	

										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 57');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arrayAllUsers =rows;															
												var GameServer = require("./../Login/Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;																
												for (var i = 0; i < arrayAllUsers.length; i++) 
												{
													if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
													{	
														io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('R_INFOMATION_GUILD',
														{
															arrayUserRemoved:arrayUserRemoved,																																																																												
														});											  													  															  								                	
													}													  							  			
												}
											}
										}
									});												
									}
								}
							});
						}
					}
				});	
			});

			//chuyển đổi tài nguyên từ tài nguyên này thành tài nguyên khác
			socket.on('S_CHANGE_RESOURCE_GUILD', function (data)
			{
				currentSENDCHANGERESOURCEGUILD = getcurrentSENDCHANGERESOURCEGUILD(data);
				console.log("=========Data receive S_CHANGE_RESOURCE_GUILD "+currentSENDCHANGERESOURCEGUILD.GuildName
					+"_"+currentSENDCHANGERESOURCEGUILD.UserName
					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceFrom
					+"_"+currentSENDCHANGERESOURCEGUILD.QualityResourceFrom
					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceTo
					+"_"+currentSENDCHANGERESOURCEGUILD.DiamondUse);

				var checkQuality,arrayGuildNotify=[],PercentChange=0;

				switch(currentSENDCHANGERESOURCEGUILD.DiamondUse) 
				{										
					case "0":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.5;
					}break;
					case "1":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.6;
					}break;
					case "2":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.7;
					}break;
					case "3":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.8;
					}break;
					case "4":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.9;
					}break;
					case "5":
					{
						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*1;
					}break;
					default:

				}

				database.getConnection(function(err,connection)
				{
					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
					{
						if (!!error)
						{
							DetailError = ('guildmanager: Error in query 58');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (rows.length>0) 
							{								
								switch(currentSENDCHANGERESOURCEGUILD.NameResourceFrom) 
								{
									case "Farm":
									{
										if (rows[0].Farm >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{																					
											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
										}else
										{
											DetailError = ("guildmanager: khong du farm");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}										
									}break;
									case "Wood":
									{
										if (rows[0].Wood >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
										}else
										{
											DetailError = ("guildmanager: khong du wood");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}										
									}break;
									case "Stone":
									{
										if (rows[0].Stone >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
										}else
										{
											DetailError = ("guildmanager: khong du stone");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}										
									}break;
									case "Metal":
									{
										if (rows[0].Metal >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
										{
											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
										}else
										{
											DetailError = ("guildmanage: khong du Metal");
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}										
									}break;
									default:
									console.log(" mac dinh");
								}
								connection.query("SELECT MemberName FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 59');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length>0) 
									{
										arrayGuildNotify = rows;
										connection.query("SELECT Farm, Wood, Stone, Metal, Diamond FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 60');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												var GameServer = require("./../Login/Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;																
												for (var i = 0; i < arrayGuildNotify.length; i++) 
												{											  			

													if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
													{	
														io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_RESOURCE_CHANGE',
														{
															arrayResourceChange:rows[0],																																																																												
														});											                	 									  													  															  								                	
													}													  							  			
												}
												connection.release();	
											}
										}
									});													 
									}			
								}
							})
							}
						}
					});
});					
});

			//chuyển tai nguyen thanh kim cương
			socket.on('S_CHANGE_RESOURCE_DIAMOND_GUILD', function (data)
			{				
				currentSENDCHANGERESOURCEDIAMONDGUILD = getcurrentSENDCHANGERESOURCEDIAMONDGUILD(data);
				console.log("Data receive S_CHANGE_RESOURCE_DIAMOND_GUILD"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName					
					+"_"+currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom);
				var checkResourceaDiamond=625000,arrayGuildNotify=[],PercentChange=0,arrayGuild=[];
				database.getConnection(function(err,connection)
				{
					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows)
					{
						if (!!error){DetailError = ('guildmanager: Error in query 61');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{
						if (rows.length>0) 
						{	
							arrayGuild = rows;
								//trong ngày công dồn
								connection.query("SELECT Quality FROM `resourcetodiamond` WHERE idresourcetodiamond = '"+(parseFloat(arrayGuild[0].numberResourceToDiamon)+1)+"'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 62');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length>0) 
									{
											//cộng dồn bình thường
											switch(currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom) 
											{
												case "Farm":
												{													
													if (parseFloat(arrayGuild[0].Farm)>=parseFloat(rows[0].Quality))
													{
														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
													}													
												}break;

												case "Wood":
												{													
													if (parseFloat(arrayGuild[0].Wood)>=parseFloat(rows[0].Quality))
													{
														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
													}
												}break;

												case "Stone":
												{												
													if (parseFloat(arrayGuild[0].Stone)>=parseFloat(rows[0].Quality))
													{
														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
													}
												}break;

												case "Metal":
												{													
													if (parseFloat(arrayGuild[0].Metal)>=parseFloat(rows[0].Quality))
													{
														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
													}									
												}break;

												default:
												console.log(" mac dinh");
											}
										}
									}
								});																								
							}
						}
					});

				});

			});

			//Chuyển tài nguyên của guild cho một user->base
			socket.on('S_TRANSFER_RESOURCE_OF_GUILD_TO_USER', function (data)
			{				
				currentSENDTRANSFERRESOURCEDOFGUILDTOUSER = getcurrentSENDTRANSFERRESOURCEDOFGUILDTOUSER(data);
				console.log("data receive S_TRANSFER_RESOURCE_OF_GUILD_TO_USER"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood
					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone+"_"+
					currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
				var arrayGuildAfterSendResource = [], arraySentResourceOfGuildToUser=[], arrayGuildAfterSendResourceBase=[], FarmFromGuild=0, WoodFromGuild=0,
				StoneFromGuild=0, MetalFromGuild=0;
				database.getConnection(function(err,connection)
				{

					connection.query("SELECT A.`MaxStorage`, B.Wood, B.Stone, B.Farm, B.Metal FROM resourceupgranary AS A INNER JOIN userbase AS B ON A.Level = B.LvGranary WHERE B.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase+"'",function(error, rows)
					{
						if (!!error){DetailError = ('guildmanager: Error in query 63');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{
						if (rows.length>0) 
						{
							if ((parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm))>parseFloat(rows[0].MaxStorage))
							{
								FarmFromGuild = parseFloat(rows[0].MaxStorage);
							}else
							{
								FarmFromGuild=parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm);
							}
							if((parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood))>parseFloat(rows[0].MaxStorage))
							{
								WoodFromGuild = parseFloat(rows[0].MaxStorage);
							}else
							{
								WoodFromGuild=parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood);
							}

							if((parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone))>parseFloat(rows[0].MaxStorage))
							{
								StoneFromGuild = parseFloat(rows[0].MaxStorage);
							}else
							{
								StoneFromGuild = parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone);
							}

							if((parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal))>parseFloat(rows[0].MaxStorage))
							{
								MetalFromGuild = parseFloat(rows[0].MaxStorage);
							}else
							{
								MetalFromGuild = parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
							}	

							connection.query("UPDATE userbase,guildlist SET userbase.Farm = '"+parseFloat(FarmFromGuild)
								+"',userbase.Wood = '"+parseFloat(WoodFromGuild)
								+"',userbase.Stone = '"+parseFloat(StoneFromGuild)
								+"',userbase.Metal = '"+parseFloat(MetalFromGuild)
								+"',guildlist.Farm = guildlist.Farm - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm)
								+"',guildlist.Wood = guildlist.Wood - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood)
								+"',guildlist.Stone = guildlist.Stone - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone)
								+"',guildlist.Metal = guildlist.Metal - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal)		
								+"'where userbase.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
								+"' AND guildlist.GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, result, field)
								{
									if(!!error){DetailError = ('guildmanager: Error in query 64');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (result.affectedRows>0) 
									{											
										connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 65');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arraySentResourceOfGuildToUser = rows;														
												connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows)
												{
													if (!!error){DetailError = ('guildmanager: Error in query 66');
													console.log(DetailError);
													functions.writeLogErrror(DetailError);	
												}else
												{
													if (rows.length>0) 
													{
														arrayGuildAfterSendResource =rows;
														var GameServer = require("./../Login/Login/login.js");
														var gameServer = new GameServer();
														exports.gameServer = gameServer;																	
														connection.query("SELECT * FROM `userbase` WHERE idBase = '"+parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase)+"'",function(error, rows)
														{
															if (!!error){DetailError = ('Eguildmanager: Error in query 67');
															console.log(DetailError);
															functions.writeLogErrror(DetailError);	
														}else
														{
															if (rows.length>0) 
															{
																arrayGuildAfterSendResourceBase=rows;
																for (var i = 0; i < arraySentResourceOfGuildToUser.length; i++) 
																{
																	var index=i;																		  			
																	if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySentResourceOfGuildToUser[index].MemberName)).length >0) 
																	{																				  				
																		if (arraySentResourceOfGuildToUser[index].MemberName===currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName) 
																		{													  										
																			io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('R_RESOURCE_FROM_GUID_MEMBER',
																			{
																				arrayGuildAfterSendResourceBase:arrayGuildAfterSendResourceBase,																				
																			});
																		}																							

																		io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('R_RESOURCE_FROM_GUID_TO_ALL_MEMBER',
																		{
																			arrayGuildAfterSendResource:arrayGuildAfterSendResource,																		
																		});						  																		  																			  												  															  								                	
																	}													  							  			
																}
																connection.release();
															}
														}
													});
													}
												}
											});		 
											}
										}
									})						
									}
								}
							});
}
}
});					
});				
});

			//User out guild 
			socket.on('S_MEMBER_OUT_GUILD', function (data)
			{				
				currentSENDMEMBEROOUTGUILD = getcurrentSENDINFOGUILD(data);
				var arrayUserRemoved =[],arrayGuildNotify =[],arrayAllUsers =[];
				//update tài nguyên còn lại của base
				d = new Date();
				createPositionTimelast = Math.floor(d.getTime() / 1000);
				var query = database.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
					+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDMEMBEROOUTGUILD.UserName
					+"'AND guildlist.GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName									
					+"'AND guildlistmember.MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, result, field)
					{
						if(!!error){DetailError = ('guildmanager: Error in query 68');
						console.log(DetailError);
						functions.writeLogErrror(DetailError);	
					}else
					{
						if (result.affectedRows>0) 
						{
							var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName
								+"' AND MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, rows)
								{
									if (!!error){DetailError = ('guildmanager: Error in query 69');
									console.log(DetailError);
									functions.writeLogErrror(DetailError);	
								}else
								{
									if (rows.length>0) 
									{
										arrayUserRemoved =rows;
										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error){DetailError = ('guildmanager: Error in query 70');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arrayGuildNotify = rows;
												var GameServer = require("./../Login/Login/login.js");
												var gameServer = new GameServer();
												exports.gameServer = gameServer;																
												for (var i = 0; i < arrayGuildNotify.length; i++) 
												{
													if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
													{	
														io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_MEMBER_OUT_GUILD',
														{
															arrayUserRemoved:arrayUserRemoved,																																																																												
														});													  													  															  								                	
													}													  							  			
												}			 
											}
										}
									})	

										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows)
										{
											if (!!error)
											{
												DetailError = ('guildmanager: Error in query 71');
												console.log(DetailError);
												functions.writeLogErrror(DetailError);	
											}else
											{
												if (rows.length>0) 
												{
													arrayAllUsers =rows;															
													var GameServer = require("./../Login/Login/login.js");
													var gameServer = new GameServer();
													exports.gameServer = gameServer;																
													for (var i = 0; i < arrayAllUsers.length; i++) 
													{
														if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
														{	
															io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('R_INFOMATION_GUILD',
															{
																arrayUserRemoved:arrayUserRemoved,																																																																												
															});													  													  															  								                	
														}													  							  			
													}
												}
											}
										});												
									}
								}
							});									
						}

					}
				});						

});
})
cron.schedule('*/1 * * * * *',function()
{			
	d = new Date();
	createPositionTimelast = Math.floor(d.getTime() / 1000);	    	
			//kiem tra reset join guild			
			var arrayResetJoin=[],arrayLeader=[]; 			
			var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND TimeReset <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
			{
				if (!!error){DetailError = ('guildmanager: Error in query 72');
				console.log(DetailError);
				functions.writeLogErrror(DetailError);	
			}else
			{
				if (rows.length>0) 
				{
					arrayResetJoin = rows;
					for (var i = 0; i < arrayResetJoin.length; i++) 
					{
						var index = i;					  			
						var query = database.query("DELETE FROM guildlistmember WHERE ActiveStatus= 0 AND GuildName = '"+arrayResetJoin[index].GuildName
							+"' AND MemberName = '"+arrayResetJoin[index].MemberName+"'",function(error, result, field)
							{
								if(!!error){DetailError = ('guildmanager: Error in query 73');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								if(result.affectedRows>0)
								{	
									var GameServer = require("./../Login/Login/login.js");
									var gameServer = new GameServer();
									exports.gameServer = gameServer;									
									if (gameServer.redisDatas.length>0) 
									{		
										if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResetJoin[index].MemberName)).length >0) 
										{								  				

											io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResetJoin[index].MemberName)].idSocket).emit('R_RESET_JOIN_GUILD',
											{
												ExpireInviteToJoinGuild:arrayResetJoin[index],
											});							                							                	

										}									  			
										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+arrayResetJoin[index].GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
										{

											if (!!error){DetailError = ('guildmanager: Error in query 74');
											console.log(DetailError);
											functions.writeLogErrror(DetailError);	
										}else
										{
											if (rows.length>0) 
											{
												arrayLeader = rows;														
												for (var k = 0; k < arrayLeader.length; k++) 
												{
													if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[k].MemberName)).length >0) 
													{													  				
														io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('R_RESET_JOIN_GUILD',
														{
															ExpireInviteToJoinGuild:arrayResetJoin[index],
														});							                														  									  								                	
													}	
												}													
											}
										}
									});
									}
								}
							}
						})				  			
					}			 
				}
			}
		})

			//kiểm tra thoi gian out guild
			//====================================			
			var arrayResetOutGuild=[],arrayMember=[];  		    						
			var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 2 AND TimeRemainOutGuild <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
			{
				if (!!error){DetailError = ('guildmanager: Error in query 75');
				console.log(DetailError);
				functions.writeLogErrror(DetailError);	
			}else
			{
				if (rows.length>0) 
				{						
					arrayResetOutGuild = rows;
					for (var i = 0; i < arrayResetOutGuild.length; i++) 
					{
						var index = i;					  			
						var query = database.query("DELETE FROM guildlistmember WHERE ActiveStatus= 2 AND GuildName = '"+arrayResetOutGuild[index].GuildName
							+"' AND MemberName = '"+arrayResetOutGuild[index].MemberName+"'",function(error, result, field)
							{
								if(!!error){DetailError = ('guildmanager: Error in query 76');
								console.log(DetailError);
								functions.writeLogErrror(DetailError);	
							}else
							{
								var GameServer = require("./../Login/Login/login.js");
								var gameServer = new GameServer();
								exports.gameServer = gameServer;
								if((result.affectedRows>0) && (gameServer.redisDatas.length>0))
								{																																					  			
									var query = database.query("SELECT * FROM `users` WHERE 1",function(error, rows)
									{									
										if (!!error){DetailError = ('guildmanager: Error in query 77');
										console.log(DetailError);
										functions.writeLogErrror(DetailError);	
									}else
									{
										if (rows.length>0) 
										{
											arrayMember = rows;														
											for (var k = 0; k < arrayMember.length; k++) 
											{
												if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayMember[k].UserName)).length >0) 
												{													  				
													io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayMember[k].UserName)].idSocket).emit('R_RESET_OUT_GUILD',
													{
														ArrayOutGuild:arrayResetOutGuild[index],
													});							                														  									  								                	
												}	
											}													
										}
									}
								});							  			
								}
							}
						})				  			
					}			 
				}
			}
		})

			//kiểm tra hoàn tất thời gian đóng góp tài nguyên
			//=======================================			
			var arrayMaxStorage =[],
			FarmRemain,WoodRemain,StoneRemain,MetalRemain,FarmOver,WoodOver,StoneOver,MetalOver; 								
			var query = database.query("SELECT * FROM `guildlistmember` WHERE TimeRemain > 0 AND TimeComplete <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
			{
				if (!!error){DetailError = ('guildmanager: Error in query 77');
				console.log(DetailError);
				functions.writeLogErrror(DetailError);	
			}else
			{
				if (rows.length>0) 
				{												
					arrayDonateComplete = rows;						
					for (var i = 0; i < arrayDonateComplete.length; i++) 
					{
						var index = i;
						FarmRemain=0,WoodRemain=0,StoneRemain=0,MetalRemain=0;
				  			//Kiểm tra tài nguyên hiên tại của guild xem có max chưa				  			
				  			var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows)
				  			{
				  				if (!!error){DetailError = ('guildmanager: Error in query 78');
				  				console.log(DetailError);
				  				functions.writeLogErrror(DetailError);	
				  			}else
				  			{
				  				if (rows.length>0) 
				  				{
				  					arrayMaxStorage =rows;
				  					var GameServer = require("./../Login/Login/login.js");
				  					var gameServer = new GameServer();
				  					exports.gameServer = gameServer;
				  					if (((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						||((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						||((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						||((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))) 
				  					{
				  						console.log("vuot qua resource======================================="+parseFloat(arrayMaxStorage[0].MaxStorage));
				  						if ((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						{												
				  							FarmRemain = parseFloat(arrayMaxStorage[0].MaxStorage);											 
				  						}else
				  						{
				  							FarmRemain = (arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm));											
				  						}

				  						if ((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						{												
				  							WoodRemain = parseFloat(arrayMaxStorage[0].MaxStorage);

				  						}else
				  						{
				  							WoodRemain = (arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood));											
				  						}

				  						if ((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						{												
				  							StoneRemain = parseFloat(arrayMaxStorage[0].MaxStorage);
				  						}
				  						else
				  						{
				  							StoneRemain = (arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone));												
				  						}

				  						if ((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))
				  						{												
				  							MetalRemain = parseFloat(arrayMaxStorage[0].MaxStorage);												
				  						}else
				  						{
				  							MetalRemain = (arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal));												
				  						}

				  						var query = database.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = '"+parseFloat(FarmRemain)
				  							+"',guildlist.Wood =  '"+parseFloat(WoodRemain)
				  							+"',guildlist.Stone = '"+parseFloat(StoneRemain)
				  							+"',guildlist.Metal =  '"+parseFloat(MetalRemain)							
				  							+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
				  							{
				  								if(!!error){DetailError = ('guildmanager: Error in query 79');
				  								console.log(DetailError);
				  								functions.writeLogErrror(DetailError);	
				  							}else
				  							{
				  								if ((result.affectedRows>0)&&(gameServer.redisDatas.length>0))
				  								{
				  									SendUpgrateDonateGuild(arrayDonateComplete[index].GuildName, io);																																							
				  								}
				  							}
				  						});	

				  					}else
				  					{											
				  						var query = database.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = guildlist.Farm + '"+arrayDonateComplete[index].FarmWait
				  							+"',guildlist.Wood = guildlist.Wood + '"+arrayDonateComplete[index].WoodWait
				  							+"',guildlist.Stone = guildlist.Stone +'"+arrayDonateComplete[index].StoneWait
				  							+"',guildlist.Metal = guildlist.Metal + '"+arrayDonateComplete[index].MetalWait							
				  							+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
				  							{
				  								if(!!error){DetailError = ('guildmanager: Error in query 80');
				  								console.log(DetailError);
				  								functions.writeLogErrror(DetailError);	
				  							}else
				  							{
				  								if ((result.affectedRows>0) && (gameServer.redisDatas.length>0)) 
				  								{
				  									SendUpgrateDonateGuild(arrayDonateComplete[index].GuildName, io);																			  												  															  														  			
				  								}
				  							}
				  						});	
				  					}
				  				}
				  			}
				  		});	  			
}			 
}
}
})

			//Cap nhat kiem tra trao doi tai nguyen va kim cuong hang ngay cua guild
			//Cập nhật cho các dữ liệu cần kiểm tra
			var dt = datetime.create();
			var formatted = dt.format('dmY');
			var arrayAllGuild = [];	
			//cap nhat so luong tai nguyen doi kim cuong trong 1 ngay	
			var query = database.query("SELECT * FROM `guildlist` WHERE DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, rows)
			{
				if (!!error){DetailError = ('guildmanager: Error in query 81');
				console.log(DetailError);
				functions.writeLogErrror(DetailError);	
			}else
			{
				if (rows.length>0) 
				{						
					arrayAllGuild =rows;		
					var query = database.query("UPDATE guildlist SET numberResourceToDiamon =0, DateResourceToDiamon='"+parseFloat(formatted)
						+"' where DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, result, field)
						{
							if(!!error){DetailError = ('guildmanager: Error in query 82');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{
							if (result.affectedRows>0) 
							{	
								var GameServer = require("./../Login/Login/login.js");
								var gameServer = new GameServer();
								exports.gameServer = gameServer;
								for (var i = 0; i < arrayAllGuild.length; i++) 
								{							  			
									if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllGuild[i].LeaderName)).length >0) 
									{							  					
										io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllGuild[i].LeaderName)].idSocket).emit('R_RESET_RESOURCE_CHANGE_DIAMOND',
										{
											numberResourceToDiamon:0,																																																																												
										});						                											  													  															  								                	
									}													  							  			
								}																																
							}
						}
					});					
				}
			}
		});
		});
}




// module.exports = {
//     start: function(io) 
//     {
//         io.on('connection', function(socket) 
//         {
//         	//user gửi request tham gia guild
//         	socket.on('S_REQUEST_ENTER_TO_GUILD', function (data)
// 			{
// 				currentSENDREQUESTENTERTOGUILD = getcurrentSENDINFOGUILD(data);
// 				console.log("data receive S_REQUEST_ENTER_TO_GUILD ============: "+ currentSENDREQUESTENTERTOGUILD.UserName+"_"
// 											+ currentSENDREQUESTENTERTOGUILD.GuildName);					

// 				database.getConnection(function(err,connection)
// 				{				
// 					connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName
// 												+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILD.UserName+"'",function(error, rows)
// 					{
// 						if (!!error)
// 						{											
// 							DetailError = ("guildmanager: Error in query 1");
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{											
// 							if (rows.length > 0) 
// 							{															
// 			            		connection.release();
// 								DetailError = ("login: GuildName đã tồn tại user");
// 								console.log(DetailError);
// 								functions.writeLogErrror(DetailError);	
// 							}else
// 							{
// 								connection.query("SELECT GuildName FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName
// 									+"'UNION ALL SELECT timeLogin FROM `users` WHERE `UserName` = '"+currentSENDREQUESTENTERTOGUILD.UserName+"'",function(error, rows)
// 								{
// 									if (!!error)
// 									{	
// 										DetailError = ("guildmanager: Error in query 2");
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{											
// 										if (rows.length > 0) 
// 										{
// 											d = new Date();
// 					        				createPositionTimelast = Math.floor(d.getTime() / 1000);
// 					        				var Status = 0;
// 					        				if (parseFloat(rows[1].GuildName) > 0) 
// 					        				{
// 					        					Status = 1; 					        					
// 					        				}					        				
// 											connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`,`Status`) VALUES ('"+""+"','"
// 												+currentSENDREQUESTENTERTOGUILD.GuildName+"','"
// 												+parseFloat(rows[0].GuildName)+"','"
// 												+currentSENDREQUESTENTERTOGUILD.UserName+"','"+0+"','"
// 												+(parseFloat(createPositionTimelast)+14400)+"','"
// 												+0+"','"+""+"','"+"Member"+"','"+Status+"')",function(error, result, field)
// 											{
// 									            if(!!err){DetailError = ('guildmanager: Error in query 3');
// 									            	console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 									            }else
// 									            {
// 									            	if (result.affectedRows>0) 
// 									            	{										            		
// 									            		connection.query("SELECT MemberName FROM `guildlistmember` WHERE PositionGuild = 'Leader' AND `GuildName`='"+currentSENDREQUESTENTERTOGUILD.GuildName+"'",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 4');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{
// 																	arrayALLLeader = rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;
// 																	for (var i = 0; i < arrayALLLeader.length; i++) 
// 															  		{															  																	  			
// 															  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayALLLeader[i].MemberName)).length >0) 
// 															  			{												  																	                		
// 													                		socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayALLLeader[i].MemberName)].idSocket).emit('R_JOIN_GUILD_TO_LEADER',
// 																			{
// 																				UserName:currentSENDREQUESTENTERTOGUILD.UserName,																																				
// 														                	});					                	
// 															  			}													  							  			
// 															  		}
// 															  		connection.release();			 
// 																}
// 															}
// 														})
// 									            	}
// 									            }
// 									        });
// 										}
// 									}
// 								});								
// 							}
// 						}

// 					});					     	
// 		   		});		
// 			}); 

//         	//Leader gửi lời mời user khác tham gia guild
// 			socket.on('S_REQUEST_ENTER_TO_GUILD_BY_USER', function (data)
// 			{
// 				currentSENDREQUESTENTERTOGUILDBYUSER = getcurrentSENDREQUESTENTERTOGUILDBYUSER(data);
// 				console.log("data receive S_REQUEST_ENTER_TO_GUILD_BY_USER ============: "+ currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"_"
// 											+ currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser+"_"
// 											+ currentSENDREQUESTENTERTOGUILDBYUSER.GuildName);									
// 				database.getConnection(function(err,connection)
// 				{	
// 					connection.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"' ",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 5');							
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{															
// 							if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
// 							{								
// 								connection.query("SELECT idguildlist,`GuildName`,`Level` FROM `guildlist` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
// 									+"' UNION ALL SELECT idguildlistmember,`GuildName`,`LevelGuild` FROM `guildlistmember` WHERE `GuildName`='"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
// 									+"' AND `MemberName` ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
// 									+"' AND `InviteByUser` !='' UNION ALL SELECT `UserName`,`UserEmail`,`timeLogin` FROM `users` WHERE `UserName` = '"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
// 									+"'",function(error, rows)
// 								{
// 									if (!!error)
// 									{	
// 										DetailError = ("guildmanager: Error in query 6");
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{											
// 										if (rows.length <= 2) 
// 										{												
// 											d = new Date();
// 					        				createPositionTimelast = Math.floor(d.getTime() / 1000);					        				
// 					        				var Status = 0;
// 					        				if (parseFloat(rows[1].Level) > 0) 
// 					        				{
// 					        					Status = 1; 					        					
// 					        				}					        				
// 											connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`,`InviteByUser`, `PositionGuild`,`Status`) VALUES ('"+""+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName
// 												+"','"+parseFloat(rows[0].Level)+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName+"','"+0+"','"
// 												+(parseFloat(createPositionTimelast)+14400)
// 												+"','"+0
// 												+"','"+currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser
// 												+"','"+"Member"+"','"+Status+"')",function(error, result, field)
// 											{
// 									            if(!!err){DetailError = ('guildmanager: Error in query 7');
// 									            	console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 									            }else
// 									            {
// 									            	if (result.affectedRows>0) 
// 									            	{			

// 									            		//gui chi tiết lời mời lên cho các leader khác đang online và user được mời
// 									            		connection.query("SELECT MemberName,PositionGuild FROM `guildlistmember` WHERE (MemberName ='"+currentSENDREQUESTENTERTOGUILDBYUSER.UserName
// 									            			+"' OR PositionGuild = 'Leader' OR PositionGuild='CoLeader') AND GuildName = '"+currentSENDREQUESTENTERTOGUILDBYUSER.GuildName+"'",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 8');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{																	
// 																	arrayResponseInviteByGuild = rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;
// 																	for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
// 															  		{															  			
// 															  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
// 															  			{															  				
// 															  				if (arrayResponseInviteByGuild[i].PositionGuild === 'Member') 
// 								  											{									  												
// 															  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_MEMBER',
// 																				{																			
// 																					GuildName:currentSENDREQUESTENTERTOGUILDBYUSER.GuildName,																	
// 															                	});
// 														                	}else
// 														                	{															                		
// 														                		io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_LEADER',
// 																				{
// 																					UserName:currentSENDREQUESTENTERTOGUILDBYUSER.UserName,																		
// 																					InviteByUser:currentSENDREQUESTENTERTOGUILDBYUSER.InviteByUser,
// 															                	});
// 														                	}				                	
// 															  			}													  							  			
// 															  		}
// 															  		connection.release();			 
// 																}
// 															}
// 														})
// 									            	}
// 									            }
// 									        });
// 										}
// 									}
// 								});	
// 							}
// 						}
// 					});											     	
// 		   		});		
// 			});  

// 			//Gửi request tạo guild
// 			socket.on('S_REQUEST_TO_CREATE_GUILD', function (data)
// 			{
// 				currentSENDREQUESTETOCREATEGUILD = getcurrentSENDINFOGUILD(data); 
// 				console.log("data receive S_REQUEST_TO_CREATE_GUILD============: "+ currentSENDREQUESTETOCREATEGUILD.UserName+"_"
// 											+ currentSENDREQUESTETOCREATEGUILD.GuildName);
// 				database.getConnection(function(err,connection)
// 				{				
// 					connection.query("SELECT `GuildName` FROM `guildlistmember` WHERE  ActiveStatus = 1 AND (`MemberName` ='"+currentSENDREQUESTETOCREATEGUILD.UserName
// 						+"' OR `GuildName` ='"+currentSENDREQUESTETOCREATEGUILD.GuildName+"')",function(error, rows)
// 					{
// 						if (!!error)
// 						{
// 							DetailError = ("guildmanager: Error in query 9");
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{											
// 							if (rows.length > 0) 
// 							{								
// 								socket.emit('R_REQUEST_TO_CREATE_GUILD', 
// 								{
// 			                		message : 0,
// 			            		});
// 			            		connection.release();								
// 							}else
// 							{	
// 								connection.query("SELECT A.Diamond,C.MaxStorage, C.Diamond as Diamondconsumption FROM users AS A INNER JOIN resourceupguild AS C ON C.Level =0 AND A.UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, rows)
// 								{
// 									if (!!error)
// 									{
// 										DetailError = ("guildmanager: Error in query 10");
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{											
// 										if (rows.length > 0) 
// 										{
// 											d = new Date();
// 					        				createPositionTimelast = Math.floor(d.getTime() / 1000);
// 											connection.query("INSERT INTO `guildlist`(`idGuildList`, `GuildName`, `LeaderName`, `Level`,`MaxStorage`, `Diamond`, `Quality`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"',0,'"+rows[0].MaxStorage+"',0,1)",function(error, result, field)
// 											{
// 									            if(!!error){DetailError = ('guildmanager: Error in query 11');
// 									            	console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 									            }else
// 									            {
// 									            	if (result.affectedRows > 0) 
// 									            	{										            										            		
// 									            		connection.query("INSERT INTO `guildlistmember`(`idguildlistmember`, `GuildName`, `LevelGuild`, `MemberName`, `ActiveStatus`, `TimeReset`, `TimeRemainReset`, `InviteByUser`, `PositionGuild`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"',0,'"+currentSENDREQUESTETOCREATEGUILD.UserName+"',1,0,0,'','Leader')",function(error, result, field)
// 														{
// 												            if(!!error){DetailError = ('guildmanager: Error in query 12');
// 												            	console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 												            }else
// 												            {
// 												            	if (result.affectedRows > 0) 
// 												            	{													            		
// 												            		socket.emit('R_REQUEST_ENTER_TO_GUILD', 
// 																	{
// 												                		Diamond : (parseFloat(rows[0].Diamond) - parseFloat(rows[0].Diamondconsumption))
// 												            		});
// 												            		connection.query("UPDATE users SET GuildName = '"+currentSENDREQUESTETOCREATEGUILD.GuildName
// 												            			+"',Diamond = Diamond - '"+parseFloat(rows[0].Diamondconsumption)
// 																		+"' WHERE UserName = '"+currentSENDREQUESTETOCREATEGUILD.UserName+"'",function(error, result, field)
// 																	{
// 																		if(!!error){DetailError = ('guildmanager: Error in query 13');
// 																			console.log(DetailError);
// 																			functions.writeLogErrror(DetailError);	
// 																		}else
// 																		{
// 																			if (result.affectedRows>0) 
// 																			{																				
// 																				io.emit('R_USER_CREATE_GUILD',{
// 														                        	UserName:currentSENDREQUESTETOCREATEGUILD.UserName,		
// 																					GuildName:currentSENDREQUESTETOCREATEGUILD.GuildName,
// 														                    	});	
// 														                    	 //insert policy
// 																		        connection.query("INSERT INTO `policys`(`idPolicys`, `GuildName`, `LeaderName`, `Details`) VALUES ('','"+currentSENDREQUESTETOCREATEGUILD.GuildName+"','"+currentSENDREQUESTETOCREATEGUILD.UserName+"','')",function(error, result, field)
// 																				{
// 																		            if(!!error) {DetailError = ('guildmanager: Error in query 14');
// 																		            	console.log(DetailError);
// 																						functions.writeLogErrror(DetailError);	
// 																		        	}																		            
// 																		            else{connection.release();}
// 																		        });
// 																			}
// 																		}
// 																	});
// 												            	}
// 												            }
// 												        });

// 									            	}
// 									            }
// 									        });									       
// 										}
// 									}
// 								});	
// 							}
// 						}
// 					});					     	
// 		   		});	
// 			});   

// 			//User được mời chấp nhận vào vào guild
// 			socket.on('S_ACCEPT_INVITE_WITH_GUILD', function (data)
// 			{
// 				currentSENDACCEPTINVITEWITHGUILD = getcurrentSENDINFOGUILD(data);
// 				console.log("data receive S_ACCEPT_INVITE_WITH_GUILD============: "+ currentSENDACCEPTINVITEWITHGUILD.UserName+"_"
// 											+ currentSENDACCEPTINVITEWITHGUILD.GuildName);
// 				var query = database.query("SELECT A.Quality, B.LimitGuildMember FROM guildlist AS A INNER JOIN resourceupguild AS B ON A.Level = B.Level WHERE A.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"' ",function(error, rows)
// 				{
// 					if (!!error){DetailError = ('guildmanager: Error in query 15');							
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);	
// 					}else
// 					{											
// 						if ((rows.length > 0) && (parseFloat(rows[0].Quality) <parseFloat(rows[0].LimitGuildMember))) 
// 						{
// 							var query = database.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTINVITEWITHGUILD.GuildName)	                			
// 		            			+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.InviteByUser != '' AND guildlistmember.GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName
// 		            			+"'AND guildlistmember.ActiveStatus = 0 AND guildlistmember.MemberName = '"+currentSENDACCEPTINVITEWITHGUILD.UserName+"'",function(error, result, field)
// 							{
// 								if(!!error){DetailError = ('Eguildmanager: Error in query 16');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if (result.affectedRows>0) 
// 									{		
// 										//dữ liệu của toàn bộ thành viên guild
// 										var query = database.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
// 								        {
// 											if (!!error){DetailError = ('guildmanager: Error in query 17');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length >0) 
// 												{
// 													arrayAllMemberGuild = rows;
// 													//dữ liệu policy
// 													var query = database.query("SELECT * FROM `policys` where GuildName='"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
// 											        {
// 														if (!!error){DetailError = ('guildmanager: Error in query 18');
// 															console.log(DetailError);
// 															functions.writeLogErrror(DetailError);	
// 														}else
// 														{
// 															if (rows.length >0) 
// 															{
// 																arrayPolicy = rows;
// 																var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
// 																{
// 																	if (!!error){DetailError = ('guildmanager: Error in query 19');
// 																		console.log(DetailError);
// 																		functions.writeLogErrror(DetailError);	
// 																	}else
// 																	{
// 																		if (rows.length>0) 
// 																		{														
// 																			arrayResponseInviteByGuild = rows;
// 																			var GameServer = require("./../Login/Login/login.js");
// 																			var gameServer = new GameServer();
// 																			exports.gameServer = gameServer;
// 																			for (var i = 0; i < arrayResponseInviteByGuild.length; i++) 
// 																	  		{											  			
// 																	  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseInviteByGuild[i].MemberName)).length >0) 
// 																	  			{
// 																	  				if (arrayResponseInviteByGuild[i].MemberName===currentSENDACCEPTINVITEWITHGUILD.UserName) 
// 																	  				{										  																  					
// 																	  					socket.emit(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_NEW_MEMBER',
// 																						{																				
// 																							arrayResponseInviteByGuild:arrayResponseInviteByGuild,	
// 																							Details: arrayPolicy[0].Details,
// 																							arrayAllMemberGuild:arrayAllMemberGuild,																
// 																	                	});
// 																	  				}else
// 																	  				{
// 																	  					socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseInviteByGuild[i].MemberName)].idSocket).emit('R_ACCEPT_INVITE_WITH_GUILD_ALL_MEMBER',
// 																						{
// 																							UserName:(arrayResponseInviteByGuild[arrayResponseInviteByGuild.findIndex(item => item.MemberName === currentSENDACCEPTINVITEWITHGUILD.UserName)]),																		
// 																	                	});
// 																	  				}									  															  								                	
// 																	  			}													  							  			
// 																	  		}			 
// 																		}
// 																	}
// 																})
// 															}

// 														}
// 													});	
// 												}															
// 											}
// 										})		


// 										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
// 										var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTINVITEWITHGUILD.GuildName+"'",function(error, rows)
// 										{
// 											if (!!error){DetailError = ('guildmanager: Error in query 20');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													io.emit('R_INFOMATION_GUILD',{
// 							                        	GuildName : rows,
// 							                    	});
// 												}
// 											}
// 										});											
// 									}
// 								}
// 							});
// 						}
// 					}
// 				});	
// 			}); 

// 			//hủy lời mời tham gia guild bởi user    
// 			socket.on('S_REJECT_INVITE_WITH_GUILD', function (data)
// 			{
// 				currentSENDREJECTINVITEWITHGUILD = getcurrentSENDINFOGUILD(data);
// 				console.log("data receive S_REJECT_INVITE_WITH_GUILD============: "+ currentSENDREJECTINVITEWITHGUILD.UserName+"_"
// 											+ currentSENDREJECTINVITEWITHGUILD.GuildName);					

// 				database.getConnection(function(err,connection)
// 				{				
// 					connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILD.GuildName
// 						+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILD.UserName+"'",function(error, result, field)
// 					{
// 						if(!!error){DetailError = ('guildmanager: Error in query 21');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (result.affectedRows>0) 
// 							{								
// 								connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDREJECTINVITEWITHGUILD.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
// 								{
// 									if (!!error){DetailError = ('guildmanager: Error in query 22');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (rows.length>0) 
// 										{
// 											arrayLeader = rows;
// 											var GameServer = require("./../Login/Login/login.js");
// 											var gameServer = new GameServer();
// 											exports.gameServer = gameServer;
// 											for (var i = 0; i < arrayLeader.length; i++) 
// 									  		{									  			
// 									  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[i].MemberName)).length >0) 
// 									  			{
// 								  					socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[i].MemberName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_MEMBER',
// 													{
// 														UserName:currentSENDREJECTINVITEWITHGUILD.UserName,																		
// 								                	});									  													  															  								                
// 									  			}													  							  			
// 									  		}
// 									  		connection.release();			 
// 										}			
// 									}
// 								})						
// 							}
// 						}
// 					});				     	
// 		   		});		
// 			}); 

// 			//hủy lời mời tham gia guild bởi leader    
// 			socket.on('S_REJECT_INVITE_WITH_GUILD_BY_LEADER', function (data)
// 			{
// 				currentSENDREJECTINVITEWITHGUILDBYLEADER = getcurrentSENDINFOGUILD(data);
// 				console.log("data receive S_REJECT_INVITE_WITH_GUILD_BY_LEADER============: "+ currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"_"
// 											+ currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName);					

// 				database.getConnection(function(err,connection)
// 				{	
// 					var arrayResetJoin=[],arrayLeader=[]; 
// 					connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName
// 						+"'AND GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"'",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 23');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (rows.length>0) 
// 							{
// 								arrayResetJoin = rows;
// 								connection.query("DELETE FROM `guildlistmember` WHERE GuildName ='"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName
// 									+"' AND MemberName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName+"'",function(error, result, field)
// 								{
// 									if(!!error){DetailError = ('guildmanager: Error in query 24');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (result.affectedRows>0) 
// 										{											
// 											var GameServer = require("./../Login/Login/login.js");
// 											var gameServer = new GameServer();
// 											exports.gameServer = gameServer;
// 											if (gameServer.redisDatas.length>0) 
// 											{	
// 												//gửi client
// 									  			if ((lodash.filter(gameServer.redisDatas, x => x.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)).length >0) 
// 									  			{	
// 									  				io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === currentSENDREJECTINVITEWITHGUILDBYLEADER.UserName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_LEADER',
// 													{
// 														ExpireInviteToJoinGuild:arrayResetJoin[0],
// 								                	});							                							                	

// 									  			}	
// 									  			//gửi leader					  			
// 									  			connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREJECTINVITEWITHGUILDBYLEADER.GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
// 												{													
// 													if (!!error){DetailError = ('guildmanager: Error in query 25');
// 														console.log(DetailError);
// 														functions.writeLogErrror(DetailError);	
// 													}else
// 													{
// 														if (rows.length>0) 
// 														{
// 															arrayLeader = rows;												
// 															for (var k = 0; k < arrayLeader.length; k++) 
// 															{
// 																if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[k].MemberName)).length >0) 
// 													  			{	
// 													  				io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('R_REJECT_INVITE_WITH_GUILD_BY_LEADER',
// 																	{
// 																		ExpireInviteToJoinGuild:arrayResetJoin[0],
// 												                	});							                														  									  								                	
// 													  			}	
// 															}	
// 															connection.release();												
// 														}
// 													}
// 												});
// 								  			}						
// 										}
// 									}
// 								});									
// 							}
// 						}
// 					});									     	
// 		   		});		
// 			});

// 			//Leader chấp nhận lời yêu cầu vào guild 
// 			socket.on('S_ACCEPT_JOIN_GUILD_BY_LEADER', function (data)
// 			{
// 				currentSENDACCEPTJOINGUILDBYLEADER = getcurrentSENDACCEPTJOINGUILDBYLEADER(data);
// 				console.log("data receive S_ACCEPT_JOIN_GUILD_BY_LEADER============: "+ currentSENDACCEPTJOINGUILDBYLEADER.UserName+"_"
// 											+ currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"_"+currentSENDACCEPTJOINGUILDBYLEADER.LeaderAccept);																
// 				var query = database.query("UPDATE users, guildlistmember,guildlist SET users.GuildName = '"+ (currentSENDACCEPTJOINGUILDBYLEADER.GuildName)	                			
//         			+"',guildlist.Quality = guildlist.Quality+1 ,guildlistmember.ActiveStatus = 1,guildlistmember.TimeReset = 0,guildlistmember.InviteByUser = '' where users.UserName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName
//         			+"' AND guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.ActiveStatus = 0 AND guildlistmember.GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName
//         			+"'AND guildlistmember.MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"'",function(error, result, field)
// 				{
// 					if(!!error){DetailError = ('guildmanager: Error in query 26');
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);	
// 					}else
// 					{
// 						if (result.affectedRows>0) 
// 						{	var query = database.query("SELECT * FROM `guildlistmember` WHERE (ActiveStatus=2 OR ActiveStatus=1) AND GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
// 					        {
// 								if (!!error){DetailError = ('guildmanager: Error in query 27');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if (rows.length >0) 
// 									{										
// 										arrayAllMemberGuild = rows;
// 										//dữ liệu policy
// 										var query = database.query("SELECT * FROM `policys` where GuildName='"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
// 								        {
// 											if (!!error){DetailError = ('guildmanager: Error in query 28');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length >0) 
// 												{													
// 													arrayPolicy = rows;
// 													var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
// 													{
// 														if (!!error){DetailError = ('guildmanager: Error in query 29');
// 															console.log(DetailError);
// 															functions.writeLogErrror(DetailError);	
// 														}else
// 														{
// 															if (rows.length>0) 
// 															{																								
// 																arrayResponseAcceptJoinGuildByLeader = rows;
// 																var GameServer = require("./../Login/Login/login.js");
// 																var gameServer = new GameServer();
// 																exports.gameServer = gameServer;
// 																for (var i = 0; i < arrayResponseAcceptJoinGuildByLeader.length; i++) 
// 														  		{
// 														  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)).length >0) 
// 														  			{
// 														  				if (arrayResponseAcceptJoinGuildByLeader[i].MemberName===currentSENDACCEPTJOINGUILDBYLEADER.UserName) 
// 														  				{															  													  					
// 														  					socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_NEW_MEMBER',
// 																			{
// 																				arrayResponseAcceptJoinGuildByLeader:arrayResponseAcceptJoinGuildByLeader,	
// 																				Details: arrayPolicy[0].Details,
// 																				arrayAllMemberGuild:arrayAllMemberGuild,																	
// 														                	});
// 														  				}else
// 														  				{
// 														  					socket.emit(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_ALL_MEMBER',
// 																			{
// 																				UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
// 														                	});

// 															  				socket.broadcast.to(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResponseAcceptJoinGuildByLeader[i].MemberName)].idSocket).emit('R_ACCEPT_JOIN_GUILD_BY_LEADER_ALL_MEMBER',
// 																			{
// 																				UserName:(arrayResponseAcceptJoinGuildByLeader[arrayResponseAcceptJoinGuildByLeader.findIndex(item => item.MemberName === currentSENDACCEPTJOINGUILDBYLEADER.UserName)]),																		
// 														                	});
// 														  				}									  															  								                	
// 														  			}													  							  			
// 														  		}			 
// 															}			
// 														}
// 													})
// 												}

// 											}
// 										});	
// 									}															
// 								}
// 							})									

// 							//Gửi thông tin cho tất cả các người chơi về gui hiện tại
// 							var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDACCEPTJOINGUILDBYLEADER.GuildName+"'",function(error, rows)
// 							{
// 								if (!!error){DetailError = ('guildmanager: Error in query 30');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if (rows.length>0) 
// 									{
// 										io.emit('R_INFOMATION_GUILD',{
// 				                        	GuildName : rows,
// 				                    	});
// 									}
// 								}
// 							});
// 							//xóa các lời mời của guild khác và lời join
// 							var query = database.query("DELETE FROM guildlistmember WHERE MemberName = '"+currentSENDACCEPTJOINGUILDBYLEADER.UserName+"' AND ActiveStatus = 0",function(error, result, field)
// 						  	{
// 								if(!!error){DetailError = ('guildmanager: Error in query 31');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}
// 							})
// 						}
// 					}
// 				});				     	

// 			});     			


// 			//Send Up Member
// 			socket.on('S_UP_MEMBER_IN_GUILD', function (data)
// 			{
// 				currentSENDUPMEMBERINGUILD = getcurrentSENDINFOGUILD(data); 
// 				console.log("data receive S_UP_MEMBER_IN_GUILD============: "+ currentSENDUPMEMBERINGUILD.UserName+"_"											
// 											+ currentSENDUPMEMBERINGUILD.GuildName);
// 				var arrayMemberDown = [],arrayMemberChange = [];															
// 				var query = database.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, rows)
// 				{
// 					if (!!error){DetailError = ('guildmanager: Error in query 32');							
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);	
// 					}else
// 					{											
// 						if (rows.length > 0)
// 						{
// 							arraySendUpMember = rows;
// 							if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDUPMEMBERINGUILD.UserName)].PositionGuild==="Member") 
// 							{
// 								if((lodash.filter(arraySendUpMember, x => x.PositionGuild === "CoLeader")).length<4)
// 								{
// 									//nâng cấp member lên CoLeader và thông báo cho các user khác
// 									var query = database.query("UPDATE guildlistmember SET PositionGuild = 'CoLeader' where GuildName = '"+
// 										currentSENDUPMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, result, field)
// 									{
// 										if(!!error){DetailError = ('guildmanager: Error in query 33');
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}else
// 										{
// 											if (result.affectedRows>0) 
// 											{													
// 												var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
// 													+"' AND MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"'",function(error, rows)
// 												{
// 													if (!!error){DetailError = ('guildmanager: Error in query 34');
// 														console.log(DetailError);
// 														functions.writeLogErrror(DetailError);	
// 													}else
// 													{
// 														if (rows.length>0) 
// 														{
// 															arrayMemberChange = rows;																
// 															var GameServer = require("./../Login/Login/login.js");
// 															var gameServer = new GameServer();
// 															exports.gameServer = gameServer;																
// 															for (var i = 0; i < arraySendUpMember.length; i++) 
// 													  		{														  			
// 													  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
// 													  			{	
// 												  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_UP_MEMBER_IN_GUILD',
// 																	{
// 																		arrayMemberChange:arrayMemberChange,																		
// 												                	});														  													  															  								                	
// 													  			}													  							  			
// 													  		}			 
// 														}
// 													}
// 												})
// 											}
// 										}
// 									});
// 								}
// 							}else
// 							{											
// 								var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
// 									+"' AND PositionGuild = 'Leader'",function(error, rows)
// 								{
// 									if (!!error){DetailError = ('guildmanager: Error in query 35');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (rows.length>0) 
// 										{
// 											arrayMemberDown = rows;
// 											var query = database.query("UPDATE guildlistmember SET PositionGuild = CASE WHEN GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
// 												+"' AND PositionGuild = 'Leader' THEN 'CoLeader' WHEN  GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
// 												+"' AND `MemberName` = '"+currentSENDUPMEMBERINGUILD.UserName
// 												+"' THEN 'Leader' ELSE PositionGuild END",function(error, result, field)
// 											{
// 												if(!!error){DetailError = ('guildmanager: Error in query 36');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (result.affectedRows>0) 
// 													{
// 														var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName
// 															+"' AND (MemberName = '"+currentSENDUPMEMBERINGUILD.UserName+"' OR MemberName = '"+arrayMemberDown[0].MemberName+"')",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 37');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{
// 																	arrayMemberChange = rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;																
// 																	for (var i = 0; i < arraySendUpMember.length; i++) 
// 															  		{
// 															  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
// 															  			{	
// 														  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_UP_MEMBER_IN_GUILD',
// 																			{
// 																				arrayMemberChange:arrayMemberChange,																		
// 														                	});													  													  															  								                	
// 															  			}													  							  			
// 															  		}			 
// 																}	
// 															}
// 														})	
// 														//cập nhật policy
// 														var query = database.query("UPDATE policys SET LeaderName = '"+currentSENDUPMEMBERINGUILD.UserName+"' where GuildName = '"+currentSENDUPMEMBERINGUILD.GuildName+"'",function(error, result, field)
// 														{
// 															if(!!error){DetailError = ('guildmanager: Error in query 38');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}															
// 														});																										  	
// 													}
// 												}
// 											});														 
// 										}		
// 									}
// 								})						
// 							}
// 						}
// 					}
// 				});								
// 			}); 

// 			//Send Down Member
// 			socket.on('S_DOWN_MEMBER_IN_GUILD', function (data)
// 			{
// 				currentSENDDOWNMEMBERINGUILD = getcurrentSENDINFOGUILD(data);
// 				console.log("data receive S_DOWN_MEMBER_IN_GUILD============: "+ currentSENDDOWNMEMBERINGUILD.UserName+"_"											
// 											+ currentSENDDOWNMEMBERINGUILD.GuildName);
// 				var arrayMemberDown = [],arrayMemberChange = [];												

// 				database.getConnection(function(err,connection)
// 				{	
// 					connection.query("SELECT * FROM guildlistmember WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName+"'",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 39');							
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{											
// 							if (rows.length > 0)
// 							{
// 								arraySendUpMember = rows;
// 								if (arraySendUpMember[arraySendUpMember.findIndex(item => item.MemberName === currentSENDDOWNMEMBERINGUILD.UserName)].PositionGuild==="CoLeader") 
// 								{									
// 									//nâng cấp member lên CoLeader và thông báo cho các user khác
// 									connection.query("UPDATE guildlistmember SET PositionGuild = 'Member' where GuildName = '"+
// 										currentSENDDOWNMEMBERINGUILD.GuildName+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, result, field)
// 									{
// 										if(!!error){DetailError = ('guildmanager: Error in query 40');
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}else
// 										{
// 											if (result.affectedRows>0) 
// 											{												
// 												connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDDOWNMEMBERINGUILD.GuildName
// 													+"' AND MemberName = '"+currentSENDDOWNMEMBERINGUILD.UserName+"'",function(error, rows)
// 												{
// 													if (!!error){DetailError = ('guildmanager: Error in query 41');
// 														console.log(DetailError);
// 														functions.writeLogErrror(DetailError);	
// 													}else
// 													{
// 														if (rows.length>0) 
// 														{
// 															arrayMemberChange = rows;															
// 															var GameServer = require("./../Login/Login/login.js");
// 															var gameServer = new GameServer();
// 															exports.gameServer = gameServer;																
// 															for (var i = 0; i < arraySendUpMember.length; i++) 
// 													  		{
// 													  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySendUpMember[i].MemberName)).length >0) 
// 													  			{	
// 												  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySendUpMember[i].MemberName)].idSocket).emit('R_DOWN_MEMBER_IN_GUILD',
// 																	{
// 																		arrayMemberChange:arrayMemberChange,																		
// 												                	});													  													  															  								                	
// 													  			}													  							  			
// 													  		}
// 													  		connection.release();			 
// 														}
// 													}
// 												})
// 											}
// 										}
// 									});
// 								}
// 							}
// 						}
// 					});														     	
// 		   		});		
// 			});

// 			//Policy
// 			socket.on('S_POLICY_OF_GUILD', function (data)
// 			{				
// 				currentSENDPOLICYOFGUILD = getcurrentSENDPOLICYOFGUILD(data);
// 				console.log("data receive S_POLICY_OF_GUILD============: "+ currentSENDPOLICYOFGUILD.Details+"_"
// 											+ currentSENDPOLICYOFGUILD.LeaderName+"_"											
// 											+ currentSENDPOLICYOFGUILD.GuildName);																		
// 				database.getConnection(function(err,connection)
// 				{	
// 					//nâng cấp member lên CoLeader và thông báo cho các user khác
// 					connection.query("UPDATE policys SET Details = '"+ currentSENDPOLICYOFGUILD.Details+"' where GuildName = '"+
// 						currentSENDPOLICYOFGUILD.GuildName+"' AND LeaderName = '"+currentSENDPOLICYOFGUILD.LeaderName+"'",function(error, result, field)
// 					{
// 						if(!!error){DetailError = ('guildmanager: Error in query 42');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (result.affectedRows>0) 
// 							{
// 								connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDPOLICYOFGUILD.GuildName+"'",function(error, rows)
// 								{
// 									if (!!error){DetailError = ('guildmanager: Error in query 43');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (rows.length>0) 
// 										{
// 											arrayPolicyChange = rows;
// 											var GameServer = require("./../Login/Login/login.js");
// 											var gameServer = new GameServer();
// 											exports.gameServer = gameServer;																
// 											for (var i = 0; i < arrayPolicyChange.length; i++) 
// 									  		{
// 									  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayPolicyChange[i].MemberName)).length >0) 
// 									  			{	
// 								  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayPolicyChange[i].MemberName)].idSocket).emit('R_POLICY_CHANGE',
// 													{
// 														GuildName : currentSENDPOLICYOFGUILD.GuildName,
// 														LeaderName : currentSENDPOLICYOFGUILD.LeaderName,	
// 														Details : currentSENDPOLICYOFGUILD.Details,																																
// 								                	});								  															  								                	
// 									  			}													  							  			
// 									  		}	
// 									  		connection.release();		 
// 										}		
// 									}
// 								})	
// 							}
// 						}
// 					});													     	
// 		   		});		
// 			});	

// 			//Đóng góp cho guild
// 			socket.on('S_RESOURCE_DONATE', function (data)
// 			{				
// 				currentSENDRESOURCEDONATE = getcurrentSENDRESOURCEDONATE(data);
// 				console.log("data receive S_RESOURCE_DONATE============: "+ currentSENDRESOURCEDONATE.GuildName+"_"
// 											+ currentSENDRESOURCEDONATE.UserName+"_"
// 											+ currentSENDRESOURCEDONATE.Diamond+"_"
// 											+ currentSENDRESOURCEDONATE.numberBase+"_"
// 											+ currentSENDRESOURCEDONATE.DiamondQuality+"_"
// 											+ currentSENDRESOURCEDONATE.Farm+"_"
// 											+ currentSENDRESOURCEDONATE.FarmQuality+"_"
// 											+ currentSENDRESOURCEDONATE.Wood+"_"
// 											+ currentSENDRESOURCEDONATE.WoodQuality+"_"
// 											+ currentSENDRESOURCEDONATE.Stone+"_"
// 											+ currentSENDRESOURCEDONATE.StoneQuality+"_"
// 											+ currentSENDRESOURCEDONATE.Metal+"_"
// 											+ currentSENDRESOURCEDONATE.MetalQuality);																		
// 				database.getConnection(function(err,connection)
// 				{	
// 					var arrayDiamondGuild = [];
// 					//Lấy diamond
// 					connection.query("SELECT A.Diamond, B.Wood, B.Stone, B.Farm, B.Metal, C.TimeTransport FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN resourceupguild AS C ON C.Level = '"+
// 						currentSENDRESOURCEDONATE.GuildLevel+"' WHERE A.UserName = '"+currentSENDRESOURCEDONATE.UserName+"'AND B.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, rows)
// 					{
// 						if (!!error) {DetailError = ('guildmanager: Error in query 44');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							console.log((parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Diamond)
// 								+"_"+(parseFloat(rows[0].Farm) - parseFloat(currentSENDRESOURCEDONATE.FarmQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Farm)
// 								+"_"+(parseFloat(rows[0].Wood) - parseFloat(currentSENDRESOURCEDONATE.WoodQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Wood)
// 								+"_"+(parseFloat(rows[0].Stone) - parseFloat(currentSENDRESOURCEDONATE.StoneQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Stone)
// 								+"_"+(parseFloat(rows[0].Metal) - parseFloat(currentSENDRESOURCEDONATE.MetalQuality))+"="+parseFloat(currentSENDRESOURCEDONATE.Metal));

// 							if ((rows.length>0)
// 								&&((parseFloat(rows[0].Diamond) - parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
// 								&&(parseFloat(currentSENDRESOURCEDONATE.FarmQuality)=== 0)
// 								&&(parseFloat(currentSENDRESOURCEDONATE.WoodQuality)=== 0)
// 								&&(parseFloat(currentSENDRESOURCEDONATE.StoneQuality)=== 0)
// 								&&(parseFloat(currentSENDRESOURCEDONATE.MetalQuality)=== 0))  
// 							{
// 								//update tài nguyên còn lại của base		                		
// 								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
// 									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
// 									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
// 									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
// 									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
// 									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
// 									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
// 									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
// 									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
// 									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
// 									+"',guildlistmember.TimeComplete ='"+0
// 									+"',guildlistmember.TimeRemain ='"+0								
// 									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
// 									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
// 									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
// 									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
// 									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
// 									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
// 									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
// 									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
// 								{
// 									if(!!error){DetailError = ('guildmanager: Error in query 45');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (result.affectedRows>0) 
// 										{
// 											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows)
// 											{
// 												if (!!error){DetailError = ('guildmanager: Error in query 46');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														arrayDiamondGuild = rows;
// 														connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 47');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{
// 																	arrayGuildDonate = rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;																
// 																	for (var i = 0; i < arrayGuildDonate.length; i++) 
// 															  		{
// 															  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
// 															  			{	
// 														  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('R_RESOURCE_DIAMOND_DONATE',
// 																			{
// 																				Diamond:arrayDiamondGuild,																																																																								
// 														                	});								  															  								                	
// 															  			}													  							  			
// 															  		}	
// 															  		connection.release();		 
// 																}
// 															}
// 														})
// 													}
// 												}
// 											});											
// 										}
// 									}
// 								});					
// 							}else if ((rows.length>0)
// 								&&((parseFloat(rows[0].Diamond) -parseFloat(currentSENDRESOURCEDONATE.DiamondQuality))=== parseFloat(currentSENDRESOURCEDONATE.Diamond))
// 								&&((parseFloat(rows[0].Farm) -parseFloat(currentSENDRESOURCEDONATE.FarmQuality))=== parseFloat(currentSENDRESOURCEDONATE.Farm))
// 								&&((parseFloat(rows[0].Wood) -parseFloat(currentSENDRESOURCEDONATE.WoodQuality))=== parseFloat(currentSENDRESOURCEDONATE.Wood))
// 								&&((parseFloat(rows[0].Stone) -parseFloat(currentSENDRESOURCEDONATE.StoneQuality))=== parseFloat(currentSENDRESOURCEDONATE.Stone))
// 								&&((parseFloat(rows[0].Metal) -parseFloat(currentSENDRESOURCEDONATE.MetalQuality))=== parseFloat(currentSENDRESOURCEDONATE.Metal)))  
// 							{
// 								//update tài nguyên còn lại của base
// 		                		d = new Date();
// 		        				createPositionTimelast = Math.floor(d.getTime() / 1000);
// 								connection.query("UPDATE users,userbase, guildlistmember, guildlist SET users.Diamond = '"+currentSENDRESOURCEDONATE.Diamond
// 									+"',guildlistmember.FarmWait = '"+currentSENDRESOURCEDONATE.FarmQuality
// 									+"',guildlistmember.WoodWait = '"+currentSENDRESOURCEDONATE.WoodQuality
// 									+"',guildlistmember.StoneWait = '"+currentSENDRESOURCEDONATE.StoneQuality
// 									+"',guildlistmember.MetalWait ='"+currentSENDRESOURCEDONATE.MetalQuality
// 									+"',guildlistmember.Farm = guildlistmember.Farm + '"+currentSENDRESOURCEDONATE.FarmQuality
// 									+"',guildlistmember.Wood = guildlistmember.Wood +  '"+currentSENDRESOURCEDONATE.WoodQuality
// 									+"',guildlistmember.Stone = guildlistmember.Stone + '"+currentSENDRESOURCEDONATE.StoneQuality
// 									+"',guildlistmember.Metal = guildlistmember.Metal + '"+currentSENDRESOURCEDONATE.MetalQuality
// 									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
// 									+"',guildlistmember.Diamond = guildlistmember.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality
// 									+"',guildlistmember.TimeComplete ='"+(parseFloat(rows[0].TimeTransport)+parseFloat(createPositionTimelast))
// 									+"',guildlistmember.TimeRemain ='"+parseFloat(rows[0].TimeTransport)
// 									+"',userbase.Farm = '"+currentSENDRESOURCEDONATE.Farm
// 									+"',userbase.Wood = '"+currentSENDRESOURCEDONATE.Wood
// 									+"',userbase.Stone = '"+currentSENDRESOURCEDONATE.Stone
// 									+"',userbase.Metal ='"+currentSENDRESOURCEDONATE.Metal
// 									+"',guildlist.Diamond = guildlist.Diamond +'"+currentSENDRESOURCEDONATE.DiamondQuality									
// 									+"' where users.UserName = userbase.UserName AND users.UserName = guildlistmember.MemberName AND guildlistmember.MemberName = '"+currentSENDRESOURCEDONATE.UserName
// 									+"'AND guildlist.GuildName = '"+currentSENDRESOURCEDONATE.GuildName
// 									+"'AND userbase.numberBase = '"+currentSENDRESOURCEDONATE.numberBase+"'",function(error, result, field)
// 								{
// 									if(!!error){DetailError = ('guildmanager: Error in query 48');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (result.affectedRows>0) 
// 										{
// 											connection.query("SELECT A.Diamond, B.Diamond as DiamondDonate, B.MemberName,B.Farm,B.Wood,B.Stone,B.Metal FROM guildlist AS A INNER JOIN guildlistmember AS B ON A.GuildName = B.GuildName WHERE B.MemberName = '"+currentSENDRESOURCEDONATE.UserName+"'",function(error, rows)
// 											{
// 												if (!!error){DetailError = ('guildmanager: Error in query 49');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														arrayDiamondGuild = rows;
// 														connection.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDRESOURCEDONATE.GuildName+"'",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 50');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{
// 																	arrayGuildDonate = rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;																
// 																	for (var i = 0; i < arrayGuildDonate.length; i++) 
// 															  		{
// 															  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].MemberName)).length >0) 
// 															  			{	
// 														  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].MemberName)].idSocket).emit('R_RESOURCE_DIAMOND_DONATE',
// 																			{
// 																				Diamond:arrayDiamondGuild,																																																																												
// 														                	});								  															  								                	
// 															  			}													  							  			
// 															  		}
// 															  		connection.release();			 
// 																}
// 															}
// 														})
// 													}
// 												}
// 											});											
// 										}
// 									}
// 								});				

// 							}
// 						}
// 					});						     	
// 		   		});		
// 			});	

// 			//Update guild
// 			socket.on('S_UP_GUILD', function (data)
// 			{
// 				var arrayAfterUpdate = [], arrayGuildDonate = [],DiamondRemain =0; 			
// 				currentSENDUPGUILD = getcurrentSENDUPGUILD(data);
// 				console.log("data receive S_UP_GUILD=========: "+currentSENDUPGUILD.GuildName);														
// 				database.getConnection(function(err,connection)
// 				{	
// 					connection.query("SELECT A.Diamond As DiamondConsumption, A.Level, B.Diamond FROM resourceupguild AS A INNER JOIN guildlist AS B WHERE B.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND  A.Level = B.Level + 1",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 51');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{	 
// 							if ((rows.length>0))  
// 							{
// 								//tính toán dử liệu sau khi nâng cấp								
// 								arrayAfterUpdate.push(rows[0].Level);
// 								arrayAfterUpdate.push(currentSENDUPGUILD.GuildName);
// 								DiamondRemain = parseFloat(rows[0].Diamond - rows[0].DiamondConsumption);

// 								//thực hiện nâng cấp guild
// 								connection.query("UPDATE guildlist,guildlistmember SET guildlist.Diamond = '"+DiamondRemain+"',guildlist.Level = '"+rows[0].Level+"', guildlistmember.LevelGuild = '"+rows[0].Level
// 									+"' where guildlist.GuildName = '"+currentSENDUPGUILD.GuildName+"' AND guildlistmember.GuildName = '"+currentSENDUPGUILD.GuildName+"'",function(error, result, field)
// 								{
// 									if(!!error){DetailError = ('guildmanager: Error in query 52');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (result.affectedRows>0) 
// 										{
// 											connection.query("SELECT UserName FROM `users` WHERE 1",function(error, rows)
// 											{
// 												if (!!error){DetailError = ('guildmanager: Error in query 53');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														arrayAfterUpdate.push(DiamondRemain); 
// 														arrayGuildDonate = rows;
// 														var GameServer = require("./../Login/Login/login.js");
// 														var gameServer = new GameServer();
// 														exports.gameServer = gameServer;																
// 														for (var i = 0; i < arrayGuildDonate.length; i++) 
// 												  		{
// 												  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildDonate[i].UserName)).length >0) 
// 												  			{	
// 											  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildDonate[i].UserName)].idSocket).emit('R_DATA_UP_GUILD',
// 																{
// 																	arrayAfterUpdate:arrayAfterUpdate,																																																																					
// 											                	});								  															  								                	
// 												  			}													  							  			
// 												  		}
// 												  		connection.release();			 
// 													}
// 												}
// 											})
// 										}
// 									}
// 								});

// 							}
// 						}
// 					});
// 				});
// 			});

// 			//remove member in guild 
// 			socket.on('S_REMOVE_MEMBER_IN_GUILD', function (data)
// 			{				
// 				currentSENDREMOVEMEMBERINGUILD = getcurrentSENDINFOGUILD(data);
// 				var arrayUserRemoved =[],arrayAllUsers =[];
// 				console.log("===============data receive S_REMOVE_MEMBER_IN_GUILD: "+currentSENDREMOVEMEMBERINGUILD.GuildName+"_"+currentSENDREMOVEMEMBERINGUILD.UserName);

// 				//update tài nguyên còn lại của base
//         		d = new Date();
// 				createPositionTimelast = Math.floor(d.getTime() / 1000);
// 				var query = database.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
// 					+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDREMOVEMEMBERINGUILD.UserName
// 					+"'AND guildlist.GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName									
// 					+"'AND guildlistmember.MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, result, field)
// 				{
// 					if(!!error){DetailError = ('guildmanager: Error in query 54');
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);	
// 					}else
// 					{
// 						if (result.affectedRows>0) 
// 						{
// 							var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName
// 										+"' AND MemberName = '"+currentSENDREMOVEMEMBERINGUILD.UserName+"'",function(error, rows)
// 							{
// 								if (!!error){DetailError = ('guildmanager: Error in query 55');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);
// 								}else
// 								{
// 									if (rows.length>0) 
// 									{
// 										arrayUserRemoved =rows;
// 										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows)
// 										{
// 											if (!!error){DetailError = ('guildmanager: Error in query 56');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													arrayGuildNotify = rows;
// 													var GameServer = require("./../Login/Login/login.js");
// 													var gameServer = new GameServer();
// 													exports.gameServer = gameServer;																
// 													for (var i = 0; i < arrayGuildNotify.length; i++) 
// 											  		{
// 											  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
// 											  			{	
// 										  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_REMOVE_MEMBER_IN_GUILD',
// 															{
// 																arrayUserRemoved:arrayUserRemoved,																																																																												
// 										                	});											  													  															  								                	
// 											  			}													  							  			
// 											  		}			 
// 												}
// 											}
// 										})	

// 										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
// 										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDREMOVEMEMBERINGUILD.GuildName+"'",function(error, rows)
// 										{
// 											if (!!error){DetailError = ('guildmanager: Error in query 57');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													arrayAllUsers =rows;															
// 							                    	var GameServer = require("./../Login/Login/login.js");
// 													var gameServer = new GameServer();
// 													exports.gameServer = gameServer;																
// 													for (var i = 0; i < arrayAllUsers.length; i++) 
// 											  		{
// 											  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
// 											  			{	
// 										  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('R_INFOMATION_GUILD',
// 															{
// 																arrayUserRemoved:arrayUserRemoved,																																																																												
// 										                	});											  													  															  								                	
// 											  			}													  							  			
// 											  		}
// 												}
// 											}
// 										});												
// 									}
// 								}
// 							});
// 						}
// 					}
// 				});	
// 			});

// 			//chuyển đổi tài nguyên từ tài nguyên này thành tài nguyên khác
// 			socket.on('S_CHANGE_RESOURCE_GUILD', function (data)
// 			{
// 				currentSENDCHANGERESOURCEGUILD = getcurrentSENDCHANGERESOURCEGUILD(data);
// 				console.log("=========Data receive S_CHANGE_RESOURCE_GUILD "+currentSENDCHANGERESOURCEGUILD.GuildName
// 					+"_"+currentSENDCHANGERESOURCEGUILD.UserName
// 					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceFrom
// 					+"_"+currentSENDCHANGERESOURCEGUILD.QualityResourceFrom
// 					+"_"+currentSENDCHANGERESOURCEGUILD.NameResourceTo
// 					+"_"+currentSENDCHANGERESOURCEGUILD.DiamondUse);

// 				var checkQuality,arrayGuildNotify=[],PercentChange=0;

// 				switch(currentSENDCHANGERESOURCEGUILD.DiamondUse) 
// 				{										
// 					case "0":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.5;
// 					}break;
// 					case "1":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) *0.6;
// 					}break;
// 					case "2":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.7;
// 					}break;
// 					case "3":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.8;
// 					}break;
// 					case "4":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*0.9;
// 					}break;
// 					case "5":
// 					{
// 						PercentChange = parseFloat(currentSENDCHANGERESOURCEGUILD.QualityResourceFrom)*1;
// 					}break;
// 					default:

// 				}

// 				database.getConnection(function(err,connection)
// 				{
// 					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
// 					{
// 						if (!!error)
// 						{
// 							DetailError = ('guildmanager: Error in query 58');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (rows.length>0) 
// 							{								
// 								switch(currentSENDCHANGERESOURCEGUILD.NameResourceFrom) 
// 								{
// 									case "Farm":
// 									{
// 										if (rows[0].Farm >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
// 										{																					
// 											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
// 										}else
// 										{
// 											DetailError = ("guildmanager: khong du farm");
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}										
// 									}break;
// 									case "Wood":
// 									{
// 										if (rows[0].Wood >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
// 										{
// 											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
// 										}else
// 										{
// 											DetailError = ("guildmanager: khong du wood");
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}										
// 									}break;
// 									case "Stone":
// 									{
// 										if (rows[0].Stone >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
// 										{
// 											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
// 										}else
// 										{
// 											DetailError = ("guildmanager: khong du stone");
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}										
// 									}break;
// 									case "Metal":
// 									{
// 										if (rows[0].Metal >= currentSENDCHANGERESOURCEGUILD.QualityResourceFrom) 
// 										{
// 											TransferUpdate(currentSENDCHANGERESOURCEGUILD.NameResourceFrom,currentSENDCHANGERESOURCEGUILD.QualityResourceFrom,currentSENDCHANGERESOURCEGUILD.NameResourceTo,PercentChange,currentSENDCHANGERESOURCEGUILD.DiamondUse,currentSENDCHANGERESOURCEGUILD.GuildName);
// 										}else
// 										{
// 											DetailError = ("guildmanage: khong du Metal");
// 											console.log(DetailError);
// 											functions.writeLogErrror(DetailError);	
// 										}										
// 									}break;
// 									default:
// 			        					console.log(" mac dinh");
// 								}
// 								connection.query("SELECT MemberName FROM `guildlistmember` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
// 								{
// 									if (!!error){DetailError = ('guildmanager: Error in query 59');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (rows.length>0) 
// 										{
// 											arrayGuildNotify = rows;
// 											connection.query("SELECT Farm, Wood, Stone, Metal, Diamond FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEGUILD.GuildName+"'",function(error, rows)
// 											{
// 												if (!!error){DetailError = ('guildmanager: Error in query 60');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														var GameServer = require("./../Login/Login/login.js");
// 														var gameServer = new GameServer();
// 														exports.gameServer = gameServer;																
// 														for (var i = 0; i < arrayGuildNotify.length; i++) 
// 												  		{											  			

// 												  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
// 												  			{	
// 											  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_RESOURCE_CHANGE',
// 																{
// 																	arrayResourceChange:rows[0],																																																																												
// 											                	});											                	 									  													  															  								                	
// 												  			}													  							  			
// 												  		}
// 												  		connection.release();	
// 													}
// 												}
// 											});													 
// 										}			
// 									}
// 								})
// 							}
// 						}
// 					});
// 				});					
// 			});

// 			//chuyển tai nguyen thanh kim cương
// 			socket.on('S_CHANGE_RESOURCE_DIAMOND_GUILD', function (data)
// 			{				
// 				currentSENDCHANGERESOURCEDIAMONDGUILD = getcurrentSENDCHANGERESOURCEDIAMONDGUILD(data);
// 				console.log("Data receive S_CHANGE_RESOURCE_DIAMOND_GUILD"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName					
// 					+"_"+currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom);
// 				var checkResourceaDiamond=625000,arrayGuildNotify=[],PercentChange=0,arrayGuild=[];
// 				database.getConnection(function(err,connection)
// 				{
// 					connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName+"'",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 61');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (rows.length>0) 
// 							{	
// 								arrayGuild = rows;
// 								//trong ngày công dồn
// 								connection.query("SELECT Quality FROM `resourcetodiamond` WHERE idresourcetodiamond = '"+(parseFloat(arrayGuild[0].numberResourceToDiamon)+1)+"'",function(error, rows)
// 								{
// 									if (!!error){DetailError = ('guildmanager: Error in query 62');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (rows.length>0) 
// 										{
// 											//cộng dồn bình thường
// 											switch(currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom) 
// 											{
// 												case "Farm":
// 												{													
// 													if (parseFloat(arrayGuild[0].Farm)>=parseFloat(rows[0].Quality))
// 													{
// 														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
// 													}													
// 												}break;

// 												case "Wood":
// 												{													
// 													if (parseFloat(arrayGuild[0].Wood)>=parseFloat(rows[0].Quality))
// 													{
// 														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
// 													}
// 												}break;

// 												case "Stone":
// 												{												
// 													if (parseFloat(arrayGuild[0].Stone)>=parseFloat(rows[0].Quality))
// 													{
// 														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
// 													}
// 												}break;

// 												case "Metal":
// 												{													
// 													if (parseFloat(arrayGuild[0].Metal)>=parseFloat(rows[0].Quality))
// 													{
// 														UpdateResourceToDiamond(rows[0].Quality,currentSENDCHANGERESOURCEDIAMONDGUILD.NameResourceFrom,currentSENDCHANGERESOURCEDIAMONDGUILD.GuildName,io);
// 													}									
// 												}break;

// 												default:
// 						        				console.log(" mac dinh");
// 											}
// 										}
// 									}
// 								});																								
// 							}
// 						}
// 					});

// 				});

// 			});

// 			//Chuyển tài nguyên của guild cho một user->base
// 			socket.on('S_TRANSFER_RESOURCE_OF_GUILD_TO_USER', function (data)
// 			{				
// 				currentSENDTRANSFERRESOURCEDOFGUILDTOUSER = getcurrentSENDTRANSFERRESOURCEDOFGUILDTOUSER(data);
// 				console.log("data receive S_TRANSFER_RESOURCE_OF_GUILD_TO_USER"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName
// 					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName
// 					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
// 					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm
// 					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood
// 					+"_"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone+"_"+
// 					currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
// 				var arrayGuildAfterSendResource = [], arraySentResourceOfGuildToUser=[], arrayGuildAfterSendResourceBase=[], FarmFromGuild=0, WoodFromGuild=0,
// 					StoneFromGuild=0, MetalFromGuild=0;
// 				database.getConnection(function(err,connection)
// 				{

// 					connection.query("SELECT A.`MaxStorage`, B.Wood, B.Stone, B.Farm, B.Metal FROM resourceupgranary AS A INNER JOIN userbase AS B ON A.Level = B.LvGranary WHERE B.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase+"'",function(error, rows)
// 					{
// 						if (!!error){DetailError = ('guildmanager: Error in query 63');
// 							console.log(DetailError);
// 							functions.writeLogErrror(DetailError);	
// 						}else
// 						{
// 							if (rows.length>0) 
// 							{
// 								if ((parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm))>parseFloat(rows[0].MaxStorage))
// 								{
// 									FarmFromGuild = parseFloat(rows[0].MaxStorage);
// 								}else
// 								{
// 									FarmFromGuild=parseFloat(rows[0].Farm) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm);
// 								}
// 								if((parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood))>parseFloat(rows[0].MaxStorage))
// 								{
// 									WoodFromGuild = parseFloat(rows[0].MaxStorage);
// 								}else
// 								{
// 									WoodFromGuild=parseFloat(rows[0].Wood) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood);
// 								}

// 								if((parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone))>parseFloat(rows[0].MaxStorage))
// 								{
// 									StoneFromGuild = parseFloat(rows[0].MaxStorage);
// 								}else
// 								{
// 									StoneFromGuild = parseFloat(rows[0].Stone) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone);
// 								}

// 								if((parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal))>parseFloat(rows[0].MaxStorage))
// 								{
// 									MetalFromGuild = parseFloat(rows[0].MaxStorage);
// 								}else
// 								{
// 									MetalFromGuild = parseFloat(rows[0].Metal) +parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal);
// 								}	

// 								connection.query("UPDATE userbase,guildlist SET userbase.Farm = '"+parseFloat(FarmFromGuild)
// 								+"',userbase.Wood = '"+parseFloat(WoodFromGuild)
// 								+"',userbase.Stone = '"+parseFloat(StoneFromGuild)
// 								+"',userbase.Metal = '"+parseFloat(MetalFromGuild)
// 								+"',guildlist.Farm = guildlist.Farm - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Farm)
// 								+"',guildlist.Wood = guildlist.Wood - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Wood)
// 								+"',guildlist.Stone = guildlist.Stone - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Stone)
// 								+"',guildlist.Metal = guildlist.Metal - '"+(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.Metal)		
// 								+"'where userbase.idBase = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase
// 			        			+"' AND guildlist.GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, result, field)
// 								{
// 									if(!!error){DetailError = ('guildmanager: Error in query 64');
// 										console.log(DetailError);
// 										functions.writeLogErrror(DetailError);	
// 									}else
// 									{
// 										if (result.affectedRows>0) 
// 										{											
// 											connection.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 1 AND GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows)
// 											{
// 												if (!!error){DetailError = ('guildmanager: Error in query 65');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														arraySentResourceOfGuildToUser = rows;														
// 														connection.query("SELECT * FROM `guildlist` WHERE GuildName = '"+currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.GuildName+"'",function(error, rows)
// 														{
// 															if (!!error){DetailError = ('guildmanager: Error in query 66');
// 																console.log(DetailError);
// 																functions.writeLogErrror(DetailError);	
// 															}else
// 															{
// 																if (rows.length>0) 
// 																{
// 																	arrayGuildAfterSendResource =rows;
// 																	var GameServer = require("./../Login/Login/login.js");
// 																	var gameServer = new GameServer();
// 																	exports.gameServer = gameServer;																	
// 																	connection.query("SELECT * FROM `userbase` WHERE idBase = '"+parseFloat(currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.idBase)+"'",function(error, rows)
// 																	{
// 																		if (!!error){DetailError = ('Eguildmanager: Error in query 67');
// 																			console.log(DetailError);
// 																			functions.writeLogErrror(DetailError);	
// 																		}else
// 																		{
// 																			if (rows.length>0) 
// 																			{
// 																				arrayGuildAfterSendResourceBase=rows;
// 																				for (var i = 0; i < arraySentResourceOfGuildToUser.length; i++) 
// 																		  		{
// 																		  			var index=i;																		  			
// 																		  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arraySentResourceOfGuildToUser[index].MemberName)).length >0) 
// 																		  			{																				  				
// 																		  				if (arraySentResourceOfGuildToUser[index].MemberName===currentSENDTRANSFERRESOURCEDOFGUILDTOUSER.UserName) 
// 													  									{													  										
// 																							io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('R_RESOURCE_FROM_GUID_MEMBER',
// 																							{
// 																								arrayGuildAfterSendResourceBase:arrayGuildAfterSendResourceBase,																				
// 																		                	});
// 																						}																							

// 																		               	io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arraySentResourceOfGuildToUser[index].MemberName)].idSocket).emit('R_RESOURCE_FROM_GUID_TO_ALL_MEMBER',
// 																						{
// 																							arrayGuildAfterSendResource:arrayGuildAfterSendResource,																		
// 																	                	});						  																		  																			  												  															  								                	
// 																		  			}													  							  			
// 																		  		}
// 																		  		connection.release();
// 																		  	}
// 																		 }
// 																	});
// 																}
// 															}
// 														});		 
// 													}
// 												}
// 											})						
// 										}
// 									}
// 								});
// 							}
// 						}
// 					});					
// 				});				
// 			});

// 			//User out guild 
// 			socket.on('S_MEMBER_OUT_GUILD', function (data)
// 			{				
// 				currentSENDMEMBEROOUTGUILD = getcurrentSENDINFOGUILD(data);
// 				var arrayUserRemoved =[],arrayGuildNotify =[],arrayAllUsers =[];
// 				//update tài nguyên còn lại của base
//         		d = new Date();
// 				createPositionTimelast = Math.floor(d.getTime() / 1000);
// 				var query = database.query("UPDATE users, guildlist,guildlistmember SET users.GuildName = '', guildlistmember.TimeRemainOutGuild = '"+(parseFloat(createPositionTimelast)+7200)
// 					+"',guildlist.Quality = guildlist.Quality -1,guildlistmember.ActiveStatus = 2 where users.UserName = '"+currentSENDMEMBEROOUTGUILD.UserName
// 					+"'AND guildlist.GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName									
// 					+"'AND guildlistmember.MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, result, field)
// 				{
// 					if(!!error){DetailError = ('guildmanager: Error in query 68');
// 						console.log(DetailError);
// 						functions.writeLogErrror(DetailError);	
// 					}else
// 					{
// 						if (result.affectedRows>0) 
// 						{
// 							var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName
// 										+"' AND MemberName = '"+currentSENDMEMBEROOUTGUILD.UserName+"'",function(error, rows)
// 							{
// 								if (!!error){DetailError = ('guildmanager: Error in query 69');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if (rows.length>0) 
// 									{
// 										arrayUserRemoved =rows;
// 										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows)
// 										{
// 											if (!!error){DetailError = ('guildmanager: Error in query 70');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													arrayGuildNotify = rows;
// 													var GameServer = require("./../Login/Login/login.js");
// 													var gameServer = new GameServer();
// 													exports.gameServer = gameServer;																
// 													for (var i = 0; i < arrayGuildNotify.length; i++) 
// 											  		{
// 											  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayGuildNotify[i].MemberName)).length >0) 
// 											  			{	
// 										  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayGuildNotify[i].MemberName)].idSocket).emit('R_MEMBER_OUT_GUILD',
// 															{
// 																arrayUserRemoved:arrayUserRemoved,																																																																												
// 										                	});													  													  															  								                	
// 											  			}													  							  			
// 											  		}			 
// 												}
// 											}
// 										})	

// 										//Gửi thông tin cho tất cả các người chơi về gui hiện tại
// 										var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName != '"+currentSENDMEMBEROOUTGUILD.GuildName+"'",function(error, rows)
// 										{
// 											if (!!error)
// 											{
// 												DetailError = ('guildmanager: Error in query 71');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													arrayAllUsers =rows;															
// 							                    	var GameServer = require("./../Login/Login/login.js");
// 													var gameServer = new GameServer();
// 													exports.gameServer = gameServer;																
// 													for (var i = 0; i < arrayAllUsers.length; i++) 
// 											  		{
// 											  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllUsers[i].MemberName)).length >0) 
// 											  			{	
// 										  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllUsers[i].MemberName)].idSocket).emit('R_INFOMATION_GUILD',
// 															{
// 																arrayUserRemoved:arrayUserRemoved,																																																																												
// 										                	});													  													  															  								                	
// 											  			}													  							  			
// 											  		}
// 												}
// 											}
// 										});												
// 									}
// 								}
// 							});									
// 						}

// 					}
// 				});						

// 			});
//         })
// 		cron.schedule('*/1 * * * * *',function()
// 		{			
// 			d = new Date();
// 	    	createPositionTimelast = Math.floor(d.getTime() / 1000);	    	
// 			//kiem tra reset join guild			
// 	    	var arrayResetJoin=[],arrayLeader=[]; 			
//     		var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 0 AND TimeReset <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
// 			{
// 				if (!!error){DetailError = ('guildmanager: Error in query 72');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);	
// 				}else
// 				{
// 					if (rows.length>0) 
// 					{
// 						arrayResetJoin = rows;
// 						for (var i = 0; i < arrayResetJoin.length; i++) 
// 				  		{
// 				  			var index = i;					  			
// 				  			var query = database.query("DELETE FROM guildlistmember WHERE ActiveStatus= 0 AND GuildName = '"+arrayResetJoin[index].GuildName
// 				  				+"' AND MemberName = '"+arrayResetJoin[index].MemberName+"'",function(error, result, field)
// 						  	{
// 								if(!!error){DetailError = ('guildmanager: Error in query 73');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if(result.affectedRows>0)
// 									{	
// 										var GameServer = require("./../Login/Login/login.js");
// 									    var gameServer = new GameServer();
// 									    exports.gameServer = gameServer;									
// 										if (gameServer.redisDatas.length>0) 
// 										{		
// 								  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayResetJoin[index].MemberName)).length >0) 
// 								  			{								  				

// 							  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayResetJoin[index].MemberName)].idSocket).emit('R_RESET_JOIN_GUILD',
// 												{
// 													ExpireInviteToJoinGuild:arrayResetJoin[index],
// 							                	});							                							                	

// 								  			}									  			
// 								  			var query = database.query("SELECT * FROM `guildlistmember` WHERE GuildName = '"+arrayResetJoin[index].GuildName+"' AND PositionGuild = 'Leader'",function(error, rows)
// 											{

// 												if (!!error){DetailError = ('guildmanager: Error in query 74');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if (rows.length>0) 
// 													{
// 														arrayLeader = rows;														
// 														for (var k = 0; k < arrayLeader.length; k++) 
// 														{
// 															if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayLeader[k].MemberName)).length >0) 
// 												  			{													  				
// 											  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayLeader[k].MemberName)].idSocket).emit('R_RESET_JOIN_GUILD',
// 																{
// 																	ExpireInviteToJoinGuild:arrayResetJoin[index],
// 											                	});							                														  									  								                	
// 												  			}	
// 														}													
// 													}
// 												}
// 											});
// 							  			}
// 									}
// 								}
// 							})				  			
// 				  		}			 
// 					}
// 				}
// 			})

// 			//kiểm tra thoi gian out guild
// 			//====================================			
// 	    	var arrayResetOutGuild=[],arrayMember=[];  		    						
//     		var query = database.query("SELECT * FROM `guildlistmember` WHERE ActiveStatus = 2 AND TimeRemainOutGuild <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
// 			{
// 				if (!!error){DetailError = ('guildmanager: Error in query 75');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);	
// 				}else
// 				{
// 					if (rows.length>0) 
// 					{						
// 						arrayResetOutGuild = rows;
// 						for (var i = 0; i < arrayResetOutGuild.length; i++) 
// 				  		{
// 				  			var index = i;					  			
// 				  			var query = database.query("DELETE FROM guildlistmember WHERE ActiveStatus= 2 AND GuildName = '"+arrayResetOutGuild[index].GuildName
// 				  				+"' AND MemberName = '"+arrayResetOutGuild[index].MemberName+"'",function(error, result, field)
// 						  	{
// 								if(!!error){DetailError = ('guildmanager: Error in query 76');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									var GameServer = require("./../Login/Login/login.js");
// 								    var gameServer = new GameServer();
// 								    exports.gameServer = gameServer;
// 									if((result.affectedRows>0) && (gameServer.redisDatas.length>0))
// 									{																																					  			
// 							  			var query = database.query("SELECT * FROM `users` WHERE 1",function(error, rows)
// 										{									
// 											if (!!error){DetailError = ('guildmanager: Error in query 77');
// 												console.log(DetailError);
// 												functions.writeLogErrror(DetailError);	
// 											}else
// 											{
// 												if (rows.length>0) 
// 												{
// 													arrayMember = rows;														
// 													for (var k = 0; k < arrayMember.length; k++) 
// 													{
// 														if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayMember[k].UserName)).length >0) 
// 											  			{													  				
// 										  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayMember[k].UserName)].idSocket).emit('R_RESET_OUT_GUILD',
// 															{
// 																ArrayOutGuild:arrayResetOutGuild[index],
// 										                	});							                														  									  								                	
// 											  			}	
// 													}													
// 												}
// 											}
// 										});							  			
// 									}
// 								}
// 							})				  			
// 				  		}			 
// 					}
// 				}
// 			})

// 			//kiểm tra hoàn tất thời gian đóng góp tài nguyên
// 			//=======================================			
// 	    	var arrayMaxStorage =[],
// 			FarmRemain,WoodRemain,StoneRemain,MetalRemain,FarmOver,WoodOver,StoneOver,MetalOver; 								
//     		var query = database.query("SELECT * FROM `guildlistmember` WHERE TimeRemain > 0 AND TimeComplete <= '"+parseFloat(createPositionTimelast)+"'",function(error, rows)
// 			{
// 				if (!!error){DetailError = ('guildmanager: Error in query 77');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);	
// 				}else
// 				{
// 					if (rows.length>0) 
// 					{												
// 						arrayDonateComplete = rows;						
// 						for (var i = 0; i < arrayDonateComplete.length; i++) 
// 				  		{
// 				  			var index = i;
// 				  			FarmRemain=0,WoodRemain=0,StoneRemain=0,MetalRemain=0;
// 				  			//Kiểm tra tài nguyên hiên tại của guild xem có max chưa				  			
// 				  			var query = database.query("SELECT * FROM `guildlist` WHERE GuildName = '"+arrayDonateComplete[index].GuildName+"'",function(error, rows)
// 							{
// 								if (!!error){DetailError = ('guildmanager: Error in query 78');
// 									console.log(DetailError);
// 									functions.writeLogErrror(DetailError);	
// 								}else
// 								{
// 									if (rows.length>0) 
// 									{
// 										arrayMaxStorage =rows;
// 										var GameServer = require("./../Login/Login/login.js");
// 									    var gameServer = new GameServer();
// 									    exports.gameServer = gameServer;
// 										if (((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											||((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											||((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											||((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))) 
// 										{
// 											console.log("vuot qua resource======================================="+parseFloat(arrayMaxStorage[0].MaxStorage));
// 											if ((arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											{												
// 												FarmRemain = parseFloat(arrayMaxStorage[0].MaxStorage);											 
// 											}else
// 											{
// 												FarmRemain = (arrayDonateComplete[index].FarmWait +parseFloat(arrayMaxStorage[0].Farm));											
// 											}

// 											if ((arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											{												
// 												WoodRemain = parseFloat(arrayMaxStorage[0].MaxStorage);

// 											}else
// 											{
// 												WoodRemain = (arrayDonateComplete[index].WoodWait +parseFloat(arrayMaxStorage[0].Wood));											
// 											}

// 											if ((arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											{												
// 												StoneRemain = parseFloat(arrayMaxStorage[0].MaxStorage);
// 											}
// 											else
// 											{
// 												StoneRemain = (arrayDonateComplete[index].StoneWait +parseFloat(arrayMaxStorage[0].Stone));												
// 											}

// 											if ((arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal))>=parseFloat(arrayMaxStorage[0].MaxStorage))
// 											{												
// 												MetalRemain = parseFloat(arrayMaxStorage[0].MaxStorage);												
// 											}else
// 											{
// 												MetalRemain = (arrayDonateComplete[index].MetalWait +parseFloat(arrayMaxStorage[0].Metal));												
// 											}

// 											var query = database.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = '"+parseFloat(FarmRemain)
// 											+"',guildlist.Wood =  '"+parseFloat(WoodRemain)
// 											+"',guildlist.Stone = '"+parseFloat(StoneRemain)
// 											+"',guildlist.Metal =  '"+parseFloat(MetalRemain)							
// 											+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
// 											{
// 												if(!!error){DetailError = ('guildmanager: Error in query 79');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if ((result.affectedRows>0)&&(gameServer.redisDatas.length>0))
// 													{
// 														SendUpgrateDonateGuild(arrayDonateComplete[index].GuildName, io);																																							
// 													}
// 												}
// 											});	

// 										}else
// 										{											
// 											var query = database.query("UPDATE guildlist, guildlistmember SET guildlistmember.TimeRemain = 0,guildlist.Farm = guildlist.Farm + '"+arrayDonateComplete[index].FarmWait
// 											+"',guildlist.Wood = guildlist.Wood + '"+arrayDonateComplete[index].WoodWait
// 											+"',guildlist.Stone = guildlist.Stone +'"+arrayDonateComplete[index].StoneWait
// 											+"',guildlist.Metal = guildlist.Metal + '"+arrayDonateComplete[index].MetalWait							
// 											+"',guildlistmember.WoodWait=0,guildlistmember.FarmWait=0,guildlistmember.StoneWait=0,guildlistmember.MetalWait=0 where guildlist.GuildName = guildlistmember.GuildName AND guildlistmember.MemberName = '"+arrayDonateComplete[index].MemberName+"'",function(error, result, field)
// 											{
// 												if(!!error){DetailError = ('guildmanager: Error in query 80');
// 													console.log(DetailError);
// 													functions.writeLogErrror(DetailError);	
// 												}else
// 												{
// 													if ((result.affectedRows>0) && (gameServer.redisDatas.length>0)) 
// 													{
// 														SendUpgrateDonateGuild(arrayDonateComplete[index].GuildName, io);																			  												  															  														  			
// 													}
// 												}
// 											});	
// 										}
// 									}
// 								}
// 							});	  			
// 				  		}			 
// 					}
// 				}
// 			})

// 			//Cap nhat kiem tra trao doi tai nguyen va kim cuong hang ngay cua guild
// 			//Cập nhật cho các dữ liệu cần kiểm tra
// 			var dt = datetime.create();
// 			var formatted = dt.format('dmY');
// 			var arrayAllGuild = [];	
// 			//cap nhat so luong tai nguyen doi kim cuong trong 1 ngay	
// 			var query = database.query("SELECT * FROM `guildlist` WHERE DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, rows)
// 			{
// 				if (!!error){DetailError = ('guildmanager: Error in query 81');
// 					console.log(DetailError);
// 					functions.writeLogErrror(DetailError);	
// 				}else
// 				{
// 					if (rows.length>0) 
// 					{						
// 						arrayAllGuild =rows;		
// 						var query = database.query("UPDATE guildlist SET numberResourceToDiamon =0, DateResourceToDiamon='"+parseFloat(formatted)
// 							+"' where DateResourceToDiamon != '"+parseFloat(formatted)+"'",function(error, result, field)
// 						{
// 							if(!!error){DetailError = ('guildmanager: Error in query 82');
// 								console.log(DetailError);
// 								functions.writeLogErrror(DetailError);	
// 							}else
// 							{
// 								if (result.affectedRows>0) 
// 								{	
// 									var GameServer = require("./../Login/Login/login.js");
// 								    var gameServer = new GameServer();
// 								    exports.gameServer = gameServer;
// 									for (var i = 0; i < arrayAllGuild.length; i++) 
// 							  		{							  			
// 							  			if ((lodash.filter(gameServer.redisDatas, x => x.name === arrayAllGuild[i].LeaderName)).length >0) 
// 							  			{							  					
// 						  					io.in(gameServer.redisDatas[gameServer.redisDatas.findIndex(item => item.name === arrayAllGuild[i].LeaderName)].idSocket).emit('R_RESET_RESOURCE_CHANGE_DIAMOND',
// 											{
// 												numberResourceToDiamon:0,																																																																												
// 						                	});						                											  													  															  								                	
// 							  			}													  							  			
// 							  		}																																
// 								}
// 							}
// 						});					
// 					}
// 				}
// 			});
// 		});
//     }
// }

