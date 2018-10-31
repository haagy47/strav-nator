var StravaStrategy = require('passport-strava').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./db/models').User;
//var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user){
          done(null, user);
        }).catch(function(e){
          done(e, false);
        });
      });

/*
    passport.use(new StravaStrategy({

        clientID        : process.env.clientID,
        clientSecret    : process.env.clientSecret,
        callbackURL     : process.env.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, accessToken, refreshToken, profile, done) {
          User.findOne({ where :{ 'stravaId' : profile.id }})
					.then (function (user) {
						if (user) {
							if (!user.token) {
								user.token = accessToken;
								user.name  = profile.displayName;

								user.save()
									.then( function() {done(null, user);})
									.catch (function(e) {});
              } else {
								done(null, user);
							}
						} else {
							var newUser = User.build ({
								stravaId: profile.id,
								token: accessToken,
								name: profile.displayName,
							});
							newUser.save()
									.then( function() {done(null, user);})
									.catch (function(e) {});
						}
					});
        }));
*/

// This almost works

    passport.use(new StravaStrategy({

        clientID : process.env.clientID,
        clientSecret : process.env.clientSecret,
        callbackURL : process.env.callbackURL,
        passReqToCallback : true

    },

    function(req, accessToken, refreshToken, profile, done) {
            // check if the user is already logged in
        if (!req.user) {

            User.findOne({ where :{ 'stravaId' : profile.id }})
      			.then (function (user) {
      				if (user) {

      					if (!user.token) {
      						user.token = accessToken;
      						user.name  = profile.displayName;

      						user.save()
      							.then( function() {done(null, user);})
      							.catch (function(e) {});
                  } else {
      						    done(null, user);
      					  }
      				} else {
    					var newUser = User.build ({
                stravaId: profile.id,
								token: accessToken,
								name: profile.displayName,
    					});
    					newUser.save()
    								.then( function() {done(null, user);})
    								.catch (function(e) {});
    				}
    			});
            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.stravaId = profile.id;
                user.token = accessToken;
                user.name = profile.displayName;

                user.save()
          			.then( function() {done(null, user);})
          			.catch (function(e) {});
              }
        }));

  };
