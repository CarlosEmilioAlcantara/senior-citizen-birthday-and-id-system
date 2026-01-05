from models.models import get_future_recipients, get_past_recipients, get_today_celebrants, get_today_recipients, get_unverified_seniors, update_senior_age

def who_has_birthday_near():
    recipients = get_future_recipients()
    return recipients

def who_has_birthday_today():
    recipients = get_today_recipients()
    return recipients

def who_has_birthday_past():
    recipients = get_past_recipients()
    return recipients

def who_still_unverified():
    unverified = get_unverified_seniors()
    return unverified

def update_age():
    celebrants = get_today_celebrants()

    for celebrant in celebrants:
        update_senior_age(celebrant["age"] + 1, celebrant["senior_id"])