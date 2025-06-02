#!/bin/bash

# Deploy script for Trove demo environment
# This script handles the deployment of the Trove application using Docker Compose

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    local required_vars=("DOMAIN" "EMAIL" "DB_PASSWORD" "GCP_PROJECT_ID" "GCR_HOSTNAME" "REPO_NAME" "IMAGE_TAG")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        log_error "Please check your .env file or environment setup"
        exit 1
    fi
}

# Load environment variables
load_env() {
    if [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment variables from $ENV_FILE"
        set -a
        source "$ENV_FILE"
        set +a
    else
        log_error "Environment file not found: $ENV_FILE"
        log_error "Please create the .env file with required variables"
        exit 1
    fi
}

# Authenticate with Google Cloud Registry
authenticate_gcr() {
    log_info "Authenticating with Google Container Registry..."
    if ! gcloud auth configure-docker "$GCR_HOSTNAME" --quiet; then
        log_error "Failed to authenticate with GCR"
        exit 1
    fi
    log_success "GCR authentication successful"
}

# Pull latest images
pull_images() {
    log_info "Pulling latest images..."
    
    local images=(
        "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-frontend:${IMAGE_TAG}"
        "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-backend:${IMAGE_TAG}"
    )
    
    for image in "${images[@]}"; do
        log_info "Pulling $image"
        if ! docker pull "$image"; then
            log_error "Failed to pull image: $image"
            exit 1
        fi
    done
    
    log_success "All images pulled successfully"
}


# Deploy the application
deploy() {
    log_info "Starting deployment..."
    
    # Stop existing containers gracefully
    if docker-compose -f "$COMPOSE_FILE" ps -q | grep -q .; then
        log_info "Stopping existing containers..."
        docker-compose -f "$COMPOSE_FILE" down --timeout 30
    fi
    
    # Start new deployment
    log_info "Starting new deployment..."
    if ! docker-compose -f "$COMPOSE_FILE" up -d; then
        log_error "Deployment failed"
        exit 1
    fi
    
    log_success "Deployment started successfully"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "Health check attempt $attempt/$max_attempts"
        
        # Check if all containers are running
        local running_containers=$(docker-compose -f "$COMPOSE_FILE" ps -q | wc -l)
        local expected_containers=4  # frontend, backend, db, caddy
        
        if [[ $running_containers -eq $expected_containers ]]; then
            # Check if services are responding
            if curl -f -s "http://localhost:80" > /dev/null 2>&1; then
                log_success "All services are healthy and responding"
                return 0
            fi
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Health check failed after $max_attempts attempts"
            log_error "Deployment may have issues. Check logs with: docker-compose -f $COMPOSE_FILE logs"
            return 1
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old trove images (keep last 3 versions)
    local old_images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "trove-" | tail -n +4)
    if [[ -n "$old_images" ]]; then
        echo "$old_images" | xargs docker rmi -f 2>/dev/null || true
    fi
    
    log_success "Cleanup completed"
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    log_info "Service URLs:"
    echo "  Frontend: http://${DOMAIN}"
    echo "  Backend API: http://${DOMAIN}/api"
}

# Main deployment function
main() {
    log_info "Starting Trove deployment process..."
    
    load_env
    check_env_vars
    authenticate_gcr
    pull_images
    deploy
    
    if health_check; then
        cleanup
        show_status
        log_success "Deployment completed successfully!"
    else
        log_error "Deployment completed but health checks failed"
        log_error "Please check the application logs and status"
        exit 1
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "status")
        load_env
        show_status
        ;;
    "health")
        load_env
        health_check
        ;;
    "cleanup")
        load_env
        cleanup
        ;;
    *)
        echo "Usage: $0 [deploy|status|health|cleanup]"
        echo "  deploy  - Full deployment process (default)"
        echo "  status  - Show current deployment status"
        echo "  health  - Run health checks only"
        echo "  cleanup - Clean up old images only"
        exit 1
        ;;
esac 