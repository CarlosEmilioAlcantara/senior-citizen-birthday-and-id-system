import mysql.connector
from flask import current_app

def get_db_config():
    with current_app.app_context():
        return {
            "host": current_app.config["DB_HOST"],
            "user": current_app.config["DB_USER"],
            "password": current_app.config["DB_PASSWORD"],
            "database": current_app.config["DB_DATABASE"]
        }


def db_connect():
    db_config = get_db_config()
    connection = mysql.connector.connect(**db_config)
    return connection

def query_db(query, args=None, fetchone=False):
    conn = db_connect()
    cursor = conn.cursor(dictionary=True, buffered=True)

    try:
        cursor.execute(query, args)
        if cursor.with_rows:
            result = cursor.fetchone() if fetchone else cursor.fetchall()
        else:
            result = None

        return result
    finally:
        cursor.close()
        conn.close()

def modify_db(query, args=None):
    conn = db_connect()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(query, args)
        conn.commit()
        # if cursor.with_rows:
        #     cursor.fetchall()
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()