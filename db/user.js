var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const SALT_ROUND = 0;

var user = new mongoose.Schema({
	name:{
		unique:true,
		type: String
	},
	password:String,
	meta:{
		createAt:{
    		type:Date,
    		default:Date.now()
    	},
    	updateAt:{
    		type:Date,
    		default:Date.now()
    	}
	}
});

user.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	var user = this;

	bcrypt.genSalt(SALT_ROUND, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	    	console.log('3344',hash);
	    	if(err) return console.log(err);
	        user.password = hash;
	        next();
	    });
	});
});

user.methods={
	comparePassword(passwd,cb){
		bcrypt.compare(passwd,this.password, function(err, ismatch) {
			if(err){
				return cb(err);
			}
			cb(null,ismatch)
		});
	}
}

module.exports = mongoose.model('users', user);