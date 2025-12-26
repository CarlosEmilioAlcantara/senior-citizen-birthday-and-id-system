import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def db_connect():
    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_DATABASE")
    )
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