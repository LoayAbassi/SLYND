# SETTING UP ENVIRONMENT
make sure u have python installed

python -m venv Name // creates a virtual environement

venv/scripts/activate // activates the virtual environment

pip install django==4.2 //4.2 is the version

pip freeze > requirements.txt // creates a file with already installed packages (can be modified based on need)

pip install -r requirements.txt // installing all resquirements specified in the file 

django-admin startproject backend . // creates a folder inside the current directory 

py manage.py runserver // port 8000 defaulted(u can specify)
