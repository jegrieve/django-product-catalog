from django.http import JsonResponse
from .models import Category, Tag, Product

def categories_api(request):
    data = [{"id": c.id, "name": c.name} for c in Category.objects.order_by("name")]
    return JsonResponse({"results": data})

def tags_api(request):
    data = [{"id": t.id, "name": t.name} for t in Tag.objects.order_by("name")]
    return JsonResponse({"results": data})

def products_api(request):
    qs = (
        Product.objects
        .select_related("category")
        .prefetch_related("tags")
        .order_by("id")
    )
    #todo pagination and search filtering
    results = []
    for p in qs:
        results.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": str(p.price),
            "category": None if p.category is None else {
                "id": p.category.id, "name": p.category.name
            },
            "tags": [{"id": t.id, "name": t.name} for t in p.tags.all()],
        })

    return JsonResponse({"results": results})