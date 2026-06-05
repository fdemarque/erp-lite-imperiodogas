import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { UserService, User, UserRequest } from '../../services/user.service';

type UserRole = 'ADMINISTRADOR' | 'SECRETARIO' | 'ENTREGADOR';

const ROLE_LABELS: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  SECRETARIO: 'Secretário',
  ENTREGADOR: 'Entregador',
  ADMIN: 'Administrador',
  OPERADOR: 'Operador',
};

const ROLE_COLORS: Record<string, string> = {
  ADMINISTRADOR: 'badge-admin',
  SECRETARIO: 'badge-sec',
  ENTREGADOR: 'badge-driver',
  ADMIN: 'badge-admin',
  OPERADOR: 'badge-sec',
};

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  private readonly userService = inject(UserService);

  readonly ROLE_LABELS = ROLE_LABELS;
  readonly ROLE_COLORS = ROLE_COLORS;

  search = '';
  filterRole = 'TODOS';
  isDialogOpen = signal(false);
  isDeleteConfirm = signal<string | null>(null);
  editingUser = signal<User | null>(null);
  saving = signal(false);
  loading = signal(true);
  errorMsg = signal<string | null>(null);

  formData: Partial<UserRequest> = {
    role: 'ENTREGADOR',
    active: true,
  };

  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);

  availableRoles: UserRole[] = ['ADMINISTRADOR', 'SECRETARIO', 'ENTREGADOR'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.updateFiltered();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.loading.set(false);
      },
    });
  }

  updateFiltered() {
    const s = this.search.toLowerCase();
    this.filteredUsers.set(
      this.users().filter((u) => {
        const matchesSearch =
          u.person.name.toLowerCase().includes(s) ||
          (u.cpf?.includes(s) ?? false) ||
          (u.person.phone?.includes(s) ?? false);
        const matchesRole =
          this.filterRole === 'TODOS' || u.role === this.filterRole;
        return matchesSearch && matchesRole;
      })
    );
  }

  handleOpenNew() {
    this.editingUser.set(null);
    this.formData = { role: 'ENTREGADOR', active: true };
    this.errorMsg.set(null);
    this.isDialogOpen.set(true);
  }

  handleOpenEdit(user: User) {
    this.editingUser.set(user);
    this.formData = {
      name: user.person.name,
      phone: user.person.phone,
      email: user.email,
      role: user.role as UserRole,
      cpf: user.cpf,
      address: user.address,
      monthly_salary: user.monthly_salary,
      birth_date: user.birth_date ? user.birth_date.substring(0, 10) : '',
      hire_date: user.hire_date ? user.hire_date.substring(0, 10) : '',
      active: user.active,
    };
    this.errorMsg.set(null);
    this.isDialogOpen.set(true);
  }

  handleSave() {
    if (!this.formData.name || !this.formData.role || !this.formData.cpf || !this.formData.birth_date) {
      this.errorMsg.set('Preencha todos os campos obrigatórios: Nome, CPF, Função e Data de Nascimento.');
      return;
    }
    this.saving.set(true);
    this.errorMsg.set(null);
    const editing = this.editingUser();
    const payload = { ...this.formData } as UserRequest;

    const obs = editing
      ? this.userService.update(editing.id, payload)
      : this.userService.create(payload);

    obs.subscribe({
      next: () => {
        this.isDialogOpen.set(false);
        this.saving.set(false);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        this.errorMsg.set(err?.error?.message || 'Erro ao salvar. Tente novamente.');
        this.saving.set(false);
      },
    });
  }

  handleDelete(id: string) {
    this.userService.delete(id).subscribe({
      next: () => {
        this.isDeleteConfirm.set(null);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
      },
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    const d = new Date(date + (date.length === 10 ? 'T00:00:00' : ''));
    return d.toLocaleDateString('pt-BR');
  }

  formatCurrency(value: number | undefined): string {
    if (value == null) return '—';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  get totalAdmins() { return this.users().filter(u => u.role === 'ADMINISTRADOR' || u.role === 'ADMIN').length; }
  get totalSecretarios() { return this.users().filter(u => u.role === 'SECRETARIO' || u.role === 'OPERADOR').length; }
  get totalEntregadores() { return this.users().filter(u => u.role === 'ENTREGADOR').length; }
}
