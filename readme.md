# Django Product Catalog

A full-stack product catalog application built with Django (backend) and Next.js (frontend).

## Project Structure

```
django-product-catalog/
├── backend/                 # Django backend API
│   ├── config/             # Django project settings
│   ├── shop/               # Main app with models, views, URLs
│   ├── manage.py           # Django management script
│   └── db.sqlite3          # SQLite database
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── app/            # Next.js app directory
    │   ├── hooks.ts        # Custom React hooks
    │   └── lib/            # Utility functions
    ├── package.json        # Node.js dependencies
    └── next.config.ts      # Next.js configuration
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd django-product-catalog
```

### 2. Backend Setup (Django)

#### 2.1 Create and Activate Virtual Environment

```bash
# Navigate to the project root
cd django-product-catalog

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

#### 2.2 Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Install required packages
pip install django django-cors-headers

# Or if you have a requirements.txt file:
# pip install -r requirements.txt
```

#### 2.3 Database Setup

```bash
# Run migrations to create database tables
python manage.py makemigrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser
```

#### 2.4 Start Django Development Server

```bash
# From the backend directory
python manage.py runserver
```

The Django API will be available at: `http://localhost:8000`

### 3. Frontend Setup (Next.js)

#### 3.1 Install Node.js Dependencies

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

#### 3.2 Start Next.js Development Server

```bash
# From the frontend directory
npm run dev
```

The Next.js frontend will be available at: `http://localhost:3000`

## Running the Application

### Development Mode

1. **Start the Backend:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source ../venv/bin/activate  # Activate virtual environment
   python manage.py runserver
   ```

2. **Start the Frontend:**
   ```bash
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

### Available Scripts

#### Backend (Django)
```bash
# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test
```

#### Frontend (Next.js)
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## API Endpoints

The Django backend provides the following API endpoints:

- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/categories/` - List all categories
- `GET /api/tags/` - List all tags

## Database Models

- **Category**: Product categories
- **Tag**: Product tags for filtering
- **Product**: Main product model with name, description, price, category, and tags

## Configuration

### Backend Configuration
- Database: SQLite (development)
- CORS: Configured for Next.js development server
- Debug: Enabled for development

### Frontend Configuration
- Framework: Next.js 15 with App Router
- Styling: Tailwind CSS
- State Management: TanStack Query
- TypeScript: Enabled

## Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Django (change port)
   python manage.py runserver 8001
   
   # Next.js (change port)
   npm run dev -- -p 3001
   ```

2. **Database Issues:**
   ```bash
   # Reset database
   rm backend/db.sqlite3
   python manage.py migrate
   ```

3. **Node Modules Issues:**
   ```bash
   # Clear and reinstall
   rm -rf frontend/node_modules
   cd frontend
   npm install
   ```

4. **Python Virtual Environment Issues:**
   ```bash
   # Recreate virtual environment
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install django django-cors-headers
   ```

## Development Notes

- The backend uses Django REST Framework patterns
- CORS is configured to allow requests from the Next.js development server
- The frontend uses React Query for data fetching
- Tailwind CSS is used for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

[Add your license information here]
