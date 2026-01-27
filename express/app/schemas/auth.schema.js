import { z } from 'zod';

/**
 * Login validation schema
 * Requirements: 3-16 characters, at least 3 letters, alphanumeric + underscore/hyphen
 * @type {z.ZodString}
 */
export const loginSchema = z
  .string()
  .min(3, 'Login must be at least 3 characters')
  .max(16, 'Login must be at most 16 characters')
  .regex(/^(?=(?:.*[a-zA-Z]){3,})[a-zA-Z0-9_-]+$/, 'Login must contain at least 3 letters and only alphanumeric characters, underscores, or hyphens');

/**
 * Password validation schema
 * Requirements: minimum 8 characters, at least one lowercase, uppercase, digit, and special character
 * @type {z.ZodString}
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one digit')
  .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character (@$!%*?&)');

/**
 * User registration request schema
 * @type {z.ZodObject}
 */
export const registerSchema = z.object({
  login: loginSchema,
  password: passwordSchema,
});

/**
 * User login request schema
 * @type {z.ZodObject}
 */
export const loginRequestSchema = z.object({
  login: loginSchema,
  password: passwordSchema,
});
