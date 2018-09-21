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

exports.setMap = setMap;
function setMap(map){
    //meant for use during testing
}

exports.getMap = getMap;
function getMap() {
    //meant for use during testing
    return map;
}

exports.checkHit = checkHit;
function checkHit(x, y){
    var loc = map[x][y];
    if(location % 2 == 0) {
        map[x][y] = loc + 1
        if(loc == 0){
            return 0
        } else {
            return  2
        }
    } else {
        return 1
    }
}