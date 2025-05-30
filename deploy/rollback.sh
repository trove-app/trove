#!/bin/bash

# Rollback script for Trove demo environment
# This script handles rolling back to a previous version of the application

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
BACKUP_DIR="${SCRIPT_DIR}/backups"

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

# Load environment variables
load_env() {
    if [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment variables from $ENV_FILE"
        set -a
        source "$ENV_FILE"
        set +a
    else
        log_error "Environment file not found: $ENV_FILE"
        exit 1
    fi
}

# Check if required environment variables are set
check_env_vars() {
    local required_vars=("DOMAIN" "EMAIL" "DB_PASSWORD" "GCP_PROJECT_ID" "GCR_HOSTNAME" "REPO_NAME")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
}

# Verify that the target image exists
verify_image() {
    local image_tag="$1"
    local image_path="${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-frontend:${image_tag}"
    
    log_info "Verifying image exists: $image_path"
    
    if ! gcloud artifacts docker images describe "$image_path" >/dev/null 2>&1; then
        log_error "Image not found: $image_path"
        return 1
    fi
    
    image_path="${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-backend:${image_tag}"
    log_info "Verifying image exists: $image_path"
    
    if ! gcloud artifacts docker images describe "$image_path" >/dev/null 2>&1; then
        log_error "Image not found: $image_path"
        return 1
    fi
    
    log_success "All images verified successfully"
    return 0
}

# Create backup before rollback
create_backup() {
    log_info "Creating backup before rollback..."
    
    mkdir -p "$BACKUP_DIR"
    local backup_file="${BACKUP_DIR}/pre-rollback-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Backup database if running
    if docker ps --format "table {{.Names}}" | grep -q "trove-db"; then
        log_info "Backing up database..."
        docker exec trove-db pg_dump -U postgres trove > "${BACKUP_DIR}/db-pre-rollback-$(date +%Y%m%d-%H%M%S).sql"
    fi
    
    # Backup current state
    if [[ -f "$COMPOSE_FILE" ]]; then
        tar -czf "$backup_file" -C "$SCRIPT_DIR" docker-compose.yml .env 2>/dev/null || true
        log_success "Backup created: $backup_file"
    fi
}

# Pull the rollback images
pull_rollback_images() {
    local image_tag="$1"
    
    log_info "Pulling rollback images for tag: $image_tag"
    
    local images=(
        "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-frontend:${image_tag}"
        "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-backend:${image_tag}"
    )
    
    for image in "${images[@]}"; do
        log_info "Pulling $image"
        if ! docker pull "$image"; then
            log_error "Failed to pull image: $image"
            exit 1
        fi
    done
    
    log_success "All rollback images pulled successfully"
}

# Perform the rollback
perform_rollback() {
    local image_tag="$1"
    
    log_info "Performing rollback to tag: $image_tag"
    
    # Update IMAGE_TAG in environment
    export IMAGE_TAG="$image_tag"
    
    # Stop current containers
    if docker-compose -f "$COMPOSE_FILE" ps -q | grep -q .; then
        log_info "Stopping current containers..."
        docker-compose -f "$COMPOSE_FILE" down --timeout 30
    fi
    
    # Start with rollback images
    log_info "Starting containers with rollback images..."
    if ! docker-compose -f "$COMPOSE_FILE" up -d; then
        log_error "Rollback deployment failed"
        exit 1
    fi
    
    log_success "Rollback deployment started"
}

# Health check after rollback
health_check() {
    log_info "Performing health checks after rollback..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "Health check attempt $attempt/$max_attempts"
        
        # Check if all containers are running
        local running_containers=$(docker-compose -f "$COMPOSE_FILE" ps -q | wc -l)
        local expected_containers=4  # frontend, backend, db, nginx
        
        if [[ $running_containers -eq $expected_containers ]]; then
            # Check if services are responding
            if curl -f -s "http://localhost:80" > /dev/null 2>&1; then
                log_success "All services are healthy after rollback"
                return 0
            fi
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Health check failed after rollback"
            log_error "Services may not be responding correctly"
            return 1
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Show rollback status
show_status() {
    log_info "Rollback Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    log_info "Service URLs:"
    echo "  Frontend: http://${DOMAIN}"
    echo "  Backend API: http://${DOMAIN}/api"
    
    if [[ -f "${SCRIPT_DIR}/certbot/conf/live/${DOMAIN}/fullchain.pem" ]]; then
        echo "  HTTPS Frontend: https://${DOMAIN}"
        echo "  HTTPS Backend API: https://${DOMAIN}/api"
    fi
}

# List available image tags
list_available_tags() {
    log_info "Available image tags for rollback:"
    
    log_info "Frontend images:"
    gcloud artifacts docker images list "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-frontend" --format="table(tag)" --limit=10
    
    log_info "Backend images:"
    gcloud artifacts docker images list "${GCR_HOSTNAME}/${GCP_PROJECT_ID}/${REPO_NAME}/trove-backend" --format="table(tag)" --limit=10
}

# Main rollback function
main() {
    local image_tag="${1:-}"
    
    if [[ -z "$image_tag" ]]; then
        log_error "Usage: $0 <image_tag>"
        log_error "Please specify the image tag to rollback to"
        list_available_tags
        exit 1
    fi
    
    log_info "Starting rollback process to tag: $image_tag"
    
    load_env
    check_env_vars
    
    if ! verify_image "$image_tag"; then
        log_error "Image verification failed. Cannot proceed with rollback."
        list_available_tags
        exit 1
    fi
    
    create_backup
    pull_rollback_images "$image_tag"
    perform_rollback "$image_tag"
    
    if health_check; then
        show_status
        log_success "Rollback completed successfully!"
        log_info "Application has been rolled back to tag: $image_tag"
    else
        log_error "Rollback completed but health checks failed"
        log_error "Please check the application logs and status"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "list"|"--list")
        load_env
        check_env_vars
        list_available_tags
        ;;
    "status"|"--status")
        load_env
        show_status
        ;;
    "")
        log_error "No image tag specified"
        log_error "Usage: $0 <image_tag>"
        log_error "       $0 list    # List available tags"
        log_error "       $0 status  # Show current status"
        exit 1
        ;;
    *)
        main "$1"
        ;;
esac 