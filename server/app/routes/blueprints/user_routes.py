from datetime import datetime
from zoneinfo import ZoneInfo
from flask import Blueprint, jsonify, request, session, current_app
from werkzeug.datastructures import CombinedMultiDict
from app.models.seniors import check_verify_status, get_senior_birthday, select_picture, select_senior, update_senior
from app.forms.auth_forms import ChangePasswordForm, DeleteAccountForm, UserEditForm
from app.services.check_password import check_password
from app.services.change_password import change_password
from app.services.create_address import create_address
from app.services.upsert_image import upsert_image
from app.services.delete_account import delete_account
from app.services.delete_old_image import delete_old_image
from app.services.is_birthday_near import is_birthday_near

users_bp = Blueprint("users", __name__)

@users_bp.route("/user/info", methods=["GET"])
def user_info():
    user_info = select_senior(session["user_id"], True)
    user_info["address"] = create_address(
        user_info["house"],
        user_info["street"],
        user_info["barangay"],
        user_info["city"],
        user_info["province"],
        user_info.get("Subdivision")
    )
    user_info["birthday"] = user_info["birthday"].strftime("%Y-%m-%d")
    picture_path = select_picture(
        "picture_name", "picture_images", session["user_id"], True)
    signature_path = select_picture(
        "image_name", "signature_images", session["user_id"], True)
    user_info.update(picture_path)
    user_info.update(signature_path)
    return jsonify({
        "success": True, 
        "response": "Info Gathered", 
        "info": user_info
    }), 200

@users_bp.route("/user/edit", methods=["POST"])
def user_edit():
    form = UserEditForm(CombinedMultiDict([request.form, request.files]))

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Edit Unsuccessful",
            "errors": form.errors
        }), 400

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
        email, session["user_id"])

    if form.id_picture.data.filename and form.signature_picture.data.filename:
        delete_old_image("picture_name", "picture_images", session["user_id"])
        delete_old_image("image_name", "signature_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            session["user_id"], "update")
        upsert_image(
            last_name, middle_name, first_name, signature_picture, "signature",
            current_app.config["SIGNATURE_FOLDER"], "signature_images",
            "image_name", session["user_id"], "update")
    elif form.id_picture.data.filename:
        delete_old_image("picture_name", "picture_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, id_picture, "id",
            current_app.config["ID_FOLDER"], "picture_images", "picture_name", 
            session["user_id"], "update")
    elif form.signature_picture.data.filename:
        delete_old_image("image_name", "signature_images", session["user_id"])
        upsert_image(
            last_name, middle_name, first_name, signature_picture, "signature",
            current_app.config["SIGNATURE_FOLDER"], "signature_images",
            "image_name", session["user_id"], "update")

    return jsonify({"success": True, "response": "Edit Successful"}), 200

@users_bp.route("/user/change-password", methods=["POST"])
def user_change_password():
    form = ChangePasswordForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Change Password Unsuccessful",
            "errors": form.errors
        }), 400

    old_password = form.old_password.data
    password = form.password.data
    user = select_senior(session["user_id"], True)
    
    if user:
        if check_password(user, old_password):
            change_password(password, session["user_id"], "senior")
            return jsonify({
                "success": True, 
                "response": "Change Password Successful"
            }), 200
        else:
            return jsonify({
                "success": False, 
                "response": "Old Password Incorrect"
            }), 400
    else:
        return jsonify({
            "success": False, 
            "response": "User Lookup Unsuccessful"
        }), 400

@users_bp.route("/user/delete-account", methods=["POST"])
def user_delete():
    form = DeleteAccountForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Delete Account Unsuccessful",
            "errors": form.errors
        }), 400

    password = form.password.data
    user = select_senior(session["user_id"], True)

    if user: 
        if check_password(user, password):
            delete_old_image(
                "picture_name", "picture_images", session["user_id"])
            delete_old_image(
                "image_name", "signature_images", session["user_id"])
            delete_account(session["user_id"], "senior")
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

@users_bp.route("/user/get-verification-status", methods=["GET"])
def get_verification_status():
    if session["user_id"]:
        verification = check_verify_status(session["user_id"])
        if verification:
            return jsonify({"success": True, "verification": True}), 200
        elif not verification:
            return jsonify({"success": True, "verification": False}), 200
        else:
            return jsonify({
                "success": False, 
                "response": "User Lookup Unsuccessful"
            }), 400
    else:
        return jsonify({
            "success": False, 
            "response": "Session Nonexistent"
        }), 400

@users_bp.route("/user/check-birthday", methods=["GET"])
def check_birthday():
    birthday_near = is_birthday_near(session["user_id"])
    return jsonify({
        "success": True, 
        "response": "Birthday Gather Successful",
        "birthday_near": birthday_near
    })