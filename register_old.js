'use strict';
var pool 			= require('./db');
var functions 		= require("./functions");
var currentUser,timeLogin,timeLogout,timeResetMine,d,createPositionTimelast,DetailError;


module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('S_REGISTER', function (data)
			{
				currentUser = getcurrentUser(data);
				console.log("==========data receive S_REGISTER: "
					+currentUser.name+"_"
					+currentUser.password+"_"
					+currentUser.email);
				pool.getConnection(function(err,connection)
				{				

			    	connection.query("SELECT * FROM `users` WHERE `UserName`='"+currentUser.name+"' OR `UserEmail`='"+currentUser.email+"'",function(error, rows,field)
			    	{
						if (!!error){DetailError = ('register: Error in query 1');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{					
							if (rows.length>0) {
								socket.emit('R_REGISTER_SUCCESS', {
			                    	message : '0'
			                	});
							}else
							{
								timeLogin = 0; timeLogout = 0; timeResetMine = 0;
								connection.query("INSERT INTO `users` (`UserID`,`UserName`,`UserPass`,`password_recover_key`,`password_recover_key_expire`,`UserEmail`,`Diamond`,`timeLogin`,`timeLogout`,`timeResetMine`, `ColorChatWorld`) VALUES ('"+""+"','"
									+currentUser.name+"','"+currentUser.password+"','"+""+"','"+""+"','"+currentUser.email+"','"+1000+"','"+timeLogin+"','"+timeLogout+"','"+timeResetMine+"','FFFFFFFF')",function(error, result, field){
						            connection.release();						            
						            if(!!err) {
						            	DetailError = ('register: Error in query 2');
						            	console.log(DetailError);
										functions.writeLogErrror(DetailError);	
						            	socket.emit('R_REGISTER_SUCCESS', {
				                        	message : '1'
				                    	});
						            }else
						            {
						            	if (result.affectedRows > 0) 
						            	{						            		
						            		console.log('đang ki thanh cong: '+currentUser.name);

											// setup email data with unicode symbols
											let mailOptions = {
											    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
											    to: currentUser.email, // list of receivers
											    subject: 'Thông báo đăng kí tài khoản ✔', // Subject line
											    text: 'Đăng kí tài khoản thành công?', // plain text body
											    html: '<b>Bạn đã đăng kí tài khoản thành công với tên: '+currentUser.name+ ' và email:'+currentUser.email+'</b>' // html body
											};
											functions.sendMail(mailOptions);										

											socket.emit('R_REGISTER_SUCCESS', {
					                        	message : '2',
					                    	});
					                    	//gửi user name mới dk lên cho các user khác
					                    	
					                    	io.emit('R_USER_REGISTER',{
					                        	UserName : currentUser.name,
					                    	});
											
						            	}
					            	}
						        });
						     	connection.on('error', function(err) {return;});
							}
						}
					})
				});						
			});             
        })
    }
}
function getcurrentUser(data)
{
	return currentUser =
		{
			name:data.name,
			password:data.password,
			email:data.email,
		}
}