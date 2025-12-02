import bcrypt

def encrypt_password(password):
    bytePassword = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(bytePassword, salt)

    return hash