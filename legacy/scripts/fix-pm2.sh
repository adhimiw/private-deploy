#!/bin/bash
# ==========================================
# VARMAN CONSTRUCTIONS - PM2 AUTO-FIXER
# ==========================================
# Usage: ./fix-pm2.sh
# This script automatically finds Node, fixes paths, and restarts the server.

echo "🔧 Detecting Node.js environment..."

# 1. Find Node.js Path
NODE_BIN=$(ls -d /opt/alt/alt-nodejs*/root/usr/bin | sort -V | tail -n1)

if [ -z "$NODE_BIN" ]; then
    echo "❌ Error: Could not find Node.js installation."
    exit 1
fi

echo "✅ Node found at: $NODE_BIN"

# 2. Export Paths
export PATH=$PATH:$NODE_BIN:~/.npm-global/bin
echo "✅ PATH updated."

# 3. Check for PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 not found. Installing..."
    npm install -g pm2
else
    echo "✅ PM2 is ready."
fi

# 4. Navigate to Backend
cd ~/domains/varmanconstructions.in/public_html/backend || {
    echo "❌ Error: Could not find backend folder."
    exit 1
}

# 5. Restart Application
echo "🔄 Restarting Server..."
if pm2 restart varman-constructions; then
    echo "✅ Server restarted successfully!"
else
    echo "⚠️ Restart failed. Starting fresh..."
    pm2 start ecosystem.config.js --env production
fi

# 6. Save State
pm2 save
echo "💾 Process list saved."

# 7. Show Status
pm2 list
