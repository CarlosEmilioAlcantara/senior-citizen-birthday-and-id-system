from flask_cors import CORS

def implement_cors(app):
    CORS(app, supports_credentials=True)