#!/bin/bash

# Clean up temporary files and optimize the project

echo "🧹 Cleaning up Faved project..."

# Remove OS generated files
find . -name ".DS_Store" -type f -delete 2>/dev/null
find . -name "Thumbs.db" -type f -delete 2>/dev/null
find . -name "._*" -type f -delete 2>/dev/null

# Clean log files
find . -name "*.log" -type f -not -path "./node_modules/*" -delete 2>/dev/null

# Clean temporary files
find . -name "*.tmp" -type f -delete 2>/dev/null
find . -name "*.temp" -type f -delete 2>/dev/null
find . -name "*.cache" -type f -delete 2>/dev/null
find . -name "*.swp" -type f -delete 2>/dev/null
find . -name "*.swo" -type f -delete 2>/dev/null

# Clean build artifacts
rm -rf frontend/dist/* 2>/dev/null
rm -rf public/dist/* 2>/dev/null

# Clean TypeScript cache
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null

echo "✅ Cleanup complete!"

# Show disk usage
echo ""
echo "📊 Project size:"
du -sh . 2>/dev/null || echo "Unable to calculate size"

echo ""
echo "💡 Run 'npm install' in frontend/ and restart Docker if needed."