#!/bin/bash
# Hostinger deployment script for the Varman site.
# This expects a prebuilt release tarball uploaded by CI.

set -euo pipefail

SITE_DOMAIN="varmanconstructions.in"
DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/domains/$SITE_DOMAIN/public_html}"
DEPLOY_HOME="${DEPLOY_HOME:-$HOME/deployments/varman}"
ARCHIVE_PATH="${1:-$DEPLOY_HOME/release.tar.gz}"
RELEASE_DIR="$DEPLOY_HOME/current"
SHARED_STORAGE_DIR="$DEPLOY_HOME/shared-storage"
SHARED_UPLOADS_DIR="$DEPLOY_HOME/shared-uploads"

echo "[deploy] Starting deployment for $SITE_DOMAIN"
echo "[deploy] Deploy root: $DEPLOY_ROOT"
echo "[deploy] Archive: $ARCHIVE_PATH"

if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "[deploy] Release archive not found: $ARCHIVE_PATH"
  exit 1
fi

mkdir -p "$DEPLOY_ROOT" "$DEPLOY_HOME" "$SHARED_STORAGE_DIR" "$SHARED_UPLOADS_DIR"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

echo "[deploy] Extracting release archive"
tar -xzf "$ARCHIVE_PATH" -C "$RELEASE_DIR"

if [ ! -f "$RELEASE_DIR/dist/app.js" ] || [ ! -f "$RELEASE_DIR/dist/components/Header.js" ] || [ ! -f "$RELEASE_DIR/dist/tailwind.css" ]; then
  echo "[deploy] Missing required frontend build output in release archive (dist/*)."
  echo "[deploy] Aborting deployment to prevent MIME/script failures in production."
  exit 1
fi

mkdir -p "$RELEASE_DIR/storage" "$RELEASE_DIR/assets/uploads"

if [ -f "$SHARED_STORAGE_DIR/config.php" ]; then
  cp "$SHARED_STORAGE_DIR/config.php" "$RELEASE_DIR/storage/config.php"
elif [ -f "$DEPLOY_ROOT/storage/config.php" ]; then
  cp "$DEPLOY_ROOT/storage/config.php" "$RELEASE_DIR/storage/config.php"
elif [ -f "$RELEASE_DIR/storage/config.sample.php" ]; then
  cp "$RELEASE_DIR/storage/config.sample.php" "$RELEASE_DIR/storage/config.php"
fi

if [ -f "$SHARED_STORAGE_DIR/varman.sqlite" ]; then
  cp "$SHARED_STORAGE_DIR/varman.sqlite" "$RELEASE_DIR/storage/varman.sqlite"
elif [ -f "$DEPLOY_ROOT/storage/varman.sqlite" ]; then
  cp "$DEPLOY_ROOT/storage/varman.sqlite" "$RELEASE_DIR/storage/varman.sqlite"
else
  touch "$RELEASE_DIR/storage/varman.sqlite"
fi

if [ -d "$SHARED_UPLOADS_DIR" ] && [ "$(find "$SHARED_UPLOADS_DIR" -mindepth 1 -maxdepth 1 | wc -l)" -gt 0 ]; then
  cp -R "$SHARED_UPLOADS_DIR"/. "$RELEASE_DIR/assets/uploads/"
elif [ -d "$DEPLOY_ROOT/assets/uploads" ] && [ "$(find "$DEPLOY_ROOT/assets/uploads" -mindepth 1 -maxdepth 1 | wc -l)" -gt 0 ]; then
  cp -R "$DEPLOY_ROOT/assets/uploads"/. "$RELEASE_DIR/assets/uploads/"
fi

if command -v rsync >/dev/null 2>&1; then
  echo "[deploy] Syncing release to public_html"
  rsync -a --delete "$RELEASE_DIR"/ "$DEPLOY_ROOT"/
else
  echo "[deploy] rsync not available, using cp fallback"
  find "$DEPLOY_ROOT" -mindepth 1 -maxdepth 1 ! -name "storage" ! -name "assets" -exec rm -rf {} +
  mkdir -p "$DEPLOY_ROOT/assets/uploads" "$DEPLOY_ROOT/storage"
  cp -R "$RELEASE_DIR"/. "$DEPLOY_ROOT"/
fi

mkdir -p "$DEPLOY_ROOT/storage" "$DEPLOY_ROOT/assets/uploads"
cp "$DEPLOY_ROOT/storage/config.php" "$SHARED_STORAGE_DIR/config.php" 2>/dev/null || true
cp "$DEPLOY_ROOT/storage/varman.sqlite" "$SHARED_STORAGE_DIR/varman.sqlite" 2>/dev/null || true

rm -rf "$SHARED_UPLOADS_DIR"
mkdir -p "$SHARED_UPLOADS_DIR"
cp -R "$DEPLOY_ROOT/assets/uploads"/. "$SHARED_UPLOADS_DIR/" 2>/dev/null || true

chmod 755 "$DEPLOY_ROOT/storage" "$DEPLOY_ROOT/assets/uploads" || true
chmod 600 "$DEPLOY_ROOT/storage/config.php" 2>/dev/null || true
chmod 664 "$DEPLOY_ROOT/storage/varman.sqlite" 2>/dev/null || true

if command -v php >/dev/null 2>&1 && [ -f "$DEPLOY_ROOT/backend/artisan" ]; then
  echo "[deploy] Running Laravel maintenance commands"
  php "$DEPLOY_ROOT/backend/artisan" migrate --force || true
  php "$DEPLOY_ROOT/backend/artisan" db:seed --class=Database\\Seeders\\VarmanSeeder --force || true
  php "$DEPLOY_ROOT/backend/artisan" optimize:clear || true
  php "$DEPLOY_ROOT/backend/artisan" config:cache || true
  php "$DEPLOY_ROOT/backend/artisan" route:cache || true
fi

if command -v curl >/dev/null 2>&1; then
  echo "[deploy] Warming the application"
  curl -fsS "https://$SITE_DOMAIN/api/health" >/dev/null || true
  curl -fsS "https://$SITE_DOMAIN/" >/dev/null || true
fi

echo "[deploy] Deployment complete"
