from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings  # ✅ Use this to get the custom User model

from .models import OrganizationProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_organization_profile(sender, instance, created, **kwargs):
    if created and instance.user_type == 'organization':
        OrganizationProfile.objects.create(user=instance)
