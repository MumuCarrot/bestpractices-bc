import { createRepository } from './base.repo.js';
import { supabase } from '../database/index.js';

const baseRepository = createRepository('users');

export const usersRepository = {
  ...baseRepository,

  async findByLogin(login) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('login', login)
      .single();
    
    return { data, error };
  },

  async findByLoginAndPassword(login, password) {
    const { data: user, error: findError } = await this.findByLogin(login);
    
    if (findError || !user) {
      return { data: null, error: findError || new Error('User not found') };
    }
    
    return { data: user, error: null };
  }
};