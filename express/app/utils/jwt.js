/**
 * Generates a pair of access and refresh tokens for a user
 * @param {string|number} userId - User ID
 * @returns {{accessToken: string, refreshToken: string}} Object containing access and refresh tokens
 */
export function generateTokens(userId) {
  const payload = { userId };
  
  const accessToken = jwt.sign(payload, appConfig.secretKey, { 
    expiresIn: appConfig.accessTokenExpiresIn 
  });
  
  const refreshToken = jwt.sign(payload, appConfig.secretKey, { 
    expiresIn: appConfig.refreshTokenExpiresIn 
  });
  
  return { accessToken, refreshToken };
}