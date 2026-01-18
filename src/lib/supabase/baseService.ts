
import { supabase } from '@/lib/supabase';

/**
 * BASE SERVICE: Generic Supabase CRUD
 * Centralise les opérations communes pour éviter la répétition.
 */

// 🔧 FIX: Type helpers for better type safety
// Payload for creating records (excludes auto-generated fields)
type CreatePayload<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

// Payload for updating records (partial, excludes auto-generated fields)
type UpdatePayload<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>;

export const baseService = {
    /**
     * Create a new record
     */
    async create<T>(
        table: string,
        payload: CreatePayload<T> | Record<string, unknown>
    ): Promise<T> {
        const { data, error } = await supabase
            .from(table)
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return data as T;
    },

    /**
     * Update an existing record
     */
    async update<T>(
        table: string,
        id: string,
        updates: UpdatePayload<T> | Record<string, unknown>
    ): Promise<T> {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    },

    /**
     * Delete a record (Soft Delete)
     */
    async softDelete(table: string, id: string): Promise<boolean> {
        const { error } = await supabase
            .from(table)
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    /**
     * Get a single record by ID
     */
    async getById<T>(table: string, id: string, select: string = '*'): Promise<T> {
        const { data, error } = await supabase
            .from(table)
            .select(select)
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as T;
    }
};
