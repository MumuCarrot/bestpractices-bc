import { supabase } from '../database/index.js';

/**
 * Creates a base repository with common CRUD operations for a given table
 * @param {string} table - Table name in Supabase database
 * @returns {Object} Repository object with CRUD methods
 */
export function createRepository(table) {
  return {
    /**
     * Finds a single record by ID
     * @param {string|number} id - Record ID
     * @returns {Promise<{data: any, error: any}>} Supabase response with data and error
     */
    async findById(id) {
      return supabase.from(table).select('*').eq('id', id).single()
    },

    /**
     * Finds records with pagination
     * @param {number} limit - Maximum number of records to return
     * @param {number} offset - Number of records to skip
     * @returns {Promise<{data: any[], error: any}>} Supabase response with data array and error
     */
    async findPaginated(limit, offset) {
      return supabase.from(table).select('*').limit(limit).offset(offset)
    },

    /**
     * Creates a new record
     * @param {Object} data - Data to insert
     * @returns {Promise<{data: any, error: any}>} Supabase response with created data and error
     */
    async create(data) {
      return supabase.from(table).insert(data)
    },

    /**
     * Updates an existing record by ID
     * @param {string|number} id - Record ID to update
     * @param {Object} data - Data to update
     * @returns {Promise<{data: any, error: any}>} Supabase response with updated data and error
     */
    async update(id, data) {
      return supabase.from(table).update(data).eq('id', id)
    },

    /**
     * Deletes a record by ID
     * @param {string|number} id - Record ID to delete
     * @returns {Promise<{data: any, error: any}>} Supabase response with deleted data and error
     */
    async delete(id) {
      return supabase.from(table).delete().eq('id', id)
    }
  }
}