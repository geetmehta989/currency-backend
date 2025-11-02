# Currency Backend API

A Node.js backend service that provides real-time USD currency quotes for Argentina (ARS) or Brazil (BRL), including averages and slippage calculations.

## Features

- 🌍 **Multi-source data**: Fetches quotes from 3 different sources
- 🇦🇷 **Argentina (ARS)**: Ambito, DolarHoy, Cronista
- 🇧🇷 **Brazil (BRL)**: Wise, Nubank, Nomad
- 🔄 **Auto-refresh**: Data updates every 60 seconds
- 📊 **Smart caching**: In-memory cache with database backup
- 📈 **Slippage calculation**: Compare prices across sources
- 🚀 **CORS enabled**: Ready for frontend integration
- 🗄️ **SQLite database**: Stores last 10 fetches per region

## Tech Stack

- **Node.js** + **Express.js**
- **Axios** for HTTP requests
- **Cheerio** for HTML scraping
- **SQLite3** for data persistence
- **node-cron** for scheduled tasks
- **dotenv** for configuration

## Project Structure

```
currency-backend/
├── src/
│   ├── server.js           # Main Express server
│   ├── routes/
│   │   ├── quotes.js       # /quotes endpoint
│   │   ├── average.js      # /average endpoint
│   │   └── slippage.js     # /slippage endpoint
│   ├── services/
│   │   └── fetchQuotes.js  # Web scraping logic
│   ├── utils/
│   │   └── cache.js        # Caching & refresh logic
│   └── db/
│       └── connection.js   # Database setup
├── .env                    # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md              # This file
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/geetmehta989/currency-backend.git
cd currency-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your preferences:

```env
PORT=3000
REGION=AR          # Use 'AR' for Argentina or 'BR' for Brazil
DATABASE_URL=sqlite:./quotes.db
NODE_ENV=development
```

### 4. Run the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. GET /quotes

Fetch live USD quotes from all sources.

**Response:**
```json
{
  "data": [
    {
      "buy_price": 140.30,
      "sell_price": 144.00,
      "source": "https://www.ambito.com/contenidos/dolar.html"
    },
    {
      "buy_price": 141.50,
      "sell_price": 145.20,
      "source": "https://www.dolarhoy.com"
    }
  ],
  "lastFetchTime": "2024-01-15T10:30:00.000Z",
  "isStale": false
}
```

### 2. GET /average

Get average buy and sell prices across all sources.

**Response:**
```json
{
  "average_buy_price": 141.20,
  "average_sell_price": 145.50,
  "source_count": 3
}
```

### 3. GET /slippage

Calculate percentage slippage for each source vs average.

**Response:**
```json
[
  {
    "source": "https://www.ambito.com/contenidos/dolar.html",
    "buy_price_slippage": 0.04,
    "sell_price_slippage": -0.06
  },
  {
    "source": "https://www.dolarhoy.com",
    "buy_price_slippage": 0.21,
    "sell_price_slippage": 0.28
  }
]
```

**Formula:** `slippage = (source_price - average_price) / average_price * 100`

### 4. GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "region": "AR",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

### 5. GET /

Root endpoint with API information.

## Data Sources

### Argentina (REGION=AR)
1. **Ambito**: https://www.ambito.com/contenidos/dolar.html
2. **DolarHoy**: https://www.dolarhoy.com
3. **Cronista**: https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB

### Brazil (REGION=BR)
1. **Wise**: https://wise.com/es/currency-converter/brl-to-usd-rate
2. **Nubank**: https://nubank.com.br/taxas-conversao/
3. **Nomad**: https://www.nomadglobal.com

## Caching & Performance

- **In-memory cache**: Instant responses
- **Auto-refresh**: Every 60 seconds via cron
- **Database backup**: Last 10 fetches stored in SQLite
- **Parallel fetching**: All sources fetched simultaneously
- **Graceful degradation**: Mock data if scraping fails

## Deployment

### Render

1. Create account at https://render.com
2. New > Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add `REGION`, `PORT`, etc.
5. Deploy!

### Railway

1. Create account at https://railway.app
2. New Project > Deploy from GitHub
3. Select repository
4. Add environment variables
5. Deploy!

### Vercel (with serverless adapter)

Requires additional configuration for Express compatibility.

### Environment Variables (Production)

```env
PORT=3000
REGION=AR
DATABASE_URL=sqlite:./quotes.db
NODE_ENV=production
```

## Development

### Project Setup

```bash
# Install dependencies
npm install

# Run development server with nodemon
npm run dev

# Run production server
npm start
```

### Code Structure

- **Routes**: Handle HTTP requests and responses
- **Services**: Business logic (web scraping)
- **Utils**: Shared utilities (caching, etc.)
- **Database**: SQLite connection and schema

### Testing Endpoints

```bash
# Get quotes
curl http://localhost:3000/quotes

# Get average
curl http://localhost:3000/average

# Get slippage
curl http://localhost:3000/slippage

# Health check
curl http://localhost:3000/health
```

## Troubleshooting

### Port Already in Use

Change `PORT` in `.env`:
```env
PORT=3001
```

### Database Errors

Delete `quotes.db` and restart:
```bash
rm quotes.db
npm start
```

### Scraping Failures

Websites may change their HTML structure. The service includes fallback mock data to ensure continuity.

### CORS Issues

CORS is already enabled. If issues persist, check request headers.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details.

## Author

**Geet Mehta**

- GitHub: [@geetmehta989](https://github.com/geetmehta989)

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation

---

**Built with ❤️ using Node.js and Express**
