//load necessities
var express = require('express');
var router = express.Router();

var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Connection = require(__dirname + "/Connection.js");
var path = require('path');

var passportSetup=require('./config/passport-setup');
var authRoutes = require('./routes/auth-routes');
const passport=require('passport');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();



// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));
app.use( express.static( "Public" ) );


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
    try {
        res.render('pages/index', {playerName:req.cookie.playerName});
    } catch(e) {
        res.cookie('playerName','', {maxAge: 9000000});
        res.render('pages/index', {playerName:''});
    }
});

app.get('/logout', function (req, res){
    res.cookie('playerName', '', {maxAge: 9000000});
    res.render('pages/index', {playerName:''});
});
/*
var grids = new Array(100);
class Grid {
    constructor(height, width){
        this.height = height;
        this.width = width;
        this.grid = new Array(height);
        for(var i = 0; i < this.grid.length; i++){
            this.grid[i] = new Array(this.width);
        }
        for(var i = 0; i < this.grid.length; i++){
            for(var j = 0; j < this.grid[i].length; j++){
                this.grid[i][j] = 0;
            }
        }
    }
    //grid settings: 0 = empty, 1 = ship (unhit), 2 = ship (hit), 3 = miss
    setShip(x,y, dir) {
    }
}
*/
exports.register = register;
function register(profile, user) {
    console.log("Test register func.");
    Connection.procUser(profile, function(status) {
        /*var link = "login?profile="+status;
        console.log("link: "+link);
        xhr.open("POST", "Server.js", true);
        xhr.send(link);*/
        user(status);
    });
}
/*
app.get('/login', function(req, res) {
    console.log(req.body);
    console.log("Status from passport/register: "+req.body.profile);
    res.cookie('playerName', req.body.profile, {maxAge: 9000000});
    res.render('pages/index', {playerName:req.body.profile});
});
*/
/*
app.get('/register', function (req, res) {

});
*/

app.listen(6009);
console.log('6009 is the open port');