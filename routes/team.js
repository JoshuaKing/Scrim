var express = require('express');
var router = express.Router();


/* Base team page */ 
router.get('/', function(req, res) {
	res.redirect('/');
});

/* Base unique team page */ 
router.get('/:id', function(req, res) {
	var db = req.db;

	db.hget("teamurls", req.params.id, function(err, reply) {
		//console.log(reply);
		
		if (reply) {
			// Team Exists
			res.locals.team = {};
			res.locals.team.id = req.params.id;

			var infodone, membersdone;

			db.hgetall("team:"+reply, function(err, reply) {
				
				res.locals.team.info = reply;
				// res.locals.team = {
				// 	"info" : reply
				// };
				infodone = true;

				if (infodone && membersdone) {
					res.render('team', {
						session : req.session
					});
				}

				
			});

			db.smembers("team:"+reply+":players", function(err, reply) {
				res.locals.team.players = reply;

				membersdone = true;

				if (infodone && membersdone) {
					res.render('team', {
						session : req.session
					});
				}
			});

			// Get schedule



		} else {
			// NO TEAM, HOME/404
			res.redirect('/');
		}
	});
});

module.exports = router;
