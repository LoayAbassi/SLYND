# GENERAL

make sure u have python installed

pip3 install pipenv

django-admin // will show all possible commands to use with it

python manage.py startapp playground // starts another project
PS : you need to add it to settings.py

use the venv interpretor (ctrp shift p)

# views

playground/views.py
handles requests

# urls

comments in storefront/urls.py

# templates

create a new folder templates
using the render function in views.py
return render(request,'hello.html',parameters)
--- parameters must be a dictionary
--- in the html file put variables names between {{}}

conditions are possible in html file "./playground/templates/hello.html"

# debugging django app

when wanna see possible bugs in functions use the step into
f11 to step in
shoft f11 to step out

# django debug toolbar

1. pipenv install django-debug-toolbar
2. add debug_toolbar to settings.py
3. add the path the URLConf file (storefront/urls.py)
   'path('**debug**',include(debug_toolbar.urls))'
   > > don't forget to import debug_toolbar :)
4. add middleware to the settings module
   "debug_toolbar.middleware.DebugToolbarMiddleware"

5. configure internal IPs
   (
   INTERNAL_IPS = [
   # ...
   "127.0.0.1",
   # ...
   ]
   )
   > > paste inside the settings too XD

# setting up django admin

1. add jazzmin to installed apps in settings
   // makes admin panel look better
2. py manage.py migrate
3. py manage.py createsuperuser

# setting up user model

django have a default user model , to avoid conflicts u need to make sure u change the settings.py in order to define ur user model structure
"AUTH_USER_MODEL = 'api.User'"

when changing a database structure, make sure to make migrations buddy (delete the database, migration folder in case of error )
1. py .\manage.py makemigrations
2. py .\manage.py migrate

