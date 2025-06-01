#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Create directories for certbot
mkdir -p "./certbot/conf/live/$DOMAIN"
mkdir -p "./certbot/www"

# Stop any running containers
docker compose down

# Get SSL certificates
docker compose run --rm --entrypoint "\
  certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d $DOMAIN" certbot

echo "SSL certificates obtained successfully!"
echo "You can now update your nginx.conf to enable HTTPS and redeploy."

# Start the stack
docker compose up -d 