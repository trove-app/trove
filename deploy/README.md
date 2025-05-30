# Trove Demo Environment Deployment

This directory contains the configuration and scripts for deploying Trove to a demo environment using Docker and Google Cloud Platform.

## Prerequisites

1. A GCP project with the following APIs enabled:
   - Compute Engine
   - Container Registry

2. A GCP service account with the following roles:
   - Storage Admin
   - Compute Instance Admin
   - IAP-secured Tunnel User

3. A domain name pointed to your GCP instance's IP address

## Directory Structure

```
deploy/
├── docker-compose.yml    # Production Docker Compose configuration
├── nginx.conf           # Nginx reverse proxy configuration
├── init-letsencrypt.sh  # Let's Encrypt SSL setup script
├── env.example          # Example environment variables
└── certbot/             # SSL certificate storage (created by init-letsencrypt.sh)
    ├── conf/           # Let's Encrypt configuration
    └── www/            # Let's Encrypt webroot
```

## Initial Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
   ```bash
   # Required
   DOMAIN=your-domain.com
   EMAIL=your-email@example.com
   DB_PASSWORD=secure_password_here
   GCP_PROJECT_ID=your-project-id
   ```

3. Initialize SSL certificates:
   ```bash
   chmod +x init-letsencrypt.sh
   ./init-letsencrypt.sh
   ```

## Deployment

The deployment process is handled by GitHub Actions, which will:
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to the demo environment

### Manual Deployment

If needed, you can deploy manually:

1. Pull the latest images:
   ```bash
   docker compose pull
   ```

2. Start the stack:
   ```bash
   docker compose up -d
   ```

3. Check the status:
   ```bash
   docker compose ps
   ```

### Health Checks

Monitor service health:
```bash
# Check all services
docker compose ps

# View logs
docker compose logs -f [service]

# Check Nginx configuration
docker compose exec nginx nginx -t
```

### SSL Certificates

Certificates auto-renew every 12 hours. To force renewal:
```bash
docker compose run --rm certbot renew
```

### Database

The database is ephemeral and recreated on each deployment. Important notes:
- Data is not persisted between deployments
- Use for demo purposes only
- For persistent data, modify the volume configuration in docker-compose.yml

### Troubleshooting

1. SSL Issues:
   ```bash
   # Check certificate status
   docker compose exec nginx openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -text -noout
   ```

2. Container Issues:
   ```bash
   # Check container logs
   docker compose logs [service]

   # Restart a service
   docker compose restart [service]
   ```

3. Nginx Issues:
   ```bash
   # Test configuration
   docker compose exec nginx nginx -t

   # Reload configuration
   docker compose exec nginx nginx -s reload
   ```

## Security Notes

1. Never commit `.env` files
2. Keep service account keys secure
3. Regularly rotate the database password
4. Monitor container logs for suspicious activity 