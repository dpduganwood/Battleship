var app=require("../GameFunctions.js");
var Connection = require("../Connection.js");

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


/*var prof = {displayName: "David Wood", emails: [{value: "dpduganwood@gmail.com"}], name: {givenName: "David", familyName: "Wood"}};
console.log(prof);
console.log(prof.displayName);
console.log(prof.emails[0].value);
console.log(prof.name.givenName);
console.log(prof.name.familyName);
*/