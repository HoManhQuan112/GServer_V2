socket.on('S_REGISTER', function (data)
			{
				currentUser = getcurrentUser(data);
				console.log("==========data receive S_REGISTER: "
					+currentUser.name+"_"
					+currentUser.password+"_"
					+currentUser.email);
				pool.getConnection(function(err,connection)
				{				
					connection.query( queryUser (currentUser.name,currentUser.email),function(error, rows,field)
					{
						if (!!error){DetailError = ('register.js: Error query 1');

						functions.writeLogErrror(DetailError);	
					}else
					{					
						if (rows.length>0) {
							socket.emit('R_REGISTER_SUCCESS', {
								message : '0'//tai khoan hoac email da ton tai
							});
						}else
						{
							//timeLogin = 0; timeLogout = 0; timeResetMine = 0;							
							connection.query(insertUser (currentUser.name,currentUser.password,currentUser.email),function(error, result, field){
								connection.release();						            
								if(!!err) {
									DetailError = ('register.js: Error query 2');

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