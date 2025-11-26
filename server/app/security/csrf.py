from flask import request, jsonify, current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature

CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "X-CSRF-Token"

def get_serializer():
    return URLSafeTimedSerializer(current_app.secret_key)

def generate_csrf_token():
    return get_serializer().dumps("csrf")

def require_csrf(view):
    def wrapper(*args, **kwargs):
        csrf_cookie = request.cookies.get(CSRF_COOKIE_NAME)
        csrf_header = request.headers.get(CSRF_HEADER_NAME)

        if not csrf_cookie or not csrf_header:
            return jsonify({"error": "missing csrf"}), 400

        try:
            get_serializer().loads(csrf_header)
        except BadSignature:
            return jsonify({"error": "invalid csrf"}), 400

        if csrf_cookie != csrf_header:
            return jsonify({"error": "csrf mismatch"}), 400

        return view(*args, **kwargs)

    wrapper.__name__ = view.__name__
    return wrapper