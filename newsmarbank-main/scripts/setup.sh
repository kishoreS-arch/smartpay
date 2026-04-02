#!/bin/bash
# SmartPay Setup Script
# Initializes the monorepo for development and deployment.

echo "📦 Initializing SmartPay Workspace..."

# 1. Install root dependencies
echo "Installing root dependencies..."
npm install

# 2. Install Backend dependencies
echo "Installing Backend dependencies..."
cd backend && npm install && cd ..

# 3. Install Frontend dependencies
echo "Installing Frontend dependencies..."
cd frontend && npm install && cd ..

# 4. Check for CLIs
echo "Checking for deployment tools..."
if ! command -v vercel &> /dev/null
then
    echo "⚠️ Vercel CLI not found. To deploy from terminal, run: npm install -g vercel"
else
    echo "✅ Vercel CLI is installed."
fi

echo "✨ Setup complete. Run 'npm run dev' to start development servers."
