var Connection = require(__dirname + "/Connection.js");

class gameController {
    constructor(user1_map, user2_map) {
        this.user1_map = user1_map;
        this.user2_map = user2_map;
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
//[ 0, 0, 2, 0, 8, 0, 0, 0, 6, 0]
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

exports.checkHit = checkHit;
function checkHit(playerName, gameMap, x, y){
    var loc = gameMap[x][y];
}