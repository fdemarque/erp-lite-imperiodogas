import { supabase } from '../config/supabaseClient';

const TABLE = 'inbounds';

export class InboundsService {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async create(payload: { invoice_number: string; truck_plate: string; status?: string; items?: { product_id: string; quantity: number; unit_price: number }[] }) {
    const { items, ...inboundData } = payload;
    const dataToInsert = {
      ...inboundData,
      status: payload.status || 'ABERTO'
    };

    // 1. Inserir a Nota Fiscal na tabela inbounds
    const { data: inbound, error: inboundError } = await supabase
      .from(TABLE)
      .insert(dataToInsert)
      .select()
      .single();

    if (inboundError) throw inboundError;

    // 2. Inserir os itens na tabela stock_movements
    if (items && items.length > 0) {
      const movements = items.map(item => ({
        movement_type: 'ENTRADA',
        reference_id: inbound.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('stock_movements')
        .insert(movements);

      if (itemsError) {
        // Num cenário ideal, faríamos rollback. Como não temos transação fácil aqui, vamos apenas propagar o erro.
        console.error('Erro ao inserir itens no estoque:', itemsError);
        throw itemsError;
      }
    }

    return inbound;
  }
}
