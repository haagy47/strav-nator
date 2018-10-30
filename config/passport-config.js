var LocalStrategy   = require('passport-local').Strategy;
var StravaStrategy = require('passport-strava').Strategy;

var User = require('./db/models').User;
var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new StravaStrategy({

        clientID        : process.env.clientID,
        clientSecret    : process.env.clientSecret,
        callbackURL     : process.env.callbackURLProd,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, accessToken, refreshToken, profile, done) {
          User.findOne({ where :{ 'stravaId' : profile.id }})
					.then (function (user) {
						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.token) {
								user.token = accessToken;
								user.name  = profile.displayName;
								//user.email = profile.email.value;

								user.save()
									.then( function() {done(null, user);})
									.catch (function(e) {});
              } else {
								done(null, user);
							}
						} else {
							// if there is no user, create them
							var newUser = User.build ({
								stravaId: profile.id,
								token: accessToken,
								name: profile.displayName,
								//email: profile.email.value
							});
							newUser.save()
									.then( function() {done(null, user);})
									.catch (function(e) {});
						}
					});
        }));

  };

    /* passport.use(new StravaStrategy({
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL

      }, function (accessToken, refreshToken, profile, done) {
          //Using next tick to take advantage of async properties
          process.nextTick(function () {
              User.findOne( { where : { stravaId : profile.id } }).then(function (user, err) {
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that strava id, create them
                    var newUser            = new User();
                    console.log(profile)
                    // set all of the facebook information in our user model
                    newUser.stravaId = profile.id; // set the users strava id
                    newUser.token = accessToken; // we will save the token that strava provides to the user
                    newUser.name  = profile.name.firstname + ' ' + profile.name.lastname; // look at the passport user profile to see how names are returned
                    newUser.email = profile.email;

                    // save our user to the database
                    newUser.create(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
                  if(err) {
                      return done(err);
                  }
                  if(user) {
                      return done(null, user);
                  } else {
                      //Create the user
                      User.create({
                          stravaId : profile.id,
                          token : accessToken,
                          name: profile.firstname,
                          email : profile.email
                      });

                      //Find the user (therefore checking if it was indeed created) and return it
                      User.findOne( { where : { stravaId : profile.id } }).then(function (user, err) {
                          if(user) {
                              return done(null, user);
                          } else {
                              return done(err);
                          }
                      });
                  }
              });
          });
      }));

      const stravaConfig = {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
      }

      passport.use(new StravaStrategy(stravaConfig, (accessToken, refreshToken, profile, done) => {
        const stravaId = profile.id
        const name = profile.firstname
        const email = profile.email
        User.find({where: {stravaId}})
          .then(foundUser => (foundUser
            ? done(null, foundUser)
            : User.create({name, email, stravaId})
              .then(createdUser => done(null, createdUser))
          ))
          .catch(done)
      }));


    /*passport.use(new StravaStrategy({

        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL

    },


    // facebook will send back the token and profile
    function(accessToken, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ where: {stravaId : profile.id} }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that strava id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.stravaId = profile.id; // set the users strava id
                    newUser.token = accessToken; // we will save the token that strava provides to the user
                    newUser.name  = profile.name.firstname + ' ' + profile.name.lastname; // look at the passport user profile to see how names are returned
                    newUser.email = profile.email;

                    // save our user to the database
                    newUser.create(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    /*passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

};

    */
