import mysql.connector

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "1234",
    "database": "seniors"
}

def db_connect():
    connection = mysql.connector.connect(**db_config)
    return connection

# def count_db(query):
#     conn = db_connect()
#     cursor = conn.cursor(dictionary=True)

#     try:
#         cursor.execute(query)
#         result = cursor.fetchone()

#         return result
#     finally:
#         cursor.close()
#         conn.close()

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