from flask import Blueprint, current_app, send_from_directory

files_bp = Blueprint("files", __name__)

@files_bp.route('/app/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

@files_bp.route('/temp/<path:filename>')
def serve_temp(filename):
    return send_from_directory(current_app.config["TEMP_FOLDER"], filename)