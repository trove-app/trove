#!/bin/bash
set -euo pipefail

# Source environment variables if .env exists
if [[ -f .env ]]; then
    source .env
fi

# Validate required environment variables
if [[ -z "${DOMAIN:-}" ]]; then
    echo "Error: DOMAIN environment variable is not set"
    exit 1
fi

# Function to check if Nginx is running
check_nginx() {
    if ! docker ps --format '{{.Names}}' | grep -q "^nginx$"; then
        echo "Error: Nginx container is not running"
        return 1
    fi
    return 0
}

# Function to reload Nginx configuration
reload_nginx() {
    echo "Reloading Nginx configuration..."
    docker exec nginx nginx -s reload
}

# Check if certificates directory exists
if [[ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]]; then
    echo "Error: SSL certificates directory not found"
    echo "Please run init-letsencrypt.sh first"
    exit 1
fi

# Check if Nginx is running
if ! check_nginx; then
    exit 1
fi

echo "Starting SSL certificate renewal process..."

# Stop Nginx temporarily
docker stop nginx

# Attempt to renew certificates
if ! certbot renew --non-interactive; then
    echo "Error: Certificate renewal failed"
    # Restart Nginx even if renewal fails
    docker start nginx
    exit 1
fi

# Start Nginx again
docker start nginx

# Reload Nginx configuration
if ! reload_nginx; then
    echo "Error: Failed to reload Nginx configuration"
    exit 1
fi

echo "SSL certificate renewal completed successfully!"

# Check certificate expiry
certbot certificates

# Add to crontab if not already present
if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
    (crontab -l 2>/dev/null; echo "0 0 1 * * cd $(pwd) && ./renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1") | crontab -
    echo "Added monthly renewal to crontab"
fi 