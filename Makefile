# Trove Development & Deployment Makefile

SHELL := /bin/bash
ENV_FILE := deploy/.env

# Load environment variables if file exists
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help up down build deploy clean logs test db-seed db-migrate test-frontend

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
db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	docker compose restart backend

db-seed: ## Reset and seed database (dev only!)
	@echo "Warning: This will erase all data! Press Ctrl+C to cancel..."
	@sleep 5
	docker compose exec sample_db psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose run --rm dbt dbt deps --profiles-dir /app/profiles
	docker compose run --rm dbt dbt seed --profiles-dir /app/profiles
	docker compose run --rm dbt dbt run --profiles-dir /app/profiles


# Utility Commands  
logs: ## Container-agnostic Docker logs with filtering (see CLAUDE.md for usage)
	@$(eval CONTAINER := $(or $(CONTAINER),$(service)))
	@$(eval LINES := $(or $(LINES),50))
	@$(eval SINCE := $(SINCE))
	@$(eval FILTER := $(FILTER))
	@$(eval EXCLUDE := $(EXCLUDE))
	@$(eval FOLLOW := $(FOLLOW))
	@$(eval LIST := $(LIST))
	@if [ "$(LIST)" = "true" ]; then \
		echo "Running Docker containers:"; \
		docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"; \
	elif [ "$(CONTAINER)" ]; then \
		echo "=== Logs for container: $(CONTAINER) ==="; \
		if [ "$(FOLLOW)" = "true" ]; then \
			if [ "$(FILTER)" ] && [ "$(EXCLUDE)" ]; then \
				docker logs -f --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -E "$(FILTER)" | grep -v -E "$(EXCLUDE)"; \
			elif [ "$(FILTER)" ]; then \
				docker logs -f --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -E "$(FILTER)"; \
			elif [ "$(EXCLUDE)" ]; then \
				docker logs -f --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -v -E "$(EXCLUDE)"; \
			else \
				docker logs -f --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER); \
			fi \
		else \
			if [ "$(FILTER)" ] && [ "$(EXCLUDE)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -E "$(FILTER)" | grep -v -E "$(EXCLUDE)"; \
			elif [ "$(FILTER)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -E "$(FILTER)"; \
			elif [ "$(EXCLUDE)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER) 2>&1 | grep -v -E "$(EXCLUDE)"; \
			else \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $(CONTAINER); \
			fi \
		fi \
	else \
		echo "=== Logs from all running containers (last $(LINES) lines each) ==="; \
		for container in $$(docker ps --format "{{.Names}}"); do \
			echo ""; \
			echo "=== $$container ==="; \
			if [ "$(FILTER)" ] && [ "$(EXCLUDE)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $$container 2>&1 | grep -E "$(FILTER)" | grep -v -E "$(EXCLUDE)" | head -20; \
			elif [ "$(FILTER)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $$container 2>&1 | grep -E "$(FILTER)" | head -20; \
			elif [ "$(EXCLUDE)" ]; then \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $$container 2>&1 | grep -v -E "$(EXCLUDE)" | head -20; \
			else \
				docker logs --tail $(LINES) $(if $(SINCE),--since $(SINCE)) $$container 2>&1 | head -20; \
			fi \
		done; \
		echo ""; \
		echo "=== Use 'make logs LIST=true' to see available containers ==="; \
		echo "=== Use 'make logs CONTAINER=<name>' for specific container ==="; \
	fi

clean: ## Clean up containers and volumes
	docker compose down -v
	docker system prune -f

test: ## Run tests
	cd backend && python -m pytest
test-frontend:
	cd frontend && npm test 