# 🚀 Render Deployment Guide

## Quick Deploy Steps

### 1. Push render.yaml to GitHub

Your repository is ready! The `render.yaml` file is already configured.

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select repository: **`geetmehta989/currency-backend`**
5. Render will auto-detect `render.yaml`
6. Click **"Apply"**

#### Option B: Manual Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect repository: **`geetmehta989/currency-backend`**
4. Configure:
   - **Name**: `currency-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `REGION` = `AR` (or `BR` for Brazil)
   - `PORT` = (auto-set by Render, don't add)

6. Click **"Create Web Service"**

### 3. Wait for Deployment

- Build takes ~3-5 minutes
- Render logs will show progress
- Success when you see: "🚀 Server running on port..."

### 4. Access Your API

Your API will be live at:
```
https://currency-backend-xxxxx.onrender.com
```

---

## 🔧 Configuration Details

### Render.yaml Settings

```yaml
services:
  - type: web
    name: currency-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: REGION
        value: AR
    healthCheckPath: /health
    autoDeploy: true
```

### Environment Variables

- **NODE_ENV**: `production`
- **REGION**: `AR` (Argentina) or `BR` (Brazil)
- **PORT**: Automatically set by Render (uses `process.env.PORT || 10000`)

### Server Configuration

✅ **Port**: Uses `process.env.PORT || 10000`  
✅ **Host**: Binds to `0.0.0.0` (required for Render)  
✅ **CORS**: Enabled for all origins  
✅ **Database**: SQLite in project directory  
✅ **Health Check**: `/health` endpoint  

---

## 📊 API Endpoints

Once deployed, all endpoints will be accessible:

```
https://your-app.onrender.com/
https://your-app.onrender.com/health
https://your-app.onrender.com/quotes
https://your-app.onrender.com/average
https://your-app.onrender.com/slippage
```

---

## 🧪 Testing After Deployment

### 1. Health Check

```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "region": "AR",
  "timestamp": "2024-11-02T...",
  "uptime": 123.45
}
```

### 2. Get Quotes

```bash
curl https://your-app.onrender.com/quotes
```

### 3. Get Average

```bash
curl https://your-app.onrender.com/average
```

### 4. Get Slippage

```bash
curl https://your-app.onrender.com/slippage
```

---

## 🔄 Auto-Deploy

With `autoDeploy: true` in render.yaml:
- Every push to `main` branch triggers deployment
- Manual deploys also available

---

## 🆕 Manual Deploy Hook

Use this URL to trigger manual deployment:

```
https://api.render.com/deploy/srv-d43hrjodl3ps739umj4g?key=nRlzvSOtRAw
```

**⚠️ Keep this URL SECRET!** Don't share publicly.

To trigger deploy:
```bash
curl -X POST https://api.render.com/deploy/srv-d43hrjodl3ps739umj4g?key=nRlzvSOtRAw
```

---

## 🔍 Monitoring

### View Logs

1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. View real-time logs

### Check Health

Render monitors `/health` endpoint automatically.

---

## 💰 Pricing

**Free Tier**:
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on request
- 750 hours/month
- 512 MB RAM
- 0.5 CPU

**Paid Plans**:
- $7/month (Starter)
- Always-on
- No cold starts
- Better performance

---

## 🐛 Troubleshooting

### Build Fails

**Check**:
1. `package.json` is valid
2. Node version compatibility
3. Build logs for errors

**Fix**:
- Update dependencies
- Check Node version in `package.json` (should be ≥18)

### Server Won't Start

**Check**:
1. PORT is set correctly
2. Database path is writable
3. Start command is correct

**Fix**:
- Server already uses `process.env.PORT || 10000` ✅
- SQLite writes to project directory ✅
- Start command is `npm start` ✅

### Cold Start Delays

**Issue**: First request after 15 min is slow

**Solutions**:
1. Upgrade to paid plan
2. Use external uptime monitor (pings every 5 min)
3. Accept 30s wake-up delay

### Database Issues

**Check**:
1. Disk space available
2. Write permissions
3. Database file path

**Fix**:
- SQLite path is relative ✅
- Render provides writable disk ✅

---

## 🔒 Security

✅ CORS enabled for all origins  
✅ No sensitive data exposed  
✅ Environment variables secure  
✅ SQLite is file-based (private)  

---

## 📈 Performance Tips

1. **Caching**: Already implemented (60s auto-refresh)
2. **Database**: SQLite is fast for read-heavy workloads
3. **Concurrent Requests**: Express handles multiple requests
4. **Memory**: Monitor usage in Render dashboard

---

## 🎯 Next Steps After Deployment

1. **Test all endpoints**
2. **Set up monitoring** (optional)
3. **Configure custom domain** (optional)
4. **Set up uptime monitor** (optional)
5. **Share API URL** with users

---

## 📞 Support

- Render Docs: https://render.com/docs
- Your Repo: https://github.com/geetmehta989/currency-backend
- Render Support: https://render.com/support

---

**Ready to deploy! 🚀**

