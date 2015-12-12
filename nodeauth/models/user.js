var mongoose = require ('mongoose');
var bcryptjs = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;


//user schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		required: true,
		bcryptjs:true
	},
	email: {
		type: String
	},
	name:{
		type: String
	},
	profileimage:{
		type: String
	}

	});

var User = module.exports= mongoose.model('User',UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcryptjs.compare(candidatePassword, hash, function(err, isMatch){
		if (err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserByUserName =function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById =function(id, callback){
	User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
	bcryptjs.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		//set hash key
		newUser.password=hash;

		//create user
		newUser.save(callback);
		});

}