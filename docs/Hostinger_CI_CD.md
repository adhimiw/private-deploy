# Hostinger CI/CD

This project now includes a GitHub Actions workflow for deploying to Hostinger over SSH:

- Workflow file: `.github/workflows/hostinger-cicd.yml`
- Server script: `deploy.sh`

## What I found in hPanel on March 14, 2026

- SSH is enabled for `varmanconstructions.in`
- SSH host: `145.79.210.59`
- SSH port: `65002`
- SSH user: `u244089748`
- The `Deployments` page is currently configured as a `Node.js Web App`
- The current live deployment shown in hPanel is a manual ZIP upload: `private-deploy-main.zip`
- Searching the website menu for `Git` did not show a native Git deployment option for this site

That means the clean deployment path for this project is SSH-based CI/CD from GitHub Actions, not Hostinger's current manual Node deployment screen.

## Important mismatch

The Hostinger website runtime currently expects a Node/Express app, but this repository now runs as:

- static frontend from the repo root
- PHP API entrypoint in `api/`
- Laravel app in `backend/`

Before relying on CI/CD, the site should be served as a normal hosting app under `public_html`, not as a Hostinger Node.js app deployment.

## Recommended setup in hPanel

1. Keep SSH enabled.
2. On the `SSH Access` page, add an SSH key.
3. Put the private key in GitHub Secrets as `HOSTINGER_SSH_KEY`.
4. Use normal hosting under `public_html` for this repo content.
5. Stop using the manual ZIP-based Node.js deployment flow for this site.

## GitHub Secrets to add

Add these repository secrets in GitHub:

- `HOSTINGER_HOST`: `145.79.210.59`
- `HOSTINGER_PORT`: `65002`
- `HOSTINGER_USERNAME`: `u244089748`
- `HOSTINGER_SSH_KEY`: private key matching the public key added in hPanel

## How the workflow deploys

On push to `main2`:

1. Installs Node dependencies
2. Builds the frontend bundle
3. Installs PHP/Laravel backend dependencies with Composer
4. Creates a deployment tarball
5. Uploads it to Hostinger over SSH
6. Runs `deploy.sh` on the server

## What `deploy.sh` does

- extracts the uploaded release
- preserves `storage/config.php`
- preserves `storage/varman.sqlite`
- preserves `assets/uploads/`
- syncs the new release into `public_html`
- runs Laravel cache and migration commands when `php` is available
- warms `/` and `/api/health`

## First deployment checklist

1. Add the SSH public key in hPanel.
2. Add the GitHub repository secrets.
3. Push to `main2` or run the workflow manually.
4. Verify:
   - `https://varmanconstructions.in/`
   - `https://varmanconstructions.in/api/health`
   - `https://varmanconstructions.in/portal.html`
