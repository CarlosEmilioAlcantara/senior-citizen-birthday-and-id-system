# Install Guide
1. Change directory into the python server.
2. Setup python virtual environment:
  ```powershell
  mkdir venv
  python -m venv .\venv\
  .\venv\Scripts\activate
  pip install -r .\requirements.txt
  ```
3. Setup environment variables, .env and .flaskenv. The necessary variables are:
- .env
   ```python
   SECRET_KEY=your_secret_key
   ID_FOLDER=your_id_folder
   SIGNATURE_FOLDER=your_signature_folder
   UPLOAD_FOLDER=your_upload_folder
   TEMP_FOLDER=your_temp_folder
   SESSION_LIFETIME_DAYS=how_long_a_session_lasts
   LIMITER_DAY_LIMIT=request_limit_per_day
   LIMITER_HOUR_LIMIT=request_limit_per_hour
   ```
- .flaskenv
  ```python
  FLASK_APP=your_flask_app
  ```
Note that default folders and flask app name are provided but you may change this if you want.
4. Change directory into the react client.
5. Setup react client:
   ```powershell
   npm install
   ```
5. Run the server:
   ```python
   flask run --debug
   ```
6. Run the client:
   ```powershell
   npm start
   ```