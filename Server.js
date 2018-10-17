//load necessities
var express = require('express');
var router = express.Router();
var socket = require('socket.io');

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
    res.cookie('key','',{maxAge: 0});
    res.cookie('shipsLeft','',{maxAge: 0});
    if(req.cookies.playerName == undefined){
        res.cookie('playerName','', {maxAge: 9000000});
        res.render('pages/index', {playerName:''});
    }else{
        try {
            Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
                res.render('pages/index', {
                    playerName: req.cookies.playerName,
                    playerInfo: playerInfo,
                });
            });
        } catch(e) {
            res.cookie('playerName','', {maxAge: 9000000});
            res.render('pages/index', {playerName:''});
        }
    }
});


app.get('/logout', function (req, res){
    //console.log("Logging out user: "+req.cookie.playerName);
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
    Connection.getPlayer(req.query.profileName, function (playerInfo) {
        res.render('pages/index', {
            playerName: req.query.profileName,
            playerInfo: playerInfo,
        });
    });
});

var games = new Array(100000).fill(null);
exports.games = games;
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
    games[key] = null;
}

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

//import io from 'socket.io-client';
var io2 = require('socket.io-client');
app.get('/join', function(req,res){

    //var io3 = io2.connect("http://localhost:6009");
    console.log("Joining game: "+req.query.key);
    console.log("Easy or hard AI: "+req.query.eOrH);
    var game;
    var tempKey;
    if(req.query.key == "single"){
        tempKey = genKey();
        res.cookie('key', tempKey, {maxAge: 9000000});
        console.log("Generated S Key: "+tempKey);

        var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
        var ai;
        var genMap = GameFunction.genRandomMap();
        if(req.query.eOrH == "easy"){
            ai = new AIFunction.AIOpponent(tempKey, genMap, 1);
        }else{
            ai = new AIFunction.AIOpponent(tempKey, genMap, 2);
        }
        game = new GameFunction.GameController(player, ai, tempKey);
        games[tempKey] = game;
    }else{
        //game = new GameFunction.GameController(req.query.key);
        tempKey = req.query.key;
        var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
        games[tempKey].setPlayer2(player);
        res.cookie('key', req.query.key, {maxAge: 9000000});
    }
    //res.cookie('turns', 0,{maxAge: 9000000});
    res.cookie('shipsLeft',[20,31,32,40,50],{maxAge: 9000000});
    console.log("Easy and hard are not complete.");
    var yourMap = games[tempKey].player1.getMap();
    var enemyMap = games[tempKey].player2.getMap();
    res.render('pages/game.ejs', {
        playerName:req.cookies.playerName,
        enemyName:games[tempKey].player2.playerName,
        turns:0,
        shipsLeft:[20,31,32,40,50],
        perror:"",
        yMap:yourMap,
        eMap:enemyMap,
        rKey:tempKey,
        isHost:"no",
        io:io2
    });
});

