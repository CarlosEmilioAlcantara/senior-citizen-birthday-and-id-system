from database.database import modify_db, query_db

def get_future_recipients():
    recipients = query_db("""
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE (
            (DAYOFYEAR(birthday) - DAYOFYEAR(CURDATE()) + 366) % 366
        ) BETWEEN 1 AND 15;
    """, None, False)
    return recipients

def get_today_recipients():
    recipients = query_db("""
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
    """, None, False)
    return recipients

def get_today_celebrants():
    recipients = query_db("""
        SELECT 
            senior_id, age
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
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