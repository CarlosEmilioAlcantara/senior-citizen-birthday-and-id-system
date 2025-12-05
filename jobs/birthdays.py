from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from .database import db_connect

def birthday_range():
    now = datetime.now(ZoneInfo("Asia/Manila")).date()
    before = now - timedelta(days=15)
    after = now + timedelta(days=15)
    return before.timetuple().tm_yday, after.timetuple().tm_yday

def who_has_birthday():
    before, after = birthday_range()
    conn = db_connect()
    cursor = conn.cursor(dictionary=True)
    if before <= after:
        query = """
            SELECT
                senior_id, first_name, middle_name, last_name,
                birthday, age, email
            FROM senior_citizens
            WHERE DAYOFYEAR(birthday)
            BETWEEN %s AND %s
        """
    else:
        query = """
            SELECT
                senior_id, first_name, middle_name, last_name,
                birthday, age, email
            FROM senior_citizens
            WHERE DAYOFYEAR(birthday) >= %s
               OR DAYOFYEAR(birthday) <= %s
        """
    args = (before, after)

    try:
        cursor.execute(query, args)
        return print(cursor.fetchall())
    finally:
        cursor.close() 
        conn.close()