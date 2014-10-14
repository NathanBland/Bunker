var mongoose = require('mongoose');

var phoneNumberSchema = new mongoose.Schema({
    pType: String,
    number: String
});

var addressSchema = new mongoose.Schema({
   desc: String,
   street: String,
   city: String,
   state: String,
   zip: Number
});

var contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthday: String,
    phoneNumber: [phoneNumberSchema],
    address: [addressSchema],
    avatar: String
});

var Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;