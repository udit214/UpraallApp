from rest_framework import serializers
from .models import OrganizationProfile, CandidateProfile

class OrganizationProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='organization.user.email', read_only=True)
    class Meta:
        model = OrganizationProfile
        fields = '__all__'
        read_only_fields = ['organization']

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = '__all__'
        read_only_fields = ['candidate']
        
        def get_profile_picture(self, obj):
            request = self.context.get('request')
            if obj.profile_picture:
                return request.build_absolute_uri(obj.profile_picture.url)
            return request.build_absolute_uri('/media/defaults/deafaultpic1.jpg')