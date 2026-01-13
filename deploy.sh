#!/bin/bash
# ============================================
# VARMAN CONSTRUCTIONS - Hostinger Deploy Script
# ============================================
# Run this script on your Hostinger server via SSH
# SSH Command: ssh -p 65002 u244089748@145.79.210.59

echo "🚀 Starting VARMAN CONSTRUCTIONS Deployment..."
echo "================================================"

# Navigate to public_html
cd ~/domains/varmanconstructions.in/public_html || {
    echo "❌ Error: Could not navigate to public_html"
    echo "Creating directory structure..."
    mkdir -p ~/domains/varmanconstructions.in/public_html
    cd ~/domains/varmanconstructions.in/public_html
}

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

# Navigate to backend
cd backend || {
    echo "❌ Error: Backend directory not found"
    exit 1
}

# Create logs directory
mkdir -p logs

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version || {
    echo "❌ Node.js is not available. Please enable Node.js in hPanel."
    exit 1
}

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# ============================================
# VARMAN CONSTRUCTIONS - Production Environment
# ============================================
NODE_ENV=production
PORT=3001

# JWT Secret - 64 character secure key
JWT_SECRET=a8f2c9d4e1b6a3f7e0d5c2b8a4f1e6d3c9b5a2f8e4d1c7b3a0f6e2d8c4b9a5f1

# CORS Origins
ALLOWED_ORIGINS=https://varmanconstructions.in,https://www.varmanconstructions.in
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting with PM2..."
    pm2 delete varman-constructions 2>/dev/null || true
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo "✅ PM2 process started"
else
    echo "⚠️  PM2 not found. Starting with Node directly..."
    echo "💡 To install PM2: npm install -g pm2"
    
    # Kill any existing node process on port 3001
    fuser -k 3001/tcp 2>/dev/null || true
    
    # Start in background
    nohup node server.js > logs/out.log 2> logs/err.log &
    echo "✅ Server started in background"
fi

# Verify server is running
sleep 3
if curl -s http://localhost:3001/api/health | grep -q "ok"; then
    echo ""
    echo "================================================"
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "================================================"
    echo ""
    echo "📌 Your website: https://varmanconstructions.in"
    echo "📌 Admin panel: https://varmanconstructions.in/admin.html"
    echo "📌 API health: https://varmanconstructions.in/api/health"
    echo ""
    echo "🔐 Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: varman@2024"
    echo "   ⚠️  Change password after first login!"
    echo ""
else
    echo ""
    echo "⚠️  Server may be starting... Check logs:"
    echo "   cat logs/out.log"
    echo "   cat logs/err.log"
fi

echo "================================================"
echo "Done!"
