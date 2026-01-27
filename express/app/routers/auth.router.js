import express from 'express';
import { authService } from '../services/auth.service.js';
import { appConfig } from '../config/app.config.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginRequestSchema } from '../schemas/index.js';

const router = express.Router();

/**
 * POST /register
 * Registers a new user and sets authentication tokens in cookies
 * @route POST /register
 * @body {string} login - User login (validated by schema)
 * @body {string} password - User password (validated by schema)
 * @returns {Object} Success status and user data
 */
router.post('/register', validate(registerSchema), async (req, res) => {
  const { login, password } = req.body;

  const { success, data, error, accessToken, refreshToken } = await authService.register(login, password);

  if (!success) {
    res.status(400);
    return res.json({ success: false, error: error.message });
  }

  // Set authentication tokens in HTTP-only cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, appConfig.cookieOptions);

  res.status(201);
  res.json({ success: true, data });
});

/**
 * POST /login
 * Authenticates a user and sets authentication tokens in cookies
 * @route POST /login
 * @body {string} login - User login (validated by schema)
 * @body {string} password - User password (validated by schema)
 * @returns {Object} Success status and user data (without password)
 */
router.post('/login', validate(loginRequestSchema), async (req, res) => {
  const { login, password } = req.body;

  const { success, data, error, accessToken, refreshToken } = await authService.login(login, password);

  if (!success) {
    res.status(401);
    return res.json({ success: false, error: error.message });
  }

  // Set authentication tokens in HTTP-only cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, appConfig.cookieOptions);

  res.status(200);
  res.json({ success: true, data });
});

/**
 * GET /refresh-token
 * Refreshes authentication tokens using refresh token from cookies
 * @route GET /refresh-token
 * @cookie {string} refreshToken - Refresh token from HTTP-only cookie
 * @returns {Object} Success status and user data with new tokens
 */
router.get('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    return res.json({ success: false, error: 'Refresh token not provided' });
  }

  const { success, data, error, accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

  if (!success) {
    res.status(401);
    return res.json({ success: false, error: error.message });
  }

  // Set new authentication tokens in HTTP-only cookies
  res.cookie('accessToken', accessToken, appConfig.accessTokenCookieOptions);
  res.cookie('refreshToken', newRefreshToken, appConfig.cookieOptions);

  res.status(200);
  res.json({ success: true, data });
});

export default router;