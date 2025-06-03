# Deployment Makefile for Trove
# This Makefile contains deployment-specific commands and targets

SHELL := /bin/bash
ENV_FILE := .env

# Load environment variables if .env exists
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help check-env build push deploy-local deploy-prod clean logs restart status

help: ## Show this help message
	@echo "Deployment Targets:"
	@echo "  check-env     - Check required environment variables"
	@echo "  build         - Build Docker images locally"
	@echo "  push          - Push images to Artifact Registry"
	@echo "  deploy-prod   - Deploy to demo environment"
	@echo "  clean         - Clean up old images and containers"
	@echo "  logs          - Show service logs"
	@echo "  restart       - Restart all services"
	@echo "  status        - Show deployment status"

check-env: ## Check if required environment variables are set
	@echo "Checking required environment variables..."
	@test -n "$(DOMAIN)" || (echo "ERROR: DOMAIN is not set" && exit 1)
	@test -n "$(EMAIL)" || (echo "ERROR: EMAIL is not set" && exit 1)
	@test -n "$(DB_PASSWORD)" || (echo "ERROR: DB_PASSWORD is not set" && exit 1)
	@test -n "$(GCP_PROJECT_ID)" || (echo "ERROR: GCP_PROJECT_ID is not set" && exit 1)
	@test -n "$(GCR_HOSTNAME)" || (echo "ERROR: GCR_HOSTNAME is not set" && exit 1)
	@test -n "$(REPO_NAME)" || (echo "ERROR: REPO_NAME is not set" && exit 1)
	@test -n "$(IMAGE_TAG)" || (echo "ERROR: IMAGE_TAG is not set" && exit 1)
	@echo "All required environment variables are set ✓"

build: check-env ## Build Docker images locally
	@echo "Building Docker images..."
	@docker build -f ../frontend/prod.Dockerfile -t $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-frontend:$(IMAGE_TAG) ../frontend/
	@docker build -t $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-backend:$(IMAGE_TAG) ../backend/
	@echo "Images built successfully ✓"

push: check-env ## Push images to Artifact Registry
	@echo "Authenticating with Artifact Registry..."
	@gcloud auth configure-docker $(GCR_HOSTNAME) --quiet
	@echo "Pushing images to Artifact Registry..."
	@docker push $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-frontend:$(IMAGE_TAG)
	@docker push $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-backend:$(IMAGE_TAG)
	@docker tag $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-frontend:$(IMAGE_TAG) $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-frontend:latest
	@docker tag $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-backend:$(IMAGE_TAG) $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-backend:latest
	@docker push $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-frontend:latest
	@docker push $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(REPO_NAME)/trove-backend:latest
	@echo "Images pushed successfully ✓"

deploy-prod: check-env ## Deploy to production environment
	@echo "Deploying to production environment..."
	@chmod +x ./deploy.sh
	@./deploy.sh

clean: ## Clean up old images and containers
	@echo "Cleaning up old images and containers..."
	@docker system prune -af --filter "until=168h"
	@echo "Cleanup completed ✓"

logs: ## Show service logs
	@docker-compose logs -f

restart: ## Restart all services
	@echo "Restarting all services..."
	@docker-compose restart
	@echo "Services restarted ✓"

status: ## Show deployment status
	@echo "=== Deployment Status ==="
	@docker-compose ps
	@echo ""
	@echo "=== Service URLs ==="
	@echo "Frontend: http://$(DOMAIN)"
	@echo "Backend API: http://$(DOMAIN)/api" 