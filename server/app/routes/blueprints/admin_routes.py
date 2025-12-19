from flask import Blueprint, jsonify
from server.app.models.seniors import total_seniors, total_unverified_seniors, total_verified_seniors

admins_bp = Blueprint("superadmins", __name__)

# @require_role("admin", "superadmin")
@admins_bp.route("/admin/dashboard", methods=["GET"])
def superadmin_dashboard():
    info = {}
    senior_accounts = total_seniors()
    verified_seniors = total_verified_seniors()
    unverified_seniors = total_unverified_seniors()
    info.update({
        "senior_accounts": senior_accounts,
        "verified_seniors": verified_seniors,
        "unverified_seniors": unverified_seniors
        })
    return jsonify({
        "success": True, 
        "response": "Info Gathered", 
        "info": info
    }), 200