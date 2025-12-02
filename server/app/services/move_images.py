import shutil
from os import listdir
from os.path import isfile, join
from flask import current_app

def move_images(folder):
    onlyfiles = [
        f for f in listdir(current_app.config["TEMP_FOLDER"]) if isfile(join(current_app.config["TEMP_FOLDER"], f))]

    for f in onlyfiles:
        src = join(current_app.config["TEMP_FOLDER"], f)
        shutil.move(src, folder)