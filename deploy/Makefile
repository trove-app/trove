# Deployment-specific Makefile

# Variables
SHELL := /bin/bash
ENV_FILE := .env

# Load environment variables if file exists
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help check-env init-ssl build push deploy-local deploy-prod clean logs restart status

help: ## Show deployment-related help
	@echo 'Usage: make [target]'
	@echo
	@echo 'Deployment Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-env: ## Verify required environment variables are set
	@test -f $(ENV_FILE) || (echo "Error: $(ENV_FILE) not found. Copy env.example to .env first." && exit 1)
	@test -n "$(DOMAIN)" || (echo "Error: DOMAIN not set in $(ENV_FILE)" && exit 1)
	@test -n "$(EMAIL)" || (echo "Error: EMAIL not set in $(ENV_FILE)" && exit 1)
	@test -n "$(DB_PASSWORD)" || (echo "Error: DB_PASSWORD not set in $(ENV_FILE)" && exit 1)
	@test -n "$(GCP_PROJECT_ID)" || (echo "Error: GCP_PROJECT_ID not set in $(ENV_FILE)" && exit 1)

init-ssl: check-env ## Initialize SSL certificates
	@echo "Initializing SSL certificates..."
	@chmod +x init-letsencrypt.sh && ./init-letsencrypt.sh

build: check-env ## Build all Docker images locally
	@echo "Building Docker images..."
	docker compose build

push: check-env ## Push images to Google Container Registry
	@echo "Pushing images to GCR..."
	docker compose push

deploy-local: check-env ## Deploy stack locally
	@echo "Deploying locally..."
	docker compose up -d

deploy-prod: check-env ## Deploy to production (triggers GitHub Actions workflow)
	@echo "Triggering production deployment..."
	cd .. && gh workflow run deploy.yml

clean: ## Stop and remove all containers, volumes
	@echo "Cleaning up..."
	docker compose down -v
	docker system prune -f

logs: ## View logs from all containers or specific service (use service=name)
	@if [ "$(service)" ]; then \
		docker compose logs -f $(service); \
	else \
		docker compose logs -f; \
	fi

restart: ## Restart all services or specific service (use service=name)
	@if [ "$(service)" ]; then \
		docker compose restart $(service); \
	else \
		docker compose restart; \
	fi

status: ## Check status of all services
	@echo "Checking service status..."
	docker compose ps 