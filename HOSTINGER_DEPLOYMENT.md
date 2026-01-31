# 🚀 VARMAN CONSTRUCTIONS - Hostinger Deployment Guide (PHP)

## Prerequisites
- Hostinger shared hosting (PHP 8+)
- Domain connected to Hostinger
- SSH access (optional)
- SQLite enabled (default on PHP)

---

## 📁 File Structure (public_html)
```
public_html/
├── .htaccess
├── index.html
├── akka.html                (Admin panel)
├── app.js
├── assets/
│   ├── uploads/             (Uploaded images)
│   └── ...
├── components/
├── api/
│   ├── index.php            (API router)
│   ├── config.php           (loads env + storage/config.php)
│   └── lib/
├── storage/
│   ├── config.php           (create from sample)
│   ├── varman.sqlite        (auto-created)
│   └── uploads/             (optional)
└── robots.txt
```

---

## ✅ Step 1: Upload Files
Use **File Manager** or **SSH** to upload the repository contents into `public_html`.

---

## ✅ Step 2: Create Config
Copy the sample config and update SMTP + JWT secret:

```bash
cp storage/config.sample.php storage/config.php
```

Edit `storage/config.php`:
```php
return [
  'jwt_secret' => 'your-long-random-secret',
  'admin_email' => 'info@varmanconstructions.in',
  'admin_whatsapp' => '919944508736',
  'default_country_code' => '91',
  'smtp' => [
    'host' => 'smtp.yourmail.com',
    'port' => 587,
    'user' => 'user@yourmail.com',
    'pass' => 'app-password',
    'from' => 'user@yourmail.com',
    'secure' => 'tls'
  ]
];
```

---

## ✅ Step 3: Set Permissions
```bash
chmod 755 storage assets/uploads
chmod 600 storage/config.php
```

---

## ✅ Step 4: Test
- Website: `https://yourdomain.com`
- Admin panel: `https://yourdomain.com/akka.html`
- API health: `https://yourdomain.com/api/health`

Default admin login:
- **Username:** admin
- **Password:** varman@2024

> Change the password after first login.

---

## 🔒 Security Notes
- `storage/` is blocked from public access by `.htaccess`.
- `api/lib` and `api/config.php` are blocked via `api/.htaccess`.
- Uploads are stored in `assets/uploads/` and PHP execution is blocked there.

---

## 🧰 Optional: SSH Deploy Script
Use `deploy.sh` (updated for PHP) if you prefer CLI deployment.
