import os
from models.models import select_id_path, select_signature_path, get_unverified_seniors

def delete_old_images():
    seniors = get_unverified_seniors()

    if seniors:
        for senior in seniors:
            id = senior["senior_id"]
            picture_path = f"{os.getenv('APP_LOCATION')}{select_id_path(id)}"
            signature_path = f"{os.getenv('APP_LOCATION')}{select_signature_path(id)}"

            if picture_path and os.path.exists(picture_path):
                os.remove(picture_path)

            if signature_path and os.path.exists(signature_path):
                os.remove(signature_path)