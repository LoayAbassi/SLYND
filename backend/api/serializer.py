from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from api import models as api_models


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for JWT token to include additional user info."""

    @classmethod
    def get_token(cls, user):
        """Override method to add custom claims to the token."""
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username

        return token


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration, including password validation and confirmation."""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = api_models.User
        fields = ['full_name', 'email', 'password', 'confirm_password']

    def validate(self, attr):
        """Ensure passwords match during registration."""
        if attr['password'] != attr['confirm_password']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match'})
        return attr

    def create(self, validated_data):
        """Create and return a new user instance with hashed password."""

        user = api_models.User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
        )

        email_username, mobile = user.email.split("@")
        user.username = email_username

        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerialoizer(serializers.ModelSerializer):
    """Serializer for User model to expose all fields."""

    class Meta:
        model = api_models.User
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model to expose all fields."""
    class Meta:
        model = api_models.Profile
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model with custom post count field."""

    def get_post_count(self, category):
        """Return the number of posts in this category."""
        return category.posts.count()

    class Meta:
        model = api_models.Category
        fields = ["id", "title", "image", "slug", "post_count"]


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model with adjustable depth based on request method."""

    class Meta:
        model = api_models.Comment
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        """Adjust serialization depth based on the request method."""

        super(CommentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model with nested comments and adjustable depth."""

    class Meta:
        fields = "__all__"
        model = api_models.Post

    comments = CommentSerializer(many=True)

    def __init__(self, *args, **kwargs):
        """Adjust serialization depth based on the request method."""

        super(PostSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class BookmarkSerializer(serializers.ModelSerializer):
    """Serializer for Bookmark model with adjustable depth."""

    class Meta:
        fields = "__all__"
        model = api_models.Bookmark

    def __init__(self, *args, **kwargs):
        """Adjust serialization depth based on the request method."""

        super(BookmarkSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model with adjustable depth."""

    class Meta:
        fields = "__all__"
        model = api_models.Notification

    def __init__(self, *args, **kwargs):
        """Adjust serialization depth based on the request method."""

        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class AuthorSerializer(serializers.Serializer):
    """Serializer for author statistics including views, posts, likes, and bookmarks."""

    views = serializers.IntegerField(default=0)
    posts = serializers.IntegerField(default=0)
    likes = serializers.IntegerField(default=0)
    bookmarks = serializers.IntegerField(default=0)
