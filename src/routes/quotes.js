const express = require('express');
const router = express.Router();
const { getCachedQuotes } = require('../utils/cache');

router.get('/', (req, res) => {
  try {
    const { quotes, lastFetchTime, isStale } = getCachedQuotes();
    
    if (quotes.length === 0) {
      return res.status(503).json({
        error: 'No quotes available',
        message: 'Data is being fetched. Please try again in a moment.'
      });
    }
    
    res.json({
      data: quotes,
      lastFetchTime: lastFetchTime,
      isStale: isStale
    });
  } catch (error) {
    console.error('Error in /quotes route:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

