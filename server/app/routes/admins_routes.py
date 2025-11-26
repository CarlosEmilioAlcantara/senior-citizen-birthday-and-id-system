import io
import os
import zipfile
from flask import Blueprint, jsonify, request, send_file, session, current_app
from werkzeug.datastructures import CombinedMultiDict
from models.seniors import change_verify_status, select_id_picture, select_pictures, select_senior, select_seniors, select_signature_picture, select_signatures, update_senior
from models.admins import check_email_admin, check_username_admin, exist_admin, select_admin, select_admins, update_admin
from app.forms.auth_forms import AdminEditForm, AdminEditUserForm, ChangeVerification, CheckIDForm, DeleteAccountForm, DownloadIDValidator, PrintIDValidator
from services.check_password import check_password
from services.change_password import change_password
from services.upsert_image import upsert_image
from services.delete_account import delete_account
from services.delete_old_image import delete_old_image
from services.image_service import generate_id_card
from services.create_filename import create_filename
from services.create_folder import create_folder 
from services.remove_folder import remove_folder

admins_bp = Blueprint("admins", __name__)

@admins_bp.route("/admin/info", methods=["GET", "POST"])
def admin_info():
    if request.method == "POST":
        admin = select_admins()
    elif request.method == "GET":
        admin = select_admin(session["admin_id"])

    if admin:
        return jsonify({
            "success": True, 
            "response": "Info Gathered", 
            "info": admin
        }), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Info Not Gathered", 
        }), 400

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/edit", methods=["POST"])
def admins_edit():
    form = AdminEditForm() 

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Edit Unsuccessful",
            "errors": form.errors
        }), 400

    email = form.email.data
    username = form.username.data
    password = form.password.data
    check_email = check_email_admin(session["admin_id"])
    check_username = check_username_admin(session["admin_id"])

    if exist_admin(email) and email != check_email:
        return jsonify({
            "success": False,
            "response": "Email Already In Use",
        }), 400

    if exist_admin(username) and username != check_username:
        return jsonify({
            "success": False,
            "response": "Username Already In Use",
        }), 400

    if password:
        update_admin(email, username, session["admin_id"])
        change_password(password, session["admin_id"], "admin")
    else:
        update_admin(email, username, session["admin_id"])

    return jsonify({"success": True, "response": "Edit Successful"}), 200

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/delete", methods=["POST"])
def admin_delete():
    form = DeleteAccountForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Delete Account Unsuccessful",
            "errors": form.errors
        }), 400

    password = form.password.data
    admin = select_admin(session["admin_id"])

    if admin:
        if check_password(admin, password):
            delete_account(session["admin_id"], "admin")
            session.clear()
            return jsonify({
                "success": True, 
                "response": "Delete Account Successful"
            }), 200
        else:
            return jsonify({
                "success": False, 
                "response": "Password Incorrect"
            }), 400
    else:
        return jsonify({
            "success": False, 
            "response": "User Lookup Unsuccessful"
        }), 400

