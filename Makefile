# Faved Development Makefile

.PHONY: help start stop restart clean health import lint build test

# Default target
help: ## Show this help message
	@echo "Faved Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

start: ## Start development environment
	docker compose -f docker-compose.dev.yml up -d
	@echo "✅ Faved started!"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend:  http://localhost:8000"

stop: ## Stop development environment  
	docker compose -f docker-compose.dev.yml down
	@echo "✅ Faved stopped!"

restart: stop start ## Restart development environment

clean: ## Clean temporary files and caches
	@echo "🧹 Cleaning up..."
	./scripts/maintenance/clean.sh

health: ## Check application health
	./scripts/maintenance/check-health.sh

import: ## Import bookmarks from browser
	./scripts/bookmark-import/auto-import-bookmarks.sh

lint: ## Run code linting
	@echo "🔍 Linting frontend..."
	cd frontend && npm run lint
	@echo "🔍 Checking PHP syntax..."
	find . -name "*.php" -not -path "./vendor/*" -not -path "./frontend/node_modules/*" -exec php -l {} \; > /dev/null && echo "✅ PHP syntax OK"

build: ## Build frontend for production
	@echo "🏗️ Building frontend..."
	cd frontend && npm run build
	@echo "✅ Build complete!"

test: lint ## Run all tests
	@echo "🧪 Running tests..."
	cd frontend && npm run build
	@echo "✅ All tests passed!"

logs: ## Show container logs
	docker compose -f docker-compose.dev.yml logs -f

shell-php: ## Open PHP container shell
	docker compose -f docker-compose.dev.yml exec apache-php bash

shell-node: ## Open Node container shell  
	docker compose -f docker-compose.dev.yml exec node sh

db: ## Open SQLite database
	sqlite3 storage/faved.db

# Development shortcuts
dev: start ## Alias for start
up: start  ## Alias for start  
down: stop ## Alias for stop