import flask 
import flask_cors 
import socket
import winreg
from PIL import ImageColor
import darkdetect
import platform
import os
import signal
import requests
import math


def hex_to_hsv(hex_code):
    # Convert hex to RGB
    hex_code = hex_code.lstrip('#')
    r = int(hex_code[0:2], 16)
    g = int(hex_code[2:4], 16)
    b = int(hex_code[4:6], 16)
    
    # Convert RGB to HSV
    r = float(r)
    g = float(g)
    b = float(b)
    high = max(r, g, b)
    low = min(r, g, b)
    h, s, v = high, high, high

    d = high - low
    s = 0 if high == 0 else d/high

    if high == low:
        h = 0.0
    else:
        h = {
            r: (g - b) / d + (6 if g < b else 0),
            g: (b - r) / d + 2,
            b: (r - g) / d + 4,
        }[high]
        h /= 6
    
    return (h, s, v)

def get_accent_color():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'SOFTWARE\Microsoft\Windows\DWM')
        value, _ = winreg.QueryValueEx(key, 'ColorizationColor')
        winreg.CloseKey(key)
        def convert_to_hex(rgb_int):
            # Extract RGB components
            blue = rgb_int & 0xFF
            green = (rgb_int >> 8) & 0xFF
            red = (rgb_int >> 16) & 0xFF

            # Convert to HEX format
            hex_color = '#{:02X}{:02X}{:02X}'.format(red, green, blue)
            return hex_color
        return convert_to_hex(value)
    except FileNotFoundError:
        print("Accent color key not found.")
        return None


app = flask.Flask(__name__)
flask_cors.CORS(app)
mode = int(hex_to_hsv(get_accent_color())[2])
if mode <= 50:
    mode = "dark"
else:
    mode = "light"

app_config = { 
    "theme":{
        "raw":get_accent_color(),
        "mode":mode,
        "theme": str(darkdetect.theme()).lower()
    },
    "computer": { 
        "os_system": platform.system(),
        "os_version":platform.version(), 
        "os_release": platform.release(), 
        "ip": socket.gethostbyname(socket.gethostname()), 
        "hostname":socket.gethostname(), 
        "username":os.getlogin(),
    }
}
print(app_config)


@app.route("/")
def return_online_status(): 
    return flask.jsonify(app_config)

@app.route(f"/off")
def stopServer():
    os.kill(os.getpid(), signal.SIGINT)
    return flask.jsonify({"success": True, "message": "Server is shutting down..."})

def url_ok(url):
    try:
        response = requests.head(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.ConnectionError as e:
        return e


if __name__ == "__main__":
    # driven code
    while url_ok("http://127.0.0.1:22301") == True: 
        url_ok("http://127.0.0.1:22301/off")
    
    app.run(port=22301)
