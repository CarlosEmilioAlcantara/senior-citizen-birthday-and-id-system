from flask import request, jsonify, current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature

def get_serializer():
    return URLSafeTimedSerializer(current_app.secret_key)

def generate_csrf_token():
    return get_serializer().dumps("csrf")