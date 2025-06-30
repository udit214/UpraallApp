from django.db import models


from django.db import models
from django.conf import settings
from authapp.models import Project 
from django.contrib.auth.models import User

class PAndPDocument(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='pandp_documents/')
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='pandp_documents'
    )

    def __str__(self):
        return f"{self.title} ({self.project.name})"

class CosRecords(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='cos_records/')
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_cos_documents'
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='cos_records'
    )

    def __str__(self):
        return f"{self.title} ({self.project.name})"
    

class NCR(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ncrs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, help_text="e.g., Chainage 45+600")
    image = models.ImageField(upload_to='ncr_images/', blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"NCR #{self.id} - {self.title}"