var Connection = require(__dirname + "/Connection.js");
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
    constructor(playerName, map) {
        this.playerName = playerName;
        this.map = map;

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
        return map;
    }

    setMap(map) {
        this.map = map;
    }

    checkHit(x,y, cb) {
        if(this.map[y][x] % 2 == 0) {
            if(this.map[y][x] == 0) {
                cb(0); //target id zero. MISS
            } else {
                cb(2); //target id even. HIT
            }
            this.map[y][x] += 1;
        } else {
            cb(1); //target id odd. INVALID TARGET
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
        this.player2 = player2;
        this.gameKey = gameKey;
    }

    checkHit(playerName, x, y, cb) {
        var attackingPlayer;
        var checkPlayer;
        if(this.player1.playerName === playerName) {
            attackingPlayer = this.player1;
            checkPlayer = this.player2;
        } else {
            attackingPlayer = this.player2;
            checkPlayer = this.player1;
        }
        checkPlayer.checkHit(x, y, function(result) {
            if(result == 0) {
                //miss
                attackingPlayer.misses += 1;
            } else if(result == 2) {
                //hit
                attackingPlayer.hits += 1;
            }
            //else invalid
            cb(result);
        });
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

exports.AIcheckHit = AIcheckHit;
function AIcheckHit(x, y, checkMap) {
    var loc = checkMap[y][x];
    if(loc % 2 == 0) {
        //checkMap[y][x] = loc + 1;
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
function AIcheckSunk(x, y, checkMap) {
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

console.log(genRandomMap());