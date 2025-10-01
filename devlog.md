# Development Log

## Project Overview
For this project, we must use Django with either Django templates or a frontend framework. I decided to use React since I have more familiarity with it, which allows for quick prototyping. In a production app, the choice would depend on the specific requirements, templates can load faster and are quicker to setup initially.

## Initial Setup
I started with the Django setup, reviewing the framework organization (https://docs.djangoproject.com/en/5.2/). I had to generate a basic .gitignore file (with cursor) since it's not included in the scaffold.

Next, I created a new app called "shop" and added it to INSTALLED_APPS. To keep things organized, I'll use different branches for different features, starting with the Models.

## Database Models
At a high level, I designed three models:

### 1. Category
- **Field:** name (unique)
- **Relationship:** Each product has one category, a category has many products (many-to-one)
- **Assumption:** Pick a single shelf per product. For example, an e-bike goes under Sports & Outdoors (not Electronics), tech aspects can be captured with tags.

### 2. Tag
- **Field:** name (unique)
- **Relationship:** Products and tags are many-to-many
- **Assumption:** Flexible labels: a product can be both "On Sale" and a "Bestseller"

### 3. Product
- **Fields:** name, description, price, category (FK to Category), tags (M2M to Tag)
- **Rationale:** This structure supports the assignment requirements: search by description and filter by category and tags, including combined filters.

I used https://dbdiagram.io/ to visualize the schema, created the scehma code (generated with cursor) based on my model definitions, then implemented the Django models.

## Admin & Seeding
I registered the models in the admin interface. While the GUI works as expected for adding data, it's time-consuming, so I generated a script (with cursor) to quickly seed the database for testing purposes.

After using CoPilot to review my models PR, it suggested additional fields and validation for the product price. I added a timestamp field (helpful to know when products were created) and price validation. Since we don't have extensive CRUD functionality for this assignment, I kept validation minimal.

## API Routes
I designed three read-only routes:

### 1. `/api/tags`
- **Purpose:** Fetch all tags for filters
- **Assumption:** Tag count is small (dozen to hundreds) -> no pagination needed
- **Notes:** Ordered by name, used to render a checkbox list in the UI

### 2. `/api/categories`
- **Purpose:** Fetch all categories for filters
- **Assumption:** Category count is small (dozen to hundreds) -> no pagination needed
- **Notes:** Ordered by name, used to render a single-select dropdown

### 3. `/api/products`
- **Purpose:** List products with search + filters + pagination
- **Query Parameters:**
  - `q` — case-insensitive substring search on description
  - `category` — numeric category id
  - `tags` - comma-separated tag ids (e.g., tags=1,5,9). Matches products that have ANY of the selected tags
  - `page` (default 1) and `page_size` (default 10, capped)
- **Semantics:** Filters are combined with logical AND (so description match AND category AND tags)
- **Ordering:** Stable pagination via `order_by("id")`
- **Performance:** Make sure to verify we are being efficient with queries even though datasets for this are small now, we can have many thousands of products. Use `select_related("category")` and `prefetch_related("tags")` to prevent N+1 queries

### Assumptions:
- Product count can be large (thousands+), so pagination is required
- We're OK with `icontains` for search on SQLite. on Postgres we could switch to more efficient searches in the future
- Error tolerance: malformed params, like non-numeric tags, are ignored rather than returning 400 errors

## Implementation
I built out the endpoints, ensuring efficient querying for fetching related categories and tags. I used Django's paginator to implement simple pagination, with responses formatted as `{results: [], pagination: {...pagination data}}`. For searching, I used case-insensitive queries. This is a table scan that should be efficient enough for smaller datasets. For very large datasets, we would want to optimize depending on the database used.

**Key Performance Note:** Use `select_related` for one-to-one/foreign-key relations and `prefetch_related` for many-to-many to eliminate N+1 queries, keep query counts low, and paginate efficiently. (note: copilot flagged my .all() use on a prefetch as N+1)

## Frontend
I chose Next.js, Tailwind, and React Query based on familiarity. React Query also provides infinite pagination, which I've used before for paginated data.

Since styling doesn't matter and in the interest of time, I asked Cursor to scaffold a responsive page based on the specifications.

The implementation includes search functionality, filters, and product display based on search + filter combinations.

It's just a simple implementation for all the functionality, I can see many future imporovements like for example a typeahead here could make the search interface much nicer, and help with searching.

## Documentation & Final Setup
Finally, I generated some quick boilerplate (with Cursor) for the README, made sure it made sense and double checked I could reproduce the steps. I also created a command (with Cursor) to seed the database to quickly add things to the database instead of adding through the GUI, which I found to be slow.

## Resources used
Django Documentation: https://docs.djangoproject.com/en/5.2/ 
Cursor AI to help with high level understanding of certain things, generating boilerplate and questions about codebase
Web searches and stackoverflow to verify some things cursor says

