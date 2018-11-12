var sql = require('mysql');
var con = sql.createConnection({
    //host: 'boilergames.com',
    host: 'localhost',
    user: 'root',
    password: 'sql123',
    database: 'Battletracks_bugged_db'
    //database: 'Battletracks_db'
});

for(var i = 0; i < 101; i++) {
    var sp_wins = Math.floor(Math.random() * 10);
    var mp_wins = Math.floor(Math.random() * 10);
    var sp_losses = Math.floor(Math.random() * 10);
    var mp_losses = (Math.floor(Math.random() * 10)) + 1;
    var hits = Math.floor(Math.random() * 100);
    var misses = Math.floor(Math.random() * 100);
    con.query("INSERT INTO users VALUE(NULL, 'dummyemail_" + i + "@email.com', 'dummy_" + i +"', 'dummy" + i + "', 'user" + i + "', " + sp_wins + ", " + mp_wins + ", " + sp_losses + ", " + mp_losses + ", " + hits + ", " + misses + ")", function(err,result) {
        if(err) {
            console.log(err);
        }
    });
}