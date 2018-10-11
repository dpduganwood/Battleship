//load necessities
var express = require('express');
var router = express.Router();

var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Connection = require(__dirname + "/Connection.js");
var GameFunction = require(__dirname + "/GameFunctions.js");
var AIFunction = require(__dirname + "/AIFunctions.js");
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
    console.log("Logging out user: "+req.cookie.playerName);
    res.cookie('playerName', '', {maxAge: 9000000});
    res.render('pages/index', {playerName:''});
});

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

app.get('/login2', function(req, res) {
    console.log("Status from passport/register: "+req.query.profileName);
    res.cookie('playerName', req.query.profileName, {maxAge: 9000000});
    res.render('pages/index', {playerName:req.query.profileName});
});
var keys = new Array(100000).fill(0);
function genKey(){
    for(var i = 0; i < 100000; i++){
        if(keys[i] == 0){
            keys[i] = 1;
            return i;
        }
    }
}
function exitGame(key){
    keys[key] = 0;
}
app.get('/join', function(req,res){
    console.log("Joining game: "+req.query.key);
    console.log("Easy or hard AI: "+req.query.eOrH);
    var emptyMap = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    var game;
    if(req.query.key == "single"){
        var tempKey = genKey();
        res.cookie('key', tempKey, {maxAge: 9000000});
        var player = new GameFunction.Player(req.cookies.playerName, emptyMap);
        var ai;
        if(req.query.eOrH == "easy"){
            ai = new AIFunction.AIOpponent(tempKey, emptyMap);
        }else{
            ai = new AIFunction.AIOpponent(tempKey, emptyMap);
        }
        game = new GameFunction.GameController(player, ai, tempKey);
    }else{
        //game = new GameFunction.GameController(req.query.key);
        res.cookie('key', req.query.key, {maxAge: 9000000});
    }
    res.cookie('lastAttack', "", {maxAge: 9000000});
    console.log("Easy and hard are not complete.");

    res.render('pages/game.ejs', {playerName:req.cookies.playerName});
});

app.get('/attack',function(req,res){
    var temp = "("+req.query.X+","+req.query.Y+")";
    console.log(temp);
    if(req.cookies.lastAttack === temp){
        res.render('pages/game.ejs', {playerName:req.cookies.playerName});
    }else{
        res.cookie('lastAttack', temp, {maxAge: 9000000});
        res.render('pages/game.ejs', {playerName:req.cookies.playerName});
    }

});

app.listen(6009);
console.log('6009 is the open port');