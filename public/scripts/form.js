function updateFields(e){
       var section = e.parentNode.parentNode;
       var clone = e.parentNode.cloneNode(true);
       var inputs = clone.getElementsByTagName('input');
       [].forEach.call(inputs,function(b){
           b.value = '';
       });
       
       var btn = clone.getElementsByTagName('button');
       [].forEach.call(btn,function(b){
           b.parentNode.removeChild(b);
       });
       
       section.appendChild(clone);
    }

var btns = grabElements('.clone');
//this is ugly.
btns.forEach(function(e){
    e.addEventListener("click", function(){
        updateFields(e); //has to be a better way, but its 4:40am and I don't care..
    });
});