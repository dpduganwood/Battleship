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
    var loc = map[x][y];
    if(loc % 2 === 0) {
        map[x][y] = loc + 1;
        if(loc === 0){
            return 0;
        } else {
            return  2;
        }
    } else {
        return 1;
    }
}

exports.checkHit = checkHit;
function checkHit(playerName, gameMap, x, y){
    var loc = gameMap[x][y];
}