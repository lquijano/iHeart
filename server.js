	//Dependencies
	const dotenv = require('dotenv').config()
	const express = require('express');
	const { urlencoded } = require('body-parser');
	const twilio = require('twilio');
	const cookieParser = require('cookie-parser');
	const mysql = require("mysql");
	const path = require('path');
	const fitbitApiClient = require("fitbit-node");

	//Envoking Express
	let app = express();
	
	app.use(cookieParser('sess'));
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
	
	// initialize the Fitbit API client
	// const fitbitClient = new FitbitApiClient({
	// 	fitbitClientId: process.env.FITBIT_ID,
	// 	fitbitClientSecret: process.env.FITBIT_SECRET,
	// 	apiVersion: '1.2' // 1.2 is the default
	// });
	
	// redirect the user to the Fitbit authorization page
	app.get("/authorize", (req, res) => {
		// request access to the user's heartrate, location, profile
		res.redirect(fitbitClient.getAuthorizeUrl('heartrate, location, profile information', 'https://fithearttracker.herokuapp.com/home'));
	});
	
	// handle the callback from the Fitbit authorization flow
	app.get("/callback", (req, res) => {
		// exchange the authorization code we just received for an access token
		fitbitClient.getAccessToken(req.query.code, 'https://fithearttracker.herokuapp.com/home').then(result => {
			// use the access token to fetch the user's profile information
			fitbitClient.get("/profile.json", result.access_token).then(results => {
				res.send(results[0]);
			}).catch(err => {
				res.status(err.status).send(err);
			});
		}).catch(err => {
			res.status(err.status).send(err);
		});
	});


	// Home Page
	app.get('/', function(req, res) {
		res.send('Hello, Welcome to iHeart :)!!!');
	});

	// Shows users DB Table
	app.get('/fit', function(req, res){

		connection.query('SELECT * FROM users', function (error, results, fields) {
		if (error) throw error;
		res.json(results);
		});
	});

	//Shows family members DB Table
	app.get('/firstresponse', function(req, res){

		connection.query('SELECT * FROM firstResponse', function (error, results, fields) {
		if (error) throw error;
		res.json(results);
		});
	});

	// Sign up form
	app.post('/new_user', function(req, res){
		
		var query = connection.query(
		"INSERT INTO users SET ?",
		req.body,
		function(error, response, fields) {
			if (error) throw error;
			console.log(req.body);
			res.redirect('/fit');
		}
		);
	})









	
	// Listen on port 3001
	app.listen(PORT, function() {
	console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});
