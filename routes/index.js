var express = require('express');

var router = express.Router();

var movie = require('../db/movie');
var Category = require('../db/category');


// 用户登出
router.get('/logout',function(req,res,next){
	req.session.destroy(function(err){
		if(err){
			return console.log(err);
		}
		console.log('已退出');
		res.redirect('/');
	});
});


router.get('/search',function(req,res,next){
      var cat = req.query.category,
          page = req.query.page,
          index = (page-1) * 4,
          name = req.query.name;

      if(cat){
         	Category.find({
           		_id:cat
         	}).populate({
           		path:'movies',
           		select: 'title poster',
         	}).exec(function(err,docs){
                var _movie = docs[0].movies.slice(index,index+4);
             		if(err){
             			console.log(err);
             		}
             		res.render('result',{
             			title: 'imooc 结果列表页',
                  movies: _movie,
             			// category: docs[0],
             			keyword: docs[0].name,
             			currentPage: page,
             			totalPage : Math.ceil(docs[0].movies.length/4),
             			cat: cat
             		});
         });
      }else{
          movie.find({
              title: new RegExp(name+'.*','i')
          }).exec(function(err,docs){
                if(err){
                  console.log(err);
                }
                res.render('result',{
                  title: 'imooc 结果列表页',
                  movies: docs,
                  keyword: name,
                  currentPage: page,
                  totalPage : Math.ceil(docs.length/4),
                  cat: docs[0].category
                });
          });
      }
});

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log('hello');
	Category.find()
			.populate({
					path:'movies',
          populate:{
            path: 'movies'
          },
          options:{
              limit:4
          }
				}).exec(function(err,cates){
					console.log(cates[0].movies)
					if(err){
						console.log(err);
					}

					res.render('index', { 
						title:'首页',
						categories:cates
					});
				});

});


module.exports = router;