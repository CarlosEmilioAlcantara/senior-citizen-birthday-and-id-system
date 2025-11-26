import bcrypt

def check_password(entity, password):
    if entity and bcrypt.checkpw(
        password.encode("utf-8"), 
        entity['password_hash']
        .encode("utf-8")
        ):
        return True