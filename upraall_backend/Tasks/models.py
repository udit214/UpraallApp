from django.db import models
from authapp.models import Organization,Project,Candidate
# Create your models here.


class Task(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('closed', 'Closed'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='tasks')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    document = models.FileField(upload_to='task_creation_documents/', null=True, blank=True)
    assigned_to = models.ManyToManyField(Candidate, related_name='assigned_tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 🔽 Updated here
    completion_note = models.TextField(blank=True, null=True)
    completion_doc = models.FileField(upload_to='task_completion_doc/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.organization.name})"
