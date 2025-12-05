from database.database import db_connect
from models.models import get_future_recipients, get_today_celebrants, get_today_recipients, update_senior_age

def who_has_birthday_near():
    recipients = get_future_recipients()
    return recipients

def who_has_birthday_today():
    recipients = get_today_recipients()
    return recipients

def update_age():
    celebrants = get_today_celebrants()

    for celebrant in celebrants:
        update_senior_age(celebrant["age"] + 1, celebrant["senior_id"])