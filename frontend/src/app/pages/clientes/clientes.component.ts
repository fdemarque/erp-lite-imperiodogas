import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ClientService } from '../../services/client.service';
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
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  formatCurrency = formatCurrency;
  search = '';
  filterInadimplente = 'TODOS';
  isDialogOpen = signal(false);
  editingClient = signal<Client | null>(null);
  formData: Partial<Client> = { person_type: 'FISICA', active: true, payment_deadline_days: 0 };

  clients = signal<Client[]>([]);

  filteredClients = signal<Client[]>([]);

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe((data) => {
      this.clients.set(data);
      this.updateFiltered();
    });
  }

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
      this.clientService.update(editing.id, this.formData).subscribe(() => {
        this.isDialogOpen.set(false);
        this.loadClients();
      });
    } else {
      this.clientService.create(this.formData).subscribe(() => {
        this.isDialogOpen.set(false);
        this.loadClients();
      });
    }
  }

  handleDelete(id: string) {
    if (confirm('Deseja realmente excluir este cliente?')) {
      this.clientService.delete(id).subscribe(() => {
        this.loadClients();
      });
    }
  }
}
