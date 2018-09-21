var Connection = require("../Connection.js");

describe("checkHit_test",function(){
    it("Testing login",function() {
        Connection.con.query("REMOVE FROM users WHERE email = 'dpduganwood@gmail.com'", function (err, result) {
            if (err) {
                //test failure
            } else {
                //login
                var prof = {
                    displayName: "David Wood",
                    emails: [{value: "dpduganwood@gmail.com"}],
                    name: {givenName: "David", familyName: "Wood"}
                };
                Connection.procUser(prof, function (result) {
                    Connection.con.query("SELECT * FROM users WHERE displayName = '" + prof.displayName + "'", function (err, result) {
                        if (err) {
                            //failure
                        } else {
                            expect(result.length).toBe(1);
                        }
                    });
                });
            }
        });
    });
});