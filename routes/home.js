var express = require('express');
var router = express.Router();

/****************
** MIDDLEWARE
****************/

// Session Auth check for redirection
function checkAuth(req, res, next) {
	if (!req.session.uid) {
		req.session.ref = req.originalUrl;
		res.redirect('/login');
	} else {
		next();
	}
}


/****************
** ROUTES
****************/

/* GET - USER HOMEPAGE */
router.get('/', checkAuth, function(req, res) {
	// Local DB
	var db = req.db;

	res.render('home', {
		session : req.session
	});
});


/* GET - NEW TEAM */
router.get('/createteam', checkAuth, function(req, res) {
	// Local DB
	var db = req.db;

	
	res.render('createteam', {
		session : req.session
	});
});


/* GET - USER SETTINGS */
router.get('/settings', checkAuth, function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('usersettings', {
			"title" : "Your settings",
			"foo" : value
		});
	});
});


module.exports = router;