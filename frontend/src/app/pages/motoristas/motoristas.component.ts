import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatCurrency } from '../../utils/formatters';

interface DriverReport {
  driverId: string;
  driverName: string;
  cylindersSold: number;
  grossAmount: number;
  withdrawals: number;
  netProfit: number;
}

@Component({
  selector: 'app-motoristas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './motoristas.component.html',
})
export class MotoristasComponent {
  formatCurrency = formatCurrency;
  period = 'Hoje';

  drivers: DriverReport[] = [
    { driverId: '1', driverName: 'Roberto Silva', cylindersSold: 45, grossAmount: 4950, withdrawals: 150, netProfit: 4800 },
    { driverId: '2', driverName: 'João Souza', cylindersSold: 32, grossAmount: 3520, withdrawals: 300, netProfit: 3220 },
    { driverId: '3', driverName: 'Fernando Costa', cylindersSold: 58, grossAmount: 6380, withdrawals: 0, netProfit: 6380 },
    { driverId: '4', driverName: 'Carlos Mendes', cylindersSold: 12, grossAmount: 1320, withdrawals: 500, netProfit: 820 },
  ];

  get totalCylinders() { return this.drivers.reduce((a, d) => a + d.cylindersSold, 0); }
  get totalGross() { return this.drivers.reduce((a, d) => a + d.grossAmount, 0); }
  get totalWithdrawals() { return this.drivers.reduce((a, d) => a + d.withdrawals, 0); }
  get totalNet() { return this.drivers.reduce((a, d) => a + d.netProfit, 0); }

  getInitials(name: string) { return name.substring(0, 2).toUpperCase(); }
}
