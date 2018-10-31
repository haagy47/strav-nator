module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/auth/strava', passport.authorize('strava', {scope:['profile:read_all']}));

    app.get('/auth/strava/callback', function(req, res, next) {
      passport.authenticate('strava', { successRedirect: '/profile',
        failureRedirect: '/' })(req, res, next);
    });

    /*app.get('/auth/strava/callback',
      passport.authorize('strava', {
            successRedirect : '/profile',
            failureRedirect : '/'
      }));*/

};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
