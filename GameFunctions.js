var Connection = require(__dirname + "/Connection.js");
var Server = require(__dirname + "/Server.js");
//var Server = require(__dirname + "Server.js");
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

class Player {
    //player object containing the player name, map, hit and miss count
    constructor(playerName, map, gameKey) {
        this.playerName = playerName;
        this.map = map;
        this.gameKey = gameKey;
        this.type = 0;
        exports.map = map;

        //get hits and misses from the database
        Connection.con.query("SELECT hits, misses FROM users WHERE displayName = '" + playerName + "'", function(err, result) {
            if(err) {
                throw err;
            } else {
                this.hits = result[0].hits;
                this.misses = result[0].misses;
            }
        });
    }

    getMap() {
        return this.map;
    }

    setMap(map) {
        this.map = map;
    }

    checkHit(x,y/*, cb*/) {
        if(this.map[y][x] % 2 == 0) {
            this.map[y][x] += 1;
            if((this.map[y][x]-1) == 0) {
                //cb(0); //target id zero. MISS
                return 0;
            } else {
                //cb(2); //target id even. HIT
                return 2;
            }
            //this.map[y][x] += 1;
        } else {
            //cb(1); //target id odd. INVALID TARGET
            return 1;
        }
    }
}
exports.Player = Player;
class GameController {
    /*constructor(user1_name, user2_name, user1_map, user2_map, gameKey) {
        this.user1_name;
        this.user2_name;
        this.user1_map = user1_map;
        this.user2_map = user2_map;
        this.gameKey = gameKey;
    }*/
    constructor(player1, player2, gameKey) {
        this.player1 = player1;
        this.p1SocketId = null;
        this.player2 = player2;
        this.p2SocketId = null;
        this.gameKey = gameKey;
        this.player1Counter = 0;
        this.player2Counter = 0;
        this.gameOver = false;
    }

    getPlayer1Socket(){
        return this.p1SocketId;
    }

    getPlayer2Socket(){
        return this.p2SocketId;
    }

