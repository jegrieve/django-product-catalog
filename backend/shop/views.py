from django.http import JsonResponse
from .models import Category, Tag 

def categories_api(request):
    data = [{"id": c.id, "name": c.name} for c in Category.objects.order_by("name")]
    return JsonResponse({"results": data})

def tags_api(request):
    data = [{"id": t.id, "name": t.name} for t in Tag.objects.order_by("name")]
    return JsonResponse({"results": data})