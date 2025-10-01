from django.http import JsonResponse
from .models import Category

def categories_api(request):
    data = [{"id": c.id, "name": c.name} for c in Category.objects.order_by("name")]
    return JsonResponse({"results": data})