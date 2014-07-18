var express = require('express');
var router = express.Router();



/* PAGE FOR DEBUGGING THE DATABASE */
router.get('/', function(req, res) {
	// Local DB
	var db = req.db;

	// DB checks
	var uldone, regionsdone, teamsdone;

	// JS Variables
	res.locals.userlist = [];
	res.locals.teamlist = [];

	db.hgetall("users", function(err, reply) {

		var numberOfUsers = Object.keys(reply).length;
		//console.log("Logging all user data : " + numberOfUsers);

		var i, returnCount = 0;
		for(i = 1; i <= numberOfUsers; i++) {
			db.hgetall("user:"+i, function(err, reply) {
				//console.log(reply)
				res.locals.userlist.push(reply);
				returnCount++;
				if (returnCount == numberOfUsers) {
					uldone = true;
					if (uldone && regionsdone && teamsdone) {
						res.render('debug', {
							session : req.session
						});
					}			
				}
			});
		}
	});

	db.smembers("game:dota2:regions", function(err, reply) {
		res.locals.dota2regions = reply;
		regionsdone = true;
		if (uldone && regionsdone && teamsdone) {
			res.render('debug', {
				session : req.session
			});
		}
	});

	db.hgetall("teamurls", function(err, reply) {
		var numberOfTeams = Object.keys(reply).length;

		var i, returnCount = 0;
		for (i = 1; i <= numberOfTeams; i++) {
			db.hgetall("team:"+i, function(err, reply) {
				res.locals.teamlist.push(reply);
				returnCount++;
				if (returnCount == numberOfTeams) {
					teamsdone = true;
					if (uldone && regionsdone && teamsdone) {
						res.render('debug', {
							session : req.session
						});
					}
				}
			});
		}
	});



});


/* Secret POST for writing complex strings to the DB
router.post('/addregion', function(req, res) {
	// Local DB
	var db = req.db;

	db.sadd("game:dota2:regions", req.body.regionname);

	res.redirect('/debug');
});
*/


module.exports = router;