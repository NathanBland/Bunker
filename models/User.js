var mongoose = require('mongoose');
var Contact = require('./Contact');

var User = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }
});
User.plugin(require('passport-local-mongoose'));

User.methods.getContacts = function(callback) {
    return Contact.find({
        user_id: this._id
    }, callback);
};

User.methods.getContactById = function(id, callback) {
    return Contact.findOne({
        user_id: this._id,
        _id: id
    }, callback);
};

User.methods.newContact = function() {
    var contact = new Contact();
    contact.user_id = this._id;
    return contact;
};

User.methods.removeContact = function(contact, callback){
    Contact.findOneAndRemove({
        _id: contact._id,
        user_id: this._id
    }, callback);
}

module.exports = mongoose.model('user', User);