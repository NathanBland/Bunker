function toggleDetails(element){
    var div = element.currentTarget.lastElementChild;
    console.log(div);
    div.classList.toggle("visible");
}
function addListener(element){
    element.addEventListener("click", toggleDetails);
}
var buttons = grabElements('.contact');
buttons.forEach(addListener);