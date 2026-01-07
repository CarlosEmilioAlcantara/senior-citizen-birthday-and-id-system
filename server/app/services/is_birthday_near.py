from datetime import date, datetime
from zoneinfo import ZoneInfo
from app.models.seniors import get_senior_birthday

def is_birthday_near(identifier):
    birthday = get_senior_birthday(identifier)
    now = datetime.now(ZoneInfo("Asia/Manila")).date().today()

    try:
        birthday_this_year = birthday.replace(year=now.year)
    except ValueError:
        birthday_this_year = date(now.year, 2, 28)

    delta = (birthday_this_year - now).days

    if -15 <= delta <= 15:
        return True