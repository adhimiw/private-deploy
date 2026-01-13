# 🚀 VARMAN CONSTRUCTIONS - Hostinger Deployment Guide

## Prerequisites
- Hostinger hosting plan with Node.js support (VPS or Cloud Hosting recommended)
- Domain connected to Hostinger
- SSH access enabled
- Node.js 18+ available

---

## 📁 Step 1: Prepare Files for Upload

### Files Structure
```
public_html/
├── .htaccess           (Apache config with security headers)
├── index.html          (Main website)
├── admin.html          (Admin panel)
├── app.js              (Frontend React app)
├── assets/             (Images and media)
│   ├── msand.webp
│   ├── psand.webp
│   └── ... (all images)
├── components/         (React components)
│   ├── Header.js
│   ├── Hero.js
│   └── ... (all components)
└── backend/            (Node.js API)
    ├── server.js       (Express server)
    ├── package.json    (Dependencies)
    ├── ecosystem.config.js  (PM2 config)
    ├── .env            (Environment variables - create from .env.example)
    └── data.json       (Data storage)
```

---

## 🔧 Step 2: Configure Hostinger

### Option A: Using Hostinger hPanel (Recommended for Beginners)

1. **Login to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com
   - Select your hosting plan

2. **Enable Node.js**
   - Navigate to "Advanced" → "Node.js"
   - Enable Node.js for your domain
   - Select Node.js version 18.x or higher

3. **Upload Files**
   - Go to "Files" → "File Manager"
   - Navigate to `public_html`
   - Upload all files (drag and drop or use upload button)

4. **Configure Node.js App**
   - Go back to "Node.js" section
   - Set application root: `/public_html/backend`
   - Set application startup file: `server.js`
   - Set Node.js version: `18.x`
   - Click "Create"

### Option B: Using SSH (Recommended for Advanced Users)

```bash
# 1. Connect via SSH
ssh u123456789@your-server.hostinger.com

# 2. Navigate to public_html
cd ~/domains/yourdomain.com/public_html

# 3. Clone the repository
git clone https://github.com/adhimiw/private-deploy.git .
git checkout main2

# 4. Install backend dependencies
cd backend
npm install --production

# 5. Create environment file
cp .env.example .env
nano .env
# Update JWT_SECRET and ALLOWED_ORIGINS

# 6. Install PM2 globally (if not installed)
npm install -g pm2

# 7. Start the application
pm2 start ecosystem.config.js --env production

# 8. Save PM2 process list
pm2 save

# 9. Setup PM2 startup (auto-restart on server reboot)
pm2 startup
```

---

## 🔐 Step 3: Configure Environment Variables

### Create `.env` file in the backend folder:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-64-character-random-string-here-generate-new
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Step 4: Configure Domain & SSL

1. **SSL Certificate**
   - Go to "SSL" in hPanel
   - Install free Let's Encrypt SSL
   - Wait for activation (usually instant)

2. **Force HTTPS**
   - The `.htaccess` file already handles this
   - Verify by visiting http://yourdomain.com (should redirect to https)

---

## 🔄 Step 5: Configure Node.js Proxy

### For Hostinger VPS with Apache:

The `.htaccess` file proxies `/api/*` requests to Node.js backend on port 3001.

If proxy doesn't work, you may need to enable `mod_proxy`:

```bash
# Contact Hostinger support or use hPanel to enable these modules:
# - mod_proxy
# - mod_proxy_http
```

### Alternative: Use Hostinger's Node.js App Settings

In hPanel → Node.js:
- Set the proxy path to route API requests to your Node.js app

---

## ✅ Step 6: Verify Deployment

1. **Check Website**
   - Visit https://yourdomain.com
   - All pages should load with proper styling

2. **Check API**
   - Visit https://yourdomain.com/api/health
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test Admin Login**
   - Visit https://yourdomain.com/admin.html
   - Login with: `admin` / `varman@2024`
   - **IMPORTANT:** Change password immediately!

4. **Check PM2 Status** (SSH)
   ```bash
   pm2 status
   pm2 logs varman-constructions
   ```

---

## 🔒 Step 7: Post-Deployment Security

### 1. Change Admin Password
After first login, change the default password in the admin panel.

### 2. Verify Security Headers
Use https://securityheaders.com to check your site's security headers.

### 3. Enable Firewall (VPS only)
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### 4. Monitor Logs
```bash
# View application logs
pm2 logs varman-constructions

# View error logs
pm2 logs varman-constructions --err
```

---

## 🛠️ Troubleshooting

### API Not Working
1. Check if Node.js is running: `pm2 status`
2. Check logs: `pm2 logs`
3. Verify PORT matches in .env and ecosystem.config.js
4. Ensure mod_proxy is enabled

### 502 Bad Gateway
- Node.js app crashed or not running
- Wrong port configuration
- Run `pm2 restart varman-constructions`

### CORS Errors
- Update ALLOWED_ORIGINS in .env
- Restart: `pm2 restart all`

### File Upload Issues
- Check folder permissions: `chmod 755 assets`
- Verify upload directory exists

### SSL Issues
- Wait for SSL propagation (up to 24 hours)
- Check SSL in hPanel is active

---

## 📞 Support

- **Hostinger Support:** https://www.hostinger.com/contact
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/usage/quick-start/

---

## 🔄 Updates

To update the site:

```bash
cd ~/domains/yourdomain.com/public_html
git pull origin main2
cd backend
npm install --production
pm2 restart varman-constructions
```

---

**🎉 Your VARMAN CONSTRUCTIONS website is now live and secure!**
