# Trove Demo Environment Makefile

# Variables
SHELL := /bin/bash
DEPLOY_DIR := deploy
ENV_FILE := $(DEPLOY_DIR)/.env

# Load environment variables if file exists
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help dev-deps dev-up dev-down dev-build dev-logs db-seed deploy-%

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo
	@echo 'Development Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo
	@echo 'Deployment Targets (from deploy/Makefile):'
	@cd deploy && make help

check-env: ## Verify required environment variables are set
	@test -f $(ENV_FILE) || (echo "Error: $(ENV_FILE) not found. Copy env.example to .env first." && exit 1)
	@test -n "$(DOMAIN)" || (echo "Error: DOMAIN not set in $(ENV_FILE)" && exit 1)
	@test -n "$(EMAIL)" || (echo "Error: EMAIL not set in $(ENV_FILE)" && exit 1)
	@test -n "$(DB_PASSWORD)" || (echo "Error: DB_PASSWORD not set in $(ENV_FILE)" && exit 1)
	@test -n "$(GCP_PROJECT_ID)" || (echo "Error: GCP_PROJECT_ID not set in $(ENV_FILE)" && exit 1)

init-ssl: check-env ## Initialize SSL certificates
	@echo "Initializing SSL certificates..."
	@cd $(DEPLOY_DIR) && chmod +x init-letsencrypt.sh && ./init-letsencrypt.sh

build-images: check-env ## Build all Docker images locally
	@echo "Building Docker images..."
	docker compose -f $(DEPLOY_DIR)/docker-compose.yml build

push-images: check-env ## Push images to Google Container Registry
	@echo "Pushing images to GCR..."
	docker compose -f $(DEPLOY_DIR)/docker-compose.yml push

deploy-local: check-env ## Deploy stack locally
	@echo "Deploying locally..."
	docker compose -f $(DEPLOY_DIR)/docker-compose.yml up -d

deploy-prod: check-env ## Deploy to production (triggers GitHub Actions workflow)
	@echo "Triggering production deployment..."
	gh workflow run deploy.yml

clean: ## Stop and remove all containers, volumes
	@echo "Cleaning up..."
	docker compose -f $(DEPLOY_DIR)/docker-compose.yml down -v
	docker system prune -f

logs: ## View logs from all containers or specific service (use service=name)
	@if [ "$(service)" ]; then \
		docker compose -f $(DEPLOY_DIR)/docker-compose.yml logs -f $(service); \
	else \
		docker compose -f $(DEPLOY_DIR)/docker-compose.yml logs -f; \
	fi

restart: ## Restart all services or specific service (use service=name)
	@if [ "$(service)" ]; then \
		docker compose -f $(DEPLOY_DIR)/docker-compose.yml restart $(service); \
	else \
		docker compose -f $(DEPLOY_DIR)/docker-compose.yml restart; \
	fi

status: ## Check status of all services
	@echo "Checking service status..."
	docker compose -f $(DEPLOY_DIR)/docker-compose.yml ps

dev-deps: ## Install development dependencies
	cd frontend && yarn install
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

dev-up: ## Start development environment
	docker compose up -d

dev-down: ## Stop development environment
	docker compose down

dev-build: ## Build development containers
	docker compose build

dev-logs: ## View development logs
	docker compose logs -f

db-seed: ## Seed database with sample data (dev/testing only)
	docker compose exec db psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose run --rm dbt dbt deps --profiles-dir /app/profiles
	docker compose run --rm dbt dbt seed --profiles-dir /app/profiles
	docker compose run --rm dbt dbt run --profiles-dir /app/profiles

# Forward all deploy-* commands to the deploy/Makefile
deploy-%:
	@cd deploy && make $(subst deploy-,,$@) 