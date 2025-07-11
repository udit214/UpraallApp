from rest_framework import serializers
from .models import Project,Candidate
from rest_framework import serializers
from .models import User
from .models import Candidate,  CandidateProject


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'organization', 'name', 'description', 'chainage_km', 'is_verified', 'created_at']
        read_only_fields = ['is_verified', 'created_at']


# serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Candidate

User = get_user_model()


from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .models import Candidate, Organization
from authapp.models import User  # Adjust if your user model is in a different app
from ProfileApp.models import CandidateProfile

class CandidateCreateSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    gender = serializers.ChoiceField(choices=Candidate.GENDER_CHOICES)

    def create(self, validated_data):
        request = self.context['request']
        organization_user = request.user

        # 1. Verify user is an organization
        if organization_user.user_type != User.ORGANIZATION:
            raise serializers.ValidationError("Only organizations can create candidates.")

        # 2. Check for duplicate email
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        # 3. Get organization instance linked to the current user
        try:
            organization = Organization.objects.get(user=organization_user)
        except Organization.DoesNotExist:
            raise serializers.ValidationError("No organization profile found for this user.")

        # 4. Generate a random password
        genpassword = get_random_string(length=8)

        # 5. Create the user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=genpassword,
            user_type=User.CANDIDATE,
            phone_number=validated_data['phone'],
        )

        # 6. Create the candidate and link to organization
        candidate = Candidate.objects.create(
            user=user,
            gender=validated_data['gender'],
            date_of_birth="2000-01-01",  # Placeholder since you're not collecting it yet
            organization=organization,
        )

        Candidatepf = CandidateProfile.objects.create(
            candidate = candidate,
            username = validated_data['username']

        )

        org_obj = Organization.objects.get(user = request.user)
        send_mail(
            subject='Welcome to Upraall – Your Account Has Been Created',
            message=f'''
            Dear {user},

We are pleased to inform you that your Upraall account has been successfully created by {org_obj.org_profile}.

You can now log in to the Upraall platform using the credentials below:

Email: {user.email}  
🔒Temporary Password: {genpassword}

🔒 Please change your password after logging in for the first time to ensure the security of your account.

If you have any questions or need support, feel free to contact your organization representative or our support team.

Welcome aboard!

Best regards,  
The Upraall Team  
https://www.upraall.com  


''',
            from_email=None,  # Uses DEFAULT_FROM_EMAIL
            recipient_list=[user.email],
            fail_silently=False,
)
        return candidate




# serializers.py
from rest_framework import serializers
from .models import Candidate

class CandidateListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone_number')

    class Meta:
        model = Candidate
        fields = ['id', 'email', 'phone', 'gender', 'date_of_birth']

class CandidateProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='candidate.user.email')

    class Meta:
        model = CandidateProfile
        fields = ['id', 'username', 'email', 'bio', 'website', 'profile_picture', 'phone']

    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url)
        return request.build_absolute_uri('/media/defaults/deafaultpic1.jpg')

class RequestedCandidateSerializer(serializers.ModelSerializer):
    profile = CandidateProfileSerializer(source='candidate.profile')

    class Meta:
        model = CandidateProject
        fields = ['id', 'profile', 'role', 'joining_status', 'joined_at']