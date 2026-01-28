import { z } from 'zod';
import { log } from '../utils/logger.js';

/**
 * Middleware factory for validating request body using Zod schema
 * @param {z.ZodSchema} schema - Zod schema for validation
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  /**
   * Express middleware that validates request body against Zod schema
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  return (req, res, next) => {
    try {
      // Ensure req.body exists (can be undefined for empty requests)
      const body = req.body || {};
      
      // Validate and parse request body data
      const validatedData = schema.parse(body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format Zod errors into clean, readable format
        const errors = err.issues.map((issue) => {
          const field = issue.path && issue.path.length > 0 ? issue.path.join('.') : 'body';
          
          // Create user-friendly error message
          let message = issue.message || 'Invalid value';
          
          // Improve message for common error types
          if (issue.code === 'invalid_type') {
            if (issue.received === 'undefined') {
              message = `${field === 'body' ? 'Request body' : `Field "${field}"`} is required`;
            } else {
              message = `${field === 'body' ? 'Request body' : `Field "${field}"`} must be ${issue.expected}, received ${issue.received}`;
            }
          }
          
          return {
            field,
            message,
          };
        });

        // Log validation error
        log.warn('Request validation failed', {
          method: req.method,
          url: req.originalUrl,
          errors: errors.map(e => `${e.field}: ${e.message}`).join(', '),
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Request validation failed. Please check the details.',
          details: errors,
        });
      } else {
        // Handle unexpected errors
        const errorMessage = err?.message || 'Invalid request body';
        
        log.error('Unexpected validation error', {
          method: req.method,
          url: req.originalUrl,
          error: errorMessage,
          stack: err?.stack,
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: errorMessage,
          details: [{
            field: 'body',
            message: errorMessage,
          }],
        });
      }
    }
  };
};
