var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'ScrimFindr' });
});

/* GET user homepage. */
router.get('/home', function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('home', {
			"title" : "User Home",
			"foo" : value
		});
	});
	
});

/* GET signup page */
router.get('/signup', function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('home', {
			"title" : "Signup!",
			"foo" : value
		});
	});
});

/* GET new team page */
router.get('/newteam', function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('home', {
			"title" : "Create a new team",
			"foo" : value
		});
	});
});

/* GET?? Logout */
router.get('/logout', function(req, res) {
	// DO LOGOUT

	res.redirect("/");
});

module.exports = router;
