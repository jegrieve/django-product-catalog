from decimal import Decimal
import random
from django.core.management.base import BaseCommand
from django.db import transaction
from shop.models import Category, Tag, Product

#from cursor a simple command to seed db for testing
class Command(BaseCommand):
    help = "Seed demo Categories, Tags, and Products."

    def add_arguments(self, parser):
        parser.add_argument("--fresh", action="store_true", help="Delete existing shop data first.")
        parser.add_argument("--count", type=int, default=30, help="Number of products to create.")

    @transaction.atomic
    def handle(self, *args, **opts):
        if opts["fresh"]:
            self.stdout.write("Clearing existing shop data…")
            Product.objects.all().delete()
            Category.objects.all().delete()
            Tag.objects.all().delete()

        categories = ["Electronics","Home & Kitchen","Sports & Outdoors","Books","Clothing"]
        tags = ["On Sale","New Arrival","Bestseller","Eco-Friendly","Budget","Premium","Wireless","Waterproof"]

        cats = [Category.objects.get_or_create(name=n)[0] for n in categories]
        tag_objs = [Tag.objects.get_or_create(name=n)[0] for n in tags]

        rng = random.Random(42)
        for i in range(1, max(0, opts["count"]) + 1):
            c = rng.choice(cats)
            p = Product.objects.create(
                name=f"Sample Product {i}",
                description=f"This is demo product #{i} in {c.name}. Great value and quality.",
                price=Decimal(f"{rng.uniform(5,200):.2f}"),
                category=c,
            )
            p.tags.add(*rng.sample(tag_objs, k=rng.randint(0, 3)))

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {Category.objects.count()} categories, {Tag.objects.count()} tags, {Product.objects.count()} products."
        ))
