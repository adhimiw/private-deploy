#!/bin/bash
# ============================================
# VARMAN CONSTRUCTIONS - Auto Deploy Script
# ============================================
# This script is called by the webhook to deploy changes

LOG_FILE="$HOME/deploy.log"
SITE_DIR="$HOME/domains/varmanconstructions.in/public_html"

echo "$(date): Deployment started" >> $LOG_FILE

cd $SITE_DIR || exit 1

# Set Node.js path
export PATH=/opt/alt/alt-nodejs18/root/usr/bin:$PATH

# Pull latest changes
git pull origin main2 >> $LOG_FILE 2>&1

# Install dependencies if package.json changed
cd backend
npm install --production >> $LOG_FILE 2>&1

# Restart Node.js server
pkill -f "node server.js" 2>/dev/null
sleep 2
nohup node server.js > logs/out.log 2> logs/err.log &

echo "$(date): Deployment completed" >> $LOG_FILE
echo "OK"
