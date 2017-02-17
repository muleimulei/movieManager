
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mySchema = new Schema({
    director:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:String,
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

mySchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});
mySchema.statics = {
	fetch:function(cb){
		this.find({}).sort({"meta.updateAt":1}).exec(cb);
	},
	findById:function(id,cb){
		this.findOne({_id:id}).exec(cb);
	}
}


module.exports = mongoose.model('movies', mySchema);