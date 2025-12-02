from app.models.admins import change_password_admin
from app.models.seniors import change_password_senior
from app.services.encrypt_password import encrypt_password

def change_password(password, identifier, kind):
    hash = encrypt_password(password)
    if kind == "senior":
        change_password_senior(hash, identifier)
    elif kind == "admin":
        change_password_admin(hash, identifier)