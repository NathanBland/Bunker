function getJSON(path, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('get',path,true);
    xhr.onload = function(){
        var json = this.responseText;
        var data = JSON.parse(json);
        callback(data);
    }
    xhr.send();
}
function getJSONP(path) {
    var script = document.createElement('script');
    script.src = path;
    document.body.appendChild(script);
}