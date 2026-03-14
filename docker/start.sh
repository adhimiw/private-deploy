#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/var/www/html"
BACKEND_DIR="$ROOT_DIR/backend"

mkdir -p "$ROOT_DIR/storage" "$ROOT_DIR/assets/uploads"
mkdir -p "$BACKEND_DIR/storage/framework/cache" "$BACKEND_DIR/storage/framework/sessions"
mkdir -p "$BACKEND_DIR/storage/framework/views" "$BACKEND_DIR/storage/logs" "$BACKEND_DIR/bootstrap/cache"
touch "$ROOT_DIR/storage/varman.sqlite"

chmod -R 777 "$ROOT_DIR/storage" "$ROOT_DIR/assets/uploads" "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"

if [ ! -f "$BACKEND_DIR/.env" ] && [ -f "$BACKEND_DIR/.env.example" ]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

cd "$BACKEND_DIR"

if ! grep -Eq '^APP_KEY=base64:' .env; then
  php artisan key:generate --force --ansi
fi

php artisan migrate --seed --force --ansi

cd "$ROOT_DIR"
exec apache2-foreground
