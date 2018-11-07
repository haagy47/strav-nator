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

    passport.use(new StravaStrategy({

        clientID : process.env.clientID,
        clientSecret : process.env.clientSecret,
        callbackURL : process.env.callbackURL,
        passReqToCallback : true

    },

    function(req, accessToken, refreshToken, profile, done) {
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
								name: profile.displayName
    					});
    					newUser.save()
    								.then( function() {done(null, user);})
    								.catch (function(e) {});
    				}
    			});
            } else {
                var user = req.user;

                user.stravaId = profile.id;
                user.token = accessToken;
                user.name = profile.displayName;

                user.save()
          			.then( function() {done(null, user);})
          			.catch (function(e) {});
              }
        }));

  };
