from flask import current_app
from flask_mail import Message
from app.services.mail import mail

def email_otp(recipient, otp):
    message = Message(
        subject="Password Reset",
        sender=current_app.config["MAIL_USERNAME"],
        recipients=[recipient]
    )
    message.body = otp
    mail.send(message)