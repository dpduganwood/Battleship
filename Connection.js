var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "Battletracks_db"
});

con.connect(function(err) {
    if(err) throw err;
    else {
        console.log("Connected");
    }
});
exports.con=con;

exports.procUser = procUser;
function procUser(profile, cb) {
    //login or register user
    //console.log(profile.emails[0].value);
    con.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "'", function(err, user_info) {
        if(err) {
            //console.log("error");
            //console.log(err);
            cb(err);
        } else {
            /*console.log("result!");
            console.log(user_info.length);
            console.log(user_info;*/

            if(user_info.length == 0) {
                //user currently not in database
                //insert user into database
                con.query("INSERT INTO users VALUE (NULL, '"+ profile.emails[0].value +"','" + profile.displayName + "' ,'" + profile.name.givenName + "', '" + profile.name.familyName + "', " +
                    "0, 0, 0, 0)");
                cb(profile.displayName);
            } else {
                con.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "' AND displayName = '" + profile.displayName +"'", function(err, result){
                    /*console.log(result);
                    console.log(result[0].displayName);
                    console.log("result[0].displayName: "+result[0].displayName+" profile.displayName: "+profile.displayName);
                    console.log("result[0].email: "+result[0].email+" profile.emails[0].value: "+profile.emails[0].value);*/
                    if(result[0].displayName == profile.displayName && result[0].email == profile.emails[0].value){
                        console.log("getting here");
                        var z = JSON.parse(JSON.stringify(result[0].displayName));
                        cb(z);
                    } else {
                        cb("error finding user")
                    }
                });
            }
            //pass user information to server
        }
    });
}

//module.exports = con;

exports.addPlayerHit = addPlayerHit;
function addPlayerHit(playerName, cb){
    con.query("UPDATE users SET hits = hits + 1 WHERE displayName = '" + playerName + "'", function(err, result){
        if(err){
            console.log(playerName);
            console.log(err);
            cb(1);
        } else {
            cb(0);
        }
    });
}

exports.addPlayerMiss = addPlayerMiss;
function addPlayerMiss(playerName, cb) {
    con.query("UPDATE users SET hits = hits - 1 WHERE displayName = '" + playerName + "'", function(err,result) {
        if(err) {
            cb(1);
        } else {
            cb(0);
        }
    });
}