const router = require('express').Router();
const passport=require('passport');
var db = require('../tables/db');

// auth login
router.get('/login', function (req, res) {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', function(req, res) {
    // handle with passport
    req.logout();
    res.redirect('/');
    res.send('logging out');
});

// auth with google+
router.get('/google',passport.authenticate('google',{
		scope:[ 'https://www.googleapis.com/auth/plus.login',
  	  'https://www.googleapis.com/auth/plus.profile.emails.read' ]
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {

	// console.log('in redirect URI');
 //    //res.send('you reached the redirect URI');
 //    res.render('Pages/newdashboard');
 console.log("=========IN GOOGLE REDIRECT=========\n");
 	console.log(req.user.email);
 	res.redirect('/profile');
});

router.get('/facebook',
  passport.authenticate('facebook'));

module.exports = router;