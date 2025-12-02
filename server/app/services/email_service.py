from flask import current_app
from flask_mail import Message
from app.services.mail import mail
from app.services.is_verified import is_verified

def email_senior(recipient, verification):
    message = Message(
        subject="Test",
        sender=current_app.config["MAIL_USERNAME"],
        recipients=[recipient]
    )
    if is_verified(verification):
        message.body = "Congratulations your account has been verified, you may now receive your Senior ID at the establishment."
    else:
        message.body = "Unfortunately your account has been unverified, please edit your information and ensure the data is correct."

    mail.send(message)

def birthday_emailer(recipient):
    # Send email when -15 days > birthday > +15 days
    return