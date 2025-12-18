from app.models.admins import change_password_admin, change_password_admin_email
from app.models.seniors import change_password_senior, change_password_senior_email
from app.services.encrypt_password import encrypt_password

def change_password(password, identifier, kind, email=False):
    hash = encrypt_password(password)
    if not email:
        if kind == "senior":
            change_password_senior(hash, identifier)
        elif kind == "admin":
            change_password_admin(hash, identifier)
    elif email: 
        if kind == "senior":
            change_password_senior_email(hash, identifier)
        elif kind == "admin":
            change_password_admin_email(hash, identifier)