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




/*var prof = {displayName: "David Wood", emails: [{value: "dpduganwood@gmail.com"}], name: {givenName: "David", familyName: "Wood"}};
console.log(prof);
console.log(prof.displayName);
console.log(prof.emails[0].value);
console.log(prof.name.givenName);
console.log(prof.name.familyName);
*/