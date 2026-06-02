import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ERP Automação');
  protected readonly sidebarOpen = signal(true);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1', route: '/dashboard' },
    { label: 'Clientes', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', route: '/clientes' },
    { label: 'Entregadores', icon: 'M5.5 17H2v-1.5A3.5 3.5 0 015.5 12H6M16 17h5v-1.5a3.5 3.5 0 00-3.5-3.5H17M12 7a4 4 0 11-8 0 4 4 0 018 0zM20 7a4 4 0 11-8 0 4 4 0 018 0z', route: '/motoristas' },
    { label: 'Pedidos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', route: '/pedidos' },
    { label: 'Automações', icon: 'M13 10V3L4 14h7v7l9-11h-7z', route: '/automacoes' },
  ];

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }
}
