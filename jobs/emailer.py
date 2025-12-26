import os
import smtplib
from email.mime.text import MIMEText
from modules.birthdays import update_age, who_has_birthday_near, who_has_birthday_past, who_has_birthday_today
from dotenv import load_dotenv

def send_bulk_emails(recipients, when):
    def send_email(
        first_name, 
        middle_name, 
        last_name, 
        birthday, 
        age, 
        email,
        when
    ):
        body = f"""
Happy birthday! {first_name} {middle_name} {last_name}!
You are {'nearly' if when == 'near' else 'now'} {age + 1 if when == 'near' else age}, your birthday {'is today' if when == 'today' else 'is on' if when == 'near' else 'was on'} {birthday}, {'please remember to' if when == 'past' else 'you may now'} visit the establishment to earn your
birthday payout.

This message is automated. Please do not reply.
"""
        message = MIMEText(body)
        message["From"] = os.getenv("MAIL_USERNAME")
        message["To"] = email
        message["Subject"] = "Birthday Award Payout"

        with smtplib.SMTP(
            os.getenv("MAIL_SERVER"), 
            os.getenv("MAIL_PORT")
        ) as smtp_server:
            smtp_server.starttls()
            smtp_server.login(
                os.getenv("MAIL_USERNAME"), 
                os.getenv("MAIL_PASSWORD")
            )
            smtp_server.send_message(
                message
            )

    for recipient in recipients:
        send_email(
            recipient["first_name"],
            recipient["middle_name"],
            recipient["last_name"],
            recipient["birthday"],
            recipient["age"],
            recipient["email"],
            when
        )

def emailer():
    load_dotenv()
    update_age()

    future_recipients = who_has_birthday_near()
    today_recipients = who_has_birthday_today()
    past_recipients = who_has_birthday_past()

    if future_recipients:
        send_bulk_emails(future_recipients, "near")
    if today_recipients:
        send_bulk_emails(today_recipients, "today")
    if past_recipients:
        send_bulk_emails(past_recipients, "past")

if __name__ == "__main__":
    emailer()