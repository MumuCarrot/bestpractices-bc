import { supabase } from '../database/index.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  res.send('Health check successful');
});

router.get('/supabase', async (req, res) => {
  try {
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