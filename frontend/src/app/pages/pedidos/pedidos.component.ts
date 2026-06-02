import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface Order {
  id: string;
  client_name?: string;
  driver_name?: string;
  sale_type: string;
  status: 'ABERTO' | 'FINALIZADO' | 'CANCELADO';
  total_amount: number;
  created_at: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedidos.component.html',
})
export class PedidosComponent {
  formatCurrency = formatCurrency;
  formatDate = formatDate;
  search = '';
  isNewOrderOpen = signal(false);
  viewingOrder = signal<Order | null>(null);

  orders = signal<Order[]>([
    { id: 'ord1', client_name: 'João Carlos Silva', driver_name: 'Marcos Antonio', sale_type: 'A VISTA', status: 'FINALIZADO', total_amount: 115.0, created_at: '2023-11-20T10:30:00Z' },
    { id: 'ord2', client_name: 'Restaurante Sabor de Minas', driver_name: 'Pedro Paulo', sale_type: 'A PRAZO', status: 'ABERTO', total_amount: 345.0, created_at: '2023-11-21T14:45:00Z' },
    { id: 'ord3', client_name: 'Padaria Pão Quente', driver_name: undefined, sale_type: 'A VISTA', status: 'FINALIZADO', total_amount: 230.0, created_at: '2023-11-22T09:00:00Z' },
  ]);

  filteredOrders = signal<Order[]>([]);
  constructor() { this.updateFiltered(); }

  updateFiltered() {
    const s = this.search.toLowerCase();
    this.filteredOrders.set(this.orders().filter((o) =>
      (o.client_name?.toLowerCase() || '').includes(s) ||
      (o.driver_name?.toLowerCase() || '').includes(s) ||
      o.id.toLowerCase().includes(s)
    ));
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-50 text-green-700 border-green-200';
      case 'ABERTO': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELADO': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'FINALIZADO': return 'Finalizado';
      case 'ABERTO': return 'Aberto (Fiado)';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }
}
