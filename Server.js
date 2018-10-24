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

var passportSetup = require('./config/passport-setup');
var authRoutes = require('./routes/auth-routes');
const passport = require('passport');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '')));
app.use(express.static("Public"));


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
    res.cookie('key', '', {maxAge: 0});
    res.cookie('shipsLeft', '', {maxAge: 0});
    if (req.cookies.playerName == undefined) {
        res.cookie('playerName', '', {maxAge: 9000000});
        res.render('pages/index', {playerName: ''});
    } else {
        try {
            Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
                res.render('pages/index', {
                    playerName: req.cookies.playerName,
                    playerInfo: playerInfo,
                });
            });
        } catch (e) {
            res.cookie('playerName', '', {maxAge: 9000000});
            res.render('pages/index', {playerName: ''});
        }
    }
});


app.get('/logout', function (req, res) {
    //console.log("Logging out user: "+req.cookie.playerName);
    res.cookie('playerName', '', {maxAge: 9000000});
    res.render('pages/index', {playerName: ''});
});

exports.register = register;

function register(profile, user) {
    console.log("Test register func.");
    Connection.procUser(profile, function (status) {
        /*var link = "login?profile="+status;
        console.log("link: "+link);
        xhr.open("POST", "Server.js", true);
        xhr.send(link);*/
        user(status);
    });
}

app.get('/login2', function (req, res) {
    console.log("Status from passport/register: " + req.query.profileName);
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

function genKey() {
    for (var i = 0; i < 100000; i++) {
        if (keys[i] == 0) {
            keys[i] = 1;
            return i;
        }
    }
}

function exitGame(key) {
    keys[key] = 0;
    games[key] = null;
}

var emptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];


app.get('/join', function (req, res) {
    console.log("Joining game: " + req.query.key);
    //console.log("Easy or hard AI: "+req.query.eOrH);
    var game;
    var tempKey;
    if (req.query.key == "single") {
        tempKey = genKey();
        res.cookie('key', tempKey, {maxAge: 9000000});
        console.log("Generated S Key: " + tempKey);

        var newEmptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        //var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
        var player = new GameFunction.Player(req.cookies.playerName, newEmptyMap, tempKey);
        var ai;
        var genMap = GameFunction.genRandomMap();
        if (req.query.eOrH == "easy") {
            ai = new AIFunction.AIOpponent(tempKey, genMap, 1);
        } else {
            ai = new AIFunction.AIOpponent(tempKey, genMap, 2);
        }
        game = new GameFunction.GameController(player, ai, tempKey);
        games[tempKey] = game;
    } else {
        //game = new GameFunction.GameController(req.query.key);
        tempKey = req.query.key;
        var newEmptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        //var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
        var player = new GameFunction.Player(req.cookies.playerName, newEmptyMap, tempKey);
        games[tempKey].setPlayer2(player);
        res.cookie('key', req.query.key, {maxAge: 9000000});
    }
    //res.cookie('turns', 0,{maxAge: 9000000});
    //res.cookie('shipsLeft', [20, 31, 32, 40, 50], {maxAge: 9000000});
    //console.log("Easy and hard are not complete.");
    var yourMap = games[tempKey].player2.getMap();
    var enemyMap = games[tempKey].player1.getMap();
    //console.log(yourMap);
    if(req.query.key == "single"){
        Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
            res.render('pages/game.ejs', {
                playerInfo: playerInfo,
                playerName: req.cookies.playerName,
                enemyName: games[tempKey].player2.playerName,
                turns: 0,
                shipsLeft: [20, 31, 32, 40, 50],
                yMap: yourMap,
                eMap: enemyMap,
                rKey: tempKey,
                isHost: "no"
            });
        });
    }else{
        Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
            res.render('pages/game.ejs', {
                playerInfo: playerInfo,
                playerName: req.cookies.playerName,
                enemyName: games[tempKey].player1.playerName,
                turns: 0,
                shipsLeft: [20, 31, 32, 40, 50],
                yMap: yourMap,
                eMap: enemyMap,
                rKey: tempKey,
                isHost: "no"
            });
        });
    }

});

app.get('/host', function (req, res) {
    var tempKey = genKey();
    res.cookie('key', tempKey, {maxAge: 9000000});
    console.log("Generated M Key: " + tempKey);

    var newEmptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    //var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
    var player = new GameFunction.Player(req.cookies.playerName, newEmptyMap, tempKey);
    games[tempKey] = new GameFunction.GameController(player, player, tempKey);
    console.log(tempKey);
    Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
        res.render('pages/game.ejs', {
            playerInfo: playerInfo,
            playerName: req.cookies.playerName,
            enemyName: "Missing opponent",
            turns: 0,
            shipsLeft: [20, 31, 32, 40, 50],
            yMap: emptyMap,
            eMap: emptyMap,
            rKey: tempKey,
            isHost: "yes"
        });
    });
});

