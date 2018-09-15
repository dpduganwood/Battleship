//load necessities
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Connection = require(__dirname + "/Connection.js");
var path = require('path');

var passportSetup=require('./config/passport-setup');
var authRoutes = require('./routes/auth-routes');
const passport=require('passport');


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));
app.use( express.static( "Public" ) );


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '')));

//To start SQL: Load MySQL. Find Services in search, activate MySQLExpre and MySQL Router.
//In MySQL, Forward Engineer, next until complete.
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "Battletracks_db"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected with Database");
});
//set the view engine to ejs
app.set('view engine', 'ejs');
//user res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.render('pages/index');
});

/*app.get('/register', function (req, res) {
    res.render('pages/register');
});*/

/*app.post('/register', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    if (email.length == 0) {
        //userloggedincheck(req, function (loggedin) {
            res.render('pages/registration', {
                //loggedin: loggedin,
                //username: req.cookies.user,
                perror: "Please enter valid email"
            })
        //});
        return;
    } else if (username.length == 0) {
        //userloggedincheck(req, function (loggedin) {
            res.render('pages/registration', {
                //loggedin: loggedin,
                //username: req.cookies.user,
                perror: "Username Cannot be empty"
            })
        //});
    } else if (password.length == 0) {
        //userloggedincheck(req, function (loggedin) {
            res.render('pages/registration', {
                //loggedin: loggedin,
                //username: req.cookies.user,
                perror: "Password Cannot be empty"
            })
        //});
    }
    else {
        Connection.getUserByUsername(username, function (result) {
            //console.log(result);
            if (result != "user does not exist") {
                //userloggedincheck(req, function (loggedin) {
                    res.render('pages/registration', {
                        //loggedin: loggedin,
                        //username: req.cookies.user,
                        perror: "Username already exists, Please choose a different Username"
                    })
                //});
            } else {
                var Person = new User(username, password, email);
                Connection.registerUser(email, username, password, function (result) {
                    console.log(result);
                    res.render('pages/registration', {
                        perror: "Successfully Registered"
                    });
                    map.delete(username);
                    return;
                });
            }
        });
    }
    return;
});
*/

app.listen(6009);
console.log('6009 is the open port');