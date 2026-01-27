import { z } from 'zod';

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
      // Validate and parse request body data
      const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors into readable format
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  };
};
