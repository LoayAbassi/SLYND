from django.contrib import admin

# making custom models available in the admin interface
from api import models as api_models
admin.site.register(api_models.User)
admin.site.register(api_models.Profile)


