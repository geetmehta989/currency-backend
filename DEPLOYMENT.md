# Deployment Guide

This guide covers deploying the Currency Backend API to various platforms.

## Quick Deploy Options

### 🚀 Render (Recommended)

**Steps:**

1. Visit [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select `currency-backend` repository
4. Configure the service:
   - **Name**: `currency-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `currency-backend` (if in subdirectory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Production`

5. Add Environment Variables:
   ```
   PORT=3000
   REGION=AR              # or BR for Brazil
   DATABASE_URL=sqlite:./quotes.db
   NODE_ENV=production
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (~5 minutes)
8. Your API will be live at: `https://currency-backend-xxx.onrender.com`

**Note**: Free tier sleeps after 15 minutes of inactivity. Upgrade to paid plan for 24/7 uptime.

---

### 🚂 Railway

**Steps:**

1. Visit [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `currency-backend` repository
4. Railway will auto-detect Node.js
5. Add Environment Variables in **Variables** tab:
   ```
   PORT=3000
   REGION=AR
   DATABASE_URL=sqlite:./quotes.db
   NODE_ENV=production
   ```
6. Click **"Deploy"**
7. Your API will be live at: `https://currency-backend-production.up.railway.app`

**Free tier**: $5 credit monthly

---

### ☁️ Heroku

**Steps:**

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create currency-backend-api`
4. Set environment variables:
   ```bash
   heroku config:set REGION=AR
   heroku config:set PORT=3000
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`
6. Your API will be live at: `https://currency-backend-api.herokuapp.com`

**Note**: Heroku free tier discontinued. Paid plans start at $5/month.

---

### 🔄 Vercel (Serverless)

**Requirements**: Add `vercel.json` configuration for Express compatibility.

**Steps:**

1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Import `currency-backend` repository
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `currency-backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave blank
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   PORT=3000
   REGION=AR
   DATABASE_URL=sqlite:./quotes.db
   NODE_ENV=production
   ```

5. Click **"Deploy"**

**Note**: Vercel is optimized for Next.js. For best Express.js experience, use Render or Railway.

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t currency-backend .

# Run container
docker run -p 3000:3000 \
  -e REGION=AR \
  -e DATABASE_URL=sqlite:./quotes.db \
  -e NODE_ENV=production \
  currency-backend
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REGION=AR
      - DATABASE_URL=sqlite:./quotes.db
      - NODE_ENV=production
    volumes:
      - ./quotes.db:/app/quotes.db
    restart: unless-stopped
```

Run: `docker-compose up -d`

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `REGION` | AR | Currency region (AR or BR) |
| `DATABASE_URL` | sqlite:./quotes.db | Database connection string |
| `NODE_ENV` | development | Environment (development/production) |

---

## Post-Deployment Checklist

- [ ] Server responds to `GET /health`
- [ ] `GET /quotes` returns data
- [ ] `GET /average` calculates correctly
- [ ] `GET /slippage` calculates correctly
- [ ] Data refreshes every 60 seconds
- [ ] CORS headers are set
- [ ] Error handling works
- [ ] Database persists data

---

## Monitoring

### Health Check

Set up a health check endpoint monitor:
- URL: `https://your-domain.com/health`
- Interval: Every 5 minutes
- Expected status: 200 OK

### Logs

View deployment logs:
- **Render**: Dashboard → Service → Logs
- **Railway**: Deploy → View Logs
- **Heroku**: `heroku logs --tail`

### Metrics

Monitor:
- Response time
- Error rate
- Memory usage
- Uptime percentage

---

## Troubleshooting

### Server Won't Start

1. Check Node.js version: `node -v` (must be ≥18)
2. Check logs for errors
3. Verify environment variables are set
4. Ensure port is not already in use

### Database Errors

1. Delete `quotes.db` and restart
2. Check write permissions
3. Verify `DATABASE_URL` is correct

### Scraping Fails

Websites may block automated requests:
1. Check if User-Agent header is set
2. Verify IP isn't blocked
3. Consider using rotating proxies (advanced)

### High Memory Usage

1. Check cache size
2. Limit stored fetch history
3. Monitor database size

---

## Security

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (automatic on most platforms)
- [ ] Rotate API keys if using external services
- [ ] Set up rate limiting (consider using `express-rate-limit`)
- [ ] Implement authentication if exposing sensitive data
- [ ] Regular dependency updates: `npm audit`

### Rate Limiting

Consider adding to `server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Scaling

### Horizontal Scaling

- Deploy multiple instances
- Use load balancer
- Shared database (PostgreSQL recommended for production)

### Vertical Scaling

- Upgrade server specs
- Optimize queries
- Add caching layer (Redis)

---

## Cost Estimation

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Render | Limited | $7/month |
| Railway | $5 credit | Pay-as-you-go |
| Heroku | None | $5-7/month |
| Vercel | Free for personal | $20/month |
| DigitalOcean | - | $6/month Droplet |

---

## Support

For deployment issues:
- Check platform documentation
- Open GitHub issue: https://github.com/geetmehta989/currency-backend/issues
- Review logs for errors

---

**Happy Deploying! 🚀**

