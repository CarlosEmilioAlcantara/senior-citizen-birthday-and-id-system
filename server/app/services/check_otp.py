from datetime import datetime
from zoneinfo import ZoneInfo
from app.models.both import select_otp

def check_otp(email, otp):
    reset_data = select_otp(email)
    stored_otp = reset_data["otp"]
    expires_at = reset_data["expires_at"]
    now = datetime.now(ZoneInfo("Asia/Manila"))
    now_formatted = now.strftime("%Y-%m-%d %H:%M:%S")
    now_clean = datetime.strptime(
        now_formatted,
        "%Y-%m-%d %H:%M:%S"
    )
    if str(otp) == stored_otp and now_clean >= expires_at:
        return "late"
    elif str(otp) == stored_otp and now_clean < expires_at:
        return "early"
    else:
        return "invalid"