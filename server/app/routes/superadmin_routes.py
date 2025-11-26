from flask import Blueprint, jsonify, request, session
from models.seniors import total_seniors, total_unverified_seniors, total_verified_seniors
from models.admins import change_role_admin, check_email_admin, check_username_admin, exist_admin, insert_admin, select_admin, select_admins, total_admin_accounts, update_admin
from app.forms.auth_forms import ChangeAdminRoleForm, CheckIDForm, CreateAdminForm, EditAdminForm
from services.delete_account import delete_account

superadmins_bp = Blueprint("superadmins", __name__)

# @require_role("superadmin")
@superadmins_bp.route("/superadmin/dashboard", methods=["GET"])
def superadmin_dashboard():
    info = {}
    admin_accounts = total_admin_accounts()
    senior_accounts = total_seniors()
    verified_seniors = total_verified_seniors()
    unverified_seniors = total_unverified_seniors()
    info.update({
        "admin_accounts": admin_accounts,
        "senior_accounts": senior_accounts,
        "verified_seniors": verified_seniors,
        "unverified_seniors": unverified_seniors
        })
    return jsonify({
        "success": True, 
        "response": "Info Gathered", 
        "info": info
    }), 200

# @require_role("superadmin")
@superadmins_bp.route("/superadmin/create-admin", methods=["POST"])
def superadmin_create_admin():
    form = CreateAdminForm()

    if not form.validate_on_submit():
        return jsonify({
            "success": False,
            "response": "Create Unsuccessful",
            "errors": form.errors
        })

    email = form.email.data
    username = form.username.data
    password = form.password.data
    role = form.role.data

    if not exist_admin(email):
        insert_admin(email, username, password, role)
        return jsonify({"success": True, "response": "Create Successful"}), 200
    else:
        return jsonify({
            "success": False, 
            "response": "Email Already In Use"
        }), 400


# @require_role("superadmin")
@superadmins_bp.route("/superadmin/get-superadmin-id", methods=["GET"])
def get_superadmin_id():
    return jsonify({"current_admin_id": session["admin_id"]})

# @require_role("superadmin")
@superadmins_bp.route("/superadmin/edit-role", methods=["POST"])
def superadmin_edit_role():
    data = request.get_json()
    form = ChangeAdminRoleForm(data=data)

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Role Edit Unsuccessful",
            "errors": form.errors
        }), 400

    role = form.role.data
    id = form.id.data 

    if not select_admin(id):
        return jsonify({
            "success": False,
            "response": "Admin Nonexistent",
            "exists": False
        }), 400

    change_role_admin(role, id)

    admins = select_admins()
    return jsonify({
        "success": True, 
        "response": "Role Edit Successful", 
        "admin_id": id,
        "admins": admins
    }), 200

# @require_role("superadmin")
@superadmins_bp.route("/superadmin/edit-admin", methods=["POST"])
def superadmin_edit_admin():
    data = request.get_json()
    form = EditAdminForm(data=data)

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Edit Unsuccessful",
            "errors": form.errors
        }), 400

    id = form.id.data
    email = form.email.data
    username = form.username.data
    check_email = check_email_admin(id)
    check_username = check_username_admin(id)

    if not select_admin(id):
        return jsonify({
            "success": False,
            "response": "Admin Nonexistent",
            "exists": False
        }), 400

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

    update_admin(email, username, id)
    return jsonify({"success": True, "response": "Edit Successful"}), 200

# @require_role("superadmin")
@superadmins_bp.route("/superadmin/delete-admin", methods=["POST"])
def superadmin_delete_admin():
    data = request.get_json()
    form = CheckIDForm(data=data)    

    if not form.validate():
        return jsonify({
            "success": False,
            "response": "Delete Unsuccessful",
            "errors": form.errors
        })

    id = form.id.data

    if not select_admin(id):
        return jsonify({
            "success": False,
            "response": "Admin Nonexistent",
            "exists": False
        }), 400

    delete_account(id, "admin")
    return jsonify({"success": True, "response": "Delete Successful"}), 200