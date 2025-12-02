import re

def is_email(email_or_username):
    if re.match(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', 
        email_or_username):
        return True