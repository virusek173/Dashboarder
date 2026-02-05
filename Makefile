# Build images
build:
	@echo "Building Docker images..."
	docker compose --env-file .env.local build
	
build-fresh:
	@echo "Building Docker images..."
	docker compose --env-file .env.local build --no-cache

# Start containers
up:
	@echo "Starting containers..."
	docker compose --env-file .env.local up -d
	@echo "Application running in Docker..."

# Stop containers
down:
	@echo "Stopping containers..."
	docker compose down

# Restart containers
restart:
	@echo "Restarting containers..."
	docker compose restart

hard-restart:
	@echo "Restarting containers..."
	docker compose down
	docker compose --env-file .env.local up -d --build

# Show logs
logs:
	@echo "Showing logs (Ctrl+C to exit)..."
	docker compose logs -f

# Open shell in app container
shell:
	@echo "Opening shell in app container..."
	docker compose exec app sh