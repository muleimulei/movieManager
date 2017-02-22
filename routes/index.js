var express = require('express');
var router = express.Router();

var movie = require('../db/movie');

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


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session.user);
	if(req.session.user){
		res.locals.user = req.session.user;
	}
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
module.exports = router;