#!/usr/bin/env python

from flask import Flask, url_for, render_template, request, redirect, abort, session, g, flash, send_from_directory
from werkzeug import secure_filename
import uuid, logging, os.path, shutil
from logging.handlers import RotatingFileHandler
app = Flask(__name__)
app.secret_key = 'notactuallysecret'
app.config['MAX_CONTENT_LENGTH'] = 30 * 1024 * 1024
# Set the folder for uploads
ext = set(['png', 'jpg', 'jpeg', 'bmp', 'gif'])


def validImage(img):
    return img.filename.rsplit('.', 1)[1].lower() in ext


@app.route('/')
def index():
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


@app.route('/api/upload', methods=['POST']) ##response should be json in future.
def api_upload():
    if request.method == 'POST':
        #app.logger.info("Api Request")
        flist = request.files.getlist("file[]")
        app.logger.info(str(len(flist)))
        for f in flist:
            app.logger.info("attempted image upload: "+f.filename)
            if validImage(f):
                named = uuid.uuid4().hex+'.'+secure_filename(f.filename.rsplit('.', 1)[1])
                f.save('./uploads/' + named)
                app.logger.info("image uploaded: "+f.filename+" as "+named)
                return request.url_root+'uploads/'+named
            else:
                app.logger.info("Fail: Tried uploading invalid file: "+f.filename)
                return "Fail: Invalid File"
    else:
        return "Fail: Unexpected Failure"
    return "Fail: This failure should not happen"+request.method


if __name__ == "__main__":
    handler = RotatingFileHandler('logging.log', maxBytes=100000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    fmt = logging.Formatter("%(asctime)-15s %(message)s",datefmt='%Y-%m-%d')
    handler.setFormatter(fmt)
    app.run(port=8080, debug=True, threaded=True, host='0.0.0.0')
