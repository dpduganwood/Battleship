var app=require("../GameFunctions.js");

describe("checkHit_test",function(){
    it("The function should set map",function() {
        var map = app.getMap();
        var value=app.checkHit_test(1,2);
        expect(value).toBe(2);
    });
});