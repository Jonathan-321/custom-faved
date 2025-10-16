#!/bin/bash

# Health check script for Faved

echo "🏥 Faved Health Check"
echo "===================="

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    # Try with full path
    if ! /Applications/Docker.app/Contents/Resources/bin/docker --version &> /dev/null; then
        echo "❌ Docker is not installed or not in PATH"
        exit 1
    else
        # Add Docker to PATH for this script
        export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
    fi
fi

# Check if containers are running
echo -n "🐳 Docker containers: "
if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "✅ Running"
else
    echo "❌ Not running"
    echo "   Run: docker compose -f docker-compose.dev.yml up -d"
fi

# Check frontend
echo -n "🎨 Frontend (http://localhost:5173): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Check backend
echo -n "🔧 Backend (http://localhost:8000): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q -E "200|403"; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Check database
echo -n "💾 Database: "
if [ -f "storage/faved.db" ]; then
    SIZE=$(du -h storage/faved.db | cut -f1)
    echo "✅ Exists ($SIZE)"
else
    echo "⚠️  Not created yet"
fi

# Check for common issues
echo ""
echo "📋 Quick Checks:"

# Check node_modules
echo -n "   - Frontend dependencies: "
if [ -d "frontend/node_modules" ]; then
    echo "✅ Installed"
else
    echo "❌ Run: cd frontend && npm install"
fi

# Check for .env file
echo -n "   - Environment file: "
if [ -f ".env" ]; then
    echo "✅ Exists"
else
    echo "ℹ️  Not needed (using defaults)"
fi

# Check git status
echo -n "   - Git status: "
if [ -d ".git" ]; then
    CHANGES=$(git status --porcelain | wc -l)
    if [ $CHANGES -eq 0 ]; then
        echo "✅ Clean"
    else
        echo "⚠️  $CHANGES uncommitted changes"
    fi
else
    echo "❌ Not a git repository"
fi

echo ""
echo "✅ Health check complete!"