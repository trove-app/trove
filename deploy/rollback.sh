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
    "REPO_NAME"
    "IMAGE_TAG"
)

for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        echo "Error: Required environment variable $var is not set"
        exit 1
    fi
done

# Parse command line arguments for services to rollback
SERVICES=${1:-"frontend,backend"}
IFS=',' read -ra SERVICE_ARRAY <<< "$SERVICES"

# Function to verify image exists
verify_image() {
    local service="$1"
    local image="${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-${service}:${IMAGE_TAG}"
    
    echo "Verifying image exists: $image"
    if ! docker pull "$image" &>/dev/null; then
        echo "Error: Image $image not found"
        return 1
    fi
    return 0
}

# Function to rollback a service
rollback_service() {
    local service="$1"
    local container="trove-${service}"
    
    echo "Rolling back $service to version ${IMAGE_TAG}"
    
    # Check if container exists and stop it if running
    local container_id
    container_id=$(docker ps -q -f name="$container")
    if [[ -n "$container_id" ]]; then
        echo "Stopping current $container..."
        docker stop "$container_id" || true
        echo "Removing $container container..."
        docker rm -f "$container_id" || true
    fi
    
    # Start the service using docker-compose
    echo "Starting $service with version ${IMAGE_TAG}..."
    docker-compose up -d "$service"
    
    # Wait for service to be healthy
    local max_attempts=30
    local attempt=1
    
    echo "Waiting for $container to be healthy..."
    while [[ $attempt -le $max_attempts ]]; do
        if docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null | grep -q "healthy"; then
            echo "$container is healthy"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: $container is not yet healthy"
        sleep 2
        ((attempt++))
    done
    
    echo "Error: $container failed to become healthy after rollback"
    docker-compose logs "$service"
    return 1
}

# Verify all images exist before starting rollback
for service in "${SERVICE_ARRAY[@]}"; do
    if ! verify_image "$service"; then
        exit 1
    fi
done

# Perform rollback for each service
for service in "${SERVICE_ARRAY[@]}"; do
    if ! rollback_service "$service"; then
        echo "Error: Rollback failed for $service"
        exit 1
    fi
done

echo "Rollback completed successfully!"
docker-compose ps 