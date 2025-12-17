# Trove Demo Deployment

Deploy Trove to GCP using Docker Compose.

## Setup

```bash
cp env.example .env
# Edit .env with your GCP project details
```

## Local Testing

```bash
make test-deploy  # Access at http://localhost
```

## Production Deployment

GitHub Actions handles deployment automatically on push to main.

### Manual Deploy

On the production server:

```bash
docker compose pull
docker compose up -d
```

## Database

Two databases:
- `trove-db`: Metadata
- `sample-db`: Demo data (dbt)

## Troubleshooting

```bash
docker compose ps          # Check status
docker compose logs [svc]  # View logs
```