    checkHit(attackingPlayerName, x, y, cb) {
        var attackingPlayer;
        var checkPlayer;
        var p = 0;
        if(this.player1.playerName === attackingPlayerName) {
            attackingPlayer = this.player1;
            checkPlayer = this.player2;
            p = 1;
        } else {
            attackingPlayer = this.player2;
            checkPlayer = this.player1;
            p = 2;
        }
        /*checkPlayer.checkHit(x, y, function(result) {
            if(result == 0) {
                //miss
                attackingPlayer.misses += 1;
                //advance turn
            } else if(result == 2) {
                //hit
                attackingPlayer.hits += 1;
                //advance turn
            }
            if(result != 1) {
                if(p == 1) {
                    this.playerName;
                } else {
                    this.player2Counter++;
                }
            }
            //else invalid
            cb(result);
        });*/
        var result = checkPlayer.checkHit(x,y);
        if(result == 0) {
            //miss
            attackingPlayer.misses += 1;
            //advance turn
        } else if(result == 2) {
            //hit
            attackingPlayer.hits += 1;
            //advance turn
        }
        if(result != 1) {
            if(p == 1) {
                this.player1Counter++;
            } else {
                this.player2Counter++;
            }
        } else {
            //invalid target
            //send invalid signal
            cb(result);
            return;
        }

        var foundEven = false;
        for(var j = 0; j < 9; j++) {
            for(var k = 0; k < 9; k++) {
                if(checkPlayer.getMap()[k][j]%2 == 0 && checkPlayer.getMap()[k][j] != 0) {
                    foundEven = true;
                    break;
                }
            }
            if(foundEven) {
                break;
            }
        }

        if(!foundEven) {
            this.gameOver = true;
            result = 5;
        }

        cb(result);

        if(result != 1 && !this.gameOver) {
            //advance turn, AI
            if(checkPlayer.type != 0) {
                //checkPlayer is an AI
                //var loc = this.player2.easyAISelectLocation(this.player1.getMap());
                if(checkPlayer.type == 1) {
                    //easy ai
                    var loc = checkPlayer.easyAISelectLocation(attackingPlayer.getMap());
                    this.checkHit(checkPlayer.displayName, loc[0], loc[1], function(result) {
                        //do nothing for now
                        if(result == 0 || result == 2) {
                            //valid hit or miss
                            console.log("AI hitting " + loc[0] + " " + loc[1] + " " + result);
                            console.log(checkPlayer.gamekey);

                            //chekc if game win
                            var foundAIEven = false;
                            for(var j = 0; j < 9; j++) {
                                for(var k = 0; k < 9; k++) {
                                    if(attackingPlayer.getMap()[k][j]%2 == 0 && attatckingPlayer.getMap()[k][j] != 0) {
                                        foundAIEven = true;
                                        break;
                                    }
                                }
                                if(foundAIEven) {
                                    break;
                                }
                            }

                            if(!foundAIEven) {
                                //AI wins game
                                Server.games[checkPlayer.gamekey].gameOver = true;
                                result = 5;
                            }

                            var id = Server.games[checkPlayer.gamekey].p1SocketId;
                            Server.ServerIO.to(id).emit('enemyFire', {xLoc: loc[0], yLoc: loc[1], result: result});
                        } else {
                            //invalid target
                            console.log("AI serious problem");
                        }
                    });
                } else {
                    //hard ai
                }
            }
        }
        //else do not advance turn

        //console.log(this.player1.getMap());
        //console.log(this.player2.getMap());
        //return result
    }
    setPlayer2(player2){
        this.player2 = player2;
    }
    addShip(playerName, x, y, length, dir) {
        var player;
        //console.log("given name: "+playerName+", player1.playerName: "+this.player1.playerName);
        if(playerName === this.player1.playerName) {
            console.log("adding player 1");
            player = this.player1;
            //console.log("p1");
        } else {
            player = this.player2;
            //console.log("p2");
        }

        var playerMap = player.getMap();
        //console.log(playerMap);
        var boardVal = 0;

        if(length == 2) {
            boardVal = 2;
        } else if(length == 3) {
            length = 3;
            boardVal = 4;
            for(var j = 0; j < 10; j++) {
                for(var k = 0; k < 10; k++) {
                    if(playerMap[k][j] == 4) {
                        boardVal = 6;
                        break;
                    }
                }
            }
        } /*else if(length == 32) {
            length = 3;
            boardVal = 6;
        }*/ else if(length == 4) {
            boardVal = 8;
        } else if(length == 5) {
            boardVal = 10;
        }
        var i;
        switch(dir) {
            case 'U':
                //check above
                if(y - (length-1) < 0) {
                    //out of bounds
                    console.log("Out of bounds");
                    return(1);
                }
                for(i = 0; i < length; i++){
                    //check for collision
                    if(playerMap[y-i][x] != 0) {
                        //collision detected
                        console.log("Collision detected");
                        return(1);
                    }
                }
                //is valid
                for(i = 0; i < length; i++) {
                    playerMap[y-i][x] = boardVal;
                }

                break;
            case 'D':
                //check below
                if(y + (length-1) > 9) {
                    //out of bounds
                    console.log("Out of bounds");
                    return(1);
                }
                for(i = 0; i < length; i++) {
                    //check for collision
                    if(playerMap[y+i][x] != 0){
                        //collision detected
                        console.log("Collision detected");
                        return(1);
                    }
                }
                //is valid
                for(i = 0; i < length; i++) {
                    playerMap[y+i][x] = boardVal;
                }
                break;
            case 'L':
                //check to the left
                if(x - (length-1) < 0) {
                    //out of bounds
                    console.log("Out of bounds");
                    return(1);
                }
                for(i = 0; i < length; i++) {
                    //check for collision
                    if(playerMap[y][x-i] != 0) {
                        //collision detected
                        console.log("Collision detected");
                        return(1);
                    }
                }
                //is valid
                for(i = 0; i < length; i++) {
                    playerMap[y][x-i] = boardVal;
                }
                break;
            case 'R':
                //check to the right
                if(x + (length-1) > 9) {
                    //out of bounds
                    console.log("Out of bounds");
                    return(1);
                }
                for(i = 0; i < length; i++) {
                    //check for collision
                    if(playerMap[y][x+i] != 0) {
                        //collision detected
                        console.log("Collision detected");
                        return(1);
                    }
                }
                //is valid
                for(i = 0; i < length; i++) {
                    playerMap[y][x+i] = boardVal;
                }
                break;
        }
        /*console.log(this.player1.getMap());
        console.log(this.player2.getMap());
        console.log(playerMap);*/
        player.setMap(playerMap);
        return(0);
    }
}
exports.GameController = GameController;

