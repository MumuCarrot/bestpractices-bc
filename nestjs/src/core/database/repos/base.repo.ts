import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase.provider';

/**
 * Base repository with common CRUD operations
 * Can be extended for specific entity repositories
 */
@Injectable()
export abstract class BaseRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    protected readonly supabase: SupabaseClient,
    protected readonly tableName: string,
  ) {}

  /**
   * Finds a single record by ID.
   *
   * @param {string | number} id - Record ID to search for
   * @returns {Promise<{data: any, error: any}>} Supabase response object with data (single record) and error
   */
  async findById(id: string | number) {
    return this.supabase.from(this.tableName).select('*').eq('id', id).single();
  }

  /**
   * Finds records with pagination support.
   * Retrieves a subset of records based on limit and offset parameters.
   *
   * @param {number} limit - Maximum number of records to return
   * @param {number} offset - Number of records to skip before starting to return results
   * @returns {Promise<{data: any[], error: any}>} Supabase response object with data array and error
   */
  async findPaginated(limit: number, offset: number) {
    return this.supabase
      .from(this.tableName)
      .select('*')
      .range(offset, offset + limit - 1);
  }

  /**
   * Creates a new record in the database.
   *
   * @param {Object} data - Data object to insert into the table
   * @returns {Promise<{data: any, error: any}>} Supabase response object with created data (single record) and error
   */
  async create(data: any) {
    return this.supabase.from(this.tableName).insert(data).select().single();
  }

  /**
   * Updates an existing record by ID.
   *
   * @param {string | number} id - Record ID to update
   * @param {Object} data - Partial data object containing fields to update
   * @returns {Promise<{data: any, error: any}>} Supabase response object with updated data (single record) and error
   */
  async update(id: string | number, data: any) {
    return this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
  }

  /**
   * Deletes a record by ID.
   *
   * @param {string | number} id - Record ID to delete
   * @returns {Promise<{data: any, error: any}>} Supabase response object with deleted data and error
   */
  async delete(id: string | number) {
    return this.supabase.from(this.tableName).delete().eq('id', id);
  }
}
