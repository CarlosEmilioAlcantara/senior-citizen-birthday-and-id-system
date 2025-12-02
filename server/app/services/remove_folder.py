import shutil

def remove_folder(folder):
    try:
        shutil.rmtree(folder)
    except OSError as e:
       print("Delete Folder Unsuccessful", e) 