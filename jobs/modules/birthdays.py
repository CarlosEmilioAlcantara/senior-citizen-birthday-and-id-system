from database.database import db_connect

def who_has_birthday_near():
    conn = db_connect()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE ((DAYOFYEAR(birthday) - DAYOFYEAR(CURDATE()) + 366) % 366) = 15
    """

    try:
        cursor.execute(query, None)
        return cursor.fetchall()
    finally:
        cursor.close() 
        conn.close()

def who_has_birthday_today():
    conn = db_connect()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT
            first_name, middle_name, last_name,
            birthday, age, email
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
    """

    try:
        cursor.execute(query, None)
        return cursor.fetchall()
    finally:
        cursor.close() 
        conn.close()

def update_age():
    conn = db_connect()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            senior_id, age
        FROM senior_citizens
        WHERE DAYOFYEAR(birthday) = DAYOFYEAR(CURDATE())
    """

    try:
        cursor.execute(query, None)
        with_birthdays = cursor.fetchall()
    finally:
        cursor.close() 
        conn.close()

    conn = db_connect()
    cursor = conn.cursor(dictionary=True)
    query = """
        UPDATE senior_citizens
        SET age = %s
        WHERE senior_id = %s
    """

    for celebrant in with_birthdays:
        cursor.execute(query, (celebrant["age"] + 1, celebrant["senior_id"]))

    conn.commit()
    cursor.close()
    conn.close()