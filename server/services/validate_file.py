from werkzeug.utils import secure_filename

def validate_file(last_name, middle_name, first_name):
    last_name = secure_filename(last_name)
    middle_name = secure_filename(middle_name)
    first_name = secure_filename(first_name)

    return last_name, middle_name, first_name