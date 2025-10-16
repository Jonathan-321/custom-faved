# 🚀 Development Guide

This guide helps you get started with Faved development.

## Prerequisites

- Docker Desktop
- Node.js (optional, for running scripts)
- Git

## Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/Jonathan-321/custom-faved.git
cd custom-faved
```

### 2. Start Development Environment
```bash
docker compose -f docker-compose.dev.yml up
```

This starts:
- **Frontend**: http://localhost:5173 (React with hot-reload)
- **Backend**: http://localhost:8000 (PHP/Apache)

### 3. Create Database
Visit http://localhost:5173 and click "Create Database" on first run.

## Development Workflow

### Frontend Development
```bash
cd frontend
npm install  # First time only
npm run dev  # Start dev server
```

**Key files:**
- Components: `frontend/src/components/`
- State: `frontend/src/store/mainStore.ts`
- Types: `frontend/src/types/types.ts`

### Backend Development
PHP files are auto-reloaded. Just edit and refresh!

**Key files:**
- Routes: `routes.php`
- Controllers: `controllers/`
- Models: `models/Repository.php`

### Database
SQLite database at `storage/faved.db`

View/edit with:
```bash
sqlite3 storage/faved.db
.tables  # Show tables
.schema  # Show structure
```

## Common Tasks

### Import Bookmarks
```bash
./scripts/bookmark-import/auto-import-bookmarks.sh
```

### Add New API Endpoint
1. Create controller in `controllers/`
2. Add route in `routes.php`
3. Test: `curl http://localhost:8000/public/api/your-endpoint`

### Add New UI Component
1. Create component in `frontend/src/components/`
2. Use existing UI components from `frontend/src/components/ui/`
3. Add to relevant page/route

### Run Tests
```bash
# Frontend
cd frontend && npm run lint

# Backend (if tests exist)
docker compose exec apache-php php test.php
```

## Code Style

### PHP
- PSR-12 coding standard
- Type hints for parameters and returns
- Meaningful variable names

### TypeScript/React
- Functional components with hooks
- TypeScript for all new code
- Prettier/ESLint for formatting

## Debugging

### Frontend
- Browser DevTools
- React Developer Tools extension
- Add `console.log()` statements

### Backend
- Add `error_log()` statements
- Check Docker logs: `docker compose logs -f apache-php`
- Enable PHP errors in development

### Database
```bash
# View all bookmarks
sqlite3 storage/faved.db "SELECT * FROM items;"

# Check tags
sqlite3 storage/faved.db "SELECT * FROM tags;"
```

## Deployment

See main [README.md](../README.md) for production deployment instructions.