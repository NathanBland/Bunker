var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var low = require('lowdb');

var db = low('./public/data/contacts.json');

var app = express();

app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.set('port', process.env.PORT || 8000);
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res, next) {
    var contactData = db('contacts');
    res.render('index', {
        title: "Bunker: All Contacts",
        contacts: contactData.where().value()
    })
});

app.get('/contacts', function(req, res, next) {
    res.redirect('/');
});


//attempt to make additions
app.get('/contact/add', function(req, res, next) {
    res.render('add', {
        title: "Add A Contact"
    });
});

app.post('/contact/add', function(req, res, next) {
    var contacts = db('contacts');
    
    var name = req.body.name;
    var myName = name.split(" ");
    var phoneNumbers = [{phoneNumber: req.body.phoneNum }];
    var addresses =  [{street: req.body.address }];
    
    var contact = {
        id: (req.body.id) ? null : +req.body.id,
        firstName: myName[0],
        lastName: myName[myName.length-1],
        birthday: req.body.birthday || '',
        phoneNumbers: phoneNumbers,
        address: addresses,
        avatar: "../images/contacts/default.png"
    };
    
    console.log(contact);
    
    var errors = [];
    if (!req.body.name){
         errors.push({
            severity: "error",
            message: "Name is a required property."
        });
    }
    if (errors.length) {
        console.warn("Validation failed for bookmark:", contact);
        // Show the edit form again if we have errors.
        res.render('add', {
            title: "Add bookmark",
            bookmark: contact,
            notification: errors
        });
    } else {
        console.log("storing contact info");
         if (contact.id) {
            contact.get(contact.id).assign(contact);
        }
        else {
            contact.id = contacts.size();
            contacts.push(contact);
        }
        res.redirect('/');
    }
});

app.get('/contact/:id', function(req, res, next) {
    var contactData = db('contacts');
    var contact = contactData.find({
            id: parseInt(req.params.id, 10)
        }).value();
    
    if (contact){
        res.render('contact',{
            title: "Contact - "+ contact.firstName + ' ' + contact.lastName,
            contact: contact
            
        });
    } else {
        res.render('contact', {
            title: "You don't have that contact.",
            notification: {
                serverity: "error",
                message: "The Person you seek, does not exist."
            }
        });
    }
});


//dat 404
app.use(function(req, res) {
    console.warn('404 Not Found: %s', req.originalUrl);
    res.status(404).render('index', {
        notification: {
            severity: "error",
            message: "Hey I couldn't find that page, sorry."
        }
    });
});

// server errors
app.use(function(err, req, res, next){
    console.log(err.stack);
    
    res.status(500).render('index', {
       notification: {
           severity: "error",
           message: "Something is very wrong on our side.\n Try again later."
       } 
    });
});

var server = app.listen(app.get('port'), app.get('ip'), function(){
   var address = server.address();
   console.log("Get this party started!");
   console.log("Contacts app running on https://%s:%s",
        address.address, address.port);
});