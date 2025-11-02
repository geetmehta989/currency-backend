const cron = require('node-cron');
const { fetchAllQuotes } = require('../services/fetchQuotes');
const db = require('../db/connection');

let cachedQuotes = [];
let lastFetchTime = null;
let region = process.env.REGION || 'AR';

// Initialize cache
async function initializeCache() {
  console.log(`Initializing cache for region: ${region}`);
  await refreshCache();
}

// Refresh cache by fetching new data
async function refreshCache() {
  try {
    console.log('Refreshing cache...');
    const quotes = await fetchAllQuotes(region);
    
    cachedQuotes = quotes;
    lastFetchTime = new Date();
    
    // Store in database
    if (quotes.length > 0) {
      const stmt = db.prepare('INSERT INTO quotes (source, buy_price, sell_price, region) VALUES (?, ?, ?, ?)');
      
      quotes.forEach(quote => {
        stmt.run(quote.source, quote.buy_price, quote.sell_price, region);
      });
      
      stmt.finalize();
      
      // Keep only last 10 fetches per region
      db.run(`
        DELETE FROM quotes 
        WHERE region = ? 
        AND id NOT IN (
          SELECT id FROM quotes 
          WHERE region = ? 
          ORDER BY created_at DESC 
          LIMIT 10
        )
      `, [region, region]);
    }
    
    console.log(`Cache refreshed at ${lastFetchTime.toISOString()}`);
  } catch (error) {
    console.error('Error refreshing cache:', error.message);
  }
}

// Get cached quotes
function getCachedQuotes() {
  return {
    quotes: cachedQuotes,
    lastFetchTime: lastFetchTime,
    isStale: lastFetchTime ? (Date.now() - lastFetchTime.getTime()) > 60000 : true
  };
}

// Schedule automatic refresh every 60 seconds
cron.schedule('*/60 * * * * *', () => {
  refreshCache();
});

// Also refresh on startup
initializeCache();

module.exports = {
  getCachedQuotes,
  refreshCache
};

