from datetime import datetime
from zoneinfo import ZoneInfo

def create_filename(prefix, last_name, middle_name, first_name, filename=None):
    now = datetime.now(ZoneInfo("Asia/Manila"))
    timestamp = now.strftime("%m-%d-%Y-%H-%M-%S-%f")
    if filename:
        extension = filename.rsplit('.', 1)[1].lower()
        filename = f"{prefix}_{last_name}_{middle_name}_{first_name}-{timestamp}.{extension}" 
    else:
        filename = f"{prefix}_{last_name}_{middle_name}_{first_name}-{timestamp}" 

    return filename