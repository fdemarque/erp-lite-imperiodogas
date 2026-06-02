import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatCurrency } from '../../utils/formatters';

interface Client {
  id: string;
  person_type: 'FISICA' | 'JURIDICA';
  name: string;
  document: string;
  phone: string;
  trade_name?: string;
  payment_deadline_days: number;
  active: boolean;
  isInadimplente?: boolean;
  revenue?: number;
  purchasesCount?: number;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  formatCurrency = formatCurrency;
  search = '';
  filterInadimplente = 'TODOS';
  isDialogOpen = signal(false);
  editingClient = signal<Client | null>(null);
  formData: Partial<Client> = { person_type: 'FISICA', active: true, payment_deadline_days: 0 };

  clients = signal<Client[]>([
    { id: '1', person_type: 'JURIDICA', name: 'Restaurante Sabor de Minas', document: '12.345.678/0001-90', phone: '(11) 99999-1234', trade_name: 'Sabor de Minas', payment_deadline_days: 15, active: true, isInadimplente: false, revenue: 15000, purchasesCount: 45 },
    { id: '2', person_type: 'FISICA', name: 'João Carlos Silva', document: '123.456.789-00', phone: '(11) 98888-5678', payment_deadline_days: 0, active: true, isInadimplente: true, revenue: 350, purchasesCount: 3 },
    { id: '3', person_type: 'JURIDICA', name: 'Padaria Pão Quente', document: '98.765.432/0001-10', phone: '(11) 97777-9012', trade_name: 'Pão Quente', payment_deadline_days: 30, active: true, isInadimplente: false, revenue: 32000, purchasesCount: 120 },
  ]);

  filteredClients = signal<Client[]>([]);

  constructor() { this.updateFiltered(); }

  updateFiltered() {
    const s = this.search.toLowerCase();
    this.filteredClients.set(this.clients().filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(s) || c.document.includes(s) || (c.trade_name?.toLowerCase().includes(s) ?? false);
      const matchesInad = this.filterInadimplente === 'TODOS' || (this.filterInadimplente === 'SIM' && c.isInadimplente) || (this.filterInadimplente === 'NAO' && !c.isInadimplente);
      return matchesSearch && matchesInad;
    }));
  }

  handleOpenNew() {
    this.editingClient.set(null);
    this.formData = { person_type: 'FISICA', active: true, payment_deadline_days: 0, name: '', document: '', phone: '', trade_name: '' };
    this.isDialogOpen.set(true);
  }

  handleOpenEdit(client: Client) {
    this.editingClient.set(client);
    this.formData = { ...client };
    this.isDialogOpen.set(true);
  }

  handleSave() {
    const editing = this.editingClient();
    if (editing) {
      this.clients.update((list) => list.map((c) => (c.id === editing.id ? { ...c, ...this.formData } as Client : c)));
    } else {
      const newClient: Client = { ...this.formData, id: Math.random().toString(36).substr(2, 9), active: true, revenue: 0, purchasesCount: 0 } as Client;
      this.clients.update((list) => [...list, newClient]);
    }
    this.isDialogOpen.set(false);
    this.updateFiltered();
  }

  handleDelete(id: string) {
    this.clients.update((list) => list.filter((c) => c.id !== id));
    this.updateFiltered();
  }
}
