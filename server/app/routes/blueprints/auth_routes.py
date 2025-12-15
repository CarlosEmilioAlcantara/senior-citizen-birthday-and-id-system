from flask import Blueprint, request, session, jsonify, current_app
from flask_wtf.csrf import generate_csrf
from app.security.csrf import csrf
from app.forms.auth_forms import AdminLoginForm, LoginForm, RegisterForm, InfoForm
from app.models.seniors import exist_senior, get_id_senior, insert_senior, session_senior
from app.models.admins import exist_admin, session_admin
from app.services.check_password import check_password
from app.services.upsert_image import upsert_image
from app.services.email_otp import email_otp
from app.services.create_otp import create_otp

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/csrf-token", methods=["GET"])
def csrf_token():
    token = generate_csrf()  
    # session.permanent = True
    return jsonify({"csrf_token": token})

@auth_bp.route("/login", methods=["POST"])
@csrf.exempt
def login():
    session.clear()
    form = LoginForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Login Unsuccessful",
            "errors": form.errors
        }), 400

    email = form.email.data
    password = form.password.data
    user = exist_senior(email)
    
    if user and check_password(user, password):
        session["user_id"] = user["senior_id"]
        session["role"] = "user"
        return jsonify({"success": True, "response": "Login Successful"}), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Login Unsuccessful"
        }), 401

@auth_bp.route("/auth/exists", methods=["POST"])
@csrf.exempt
def exists():
    session.clear()
    data = request.get_json()
    form = RegisterForm(data=data)

    if not form.validate():
        return jsonify({
            "success": False, 
            "response": "Registration Unsuccessful",
            "errors": form.errors
        }), 400

    email = form.email.data
    exists = exist_senior(email)

    if not exists:
        return jsonify({
            "success": True, 
            "response": "Email is not registered"
        }), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Email is registered"
        }), 401

@auth_bp.route("/auth/reset-password", methods=["POST"])
@csrf.exempt
def reset_password():
    session.clear()
    form = RegisterForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Reset Password Unsuccessful",
            "errors": form.errors
        }), 400

    email = form.email.data
    exists = exist_senior(email) or exist_admin(email)

    if exists:
        otp = create_otp()
        email_otp(email, otp)
        return jsonify({
            "success": True, 
            "response": "Email is registered"
        }), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Email is not registered"
        }), 401

@auth_bp.route("/auth/register", methods=["POST"])
@csrf.exempt
def register():
    session.clear()
    form = InfoForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False, 
            "response": "Registration Unsuccessful",
            "errors": form.errors
        }), 400

    email = form.email.data
    password = form.password.data
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

    insert_senior(
        first_name, middle_name, last_name, house, street, barangay,
        subdivision, city, province, birthday, age, gender, emergency_fname, 
        emergency_mname, emergency_lname, emergency_number, 
        email, password)

    senior_id = get_id_senior(email)
    upsert_image(
        last_name, middle_name, first_name, id_picture, "id", 
        current_app.config["ID_FOLDER"], "picture_images", "picture_name", senior_id,
        "insert")
    upsert_image(
        last_name, middle_name, first_name, signature_picture, "signature", 
        current_app.config["SIGNATURE_FOLDER"], "signature_images", "image_name",
        senior_id, "insert")

    # session.permanent = True
    session["user_id"] = senior_id
    session["role"] = "user"
    return jsonify({"success": True, "response": "User registered"}), 200

@auth_bp.route("/auth/logout", methods=["GET"])
def logout():
    role = session.get("role")
    session.clear()
    return jsonify({
        "success": True, 
        "response": "Logout Successful",
        "role": role
    }), 200

@auth_bp.route("/check-session", methods=["GET"])
def check_session():
    if "user_id" in session:
        user = session_senior(session["user_id"])

        if user and session["user_id"] == user["senior_id"]:
            return jsonify({
                "success": True, 
                "response": "Already logged in", 
                "role": "user"
            }), 200
        else:
            session.clear()
            return jsonify({
                "success": False, 
                "response": "Invalid session"
            }), 400
    elif "admin_id" in session:
        admin = session_admin(session["admin_id"])
        
        if admin and session["admin_id"] == admin["admin_id"] and session["role"]:
            return jsonify({
                "success": True, 
                "response": "Already logged in", 
                "role": session["role"]
            }), 200
        else:
            session.clear()
            return jsonify({
                "success": False, 
                "response": "Invalid session"
            }), 400
    else:
        return jsonify({"success": False, "response": "Session expired"}), 400

@auth_bp.route("/auth/get-role", methods=["GET"])
def get_role():
    role = session.get("role")
    return jsonify({"role": role})

@auth_bp.route("/auth/admin-login", methods=["POST"])
@csrf.exempt
def admin_login():
    session.clear()
    form = AdminLoginForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Login Unsuccessful",
            "errors": form.errors
        })
    
    email_or_username = form.email_or_username.data
    password = form.password.data
    admin = exist_admin(email_or_username)

    if admin:
        if check_password(admin, password):
            # session.permanent = True
            session["admin_id"] = admin["admin_id"]
            session["role"] = admin["role"]
            return jsonify({
                "success": True, 
                "response": "Login Successful", 
                "role": session["role"]
            }), 200
        else:
            return jsonify({
                "success": False, 
                "response": "Password Incorrect"
            }), 400
    else:
        return jsonify({
            "success": False, 
            "response": "Login Unsuccessful"
        }), 400
