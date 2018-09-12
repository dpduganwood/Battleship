var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "BattletracksDB"
});

con.connect(function(err) {
    if(err) throw err;
    else {
        console.log("Connected");
    }
});