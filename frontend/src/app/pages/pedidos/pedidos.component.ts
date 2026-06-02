import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
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
export class PedidosComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  formatCurrency = formatCurrency;
  formatDate = formatDate;
  search = '';
  isNewOrderOpen = signal(false);

  openNewOrderModal() {
    this.isNewOrderOpen.set(true);
  }
  viewingOrder = signal<Order | null>(null);

  orders = signal<Order[]>([]);

  filteredOrders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAll().subscribe((data: any[]) => {
      const mappedOrders: Order[] = data.map((o) => ({
        id: o.id,
        client_name: o.clients?.people?.name || o.clients?.trade_name || 'Desconhecido',
        driver_name: o.driver?.name || 'Não atribuído',
        sale_type: o.sale_type,
        status: o.status,
        total_amount: o.total_amount,
        created_at: o.created_at,
      }));
      this.orders.set(mappedOrders);
      this.updateFiltered();
    });
  }

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
