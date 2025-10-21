#!/bin/bash
# Development setup script for timetracker-ui

set -e

echo "🚀 Setting up timetracker-ui for development..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ] || [ "$NODE_VERSION" -gt 16 ]; then
  echo "⚠️  Warning: Node $NODE_VERSION detected. This project requires Node 14-16."
  echo "   Run 'nvm use 14' to switch to the correct version."
  exit 1
fi

echo "✅ Node $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create config.json if it doesn't exist
if [ ! -f "static/config.json" ]; then
  echo "📝 Creating static/config.json from template..."
  cp static/config.json.dist static/config.json
  echo "✅ Created static/config.json (you can customize this file)"
else
  echo "✅ static/config.json already exists"
fi

# Install proxy service dependencies
echo "📦 Installing proxy service dependencies..."
cd srv && npm install
cd ..

echo ""
echo "✅ Setup complete! You can now run:"
echo ""
echo "   TIMETRACKER_URL=https://tt.netresearch.de/ npm run dev"
echo ""
echo "   The dev server will start on http://0.0.0.0:8081"
echo ""

