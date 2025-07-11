from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Organization ,Project,Candidate 
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.authtoken.models import Token
from ProfileApp.models import CandidateProfile


@receiver(post_save, sender=Organization)
def send_verification_email(sender, instance, created, **kwargs):
    if not created and instance.is_verified:
        subject = "Your Upraall Organization Account is Now Verified"
        message = f"""
Dear {instance.name},

Congratulations! Your organization account has been verified by the Upraall team.

You can now log in and start managing your projects.

Login here: http://10.0.2.2:8000/org-login

If you have any questions, feel free to contact support.

Best regards,  
Upraall Team
        """
        send_mail(
            subject,
            message,
            "uditkhare214@gmail.com",
            [instance.user.email],     # ✅ Access email from related user
            fail_silently=False,
        )
@receiver(post_save , sender=Project)
def send_project_verified_email(sender , instance , created , **kwargs):

    if not created and instance.is_verified:
        org = instance.organization.user.email
        print(org , '-------------------')
       
        subject = "Congratulations – Your Project Has Been Verified on Upraall"
        message = f"""
Dear {instance.organization.user},



We are pleased to inform you that your project {instance.name} has been successfully verified by the Upraall team.

You can now access the project management panel through your dashboard, where you will be able to manage records, upload relevant documents, and collaborate effectively with your team and stakeholders.

We’re excited to support your work and look forward to seeing the progress on your project. If you require any assistance or have questions about using the management panel, please don’t hesitate to contact our support team at [support email/contact number].

Once again, congratulations and welcome to a seamless project management experience with Upraall.

Warm regards,
Team Upraall
        """
        send_mail(
            subject,
            message,
            "uditkhare214@gmail.com",
            [org],     # ✅ Access email from related user
            fail_silently=False,
        )

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)





# @receiver(post_save, sender=Candidate)
# def create_candidate_profile(sender, instance, created, **kwargs):
#     if created:
#         CandidateProfile.objects.create(candidate=instance)