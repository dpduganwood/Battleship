var Connection = require(__dirname + "/Connection.js");
var GameFunctions = require(__dirname + "/GameFunctions.js");

class AIOpponent {

    constructor(gamekey, map) {
        this.gamekey = gamekey;
        this.map = map;
    }

    easyAISelectLocation(map) {
        while (true) {
            var x = Math.floor(Math.random()*10);
            var y = Math.floor(Math.random()*10);
            if (isValid(map, x, y)) {
                return [x, y];
            }
        }
    }

    hardAISelectLocation(map) { //map is the enemy's map
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (aicheckHit(i, j, map) == 2 && locationsOfSunkShips(map).includes([i, j])) { //if there is existing hit on board and ship not sunk

                    //previous hit and next to other hit (horizontal checks)
                    var increaseX = 1;
                    while (isValid(map, i+increaseX, j) && aicheckHit(i+increaseX, j, map) == 2) {
                        increaseX++;
                    }
                    if (isValid(map, i+increaseX, j) && aicheckHit(i+increaseX, j, map) == 0) {
                        return [i+increaseX, j];
                    }
                    else {
                        var decreaseX = 1;
                        while (isValid(map, i-decreaseX, j) && aicheckHit(i-decreaseX, j, map) == 2) {
                            decreaseX--;
                        }
                        if (isValid(map, i-decreaseX, j) && aicheckHit(i-decreaseX, j, map) == 0) {
                            return [i-decreaseX, j];
                        }
                    }
                    increaseX = 1;
                    decreaseX = 1;

                    //previous hit and next to other hit (vertical checks)
                    var increaseY= 1;
                    while (isValid(map, i, j+increaseY) && aicheckHit(i, j+increaseY, map) == 2) {
                        increaseY++;
                    }
                    if (isValid(map, i, j+increaseY) && aicheckHit(i, j+increaseY, map) == 0) {
                        return [i, j+increaseY];
                    }
                    else {
                        var decreaseY = 1;
                        while (isValid(map, i, j-decreaseY) && aicheckHit(i, j-decreaseY, map) == 2) {
                            decreaseY--;
                        }
                        if (isValid(map, i, j-decreaseY) && aicheckHit(i, j-decreaseY, map) == 0) {
                            return [i, j-decreaseY];
                        }
                    }
                    increaseY = 1;
                    decreaseY = 1;

                    //hit is not next to any other hits, so guess adjacent space
                    if ((isValid(map, i+1, j) && aicheckHit(i+1, j, map) == 1 || aicheckHit(i+1, j, map) == 0)) //right valid
                        return [i+1, j];
                    else if ((isValid(map, i-1, j) && aicheckHit(i-1, j, map) == 1 || aicheckHit(i-1, j, map) == 0)) //left valid
                        return [i-1, j];
                    else if ((isValid(map, i, j+1) && aicheckHit(i, j+1, map) == 1 || aicheckHit(i, j+1, map) == 0)) //top valid
                        return [i, j+1];
                    else if ((isValid(map, i, j-1) && aicheckHit(i, j-1, map) == 1 || aicheckHit(i, j-1, map) == 0)) //bottom valid
                        return [i, j-1];
                }
            }
        }

        //if all visible ships are sunk or no successful hits yet, then guess randomly in valid location
        var x = Math.floor(Math.random() * 10);
        var y = Math.floor(Math.random() * 10);
        return [x, y];
    }
}

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