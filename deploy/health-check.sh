#!/bin/bash
set -euo pipefail

# Source environment variables if .env exists
if [[ -f .env ]]; then
    source .env
fi

# Default timeout in seconds
TIMEOUT=${1:-30}
INTERVAL=2

# Function to check container health
check_container_health() {
    local container="$1"
    local status
    
    if ! status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null); then
        echo "Container $container not found"
        return 1
    fi
    
    case "$status" in
        "healthy")
            echo "✅ $container is healthy"
            return 0
            ;;
        "unhealthy")
            echo "❌ $container is unhealthy"
            docker inspect --format='{{.State.Health.Log}}' "$container"
            return 1
            ;;
        "starting")
            echo "🔄 $container is starting"
            return 2
            ;;
        *)
            echo "❓ $container status: $status"
            return 1
            ;;
    esac
}

# Function to check HTTP endpoint
check_http_endpoint() {
    local service="$1"
    local url="$2"
    local max_attempts=$((TIMEOUT / INTERVAL))
    local attempt=1
    
    echo "Checking $service endpoint: $url"
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s -f "$url" &>/dev/null; then
            echo "✅ $service endpoint is responding"
            return 0
        fi
        echo "🔄 Attempt $attempt/$max_attempts: $service endpoint not responding"
        sleep "$INTERVAL"
        ((attempt++))
    done
    
    echo "❌ $service endpoint failed to respond after $TIMEOUT seconds"
    return 1
}

# Check if services are running
echo "Checking service status..."
services=("trove-frontend" "trove-backend")
all_healthy=true

for service in "${services[@]}"; do
    if ! check_container_health "$service"; then
        all_healthy=false
    fi
done

# Check endpoints if containers are running
if [[ "$all_healthy" == "true" ]]; then
    echo -e "\nChecking service endpoints..."
    
    # Frontend health check
    if ! check_http_endpoint "Frontend" "https://${DOMAIN}"; then
        all_healthy=false
    fi
    
    # Backend health check
    if ! check_http_endpoint "Backend" "https://${DOMAIN}/api/health"; then
        all_healthy=false
    fi
fi

# Print container logs if any checks failed
if [[ "$all_healthy" == "false" ]]; then
    echo -e "\nService logs:"
    for service in "${services[@]}"; do
        echo -e "\n=== $service logs ==="
        docker logs "$service" --tail 50
    done
    exit 1
fi

echo -e "\n✅ All services are healthy!"
exit 0 