var express = require('express');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var routes = require('./routes/');
var multer  = require('multer');
mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/contacts');

var app = express();
hbsutils.registerPartials('./views/partials');
hbsutils.registerWatchedPartials('views/partials');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.set('port', process.env.PORT || 8000);
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({ dest: './tmp/'}))
app.use(cookieParser('important things, kept safe.'));
app.use(session({
    secret: 'The key to a secret is hidden in the chest.',
    resave: true,
    saveUninitialized: true
}));
app.use(routes.setup(app));

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Get this party started!");
    console.log("Contacts app running on https://%s:%s",
        address.address, address.port);
});