# 🏗️ Faved Project Structure

This document explains the organization of the Faved codebase following clean code principles.

## 📁 Directory Overview

```
faved/
├── 🎨 frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components (organized by feature)
│   │   ├── store/        # MobX state management
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript type definitions
│   └── public/          # Static assets
│
├── 🔧 backend/          # PHP backend (MVC pattern)
│   ├── controllers/     # HTTP request handlers
│   ├── models/          # Data models and repository
│   ├── views/           # HTML templates
│   └── framework/       # Core framework components
│
├── 🗄️ storage/          # SQLite database files
│
├── 🛠️ scripts/          # Utility scripts
│   └── bookmark-import/ # Bookmark import/sync tools
│
├── 🐳 docker/           # Docker configurations
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
│
├── 📚 docs/             # Documentation
│   ├── PROJECT_STRUCTURE.md
│   └── API.md
│
└── 📦 utils/            # Shared utilities
    ├── BookmarkImporter.php
    ├── DOMParser.php
    └── util-functions.php
```

## 🎯 Architecture Principles

### Frontend (React + TypeScript)
- **Component-Based**: Each UI element is a reusable component
- **Type-Safe**: Full TypeScript for better developer experience
- **State Management**: MobX for reactive state updates
- **Modern Stack**: Vite, React 19, Tailwind CSS

### Backend (PHP)
- **MVC Pattern**: Clear separation of concerns
- **No Dependencies**: Custom lightweight framework
- **RESTful API**: Clean HTTP endpoints
- **SQLite**: Simple, file-based database

### Code Organization
- **Feature-Based**: Components grouped by feature, not file type
- **Single Responsibility**: Each file has one clear purpose
- **DRY Principle**: Shared utilities in `/utils`
- **Clean Imports**: Absolute paths configured

## 🔑 Key Files

### Entry Points
- `frontend/src/main.tsx` - React app entry
- `public/api/index.php` - API entry
- `init.php` - Backend bootstrap

### Configuration
- `Config.php` - App configuration
- `routes.php` - API route definitions
- `vite.config.ts` - Frontend build config

### Core Features
- `models/Repository.php` - Data access layer
- `store/mainStore.ts` - App state management
- `components/EditForm/` - Bookmark creation/editing

## 🚀 Development Workflow

1. **Backend changes**: Edit PHP files → Changes reflect immediately
2. **Frontend changes**: Edit React files → Vite hot-reloads
3. **Database changes**: SQLite file in `/storage`
4. **Import scripts**: Utilities in `/scripts/bookmark-import`

## 📝 Naming Conventions

### PHP
- **Classes**: PascalCase (`BookmarkImporter`)
- **Methods**: camelCase (`createBookmark`)
- **Files**: PascalCase matching class name

### TypeScript/React
- **Components**: PascalCase (`EditItemForm`)
- **Functions**: camelCase (`handleSubmit`)
- **Types**: PascalCase with suffix (`BookmarkType`)

### Database
- **Tables**: snake_case plural (`items`, `tags`)
- **Columns**: snake_case (`created_at`, `image_url`)

## 🧩 Extension Points

### Adding New Features
1. **New API endpoint**: Add to `routes.php`
2. **New UI component**: Create in `frontend/src/components`
3. **New data model**: Add to `models/`
4. **New utility**: Add to `utils/` or `scripts/`

### Import/Export
- Bookmark importers go in `utils/`
- Sync scripts go in `scripts/bookmark-import/`