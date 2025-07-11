from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(
        self,
        *,
        email,
        password=None,
        phone_number=None,
        user_type='organization',
        **extra_fields,
    ):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        extra_fields.setdefault('user_type', user_type)

        user = self.model(
            email=email,
            phone_number=phone_number,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        *,
        email,
        password=None,
        phone_number=None,
        **extra_fields,
    ):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(
            email=email,
            password=password,
            phone_number=phone_number,
            user_type='admin',  # Always force admin type
            **extra_fields,
        )


class User(AbstractBaseUser):
    ORGANIZATION = 'organization'
    CANDIDATE = 'candidate'
    ADMIN = 'admin'

    USER_TYPE_CHOICES = (
        (ORGANIZATION, 'Organization'),
        (CANDIDATE, 'Candidate'),
        (ADMIN, 'Admin'),
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Add phone number
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default=ORGANIZATION)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_staff

    def has_module_perms(self, app_label):
        return self.is_staff

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_profile')
    name = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
# models.py
class Project(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField()
    chainage_km = models.DecimalField(max_digits=10, decimal_places=2)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    
class Candidate(models.Model):
    MALE = 'male'
    FEMALE = 'female'

    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="candidate")
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")])
    date_of_birth = models.DateField()
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE, related_name="candidates")

    def __str__(self):
        return self.user.email





class CandidateProject(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_REJECTED = 'rejected'

    JOINING_STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACCEPTED, 'Accepted'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="myprojects")
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="candidates")
    role = models.CharField(max_length=100)
    joined_at = models.DateTimeField(auto_now_add=True)
    joining_status = models.CharField(
        max_length=10,
        choices=JOINING_STATUS_CHOICES,
        default=STATUS_PENDING,
    )

    def __str__(self):
        return f"{self.candidate.user.email} in {self.project.name} as {self.role} ({self.joining_status})"