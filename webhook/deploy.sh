#!/bin/bash
# ============================================
# VARMAN CONSTRUCTIONS - Auto Deploy Script (PHP)
# ============================================
# This script is called by the webhook to deploy changes

LOG_FILE="$HOME/deploy.log"
SITE_DIR="$HOME/domains/varmanconstructions.in/public_html"

echo "$(date): Deployment started" >> "$LOG_FILE"

cd "$SITE_DIR" || exit 1

git pull origin main2 >> "$LOG_FILE" 2>&1

# Ensure storage and upload directories exist
mkdir -p storage assets/uploads >> "$LOG_FILE" 2>&1

# Create config file if missing
if [ ! -f "storage/config.php" ]; then
    cp storage/config.sample.php storage/config.php >> "$LOG_FILE" 2>&1
fi

echo "$(date): Deployment completed" >> "$LOG_FILE"
echo "OK"
