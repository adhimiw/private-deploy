#!/bin/bash
# ============================================
# VARMAN CONSTRUCTIONS - Hostinger Deploy Script (PHP)
# ============================================
# Run this script on your Hostinger server via SSH

set -e

echo "🚀 Starting VARMAN CONSTRUCTIONS Deployment..."
echo "================================================"

SITE_DIR="$HOME/domains/varmanconstructions.in/public_html"

# Navigate to public_html
if [ ! -d "$SITE_DIR" ]; then
    echo "📁 Creating public_html directory..."
    mkdir -p "$SITE_DIR"
fi

cd "$SITE_DIR"

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please contact Hostinger support."
    exit 1
fi

# Clone or pull the repository
if [ -d ".git" ]; then
    echo "📥 Updating existing repository..."
    git fetch origin
    git checkout main2
    git pull origin main2
else
    echo "📥 Cloning repository..."
    git clone https://github.com/adhimiw/private-deploy.git .
    git checkout main2
fi

# Ensure storage and upload directories exist
mkdir -p storage assets/uploads

# Create config file if missing
if [ ! -f "storage/config.php" ]; then
    echo "📝 Creating storage/config.php from sample..."
    cp storage/config.sample.php storage/config.php
fi

# Set safe permissions
chmod 755 storage assets/uploads || true
chmod 600 storage/config.php || true

# Optional: warm up the API (Apache/PHP should handle this)
if command -v curl &> /dev/null; then
    echo "🔍 Warming up API..."
    curl -s https://varmanconstructions.in/api/health >/dev/null || true
fi

echo "================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================================"
echo "📌 Website: https://varmanconstructions.in"
echo "📌 Admin panel: https://varmanconstructions.in/akka.html"
echo "📌 API health: https://varmanconstructions.in/api/health"
echo "------------------------------------------------"
echo "🔐 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: varman@2024"
echo "   ⚠️  Change password after first login!"
