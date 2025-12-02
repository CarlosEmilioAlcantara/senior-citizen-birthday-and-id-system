from flask_wtf import FlaskForm
from wtforms import DateField, FileField, IntegerField, SelectField, StringField, EmailField, PasswordField
from wtforms.validators import DataRequired, Email, Regexp, EqualTo, NumberRange, AnyOf, Length, Optional
from .validators import optional_allowed_file, password_strength, allowed_file, path_allowed_file

class LoginForm(FlaskForm):
    class Meta:
        csrf = False

    # id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    email = EmailField("email", validators=[DataRequired(), Email()])
    password = PasswordField("password", validators=[DataRequired()])

class RegisterForm(FlaskForm):
    class Meta:
        csrf = False

    email = EmailField("email", validators=[DataRequired(), Email()])
    password = PasswordField(
        "password", 
        validators=[
            DataRequired(), password_strength
        ])
    confirm = PasswordField("confirm", validators=[EqualTo("password")])

class InfoForm(FlaskForm):
    class Meta:
        csrf = False

    email = EmailField("email", validators=[DataRequired(), Email()])
    password = PasswordField(
        "password", 
        validators=[
            DataRequired(), password_strength
        ])
    id_picture = FileField(
        "id_picture", 
        validators=[
            DataRequired(), allowed_file
        ])
    signature_picture = FileField(
        "signature_picture", 
        validators=[
            DataRequired(), allowed_file
        ])
    first_name = StringField(
        "first_name", 
        validators=[DataRequired()])
    middle_name = StringField(
        "middle_name", 
        validators=[DataRequired()])
    last_name = StringField(
        "last_name", 
        validators=[DataRequired()])
    house = StringField("house", validators=[DataRequired()])
    street = StringField("street", validators=[DataRequired()])
    barangay = SelectField(
        "barangay", 
        choices=[
            ("Addition Hills", "Addition Hills"),
            ("Balong-Bato", "Balong-Bato"),
            ("Batis", "Batis"),
            ("Corazon De Jesus", "Corazon De Jesus"),
            ("Ermitaño", "Ermitaño"),
            ("Halo-halo", "Halo-halo"),
            ("Isabelita", "Isabelita"),
            ("Kabayanan", "Kabayanan"),
            ("Little Baguio", "Little Baguio"),
            ("Maytunas", "Maytunas"),
            ("Onse", "Onse"),
            ("Pasadeña", "Pasadeña"),
            ("Pedro Cruz", "Pedro Cruz"),
            ("Progreso", "Progreso"),
            ("Rivera", "Rivera"),
            ("Salapan", "Salapan"),
            ("San Perfecto", "San Perfecto"),
            ("Santa Lucia", "Santa Lucia"),
            ("Tibagan", "Tibagan"),
            ("West Crame", "West Crame"),
            ("Greenhills", "Greenhills")
        ],
        validators=[DataRequired()]
        )
    subdivision = StringField("subdivision", validators=[Optional()])
    city = StringField("city", validators=[DataRequired()])
    province = StringField("province", validators=[DataRequired()])
    birthday = DateField("birthday", validators=[DataRequired()])
    age = IntegerField(
        "age", 
        validators=[
            DataRequired(), NumberRange(min=60, max=150)
        ])
    gender = SelectField(
        "gender", 
        choices=[("Male", "Male"), ("Female", "Female")],
        validators=[
            DataRequired(), AnyOf(["Male", "Female"])
        ])
    emergency_fname = StringField(
        "emergency_fname", 
        validators=[DataRequired()])
    emergency_mname = StringField(
        "emergency_mname", 
        validators=[DataRequired()])
    emergency_lname = StringField(
        "emergency_lname", 
        validators=[DataRequired()])
    emergency_number = StringField(
        "emergency_number", 
        validators=[
            DataRequired(),
            Length(min=1, max=13)
        ])
    
