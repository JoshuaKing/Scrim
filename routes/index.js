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
			"title" : "User Home",
			"foo" : value
		});
	});
	
});

/* GET signup page */
router.get('/signup', function(req, res) {
	res.render('signup', {});
});

router.post('/adduser', function(req, res) {
	// Local DB variable
	var db = req.db;

	// Get form values
	var userName = req.body.username;
	var userPass = req.body.userpass;


	// Check that the username doesn't already exist?
	db.hexists("users", userName, function(err, reply) {
		if (reply) {
			// Already exists, throw error
			console.log("User already exists");

		} else {
			console.log("Username is available");

			// Add user
			db.get("NEXT_USER_ID", function(err, reply) {
				db.incr("NEXT_USER_ID");
				var newUserId = reply;
				console.log("new user ID number is "+newUserId);
				db.hset("users", userName, newUserId);
				
				var currentTime = new Date().getTime();
				db.hmset("user:"+newUserId, {
					"username" : userName,
					"password" : userPass,
					"date_created" :  currentTime
				});

			});
		}
		
	});
	

	res.redirect('/signup');
	
});

/* GET new team page */
router.get('/newteam', function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('home', {
			"title" : "Create a new team",
			"foo" : value
		});
	});
});

/* GET?? Logout */
router.get('/logout', function(req, res) {
	// DO LOGOUT

	res.redirect("/");
});





/* PAGE FOR DEBUGGING THE DATABASE */
router.get('/debug', function(req, res) {
	// Local DB
	var db = req.db;

	db.hgetall("users", function(err, reply) {
		if (err) throw(err);


		
		var numberOfUsers = Object.keys(reply).length;
		//console.log("Logging all user data : " + numberOfUsers);

		var allData = [];
		var i, returnCount = 0;
		for(i = 1; i <= numberOfUsers; i++) {
			db.hgetall("user:"+i, function(err, reply) {
				//console.log(reply)
				allData.push(reply);
				returnCount++;
				if (returnCount == numberOfUsers) {
					//console.log(allData);
					res.render('debug', {
						"userlist" : allData
					});
				}
			});
		}
	});
});


module.exports = router;
