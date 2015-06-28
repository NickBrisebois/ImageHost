#!/usr/bin/env python

from flask import Flask, url_for, render_template, request, redirect, abort, session, g, flash, send_from_directory
from werkzeug import secure_filename
import uuid, logging, imghdr, os.path
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.secret_key = 'notactuallysecret'
app.config['MAX_CONTENT_LENGTH'] = 30 * 1024 * 1024
# Set the folder for uploads
ext = set(['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'])
def validImage(img):
     return img.filename.rsplit('.', 1)[1] in ext and imghdr.what(img) in ext

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        flist = request.files.getlist("file[]")
        for f in flist:
            app.logger.info("attempted image upload: "+f.filename)
            if validImage(f):
                named = uuid.uuid4().hex+'.'+secure_filename(f.filename.rsplit('.', 1)[1])
                f.save('./uploads/' + named)
                app.logger.info("image uploaded: "+f.filename+" as "+named)
                flash('It has been uploaded: '+request.url_root+'uploads/'+named, "green")
            else:
                app.logger.info("Tried uploading invalid file: "+f.filename)
                flash('It needs to be an image!', 'red')
    return render_template('index.html')
    
@app.errorhandler(404)
def page_not_found(e):
    app.logger.info("404 from user")
    return render_template('errors/404.html'), 404

@app.route('/uploads/<path:path>')
def send_js(path):
    app.logger.info("retrieving file: "+path)
    return send_from_directory('uploads', path)

@app.route('/api/count')
def api_count(): #just basic before a DB is implemented.
    path = './uploads'
    return str(len([f for f in os.listdir(path)if os.path.isfile(os.path.join(path, f))]))

if __name__ == "__main__":
    handler = RotatingFileHandler('logging.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    fmt = logging.Formatter("%(asctime)-15s %(message)s",datefmt='%Y-%m-%d')
    handler.setFormatter(fmt)
    app.run(port=80, debug=True, threaded=True, host='0.0.0.0')
