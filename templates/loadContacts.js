/*var templateSource = document.getElementById('contact-template').innerHTML;

var contactTemplate = Handlebars.compile( templateSource );

function createContactFromTemplate( contact ) {
    return contactTemplate( contact );
}*/

function renderContactsWithTemplate( contacts ) {
    var container = document.querySelector('.contacts-container');
    console.log(Handlebars.templates.contacts);
    contacts.map( Handlebars.templates.contacts ).forEach(function( contactHTML ){
        console.log(contactHTML);
        container.innerHTML += contactHTML;
    });
}
var renderContacts = getJSON('contacts.json', renderContactsWithTemplate);