//default map mainly for testing purposes
var map = [ [ 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0,10,10,10,10,10, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 6, 0],
            [ 0, 0, 2, 0, 0, 0, 0, 0, 6, 0],
            [ 0, 0, 2, 0, 8, 0, 0, 0, 6, 0],
            [ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]; //this will be initialized with a default map for testing unless a different one is set

//[ 0, 4, 4, 4, 0, 0, 0, 0, 0, 0]
//[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//[ 0,10,10,10,10,10, 0, 0, 0, 0]
//[ 0, 0, 0, 0, 0, 0, 0, 0, 6, 0]
//[ 0, 0, 2, 0, 0, 0, 0, 0, 6, 0]
//[ 0, 0, 2, 0, 8, 0, 0, 0, 6, 0]ttackingPlayer
//[ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0]
//[ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0]
//[ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0]
//[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

//empty map
var placementMap = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

/*
schema:
0: unhit ocean
1: hit ocean
2: unhit destroyer
3: hit destroyer
4: unhit submarine
5: hit submarine
6: unhit cruiser
7: hit cruiser
8: unhit battleship
9: hit battleship
10: unhit carrier
11: hit carrier
 */

exports.setMap = setMap;
function setMap(newMap, cb){
    //meant for use during testing
    map = newMap;
    cb(1);
}

exports.getMap = getMap;
function getMap() {
    //meant for use during testing
    return map;
}

exports.getPlacementMap = getPlacementMap;
function getPlacementMap() {
    return  placementMap;
}

exports.placeShip = placeShip;
function placeShip(x,y) {
    placementMap[y][x] = 2;
    placementMap[y+1][x] = 2;
}

exports.checkHit_test = checkHit_test;
function checkHit_test(x, y){
    var loc = map[y][x];
    if(loc % 2 == 0) {
        map[y][x] = loc + 1;
        if(loc == 0){
            return 0; //miss
        } else {
            return  2; //hit
        }
    } else {
        return 1; //invalid target
    }
}

exports.AIcheckSunk = AIcheckSunk;
function AIcheckSunk(x, y, checkMap) { //returns true if this hit will result in a sunk ship
    var loc = checkMap[y][x];
    if(loc == 0) {
        return false;
    }
    checkMap[y][x] += 1;
    for(i = 0; i < 10; i++){
        if(checkMap[i].includes(loc)){
            checkMap[y][x] -= 1;
            return false;
        }
    }
    checkMap[y][x] -= 1;
    return true;
}

/*exports.checkHit = checkHit;
function checkHit(playerName, gameMap, x, y){
    var loc = gameMap[x][y];
}*/
exports.genRandomMap = genRandomMap;
function genRandomMap() {
    var genMap = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    var i = 10;
    while(i > 0) {
        //var orientation = Math.floor(Math.random*(1-0+1));
        var orientation = Math.round(Math.random());
        //0 = vertical, 1 = horizontal
        var x = Math.floor(Math.random()*10);
        var y = Math.floor(Math.random()*10);
        if(i == 10) {
            //carrier length 5
            if(orientation == 0) {
                //vertical
                if(y + 4 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    for(j = 0; j <= 4; j++) {
                        genMap[y+j][x] = 10;
                    }
                }
            } else {
                //horizontal
                if(x + 4 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    for(j = 0; j <= 4; j++) {
                        genMap[y][x+j] = 10;
                    }
                }
            }
        } else if(i == 8) {
            //Cruiser length 4
            if(orientation == 0) {
                //vertical
                if(y + 3 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    //check if another ship is already in its path
                    var collision = false;
                    for(j = 0; j <= 3; j++) {
                        if(genMap[y+j][x] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 3; j++) {
                        genMap[y+j][x] = 8;
                    }
                }
            } else {
                //horizontal
                if(x + 3 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    //check if aother ship is already in its path
                    var collision = false;
                    for(j = 0; j <= 3; j++) {
                        if(genMap[y][x+j] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 3; j++) {
                        genMap[y][x+j] = 8;
                    }
                }
            }
        } else if(i == 6) {
            //battleship length 3
            if(orientation == 0) {
                //vertical
                if(y + 2 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 2; j++) {
                        if(genMap[y+j][x] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }

                    for(j = 0; j <= 2; j++) {
                        genMap[y+j][x] = 6;
                    }
                }
            } else {
                //horizontal
                if(x + 2 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 2; j++) {
                        if(genMap[y][x+j] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 2; j++) {
                        genMap[y][x+j] = 6;
                    }
                }
            }
        } else if(i == 4) {
            //submarine length 3
            if(orientation == 0) {
                //vertical
                if(y + 2 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 2; j++) {
                        if(genMap[y+j][x] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 2; j++) {
                        genMap[y+j][x] = 4;
                    }
                }
            } else {
                //horizontal
                if(x + 2 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 2; j++) {
                        if(genMap[y][x+j] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 2; j++) {
                        genMap[y][x+j] = 4;
                    }
                }
            }
        } else if(i == 2) {
            //destroyer length 3
            if(orientation == 0) {
                //vertical
                if(y + 1 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 1; j++) {
                        if(genMap[y+j][x] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 1; j++) {
                        genMap[y+j][x] = 2;
                    }
                }
            } else {
                //horizontal
                if(x + 1 > 9) {
                    //invalid location
                    continue;
                } else {
                    //valid location
                    var collision = false;
                    for(j = 0; j <= 1; j++) {
                        if(genMap[y][x+j] != 0) {
                            collision = true;
                            break;
                        }
                    }
                    if(collision == true) {
                        continue;
                    }
                    for(j = 0; j <= 1; j++) {
                        genMap[y][x+j] = 2;
                    }
                }
            }
        }
        i-=2;
    }
    return(genMap);
}