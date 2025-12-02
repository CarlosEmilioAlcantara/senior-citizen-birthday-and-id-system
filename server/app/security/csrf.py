from flask_wtf.csrf import CSRFProtect
csrf = CSRFProtect()

def implement_csrf(app):
    csrf.init_app(app)