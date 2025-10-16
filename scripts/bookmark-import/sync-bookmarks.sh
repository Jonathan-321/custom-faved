#!/bin/bash

# Simple Bookmark Sync for Faved
# Run this to import all your bookmarks

cd "$(dirname "$0")"

echo "🚀 Faved Bookmark Sync"
echo "====================="
echo ""

# Check if containers are running
if ! docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "⚠️  Faved containers are not running!"
    echo "Run: docker compose -f docker-compose.dev.yml up -d"
    exit 1
fi

# Run the import
echo "📚 Importing bookmarks from your browsers..."
docker compose -f docker-compose.dev.yml exec apache-php php scripts/bookmark-import/import-bookmarks.php

echo ""
echo "✅ Sync complete!"
echo ""
echo "💡 Tips:"
echo "   - Run this script anytime to sync new bookmarks"
echo "   - Add to cron for automatic syncing"
echo "   - Your bookmarks are preserved in Faved even if deleted from browser"