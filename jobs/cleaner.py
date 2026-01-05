from models.models import clean_password_resets, clean_unverified_seniors
from modules.delete_old_images import delete_old_images

if __name__ == "__main__":
    delete_old_images()
    clean_unverified_seniors()
    clean_password_resets()