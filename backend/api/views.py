# django
from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum, Count
# Restframework
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
# api
from api import serializer as api_serializer
from api import models as api_models
# other packages
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
import json
import random


class MyTokenObtainPairView(TokenObtainPairView):
    """Custom Token View to include additional user information in the token"""
    serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """API view to register a new user"""

    queryset = api_models.User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """API view to retrieve or update user profile"""

    permission_classes = [AllowAny]
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        """Retrieve profile based on user ID"""

        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
        Profile = api_models.Profile.objects.get(user=user)
        return Profile


class CategoryListAPIView(generics.ListAPIView):
    """API view to list all categories"""

    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return all categories"""

        return api_models.Category.objects.all()


class PostCategoryListAPIView(generics.ListAPIView):
    """API view to list posts by category slug"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return posts filtered by category slug"""

        category_slug = self.kwargs["category_slug"]
        category = api_models.Category.objects.get(slug=category_slug)
        posts = api_models.Post.objects.filter(
            category=category, status="Active")
        return posts


class PostListAPIView(generics.ListAPIView):
    """API view to list all active posts"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return all active posts"""
        return api_models.Post.objects.filter(status="Active")


class PostDetailAPIView(generics.RetrieveAPIView):
    """API view to retrieve a single active post and increment its view count"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """Retrieve post based on slug and increment view count"""

        slug = self.kwargs['slug']
        post = api_models.Post.objects.get(slug=slug, status="Active")
        post.view = post.view + 1
        post.save()

        return post


class LikesPostAPIView(APIView):
    """API view to like or dislike a post"""

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        """Like or dislike a post based on user and post IDs"""

        user_id = request.data['user_id']
        post_id = request.data['post_id']
        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"message": "Post disliked"}, status=status.HTTP_200_OK)

        else:
            post.likes.add(user)
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Like"
            )
            return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)


class PostCommentAPIView(APIView):
    """API view to add a comment to a post"""

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),

            },
        ),
    )
    def post(self, request):
        """Add a comment to a post and notify the post owner"""

        post_id = request.data["post_id"]
        name = request.data["name"]
        email = request.data["email"]
        comment = request.data["comment"]
        post = api_models.Post.objects.get(id=post_id)
        api_models.Comment.objects.create(
            post=post,
            name=name,
            email=email,
            comment=comment
        )

        api_models.Notification.objects.create(
            user=post.user,
            post=post,
            type="Comment"
        )
        return Response({"message": "Comment uploaded"}, status=status.HTTP_201_CREATED)


class BookmarkPostAPIView(APIView):
    """API view to bookmark or remove bookmark from a post"""
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        """Bookmark or remove bookmark from a post"""
        user_id = request.data["user_id"]
        post_id = request.data["post_id"]
        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(post=post, user=user)
        if bookmark:
            bookmark.delete()
            return Response({"message": "Bookmark removed"}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(
                post=post,
                user=user
            )

            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Bookmark"
            )

            return Response({"message": "Post bookmarked"}, status=status.HTTP_201_CREATED)


class DashboardStats(generics.ListAPIView):
    """API view to get dashboard statistics for a user"""
    serializer_class = api_serializer.AuthorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Calculate and return dashboard statistics"""

        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        views = api_models.Post.objects.filter(
            user=user).aggregate(view=Sum("view"))["view"]
        posts = api_models.Post.objects.filter(user=user).count()
        likes = api_models.Post.objects.filter(
            user=user).aggregate(like=Count("likes"))["like"]
        bookmarks = api_models.Bookmark.objects.filter(post__user=user).count()

        return [{
            "views": views,
            "posts": posts,
            "likes": likes,
            "bookmarks": bookmarks,
        }]

    def list(self, *args, **kwargs):
        """Return the serialized dashboard statistics"""

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DashboardPostLists(generics.ListAPIView):
    """API view to list all posts created by a user"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return posts created by the user"""

        user_id = self.kwargs["user_id"]
        user = api_models.User.objects.get(id=user_id)
        return api_models.Post.objects.filter(user=user).order_by("-id")


class DashboardCommentList(generics.ListAPIView):
    """API view to list all comments made by a user"""

    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return comments for posts created by the user"""

        user_id = self.kwargs["user_id"]
        user = api_models.User.objects.get(id=user_id)
        return api_models.Comment.objects.filter(post__user=user)


class DashboardNotificationList(generics.ListAPIView):
    """API view to list all notifications for a user"""

    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return unseen notifications for the user"""

        user_id = self.kwargs["user_id"]
        user = api_models.User.objects.get(id=user_id)

        return api_models.Notification.objects.filter(seen=False, user=user)


class DashboardMarkNotificationsAsSeen(APIView):
    """API view to mark a notification as seen"""

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'notification_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        """Mark notification as seen"""

        notification_id = request.data["notification_id"]
        notification = api_models.Notification.objects.get(id=notification_id)
        notification.seen = True
        notification.save()
        return Response({"message": "Notification marked seen"}, status=status.HTTP_200_OK)


class DashboardReplyCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'reply': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        comment_id = request.data["comment_id"]
        reply = request.data["reply"]

        comment = api_models.Comment.objects.get(id=comment_id)
        comment.reply = reply
        comment.save()
        return Response({"message": "reply added"}, status=status.HTTP_201_CREATED)


class DashboardPostCreateAPIView(generics.CreateAPIView):
    """API view to create a new post"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Create a new post"""
        user_id = request.data.get("user_id")
        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        tags = request.data.get("tags")
        category_id = request.data.get("category_id")
        post_status = request.data.get("post_status")
        print("User ID:", user_id)
        print("Category ID:", category_id)

        user = api_models.User.objects.get(id=user_id)
        category = api_models.Category.objects.get(id=category_id)

        post_instance = api_models.Post(
            user=user,
            title=title,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status,
        )
        post_instance.save()
        return Response({"message": "post created"}, status=status.HTTP_201_CREATED)


class DashbaordPostEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API view to edit or delete a post"""
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """Retrieve post for editing based on its slug"""

        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id, user=user)

        return post

    def update(self, request, *args, **kwargs):
        """Update a post"""
        post_instance = self.get_object()
        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        tags = request.data.get("tags")
        category_id = request.data.get("category_id")
        post_status = request.data.get("post_status")
        category = api_models.Category.objects.get(id=category_id)
        post_instance.title = title
        if image != "undefined":
            post_instance.image = image

        post_instance.description = description
        post_instance.tags = tags
        print(f"Category ID: {category_id}")
        post_instance.category = category
        post_instance.status = post_status
        post_instance.save()

        return Response({"message": "update sucessful"}, status=status.HTTP_200_OK)
