from django.core.paginator import Paginator
from django.http import JsonResponse
from .models import Category, Tag, Product

def categories_api(request):
    data = [{"id": c.id, "name": c.name} for c in Category.objects.order_by("name")]
    return JsonResponse({"results": data})

def tags_api(request):
    data = [{"id": t.id, "name": t.name} for t in Tag.objects.order_by("name")]
    return JsonResponse({"results": data})

def products_api(request):
    #params for pagination
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))

    qs = (
        Product.objects
        .select_related("category")
        .prefetch_related("tags")
        .order_by("id")
    )

    #pagination
    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)
    
    #case insensitive description search
    q = request.GET.get("q")
    if q:
        qs = qs.filter(description__icontains=q)

    results = []
    for p in page_obj.object_list:
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

    #todo clean up, use a pagination field instead?
    return JsonResponse({
        "results": results,
        "count": paginator.count,
        "page": page_obj.number,
        "num_pages": paginator.num_pages,
        "page_size": page_size,
    })