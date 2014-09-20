//Passes in the event information coming from the eventlistener on contacts.
//The current target of that event is toggled. Not sure if that is what you want.
var toggleDetails = function(e){
    e.currentTarget.classList.toggle('CLASS NAME');
}
var grabElement = (){
    
    //turned the node list into an array for you. Now array methods will work for you. map(), forEach(), ... etc
    //
    var contacts = [].slice.call(document.querySelectorAll('.contact')).map(function(item){item.addEventListener('click', toggleDetails, false)});
    console.log(contacts);
    return contacts;
}


 
