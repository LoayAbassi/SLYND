from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

# views of each model to fetch from
urlpatterns = [
    # acess token
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),

    # user
    path("user/register/", api_views.RegisterView.as_view()),
    path("user/profile/<user_id>/", api_views.ProfileView.as_view()),

    # post
    path("post/category/list/", api_views.CategoryListAPIView.as_view()),
    path("post/category/posts/<category_slug>",
         api_views.PostCategoryListAPIView.as_view()),
    path("post/lists/", api_views.PostListAPIView.as_view()),
    path("post/detail/<slug>", api_views.PostDetailAPIView.as_view()),

    # Reacting
    path("post/like-post/", api_views.LikesPostAPIView.as_view()),
    path("post/comment-post/", api_views.PostCommentAPIView.as_view()),
    path("post/bookmark-post/", api_views.BookmarkPostAPIView.as_view()),

    # dashboard
    path("author/dashboard/stats/<user_id>",
         api_views.DashboardStats.as_view()),
    path("author/dashboard/comment-list/<user_id>",
         api_views.DashboardCommentList.as_view()),
    path("author/dashboard/post-list/<user_id>",
         api_views.DashboardPostLists.as_view()),
    path("author/dashboard/notification-list/<user_id>",
         api_views.DashboardNotificationList.as_view()),
    path("author/dashboard/notification-mark-seen",
         api_views.DashboardMarkNotificationsAsSeen.as_view()),
    path("author/dashboard/reply-comment",
         api_views.DashboardReplyCommentAPIView.as_view()),
    path("author/dashboard/create-post/",
         api_views.DashboardPostCreateAPIView.as_view()),
    path("author/dashboard/post_detail/<user_id>/<post_id>/",
         api_views.DashbaordPostEditAPIView.as_view()),



]
