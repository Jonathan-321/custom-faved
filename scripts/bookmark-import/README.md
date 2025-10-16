# 📚 Bookmark Import Scripts

This folder contains utilities for importing and syncing bookmarks from various browsers into Faved.

## 🚀 Quick Start

### Import Chrome Bookmarks (Easiest)
```bash
./auto-import-bookmarks.sh
```
This opens the Faved import page where you can upload your exported bookmarks.

## 📁 Script Overview

### Core Import Scripts
- **`auto-import-bookmarks.sh`** - Opens Faved import page for manual bookmark upload
- **`import-cli.php`** - Direct database import (requires PHP in Docker)
- **`import-local.php`** - Import via API from your Mac
- **`import-bookmarks.php`** - Full-featured import with tag creation

### Sync & Automation
- **`sync-bookmarks.sh`** - One-command sync wrapper
- **`watch-bookmarks.sh`** - Auto-sync when bookmarks change (requires fswatch)
- **`bookmark-sync.js`** - Node.js sync implementation
- **`com.faved.bookmark-sync.plist`** - macOS LaunchAgent for scheduling

### Enhancement Scripts
- **`fetch-bookmark-images.js`** - Fetches missing images for imported bookmarks

## 📋 Usage Examples

### One-Time Import
1. Export bookmarks from Chrome: `Cmd+Shift+O` → ⋮ → Export bookmarks
2. Run: `./auto-import-bookmarks.sh`
3. Upload the exported HTML file

### Automatic Sync
```bash
# Watch for changes
./watch-bookmarks.sh

# Or schedule hourly syncs
launchctl load com.faved.bookmark-sync.plist
```

### Fetch Missing Images
```bash
node fetch-bookmark-images.js
```

## 🛠️ Requirements
- Docker containers must be running
- Node.js for JavaScript scripts
- fswatch for watch mode: `brew install fswatch`

## 📝 Notes
- Duplicates are automatically skipped
- Chrome folder structure is preserved as tags
- Images are not included in HTML exports (use fetch script after import)