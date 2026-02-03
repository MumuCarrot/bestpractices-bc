import { usersRepository } from '../repos/user.repo.js';
import * as argon2 from 'argon2';
import { argon2Config } from '../config/argon2.config.js';
import { appConfig } from '../config/app.config.js';
import jwt from 'jsonwebtoken';
import { log } from '../utils/logger.js';
import { generateTokens } from '../utils/jwt.js';

export const authService = {
  /**
   * Registers a new user and generates authentication tokens
   * @param {string} login - User login (validated by schema)
   * @param {string} password - User password (validated by schema)
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns success status, user data, and tokens on success, or error on failure
   */
  async register(login, password) {
    // Hash password using Argon2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: argon2Config.memoryCost,
      timeCost: argon2Config.timeCost,
      parallelism: argon2Config.parallelism,
    });
    
    // Create user in database
    const { data, error } = await usersRepository.create({ 
      login, 
      password: hashedPassword 
    });
    console.log(error)
    if (error) {
      log.error('Failed to register user', {
        login,
        error: error.message,
      });
      
      return { 
        success: false, 
        error: new Error(`Failed to register user: ${error.message}`) 
      };
    }

    // Generate authentication tokens
    const { accessToken, refreshToken } = generateTokens(data.id);

    log.info('User registered successfully', {
      userId: data.id,
      login,
    });

    return { success: true, data, accessToken, refreshToken };
  },

  /**
   * Authenticates a user and generates authentication tokens
   * @param {string} login - User login (validated by schema)
   * @param {string} password - User password (validated by schema)
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns success status, user data (without password), and tokens on success, or error on failure
   */
  async login(login, password) {
    // Find user by login
    const { data: user, error: findError } = await usersRepository.findByLogin(login);

    if (findError || !user) {
      log.warn('Login attempt failed - user not found', {
        login,
      });
      
      return { 
        success: false, 
        error: new Error('Invalid login or password') 
      };
    }

    // Verify password against stored hash
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      log.warn('Login attempt failed - invalid password', {
        login,
        userId: user.id,
      });
      
      return { 
        success: false, 
        error: new Error('Invalid login or password') 
      };
    }

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user;

    // Generate authentication tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    log.info('User logged in successfully', {
      userId: user.id,
      login,
    });
    
    return { success: true, data: userWithoutPassword, accessToken, refreshToken };
  },

  /**
   * Refreshes authentication tokens using a valid refresh token
   * @param {string} token - Refresh token from cookies
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns success status, user data (without password), and new tokens on success, or error on failure
   */
  async refreshToken(token) {
    try {
      // Verify refresh token (throws error if invalid or expired)
      const decoded = jwt.verify(token, appConfig.secretKey);
      
      if (!decoded || !decoded.userId) {
        log.warn('Refresh token failed - invalid token structure');
        
        return { 
          success: false, 
          error: new Error('Invalid refresh token') 
        };
      }

      // Find user by ID from token
      const { data: user, error: findError } = await usersRepository.findById(decoded.userId);
      if (findError || !user) {
        log.warn('Refresh token failed - user not found', {
          userId: decoded.userId,
        });
        
        return { 
          success: false, 
          error: new Error('User not found') 
        };
      }

      // Remove password from response for security
      const { password: _, ...userWithoutPassword } = user;

      // Generate new authentication tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
      
      log.info('Tokens refreshed successfully', {
        userId: user.id,
      });
      
      return { success: true, data: userWithoutPassword, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // Handle JWT errors (expired, invalid signature, etc.)
      if (error.name === 'TokenExpiredError') {
        log.warn('Refresh token failed - token expired');
        
        return { 
          success: false, 
          error: new Error('Refresh token has expired') 
        };
      }
      if (error.name === 'JsonWebTokenError') {
        log.warn('Refresh token failed - invalid token', {
          error: error.message,
        });
        
        return { 
          success: false, 
          error: new Error('Invalid refresh token') 
        };
      }
      
      // Handle other unexpected errors
      log.error('Refresh token failed - unexpected error', {
        error: error.message,
        stack: error.stack,
      });
      
      return { 
        success: false, 
        error: new Error('Failed to verify refresh token') 
      };
    }
  }
};
