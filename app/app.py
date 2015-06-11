#!/usr/bin/env python

from flask import Flask, url_for, render_template, request, redirect, abort, session, g, flash
from werkzeug import secure_filename
from app.models import *

app = Flask(__name__)

# Set the folder for uploads
ext = set(['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'])

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['fileToUpload']
        if f.filename.rsplit('.', 1)[1] in ext:
            f.save('./uploads/' + secure_filename(f.filename))
            return "Uploaded"
        else:
            return "Not right ext"


@app.route('/')
def index():
    return render_template('index.html')
