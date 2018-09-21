var map = [[]]; //this will be initialized with a default map for testing unless a different one is set

exports.setMap = setMap;
function setMap(map){

}

exports.getMap = getMap;
function getMap() {
    return map;
}

exports.checkHit = checkHit;
function checkHit(x, y){
    if(map[x][y] != 0){
        return 1
    }
}