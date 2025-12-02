from app.models.seniors import delete_senior
from app.models.admins import delete_admin

def delete_account(identifier, kind):
    if kind == "senior":
        delete_senior(identifier)
    elif kind == "admin":
        delete_admin(identifier)