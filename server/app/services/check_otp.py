from app.models.both import select_otp

def check_otp(email, otp):
    stored_otp = select_otp(email)
    if str(otp) == stored_otp:
        return True