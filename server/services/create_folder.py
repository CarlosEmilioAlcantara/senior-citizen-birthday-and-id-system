import os
from flask import current_app
from services.create_filename import create_filename
from services.move_images import move_images

def create_folder(last_name, middle_name, first_name):
    folder_name = create_filename("card", last_name, middle_name, first_name)
    card_folder = f"{current_app.config["TEMP_FOLDER"]}/{folder_name}"
    os.mkdir(card_folder)
    move_images(card_folder)
    return card_folder