#!/bin/bash
# Development setup script for timetracker-ui

set -e

echo "🚀 Setting up timetracker-ui for development..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "⚠️  Warning: Node $NODE_VERSION detected. This project requires Node 22+ (LTS)."
  echo "   Run 'nvm use 22' to switch to the correct version."
  exit 1
fi

echo "✅ Node $(node -v) detected"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) detected"

# Install dependencies
echo "📦 Installing dependencies with pnpm..."
pnpm install

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
cd srv && pnpm install
cd ..

echo ""
echo "✅ Setup complete! You can now run:"
echo ""
echo "   TIMETRACKER_URL=https://tt.netresearch.de/ pnpm dev"
echo ""
echo "   The dev server will start on http://0.0.0.0:8080"
echo ""

