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
	app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365}}));

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

	//env fitbit keys
	const fitbit_id = process.env.FITBIT_ID;
	const fitbit_secret = process.env.FITBIT_SECRET;
	const client = new fitbitApiClient("FITBIT_ID ", "FITBIT_SECRET");
	
	//env twilio keys
	const accountSid = process.env.ACCOUNT_SID;
	const authToken = process.env.AUTHTOKEN;
	const twilioClient = new twilio(accountSid, authToken);
	const number = '3237150014';



	//Twilio Message Creator
	twilioClient.messages.create({
			to: number,  // Text this number
			from: process.env.TWILIO_NUMBER, // From a valid Twilio number
		  body: 'Hello! Welcome to FitHeart Tracker. A friend or family member has added you to their First Response Group. For more information visit https://github.com/lquijano/FitHeartTracker'
	})
	.then((message) => console.log(message.sid));


	// redirect the user to the Fitbit authorization page
	app.get("/hr", function (req, res) {
	    // request access to the user's heartrate
	    res.redirect(client.getAuthorizeUrl('heartrate', 'http://localhost:3001/callback'));
	});

	// handle the callback from the Fitbit authorization flow
	app.get("/callback", function (req, res) {
	        var menu = "<p><a href='/gethr?code=" + req.query.code + "'>Get HR for Today</a>" +
	                   "<p><a href='/gethr?code=" + req.query.code + "&day=yyyy-MM-dd'>Get HR for Specific Day (Must Manually Update URL)</a>";
	        res.send(menu);
	});

	app.get("/gethr", function (req, res) {
	        var specificday = req.query.day;
	        var code      = req.query.code;

	    // exchange the authorization code we just received for an access token
	    client.getAccessToken(code, 'http://localhost:3001/callback').then(function (result) {
	        // log the access token
	//      console.log("Got access token: " + result.access_token);
	        // use the access token to fetch the user's profile information
	        if(specificday) {
	                client.get("/activities/heart/date/" + specificday + "/" + specificday + "/1sec/time/00:00/23:59.json", result.access_token).then(function (results) {
	                var csv = "<pre>date,time,HR";
	                for(var bit in results[0]['activities-heart-intraday']['dataset']) {
	                        csv = csv + "\r\n" + specificday + "," + results[0]['activities-heart-intraday']['dataset'][bit]['time'] + ',' + results[0]['activities-heart-intraday']['dataset'][bit]['value'];
	                }
	                res.send(csv);
	               });

	        } else {

	        client.get("/activities/heart/date/today/1d/1sec/time/00:00/23:59.json", result.access_token).then(function (results) {
	                //Now get the heart rate data
	                var csv = "<pre>date,time,HR";
	                var datebit = dateFormat( (new Date()), 'yyyy-mm-dd' );
	                for(var bit in results[0]['activities-heart-intraday']['dataset']) {
	                        csv = csv + "\r\n" + datebit + "," + results[0]['activities-heart-intraday']['dataset'][bit]['time'] + ',' + results[0]['activities-heart-intraday']['dataset'][bit]['value'];
	                }
	            res.send(csv);
	        });

	        }
	    }).catch(function (error) {
	        res.send(error);
	    });
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
			// res.redirect('/');
		}
		);
	})


	// Listen on port 3001
	app.listen(PORT, function() {
	console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});
