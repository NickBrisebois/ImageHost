#!/usr/bin/env python

from flask import Flask, url_for, render_template, request,\
        redirect, abort, session, g, flash
from app.models import *

app = Flask(__name__)

#Set the folder for uploads
UPLOAD_FOLDER = '/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOADE_FOLDER'],
            filename)


@app.route('/')
def index():
    return render_template('index.html')


