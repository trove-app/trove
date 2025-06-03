# Development Guide

This guide will help you set up your local development environment and start contributing to trove.

## Development Environment Setup

### Prerequisites

- Git
- Docker and Docker Compose
- Python 3.8+
- Node.js 18+
- Make

### Local Setup

1. **Clone the Repository**
```bash
git clone https://github.com/hr23232323/trove.git
cd trove
```

2. **Environment Setup**
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Install development dependencies
make setup-dev  # This will be added in the future
```

3. **Start Development Services**
```bash
# Start all services in development mode
make up

# Seed the database with sample data
make db-seed

# View logs
make logs  # All services
make logs service=backend  # Specific service
```

## Project Structure

```
trove/
├── backend/           # FastAPI backend
│   ├── api/          # API routes and handlers
│   ├── core/         # Core functionality
│   ├── db/           # Database models and migrations
│   └── tests/        # Backend tests
├── frontend/         # Next.js frontend
│   ├── app/         # Pages and components
│   ├── lib/         # Utilities and helpers
│   └── tests/       # Frontend tests
├── db/              # Database and dbt configuration
│   ├── migrations/  # Database migrations
│   └── dbt_project/ # dbt models and configuration
├── docs/            # Documentation
└── deploy/          # Deployment configuration
```

## Development Workflow

### 1. Create a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code ...

# Run tests
make test

# Format code
make format  # This will be added in the future
```

### 2. Testing

```bash
# Run all tests
make test

# Run specific test suites
cd backend && python -m pytest
cd frontend && yarn test
```

### 3. Code Style

We use:
- Black for Python code formatting
- ESLint and Prettier for JavaScript/TypeScript
- Pre-commit hooks for consistency

### 4. Database Changes

```bash
# Create a new migration
cd backend
alembic revision -m "description_of_change"

# Apply migrations
alembic upgrade head

# Roll back one version
alembic downgrade -1
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create a new route file in `backend/api/routes/`
2. Add models in `backend/api/models/`
3. Add the route to `backend/api/main.py`
4. Add tests in `backend/tests/`

Example:
```python
from fastapi import APIRouter, Depends
from typing import List
from ..models.your_model import YourModel

router = APIRouter()

@router.get("/your-endpoint", response_model=List[YourModel])
async def get_items():
    # Your implementation
    pass
```

### Adding a New Frontend Component

1. Create component in `frontend/app/components/`
2. Add tests in `frontend/tests/`
3. Add to relevant pages

Example:
```typescript
// components/YourComponent.tsx
import React from 'react'

interface Props {
  // Your props
}

export const YourComponent: React.FC<Props> = (props) => {
  return (
    <div>
      {/* Your component */}
    </div>
  )
}
```

### Working with dbt

```bash
# Run dbt models
docker compose run --rm dbt dbt run

# Test dbt models
docker compose run --rm dbt dbt test

# Generate docs
docker compose run --rm dbt dbt docs generate
```

## Debugging

### Backend Debugging

1. **Using pdb**
```python
import pdb; pdb.set_trace()
```

2. **Using VS Code**
   - Use the provided launch configurations in `.vscode/launch.json`
   - Set breakpoints in your code
   - Start debugging session

### Frontend Debugging

1. **Using Chrome DevTools**
   - Open Chrome DevTools (F12)
   - Use React Developer Tools extension
   - Use Network tab for API calls

2. **Using VS Code**
   - Use the Debug tab
   - Set breakpoints in your code
   - Use the JavaScript Debug Terminal

### Database Debugging

1. **Connecting to Database**
```bash
# Using docker compose
docker compose exec db psql -U postgres -d postgres

# Direct connection
psql postgresql://postgres:postgres@localhost:5432/postgres
```

2. **Useful PostgreSQL Commands**
```sql
-- List tables
\dt

-- Describe table
\d+ table_name

-- Show running queries
SELECT * FROM pg_stat_activity;
```

## Performance Profiling

### Backend Profiling

```bash
# Install profiling tools
pip install cProfile

# Run with profiling
python -m cProfile -o output.prof your_script.py

# Analyze results
python -m pstats output.prof
```

### Frontend Profiling

- Use React DevTools Profiler
- Use Lighthouse for performance metrics
- Use Chrome Performance tab

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Check if database is running
docker compose ps

# Check logs
docker compose logs db

# Verify connection string in .env
```

2. **Frontend Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
```

3. **Backend Import Issues**
```bash
# Verify PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Check virtual environment
source venv/bin/activate
```

## Best Practices

1. **Code Quality**
   - Write tests for new features
   - Document complex functions
   - Use type hints in Python
   - Use TypeScript for frontend code

2. **Git Workflow**
   - Write clear commit messages
   - Keep PRs focused and small
   - Update documentation
   - Add tests for new features

3. **Security**
   - Never commit secrets
   - Validate all inputs
   - Use prepared statements
   - Follow security guidelines

## Getting Help

- Check existing issues on GitHub
- Join our community chat
- Review documentation
- Ask in pull requests 