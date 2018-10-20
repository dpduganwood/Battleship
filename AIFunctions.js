var Connection = require(__dirname + "/Connection.js");
var GameFunctions = require(__dirname + "/GameFunctions.js");
var Server = require(__dirname+"/Server.js");

class AIOpponent {

    constructor(gamekey, map, difficulty /*0 for player, 1 for easy, 2 for hard*/) {
        //type should only be 1 or 2 in this case
        this.gamekey = gamekey;
        this.map = map;
        var isAIReady;

        //game controller compatibility stuff:
        this.type = difficulty;
        this.playerName = "AInotPlayer";
        //var isAIReady;
        var hits = 0;
        var misses = 0;
    }

    getAIReady() {
        return isAIReady;
    }

    setAIReady(isReady) {
        isAIReady = this.isReady;
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
        } else {
            //cb(1); //target id odd. INVALID TARGET
            return 1;
        }
    }

    easyAISelectLocation(map) {
        //var map = Serer.games[this.gamekey].player1.getMap();
        while (true) {
            var x = Math.floor(Math.random()*10);
            var y = Math.floor(Math.random()*10);
            if (isValid(map, x, y) && aicheckHit(x, y, map) == 0) {
                return [x, y];
            }
        }
    }

    hardAISelectLocation(map) { //map is the enemy's map
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {

                //if there is existing hit on board that is not part of ship that is sunk
                if (aicheckHit(i, j, map) == 2 && !locationsOfSunkShips(map).includes([i, j])) {

                    //previous hit is next to other previous hit (checks both sides)
                    var increaseX = 1;
                    //keep incrementing along all of the hits in right direction
                    while (isValid(map, i+increaseX, j) && aicheckHit(i+increaseX, j, map) == 2) {
                        increaseX++;
                    }
                    //once reach end of consecutive hits in right direction, if spot is empty, guess it
                    if (isValid(map, i+increaseX, j) && aicheckHit(i+increaseX, j, map) == 0 && increaseX > 1) {
                        console.log(increaseX);
                        console.log("mine1");
                        return [i+increaseX, j];
                    }
                    else {
                        var decreaseX = 1;
                        while (isValid(map, i-decreaseX, j) && aicheckHit(i-decreaseX, j, map) == 2) {
                            decreaseX--;
                        }
                        if (isValid(map, i-decreaseX, j) && aicheckHit(i-decreaseX, j, map) == 0 && decreaseX > 1) {
                            console.log("mine2");
                            return [i-decreaseX, j];
                        }
                    }

                    //previous hit is next to other previous hit (checks above and below)
                    var increaseY= 1;
                    while (isValid(map, i, j+increaseY) && aicheckHit(i, j+increaseY, map) == 2) {
                        increaseY++;
                    }
                    if (isValid(map, i, j+increaseY) && aicheckHit(i, j+increaseY, map) == 0 && increaseY > 1) {
                        console.log("mine3");
                        return [i, j+increaseY];
                    }
                    else {
                        var decreaseY = 1;
                        while (isValid(map, i, j-decreaseY) && aicheckHit(i, j-decreaseY, map) == 2) {
                            decreaseY--;
                        }
                        if (isValid(map, i, j-decreaseY) && aicheckHit(i, j-decreaseY, map) == 0 && decreaseY > 1) {
                            console.log("mine4");
                            return [i, j-decreaseY];
                        }
                    }

                    //previous hit is not next to any other hits, so guess adjacent space
                    if ((isValid(map, i+1, j) && aicheckHit(i+1, j, map) == 0)) { //if right valid
                        console.log("mine5");
                        return [i + 1, j];
                    }
                    else if ((isValid(map, i-1, j) && aicheckHit(i-1, j, map) == 0)) { //if left valid
                        console.log("mine6");
                        return [i - 1, j];
                    }
                    else if ((isValid(map, i, j+1) && aicheckHit(i, j+1, map) == 0)) { //if top valid
                        console.log("mine7");
                        return [i, j + 1];
                    }
                    else if ((isValid(map, i, j-1) && aicheckHit(i, j-1, map) == 0)) {//if bottom valid
                        console.log("mine8");
                        return [i, j - 1];
                    }
                }
            }
        }

        //if all visible ships are sunk or no successful hits yet, then guess randomly in valid location like easy AI
        return this.easyAISelectLocation(/*map*/);
    }
}
exports.AIOpponent = AIOpponent;
exports.AIOpponent.prototype.easyAISelectLocation;
exports.AIOpponent.prototype.hardAISelectLocation;


exports.isValid = isValid;
function isValid(map, x, y) {
    if (x < 10 && x >= 0 && y < 10 && y >= 0 && aicheckHit(x, y, map) != 1) {
        return true;
    }
    return false;
}

exports.aicheckHit = aicheckHit;
function aicheckHit(x, y, checkMap) {
    var loc = checkMap[y][x];
    /*if(loc % 2 == 0) {
        //checkMap[y][x] = loc + 1;
        if(loc == 0){
            return 0; //miss
        } else {
            return  2; //hit
        }
    } else {
        return 1; //invalid target
    }*/

    //0: open water unhit
    //2: hit ship part
    if(loc % 2 == 0) {
        if(loc == 0) {
            return 0;//open water
        } else {
            return 0;//unhit ship UNUSED
        }
    } else {
        if(loc > 1) {
            return 2; //hit ship
        }
    }
}

function locationsOfSunkShips(map) { //looks at map and returns array of location
    var destHitCount = 0;
    var subHitCount = 0;
    var cruHitCount = 0;
    var batHitCount = 0;
    var carHitCount = 0;

    var sunkLocations = [[]];

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            switch (map[i][j]) {
                case 3:
                    destHitCount++;
                case 5:
                    subHitCount++;
                case 7:
                    cruHitCount++;
                case 9:
                    batHitCount++;
                case 11:
                    carHitCount++;
            }
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (destHitCount == 2 && map[i][j] == 3)
                sunkLocations.push(map[i][j]);

            if (subHitCount == 3 && map[i][j] == 5)
                sunkLocations.push(map[i][j]);

            if (cruHitCount == 3 && map[i][j] == 7)
                sunkLocations.push(map[i][j]);

            if (cruHitCount == 4 && map[i][j] == 9)
                sunkLocations.push(map[i][j]);

            if (cruHitCount == 5 && map[i][j] == 11)
                sunkLocations.push(map[i][j]);
        }
    }
    return sunkLocations;
}