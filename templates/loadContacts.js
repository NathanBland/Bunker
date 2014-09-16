var templateSource = document.getElementById('contact-template').innerHTML;

var contactTemplate = Handlebars.compile( templateSource );

function createContactFromTemplate( contact ) {
    return contactTemplate( contact );
}

function renderContactsWithTemplate( contacts ) {
    var container = document.querySelector('.contacts-container');
    contacts.map( createContactFromTemplate ).forEach(function( contactHTML ){
    container.innerHTML += contactHTML;
    });
}
var renderContacts = getJSON('contacts.json', renderContactsWithTemplate);