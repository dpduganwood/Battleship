var Connection = require("../Connection.js");

var prof = {
    displayName: "David Wood",
    emails: [{value: "dpduganwood@gmail.com"}],
    name: {givenName: "David", familyName: "Wood"}
};

var disp = {
    displayName: "David Wood"
}

describe("checkHit_test",function(){
    it("Testing login",function() {
        Connection.con.query("REMOVE FROM users WHERE email = 'dpduganwood@gmail.com'", function () {
            Connection.procUser(prof, function (result) {
                Connection.con.query("SELECT * FROM users WHERE displayName = '" + prof.displayName + "'", function (err, result) {
                    expect(result.length).toBe(1);
                });
            });

        });
    });
});

describe("addPlayerHit",function(){
    it("Testing add player hit function",function() {
        Connection.con.query("REMOVE FROM users WHERE email = 'dpduganwood@gmail.com'", function () {
            Connection.addPlayerHit(function (result) {
                Connection.con.query("SELECT * FROM users WHERE displayName = '" + disp.displayName + "'", function (err, result) {
                    expect(result.length).toBe(1);
                });
            });

        });
    });
});
