# Generated by Django 4.2 on 2024-09-08 15:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_category_alter_profile_image_post_notification_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='comments',
            new_name='Comment',
        ),
        migrations.AlterModelOptions(
            name='notification',
            options={'ordering': ['-date'], 'verbose_name_plural': 'Notification'},
        ),
    ]
