var express = require('express');
var router = express.Router();



/* PAGE FOR DEBUGGING THE DATABASE */
router.get('/', function(req, res) {
	// Local DB
	var db = req.db;

	// DB checks
	var uldone, regionsdone;

	// JS Variables
	res.locals.userlist = [];

	db.hgetall("users", function(err, reply) {
		if (err) throw(err);

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
					if (uldone && regionsdone) {
						res.render('debug', {});
					}			
				}
			});
		}
	});

	db.smembers("game:dota2:regions", function(err, reply) {
		res.locals.dota2regions = reply;
		regionsdone = true;
		if (uldone & regionsdone) {
			res.render('debug');
		}
	})
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