var randomLobby = new Array(3).fill(-1);

function addRandom(ins) {
    console.log("random lobby gen: " + ins);
    console.log(randomLobby);
    if (randomLobby[0] == -1) {
        randomLobby[0] = ins;
        console.log("first random");
        return -1;
    } else {
        var temp = randomLobby[0];
        randomLobby[0] = -1;
        console.log("joining random");
        return temp;
    }
}

app.get('/random', function (req, res) {
    var tempKey = genKey();
    var ret = addRandom(tempKey)
    console.log("ret: " + ret);
    if (ret != -1) {
        exitGame(tempKey);

        var newEmptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        //var player = new GameFunction.Player(req.cookies.playerName, emptyMap, ret);
        var player = new GameFunction.Player(req.cookies.playerName, newEmptyMap, ret);
        games[ret].setPlayer2(player);
        res.cookie('key', ret, {maxAge: 9000000});
        var yourMap = games[ret].player2.getMap();
        var enemyMap = games[ret].player1.getMap();
        console.log(randomLobby);
        console.log(games[ret]);
        Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
            res.render('pages/game.ejs', {
                playerInfo: playerInfo,
                playerName: req.cookies.playerName,
                enemyName: games[ret].player1.playerName,
                turns: 0,
                shipsLeft: [20, 31, 32, 40, 50],
                yMap: yourMap,
                eMap: enemyMap,
                rKey: ret,
                isHost: "no"
            });
        });
    } else {
        res.cookie('key', tempKey, {maxAge: 9000000});
        console.log("Generated Random Lobby Key: " + tempKey);

        var newEmptyMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        //var player = new GameFunction.Player(req.cookies.playerName, emptyMap, tempKey);
        var player = new GameFunction.Player(req.cookies.playerName, newEmptyMap, tempKey);
        games[tempKey] = new GameFunction.GameController(player, player, tempKey);
        console.log(tempKey);
        Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
            res.render('pages/game.ejs', {
                playerInfo: playerInfo,
                playerName: req.cookies.playerName,
                enemyName: "Missing opponent",
                turns: 0,
                shipsLeft: [20, 31, 32, 40, 50],
                yMap: emptyMap,
                eMap: emptyMap,
                rKey: tempKey,
                isHost: "no"
            });
        });
    }
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

app.get('/deletePlayer', function (req, res) {
    var name = req.cookies.playerName;
    Connection.deletePlayer(name, function (ret) {
        res.cookie('playerName', '', {maxAge: 9000000});
        res.render('pages/index', {playerName: ''});
    });
});

app.get('/rules', function (req, res) {
    Connection.getPlayer(req.cookies.playerName, function (playerInfo) {
        res.render('pages/rules', {
            playerName: req.cookies.playerName,
            playerInfo: playerInfo,
        });
    });
});

