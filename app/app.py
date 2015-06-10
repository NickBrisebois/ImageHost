#!/usr/bin/env python

from flask import Flask, url_for, render_template, request,\
        redirect, abort, session, g, flash, Markup
from app.models import *

app = Flask(__name__)

@app.route('/')
def index():
    return "I am root"