class UserEditForm(FlaskForm):
    email = EmailField("email", validators=[DataRequired(), Email()])
    id_picture = FileField(
        "id_picture", 
        validators=[
            Optional(), optional_allowed_file
        ])
    signature_picture = FileField(
        "signature_picture", 
        validators=[
            Optional(), optional_allowed_file
        ])
    first_name = StringField(
        "first_name", 
        validators=[DataRequired()])
    middle_name = StringField(
        "middle_name", 
        validators=[DataRequired()])
    last_name = StringField(
        "last_name", 
        validators=[DataRequired()])
    house = StringField("house", validators=[DataRequired()])
    street = StringField("street", validators=[DataRequired()])
    barangay = SelectField(
        "barangay", 
        choices=[
            ("Addition Hills", "Addition Hills"),
            ("Balong-Bato", "Balong-Bato"),
            ("Batis", "Batis"),
            ("Corazon De Jesus", "Corazon De Jesus"),
            ("Ermitaño", "Ermitaño"),
            ("Halo-halo", "Halo-halo"),
            ("Isabelita", "Isabelita"),
            ("Kabayanan", "Kabayanan"),
            ("Little Baguio", "Little Baguio"),
            ("Maytunas", "Maytunas"),
            ("Onse", "Onse"),
            ("Pasadeña", "Pasadeña"),
            ("Pedro Cruz", "Pedro Cruz"),
            ("Progreso", "Progreso"),
            ("Rivera", "Rivera"),
            ("Salapan", "Salapan"),
            ("San Perfecto", "San Perfecto"),
            ("Santa Lucia", "Santa Lucia"),
            ("Tibagan", "Tibagan"),
            ("West Crame", "West Crame"),
            ("Greenhills", "Greenhills")
        ],
        validators=[DataRequired()]
        )
    subdivision = StringField("subdivision", validators=[Optional()])
    city = StringField("city", validators=[DataRequired()])
    province = StringField("province", validators=[DataRequired()])
    birthday = DateField("birthday", validators=[DataRequired()])
    age = IntegerField(
        "age", 
        validators=[
            DataRequired(), NumberRange(min=60, max=150)
        ])
    gender = SelectField(
        "gender", 
        choices=[("Male", "Male"), ("Female", "Female")],
        validators=[
            DataRequired(), AnyOf(["Male", "Female"])
        ])
    emergency_fname = StringField(
        "emergency_fname", 
        validators=[DataRequired()])
    emergency_mname = StringField(
        "emergency_mname", 
        validators=[DataRequired()])
    emergency_lname = StringField(
        "emergency_lname", 
        validators=[DataRequired()])
    emergency_number = StringField(
        "emergency_number", 
        validators=[
            DataRequired(),
            Length(min=1, max=13)
        ])

class ChangePasswordForm(FlaskForm):
    old_password = PasswordField("old_password", validators=[DataRequired()])
    password = PasswordField(
        "password", 
        validators=[DataRequired(), password_strength])
    confirm = PasswordField("confirm", validators=[EqualTo("password")])

class DeleteAccountForm(FlaskForm):
    password = PasswordField("password", validators=[DataRequired()])
    confirm = PasswordField("confirm", validators=[EqualTo("password")])

class AdminLoginForm(FlaskForm):
    class Meta:
        csrf = False
    email_or_username = StringField(
        "email_or_username", 
        validators=[DataRequired()])
    password = PasswordField("password", validators=[DataRequired()])

class AdminEditForm(FlaskForm):
    email = EmailField("email", validators=[DataRequired(), Email()])
    username = StringField(
        "username", 
        validators=[
            DataRequired(),
            Regexp(r'\S+')
        ])
    password = PasswordField(
        "password", 
        validators=[
            Optional(),
            password_strength,
        ])
    confirm = PasswordField("confirm", validators=[EqualTo("password")])

class CreateAdminForm(FlaskForm):
    email = EmailField("email", validators=[DataRequired(), Email()])
    username = StringField(
        "username", 
        validators=[DataRequired(), Regexp(r'\S+')])
    password = PasswordField(
        "password", 
        validators=[DataRequired(), password_strength])
    confirm = PasswordField("confirm", validators=[EqualTo("password")])
    role = SelectField(
        "role", 
        choices=[("admin", "admin"), ("superadmin", "superadmin")],
        validators=[
            DataRequired(),
            AnyOf(["admin", "superadmin"])
        ])

