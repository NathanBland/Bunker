var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/User.js');

exports.setup = function(app) {
    var router = express.Router();

    //#################
    //twitter
    //#################
    passport.use(new TwitterStrategy({
        consumerKey: '77qZmTxXgKgb3IGXyNlCDXX00',
        consumerSecret: 'BANN0FTywhYaeDzMUHRvjv5sU6CSeKVxiqiB0xyoUJTPZWhtr6',
        callbackURL: "https://bunker-c9-nathanbland.c9.io/login/twitter/callback"
    }, function(token, tokenSecret, profile, done) {
        console.log(profile.id);
        process.nextTick(function() {
            User.findOne({
                'twitter.id': profile.id
            }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                }
                else {
                    // if there is no user, create them
                    var newUser = new User();
                    // set all of the user data that we need
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    //#################
    //endtwitter
    //#################

    passport.use(new LocalStrategy(User.authenticate()));
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    router.use(passport.initialize());
    router.use(passport.session());

    router.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });

    router.get('/signup', function(req, res) {
        res.render('signup', {
            title: "Bunker - Create an account"
        });
    });

    router.post('/signup', function(req, res) {
        if (req.body.password != req.body.password2) {
            return res.render('signup', {
                title: "Bunker - Create an account",
                notification: {
                    severity: "error",
                    message: "Failed to register user: Passwords did not match!"
                },
            });
        }
        console.log("signing up:" + req.body.username);
        User.register(new User({
            username: req.body.username,

        }), req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                return res.render('signup', {
                    title: "Bunker - Create an account",
                    notification: {
                        severity: "error",
                        message: "Failed to register user: " + err.message
                    },
                    user: user
                });
            }
            console.log(req.body.username);
            passport.authenticate('local')(req, res, function() {
                res.redirect('/contacts');
            });
        });
    });

    //#################
    //twitter
    //#################
    router.get('/login/twitter', passport.authenticate('twitter'));
    router.get('/login/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/contacts',
            failureRedirect: '/login'
        }));

    //endtwitter

    router.get('/login', function(req, res) {
        res.render('login', {
            title: "Bunker - Log in",
            user: req.user
        });
    });

    router.post('/login', function(req, res, next) {
        console.log(req.body.username);
        passport.authenticate('local', function(err, user, info) {
            console.log("AUTH ME");
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log(err);
                console.log(user);
                return res.render('login', {
                    title: "Bunker - Log in",
                    notification: {
                        severity: 'error',
                        message: "Your username or password is wrong. Try again."
                    }
                });
            }
            // Log the user in and redirect to the homepage.
            req.login(user, function(err) {
                console.log("LOG ME IN");
                if (err) {
                    return next(err);
                }
                return res.redirect('/contacts');
            });
        })(req, res, next); /**/
    });
    // Log the user out and redirect to the homepage.
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};