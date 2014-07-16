var express = require('express');
var router = express.Router();

/*
* JSON API FUNCTIONS
*/

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


module.exports = router;