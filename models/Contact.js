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
var emailSchema = new mongoose.Schema({
    emailAdd: String,
    eType: String
})

var contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthday: String,
    email: [emailSchema],
    phoneNumber: [phoneNumberSchema],
    address: [addressSchema],
    avatar: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
});

var Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;