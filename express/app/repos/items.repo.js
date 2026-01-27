import { createRepository } from './base.repo.js';

/**
 * Items repository with CRUD operations for items table
 * Extends base repository with common database methods
 * @type {Object}
 */
export const itemsRepository = createRepository('items');