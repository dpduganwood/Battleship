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