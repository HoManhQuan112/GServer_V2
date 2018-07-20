'use strict';
var pool = require('./db');
var functions 		= require("./functions");
var cron 			= require('node-cron');
var crypto 			= require('crypto');
var currentSENDRECOVERPASSWORD,currentCONFIRMRECOVERPASSWORD,d,createPositionTimelast,DetailError;


module.exports = {
    start: function(io) 
    {
        io.on('connection', function(socket) 
        {
        	socket.on('S_RECOVER_PASSWORD', function (data)
			{
				currentSENDRECOVERPASSWORD = getcurrentSENDRECOVERPASSWORD(data);
				console.log("data receive S_RECOVER_PASSWORD: "+currentSENDRECOVERPASSWORD.email+"_"+currentSENDRECOVERPASSWORD.username);
				var stRecover;
				pool.getConnection(function(err,connection)
				{				
		        	connection.query("SELECT UserEmail,password_recover_key FROM `users` WHERE `UserEmail`='"+currentSENDRECOVERPASSWORD.email+"' AND `UserName`='"+currentSENDRECOVERPASSWORD.username+"'",function(error, rows,field)
		        	{
						if (!!error){DetailError = ('recoverpass: Error in the query 1');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{						
							if (rows.length > 0) 
							{		
								if (rows[0].password_recover_key.length>0) 
								{																				
			                    	socket.emit('R_SEND_MAIL_PASSWORD', 
									{
			                        	message : 2,
			                    	});									

									// setup email data with unicode symbols
									let mailOptions = 
									{
									    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
									    to: currentSENDRECOVERPASSWORD.email, // list of receivers
									    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
									    text: 'Đổi mật khẩu tài được xác nhận', // plain text body
									    html: '<b>'+rows[0].password_recover_key
									    + ' Vui lòng copy mã xác nhận này vào Phần Thay đổi mật khẩu trong game, nhập cùng với password mà bạn muốn thay đổi.'
									    +' Mã này tồn tại đến … (thời gian). Đoạn mã này sẽ tự hủy sau khi bạn thay đổi password.'
									    +''+rows[0].password_recover_key+ ' Please copy and paste this code at Reset Password in game, and input'
									    +' your new password. This code available unitil…(time). After changing your password, '
									    +'this code isn’t available..</b>' // html body
									};
									// send mail with defined transport object
									functions.sendMail(mailOptions);
								}else
								{
									//tạo chuổi key recovery gửi mail cho user và lưu vào data  										
			                    	stRecover = randomValueHex(4)+"-"+randomValueHex(4)+"-"+randomValueHex(4);	
			                    	d = new Date();
							    	createPositionTimelast = Math.floor(d.getTime() / 1000);				

									connection.query("UPDATE `users` SET `password_recover_key`='"+stRecover+"',`password_recover_key_expire`='"+(parseFloat(createPositionTimelast)+86400)+"' WHERE `UserEmail`= '"+rows[0].UserEmail+"'",function(error, result, field){					           
							            if(!!err) {DetailError = ('recoverpass:mail Error in the query 2');					            	
							            	console.log(DetailError);
											functions.writeLogErrror(DetailError);	
							            }else
							            {
											if (result.affectedRows > 0) 
											{
												socket.emit('R_SEND_MAIL_PASSWORD', 
												{
						                        	message : 1,
						                    	});

												// setup email data with unicode symbols
												let mailOptions = 
												{
												    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
												    to: currentSENDRECOVERPASSWORD.email, // list of receivers
												    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
												    text: 'Đổi mật khẩu tài được xác nhận', // plain text body
												    html: '<b>'+stRecover
												    + ' Vui lòng copy mã xác nhận này vào Phần Thay đổi mật khẩu trong game, nhập cùng với password mà bạn muốn thay đổi.'
												    +' Mã này tồn tại đến … (thời gian). Đoạn mã này sẽ tự hủy sau khi bạn thay đổi password.'
												    +''+stRecover+ ' Please copy and paste this code at Reset Password in game, and input'
												    +' your new password. This code available unitil…(time). After changing your password, '
												    +'this code isn’t available..</b>' // html body
												};
												// send mail with defined transport object
												functions.sendMail(mailOptions);
											}else
											{
												socket.emit('R_SEND_MAIL_PASSWORD', 
												{
						                        	message : 0,
						                    	});												
											}																
							            }
							        });	
								}					                  					     	
							}else
							{
								socket.emit('R_SEND_MAIL_PASSWORD', 
								{
		                        	message : 0,
		                    	});							
							}
						}
					})
		   		});	  										
			});
			socket.on('S_CONFIRM_CHANGE_PASSWORD', function (data)
			{
				currentCONFIRMRECOVERPASSWORD = getcurrentCONFIRMRECOVERPASSWORD(data);
				console.log("data receive S_CONFIRM_CHANGE_PASSWORD: "+currentCONFIRMRECOVERPASSWORD.username
							+"_"+currentCONFIRMRECOVERPASSWORD.stRecover
							+"_"+currentCONFIRMRECOVERPASSWORD.passRecover);				
				pool.getConnection(function(err,connection)
				{	
					connection.query("SELECT UserEmail FROM `users` where `UserName`= '"+currentCONFIRMRECOVERPASSWORD.username+"'",function(error, rows,field)
					{
						if (!!error){DetailError = ('recoverpass: Error in the query 3');
							console.log(DetailError);
							functions.writeLogErrror(DetailError);	
						}else
						{						
							if (rows.length > 0) 
							{
								connection.query("UPDATE `users` SET `UserPass`='"+currentCONFIRMRECOVERPASSWORD.passRecover
				        			+"',`password_recover_key`='',`password_recover_key_expire`='' WHERE `UserName`= '"+currentCONFIRMRECOVERPASSWORD.username
				        			+"' AND `password_recover_key`= '"+currentCONFIRMRECOVERPASSWORD.stRecover+"'",function(error, result, field)
				        		{					           
						            if(!!err){DetailError = ('recoverpass:mail Error in the query 4');					            	
						            	console.log(DetailError);
										functions.writeLogErrror(DetailError);	
						            }else
						            {
										if (result.affectedRows > 0) 
										{
											socket.emit('R_CONFIRM_RECOVER_PASSWORD', 
											{
					                        	message : 1,
					                    	});
											
											// setup email data with unicode symbols
											console.log("Da gửi mail tới: "+rows[0].UserEmail);
											let mailOptions = {
											    from: '"Game VAE" <gameVae@demainvi.com>', // sender address
											    to: rows[0].UserEmail, // list of receivers
											    subject: 'Thông báo đổi mật khẩu tài khoản ✔', // Subject line
											    text: 'Đổi mật khẩu tài thành công', // plain text body
											    html: '<b>Chúc mừng bạn đã thay đổi mật khẩu thành công. Vui lòng vào game để đăng nhập.</b>' // html body
											};											
											// send mail with defined transport object
											functions.sendMail(mailOptions);
										}else
										{
											socket.emit('R_CONFIRM_RECOVER_PASSWORD', 
											{
					                        	message : 0,
					                    	});											
										}																									
						            }
						        });	
							}
						}
					});			    				     	
		   		});
			});            
        })
		cron.schedule('*/1 * * * * *',function()
		{
			d = new Date();
	    	createPositionTimelast = Math.floor(d.getTime() / 1000);
			//kiểm tra hết thời gian hồi phục mật khẩu
			var query = pool.query("UPDATE `users` SET `password_recover_key`='',`password_recover_key_expire`='' WHERE `password_recover_key_expire`= '"+parseFloat(createPositionTimelast)+"'",function(error, result, field)
			{					           
	            if(!!error){DetailError = ('recoverpass: Error in the query 5');
	            	console.log(DetailError);
					functions.writeLogErrror(DetailError);	
	        	}
			});				
		});
    }
}

function randomValueHex (len) 
{
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
}
function getcurrentSENDRECOVERPASSWORD(data)
{
	return currentSENDRECOVERPASSWORD =
		{
			username:data.username,
			email:data.email,				
		}
}

function getcurrentCONFIRMRECOVERPASSWORD(data)
{
	return currentCONFIRMRECOVERPASSWORD =
		{
			username:data.username,				
			stRecover:data.stRecover,
			passRecover:data.passRecover,								
		}
}