module.exports = function(app, Bunker){
    //Below should be pushed out to its own view file.
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
            var cEmails = req.body.email;
            
            if (cEmails.indexOf(',') > -1){
                var emails = [];
                var eCount = req.body.email.length;
                if (eCount > 0) {
                    for (var i=0; i<eCount; i++){
                        emails.push({
                            emailAdd: req.body.email[i],
                            eType: req.body.emailType[i]
                        });
                    }
                }
            } else {
                var emails = [{emailAdd:cEmails,eType:req.body.emailType}];
            }
            
            var cPhones = req.body.phoneNum;
            
            if (cPhones.indexOf(',') > -1){
                var phoneNumbers = [];
                var pCount = req.body.phoneNum.length;
                
                if (pCount > 0) {
                    for (var i=0; i<eCount; i++){
                        phoneNumbers.push({
                            number: req.body.phoneNum[i],
                            pType: req.body.phoneType[i] 
                        });
                    }
                }
            } else {
                var phoneNumbers = [{
                    number: req.body.phoneNum,
                    pType: req.body.phoneType
                }];
            }
            
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
}