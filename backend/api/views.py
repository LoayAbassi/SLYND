# django
from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum,Count
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
    serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = api_models.User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
        Profile = api_models.Profile.objects.get(user=user)
        return Profile


class CategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Category.objects.all()


class PostCategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs["category_slug"]
        category = api_models.Category.objects.get(slug=category_slug)
        posts = api_models.Post.objects.filter(
            category=category, status="Active")
        return posts


class PostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Post.objects.filter(status="Active")


class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        post = api_models.Post.objects.get(slug=slug, status="Active")
        post.view = post.view + 1
        post.save()

        return post


class LikesPostAPIView(APIView):
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
    serializer_class = api_serializer.AuthorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        views= api_models.Post.objects.filter(user = user).aggregate(view = Sum("view"))["view"]
        posts = api_models.Post.objects.filter(user = user).count()
        likes = api_models.Post.objects.filter(user = user).aggregate(like = Count("likes"))["like"]
        bookmarks = api_models.Bookmark.objects.filter(post__user = user).count()

        return [{
            "views":views,
            "posts":posts,
            "likes":likes,
            "bookmarks":bookmarks,
        }]
    
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset,many = True)
        return Response(serializer.data)


class DashboardPostLists(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = api_models.User.objects.get(id = user_id)
        api_models.Post.objects.filter(user = user).order_by("-id")

class DashboardCommentList(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = api_models.User.objects.get(id = user_id)
        return api_models.Comment.objects.filter(post__user = user)

class DashboardNotificationList(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id =self.kwargs["user_id"]
        user = api_models.User.objects.get(id = user_id)

        return api_models.Notification.objects.all(seen = False,user = user)
    
class DashboardMarkNotificationsAsSeen(APIView):
    def post(self,request):
        notification_id = request.data["noti_id"]