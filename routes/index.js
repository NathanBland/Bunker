var express = require('express');
exports.setup = function(app) {
    var router = express.Router();
    
    router.use(function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        next();
    });
    // Register the routes in order.
    var auth = require('./auth');
    var routes =require('./routes');
    
    router.use(auth.setup(app));
    router.use(routes.setup(app));
    /*['auth', 'routes'].forEach(function(path) {
        var route = require('./' + path);
        router.use(route.setup(app));
    });*/
    return router;
};