import { Injectable } from '@nestjs/common';
import { PasswordUtil } from '../../common/utils/password.util';
import { UserRepository } from '../database/repos/user.repo';
import { JwtUtil } from '../../common/utils/jwt.util';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordUtil: PasswordUtil,
    private readonly userRepository: UserRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly logger: LoggerService,
  ) {}


  /**
   * Registers a new user with the provided login and password.
   * Hashes the password, creates the user in the database, and generates authentication tokens.
   *
   * @param {string} login - User login identifier
   * @param {string} password - Plain text password to be hashed
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns an object with success status, user data, and tokens on success, or error on failure
   * @throws {Error} When user registration fails due to database errors
   */
  async register(login: string, password: string) {
    const hashedPassword = await this.passwordUtil.hashPassword(password);

    // Create user in database
    const { data, error } = await this.userRepository.create({
      login,
      password: hashedPassword,
    });

    if (error) {
      this.logger.error('Failed to register user', {
        login,
        error: error.message,
      });
      return { success: false, error: new Error(`Failed to register user: ${error.message}`) };
    }

    // Generate authentication tokens
    const { accessToken, refreshToken } = this.jwtUtil.generateTokens(data.id);

    this.logger.info('User registered successfully', {
      userId: data.id,
      login,
    });

    return { success: true, data, accessToken, refreshToken };
  }

  /**
   * Authenticates a user with the provided login and password.
   * Verifies credentials and generates new authentication tokens upon successful login.
   *
   * @param {string} login - User login identifier
   * @param {string} password - Plain text password to verify
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns an object with success status, user data (without password), and tokens on success,
   * or error on failure. Returns generic error message for security reasons.
   * @throws {Error} When login fails due to invalid credentials or user not found
   */
  async login(login: string, password: string) {
    // Find user by login
    const { data: user, error: findError } = await this.userRepository.findByLogin(login);

    if (findError || !user) {
      this.logger.warn('Login attempt failed - user not found', { login });
      return { success: false, error: new Error('Invalid login or password') };
    }

    // Verify password against stored hash
    const isPasswordValid = await this.passwordUtil.verifyPassword(user.password, password);

    if (!isPasswordValid) {
      this.logger.warn('Login attempt failed - invalid password', { login, userId: user.id });
      return { success: false, error: new Error('Invalid login or password') };
    }

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user;

    // Generate authentication tokens
    const { accessToken, refreshToken } = this.jwtUtil.generateTokens(user.id);

    this.logger.info('User logged in successfully', {
      userId: user.id,
      login,
    });

    return { success: true, data: userWithoutPassword, accessToken, refreshToken };
  }

  /**
   * Refreshes authentication tokens using a valid refresh token.
   * Verifies the refresh token, validates the user exists, and generates new access and refresh tokens.
   *
   * @param {string} token - Refresh token to verify and use for generating new tokens
   * @returns {Promise<{success: boolean, data?: any, accessToken?: string, refreshToken?: string, error?: Error}>}
   * Returns an object with success status, user data (without password), and new tokens on success,
   * or error on failure
   * @throws {Error} When token is invalid, expired, or user not found
   */
  async refreshToken(token: string) {
    try {
      const decoded = this.jwtUtil.verifyToken(token);

      if (!decoded || !decoded.userId) {
        this.logger.warn('Refresh token failed - invalid token format');
        return { success: false, error: new Error('Invalid refresh token') };
      }

      const { data: user, error: findError } = await this.userRepository.findById(decoded.userId);
      if (findError || !user) {
        this.logger.warn('Refresh token failed - user not found', { userId: decoded.userId });
        return { success: false, error: new Error('User not found') };
      }

      // Remove password from response for security
      const { password: _, ...userWithoutPassword } = user;

      // Generate new authentication tokens
      const { accessToken, refreshToken: newRefreshToken } = this.jwtUtil.generateTokens(user.id);

      this.logger.info('Token refreshed successfully', { userId: user.id });

      return { success: true, data: userWithoutPassword, accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        this.logger.warn('Refresh token failed - token expired');
        return { success: false, error: new Error('Refresh token has expired') };
      }
      if (error.name === 'JsonWebTokenError') {
        this.logger.warn('Refresh token failed - invalid token');
        return { success: false, error: new Error('Invalid refresh token') };
      }

      // Handle other unexpected errors
      this.logger.error('Refresh token failed - unexpected error', { error: error.message });
      return { success: false, error: new Error('Failed to verify refresh token') };
    }
  }
}