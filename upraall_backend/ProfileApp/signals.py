from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings  # ✅ Use this to get the custom User model
from authapp.models import Organization , Candidate 
from .models import OrganizationProfile, CandidateProfile



@receiver(post_save, sender=Organization)
def create_organization_profile(sender, instance, created, **kwargs):
    if created:
        if not OrganizationProfile.objects.filter(organization=instance).exists():
            
            OrganizationProfile.objects.create(
                organization=instance,
                company_name=instance.name,
                phone=instance.phone_number
            )


@receiver(post_save, sender=Candidate)
def create_candidate_profile(sender, instance, created, **kwargs):
    if created:
        CandidateProfile.objects.create(candidate=instance)