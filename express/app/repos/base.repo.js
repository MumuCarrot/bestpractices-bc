import { supabase } from '../database/index.js';

export function createRepository(table) {
  return {
    async findById(id) {
      return supabase.from(table).select('*').eq('id', id).single()
    },

    async findPaginated(limit, offset) {
      return supabase.from(table).select('*').limit(limit).offset(offset)
    },

    async create(data) {
      return supabase.from(table).insert(data)
    },

    async update(id, data) {
      return supabase.from(table).update(data).eq('id', id)
    },

    async delete(id) {
      return supabase.from(table).delete().eq('id', id)
    }
  }
}