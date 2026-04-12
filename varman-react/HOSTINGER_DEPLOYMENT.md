# 🚀 VARMAN CONSTRUCTIONS – Hostinger Deployment Guide

> **Stack:** React 19 SPA + Laravel 12 API + MySQL  
> **Updated:** April 2026

---

## Deployment Options

| Option | Plan Required | Best For |
|--------|--------------|----------|
| **A. Shared Hosting** | Business Web Hosting+ | Budget, simple setup |
| **B. VPS (Docker)** | KVM 1+ | Full control, Docker support |

---

## Option A: Shared Hosting Deployment

### Prerequisites
- Hostinger Business plan or higher (SSH access required)
- PHP 8.2+ enabled in hPanel
- MySQL database created
- Domain connected

### 1. Create MySQL Database (hPanel)

1. Go to **hPanel → Databases → MySQL Databases**
2. Create database: `u244089748_varman`
3. Create user and assign to database with **ALL PRIVILEGES**
4. Note: DB host is typically `localhost` on shared hosting

### 2. Directory Structure on Hostinger

```
/home/u244089748/
├── domains/
│   └── varmanconstructions.com/
│       └── public_html/          ← Web root (React SPA + Laravel public)
│           ├── index.html         ← React SPA entry point
│           ├── assets/            ← Vite-built React JS/CSS
│           ├── .htaccess          ← Routing rules
│           └── api/               ← Symlink → /laravel/public
├── laravel/                       ← Laravel app (OUTSIDE public_html)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   └── public/                    ← Symlinked into public_html/api
└── storage/                       ← Shared uploads folder
```

### 3. Build React SPA Locally

```bash
cd varman-react/frontend
npm install
npm run build
```

This creates `varman-react/frontend/dist/` with `index.html` + `assets/`.

### 4. Upload Files via SSH

```bash
# SSH into Hostinger
ssh u244089748@your-server-ip -p 65002

# Create Laravel directory
mkdir -p ~/laravel

# Exit SSH, then upload from local machine:

# Upload Laravel backend (excluding vendor, node_modules)
rsync -avz --exclude='vendor' --exclude='node_modules' --exclude='storage/logs/*' \
  backend/ u244089748@your-server-ip:~/laravel/ -e "ssh -p 65002"

# Upload React build to public_html
rsync -avz varman-react/frontend/dist/ \
  u244089748@your-server-ip:~/domains/varmanconstructions.com/public_html/ -e "ssh -p 65002"

# Upload shared assets
rsync -avz assets/ \
  u244089748@your-server-ip:~/domains/varmanconstructions.com/public_html/assets/ -e "ssh -p 65002"
```

### 5. Setup Laravel on Server (SSH)

```bash
ssh u244089748@your-server-ip -p 65002

# Install Composer dependencies
cd ~/laravel
php composer.phar install --no-dev --optimize-autoloader

# Create .env
cp .env.example .env
nano .env
```

**Edit `.env`:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://varmanconstructions.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u244089748_varman
DB_USERNAME=u244089748_varman
DB_PASSWORD=YOUR_DB_PASSWORD

JWT_SECRET=your-strong-random-secret-here
ADMIN_DEFAULT_PASS=your-secure-admin-password
```

```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed default admin user
php artisan db:seed --force

# Set permissions
chmod -R 775 storage bootstrap/cache
```

### 6. Create Symlink for API

```bash
# Create symlink so /api points to Laravel's public folder
cd ~/domains/varmanconstructions.com/public_html
ln -s ~/laravel/public api
```

### 7. Configure .htaccess (public_html)

Create `~/domains/varmanconstructions.com/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # If request is for /api, let the symlink handle it (Laravel)
    RewriteRule ^api(/.*)?$ api/$1 [L]

    # If the request is for a real file or directory, serve it
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # SPA fallback: serve index.html for all other routes
    RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json
    AddOutputFilterByType DEFLATE application/javascript text/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

### 8. Configure Laravel .htaccess (api/)

The symlinked `api/` directory uses Laravel's built-in `public/.htaccess`. Make sure it exists at `~/laravel/public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 9. Verify Deployment

