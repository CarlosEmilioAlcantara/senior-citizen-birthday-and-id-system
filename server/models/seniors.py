from app.database import modify_db, query_db
from services.is_verified import is_verified
from services.encrypt_password import encrypt_password

def session_senior(identifier):
    user = query_db(
        "SELECT senior_id FROM senior_citizens WHERE senior_id = %s",
        (identifier,),
        True
    )
    return user

def exist_senior(email):
    user = query_db(
        "SELECT * FROM senior_citizens WHERE email = %s",
        (email,),
        True
    )
    return user

def get_id_senior(email):
    user = query_db(
        "SELECT senior_id FROM senior_citizens WHERE email = %s",
        (email,),
        True
    )
    return user["senior_id"]

def insert_senior(
    first_name,
    middle_name,
    last_name,
    house,
    street,
    barangay,
    subdivision,
    city,
    province,
    birthday,
    age,
    gender,
    emergency_fname,
    emergency_mname,
    emergency_lname,
    emergency_number,
    email,
    password
):
    hash = encrypt_password(password)
    modify_db("""
        INSERT INTO senior_citizens(
            first_name, middle_name, last_name,
            house, street, barangay, subdivision, city, province, 
            birthday, age, gender, emergency_fname, emergency_mname,
            emergency_lname, emergency_number, verify_status, email,
            password_hash
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        );""", (
            first_name, middle_name, last_name,
            house, street, barangay, subdivision, city, province, 
            birthday, age, gender, emergency_fname, emergency_mname,
            emergency_lname, emergency_number, False, email,
            hash.decode("utf-8")
    ))

def insert_id_image(table, column, path, identifier):
    modify_db(f"""
        INSERT INTO {table}(
            {column}, senior_id
        ) VALUES (%s, %s)
        ;""", (
            path, identifier,
        ))

def update_id_image(table, column, path, identifier):
    modify_db(f"""
        UPDATE {table} 
            SET {column} = %s 
        WHERE senior_id = %s;
        """, (
            path, identifier,
        ))

def select_senior(identifier, fetchone):
    user_info = query_db("""
        SELECT * FROM senior_citizens 
        WHERE senior_id=%s
            """, (
            (identifier),
        ), fetchone)
    return user_info

def select_picture(column, table, identifier, fetchone):
    path = query_db(f"""
        SELECT {column} FROM {table} 
        WHERE senior_id=%s
    """, (
        (identifier),
    ), fetchone)
    return path

def update_senior(
    first_name,
    middle_name,
    last_name,
    house,
    street,
    barangay,
    subdivision,
    city,
    province,
    birthday,
    age,
    gender,
    emergency_fname,
    emergency_mname,
    emergency_lname,
    emergency_number,
    email,
    identifier
):
    modify_db("""
        UPDATE senior_citizens
        SET first_name = %s, middle_name = %s, last_name = %s,
            house = %s, street = %s, barangay = %s, subdivision = %s, 
            city = %s, province = %s, birthday = %s, age = %s, gender = %s,
            emergency_fname = %s, emergency_mname = %s,
            emergency_lname = %s, emergency_number = %s,
            verify_status = %s, email = %s
        WHERE senior_id = %s;
    """, (
        first_name, middle_name, last_name,
        house, street, barangay, subdivision, city, province, 
        birthday, age, gender, emergency_fname, emergency_mname,
        emergency_lname, emergency_number, False, email, identifier,
    ))

def change_password_senior(hash, identifier):
    modify_db("""
        UPDATE senior_citizens
        SET password_hash = %s
        WHERE senior_id = %s;
    """, (
        hash.decode("utf-8"), identifier,
    ))

def delete_senior(identifier):
    modify_db("""
        DELETE FROM senior_citizens 
        WHERE senior_id = %s
    """, (
        identifier,
    ))

def check_verify_status(identifier):
    verification = query_db("""
        SELECT verify_status FROM senior_citizens 
        WHERE senior_id = %s
    """, (
        identifier,
    ), True)
    return verification.get("verify_status")

def total_verified_seniors():
    total = query_db("""
        SELECT COUNT(*) FROM senior_citizens 
        WHERE verify_status = 1
    """, (None), True)["COUNT(*)"]
    return total

def total_unverified_seniors():
    total = query_db("""
        SELECT COUNT(*) FROM senior_citizens 
        WHERE verify_status = 0
    """, (None), True)["COUNT(*)"]
    return total

def total_seniors():
    total = query_db(
        "SELECT COUNT(*) FROM senior_citizens"
    , (None), True)["COUNT(*)"]
    return total

def select_seniors():
    seniors = query_db("""
        SELECT * FROM senior_citizens
        ORDER BY senior_id DESC
    """, (
        None
    ), False)
    return seniors

def select_pictures():
    pictures = query_db("""
        SELECT * FROM picture_images
    """, (
        None
    ), False)
    return pictures

def select_signatures():
    signatures = query_db("""
        SELECT * FROM signature_images
    """, (
        None
    ), False)
    return signatures

def change_verify_status(verification, identifier):
    modify_db("""
        UPDATE senior_citizens 
        SET verify_status = %s
        WHERE senior_id = %s
    """, (
        is_verified(verification), identifier,
    ))

def select_id_picture(identifier):
    path = query_db("""
        SELECT picture_name FROM picture_images 
        WHERE senior_id = %s
    """, (
        (identifier),
    ), True)["picture_name"]
    return path

def select_signature_picture(identifier):
    path = query_db("""
        SELECT image_name FROM signature_images 
        WHERE senior_id = %s
    """, (
        (identifier),
    ), True)["image_name"]
    return path

def select_senior_newest(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM senior_citizens
        WHERE email LIKE %s
            OR first_name LIKE %s
            OR middle_name LIKE %s
            OR last_name LIKE %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
    ;""", (
        keyword, keyword, keyword, keyword,
        per_page, offset
    ))
    return rows

def select_senior_oldest(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM senior_citizens
        WHERE email LIKE %s
            OR first_name LIKE %s
            OR middle_name LIKE %s
            OR last_name LIKE %s
        ORDER BY created_at ASC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, keyword, keyword,
        per_page, offset
    ))
    return rows

def select_senior_updated(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM senior_citizens
        WHERE email LIKE %s
            OR first_name LIKE %s
            OR middle_name LIKE %s
            OR last_name LIKE %s
        ORDER BY updated_at DESC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, keyword, keyword,
        per_page, offset
    ))
    return rows

def select_senior_unupdated(keyword, page, per_page):
    keyword = f"%{keyword}%"
    offset = (page - 1) * per_page
    rows = query_db("""
        SELECT * FROM senior_citizens
        WHERE email LIKE %s
            OR first_name LIKE %s
            OR middle_name LIKE %s
            OR last_name LIKE %s
        ORDER BY updated_at ASC
        LIMIT %s OFFSET %s
    """, (
        keyword, keyword, keyword, keyword,
        per_page, offset
    ))
    return rows

def total_seniors_filtered(keyword):
    keyword = f"%{keyword}%"
    total = query_db("""
        SELECT COUNT(*)
        FROM senior_citizens
        WHERE email LIKE %s
            OR first_name LIKE %s
            OR middle_name LIKE %s
            OR last_name LIKE %s
    """, (
        keyword, keyword, keyword, keyword,
    ), True)["COUNT(*)"]
    return total