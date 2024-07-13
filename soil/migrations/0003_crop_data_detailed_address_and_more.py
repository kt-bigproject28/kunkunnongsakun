# Generated by Django 5.0.6 on 2024-07-12 08:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("soil", "0002_rename_chatbot_crop_data"),
    ]

    operations = [
        migrations.AddField(
            model_name="crop_data",
            name="detailed_address",
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="crop_data",
            name="session_id",
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
    ]