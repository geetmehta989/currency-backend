const express = require('express');
const router = express.Router();
const { getCachedQuotes } = require('../utils/cache');

router.get('/', (req, res) => {
  try {
    const { quotes } = getCachedQuotes();
    
    if (quotes.length === 0) {
      return res.status(503).json({
        error: 'No quotes available',
        message: 'Data is being fetched. Please try again in a moment.'
      });
    }
    
    // Calculate averages
    const totalBuy = quotes.reduce((sum, quote) => sum + quote.buy_price, 0);
    const totalSell = quotes.reduce((sum, quote) => sum + quote.sell_price, 0);
    const count = quotes.length;
    
    const averageBuyPrice = totalBuy / count;
    const averageSellPrice = totalSell / count;
    
    res.json({
      average_buy_price: parseFloat(averageBuyPrice.toFixed(2)),
      average_sell_price: parseFloat(averageSellPrice.toFixed(2)),
      source_count: count
    });
  } catch (error) {
    console.error('Error in /average route:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

