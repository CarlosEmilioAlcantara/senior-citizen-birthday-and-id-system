from flask import Flask
from datetime import timedelta
from app.security.cors import implement_cors
from app.security.limiter import implement_limiter
from app.security.csrf import implement_csrf
from app.routes.routes import register_routes

app = Flask(__name__)

def create_app():
    app.config.from_object("app.config.Config")
    app.secret_key = app.config["SECRET_KEY"]

    app.permanent_session_lifetime = timedelta(
        days=app.config["SESSION_LIFETIME_DAYS"]
    )

    implement_cors(app)
    implement_limiter(app)
    implement_csrf(app)
    register_routes(app)

    return app