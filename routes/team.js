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

			var infodone, membersdone, requestsdone, fansdone;

			db.hgetall("team:"+reply, function(err, reply) {
				
				res.locals.team.info = reply;
				// res.locals.team = {
				// 	"info" : reply
				// };
				infodone = true;

				if (infodone && membersdone && requestsdone && fansdone) {
					res.render('team', {
						session : req.session
					});
				}

				
			});

			db.smembers("team:"+reply+":players", function(err, reply) {
				res.locals.team.players = reply;

				membersdone = true;

				if (infodone && membersdone && requestsdone && fansdone) {
					res.render('team', {
						session : req.session
					});
				}
			});

			db.smembers("team:"+reply+":players:pending", function(err, reply) {
				res.locals.team.requests = reply;

				requestsdone = true;

				if (infodone && membersdone && requestsdone && fansdone) {
					res.render('team', {
						session : req.session
					});
				}
			});

			db.smembers("team:"+reply+":fans", function(err, reply) {
				res.locals.team.fans = reply;

				fansdone = true;

				if (infodone && membersdone && requestsdone && fansdone) {
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


/* GET - JOIN TEAM */ 
router.get('/:id/join', checkAuth, function(req, res) {
	var db = req.db;

	db.hget("teamurls", req.params.id, function(err, reply) {
		//console.log(reply);
		
		if (reply) {
			// Team Exists

			db.sadd("team:"+reply+":players:pending", req.session.uid);

			res.redirect('/team/'+req.params.id);


		} else {
			// NO TEAM, HOME/404
			res.redirect('/');
		}
	});
});

module.exports = router;
