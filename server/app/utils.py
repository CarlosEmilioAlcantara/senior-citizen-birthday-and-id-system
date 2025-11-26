from functools import wraps
from flask import jsonify, session, current_app

def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if "role" not in session:
                return jsonify({"error": "Unauthorized", "status": 401}), 401
            if session["role"] not in roles:
                return jsonify({"error": "Forbidden", "status": 403}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator