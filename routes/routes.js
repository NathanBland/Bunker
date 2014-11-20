var express = require("express");
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;
var path = require("path");
var fs = require("fs-extra");

exports.setup = function() {
    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index', {
            title: "Welcome To Bunker"
        });
    });
    router.all('/contacts/*', ensureAuthenticated('/login'));

    router.get('/contacts', function(req, res, next) {
        if (req.user) {
            req.user.getContacts()
                .sort('firstName')
                .exec(function(err, contacts) {
                    res.render('contacts', {
                        title: "Bunker - All Contacts",
                        contacts: contacts
                    });
                });
        }
    });
    router.get('/about', function(req, res, next) {
        res.render('about.html', {
            title: "Bunker - About Bunker"
        });
    });

    //search
    router.get('/results?', function(req, res, next) {
        var re = new RegExp("^" + req.query.name, 'i');
        req.user.getContacts()
            .or([{
                firstName: re
            }, {
                lastName: re
            }])
            .sort({
                firstName: 1
            }).exec(function(err, contacts) {
                //res.json(JSON.stringify(users)); possible future ajax 
                res.render('contacts', {
                    title: "Bunker - Search Results",
                    contacts: contacts
                });
            });
    });
    router.get('/search', function(req, res, next) {
        res.render('search.html', {
            title: "Bunker - Search for Contacts"
        });
    });


    //attempt to make additions
    router.get('/contact/add', function(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render('add', {
            title: "Bunker - Add A Contact"
        });
    });
    router.get('/contact/:id/edit', function(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        req.user.getContactById(req.params.id, function(err, contact) {
            console.log(contact);
            if (contact) {
                res.render('add', {
                    title: "Edit Contact - " + contact.firstName + " " + contact.lastName,
                    contact: contact
                });
            }
            else {
                res.render('add', {
                    title: "Add New Contact"
                });
            }
        });
    });

    router.post('/contact/add', saveNew);
    router.post('/contact/:id/edit', saveNew);
    router.post('/contact/:id/upload', setAvatar);
    router.post('/contact/:id/delete', deleteContact);

    function moveImage(id, tempPath, targetPath, type) {
        targetPath += type;
        console.log(type);
        console.log(targetPath);
        if (fs.exists(targetPath)) {
            console.log("file already there");
        }
        var source = fs.createReadStream(tempPath);
        var dest = fs.createWriteStream(targetPath);

        source.pipe(dest);
        source.on('end', function() {
            console.log("Upload successful");
            fs.remove(tempPath, function(err) {
                if (err) {
                    console.log(err);
                }
            })
        });
        source.on('error', function(err) {
            if (err) console.log(err);
        });
    }

    function setAvatar(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        if (!req.files) {
            return res.redirect('/contact/' + req.params.id);
        }
        console.log(req.files.upload);
        var tempPath = req.files.upload.path;
        var targetPath = './avatars/' + req.params.id;
        if (path.extname(req.files.upload.name).toLowerCase() === '.png') {
            moveImage(req.params.id, tempPath, targetPath, '.png');
        }
        else if (path.extname(req.files.upload.name).toLowerCase() === '.jpg') {
            moveImage(req.params.id, tempPath, targetPath, '.jpg');
        }
        else {
            fs.unlink(tempPath, function(err) {
                if (err) {
                    console.log(err);
                }
                console.error("Only .png or .jpg files are allowed!");
            });
        }
        return res.redirect('/contact/' + req.params.id);

    }

    function saveNew(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        req.user.getContactById(req.params.id, function(err, contact) {
            //console.log(contact);
            if (!contact) {
                contact = req.user.newContact();
                console.log("Not an existing Contact.");
            }
            console.log(req.body.name.length);
            if (req.body.name == "" || req.body.name.length < 1) {
                return res.render('add', {
                    title: "Edit Contact - " + contact.firstName + " " + contact.lastName,
                    contact: contact,
                    notification: {
                        severity: "error",
                        other: "landing",
                        message: "Name is required"
                    }
                });
            }
            var name = req.body.name;
            var myName = name.split(" ");
            if (myName.length < 2) {
                myName[1] = ""; //super hacky
            }
            var cEmails = req.body.email;
            var emails = [];
            console.log(req.body.email);
            console.log(cEmails.indexOf(','));
            if (cEmails instanceof Array) {
                var eCount = req.body.email.length;
                if (eCount > 0) {
                    for (var i = 0; i < eCount; i++) {
                        emails.push({
                            emailAdd: req.body.email[i],
                            eType: req.body.emailType[i]
                        });
                    }
                }
            }
            else if (cEmails.indexOf(',') > -1) {
                var eCount = req.body.email.length;
                if (eCount > 0) {
                    for (var i = 0; i < eCount; i++) {
                        emails.push({
                            emailAdd: req.body.email[i],
                            eType: req.body.emailType[i]
                        });
                    }
                }
            }
            else {
                emails = [{
                    emailAdd: cEmails,
                    eType: req.body.emailType
                }];
            }

            var cPhones = req.body.phoneNum;
            var phoneNumbers = [];
            if (cPhones instanceof Array) {
                console.log("instance of array");
                var pCount = cPhones.length;
                console.log(pCount);
                if (pCount > 0) {
                    for (var i = 0; i < pCount; i++) {
                        phoneNumbers.push({
                            number: req.body.phoneNum[i],
                            pType: req.body.phoneType[i]
                        });
                    }
                }
            }
            else if (cPhones.indexOf(',') > -1) {
                console.log('indexof ,');
                var pCount = req.body.phoneNum.length;
                if (pCount > 0) {
                    for (var i = 0; i < pCount; i++) {
                        phoneNumbers.push({
                            number: req.body.phoneNum[i],
                            pType: req.body.phoneType[i]
                        });
                    }
                }
            }
            else {
                console.log('else');
                phoneNumbers = [{
                    number: req.body.phoneNum,
                    pType: req.body.phoneType
                }];
            }

            var addresses = [{
                desc: req.body.desc || '',
                street: req.body.address || '',
                city: req.body.city || '',
                state: req.body.state || '',
                zip: req.body.zip || ''
            }];
            var d = req.body.birthday;
            if (Object.prototype.toString.call(d) === "[object Date]") {
                // it is a date
                if (isNaN(d.getTime())) { // d.valueOf() could also work
                    // date is not valid
                    console.log("invalid date");
                }
                else {
                    console.log('valid date');
                    // date is valid
                }
            }
            else {
                // not a date
                console.log("not even a date type object");
            }
            contact.set({
                firstName: myName[0],
                lastName: myName[myName.length - 1],
                birthday: req.body.birthday || '',
                email: emails,
                phoneNumber: phoneNumbers,
                address: addresses,
                avatar: "../images/contacts/default.png"
            });
            //console.log(contact);
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
                }
                else {
                    res.redirect('/contacts');
                }
            });
        });
    }

    function deleteContact(req, res, next) {
        if (!req.user) {
            return res.redirect('login');
        }
        req.user.getContactById(req.params.id, function(err, contact) {
            if (contact) {
                console.warn('Removing contact!', contact);
                req.user.removeContact(contact, function(err) {
                    if (err) {
                        res.render('add', {
                            title: "Delete contact failed!",
                            notification: {
                                severity: "error",
                                message: "Could not delete contact: " + err
                            }
                        });
                    }
                    else {
                        res.redirect('/contacts');
                    }
                });
            }
        });
    }

    router.get('/contact/:id', function(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        req.user.getContactById(req.params.id, function(err, contact) {
            if (contact) {
                res.render('contact', {
                    title: contact.firstName + " " + contact.lastName + " - Bunker",
                    contact: contact
                });
            }
            else {
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
    router.use(function(req, res) {
        console.warn('404 Not Found: %s', req.originalUrl);
        res.status(404).render('404', {
            title: "404 Error - Page Not Found",
            notification: {
                severity: "error",
                message: "Hey I couldn't find that page, sorry.",
                type: "e404"
            }
        });
    });

    // server errors
    router.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(500).render('500', {
            title: "500 Error - Server Error",
            notification: {
                severity: "error",
                message: "Something is very wrong on our side. Try again later.",
                type: "e500"
            }
        });
    });

    return router;
};