# 🚀 SurveyHub Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Vercel account (free)
- Render account (free)

## Step 1: Prepare for Deployment

### 1.1 Initialize Git Repository
```bash
cd C:\SurveyHub
git init
git add .
git commit -m "Initial commit: Complete SurveyHub application"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `surveyhub`
4. Make it public
5. Don't initialize with README (we have one)
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/surveyhub.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend (Render)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your `surveyhub` repository
3. Configure:
   - **Name**: `surveyhub-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Add Environment Variables
In Render dashboard, go to Environment:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
PORT=5000
```

### 2.4 Get Backend URL
After deployment, copy your backend URL:
`https://surveyhub-backend-xxxx.onrender.com`

## Step 3: Update Frontend URLs

### 3.1 Update API Service
Replace `your-backend-url.onrender.com` in:
- `frontend/src/services/api.ts`
- `frontend/src/services/socket.ts`

With your actual Render backend URL.

## Step 4: Deploy Frontend (Vercel)

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Deploy Frontend
1. Click "New Project"
2. Import your `surveyhub` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variables (if needed)
```
NODE_ENV=production
```

## Step 5: Configure CORS

Update your backend CORS settings in `server/server.js`:
```javascript
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"],
    methods: ["GET", "POST"]
  }
});
```

## Step 6: Test Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API at your Render URL + `/api/health`
3. **Database**: Register a user and create a survey
4. **Real-time**: Test live response tracking

## Step 7: Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration

### Render:
1. Go to Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**
   - Update CORS origins in backend
   - Redeploy backend service

2. **MongoDB Connection**
   - Check MongoDB Atlas IP whitelist (0.0.0.0/0)
   - Verify connection string in environment variables

3. **Environment Variables**
   - Ensure all required env vars are set
   - Restart services after adding env vars

4. **Build Failures**
   - Check build logs in deployment dashboard
   - Ensure all dependencies are in package.json

## 📱 Final URLs

After successful deployment:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **API Health**: https://your-backend.onrender.com/api/health

## 🎉 Success!

Your SurveyHub application is now live and accessible worldwide!

Share your survey links and start collecting responses in real-time.