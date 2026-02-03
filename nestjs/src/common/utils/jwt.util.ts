import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtUtil {
  constructor(private configService: ConfigService) {}

  /**
   * Generates a pair of access and refresh tokens for a user.
   * Uses JWT with expiration times configured via environment variables.
   *
   * @param {string | number} userId - User ID to include in the token payload
   * @returns {{accessToken: string, refreshToken: string}} Object containing access and refresh tokens
   * @throws {Error} When SECRET_KEY is not configured in environment variables
   */
  generateTokens(userId: string | number): {
    accessToken: string;
    refreshToken: string;
  } {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    const accessTokenExpiresIn =
      this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '5m';
    const refreshTokenExpiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '1h';

    const payload = { userId };

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(payload, secretKey, {
      expiresIn: refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * Returns null if the token is invalid, expired, or malformed.
   *
   * @param {string} token - JWT token string to verify
   * @returns {object | null} Decoded token payload containing userId, or null if verification fails
   * @throws {Error} When SECRET_KEY is not configured in environment variables
   */
  verifyToken(token: string): any {
    try {
      const secretKey = this.configService.get<string>('SECRET_KEY');
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  }
}
