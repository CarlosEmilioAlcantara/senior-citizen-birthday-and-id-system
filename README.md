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

   DB_HOST=hostname
   DB_USER=username
   DB_PASSWORD=password
   DB_DATABASE=database_name

   ID_FOLDER=id_pictures_folder
   SIGNATURE_FOLDER=senior_signatures_folder
   UPLOAD_FOLDER=uploads_folder
   TEMP_FOLDER=temp_folder
   TEMPLATE_FILE_FRONT=id_card_template_file_front
   TEMPLATE_FILE_BACK=id_card_template_file_back

   SESSION_LIFETIME_DAYS=session_lifetime

   LIMITER_DAY_LIMIT=requests_limit_per_day
   LIMITER_HOUR_LIMIT=requests_limit_per_hour

   MAIL_SERVER=server_name
   MAIL_PORT=port
   MAIL_USERNAME=sender_email
   MAIL_PASSWORD=smtp_password
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

# Setting up the emailer
1. Change directory into the jobs server.
2. Setup python virtual environment:
   ```powershell
   mkdir venv
   python -m venv .\venv\
   .\venv\Scripts\activate
   pip install -r .\requirements.txt
   ```
3. Setup environment variables:
   ```powershell
   DB_HOST=hostname
   DB_USER=username
   DB_PASSWORD=password
   DB_DATABASE=database_name

   MAIL_SERVER=server_name
   MAIL_PORT=port
   MAIL_USERNAME=sender_email
   MAIL_PASSWORD=smtp_password
   ```
4. Edit the 'run-emailer-example.bat' file according to your system's file tree.
5. Run the batch file as task with Task Scheduler.