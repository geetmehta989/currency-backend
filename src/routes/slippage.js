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
    
    // Calculate slippage for each source
    const slippageData = quotes.map(quote => {
      const buyPriceSlippage = ((quote.buy_price - averageBuyPrice) / averageBuyPrice) * 100;
      const sellPriceSlippage = ((quote.sell_price - averageSellPrice) / averageSellPrice) * 100;
      
      return {
        source: quote.source,
        buy_price_slippage: parseFloat(buyPriceSlippage.toFixed(2)),
        sell_price_slippage: parseFloat(sellPriceSlippage.toFixed(2))
      };
    });
    
    res.json(slippageData);
  } catch (error) {
    console.error('Error in /slippage route:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

