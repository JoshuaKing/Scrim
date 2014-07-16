var express = require('express');
var router = express.Router();

/****************
** MIDDLEWARE
****************/
// Session Auth check for redirection
function checkAuth(req, res, next) {
	if (!req.session.uid) {
		res.redirect('/login');
	} else {
		next();
	}
}

/****************
** ROUTES
****************/



/* GET - LANDING */
router.get('/', function(req, res) {
  res.render('index', { title: 'ScrimFindr' });
});


/* GET - LOGIN */
router.get('/login', function(req, res) {
	res.render('login', {});
});

/* POST - LOGIN */
router.post('/login', function(req, res) {
	// Local DB
	var db = req.db;

	// Form values
	var userName = req.body.username;
	var userPass = req.body.userpass;

	// Check the user exists
	db.hexists("users", userName, function(err, reply) {
		if (reply) {
			// Username exists, get UID
			console.log("Checked username exists, reply = "+reply);
			db.hget("users", userName, function(err, reply) {
				// Got UID, get password
				console.log("Got UID, reply = "+reply);
				var UID = reply;
				db.hget("user:"+UID, "password", function(err, reply) {
					// Got password, compare
					console.log("Got password, reply = "+reply);
					if (userPass == reply) {
						// Successful login
						console.log("Password matches, logging in as "+userName);
						req.session.uid = UID;

						res.redirect('/home');
					} else {
						console("Password incorrect, refreshing login");
						res.render('login', {
							"failMessage" : "Password is incorrect"
						});
					}
				});
			});
		} else {
			res.render('login', {
				"failReason" : "No account exists for this username"
			});
		}
	});
});


/* GET - USER HOMEPAGE */
router.get('/home', checkAuth, function(req, res) {
	// Local DB
	var db = req.db;

	var uid = req.session.uid;

	db.hget("user:"+uid, "username", function(err, value) {

		res.render('home', {
			"title" : "Welcome, "+value,
			"uid" : uid
		});
	});
	
});

/* GET - SIGNUP */
router.get('/signup', function(req, res) {
	res.render('signup', {});
});

/* POST - ADD USER */
router.post('/signup', function(req, res) {
	// Local DB variable
	var db = req.db;

	// Get form values
	var userName = req.body.username;
	var userPass = req.body.userpass;
	var userEmail = req.body.useremail;


	// Confirm that the username doesn't already exist (should be checked already)
	db.hexists("users", userName, function(err, reply) {
		if (reply) {
			// Already exists, throw error
			console.log("User already exists");
			res.redirect("/error");

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
					"email" : userEmail,
					"password" : userPass,
					"date_created" :  currentTime
				});

			});

			res.redirect('/signup');
		}
		
	});
});


/* GET - NEW TEAM */
router.get('/newteam', checkAuth, function(req, res) {
	var db = req.db;
	db.get("foo", function(err, value) {
		if (err) throw(err);
		console.log(value);
		res.render('newteam', {
			"title" : "Create a new team",
			"foo" : value
		});
	});
});


/* GET - LOGOUT */
router.get('/logout', function(req, res) {
	// Delete UID from session
	delete req.session.uid;

	// Redirect to home
	res.redirect("/");
});


/* PAGE FOR DEBUGGING THE DATABASE */
router.get('/debug', function(req, res) {
	// Local DB
	var db = req.db;

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
					res.render('debug', {});				
				}
			});
		}
	});
});


module.exports = router;