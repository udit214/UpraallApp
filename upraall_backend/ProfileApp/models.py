from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class OrganizationProfile(models.Model):
    profile_name = models.CharField(max_length=100 , blank=True , null=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='org_profile')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='org_logos/', blank=True, null=True , default='defaults/deafaultpic1.jpg')
    website = models.URLField(blank=True, null=True)


    def __str__(self):
        return f"Profile for {self.user.email}"
