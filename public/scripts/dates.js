var birthdays = grabElements('.birthday');
birthdays.forEach(function(e){
    var date = new Date(e.textContent);
    date = date.toDateString();
    e.textContent = date;
});