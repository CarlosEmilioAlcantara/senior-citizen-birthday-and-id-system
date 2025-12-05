import os
import asyncio
import time
from aiosmtplib import SMTP
from email.message import EmailMessage
from modules.birthdays import update_age, who_has_birthday_near, who_has_birthday_today
from dotenv import load_dotenv

async def send_bulk_emails(recipients, when):
    smtp = SMTP(
        hostname=os.getenv("MAIL_SERVER"),
        port=int(os.getenv("MAIL_PORT")),
        start_tls=True
    )
    await smtp.connect()
    await smtp.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))

    async def send_email(
        first_name, 
        middle_name, 
        last_name, 
        birthday, 
        age, 
        email,
        when
    ):
        message = EmailMessage()
        message["From"] = os.getenv("MAIL_USERNAME")
        message["To"] = email
        message["Subject"] = "Birthday Award Payout"
        
        message.set_content(
            f"""
Happy birthday! {first_name} {middle_name} {last_name}!
You are {'nearly' if when == 'near' else 'now'} {age}, your birthday is {'on' if when == 'today' else 'nearly on'} {birthday},
you may now visit the establishment to earn your
birthday payout.

This message is automated. Please do not reply.
            """
        )

        await smtp.send_message(message)

    await asyncio.gather(*(send_email(
        recipient["first_name"],
        recipient["middle_name"],
        recipient["last_name"],
        recipient["birthday"],
        recipient["age"],
        recipient["email"],
        when
    ) for recipient in recipients))

    await smtp.quit()

async def emailer():
    load_dotenv()
    update_age()

    future_recipients = who_has_birthday_near()
    today_recipients = who_has_birthday_today()

    tasks = []
    if future_recipients:
        tasks.append(send_bulk_emails(future_recipients, "near"))
    if today_recipients:
        tasks.append(send_bulk_emails(today_recipients, "today"))

    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(emailer())