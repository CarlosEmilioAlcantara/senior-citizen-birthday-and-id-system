from database.database import modify_db, query_db

def get_future_recipients():
    recipients = query_db("""
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE DATEDIFF(
            CASE 
                WHEN MONTH(birthday) = 1 AND DAY(birthday) < 15 THEN
                    DATE_ADD(
                        birthday, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthday) + 1 YEAR
                    )
                ELSE
                    DATE_ADD(
                        birthday, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthday) YEAR
                    )
            END,
            CURDATE()
        ) = 15 ;
    """, None, False)
    return recipients

def get_today_recipients():
    recipients = query_db("""
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE DATEDIFF(
            DATE_ADD(
                birthday, 
                INTERVAL YEAR(CURDATE()) - YEAR(birthday) YEAR
            ),
            CURDATE()
        ) = 0 ;
    """, None, False)
    return recipients

def get_past_recipients():
    recipients = query_db("""
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE DATEDIFF(
            CURDATE(), 
            CASE 
                WHEN MONTH(CURDATE()) = 1 AND DAY(CURDATE()) < 15 THEN
                    DATE_ADD(
                        birthday, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthday) - 1 YEAR
                    )
                ELSE
                    DATE_ADD(
                        birthday, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthday) YEAR
                    )
            END
        ) = 15 ;
    """, None, False)
    return recipients

def get_today_celebrants():
    recipients = query_db("""
        SELECT 
            senior_id, age
        FROM senior_citizens
        WHERE DATEDIFF(
            DATE_ADD(birthday, INTERVAL YEAR(CURDATE()) - YEAR(birthday) YEAR),
            CURDATE()
        ) = 0;
    """, None, False)
    return recipients

def update_senior_age(new_age, identifier):
    modify_db("""
        UPDATE senior_citizens
        SET age = %s
        WHERE senior_id = %s
    """, (
        new_age, identifier
    ))

def clean_password_resets():
    modify_db("""
        DELETE FROM password_resets
        WHERE DATEDIFF(CURDATE(), created_at) = 0
    """, (
        None
    ))

def get_unverified_seniors():
    seniors = query_db("""
        SELECT * FROM senior_citizens
        WHERE DATEDIFF(CURDATE(), updated_at) >= 30
        AND verify_status = 0;
    """, (
        None
    ), False)
    return seniors

def select_id_path(identifier):
    path = query_db("""
        SELECT picture_name FROM picture_images
        WHERE senior_id = %s
    """, (
        (identifier),
    ), True)["picture_name"]
    return path

def select_signature_path(identifier):
    path = query_db("""
        SELECT image_name FROM signature_images
        WHERE senior_id = %s
    """, (
        (identifier),
    ), True)["image_name"]
    return path

def clean_unverified_seniors():
    modify_db("""
        DELETE FROM senior_citizens
        WHERE DATEDIFF(CURDATE(), updated_at) >= 30
        AND verify_status = 0;
    """, (
        None
    ))