var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
  	'title': 'Login'
  });
});

router.post('/register', function(req, res, next) {
   // get the form values
   var name= req.body.name;
   var email= req.body.email;
   var username= req.body.username;
   var password= req.body.password;
   var password2= req.body.password2;


//check for image field
if (req.files && req.files.profileimage) {
	console.log('uploading file..');

    //file info
	var profileImageOriginalName= req.files.profileimage.originalname;
	var profileImageName= req.files.profileimage.name;
	var profileImageMime= req.files.profileimage.mimetype;
	var profileImagePath= req.files.profileimage.path;
	var profileImageExt= req.files.profileimage.extension;
	var profileImageSize= req.files.profileimage.size;

} else {
	//set default image
	var profileImageName = 'noimage.png';
}

//form validation- express validator

   req.checkBody('name','Name field is required').notEmpty();
   req.checkBody('email','email field is required').notEmpty();
   req.checkBody('email','email not valid').isEmail();
   req.checkBody('username','Username field is required').notEmpty();
   req.checkBody('password','Password field is required').notEmpty();
   req.checkBody('password2','Passwords do not match').equals(req.body.password);

   //check for error

   var errors=req.validationErrors();

   if (errors){
   	res.render('register',{
   		errors: errors,
   		name: name,
   		email: email,
   		username: username,
   		password: password,
   		password2: password2
   	});

   }else{

   	 var newUser = new User({
   	 	name: name,
   		email: email,
   		username: username,
   		password: password,
   		profileimage: profileImageName
   	 });

   	 //create user
   	 User.createUser(newUser,function(err,user){
   	 	if(err) throw err;
   	 	console.log(user);
   	 });

   	 //success message
   	 	req.flash('success, you are now registered and may log in');

   	 	res.location('/');
   	 	res.redirect('/');
   }

});
        
    passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.getUserById(id, function(err, user) {
	    done(err, user);
	  });
	});

    passport.use(new localStrategy(
    	function(username,password, done){
    		User.getUserByUserName(username,function(err, user){
    			if(err) throw err;
    			if(!user){
    				console.log('unknown user');
    				return done(null,false, {message: 'unknown user'});
    			}

    			User.comparePassword(password, user.password,function(err, isMatch){
    					if(err) throw err;
    					if (isMatch){
    						return done(null, user);
    					} else{
    						console.log('invalid password');
    						return done(null, false, {message:'invalid password'});
    					}
    			});
    		});
    	}
    ));


 router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'invalid username or password'}),
 	function(req,res){
 		console.log('authentication successful');
 		req.flash('success', 'you are logged in');
 		res.redirect('/');
 	});

 router.get('/logout', function(req, res){
 	req.logout();
 	req.flash('success', 'you have logged out');
 	res.redirect('/users/login');
 });

module.exports = router;

