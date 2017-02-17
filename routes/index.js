var express = require('express');
var router = express.Router();
var _ = require('underscore');
var movie = require('../db/DBConnect');
var multer = require('multer');
var upload = multer({
	dest:'../public/images'
});

/* GET home page. */
router.get('/', function(req, res, next) {
	movie.fetch(function(err,docs){
		if(err){
			next(err);
		}else{
			res.render('index', { 
				title:'imooc首页',
				movies:docs
			});
		}
	});
});

// 查看相应电影
router.get('/movie/:id',function(req,res,next){
	movie.findById(req.params.id,function(err,doc){
		if(doc){
			res.render('detail',{
				title:doc.title,
				movie:doc
			});
		}else{
			res.end('访问出错');
		}
	});
});

// 上传电影
router.post('/admin/movie/new',upload.single(),function(req,res,next){
	var _id = req.body.movie._id;
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
		_movie = new movie({
			director:movieObj.director,
		    title:movieObj.title,
		    language:movieObj.language,
		    country:movieObj.country,
		    summary:movieObj.summary,
		    flash:movieObj.flash,
		    poster:movieObj.poster,
		    year:movieObj.year,
		    meta:{
		    	createAt:Date.now(),
		    	updateAt:Date.now()
		    }
		});
		_movie.save(function(err,doc){
			if(err){
				console.log(err);
			}
			if(err){
				console.log(err);
			}
			res.redirect('/movie/'+doc._id);
		});
	}
});

router.get('/admin/update/:id',function(req,res,next){
	movie.findById(req.params.id,function(err,doc){
		if(doc!=='undefined'){
			res.render('admin',{
				title:'imooc后台更新',
				movie:doc
			});
		}
	});
});

router.get('/admin/movie',function(req,res,next){
	res.render('admin',{title:'后台录入页'});
});


router.get('/admin/list',function(req,res,next){
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


router.delete('/admin/list',function(req,res,next){
	var id = req.query.id;
	console.log(id);
	movie.remove({_id:id},function(err,doc){
		if(err)
			console.log(err);
		res.json({success:1});
	});
});
module.exports = router;