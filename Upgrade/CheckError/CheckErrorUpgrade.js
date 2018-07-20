var database      = require('./../../Util/db.js');
var functions     = require('./../../Util/functions.js');
var sendMail      = require('./../../Util/sendMail.js');

// var current_S_UPGRADE;

exports.errorUpgrade = function errorUpgrade(current_S_UPGRADE) {
  sendMail.sendMailCheckErrorLvcty(current_S_UPGRADE);
  getCurrrentLvcity(current_S_UPGRADE, function (datalv) {
    DetailError = JSON.stringify(current_S_UPGRADE) + "\n";
    getUserDataEror(current_S_UPGRADE, function (result) {
      DetailError += JSON.stringify(result) + "\n";
      getDataEror(current_S_UPGRADE, function (result) {
        DetailError += JSON.stringify(result) + "\n";
        functions.writeLogErrrorReportUser(DetailError);
      });
    });

  });
};



function getUserDataEror(current_S_UPGRADE, callError) {
  var sql = "SELECT UserName,	LvCity, LvFarm,	CurrentLvFarm, Farm, LvWood, CurrentLvWood,Wood,	LvStone, CurrentLvStone, Stone,	LvMetal, CurrentLvMetal,	Metal  FROM userbase WHERE UserName ='" + current_S_UPGRADE.UserName + "'";
  database.query(sql, function (error, rows) {
    callError(rows);
  });
}

function getDataEror(current_S_UPGRADE, callError) {
  var tabQuery = "resourceup" + current_S_UPGRADE.UpgradeWait;
  var sql = "SELECT B.LvCity,B.Farm, B.Wood, B.Stone, B.Metal,A.Diamond, B.UpdateCounter, C.Diamond as Diamondconsumption, C.Wood as Woodconsumption,  C.Stone as Stoneconsumption, C.Farm as Farmconsumption, C.Metal as Metalconsumption, C.TimeUp FROM users AS A INNER JOIN userbase AS B ON A.UserName = B.UserName INNER JOIN " + tabQuery + " AS C ON C.Level = '" + parseFloat(current_S_UPGRADE.LevelUpgrade) + "' WHERE A.UserName = '" + current_S_UPGRADE.UserName + "'AND B.numberBase = '" + parseFloat(current_S_UPGRADE.numberBase) + "'";
  database.query(sql, function (error, rows) {
    callError(rows);
  });
}

function getCurrrentLvcity(current_S_UPGRADE, callback) {
  var sql = `SELECT LvCity FROM   userbase  WHERE UserName ='${ current_S_UPGRADE.UserName }'  AND numberBase = ${ current_S_UPGRADE.numberBase }`;
  database.query(sql, function (error, rows) {
    if (!!error) {
      DetailError = ('upgrade :Error SELECT LvCity ' + current_S_UPGRADE.UserName);
      functions.writeLogErrror(DetailError);
      callback(0);
    }
    if (rows.length > 0) {
      callback(rows)
    }
  });
}

// function get_current_S_UPGRADE(data) {
//   return current_S_UPGRADE = {
//     UserName: data.UserName,
//     numberBase: data.numberBase,
//     UpgradeWait: data.UpgradeWait,
//     LevelUpgrade: data.LevelUpgrade,
//     Farm: data.Farm,
//     Wood: data.Wood,
//     Stone: data.Stone,
//     Metal: data.Metal,
//     Diamond: data.Diamond,
//   }
// }