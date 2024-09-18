# Import the admin module from Django, which is used to manage models in the admin interface.
from django.contrib import admin

# making custom models available in the admin interface
from api import models as api_models


class PostAdmin(admin.ModelAdmin):
    """
    Define a custom admin class for the Post model.
    Automatically fill the 'slug' field based on the 'title' field in the admin interface.
    """
    prepopulated_fields = {"slug": ["title"]}


# Registering the models in the admin interface.
admin.site.register(api_models.User)
admin.site.register(api_models.Profile)

admin.site.register(api_models.Category)
admin.site.register(api_models.Post, PostAdmin)
admin.site.register(api_models.Comment)
admin.site.register(api_models.Bookmark)
admin.site.register(api_models.Notification)
