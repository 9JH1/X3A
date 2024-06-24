#!/usr/bin/env python
from flask import Flask, jsonify
from flask_cors import CORS
from os import kill, getpid
from signal import SIGINT

app = Flask(__name__)
CORS = CORS(app)

@app.route("/")
def endpoint(): 
    return ""

@app.route(f"/off", methods=["GET"])
def stopServer():
    kill(getpid(), SIGINT)
    return jsonify({"success": True, "message": "Server is shutting down..."})


if __name__ == "__main__": 
    app.run(port=22301, debug=True)