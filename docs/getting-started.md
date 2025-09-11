# Getting Started with trove

trove is an open source data exploration and observability tool designed for startups. This guide will help you get up and running quickly.

## Quick Start

The fastest way to get started with trove is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/trove-app/trove.git
cd trove

# Start all services
make up

# Seed the database with sample data (optional)
make db-seed
```

Once everything is running:
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- Database: localhost:5432

## Manual Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

The database can be set up in two ways:

1. Using Docker (recommended):
```bash
docker compose up sample_db
```

2. Manual PostgreSQL setup:
   - Install PostgreSQL 15
   - Create a database named 'postgres'
   - Update connection string in `.env`

## Basic Usage

1. **Connect to Your Data**
   - Navigate to Settings
   - Add your database connection details
   - Test the connection

2. **Explore Data**
   - Browse available schemas and tables
   - Use the visual query builder
   - Write SQL queries directly

3. **Share Insights**
   - Save queries for later
   - Share results with team members
   - Export data in various formats

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@sample_db:5432/postgres

# Backend
PORT=8000
DEBUG=True

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Next Steps

- Read the [User Guide](./user-guide.md) for detailed feature explanations
- Check out [Development Guide](./development.md) to start contributing
- See [Architecture](./architecture.md) for system design details

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check connection string in `.env`
   - Ensure database user has proper permissions

2. **Services Not Starting**
   - Check if ports 3001, 8000, or 5432 are in use
   - Verify Docker is running
   - Check service logs: `make logs`

3. **Data Not Loading**
   - Verify database is seeded: `make db-seed`
   - Check backend logs for errors
   - Verify frontend API configuration 