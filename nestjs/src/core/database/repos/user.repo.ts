import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase.provider';
import { BaseRepository } from './base.repo';

/**
 * User repository with user-specific database operations
 * Extends base repository with additional user-specific methods
 */
@Injectable()
export class UserRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  /**
   * Finds a user by their login identifier.
   *
   * @param {string} login - User login identifier to search for
   * @returns {Promise<{data: any, error: any}>} Supabase response object with user data (single record) and error
   */
  async findByLogin(login: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('login', login)
      .single();

    return { data, error };
  }

  /**
   * Finds a user by login (password verification should be done in service layer).
   * This method is a convenience wrapper around findByLogin that returns null when user is not found.
   *
   * @param {string} login - User login identifier to search for
   * @returns {Promise<{data: any | null, error: any}>} Object with user data if found, null otherwise, and error if any
   */
  async findByLoginAndPassword(login: string) {
    const { data: user, error: findError } = await this.findByLogin(login);

    if (findError || !user) {
      return { data: null, error: findError || new Error('User not found') };
    }

    return { data: user, error: null };
  }
}
