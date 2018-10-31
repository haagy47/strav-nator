module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      res.render('index.ejs', {
        user : req.user
      });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
        user : req.user
      });
    });

    app.get('/logout', function(req, res) {
      req.logout();
  		res.redirect('/');
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
