var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/contacts');

var Bunker = require('./models/Contact');

var app = express();
hbs.registerPartials('./views/partials');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.set('port', process.env.PORT || 8000);
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));



require('./routes.js')(app, Bunker);

var server = app.listen(app.get('port'), app.get('ip'), function(){
   var address = server.address();
   console.log("Get this party started!");
   console.log("Contacts app running on https://%s:%s",
        address.address, address.port);
});