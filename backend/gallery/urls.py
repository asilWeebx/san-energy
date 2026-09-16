from django.urls import path

from . import views

urlpatterns = [
    path("images/", views.images_list),
    path("admin/login/", views.admin_login),
    path("admin/images/", views.admin_images),
    path("admin/images/<int:pk>/", views.admin_image_detail),
]
