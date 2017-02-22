var express = require('express');
var router = express.Router();
var movie = require('../db/movie');
var User = require('../db/user');
var _ = require('underscore');
var multer = require('multer');
var upload = multer({
	dest:'../public/images'
});

// 电影列表
router.get('/list',function(req,res,next){
	movie.fetch(function(err,docs){
		if(err){
			next(err);
		}else{
			res.render('list', { 
				title:'管理页',
				movies:docs
			});
		}
	});
});

// 上传电影
router.post('/movie/new',upload.single(),function(req,res,next){
	var _id = req.body.movie._id;
	console.log('hello',req.body.movie);
	var movieObj = req.body.movie;
	var _movie;
	if(_id){
		movie.findById(_id,function(err,doc){
			if(err){
				console.log(err);
			}
			_movie = _.extend(doc,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id);
			});
		});
	}else{
		// console.log(movie);
		_movie = new movie({
			title:movieObj.title,
			director:movieObj.director,
			country:movieObj.country,
			language:movieObj.language,
			poster:movieObj.post,
			flash:movieObj.flash,
			year:movieObj.year,
			summary: movieObj.summary
		});
		_movie.save(function(err,doc){
			if(err){
				return console.log(err);
			}
			res.redirect('/movie/'+doc._id);
		});
		// console.log(_movie);
	}
});

// 修改电影信息
router.get('/update/:id',function(req,res,next){
	movie.findById(req.params.id,function(err,doc){
		if(doc!=='undefined'){
			res.render('admin',{
				title:'imooc后台更新',
				movie:doc
			});
		}
	});
});


// 电影录入
router.get('/movie',function(req,res,next){
	if(!req.session.user){
		return res.redirect('/');
	}
	next();
},function(req,res,next){
	res.render('admin',{title:'后台录入页'});
});



// 删除指定ID的电影
router.delete('/list',function(req,res,next){
	var id = req.query.id;
	movie.remove({_id:id},function(err,doc){
		if(err)
			console.log(err);
		res.json({success:1});
	});
});

// user signup
router.get('/userlist',function(req,res,next){
	User.find(function(err,docs){
		if(err){
			next(err);
		}else{
			res.render('userlist', { 
				title:'管理页',
				users:docs
			});
		}
	});
});


module.exports = router;