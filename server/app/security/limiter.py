from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def implement_limiter(app):
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[
            app.config["LIMITER_DAY_LIMIT"], 
            app.config["LIMITER_HOUR_LIMIT"], 
        ],
    )
    return limiter