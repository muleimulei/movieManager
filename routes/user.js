var express = require('express');
var router = express.Router();
var movie = require('../db/movie');
var User = require('../db/user');
var Comment = require('../db/comment');
var check = require('./checklogin');

var multer = require('multer');
var upload = multer({
	dest:'../public/images'
});
// 用户登录
router.post('/signin',upload.single(),function(req,res,next){
	var _user = req.body.user;
	var _name = _user.name;
	var _password = _user.password;

	User.findOne({name:_name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/');
		}

		user.comparePassword(_password,function(err,ismatch){
			if(err){
				console.log(err);
			}
			if(!ismatch){
				console.log('password not match')
			}
			else{
				req.session.user = user;
				res.redirect('/');
			}
		})
	});
});

// 用户登录
router.post('/signup',upload.single(),function(req,res,next){
	var _user = req.body.user;
	 console.log(_user);
	var user = new User({
		name:_user.name,
		password:_user.password
	});

	User.findOne({name:_user.name},function(err,doc){
		if(err){
			console.log(err);
		}
		if(doc){
			res.redirect('/');
		}else{
			user.save(function(err,doc){
				if(err){
					console.log(err);
				}
				res.redirect('/admin/userlist');
			});
		}
	});
});

router.post('/comment',check.checklogin,upload.single(),function(req,res,next){
	var _comment = req.body.comment;
	var _movie = _comment.movie;

	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,doc){
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}
			doc.reply.push(reply);
			doc.save(function(err,doc){
				if(err){
					console.log(err);
				}
				 res.redirect('/movie/'+_movie);
				 console.log(comment);
			});
		})
	}else{
		var comment = new Comment({
			movie: _comment.movie,
			from: _comment.from,
			content: _comment.content
		});
		comment.save(function(err,doc){
			if(err){
				console.log(err);
			}
			 res.redirect('/movie/'+_movie);
			 console.log(comment);
		});
	}	
});

// 用户查找
router.get('/search',function(req,res,next){
	var catId = req.query.category;
	var page = req.query.p;

	User.findOne({name:_name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/');
		}

		user.comparePassword(_password,function(err,ismatch){
			if(err){
				console.log(err);
			}
			if(!ismatch){
				console.log('password not match')
			}
			else{
				req.session.user = user;
				res.redirect('/');
			}
		})
	});
});
module.exports = router;