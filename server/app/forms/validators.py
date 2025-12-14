import os
import re
from wtforms.validators import ValidationError

def password_strength(form, field):
    if not re.match(r'^\S{8,}$', field.data):
        raise ValidationError(
            "Password should be at least 8 characters and contain no spaces"
        )

def allowed_file(form, field):
    if not field.data:
        raise ValidationError("No file uploaded")
    ext = os.path.splitext(field.data.filename)[1].lower().lstrip('.')
    if ext not in {"jpg", "jpeg", "png"}:
        raise ValidationError("File type should be .png, .jpg, or .jpeg")

def path_allowed_file(form, field):
    if not field.data:
        raise ValidationError("No file uploaded")
    ext = os.path.splitext(field.data)[1].lower().lstrip('.')
    if ext not in {"jpg", "jpeg", "png"}:
        raise ValidationError("File type should be .png, .jpg, or .jpeg")

def optional_allowed_file(form, field):
    if not field.raw_data or field.raw_data[0] == "":
        return  

    file = field.data
    if not file or not file.filename:
        return 

    ext = os.path.splitext(file.filename)[1].lower().lstrip(".")
    if ext not in {"jpg", "jpeg", "png"}:
        raise ValidationError("File type should be .png, .jpg, or .jpeg")

def file_size_limit(form, field):
    max_bytes = 64000
    field.data.seek(0, 2)
    file_size = field.data.tell()

    if file_size > max_bytes:
        raise ValidationError(f"File size must be less than 64kb")

    field.data.seek(0)