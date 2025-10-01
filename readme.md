# Django Product Catalog

A full-stack product catalog application built with Django (backend) and Next.js (frontend).


https://github.com/user-attachments/assets/044e892c-436d-4389-a262-2c2e6c5440c8


## Prerequisites

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd django-product-catalog
```

### 2. Backend Setup (Django)

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install django django-cors-headers

# Setup database
python manage.py makemigrations
python manage.py migrate

# Seed database with sample data using command or with admin gui
python manage.py seed_shop --fresh --count 60

# Start server
python manage.py runserver
```

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## Running the Application

1. **Backend:** `cd backend && python manage.py runserver` (http://localhost:8000)
2. **Frontend:** `cd frontend && npm run dev` (http://localhost:3000)

## Database Seeding

```bash
cd backend
python manage.py seed_shop --fresh --count 60
```

- `--fresh`: Delete existing data first
- `--count`: Number of products to create

Creates 5 categories, 8 tags, and specified number of products.

## API Endpoints

### Categories
- `GET /api/categories/` - List all categories

### Tags
- `GET /api/tags/` - List all tags

### Products
- `GET /api/products/` - List products with search and filtering

**Query Parameters:**
- `q` - Search term (case insensitive search in product descriptions)
- `category` - Category ID to filter by
- `tags` - Comma-separated tag IDs (e.g., `tags=1,5,9`)
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 10, max: 50)

## Extra Documentation

- **[Development Log](devlog.md)** - Detailed development process and technical decisions
- **[Prompts](prompts.md)** - List of prompts used during development
