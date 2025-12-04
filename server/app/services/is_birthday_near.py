from datetime import datetime
from zoneinfo import ZoneInfo
from app.models.seniors import get_senior_birthday

def is_birthday_near(identifier):
    birthday = get_senior_birthday(identifier)
    now = datetime.now(ZoneInfo("Asia/Manila")).date().today()
    birthday_this_year = birthday.replace(year=now.year) 
    delta = (birthday_this_year - now).days

    if -15 <= delta <= 15:
        return True