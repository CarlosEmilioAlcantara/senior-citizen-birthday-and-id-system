from app.database import modify_db, query_db

def save_otp(email, otp):
    modify_db("""
        INSERT INTO password_resets(
            email, otp
        ) VALUES (
            %s, %s 
        );""", (
            email, otp,
    ))

def update_otp(email, otp):
    modify_db("""
        UPDATE password_resets
        SET otp = %s
        WHERE email = %s;
    """, (
        otp, email, 
    ))

def select_otp(email):
    data = query_db("""
        SELECT otp, expires_at FROM password_resets
        WHERE email = %s
    """, (
        email,
    ), True)
    return data

def delete_otp(email):
    modify_db("""
        DELETE FROM password_resets
        WHERE email = %s
        ;""", (
            email,
    ))