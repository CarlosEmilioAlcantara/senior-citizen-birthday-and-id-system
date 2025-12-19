from app.routes.blueprints.admin_routes import admin_bp
from app.routes.blueprints.admins_routes import admins_bp
from app.routes.blueprints.auth_routes import auth_bp
from app.routes.blueprints.error_routes import errors_bp
from app.routes.blueprints.file_routes import files_bp
from app.routes.blueprints.superadmin_routes import superadmins_bp
from app.routes.blueprints.user_routes import users_bp

def register_routes(app):
    app.register_blueprint(files_bp)
    app.register_blueprint(errors_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admins_bp)
    app.register_blueprint(superadmins_bp)