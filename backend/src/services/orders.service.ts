import { supabase } from '../config/supabaseClient';

const TABLE = 'orders';

export class OrdersService {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*, clients(*, people(*)), driver:driver_id(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*, clients(*, people(*)), driver:driver_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(payload: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
