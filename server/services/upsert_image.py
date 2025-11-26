import os
from models.seniors import insert_id_image, update_id_image
from services.create_filename import create_filename
from services.validate_file import validate_file

def upsert_image(
    last_name, 
    middle_name, 
    first_name, 
    file, 
    prefix, 
    folder_path, 
    table, 
    column,
    identifier,
    action
):
    last_name, middle_name, first_name = validate_file(
        last_name, middle_name, first_name)
    filename = create_filename(
        prefix, last_name, middle_name, first_name, file.filename)
    file.save(os.path.join(folder_path, filename))
    path = f"{folder_path}/{filename}"

    if action == "insert":
        insert_id_image(table, column, path, identifier)
    elif action == "update":
        update_id_image(table, column, path, identifier)