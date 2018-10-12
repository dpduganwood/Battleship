var app=require("../AIFunctions.js");
var Connection = require("../Connection.js");

var map1 = [ [ 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,10,10,10,10,10, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 7, 0],
    [ 0, 0, 2, 0, 0, 0, 0, 0, 7, 0],
    [ 0, 0, 2, 0, 0, 0, 0, 0, 7, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 8, 8, 9, 8, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

var map2 = [ [ 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0,10,10,11,11,11, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 7, 0],
            [ 0, 0, 2, 0, 0, 0, 0, 0, 7, 0],
            [ 0, 0, 2, 0, 0, 0, 0, 0, 7, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 8, 8, 8, 8, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

describe("hardAISelection_test",function(){
    it("The function should result in a hit",function() {
        var ai = new app.AIOpponent(123, map1, "hard");
        var value=ai.hardAISelectLocation(map1);
        expect(value).toEqual([5, 7]);
    });
});

describe("hardAISelection_test",function(){
    it("The function should result in a hit",function() {
        var ai = new app.AIOpponent(123, map2, "hard");
        var value=ai.hardAISelectLocation(map2);
        expect(value).toEqual([2, 2]);
    });
});