# @require_role("admin", "superadmin")
# @limiter.exempt
@admins_bp.route("/admins/users-list", methods=["GET"])
def users_list():
    seniors = select_seniors()
    pictures = select_pictures()
    signatures = select_signatures()
    return jsonify({
        "success": True, 
        "response": "Info gathered", 
        "list": seniors, 
        "pictures": pictures, 
        "signatures": signatures,
    }), 200

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/edit-senior-verification", methods=["POST"])
def admins_edit_senior_verification():
    data = request.get_json()
    form = ChangeVerification(data=data)

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Verification Edit Unsuccessful",
            "errors": form.errors
        })

    id = form.id.data
    verification = form.verification.data

    if not select_senior(id, True):
        return jsonify({
            "success": False,
            "response": "Admin Nonexistent",
            "exists": False
        }), 400

    change_verify_status(
        verification, 
        id
    )
    return jsonify({
        "success": True, 
        "response": "Verification Edit Unsuccessful", 
        "senior_id": id
    }), 200

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/edit-senior", methods=["POST"])
def admins_edit_senior():
    form = AdminEditUserForm(CombinedMultiDict([request.form, request.files]))

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Edit Unsuccessful",
            "errors": form.errors
        }), 400

    id = form.id.data
    email = form.email.data
    id_picture = form.id_picture.data
    signature_picture = form.signature_picture.data
    first_name = form.first_name.data
    middle_name = form.middle_name.data
    last_name = form.last_name.data
    house = form.house.data
    street = form.street.data
    barangay = form.barangay.data
    subdivision = form.subdivision.data
    city = form.city.data
    province = form.province.data
    birthday = form.birthday.data
    age = form.age.data
    gender = form.gender.data
    emergency_fname = form.emergency_fname.data
    emergency_mname = form.emergency_mname.data
    emergency_lname = form.emergency_lname.data
    emergency_number = form.emergency_number.data

    update_senior(
        first_name, middle_name, last_name, house, street, barangay,
        subdivision, city, province, birthday, age, gender,
        emergency_fname, emergency_mname, emergency_lname, emergency_number,
        email, id)

    if form.id_picture.data.filename and form.signature_picture.data.filename:
        delete_old_image("picture_name", "picture_images", session["user_id"])
        delete_old_image("image_name", "signature_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            id, "update")
        upsert_image(
            last_name, middle_name, first_name, signature_picture, "signature",
            current_app.config["SIGNATURE_FOLDER"], "signature_images",
            "image_name", id, "update")
    elif form.id_picture.data.filename:
        delete_old_image("picture_name", "picture_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            id, "update")
    elif form.signature_picture.data.filename:
        delete_old_image("image_name", "signature_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, signature_picture, "signature",
            current_app.config["SIGNATURE_FOLDER"], "signature_images",
            "image_name", id, "update")

    return jsonify({"success": True, "response": "Edit Successful"}), 200

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/delete-senior", methods=["POST"])
def admins_delete_senior():
    form = CheckIDForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Delete Senior Unsuccessful",
            "errors": form.errors
        }), 400

    id = form.id.data
    user = select_senior(id, True)

    if user: 
        delete_old_image("picture_name", "picture_images", id)
        delete_old_image("image_name", "signature_images", id)
        delete_account(id, "senior")
        return jsonify({
            "success": True, 
            "response": "Delete Account Successful"
        }), 200
    else:
        return jsonify({
            "success": False, 
            "response": "User Lookup Unsuccessful",
            "exists": False
        }), 400

# @require_role("admin", "superadmin")
@admins_bp.route("/admins/print-id", methods=["POST"])
def admins_print_id():
    data = request.get_json()
    id = data["id"]
    id_picture = select_id_picture(id)
    signature_picture = select_signature_picture(id)
    data["id_picture"] = id_picture
    data["signature_picture"] = signature_picture
    form = PrintIDValidator(data=data)

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Print ID Unsuccessful",
            "errors": form.errors
        }), 400

    id = form.id.data
    email = form.email.data
    id_picture = form.id_picture.data
    signature_picture = form.signature_picture.data
    first_name = form.first_name.data
    middle_name = form.middle_name.data
    last_name = form.last_name.data
    house = form.house.data
    street = form.street.data
    barangay = form.barangay.data
    subdivision = form.subdivision.data
    city = form.city.data
    province = form.province.data
    birthday = form.birthday.data
    age = form.age.data
    gender = form.gender.data
    emergency_fname = form.emergency_fname.data
    emergency_mname = form.emergency_mname.data
    emergency_lname = form.emergency_lname.data
    emergency_number = form.emergency_number.data

    generate_id_card(
        first_name, middle_name, last_name, email, age, birthday,
        gender, house, street, barangay, subdivision, city, province,
        emergency_fname, emergency_lname, emergency_mname,
        emergency_number, id_picture, signature_picture, id
    )
    return jsonify({"success": True, "response": "Print ID Successful"}), 200

@admins_bp.route("/download-id", methods=["POST", "GET"])
def download_id():
    data = request.get_json()
    form = DownloadIDValidator(data=data)

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Download ID Unsuccessful",
            "errors": form.errors
        }), 400

    last_name = form.last_name.data
    middle_name = form.middle_name.data
    first_name = form.first_name.data
    folder = create_folder(last_name, middle_name, first_name)
    zip_name = create_filename("card", last_name, middle_name, first_name)

    if folder and os.path.exists(folder):
        zip_stream = io.BytesIO()

        with zipfile.ZipFile(zip_stream, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(folder):
                for file in files:
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, os.path.relpath(file_path, folder))
    
        remove_folder(folder)
        zip_stream.seek(0)
        return send_file(
            zip_stream,
            as_attachment = True,
            download_name = f"{zip_name}.zip",
            mimetype = "application/zip",
            conditional = False
        )
    else:
        return jsonify({"success": False, "response": "Folder not found"}), 400