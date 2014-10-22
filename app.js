var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/contacts');

var Bunker = require('./models/Contact');

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
    res.render('index', {
        title: "Welcome To Bunker"
    })
});

app.get('/contacts', function(req, res, next) {
    Bunker.find()
    .sort({id: 1})
    .exec(function(err, contacts) {
        res.render('contacts', {
        title: "Bunker - All Contacts",
        contacts: contacts
        });
    });
});


//attempt to make additions
app.get('/contact/add', function(req, res, next) {
    res.render('add', {
        title: "Add A Contact"
    });
});
app.get('/contact/:id/edit', function(req, res, next) {
    Bunker.findById(req.params.id, function(err, contact) {
        console.log(contact);
        if (contact){
            res.render('add', {
                title: "Edit Contact - "+contact.firstName+" "+contact.lastName,
                contact: contact
            });
        } else {
            res.render('add', {
                title: "Add New Contact"
            })
        }
    });
    
});

app.post('/contact/add', saveNew);
app.post('/contact/:id/edit', saveNew);
app.post('/contact/:id/delete', deleteContact);

function saveNew(req, res, next){
    
    Bunker.findById(req.params.id, function(err,contact){
        console.log(contact);
        if (!contact){
          contact = new Bunker();
          console.log("Not an existing Contact.");
        }
        
        var name = req.body.name;
        var myName = name.split(" ");
        if (myName.length < 2){
            myName[1] = ""; //super hacky
        }
        //console.log(req.body.phoneNum);
        var emails = [{emailAdd: req.body.email, eType: req.body.emailType }];
        console.log(emails);
        var phoneNumbers = [{number: req.body.phoneNum, pType: req.body.phoneType }];
        var addresses =  [{
            desc: req.body.desc || '',
            street: req.body.address || '',
            city: req.body.city || '',
            state: req.body.state || '',
            zip: req.body.zip || ''
        }];
        contact.set({
            firstName: myName[0],
            lastName: myName[myName.length-1],
            birthday: req.body.birthday || '',
            email: emails,
            phoneNumber: phoneNumbers,
            address: addresses,
            avatar: "../images/contacts/default.png"
        });
    
    
        console.log(contact);
    
        contact.save(function(err) {
            if (err) {
                res.render('editPost', {
                    title: "Error Saving Contact: " + contact.firstName,
                    contact: contact,
                    notification: {
                        severity: "error",
                        message: "uh, we have a problem. Sorry about this:  " + err
                    }
                });
            } else {
                res.redirect('/contacts');
            }
        });
    });
}

function deleteContact(req, res, next){
    Bunker.findById(req.params.id, function(err,contact){
        if(contact){
            console.warn('Removing contact!', contact);
            Bunker.remove(contact, function(err) {
                if (err) {
                    res.render('add', {
                        title: "Delete contact failed!",
                        notification: {
                            severity: "error",
                            message: "Could not delete contact: " + err
                        }
                    });
                } else {
                    res.redirect('/contacts');
                }
            });
        }
    });
}

app.get('/contact/:id', function(req, res, next) {
   Bunker.findById(req.params.id, function(err, contact) {
       if (contact){
           res.render('contact', {
               title: contact.firstName+" "+contact.lastName+" - Bunker",
               contact: contact
           });
       } else {
           res.status(404).render('contact', {
               title: "This person does not exist, yet.",
               notification: {
                   serverity: "error",
                   message: "The contact that you seek seems to be a ninja. We coulnd't find them."
               }
           });
       }
   });
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