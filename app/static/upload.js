
var filesUpload = document.getElementById("file");
var fileList = document.getElementById("file-list");
var submit = document.getElementById("uploadBtn")
var form = document.getElementById('file-form');
var ext = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'];
function getFiles (files) {
    if (typeof files !== undefined) {
        for (var i=0, l=files.length; i<l; i++) {
            var file = files[i]
              var li = document.createElement("li"),
        div = document.createElement("div");

    li.appendChild(div);

    // Present file info and append it to the list of files#
    if( ext.indexOf(file.name.split('.').pop()) > -1 ){
        div.innerHTML = "<div class='bold center p2 mb2 bg-yellow rounded' style='display: inline-block;' id = "+file.name+">"+file.name +" <span class='inline-block px1 white bg-green rounded'><i class='fa fa-check'></i></span></div> ";
    }else{
        div.innerHTML = "<div class='bold center p2 mb2 bg-yellow rounded' style='display: inline-block;' id = "+file.name+">"+file.name +" <span class='inline-block px1 white bg-red rounded'><i class='fa fa-close'></i></span></div>";
    }

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
    getFiles(this.files);
}, false);

form.onsubmit = function(event) {
    event.preventDefault();

  // Update button text.
    submit.innerHTML = 'Uploading...';
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

            if (this.status === 200) {
                
                submit.innerHTML = 'Upload Image(s)'; //whatever
                //change contents of the image selection divs somehow to reflect: uploading, uploaded or failed.
                document.getElementById(file.name).innerHTML=document.getElementById(file.name).innerHTML+"<span class='inline-block px1 white bg-green rounded'><i class='fa fa-check'></i></span>"
                console.log(this.responseText);
            } else {
                document.getElementById(file.name).innerHTML=document.getElementById(file.name).innerHTML+"<span class='inline-block px1 white bg-red rounded'><i class='fa fa-close'></i></span>"
                console.log('An error occurred! '+this.status);
            }
            //no matter what, continue onto next file anyway. Though depending on error (too many uploads?) break it.
        };
        })(file);
    xhr.send(formData);
}

}