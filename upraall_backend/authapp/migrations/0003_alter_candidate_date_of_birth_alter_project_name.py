# Generated by Django 5.1.5 on 2025-05-13 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0002_alter_project_organization_alter_user_managers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='date_of_birth',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]
