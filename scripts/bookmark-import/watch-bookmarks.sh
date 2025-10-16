#!/bin/bash

# Faved Bookmark Auto-Sync
# Watches for bookmark changes and auto-imports

echo "🔄 Faved Bookmark Watcher Started"
echo "Watching Chrome bookmarks for changes..."
echo "Press Ctrl+C to stop"

WATCH_DIR="$HOME/Library/Application Support/Google/Chrome"
LAST_RUN=0
COOLDOWN=60  # Minimum seconds between imports

# Function to run import
run_import() {
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - LAST_RUN))
    
    if [ $TIME_DIFF -lt $COOLDOWN ]; then
        echo "⏳ Waiting... (cooldown: $((COOLDOWN - TIME_DIFF))s)"
        return
    fi
    
    echo ""
    echo "📚 Bookmark change detected! Importing..."
    cd "$(dirname "$0")"
    php import-bookmarks.php
    LAST_RUN=$CURRENT_TIME
    echo "✅ Import complete. Watching for more changes..."
}

# Initial import
run_import

# Watch for changes
fswatch -o "$WATCH_DIR"/*/Bookmarks | while read f; do
    run_import
done