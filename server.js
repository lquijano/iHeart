// Dependencies requirements
var express = require("express");
var app = express();

var passport = require("passport");
var flash = require("connect-flash");
var mysql = require("mysql");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var router = express.Router();
var path = require("path");

app.use(express.static("public"));

var PORT = 3000;

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms

// set up for ejs templating
app.set("view engine", "ejs");
// use res.render to load up an ejs view file

//Routes testing
// app.get("/", function(req, res) {
//   res.send("<h1>Welcome to the route path</h1>");
// });

// Initializes the connection variable to sync with a MySQL database
// module.exports = connection;

// Listener, starting our server
app.listen(PORT, function() {
  console.log("app is listening on: " + PORT);
});
