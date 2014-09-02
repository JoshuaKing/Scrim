var express = require('express');
var router = express.Router();

/****************
** ROUTES
****************/

/* GET - LANDING */
router.get('/', function(req, res) {
  res.render('index');
});

/* POST - LANDING */
router.post('/', function(req, res) {
	// Form values
	var action = req.body.action;
	
	if (action == "login") {
		login(req, res);
	} else{
		signup(req, res);
	}
});

/* GET - LOGOUT */
router.get('/logout', function(req, res) {
	// Delete UID from session
	delete req.session.uid;

	// Redirect to home
	res.redirect("/");
});

/* Function to log user in */
function login(req, res) {
	// Local DB
	var db = req.db;
	
	var userName = req.body.username;
	var userPass = req.body.userpass;
	
	// Check the user exists
	db.hexists("users", userName, function(err, reply) {
		if (reply) {
			// Username exists, get UID
			console.log("Checked username '" + userName + "' exists, reply = "+reply);
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
					
					// Redirect to home
					res.redirect('/home/');

					} else {
						console.log("Password incorrect, refreshing login");
						res.render('index', {failLogin: "Password is incorrect."});
					}
				});
			});
		} else {
			res.render('index', {failLogin: "No account exists for this username."});
		}
	});
}

/* Function to create new user and then call login() to create session */
function signup(req, res) {
	// Local DB variable
	var db = req.db;

	// Get form values
	var userName = req.body.username;
	var userPass = req.body.userpass;
	var userSteamId = req.body.steamid;


	// Confirm that the username doesn't already exist (should be checked already)
	db.hexists("users", userName, function(err, reply) {
		if (reply) {
			// Already exists, throw error
			console.log("User already exists");
			res.render('index', {failSignup: "Username is unavailable."});

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
					"steam_id" : userSteamId,
					"password" : userPass,
					"date_created" :  currentTime
				});

				login(req, res);

			});
		}
		
	});
}

module.exports = router;