var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User.js');
exports.setup = function(app) {
    var router = express.Router();
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
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
        if(req.body.password != req.body.password2) {
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
            password:req.body.password
        }),  function(err, user) {
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
    
    router.get('/login', function(req, res) {
        res.render('login', {
            title: "Bunker - Log in",
            user: req.user
        });
    });
    
    router.post('/login', function(req, res, next) {
        
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
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
                if (err) {
                    return next(err);
                }
                return res.redirect('/contacts');
            });
        })(req, res, next);
    });
    // Log the user out and redirect to the homepage.
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    return router;
};