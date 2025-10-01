from django.urls import path
from . import views

urlpatterns = [
    path("categories", views.categories_api, name="categories_api"),
    path("tags", views.tags_api, name="tags_api"),
]