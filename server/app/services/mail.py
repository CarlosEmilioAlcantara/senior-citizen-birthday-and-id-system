from flask_mail import Mail
mail = Mail()

def implement_mail(app):
    mail.init_app(app)