import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_DATABASE = os.getenv("DB_DATABASE")
    SESSION_LIFETIME_DAYS = int(os.getenv("SESSION_LIFETIME_DAYS"))
    ID_FOLDER = os.getenv("ID_FOLDER")
    SIGNATURE_FOLDER = os.getenv("SIGNATURE_FOLDER")
    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(__file__), 
        os.getenv("UPLOAD_FOLDER")
    )
    TEMP_FOLDER = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMP_FOLDER")
    )
    TEMPLATE_FILE_FRONT = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMPLATE_FILE_FRONT")
    )
    TEMPLATE_FILE_BACK = os.path.join(
        os.path.dirname(__file__),
        os.getenv("TEMPLATE_FILE_BACK")
    )
    LIMITER_DAY_LIMIT = os.getenv("LIMITER_DAY_LIMIT")
    LIMITER_HOUR_LIMIT = os.getenv("LIMITER_HOUR_LIMIT")
    # RATELIMIT_HEADERS_ENABLED = True,
    WTF_CSRF_TIME_LIMIT = None
#   SESSION_COOKIE_SECURE=True, 
#   SESSION_COOKIE_HTTPONLY=True, 
#   SESSION_COOKIE_SAMESITE='Lax' 
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = True