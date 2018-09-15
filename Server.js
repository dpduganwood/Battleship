//load necessities
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Connection = require(__dirname + "/Connection.js");
var path = require('path');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '')));

//To start SQL: Load MySQL. Find Services in search, activate MySQLExpre and MySQL Router.
//In MySQL, Forward Engineer, next until complete.
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "Battletracks_db"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected with Database");
});
//set the view engine to ejs
app.set('view engine', 'ejs');
//user res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.listen(6009);
console.log('6009 is the open port');