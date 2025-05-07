# trove Makefile

.PHONY: up down build build-nocache logs clean frontend-backend-deps db-seed

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

build-nocache:
	docker compose build --no-cache

logs:
	docker compose logs -f

clean:
	docker compose down -v --remove-orphans
	rm -rf frontend/node_modules frontend/yarn.lock backend/venv backend/__pycache__

frontend-backend-deps:
	cd frontend && yarn install
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# For dev/testing ONLY
db-seed:
	docker compose exec db psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose run --rm dbt dbt deps --profiles-dir /app/profiles
	docker compose run --rm dbt dbt seed --profiles-dir /app/profiles
	docker compose run --rm dbt dbt run --profiles-dir /app/profiles 