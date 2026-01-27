import express from 'express';
import { authService } from '../services/auth.service.js';
import { appConfig } from '../config/app.config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { login, password } = req.body;

  const { success, data, error, accessToken, refreshToken } = await authService.register(login, password);

  if (!success) {
    res.status(400);
    return res.send(error.message);
  }

  // Set tokens in cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, appConfig.cookieOptions);

  res.status(201);
  res.send(data);
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const { success, data, error, accessToken, refreshToken } = await authService.login(login, password);

  if (!success) {
    res.status(401);
    return res.send(error.message);
  }

  // Set tokens in cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, appConfig.cookieOptions);

  res.status(200);
  res.send(data);
});

router.get('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    return res.send('Refresh token not provided');
  }

  const { success, data, error, accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

  if (!success) {
    res.status(401);
    return res.send(error.message);
  }

  // Set new tokens in cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', newRefreshToken, appConfig.cookieOptions);

  res.status(200);
  res.send(data);
});

export default router;