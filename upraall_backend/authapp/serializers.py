from rest_framework import serializers
from .models import Project,Candidate
from rest_framework import serializers
from .models import User
from .models import Candidate, CandidateProfile, CandidateProject


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'organization', 'name', 'description', 'chainage_km', 'is_verified', 'created_at']
        read_only_fields = ['is_verified', 'created_at']


class CreateCandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.email')
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(source='user.phone_number')
    gender = serializers.ChoiceField(choices=Candidate.GENDER_CHOICES)

    class Meta:
        model = Candidate
        fields = ['username', 'password', 'phone', 'gender']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            email=user_data['email'],
            phone_number=user_data.get('phone_number'),
            user_type=User.CANDIDATE,
            password=password
        )
        candidate = Candidate.objects.create(user=user, **validated_data)
        return candidate