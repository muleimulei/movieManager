var express = require('express');
var router = express.Router();

var movie = require('../db/movie');
var User = require('../db/user');
var Category = require('../db/category');

var _ = require('underscore');
var check = require('./checklogin');
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
			title:movieObj.title,
			director:movieObj.director,
			country:movieObj.country,
			language:movieObj.language,
			poster:movieObj.poster,
			flash:movieObj.flash,
			year:movieObj.year,
			summary: movieObj.summary
		});

		if(movieObj.category){
			var cid = movieObj.category.filter(function(val){
				return val!='';
			});
		}

		var categoryName = movieObj.categoryName;

		_movie.save(function(err,doc){
			if(err){
				return console.log(err);
			}
			if(cid&&cid.length==1){
				Category.findById(cid[0],function(err,cat){
					if(err){
						console.log(err);
					}
					cat.movies.push(doc._id);
					cat.save(function(err,cate){
						console.log(cate);
						if(err){
							console.log(err);
						}
						doc.category = cate._id;
						doc.save(function(err,movie){
							res.redirect('/movie/'+doc._id)
						});
					});
				});
			}else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [doc._id]
				});
				category.save(function(err,category){
					doc.category = category._id;
					doc.save();
					res.redirect('/movie/'+doc._id);
				})
			}
		});
	}
});

// 修改电影信息
router.get('/update/:id',function(req,res,next){
	var id = req.params.id;
	if(id){
		movie.findById(id,function(err,doc){
			Category.find({},function(err,docs){
				res.render('admin',{
					title:'imooc后台更新',
					movie:doc,
					categories: docs
				});
			})
		});
	}
});


// 电影录入
router.get('/movie',check.checklogin,function(req,res,next){
	Category.find({}).exec(function(err,docs){
		res.render('admin',{
			title:'后台录入页',
			categories: docs
		});
	});
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

router.get('/category/new',check.checklogin,function(req,res,next) {
	res.render('category_admin',{
		title: 'imooc 后台分类录入页'
	});
});

router.post('/category/save',upload.single(),function(req,res,next){
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err,doc){
		if(err){
			console.log(err)
		}
		res.redirect('/admin/category/list');
	});
});


router.get('/category/list',check.checklogin,function(req,res,next){
	Category.fetch(function(err,docs){
		if(err){
			next(err);
		}else{
			res.render('categorylist', { 
				title:'类别管理',
				categories:docs
			});
		}
	});
});


module.exports = router;