#!/bin/bash

# Auto-import bookmarks to Faved
# This script exports Chrome bookmarks and imports them to Faved

echo "🔄 Faved Bookmark Auto-Import"
echo "============================="

# Check if Faved is running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ Faved is not running. Starting containers..."
    cd "$(dirname "$0")"
    export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
    docker compose -f docker-compose.dev.yml up -d
    echo "⏳ Waiting for Faved to start..."
    sleep 10
fi

# Open Faved import page in Chrome
echo "📚 Opening Faved import page..."
echo ""
echo "To import your bookmarks:"
echo "1. The import page will open in Chrome"
echo "2. Click 'Choose File'"
echo "3. Navigate to Chrome → File → Export Bookmarks"
echo "4. Save and select the exported file"
echo "5. Click 'Import'"
echo ""

# Open the import page
open -a "Google Chrome" http://localhost:5173/setup/import

echo "✅ Import page opened!"
echo ""
echo "💡 To automate this process:"
echo "   - Install this AppleScript as a Quick Action"
echo "   - Or run this script periodically"