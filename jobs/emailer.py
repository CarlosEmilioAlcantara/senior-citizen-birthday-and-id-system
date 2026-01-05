import os
import smtplib
from email.mime.text import MIMEText
from modules.birthdays import update_age, who_has_birthday_near, who_has_birthday_past, who_has_birthday_today, who_still_unverified
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
        if when == "near":
            body = f"""
Happy birthday! {first_name} {middle_name} {last_name}

You are nearly {age + 1}, your birthday is on {birthday}. 
You may now visit the establishment to earn your birthday payout.

This message is automated. Please do not reply.
"""
        if when == "today":
            body = f"""
Happy birthday! {first_name} {middle_name} {last_name}

You are now {age}, your birthday is today {birthday}. 
You may now visit the establishment to earn your birthday payout.

This message is automated. Please do not reply.
"""

        if when == "past":
            body = f"""
Happy birthday! {first_name} {middle_name} {last_name}

You are nowelse {age}, your birthday was on {birthday}. 
Please remember to visit the establishment to earn your birthday payout if you haven't yet.

This message is automated. Please do not reply.
"""

        if when == "unverified":
            body = f"""
Hello! {first_name} {middle_name} {last_name}

Unfortunately due to information you've provided being insufficient.
Your account has remained unverified for 30 days and has now been automatically deleted.
Please create a new account and ensure to input the correct information next time.

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
    unverified_recipients = who_still_unverified()

    if future_recipients:
        send_bulk_emails(future_recipients, "near")
    if today_recipients:
        send_bulk_emails(today_recipients, "today")
    if past_recipients:
        send_bulk_emails(past_recipients, "past")
    if unverified_recipients:
        send_bulk_emails(unverified_recipients, "unverified")

if __name__ == "__main__":
    emailer()