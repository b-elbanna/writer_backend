# Generated by Django 5.1 on 2025-05-24 20:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('QA_box', '0001_initial'),
        ('ai_writing_tools', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='qabox',
            name='project',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='qaBox', to='ai_writing_tools.project'),
        ),
        migrations.AddField(
            model_name='qabox',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='qaBoxes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='qamessage',
            name='qaBox',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='qamessages', to='QA_box.qabox'),
        ),
        migrations.AddField(
            model_name='qamessage',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='qamessages', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='resource',
            name='projects',
            field=models.ManyToManyField(related_name='resources', to='ai_writing_tools.project'),
        ),
        migrations.AddField(
            model_name='resource',
            name='qaBoxes',
            field=models.ManyToManyField(related_name='resources', to='QA_box.qabox'),
        ),
        migrations.AddField(
            model_name='resource',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='resources', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='qamessage',
            name='resource',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='QA_box.resource'),
        ),
        migrations.AddField(
            model_name='uploadedfile',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploadedFiles', to=settings.AUTH_USER_MODEL),
        ),
    ]