class ChangeAdminRoleForm(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    role = SelectField(
        "role", 
        choices=[("admin", "admin"), ("superadmin", "superadmin")],
        validators=[
            DataRequired(),
            AnyOf(["admin", "superadmin"])
        ])

class EditAdminForm(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    email = EmailField("email", validators=[DataRequired(), Email()])
    username = StringField(
        "username", 
        validators=[
            DataRequired(),
            Regexp(r'\S+')
        ])

class CheckIDForm(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])

# class SearchAdminForm(FlaskForm):
#     email_or_username = StringField(
#         "email_or_username", 
#         validators=[DataRequired()])
#     filter = SelectField(
#         "filter", 
#         validators=[
#             DataRequired(),
#             AnyOf(["All", "admin", "superadmin"])
#         ])

# class FilterAdminForm(FlaskForm):
#     email_or_username = StringField(
#         "email_or_username", 
#         validators=[Optional()])
#     filter = SelectField(
#         "filter", 
#         validators=[
#             DataRequired(),
#             AnyOf(["All", "admin", "superadmin"])
#         ])

class ChangeVerification(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    email = EmailField("email", validators=[DataRequired(), Email()])
    verification = SelectField(
        "verification", 
        choices=[("Verified", "Verified"), ("Unverified", "Unverified")],
        validators=[
            DataRequired(),
            AnyOf(["Verified", "Unverified"])
        ])

class AdminEditUserForm(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    email = EmailField("email", validators=[DataRequired(), Email()])
    id_picture = FileField(
        "id_picture", 
        validators=[
            Optional(), optional_allowed_file
        ])
    signature_picture = FileField(
        "signature_picture", 
        validators=[
            Optional(), optional_allowed_file
        ])
    first_name = StringField(
        "first_name", 
        validators=[DataRequired()])
    middle_name = StringField(
        "middle_name", 
        validators=[DataRequired()])
    last_name = StringField(
        "last_name", 
        validators=[DataRequired()])
    house = StringField("house", validators=[DataRequired()])
    street = StringField("street", validators=[DataRequired()])
    barangay = SelectField(
        "barangay", 
        choices=[
            ("Addition Hills", "Addition Hills"),
            ("Balong-Bato", "Balong-Bato"),
            ("Batis", "Batis"),
            ("Corazon De Jesus", "Corazon De Jesus"),
            ("Ermitaño", "Ermitaño"),
            ("Halo-halo", "Halo-halo"),
            ("Isabelita", "Isabelita"),
            ("Kabayanan", "Kabayanan"),
            ("Little Baguio", "Little Baguio"),
            ("Maytunas", "Maytunas"),
            ("Onse", "Onse"),
            ("Pasadeña", "Pasadeña"),
            ("Pedro Cruz", "Pedro Cruz"),
            ("Progreso", "Progreso"),
            ("Rivera", "Rivera"),
            ("Salapan", "Salapan"),
            ("San Perfecto", "San Perfecto"),
            ("Santa Lucia", "Santa Lucia"),
            ("Tibagan", "Tibagan"),
            ("West Crame", "West Crame"),
            ("Greenhills", "Greenhills")
        ],
        validators=[DataRequired()]
        )
    subdivision = StringField("subdivision", validators=[Optional()])
    city = StringField("city", validators=[DataRequired()])
    province = StringField("province", validators=[DataRequired()])
    birthday = DateField("birthday", validators=[DataRequired()])
    age = IntegerField(
        "age", 
        validators=[
            DataRequired(), NumberRange(min=60, max=150)
        ])
    gender = SelectField(
        "gender", 
        choices=[("Male", "Male"), ("Female", "Female")],
        validators=[
            DataRequired(), AnyOf(["Male", "Female"])
        ])
    emergency_fname = StringField(
        "emergency_fname", 
        validators=[DataRequired()])
    emergency_mname = StringField(
        "emergency_mname", 
        validators=[DataRequired()])
    emergency_lname = StringField(
        "emergency_lname", 
        validators=[DataRequired()])
    emergency_number = StringField(
        "emergency_number", 
        validators=[
            DataRequired(),
            Length(min=1, max=13)
        ])

class PrintIDValidator(FlaskForm):
    id = IntegerField("id", validators=[DataRequired(), NumberRange(min=1)])
    email = EmailField("email", validators=[DataRequired(), Email()])
    id_picture = FileField(
        "id_picture", 
        validators=[
            DataRequired(), path_allowed_file
        ])
    signature_picture = FileField(
        "signature_picture", 
        validators=[
            DataRequired(), path_allowed_file
        ])
    first_name = StringField(
        "first_name", 
        validators=[DataRequired()])
    middle_name = StringField(
        "middle_name", 
        validators=[DataRequired()])
    last_name = StringField(
        "last_name", 
        validators=[DataRequired()])
    house = StringField("house", validators=[DataRequired()])
    street = StringField("street", validators=[DataRequired()])
    barangay = StringField(
        "barangay", 
        validators=[
            DataRequired(),
            AnyOf(["Addition Hills", "Balong-Bato", "Batis", 
                   "Corazon De Jesus", "Ermitaño", "Halo-halo",
                   "Isabelita", "Kabayanan", "Little Baguio",
                   "Maytunas", "Onse", "Pasadeña", "Pedro Cruz",
                   "Progreso", "Rivera", "Salapan", "San Perfecto",
                   "Santa Lucia", "Tibagan", "West Crame", "Greenhills"
                ])]
        )
    subdivision = StringField("subdivision", validators=[Optional()])
    city = StringField("city", validators=[DataRequired()])
    province = StringField("province", validators=[DataRequired()])
    birthday = DateField("birthday", validators=[DataRequired()])
    age = IntegerField(
        "age", 
        validators=[
            DataRequired(), NumberRange(min=60, max=150)
        ])
    gender = SelectField(
        "gender", 
        choices=[("Male", "Male"), ("Female", "Female")],
        validators=[
            DataRequired(), AnyOf(["Male", "Female"])
        ])
    emergency_fname = StringField(
        "emergency_fname", 
        validators=[DataRequired()])
    emergency_mname = StringField(
        "emergency_mname", 
        validators=[DataRequired()])
    emergency_lname = StringField(
        "emergency_lname", 
        validators=[DataRequired()])
    emergency_number = StringField(
        "emergency_number", 
        validators=[
            DataRequired(),
            Length(min=1, max=13)
        ])

class DownloadIDValidator(FlaskForm):
    first_name = StringField("first_name", validators=[DataRequired()])
    middle_name = StringField("middle_name", validators=[DataRequired()])
    last_name = StringField("last_name", validators=[DataRequired()])