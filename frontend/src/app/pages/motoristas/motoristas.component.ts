import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatCurrency } from '../../utils/formatters';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-motoristas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './motoristas.component.html',
})
export class MotoristasComponent implements OnInit {
  private readonly userService = inject(UserService);
  formatCurrency = formatCurrency;
  period = 'Hoje';
  loading = true;

  drivers: User[] = [];

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.loading = true;
    this.userService.getDeliverers().subscribe({
      next: (data) => {
        this.drivers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar entregadores:', err);
        this.loading = false;
      },
    });
  }

  get totalCylinders() { return 0; }
  get totalGross() { return 0; }
  get totalWithdrawals() { return 0; }
  get totalNet() { return 0; }

  getInitials(name: string) { return name.substring(0, 2).toUpperCase(); }
}
