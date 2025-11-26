from app.database import modify_db, query_db
from services.encrypt_password import encrypt_password

def session_admin(identifier):
    admin = query_db(
        "SELECT admin_id FROM admin_accounts WHERE admin_id = %s",
        (identifier,),
        True
    )
    return admin

def exist_admin(email_or_username):
    admin = query_db("""
        SELECT * FROM admin_accounts 
        WHERE email = %s
        OR username = %s
    """, (
        email_or_username, email_or_username,
    ), True)
    return admin

def select_admin(identifier):
    admin = query_db("""
        SELECT * FROM admin_accounts 
        WHERE admin_id = %s
    """, (
        identifier,
    ), True)
    return admin

def select_admins():
    admins = query_db("""
        SELECT * FROM admin_accounts
        ORDER BY admin_id DESC
    """, (
        None
    ), False)
    return admins

def emails_admin():
    rows = query_db("""
        SELECT email 
        FROM admin_accounts
    """, (
        None
    ), False)
    emails = [row["email"] for row in rows]
    return emails

def check_email_admin(identifier):
    email = query_db("""
        SELECT email 
        FROM admin_accounts WHERE admin_id = %s
    """, (
        identifier,
    ), True
    )["email"]
    return email

def check_username_admin(identifier):
    username = query_db("""
        SELECT username 
        FROM admin_accounts WHERE admin_id = %s
    """, (
        identifier,
    ), True
    )["username"]
    return username

def total_superadmins():
    total = query_db(
        "SELECT COUNT(*) FROM admin_accounts WHERE role = superadmin"
    )[0]["COUNT(*)"]
    return total

def total_admins():
    total = query_db(
        "SELECT COUNT(*) FROM admin_accounts WHERE role = admin"
    )[0]["COUNT(*)"]
    return total

def total_admin_accounts():
    total = query_db(
        "SELECT COUNT(*) FROM admin_accounts"
    )[0]["COUNT(*)"]
    return total

def insert_admin(email, username, password, role):
    hash = encrypt_password(password)
    modify_db("""
        INSERT INTO admin_accounts (
            email, username, password_hash, role
        ) VALUES (
            %s, %s, %s, %s
        );""", (
        email, username, hash.decode("utf-8"), role
    ))

def update_admin(email, username, identifier):
    modify_db("""
        UPDATE admin_accounts
        SET email = %s, username = %s
        WHERE admin_id = %s
    """, (
        email, username, identifier
    ))

def change_password_admin(hash, identifier):
    modify_db("""
        UPDATE admin_accounts
        SET password_hash = %s
        WHERE admin_id = %s;
    """, (
        hash.decode("utf-8"), identifier,
    ))

def delete_admin(identifier):
    modify_db(
        "DELETE FROM admin_accounts WHERE admin_id = %s",
        (identifier,)
    )

def change_role_admin(role, identifier):
    modify_db("""
        UPDATE admin_accounts 
        SET role = %s 
        WHERE admin_id = %s;
    """, (
        role, identifier,
    ))