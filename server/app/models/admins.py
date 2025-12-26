from app.database import modify_db, query_db
from app.services.encrypt_password import encrypt_password

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
        ORDER BY created_at DESC
    """, (
        None
    ), False)
    return admins

# def select_admins_asc():
#     admins = query_db("""
#         SELECT * FROM admin_accounts
#         ORDER BY admin_id ASC
#     """, (
#         None
#     ), False)
#     return admins

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
    , (None), True)["COUNT(*)"]
    return total

def total_admins():
    total = query_db(
        "SELECT COUNT(*) FROM admin_accounts WHERE role = admin"
    , (None), True)["COUNT(*)"]
    return total

def total_admin_accounts():
    total = query_db(
        "SELECT COUNT(*) FROM admin_accounts"
    , (None), True)["COUNT(*)"]
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

def change_password_admin_email(hash, identifier):
    modify_db("""
        UPDATE admin_accounts
        SET password_hash = %s
        WHERE email = %s;
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
        WHERE admin_id = %s
    """, (
        role, identifier,
    ))

def select_admin_newest(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM admin_accounts
        WHERE email LIKE %s
        OR username LIKE %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, per_page, offset
    ))
    return rows

def select_admin_oldest(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM admin_accounts
        WHERE email LIKE %s
        OR username LIKE %s
        ORDER BY created_at ASC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, per_page, offset
    ))
    return rows

def select_admin_updated(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM admin_accounts
        WHERE email LIKE %s
        OR username LIKE %s
        ORDER BY updated_at DESC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, per_page, offset
    ))
    return rows

def select_admin_unupdated(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM admin_accounts
        WHERE email LIKE %s
        OR username LIKE %s
        ORDER BY updated_at ASC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, per_page, offset
    ))
    return rows

def total_admins_filtered(keyword):
    keyword = f"%{keyword}%"
    total = query_db("""
        SELECT COUNT(*)
        FROM admin_accounts
        WHERE email LIKE %s
        OR username LIKE %s
    """, (
        keyword, keyword,
    ), True)["COUNT(*)"]
    return total

def get_today_celebrants(page, per_page):
    offset = (page - 1) * per_page
    recipients = query_db("""
        SELECT *
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
        ORDER BY last_name ASC
        LIMIT %s OFFSET %s
    """, (
        per_page, offset,
    ), False)
    return recipients

def total_celebrants():
    total = query_db("""
        SELECT COUNT(*)
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
    """, (
        None
    ), True)["COUNT(*)"]
    return total