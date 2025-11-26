import io
import os
import zipfile
from flask import Blueprint, jsonify, request, send_file, session, current_app
from werkzeug.datastructures import CombinedMultiDict
from app.models.seniors import change_verify_status, select_id_picture, select_pictures, select_senior, select_senior_newest, select_senior_oldest, select_senior_unupdated, select_senior_updated, select_seniors, select_signature_picture, select_signatures, total_seniors_filtered, update_senior
from app.models.admins import check_email_admin, check_username_admin, exist_admin, get_today_celebrants, select_admin, select_admin_newest, select_admin_oldest, select_admin_unupdated, select_admin_updated, select_admins, total_admin_accounts, total_admins, total_admins_filtered, total_celebrants, update_admin
from app.forms.auth_forms import AdminEditForm, AdminEditUserForm, ChangeVerification, CheckIDForm, DeleteAccountForm, DownloadIDValidator, PrintIDValidator
from app.services.sort_data import sort_data
from app.services.check_password import check_password
from app.services.change_password import change_password
from app.services.upsert_image import upsert_image
from app.services.delete_account import delete_account
from app.services.delete_old_image import delete_old_image
from app.services.image_service import generate_id_card
from app.services.create_filename import create_filename
from app.services.create_folder import create_folder 
from app.services.remove_folder import remove_folder
from app.services.email_service import email_senior

admins_bp = Blueprint("admins", __name__)

@admins_bp.route("/admins/info", methods=["GET"])
def admin_info():
    get_all = request.args.get("get_all")
    keyword = request.args.get("keyword", default="")
    sort = request.args.get("sort", default="Newest")
    id = request.args.get("id")

    if get_all:
        try:
            page = int(request.args.get("page"))
            per_page = int(request.args.get("per_page"))
        except ValueError as e:
            print("Converting Unsuccessful", e)
        match sort:
            case "Newest":
                admins = select_admin_newest(keyword, page, per_page)
            case "Oldest":
                admins = select_admin_oldest(keyword, page, per_page)
            case "Updated":
                admins = select_admin_updated(keyword, page, per_page)
            case "Unupdated":
                admins = select_admin_unupdated(keyword, page, per_page)

        total_filtered = total_admins_filtered(keyword)
        total_pages = total_filtered // per_page
        return jsonify({
            "success": True, 
            "response": "Info Gathered", 
            "info": admins,
            "total_pages": total_pages
        }), 200

    if id:
        admin = select_admin(id)
        return jsonify({
            "success": True, 
            "response": "Info Gathered", 
            "info": admins,
            "total_pages": total_pages
        }), 200

    admin = select_admin(session["admin_id"])
    return jsonify({
        "success": True, 
        "response": "Info Gathered", 
        "info": admin
    }), 200

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
    keyword = request.args.get("keyword", default="")
    sort = request.args.get("sort", default="Newest")
    pictures = select_pictures()
    signatures = select_signatures()
    id = request.args.get("id")

    if id:
        user_info = select_senior(id, True)
        return jsonify({
            "success": True, 
            "response": "Info Gathered", 
            "info": user_info
        }), 200

    try:
        page = int(request.args.get("page"))
        per_page = int(request.args.get("per_page"))
    except ValueError as e:
        return jsonify({
            "success": False, 
            "response": "Faulty Request"
        }), 400

    match sort:
        case "Newest":
            seniors = select_senior_newest(keyword, page, per_page)
        case "Oldest":
            seniors = select_senior_oldest(keyword, page, per_page)
        case "Updated":
            seniors = select_senior_updated(keyword, page, per_page)
        case "Unupdated":
            seniors = select_senior_unupdated(keyword, page, per_page)

    total_filtered = total_seniors_filtered(keyword)
    total_pages = total_filtered // per_page
    return jsonify({
        "success": True, 
        "response": "Info Gathered", 
        "list": seniors, 
        "pictures": pictures, 
        "signatures": signatures,
        "total_pages": total_pages
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
    email = form.email.data
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
    email_senior(email, verification)

    return jsonify({
        "success": True, 
        "response": "Verification Edit Successful", 
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
        delete_old_image("picture_name", "picture_images", id)
        delete_old_image("image_name", "signature_images", id)
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            id, "update")
        upsert_image(
            last_name, middle_name, first_name, signature_picture, "signature",
            current_app.config["SIGNATURE_FOLDER"], "signature_images",
            "image_name", id, "update")
    elif form.id_picture.data.filename:
        delete_old_image("picture_name", "picture_images", id)
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            id, "update")
    elif form.signature_picture.data.filename:
        delete_old_image("image_name", "signature_images", id)
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
            "response": "Delete Senior Successful",
            "exists": False
        }), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Senior Lookup Unsuccessful",
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
    id_front = f"http://localhost:5000/temp/card-front.png"
    id_back = f"http://localhost:5000/temp/card-back.png"

    generate_id_card(
        first_name, middle_name, last_name, email, age, birthday,
        gender, house, street, barangay, subdivision, city, province,
        emergency_fname, emergency_lname, emergency_mname,
        emergency_number, id_picture, signature_picture, id
    )
    return jsonify({
        "success": True, 
        "response": "Print ID Successful",
        "id_front": id_front,
        "id_back": id_back
    }), 200

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

@admins_bp.route("/admins/get-celebrants", methods=["GET"])
def get_celebrants():
    pictures = select_pictures()
    signatures = select_signatures()

    try:
        page = int(request.args.get("page"))
        per_page = int(request.args.get("per_page"))
    except ValueError as e:
        return jsonify({
            "success": False,
            "response": "Faulty Request"
        }), 400
        
    celebrants = get_today_celebrants(page, per_page)
    total_pages = total_celebrants() // per_page

    if not celebrants:
        return jsonify({
            "success": False,
            "response": "No Celebrants Today"
        }), 400

    return jsonify({
        "success": True,
        "response": "Celebrants Fetch Successful",
        "celebrants": celebrants,
        "pictures": pictures,
        "signatures": signatures,
        "total_pages": total_pages
    }), 200