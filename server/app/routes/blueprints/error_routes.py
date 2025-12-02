from flask import Blueprint, make_response

errors_bp = Blueprint("errors", __name__)

@errors_bp.errorhandler(429)
def ratelimit_handler(e):
    return make_response(
    ({
        "success": False, 
        "response": "Rate Limit Exceeded", 
        "status": 429
    }), 429
    )

@errors_bp.errorhandler(403)
def forbidden_handler(e):
    return make_response(
    ({
        "success": False, 
        "response": "Route Forbidden", 
        "status": 403
    }), 403
    )