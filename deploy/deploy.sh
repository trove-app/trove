#!/bin/bash
set -euo pipefail

# Source environment variables if .env exists
if [[ -f .env ]]; then
    source .env
fi

# Validate required environment variables
required_vars=(
    "DOMAIN"
    "EMAIL"
    "DB_PASSWORD"
    "GCP_PROJECT_ID"
    "GCR_HOSTNAME"
    "IMAGE_TAG"
)

for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        echo "Error: Required environment variable $var is not set"
        exit 1
    fi
done

# Function to check if a container is running
container_running() {
    local container_name="$1"
    docker ps --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Function to wait for a container to be healthy
wait_for_health() {
    local container_name="$1"
    local max_attempts=30
    local attempt=1

    echo "Waiting for $container_name to be healthy..."
    while [[ $attempt -le $max_attempts ]]; do
        if docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null | grep -q "healthy"; then
            echo "$container_name is healthy"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: $container_name is not yet healthy"
        sleep 2
        ((attempt++))
    done
    
    echo "Error: $container_name failed to become healthy after $max_attempts attempts"
    docker logs "$container_name"
    return 1
}

# Pull latest images
echo "Pulling latest images..."
docker pull "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/trove-frontend:${IMAGE_TAG}"
docker pull "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/trove-backend:${IMAGE_TAG}"

# Check if SSL certificates exist, if not initialize them
if [[ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]]; then
    echo "Initializing SSL certificates..."
    ./init-letsencrypt.sh
fi

# Start or update services using docker-compose
echo "Deploying services..."
docker-compose pull
docker-compose up -d --remove-orphans

# Wait for services to be healthy
services=("trove-backend" "trove-frontend")
for service in "${services[@]}"; do
    if ! wait_for_health "$service"; then
        echo "Error: Service $service failed to start properly"
        docker-compose logs "$service"
        exit 1
    fi
done

echo "Deployment completed successfully!"

# Print service status
docker-compose ps 