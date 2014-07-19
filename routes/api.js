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


/*******************
* JSON API FUNCTIONS
*******************/

/* Check if a username is available
* Returns JSON:
* { "inUse" : 
*	1 - Taken
*	0 - Available
* }
*/
router.get('/checkusername/:un', function(req, res) {
	// Local DB
	var db = req.db;

	db.hexists("users", req.params.un, function(err, reply) {
		res.json({
			"inUse" : reply
		});
	});
});


/* Check if a team URL is available
* Returns JSON:
* { "inUse" : 
*	1 - Taken
*	0 - Available
* }
*/
router.get('/checkteamurl/:turl', function(req, res) {
	// Local DB
	var db = req.db;

	db.hexists("teamurls", req.params.turl, function(err, reply) {
		res.json({
			"inUse" : reply
		});
	});
});


/* Get regions available for a game
* Returns an array of regions[]:
*/
router.get('/getregions/:gn', function(req, res) {
	// Local DB
	var db = req.db;

	db.smembers("game:"+req.params.gn+":regions", function(err, reply) {
		res.send(reply);
		//console.log(JSON.stringify(reply));
	});
});

module.exports = router;