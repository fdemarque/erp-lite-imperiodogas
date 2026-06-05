import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { InboundService, Inbound, InboundItem } from '../../services/inbound.service';
import { ClientService } from '../../services/client.service';
import { UserService, User } from '../../services/user.service';
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
  private readonly inboundService = inject(InboundService);
  private readonly clientService = inject(ClientService);
  private readonly userService = inject(UserService);

  formatCurrency = formatCurrency;
  formatDate = formatDate;
  search = '';
  isNewOrderOpen = signal(false);

  viewingOrder = signal<Order | null>(null);

  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  clients = signal<any[]>([]);
  deliverers = signal<User[]>([]);
  
  // Cascade
  inbounds = signal<Inbound[]>([]);
  selectedInboundId = signal<string>('');
  availableCategories = signal<InboundItem[]>([]);
  
  currentItem = { inboundItemId: '', quantity: 1, unitPrice: '' as string | number };
  
  newOrderPayload = { clientId: null as any, driverId: null as any, saleType: 'DINHEIRO', status: 'FINALIZADO', items: [] as any[] };

  ngOnInit() {
    this.loadOrders();
    this.loadInbounds();
    this.loadClients();
    this.loadDeliverers();
  }

  loadDeliverers() {
    this.userService.getDeliverers().subscribe((data) => {
      this.deliverers.set(data);
    });
  }

  loadClients() {
    this.clientService.getAll().subscribe((data) => {
      this.clients.set(data);
    });
  }

  openNewOrderModal() {
    this.isNewOrderOpen.set(true);
    this.newOrderPayload.items = [];
    this.currentItem = { inboundItemId: '', quantity: 1, unitPrice: '' };
    this.selectedInboundId.set('');
    this.availableCategories.set([]);
  }

  loadInbounds() {
    this.inboundService.getAll().subscribe((data) => {
      const validInbounds = data.filter(i => i.items && i.items.some(item => item.availableQuantity > 0));
      this.inbounds.set(validInbounds || []);
    });
  }

  onInboundChange() {
    const ib = this.inbounds().find(i => i.id === this.selectedInboundId());
    if (ib && ib.items) {
      this.availableCategories.set(ib.items.filter(item => item.availableQuantity > 0));
    } else {
      this.availableCategories.set([]);
    }
    this.currentItem.inboundItemId = '';
    this.currentItem.unitPrice = '';
  }

  onCategoryChange() {
    // optional: set default unitPrice based on the lot's unitCost (e.g. + 30%)
    // or just leave it blank for user to input
  }

  loadOrders() {
    this.orderService.getAll().subscribe((data: any[]) => {
      const mappedOrders: Order[] = data.map((o) => ({
        id: o.id,
        client_name: o.clients?.people?.name || o.clients?.trade_name || 'Desconhecido',
        driver_name: o.driver?.name || 'Não atribuído',
        sale_type: o.saleType || o.sale_type,
        status: o.status,
        total_amount: o.totalAmount || o.total_amount,
        created_at: o.createdAt || o.created_at,
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

  addItem() {
    if (!this.currentItem.inboundItemId || !this.currentItem.quantity || !this.currentItem.unitPrice) return;
    
    const cat = this.availableCategories().find(c => c.id === this.currentItem.inboundItemId);
    if (!cat) return;

    if (this.currentItem.quantity > cat.availableQuantity) {
      alert(`A quantidade solicitada (${this.currentItem.quantity}) é maior que o saldo disponível neste lote (${cat.availableQuantity}).`);
      return;
    }

    this.newOrderPayload.items.push({
      inboundItemId: this.currentItem.inboundItemId,
      quantity: this.currentItem.quantity,
      unitPrice: Number(this.currentItem.unitPrice),
      _categoryLabel: cat.category
    });
    
    this.currentItem = { inboundItemId: '', quantity: 1, unitPrice: '' };
    this.selectedInboundId.set('');
    this.availableCategories.set([]);
  }

  removeItem(index: number) {
    this.newOrderPayload.items.splice(index, 1);
  }

  getOrderTotal() {
    return this.newOrderPayload.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }

  saveOrder() {
    if (this.newOrderPayload.items.length === 0) return;
    this.orderService.create(this.newOrderPayload).subscribe(() => {
      this.isNewOrderOpen.set(false);
      this.loadOrders();
      this.loadInbounds();
    });
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
