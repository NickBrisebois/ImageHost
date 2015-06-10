#!/usr/bin/env python

from app.app_and_db import app, db
from app.startup.init_app import init_app

init_app(app, db)

if __name__ == "__main__":
    app.run(port=8080, debug=True)
