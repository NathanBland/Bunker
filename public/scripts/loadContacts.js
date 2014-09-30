
function grabElements(elementClass){
    
    //turned the node list into an array for you. Now array methods will work for you. map(), forEach(), ... etc
    var contacts = [].slice.call(document.querySelectorAll(elementClass));
    console.log(contacts);
    return contacts;
}
function toggleDetails(element){
    var div = element.currentTarget.lastElementChild;
    console.log(div);
    div.classList.toggle("visible");
}
function addListener(element){
    element.addEventListener("click", toggleDetails);
}

function renderContactsWithTemplate( contacts ) {
    var container = document.querySelector('.contacts-container');
    //console.log(Handlebars.templates.contacts);
    contacts.map( Handlebars.templates.contacts ).forEach(function( contactHTML ){
        //console.log(contactHTML);
        container.innerHTML += contactHTML;
    });
    var buttons = grabElements('.contact');
    buttons.forEach(addListener);
}
var renderContacts = getJSON('/data/contacts.json', renderContactsWithTemplate);