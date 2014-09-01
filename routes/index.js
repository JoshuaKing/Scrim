var express = require('express');
var router = express.Router();

/****************
** ROUTES
****************/

/* GET - LANDING */
router.get('/', function(req, res) {
  res.render('index', { title: 'ScrimFindr', signedIn: (session.username ? true : false) });
});


/* GET - LOGIN */
router.get('/login', function(req, res) {
	res.render('login', {
		session : req.session
	});
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

						// Set up session
						req.session.uid = UID;
						req.session.username = userName;

						var ref = req.session.ref ? req.session.ref : '/home';
						res.redirect(ref);

					} else {
						console.log("Password incorrect, refreshing login");
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


/* GET - LOGOUT */
router.get('/logout', function(req, res) {
	// Delete UID from session
	delete req.session.uid;

	// Redirect to home
	res.redirect("/");
});


module.exports = router;