# Build images
build:
	@echo "Building Docker images..."
	docker-compose build --no-cache

# Start containers
up:
	@echo "Starting containers..."
	docker-compose up -d --build
	@echo "Application running at http://localhost:3000"

# Stop containers
down:
	@echo "Stopping containers..."
	docker-compose down

# Restart containers
restart:
	@echo "Restarting containers..."
	docker-compose down
	docker-compose up -d --build
soft-restart:
	@echo "Restarting containers..."
	docker-compose restart

# Show logs
logs:
	@echo "Showing logs (Ctrl+C to exit)..."
	docker-compose logs -f

# Open shell in app container
shell:
	@echo "Opening shell in app container..."
	docker-compose exec app sh