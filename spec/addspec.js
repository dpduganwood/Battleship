var app=require("../spec/add.js");
describe("Addition",function(){
    it("The function should add 2 numbers",function() {
        var value=app.AddNumber(4,6);
        expect(value).toBe(11);
    });
});