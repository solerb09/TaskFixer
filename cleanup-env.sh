#!/bin/bash

echo "🧹 Cleaning up environment files..."

# Delete .env.local since you're using .env for development
rm .env.local

echo "✅ Removed .env.local (you're using .env now)"
echo ""
echo "📋 Your setup:"
echo "  - .env = Development (test keys) ← Active"
echo "  - .env.production.backup = Production (live keys) ← Backup"
echo ""
echo "⚠️  Remember: When deploying to production, restore production keys!"
