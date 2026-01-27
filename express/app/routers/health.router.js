import { supabase } from '../database/index.js';
import express from 'express';

const router = express.Router();

/**
 * GET /
 * Basic health check endpoint
 * @route GET /
 * @returns {string} Health check status message
 */
router.get('/', async (req, res) => {
  res.send('Health check successful');
});

/**
 * GET /supabase
 * Checks Supabase database connection health
 * @route GET /supabase
 * @returns {string} Supabase connection status message
 */
router.get('/supabase', async (req, res) => {
  try {
    // Check Supabase connection using auth API (doesn't require any tables)
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      res.status(500);
      return res.send(`Supabase health check failed: ${error.message}`);
    }
    
    res.status(200);
    res.send('Supabase health check successful');
  } catch (error) {
    res.status(500);
    res.send(`Supabase health check failed: ${error.message}`);
  }
});

export default router;