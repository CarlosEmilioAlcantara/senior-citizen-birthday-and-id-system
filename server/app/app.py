from flask import Flask
from datetime import timedelta
from server.app.security.cors import implement_cors
from server.app.security.limiter import implement_limiter
from app.routes.routes import register_routes

app = Flask(__name__)

def create_app():
    app.config.from_object("app.config.Config")
    app.secret_key = app.config["SECRET_KEY"]

    app.permanent_session_lifetime = timedelta(
        days=app.config["SESSION_LIFETIME_DAYS"]
    )

    print(app.config["UPLOAD_FOLDER"])
    implement_cors(app)
    implement_limiter(app)
    register_routes(app)

    return app