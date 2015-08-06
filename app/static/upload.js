
var filesUpload = document.getElementById("file");
var fileList = document.getElementById("file-list");
var submit = document.getElementById("uploadBtn")
var form = document.getElementById('fileForm');
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


//When the user hits the upload files button, start the upload by calling on the flask upload script in app.py at /api/upload
Dropzone.options.fileForm = {

	acceptedFiles: "image/*",
	previewsContainer: "#file-list",

	init: function() {
		var submitButton = document.querySelector("#submit-all")
			myDropzone = this;

		submitButton.addEventListener("click", function(event) {
			event.preventDefault();
			var files = myDropzone.getAcceptedFiles();
			for(var i = 0; i<files.length; i++) {
				var formData = new FormData();
				var file = files[i];
				formData.append('file[]', file, file.name);
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/api/upload', true);
				(function(file){
					xhr.onload = function () { //onreadystatechange replacement.
						if (this.status === 200 && !this.responseText.includes("Fail")) { // in future, this really should be JSON
							//change contents of the image selection divs somehow to reflect: uploading, uploaded or failed.
							console.log(this.responseText);
						} else {
							alert("Failed");
						}
					};
				})(file);
				xhr.send(formData);
			}
		});
	}
};

