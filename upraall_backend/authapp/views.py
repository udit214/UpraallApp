from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.core.mail import send_mail
from .models import User, Organization , Project
from django.contrib.auth import login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .serializers import ProjectSerializer
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.permissions import BasePermission
from rest_framework import status
from rest_framework.views import APIView
@csrf_exempt
def organization_signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)

        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            user_type='organization',
            phone_number=data.get('contact'),
        )
        org = Organization.objects.create(user=user, name=data['organization_name'])
        send_mail(
    subject='Upraall Signup Request Received',
    message=f'''Dear {data['organization_name']},

Thank you for signing up with Upraall.

We have received your account creation request and it is currently under review by our team. You will receive a confirmation email once your account has been verified and approved.

In the meantime, if you have any questions or need further assistance, feel free to contact us at support@upraall.com.

We appreciate your interest in Upraall and look forward to working with you.

Best regards,  
Team Upraall  
''',
    from_email=None,  # Uses DEFAULT_FROM_EMAIL
    recipient_list=[data['email']],
    fail_silently=False,
)
        return JsonResponse({'message': 'Organization registered successfully'}, status=201)

@csrf_exempt
def organization_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if hasattr(user, 'organization_profile') and user.organization_profile.is_verified:
                login(request, user)

                # Get or create token for the user
                token, created = Token.objects.get_or_create(user=user)

                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'token': token.key,
                    'user_id': user.id,
                    'email': user.email
                })
            else:
                return JsonResponse({'success': False, 'message': 'Account not verified by Upraall yet.'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'})


class IsOrganization(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'organization')
    
# class ApplyProjectView(generics.CreateAPIView):
#     serializer_class = ProjectSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(organization=self.request.user.organization)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_dashboard(request):
    user = request.user

    if not hasattr(user, 'organization_profile'):
        return Response({"detail": "Not an organization"}, status=403)

    organization = user.organization_profile
    ongoing_projects = Project.objects.filter(organization = organization ,is_verified = True )
    print(ongoing_projects , 'ongoing projects are here ===========')

    applied_projects = Project.objects.filter(organization = organization , is_verified = False)
    print(applied_projects)

    ongoing_data = ProjectSerializer(ongoing_projects, many=True).data
    applied_data = ProjectSerializer(applied_projects, many=True).data

    return Response({
        'ongoing': ongoing_data,
        'applied': applied_data,
        'completed': [],
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    user = request.user

    if not hasattr(user, 'organization_profile'):
        return Response({"detail": "Only organizations can create projects"}, status=status.HTTP_403_FORBIDDEN)

    org = user.organization_profile

    name = request.data.get('name')
    description = request.data.get('description')
    chainage_km = request.data.get('chainage_km')

    if not all([name, description, chainage_km]):
        return Response({"detail": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        
        project = Project.objects.create(
            organization=org,
            name=name,
            description=description,
            chainage_km=chainage_km
        )
        print(request.user)
        send_mail(subject='Acknowledgment of Project Application – Upraall',
              message=f'''Dear {org},

    Thank you for submitting your project application on Upraall. We are pleased to inform you that we have received your request successfully.

    Our team is currently reviewing the details provided. Once the verification process is complete, the management panel for your project will be activated and accessible within your dashboard. You will be notified as soon as the project is approved and ready for further action.

    If you have any questions or need to provide additional information during the verification process, please feel free to reach out to us at [support email/contact number].

    We appreciate your patience and look forward to supporting your project through Upraall.

    Warm regards,
    Team Upraall''',
        from_email=None,  # Uses DEFAULT_FROM_EMAIL
        recipient_list=[request.user],
        fail_silently=False,
              )
        print('mail sent')
        return Response({"detail": "Project created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class CreateCandidateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateCandidateSerializer(data=request.data)
        if serializer.is_valid():
            candidate = serializer.save()
            return Response({"message": "Candidate created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)