import pyotp
import base64
from flask import current_app

def create_otp():
    byte_secret = bytes.fromhex(current_app.config["SECRET_KEY"])
    base32_secret = base64.b32encode(byte_secret).decode('utf-8')
    totp = pyotp.TOTP(base32_secret)
    return totp.now()