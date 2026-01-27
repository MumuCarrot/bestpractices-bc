import { createRepository } from './base.repo.js';
import { supabase } from '../database/index.js';

const baseRepository = createRepository('users');

/**
 * User repository with user-specific database operations
 * Extends base repository with additional user-specific methods
 */
export const usersRepository = {
  ...baseRepository,

  /**
   * Finds a user by login
   * @param {string} login - User login
   * @returns {Promise<{data: any, error: any}>} Supabase response with user data and error
   */
  async findByLogin(login) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('login', login)
      .single();
    
    return { data, error };
  },

  /**
   * Finds a user by login (password verification should be done in service layer)
   * @param {string} login - User login
   * @param {string} password - User password (not verified here)
   * @returns {Promise<{data: any|null, error: Error|null}>} User data if found, null otherwise
   */
  async findByLoginAndPassword(login, password) {
    const { data: user, error: findError } = await this.findByLogin(login);
    
    if (findError || !user) {
      return { data: null, error: findError || new Error('User not found') };
    }
    
    return { data: user, error: null };
  }
};