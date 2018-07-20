var functions 		= require('./functions.js');
const nodemailer    = require('nodemailer');

var DetailError;


exports.sendMailRegister = function sendMailRegister (currentUser) {
	let mailOptions = {
		from: '"Game VAE" <gameVae@demainvi.com>', 
		to: currentUser.email, 
		subject: 'Thông báo đăng kí tài khoản ✔', 
		text: 'Đăng kí tài khoản thành công?',
		html: '<b>Bạn đã đăng kí tài khoản thành công với tên: '+currentUser.name+ ' và email:'+currentUser.email+'</b>' 
	};
	sendMail (mailOptions);
}

exports.sendMailCheckErrorLvcty = function sendMailCheckErrorLvcty(currentUser) {
	let mailOptions = {
		from: '"Game VAE" <aloevera.hoang@gmail.com>',
		to: 'aloevera.hoang@gmail.com',
		subject: `Nâng cấp  không thành công ${currentUser.UserName} `,
		text: `User ${currentUser.UserName} Nâng cấp  không thành công ${currentUser.LevelUpgrade} `,
		html: `User ${currentUser.UserName} Nâng cấp  không thành công level city: ${currentUser.LevelUpgrade} \r\n Farm: ${ currentUser.Farm} _Wood: ${   currentUser.Wood }_Stone: ${  currentUser.Stone } _Metal:  ${  currentUser.Metal }  `,
	};
	sendMail(mailOptions);
}

function sendMail (mailOptions) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'aloevera.hoang@gmail.com',
			pass: '123456@A'
		}
	});
	transporter.sendMail(mailOptions, (error, info) => {
		if (!!error){DetailError = ('sendMail: Error sendMail '+ mailOptions);functions.writeLogErrror(DetailError);}
	}); 
}