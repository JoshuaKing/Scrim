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

	db.smembers("game:dota2:regions", function(err, reply) {
		req.session.games = {
			"dota2" : {
				"regions" : reply
			}
		};

		res.render('createteam', {
			session : req.session,
		});
	});
});

/* POST - CREATE A NEW TEAM */
router.post('/createteam', checkAuth, function(req, res) {
	// Local DB
	var db = req.db;

	console.log(req.body);
	var offsetMins = Number(req.body.timestamp)*60;
	var timeNow = new Date();
	var localTime = new Date(timeNow.getTime() + req.body.timezone*3600000);

	console.log("UTC time = "+timeNow.getUTCHours()+":"+timeNow.getUTCMinutes());
	console.log("Local time = "+localTime.getUTCHours()+":"+localTime.getUTCMinutes());

	if (req.body.teamname != "") {
		// Add team to the DB

		var localOffset = req.body.timezone*3600000;
		var currentTime = new Date().getTime();

		db.get("NEXT_TEAM_ID", function(err, reply) {
			db.incr("NEXT_TEAM_ID");

			db.hset("teamurls", reply, reply);

			db.hmset("team:"+reply, {
				"name" : req.body.teamname,
				"game" : req.body.teamgame,
				"region" : req.body.gameregion,
				"url" : reply,
				"creator" : req.session.uid,
				"desc" : req.body.teamdesc,
				"utc_offset" : localOffset,
				"date_created" : currentTime
			});

			res.redirect('/team/'+reply);
		});
	}
		
	
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