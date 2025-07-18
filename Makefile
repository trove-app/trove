# Trove Development & Deployment Makefile

SHELL := /bin/bash
ENV_FILE := deploy/.env

# Load environment variables if file exists
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help up down build deploy clean logs test db-seed test-frontend

help: ## Show help message
	@echo 'Usage: make [target]'
	@echo
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development Commands
up: ## Start development environment
	docker compose up -d

down: ## Stop development environment
	docker compose down

build: ## Rebuild containers
	docker compose build

# Database Commands
db-seed: ## Reset and seed database (dev only!)
	@echo "Warning: This will erase all data! Press Ctrl+C to cancel..."
	@sleep 5
	docker compose exec db psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose run --rm dbt dbt deps --profiles-dir /app/profiles
	docker compose run --rm dbt dbt seed --profiles-dir /app/profiles
	docker compose run --rm dbt dbt run --profiles-dir /app/profiles


# Utility Commands
logs: ## View service logs (usage: make logs [service=name])
	@if [ "$(service)" ]; then \
		docker compose logs -f $(service); \
	else \
		docker compose logs -f; \
	fi

clean: ## Clean up containers and volumes
	docker compose down -v
	docker system prune -f

test: ## Run tests
	cd backend && python -m pytest
test-frontend:
	cd frontend && npm test 