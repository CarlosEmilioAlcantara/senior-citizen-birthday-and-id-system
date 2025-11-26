from flask_session import Session
from flask_wtf.csrf import CSRFProtect
csrf = CSRFProtect()
sess = Session()