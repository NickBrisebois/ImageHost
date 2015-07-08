
var filesUpload = document.getElementById("file");
var fileList = document.getElementById("file-list");
var submit = document.getElementById("uploadBtn")
var form = document.getElementById('file-form');
var ext = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'];

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getFiles (files) {
    if (typeof files !== undefined) {
        for (var i=0, l=files.length; i<l; i++) {
            var file = files[i]
              var li = document.createElement("li"),
        div = document.createElement("div");

    li.appendChild(div);

    // Present file info and append it to the list of files#
    if( ext.indexOf(file.name.split('.').pop()) > -1 ){
        div.innerHTML = "<div class='bold center p2 mb2 bg-yellow rounded' style='display: inline-block;' id = "+file.name.hashCode()+"><span id='span"+file.name.hashCode()+"'>"+file.name+"</span> <span class='inline-block px1 white bg-green rounded'><i class='fa fa-check'></i></span> </div> ";
    }else{
        div.innerHTML = "<div class='bold center p2 mb2 bg-yellow rounded' style='display: inline-block;' id = "+file.name.hashCode()+"><span id='span"+file.name.hashCode()+"'>"+file.name+"</span> <span class='inline-block px1 white bg-red rounded'><i class='fa fa-close'></i></span> </div>";
    }
    //maybe i should dynamically put this stuff in an array, probably much easier

    fileList.appendChild(div);
        }
    }
}


function getCount(){
    nanoajax.ajax('/api/count', function (code, responseText) { 
        document.getElementById("count").innerHTML=responseText;
    })
    console.log("Fired!")
}
getCount()
setInterval(getCount, 60000);

filesUpload.addEventListener("change", function () {
    fileList.innerHTML="";
    getFiles(this.files);
}, false);

form.onsubmit = function(event) {
    event.preventDefault();
    var files = filesUpload.files;
    
    for(var i = 0;i<files.length;i++){
        var formData = new FormData();
        var file = files[i];
        formData.append('file[]', file, file.name);
        // maybe do each upload seperately. Chain success together.
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        (function(file){
        xhr.onload = function () { //onreadystatechange replacement.

            if (this.status === 200 && !this.responseText.includes("Fail")) { // in future, this really should be JSON
                //change contents of the image selection divs somehow to reflect: uploading, uploaded or failed.
                document.getElementById(file.name.hashCode()).innerHTML=document.getElementById(file.name.hashCode()).innerHTML+"<span class='inline-block px1 white bg-green rounded'><i class='fa fa-check'></i></span>"
                document.getElementById("span"+file.name.hashCode()).innerHTML="<a href='"+this.responseText+"'>"+file.name+"</a>"
                console.log(this.responseText);
            } else {
                document.getElementById(file.name.hashCode()).innerHTML=document.getElementById(file.name.hashCode()).innerHTML+"<span class='inline-block px1 white bg-red rounded'><i class='fa fa-close'></i></span>"
                console.log('An error occurred! '+this.status);
            }
            //no matter what, continue onto next file anyway. Though depending on error (too many uploads?) break it.
        };
        })(file);
    xhr.send(formData);
}

}