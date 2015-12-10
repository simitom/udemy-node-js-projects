var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'ConTact' });
});


// sending of the mail
 router.post('/send',function(req, res, next){
 	var transporter = nodemailer.createTransport({
 		service: 'Gmail',
 		auth: {user: 'techguyinfo@gmail.com',
 		pass: "something"
 		}
 	});

 	var mailOptions = {
 		from: 'john doe <johndoe@outlook.com>',
 		to: 'techguyinfo@gmail.com',
 		subject: 'website submission',
 		text: "you have a new submission with following details..Name: "+req.body.name+ "Email: "
        +req.body.email+ "message: " +req.body.message,
        html: "<p>You got a new submission with the following details</p><ul><li>Name:"+req.body.name+"</li><li>Email:"+req.body.email+"</li><li>message:" +req.body.message+ "</li></ul>"
 	};

 	transporter.sendMail(mailOptions,function(error,info){
 		if(error){
 			console.log(error);
 			res.redirect('/');
 		}
 		else{
 			console.log('Message send:' +info.reponse);
 			res.redirect('/');
 		}
 	});
 });
module.exports = router;
