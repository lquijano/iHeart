	//Dependencies
	const dotenv = require('dotenv').config()
	const express = require('express');
	const { urlencoded } = require('body-parser');
	const twilio = require('twilio');
	const cookieParser = require('cookie-parser');
	const mysql = require("mysql");
	const path = require('path');
	const fitbitApiClient = require("fitbit-node");
	const bodyParser = require('body-parser');
	const dateFormat = require('dateformat');
	const session = require('express-session');


	//Envoking Express
	let app = express();
	app.use(session({ secret: 'fitapp', cookie: { maxAge: 1*1000*60*60*24*365}}));

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser('sess'));
	app.use(bodyParser.json());
	app.use(express.static(__dirname + '/public'));
	app.use(urlencoded({ extended: false }));

	//PORT # 3001
	const PORT = 3001;


	//Connection to MySQL database
	const connection = mysql.createConnection({
		host: "localhost",
		// Your port; if not 3306
		port: 3306,
		// Your username
		user: "root",
		// Your password
		password: "",
		database: "fitTracker"
	});



//env twilio keys
	let accountSid = process.env.ACCOUNT_SID;
	let authToken = process.env.AUTHTOKEN;
	let twilioClient = new twilio(accountSid, authToken);
	const number = '3237150014';



	//Twilio Message Creator
	twilioClient.messages.create({
			to: number,  // Text this number
			from: process.env.TWILIO_NUMBER, // From a valid Twilio number
		  body: 'Hello! Welcome to FitHeart Tracker. A friend or family member has added you to their First Response Group. For more information visit https://github.com/lquijano/FitHeartTracker'
	})
	.then((message) => console.log(message.sid));


//env fitbit keys
	const client_id = process.env.CLIENT_ID;
	const fitbit_secret = process.env.FITBIT_SECRET;
	const client = new fitbitApiClient("FITBIT_ID", "FITBIT_SECRET");


	// Use the session middleware
	app.use(session({ secret: 'fitapp' , cookie: { maxAge: 60000 }}));

	// redirect the user to the Fitbit authorization page
	app.get("/hr", function (req, res) {
	    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	    res.redirect(client.getAuthorizeUrl('heartrate', 'http://localhost:3001/callback'));
	});

	// handle the callback from the Fitbit authorization flow
	app.get("/callback", function (req, res) {
	    // exchange the authorization code we just received for an access token
	    client.getAccessToken(req.query.code, 'http://localhost:3001/callback').then(function (result) {
	        // use the access token to fetch the user's profile information
	        req.session.authorized = true;
	        req.session.access_token = result.access_token;
	        req.session.save();
	        res.redirect("/");
	    }).catch(function (error) {
	        res.send(error);
	    });
	});

	app.get("/logout", function(req, res) {
	    req.session.authorized = false;
	    req.session.access_token = null;
	    req.session.save();
	    res.redirect("/");
	})

	app.get('/profile.json', function(req, res) {
	    if (req.session.authorized) {
	        client.get("/profile.json", req.session.access_token).then(function (results) {
	            res.json(results[0]);
	        });
	    } else {
	        res.status(403);
	        res.json({ errors: [{ message: 'not authorized' }]});
	    }
	});



	// Home Page
	app.get('/', function(req, res) {
		res.send('Hello, Welcome to iHeart :)!!!');
	});

	// Shows users DB Table
	app.get('/users', function(req, res){

		connection.query('SELECT * FROM users', function (error, results, fields) {
		if (error) throw error;
		res.json(results);
		});
	});

	// renders signup page
	app.get('/signup', function(req, res){
		res.sendFile(path.join(__dirname, "public/signUp.html"));
	});

	// Insert new users to the DB
	app.post('/signup', function(req, res){

		var query = connection.query(
		"INSERT INTO users SET ?",
		req.body,
		function(error, response, fields) {
			if (error) throw error;
			console.log(req.body);
			res.redirect('/');
		}
		);
	})


	// Listen on port 3001
	app.listen(PORT, function() {
	console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});
