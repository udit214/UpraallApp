from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from authapp.models import Candidate , Organization

class OrganizationProfile(models.Model):
    company_name = models.CharField(max_length=100 , blank=True , null=True)
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='org_profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='org_logos/', blank=True, null=True , default='defaults/deafaultpic1.jpg')
    website = models.URLField(blank=True, null=True)


    def __str__(self):
        return f" {self.company_name}"


class CandidateProfile(models.Model):
    candidate = models.OneToOneField(Candidate, on_delete=models.CASCADE, related_name="profile")
    username = models.CharField(max_length=30 , blank=True , null=True)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    profile_picture = models.ImageField(upload_to="candidate_profiles/", blank=True, null=True , default='defaults/deafaultpic1.jpg')
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.candidate.user.email}'s Profile"