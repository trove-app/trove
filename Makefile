# trove Makefile

.PHONY: up down build build-nocache logs clean frontend-backend-deps

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