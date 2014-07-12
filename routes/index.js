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
			"title" : "DB Test",
			"foo" : value
		});
	});
});

module.exports = router;