app.get('/leaderboard', function (req, res) {
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
exports.ServerIO = io;


io.on('connection', function (socket) {

    socket.gameOver = false;

    socket.on('basics', function (properties) {
        //console.log("check game over: " + socket.gameOver);
        socket.user_name = properties.playerName;
        socket.game_key = properties.game_key;

        console.log("socket properties " + socket.user_name + " " + socket.game_key);

        if(games[socket.game_key].player1.playerName == socket.user_name) {
            //is player 1
            games[socket.game_key].p1SocketId = socket.id;
            console.log("readout " + games[socket.game_key].p1SocketId);
            socket.emit('joined');
        } else {
            //is player 2
            games[socket.game_key].p2SocketId = socket.id;
            console.log("readout " + games[socket.game_key].p1SocketId);
            //io.sockets.socket(games[socket.game_key].p1SocketId).emit('p2Info', {pName: socket.user_name});
            io.to(games[socket.game_key].p1SocketId).emit('p2Info', {pName: socket.user_name});
            socket.emit('joined');
        }
    });
    //do a thing
    console.log("socket connection established " + socket.id);

    //setup player stuff

    /*socket.on('setup', function(sockKey) {
        games[sockKey.setupKey].p1SocketId = socket.id;
        console.log(socket.id + " setting " + sockKey.setupKey + " to " + games[sockKey.setupKey].p1SocketId);
    });*/

    //if joinging a game

    /*socket.on('joining', function(joinInfo) {

        //do a thing
        console.log("User " + joinInfo.name + " attempting to join " + joinInfo.key);
        games[joinInfo.key].p2SocketId = socket.id;
        console.log(socket.id + " joining " + joinInfo.key + " to " + games[joinInfo.key].p2SocketId);
    });*/

    socket.on('playerWin', function(){
        socket.gameOver = true;
        var checkType = games[socket.game_key].player2.type;
        if(checkType != 0) {
            //AI game
            Connection.addPlayerSPWin(socket.user_name, function(result) {
                if(result == 1) {
                    //error
                } else {
                    //success
                }
            });
        } else {
            Connection.addPlayerMPWin(socket.user_name, function(result) {
                if(result == 1) {
                    //error
                } else {
                    //success
                }
            });
        }
        //add player hits and misses to db
        var hits;
        var misses;
        if(games[socket.game_key].player1.playerName == socket.user_name) {
            //is player 1
            hits = games[socket.game_key].player1.hits;
            misses = games[socket.game_key].player1.misses;
        } else {
            //is player 2
            hits = games[socket.game_key].player2.hits;
            misses = games[socket.game_key].player2.misses;
        }
        /*Connection.setPlayerHits(socket.user_name, hits);
            Connection.setPlayerMisses(socket.user_name, misses);*/
            Connection.addPlayerHitsBySum(socket.user_name, hits, function(result) {
                //do nothing
            });
            Connection.addPlayerMissesBySum(socket.user_name, misses, function(result) {
                //do nothing
            });
    });

    socket.on('playerLoss', function() {
        socket.gameOver = true;
        var checkType = games[socket.game_key].player2.type;
        if(checkType != 0) {
            //AI game
            Connection.addPlayerSPLoss(socket.user_name, function(result) {
                if(result == 1) {
                    //error
                } else {
                    //success
                }
            });
        } else {
            Connection.addPlayerMPLoss(socket.user_name, function(result) {
                if(result == 1) {
                    //error
                } else {
                    //success
                }
            });
        }
        //add player hits and misses to db
        var hits;
        var misses;
        if(games[socket.game_key].player1.playerName == socket.user_name) {
            //is player 1
            hits = games[socket.game_key].player1.hits;
            misses = games[socket.game_key].player1.misses;
        } else {
            //is player 2
            hits = games[socket.game_key].player2.hits;
            misses = games[socket.game_key].player2.misses;
        }
        /*Connection.setPlayerHits(socket.user_name, hits);
            Connection.setPlayerMisses(socket.user_name, misses);*/
            Connection.addPlayerHitsBySum(socket.user_name, hits, function(result) {
                //do nothing
            });
            Connection.addPlayerMissesBySum(socket.user_name, misses, function(result) {
                //do nothing
            });
    });

    socket.on('place', function (placementParams) {
        console.log("placing");
        console.log(socket.user_name);
        var result = games[socket.game_key].addShip(socket.user_name, placementParams.xLoc, placementParams.yLoc, placementParams.leng, placementParams.dir);
        if (result == 0) {
            //success
            console.log("place success");
            //io.clients[socket.id].send();
            socket.emit('place_ok', {
                xLoc: placementParams.xLoc,
                yLoc: placementParams.yLoc,
                leng: placementParams.leng,
                dir: placementParams.dir
            });
        } else {
            //failure
            console.log("place fail");
            socket.emit('place_fail');
        }
    });

    socket.on('placeDone', function(){
        if(games[socket.game_key].player1.playerName == socket.user_name){
            games[socket.game_key].player1Counter = 1;
        }else{
            games[socket.game_key].player2Counter = 1;
        }

        if(games[socket.game_key].player1Counter + games[socket.game_key].player2Counter == 2){
            console.log("Placing Complete.");
            if(games[socket.game_key].player2.type != 0) {
                //AI game
                socket.emit("placeDone");
            } else {
                //multiplayer game

                if(games[socket.game_key].player1.playerName == socket.user_name) {
                    //is player 1
                    socket.emit("placeDone");
                    var id = games[socket.game_key].p2SocketId;
                    io.to(id).emit("waitPlace");
                } else {
                    //is player 2
                    var id = games[socket.game_key].p1SocketId;
                    io.to(id).emit('placeDone');
                    socket.emit("waitPlace");
                }
            }
        }
    });
    //fire button clicked
    socket.on('fire', function (fireParams) {
        //output needs to be sent to both clients
        //games[fireParams.paramKey].checkHit(fireParams.playerName, fireParams.xLoc, fireParams.yLoc, function(result){
        games[socket.game_key].checkHit(socket.user_name, fireParams.xLoc, fireParams.yLoc, function (result) {
            if (result == 0 || result == 2 || result == 5 || result == 4) {
                //valid target. miss / hit, win
                if(games[socket.game_key].player2.type != 0) {
                    //AI game
                    socket.emit("myFire", {xLoc: fireParams.xLoc, yLoc: fireParams.yLoc, result: result});
                } else {
                    //multiplayer game
                    socket.emit("myFire", {xLoc: fireParams.xLoc, yLoc: fireParams.yLoc, result: result});
                    if(games[socket.game_key].player1.playerName == socket.user_name) {
                        //is player 1
                        var id = games[socket.game_key].p2SocketId;
                        io.to(id).emit('enemyFire', {xLoc: fireParams.xLoc, yLoc: fireParams.yLoc, result: result});
                    } else {
                        //is player 2
                        var id = games[socket.game_key].p1SocketId;
                        io.to(id).emit('enemyFire', {xLoc: fireParams.xLoc, yLoc: fireParams.yLoc, result: result});
                    }
                }
            } else if (result == 1) {
                //invalid target, try again
                //signal only attacking player
                //socket.emit("invalidTarget");
                socket.emit("myFire", {xLoc: fireParams.xLoc, yLoc: fireParams.yLoc, result: result});
            }
        });
    });

    socket.on('disconnect', function () {
        //var sockName = socket.user_name;
        //var sockKey = socket.game_key;
        console.log(socket.gameOver);
        if (games[socket.game_key].gameOver) {
            //do nothing
            console.log("normal exit");
        } else {
            //increment player loss count
            console.log("sudden disconnection");
            games[socket.game_key].gameOver = true;
            var type1 = games[socket.game_key].player1.type;
            var type2 = games[socket.game_key].player2.type;
            if(type1 != 0 || type2 != 0) {
                //is AI game
                Connection.addPlayerSPLoss(socket.user_name, function(result){
                    if(result == 0) {
                        //success
                    } else {
                        //fail
                    }
                });
            } else {
                Connection.addPlayerMPLoss(socket.user_name, function(result) {
                    if(result == 0) {
                        //success
                    } else {
                        //fail
                    }
                });
                
                if(games[socket.game_key].player1.playerName == socket.user_name) {
                    //is player 1
                    var id = games[socket.game_key].p2SocketId;
                    console.log(id);
                    io.to(id).gameOver = true;
                    io.to(id).emit('enemyDisconnect');

                    //set player2 stats
                    Connection.addPlayerMPWin(games[socket.game_key].player2.playerName, function(result) {
                        //do nothing
                    });
                    var hits;
                    var misses;
                    hits = games[socket.game_key].player2.hits;
                    misses = games[socket.game_key].player2.misses;
                    Connection.addPlayerHitsBySum(games[socket.game_key].player2.playerName, hits, function(result) {
                        //do nothing
                    });
                    Connection.addPlayerMissesBySum(games[socket.game_key].player2.playerName, misses, function(result) {
                        //do nothing
                    });
                } else {
                    //is player 2
                    var id = games[socket.game_key].p1SocketId;
                    console.log(id);
                    io.to(id).gameOver
                    io.to(id).emit('enemyDisconnect');

                    //set player1 starts
                    Connection.addPlayerMPWin(games[socket.game_key].player1.playerName, function(result) {
                        //do nothing
                    });
                    var hits;
                    var misses;
                    hits = games[socket.game_key].player1.hits;
                    misses = games[socket.game_key].player1.misses;
                    Connection.addPlayerHitsBySum(games[socket.game_key].player1.playerName, hits, function(result) {
                        //do nothing
                    });
                    Connection.addPlayerMissesBySum(games[socket.game_key].player1.playerName, misses, function(result) {
                        //do nothing
                    });
                }
            }

            var hits;
            var misses;
            
            if(games[socket.game_key].player1.playerName == socket.user_name) {
                //is player 1
                hits = games[socket.game_key].player1.hits;
                misses = games[socket.game_key].player1.misses;
            } else {
                //is player 2
                hits = games[socket.game_key].player2.hits;
                misses = games[socket.game_key].player2.misses;
            }
            console.log(socket.user_name + " " + socket.game_key + " " + socket.gameOver + " " + hits + " " + misses);
            /*Connection.setPlayerHits(socket.user_name, hits);
            Connection.setPlayerMisses(socket.user_name, misses);*/
            console.log("at hit and miss adding point");
            Connection.addPlayerHitsBySum(socket.user_name, hits, function(result) {
                //do nothing
            });
            Connection.addPlayerMissesBySum(socket.user_name, misses, function(result) {
                //do nothing
            });
        }
        if(games[socket.game_key] != null) {
            exitGame(socket.game_key);
        }
    });
});



