var express = require('express');
var router = express.Router();

var movie = require('../db/movie');
var check = require('./checklogin');
var Comment = require('../db/comment');

// 查看相应电影
router.get('/:id',check.checklogin,function(req,res,next){
	var _id = req.params.id;
	movie.findById(_id,function(err,doc){
		if(err){
			return console.log(err);
		}
		Comment.find({movie:_id})
			.populate('from','name')
			.exec(function(err,comments){
				if(err){
					return console.log(err);
				}
				res.render('detail',{
					title:doc.title,
					movie:doc,
					comments: comments
				});
			
		});
	});
});


module.exports = router;