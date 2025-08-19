# trove Backend

This is the FastAPI backend for trove, an open source data exploration and observability tool.

## Features
- FastAPI with async PostgreSQL (asyncpg)
- Pydantic for request validation
- CORS enabled for frontend communication
- Production-ready Dockerfile (Gunicorn + Uvicorn)

## Development

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## Docker
To build and run the backend with Docker:

```bash
docker build -t trove-backend .
docker run --env-file .env -p 8000:8000 trove-backend
```

## Environment
- The backend expects a PostgreSQL database (see `.env` for connection string).
- The default is `postgresql://postgres:postgres@sample_db:5432/postgres` (for Docker Compose).

## API
- `POST /api/v1/query` — Accepts an SQL query and returns results.

## Production
- The Dockerfile runs the app with Gunicorn and Uvicorn for async production use. 