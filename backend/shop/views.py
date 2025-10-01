from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Category, Tag, Product

@require_GET
def categories_api(request):
    data = [{"id": c.id, "name": c.name} for c in Category.objects.order_by("name")]
    return JsonResponse({"results": data})

@require_GET
def tags_api(request):
    data = [{"id": t.id, "name": t.name} for t in Tag.objects.order_by("name")]
    return JsonResponse({"results": data})

@require_GET
def products_api(request):
    def to_int(val, default):
        try:
            return int(val)
        except (TypeError, ValueError):
            return default

    page = max(1, to_int(request.GET.get("page", 1), 1))
    page_size = to_int(request.GET.get("page_size", 10), 10)
    page_size = max(1, min(page_size, 100))

    qs = (
        Product.objects
        .select_related("category")
        .prefetch_related("tags")
        .order_by("id")
    )
    #case insensitive description search
    q = (request.GET.get("q") or "").strip()
    if q:
        if len(q) > 200:
            q = q[:200]
        qs = qs.filter(description__icontains=q)

    # category filter
    category = request.GET.get("category")
    if category:
        try:
            qs = qs.filter(category_id=int(category))
        except (TypeError, ValueError):
            pass

    # paginate data after filters
    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)

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

    return JsonResponse({
        "results": results,
        "pagination": {
            "count": paginator.count,
            "page": page_obj.number,
            "num_pages": paginator.num_pages,
            "page_size": page_size,
        },
    })