```bash
# Test API health
curl https://varmanconstructions.com/api/health

# Test frontend
curl -I https://varmanconstructions.com/

# Test admin page (should return SPA HTML)
curl -I https://varmanconstructions.com/admin/login
```

---

## Option B: VPS Deployment (Docker)

### Prerequisites
- Hostinger KVM VPS (Ubuntu 22.04+)
- Docker & Docker Compose installed
- Domain DNS pointing to VPS IP

### 1. Initial VPS Setup

```bash
# SSH into VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# Create non-root user
adduser varman
usermod -aG docker varman
su - varman
```

### 2. Clone & Deploy

```bash
git clone https://github.com/your-repo/varman-constructions.git
cd varman-constructions

# Create production .env
cp backend/.env.example backend/.env
nano backend/.env
# Set DB_CONNECTION=mysql, production credentials, etc.

# Build and run
docker compose up -d --build

# Verify
curl http://localhost:8080/api/health
```

### 3. Setup Nginx Reverse Proxy + SSL

```bash
apt install nginx certbot python3-certbot-nginx -y

cat > /etc/nginx/sites-available/varman << 'EOF'
server {
    server_name varmanconstructions.com www.varmanconstructions.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/varman /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL certificate
certbot --nginx -d varmanconstructions.com -d www.varmanconstructions.com
```

---

## Quick Deploy Script (Shared Hosting)

Save as `deploy_hostinger.sh` and run locally:

```bash
#!/bin/bash
set -e

HOST="u244089748@your-server-ip"
PORT=65002
DOMAIN_DIR="~/domains/varmanconstructions.com/public_html"
LARAVEL_DIR="~/laravel"

echo "🔨 Building React SPA..."
cd varman-react/frontend && npm run build && cd ../..

echo "📤 Uploading React build..."
rsync -avz --delete varman-react/frontend/dist/ "$HOST:$DOMAIN_DIR/" -e "ssh -p $PORT"

echo "📤 Uploading Laravel..."
rsync -avz --delete --exclude='vendor' --exclude='.env' --exclude='storage/logs/*' \
  --exclude='storage/framework/cache/*' --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' --exclude='node_modules' \
  backend/ "$HOST:$LARAVEL_DIR/" -e "ssh -p $PORT"

echo "📤 Uploading assets..."
rsync -avz assets/ "$HOST:$DOMAIN_DIR/assets/" -e "ssh -p $PORT"

echo "🔧 Running post-deploy on server..."
ssh -p $PORT $HOST << 'REMOTE'
cd ~/laravel
php composer.phar install --no-dev --optimize-autoloader --quiet
php artisan migrate --force
php artisan config:cache
php artisan route:cache
chmod -R 775 storage bootstrap/cache
echo "✅ Deploy complete!"
REMOTE
```

---

## Environment Variables Reference

| Variable | Shared Hosting | Docker | Description |
|----------|---------------|--------|-------------|
| `APP_ENV` | `production` | `production` | Environment mode |
| `APP_DEBUG` | `false` | `false` | Disable debug in production |
| `DB_CONNECTION` | `mysql` | `sqlite` or `mysql` | Database driver |
| `DB_HOST` | `localhost` | `mysql` (container) | DB host |
| `DB_DATABASE` | `u244089748_varman` | `/var/www/html/storage/varman.sqlite` | DB name/path |
| `JWT_SECRET` | Random 64-char string | Random 64-char string | JWT signing key |
| `ADMIN_DEFAULT_PASS` | Strong password | `varman@2024` (change!) | Default admin password |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 error on `/api/*` | Check `~/laravel/storage/logs/laravel.log` |
| SPA routes return 404 | Verify `.htaccess` rewrite rules in public_html |
| API symlink broken | Re-create: `ln -sf ~/laravel/public ~/domains/.../public_html/api` |
| Permission denied | `chmod -R 775 storage bootstrap/cache` |
| MySQL connection refused | Verify DB credentials in `.env`, check `localhost` vs `127.0.0.1` |
| CORS errors | Ensure `api.headers` middleware sends correct headers |
| CSS/JS not loading | Clear browser cache; verify Vite build output |
