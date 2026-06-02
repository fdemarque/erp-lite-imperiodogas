import { supabase } from '../config/supabaseClient';

const TABLE = 'clients';

export class ClientsService {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, payment_deadline_days, active, created_at, people:person_id(name, document, phone, trade_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, payment_deadline_days, active, created_at, people:person_id(name, document, phone, trade_name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(payload: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('id, payment_deadline_days, active, created_at, people:person_id(name, document, phone, trade_name)')
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select('id, payment_deadline_days, active, created_at, people:person_id(name, document, phone, trade_name)')
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
