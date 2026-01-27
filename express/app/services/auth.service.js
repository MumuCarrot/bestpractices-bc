import { usersRepository } from '../repos/user.repo.js';
import * as argon2 from 'argon2';
import { argon2Config } from '../config/argon2.config.js';
import { appConfig } from '../config/app.config.js';
import jwt from 'jsonwebtoken';
import { validateLogin, validatePassword } from '../utils/validators.js';

export const authService = {
  async register(login, password) {
    // Validate login and password
    if (!validateLogin(login)) {
      return { 
        success: false, 
        error: new Error('Invalid login') 
      };
    }
    if (!validatePassword(password)) {
      return { 
        success: false, 
        error: new Error('Invalid password') 
      };
    }

    // Hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: argon2Config.memoryCost,
      timeCost: argon2Config.timeCost,
      parallelism: argon2Config.parallelism,
    });
    
    // Create user
    const { data, error } = await usersRepository.create({ 
      login, 
      password: hashedPassword 
    });

    if (error) {
      return { 
        success: false, 
        error: new Error(`Failed to register user: ${error.message}`) 
      };
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: data.id }, appConfig.secretKey, { expiresIn: appConfig.accessTokenExpiresIn });
    const refreshToken = jwt.sign({ userId: data.id }, appConfig.secretKey, { expiresIn: appConfig.refreshTokenExpiresIn });

    // Return tokens
    return { success: true, data, accessToken, refreshToken };
  },

  async login(login, password) {
    // Validate login and password
    if (!validateLogin(login)) {
      return { 
        success: false, 
        error: new Error('Invalid login') 
      };
    }
    if (!validatePassword(password)) {
      return { 
        success: false, 
        error: new Error('Invalid password') 
      };
    }
    
    // Find user
    const { data: user, error: findError } = await usersRepository.findByLogin(login);

    if (findError || !user) {
      return { 
        success: false, 
        error: new Error('Invalid login or password') 
      };
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return { 
        success: false, 
        error: new Error('Invalid login or password') 
      };
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, appConfig.secretKey, { expiresIn: appConfig.accessTokenExpiresIn });
    const refreshToken = jwt.sign({ userId: user.id }, appConfig.secretKey, { expiresIn: appConfig.refreshTokenExpiresIn });
    
    // Return tokens
    return { success: true, data: userWithoutPassword, accessToken, refreshToken };
  },

  async refreshToken(refreshToken) {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, appConfig.secretKey);
    if (!decoded) {
      return { 
        success: false, 
        error: new Error('Invalid refresh token') 
      };
    }

    // Search user
    const { data: user, error: findError } = await usersRepository.findById(decoded.userId);
    if (findError || !user) {
      return { 
        success: false, 
        error: new Error('User not found') 
      };
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, appConfig.secretKey, { expiresIn: appConfig.accessTokenExpiresIn });
    const refreshToken = jwt.sign({ userId: user.id }, appConfig.secretKey, { expiresIn: appConfig.refreshTokenExpiresIn });
    
    // Return tokens
    return { success: true, data: userWithoutPassword, accessToken, refreshToken };
  }
};
