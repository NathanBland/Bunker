var birthdays = grabElements('.birthday');
birthdays.forEach(function(e){
    date = new Date(e.textContent);
    date = date.toDateString();
    e.textContent = date;
});