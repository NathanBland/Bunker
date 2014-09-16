function createContactPhone(list){
    
    var phone = document.createElement('h4');
    var phoneNode = document.createTextNode(list.type+" - "+list.phoneNumber);
    
    phone.appendChild(phoneNode);
    return phone;
}
function createContactAddress(addresses,list){
    
    var desc = document.createElement('dt');
    var descNode = document.createTextNode(list.desc);
    
    var street = document.createElement('dd');
    var city = document.createElement('dd');
    var state = document.createElement('dd');
    var zip = document.createElement('dd');
    
    var streetNode = document.createTextNode(list.street);
    var cityNode = document.createTextNode(list.city);
    var stateNode = document.createTextNode(list.state);
    var zipNode = document.createTextNode(list.zip);
    
    desc.appendChild(descNode);
    street.appendChild(streetNode);
    city.appendChild(cityNode);
    state.appendChild(stateNode);
    zip.appendChild(zipNode);
    
    addresses.appendChild(desc);
    addresses.appendChild(street);
    addresses.appendChild(city);
    addresses.appendChild(state);
    addresses.appendChild(zip);
    
    return addresses;
}

function createContact( contact){
    var element = document.createElement('li');
    
    var name = document.createElement('h1');
    var nameNode = document.createTextNode(contact.firstName+" "+contact.lastName);
    
    var birthday = document.createElement('h4');
    var birthdayNode = document.createTextNode(contact.birthday);
    
    var avatar = document.createElement('img');
    avatar.src = contact.avatar;
    
    name.appendChild(nameNode);
    birthday.appendChild(birthdayNode);
    
    element.appendChild(name);
    element.appendChild(avatar);
    element.appendChild(birthday);
    var phones = contact.phoneNumbers.map(createContactPhone).forEach(function(phone){
        element.appendChild(phone);
    });
    
   var addresses = document.createElement('dl');
    contact.address.map(function(a){
        return createContactAddress(addresses, a);
    }).forEach(function(add){
        element.appendChild(add);
    });
    
    /*var addresses = contact.address.map(createContactAddress).forEach(function(address){
        element.appendChild(address);
    });*/
    element.className = "contact";
    
    return element;
    
}
var container =  document.querySelector(".contacts-container");

var contactElements = contacts.map(createContact).forEach(function(element){
    container.appendChild(element);
});