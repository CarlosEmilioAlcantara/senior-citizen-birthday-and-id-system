import os
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from datetime import timedelta
from common.extensions import csrf
from app.routes.file_routes import files_bp
from app.routes.error_routes import errors_bp
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import users_bp
from app.routes.admins_routes import admins_bp
from app.routes.superadmin_routes import superadmins_bp

app = Flask(__name__)

app.config.update( 
    SECRET_KEY = os.getenv("SECRET_KEY"),
    SESSION_LIFETIME_DAYS = int(os.getenv("SESSION_LIFETIME_DAYS")),
    ID_FOLDER = os.getenv("ID_FOLDER"),
    SIGNATURE_FOLDER = os.getenv("SIGNATURE_FOLDER"),
    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(__file__), 
        os.getenv("UPLOAD_FOLDER")
    ),
    TEMP_FOLDER = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMP_FOLDER")
    ),
    TEMPLATE_FILE_FRONT = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMPLATE_FILE_FRONT")
    ),
    TEMPLATE_FILE_BACK = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMPLATE_FILE_BACK")
    ),
    LIMITER_DAY_LIMIT = os.getenv("LIMITER_DAY_LIMIT"),
    LIMITER_HOUR_LIMIT = os.getenv("LIMITER_HOUR_LIMIT"),
    RATELIMIT_HEADERS_ENABLED = True,
    WTF_CSRF_CHECK_DEFAULT = True,
    WTF_CSRF_TIME_LIMIT = None,
    WTF_CSRF_ENABLED = True,
    WTF_CSRF_METHODS = ["POST", "PUT", "PATCH", "DELETE"],
    WTF_CSRF_HEADERS = ["X-CSRFToken", "X-CSRF-Token"],
#   SESSION_COOKIE_SECURE=True, 
#   SESSION_COOKIE_HTTPONLY=True, 
#   SESSION_COOKIE_SAMESITE='Lax' 
)

csrf.init_app(app)

app.secret_key = app.config["SECRET_KEY"]
app.permanent_session_lifetime = timedelta(
    days=app.config["SESSION_LIFETIME_DAYS"])

CORS(app, supports_credentials=True)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    headers_enabled=True,
    default_limits=[
        app.config["LIMITER_DAY_LIMIT"], 
        app.config["LIMITER_HOUR_LIMIT"], 
    ],
)

app.register_blueprint(files_bp)
app.register_blueprint(errors_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(admins_bp)
app.register_blueprint(superadmins_bp)

if __name__ == "__main__":
    app.run(debug=True)