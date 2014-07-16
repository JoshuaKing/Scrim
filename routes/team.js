var express = require('express');
var router = express.Router();


/* Base team page */ 
router.get('/', function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('home', {
			"title" : "Team page",
			"foo" : value
		});
	});
});

/* Base unique teamp page */ 
router.get('/:id', function(req, res) {
	var db = req.db;

	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		
		res.render('home', {
			"title" : "Team page",
			"foo" : req.params.id
		});
	});
});

module.exports = router;
