import { supabase } from '../config/supabaseClient';

export class StockService {
  async getCurrentStock() {
    // Busca todos os produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name');

    if (productsError) throw productsError;

    // Busca todas as movimentações
    const { data: movements, error: movementsError } = await supabase
      .from('stock_movements')
      .select('product_id, quantity, movement_type');

    if (movementsError) throw movementsError;

    // Agrupa e calcula o saldo
    const stockMap = new Map<string, { id: string; name: string; balance: number }>();
    
    for (const p of products) {
      stockMap.set(p.id, { id: p.id, name: p.name, balance: 0 });
    }

    for (const m of movements) {
      const prod = stockMap.get(m.product_id);
      if (prod) {
        if (m.movement_type === 'ENTRADA') {
          prod.balance += m.quantity;
        } else if (m.movement_type === 'SAIDA') {
          prod.balance -= m.quantity;
        }
      }
    }

    return Array.from(stockMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getStockHistory(query: { nf?: string; truck_plate?: string; product_id?: string }) {
    // Usamos left join (ou inner join) com inbounds. 
    // Como inbounds e stock_movements se relacionam via reference_id,
    // precisamos testar como o Supabase mapeia. Assumiremos que a FK reference_id -> inbounds.id não está fortemente tipada se reference_id for polimórfica, mas o prompt sugeriu o JOIN.
    // Vamos fazer o select básico e depois cruzar caso não haja FK direta.
    // Vamos tentar o inner join com inbounds supondo que reference_id aponte para lá nas ENTRADAS.
    
    // Se o relacionamento não for direto no PostgREST, teríamos que buscar ambos.
    // Para simplificar e evitar erros de schema sem conhecê-lo a fundo:
    
    let movementQuery = supabase
      .from('stock_movements')
      .select('*, products(name)')
      .order('created_at', { ascending: false });

    if (query.product_id) {
      movementQuery = movementQuery.eq('product_id', query.product_id);
    }

    const { data: movements, error } = await movementQuery;
    if (error) throw error;

    // Buscar Inbounds
    const { data: inbounds } = await supabase.from('inbounds').select('*');
    
    // Mapear os Inbounds
    const inboundsMap = new Map();
    if (inbounds) {
      for (const inc of inbounds) {
        inboundsMap.set(inc.id, inc);
      }
    }

    // Unir os dados em memória e aplicar filtros de nf e truck_plate
    let history = movements.map((m: any) => {
      const inbound = m.movement_type === 'ENTRADA' ? inboundsMap.get(m.reference_id) : null;
      return {
        id: m.id,
        created_at: m.created_at,
        movement_type: m.movement_type,
        product_id: m.product_id,
        product_name: m.products?.name,
        quantity: m.quantity,
        unit_price: m.unit_price,
        invoice_number: inbound?.invoice_number || null,
        truck_plate: inbound?.truck_plate || null
      };
    });

    if (query.nf) {
      const nfLower = query.nf.toLowerCase();
      history = history.filter(h => h.invoice_number?.toLowerCase().includes(nfLower));
    }

    if (query.truck_plate) {
      const plateLower = query.truck_plate.toLowerCase();
      history = history.filter(h => h.truck_plate?.toLowerCase().includes(plateLower));
    }

    return history;
  }
}
