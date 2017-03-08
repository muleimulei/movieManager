var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var categorySchema = new Schema({
    name: String,
    movies:[{
        type: ObjectId,
        ref:'movies'
    }],
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

categorySchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
    next();
});

categorySchema.statics = {
	fetch:function(cb){
		this.find({}).sort({"meta.updateAt":1}).exec(cb);
	},
	findById:function(id,cb){
		this.findOne({_id:id}).exec(cb);
	}
}

module.exports = mongoose.model('category', categorySchema);