app.get('/host',function(req,res){
    var tempKey = genKey();
    res.cookie('key', tempKey, {maxAge: 9000000});
    console.log("Generated M Key: "+tempKey);
    var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
    games[tempKey] = new GameFunction.GameController(player, player, tempKey);
    console.log(tempKey);
    res.render('pages/game.ejs', {
        playerName:req.cookies.playerName,
        enemyName:"Missing opponent",
        turns:0,
        shipsLeft:[20,31,32,40,50],
        perror:"",
        yMap:emptyMap,
        eMap:emptyMap,
        rKey: tempKey,
        isHost:"yes",
        io:io2
    });

});
/*
app.get('/place',function(req,res) {
    var temp = "("+req.query.X+","+req.query.Y+","+req.query.L+","+req.query.D+")";
    console.log(temp);
    console.log(req.cookies);
    //console.log(req.query.L);
    var arr = req.cookies.shipsLeft;
    var index = -1;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == req.query.L){
            index = i;
            break;
        }
    }
    if(index == -1){
        res.render('pages/game.ejs', {
            playerName:req.cookies.playerName,
            enemyName:games[req.cookies.key].player2.playerName,
            turns:0,
            shipsLeft:arr,
            perror:"Invalid Train Length",
            yMap:games[req.cookies.key].player1.getMap(),
            eMap:games[req.cookies.key].player2.getMap(),
            rKey:"-1"
        });
    }else{
        //console.log(index);
        var x = (req.query.X)-1;
        var y = req.query.Y.toString();
            y = y.charCodeAt(0)-65;
        var l;
        if(req.query.L == 20 || req.query.L == 40 ||req.query.L == 50){
           l = req.query.L/10;
        }else{
            l = req.query.L;
        }
        var d = req.query.D;
        console.log(x+" "+y+" "+l+" "+d);
        console.log(req.cookies.playerName);
        var placed = games[req.cookies.key].addShip(req.cookies.playerName,x,y,l,d)
            if(placed == 1){
                res.render('pages/game.ejs', {
                    playerName:req.cookies.playerName,
                    enemyName:games[req.cookies.key].player2.playerName,
                    turns:0,
                    shipsLeft:arr,
                    perror:"Ship Placement Is Invalid",
                    yMap:games[req.cookies.key].player1.getMap(),
                    eMap:games[req.cookies.key].player2.getMap(),
                    rKey:"-1"
                });
            }else{
                arr.splice(index, 1);
                res.cookie('shipsLeft',arr,{maxAge: 9000000});
                if(arr.length > 0){
                    res.render('pages/game.ejs', {
                        playerName:req.cookies.playerName,
                        enemyName:games[req.cookies.key].player2.playerName,
                        turns:0,
                        shipsLeft:arr,
                        perror:"",
                        yMap:games[req.cookies.key].player1.getMap(),
                        eMap:games[req.cookies.key].player2.getMap(),
                        rKey:"-1"
                    });
                }else{
                    res.cookie('shipsLeft',"",{maxAge: 9000000});
                    res.cookie('turns',1,{maxAge: 9000000});
                    res.render('pages/game.ejs', {
                        playerName:req.cookies.playerName,
                        enemyName:games[req.cookies.key].player2.playerName,
                        turns:1,
                        shipsLeft:"",
                        perror:"",
                        yMap:games[req.cookies.key].player1.getMap(),
                        eMap:games[req.cookies.key].player2.getMap(),
                        rKey:"-1"
                    });
                }
            }
    }
});

app.get('/attack',function(req,res){
    var temp = "("+req.query.X+","+req.query.Y+")";
    console.log(temp);
    res.cookie('turn', (req.cookies.turns)+1, {maxAge: 9000000});
    games[req.cookies.key].checkHit(req.cookies.playerName, req.query.X, req.query.Y, function(hitOfMiss){
        if(hitOrMiss == 0){
            res.cookie('turns',req.cookies.turns+1,{maxAge: 9000000});
            res.render('pages/game.ejs', {
                playerName:req.cookies.playerName,
                enemyName:games[req.cookies.key].player2.playerName,
                turns:req.cookies.turns+1,
                shipsLeft:"",
                perror:"",
                yMap:games[req.cookies.key].player1.getMap(),
                eMap:games[req.cookies.key].player2.getMap(),
                rKey:"-1"
            });
        }else if(hitOrMiss == 1){
            res.render('pages/game.ejs', {
                playerName:req.cookies.playerName,
                turns:req.cookies.turns,
                enemyName:games[req.cookies.key].player2.playerName,
                shipsLeft:"",
                perror:"Location already fired upon. Choose again.",
                yMap:games[req.cookies.key].player1.getMap(),
                eMap:games[req.cookies.key].player2.getMap(),
                rKey:"-1"
            });
        }else{
            res.cookie('turns',req.cookies.turns+1,{maxAge: 9000000});
            res.render('pages/game.ejs', {
                playerName:req.cookies.playerName,
                enemyName:games[req.cookies.key].player2.playerName,
                turns:req.cookies.turns+1,
                shipsLeft:"",
                perror:"",
                yMap:games[req.cookies.key].player1.getMap(),
                eMap:games[req.cookies.key].player2.getMap(),
                rKey:"-1"
            });
        }
    });
});
*/

app.get('/deletePlayer',function(req,res){
    var name = req.cookies.playerName;
   Connection.deletePlayer(name, function(ret){
        res.cookie('playerName','', {maxAge: 9000000});
        res.render('pages/index', {playerName:''});
    });
});

app.get('/rules',function(req,res) {
    Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
        res.render('pages/rules', {
            playerName: req.cookies.playerName,
            playerInfo: playerInfo,
        });
    });
});

app.get('/leaderboard',function(req,res) {
    Connection.getleaderboard(function (userInfo) {
        Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
            res.render('pages/leaderboard', {
                playerName: req.cookies.playerName,
                userInfo: userInfo,
                playerInfo: playerInfo,
            });
        });
    });
});

//app.listen(6009);
var serverListener = app.listen(6009);
console.log('6009 is the open port');

//THIS MAY NEED TO BE MOVED UP OR DOWN
var io = socket(serverListener);


io.on('connection', function(socket) {
    //do a thing
    console.log("socket connection established " + socket.id);

    //setup player stuff
    socket.on('setup', function(sockKey) {
        games[sockKey.setupKey].p1SocketId = socket.id;
        console.log(socket.id + " setting " + sockKey.setupKey + " to " + games[sockKey.setupKey].p1SocketId);
    });

    //if joinging a game
    socket.on('joining', function(joinInfo) {
        //do a thing
        console.log("User "+joinInfo.name+" attempting to join "+joinInfo.key);
        games[joinInfo.key].p2SocketId = socket.id;
        console.log(socket.id + " joining " + joinInfo.key + " to " + games[joinInfo.key].p2SocketId);
    });
});

