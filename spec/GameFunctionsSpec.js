var app=require("../GameFunctions.js");
var Connection = require("../Connection.js");

var map = [ [ 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,10,10,10,10,10, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 7, 0],
    [ 0, 0, 2, 0, 0, 0, 0, 0, 7, 0],
    [ 0, 0, 2, 0, 8, 0, 0, 0, 6, 0],
    [ 0, 0, 0, 0, 9, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 9, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 8, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

describe("checkHit_test",function(){
    it("The function should result in a hit",function() {
        var value=app.checkHit_test(1,2);
        expect(value).toBe(2);
    });
});

describe("checkHit_test",function(){
    it("The function should result in a miss",function() {
        var value=app.checkHit_test(0,0);
        expect(value).toBe(0);
    });
});

describe("placeShip_test",function(){
    it("The function should result in a miss",function() {
        app.placeShip(3,5);
        expect(app.getPlacementMap()[5][3]).toBe(2);
        expect(app.getPlacementMap()[6][3]).toBe(2);
    });
});

describe("AIcheckSunk",function(){
    it("Returns true if hit results in a sunk ship",function() {
        var value=app.AIcheckSunk(8,5,map);
        expect(value).toBe(true);
    });
});

describe("AIcheckSunk",function(){
    it("Returns true if hit results in a sunk ship",function() {
        var value=app.AIcheckSunk(4,8,map);
        expect(value).toBe(false);
    });
});

describe("AIcheckSunk",function(){
    it("Returns true if hit results in a sunk ship",function() {
        var value=app.AIcheckSunk(0,0,map);
        expect(value).toBe(false);
    });
});

describe("testMapGen",function(){
    it("Returns true if 1000 random maps are made",function() {
        var value=app.testMapGen();
        expect(value).toBe(true);     
    });
});



/*var prof = {displayName: "David Wood", emails: [{value: "dpduganwood@gmail.com"}], name: {givenName: "David", familyName: "Wood"}};
console.log(prof);
console.log(prof.displayName);
console.log(prof.emails[0].value);
console.log(prof.name.givenName);
console.log(prof.name.familyName);
*/