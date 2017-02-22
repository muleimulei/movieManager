var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	movie:{
		type:ObjectId,
		ref:'movies'
	},
	from:{
		type:ObjectId,
		ref:'users'
	},
	reply:[{
		from:{
			type:ObjectId,
			ref:'users'
		},
		to:{
			type:ObjectId,
			ref:'users'
		},
		content: String
	}],
	content:String,
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

CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
});


module.exports = mongoose.model('comments', CommentSchema);