import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/clientes/clientes.component').then((m) => m.ClientesComponent),
  },
  {
    path: 'motoristas',
    loadComponent: () =>
      import('./pages/motoristas/motoristas.component').then((m) => m.MotoristasComponent),
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
  },
  {
    path: 'automacoes',
    loadComponent: () =>
      import('./pages/automacoes/automacoes.component').then((m) => m.AutomacoesComponent),
  },
  {
    path: 'entradas',
    loadComponent: () =>
      import('./pages/entradas/entradas.component').then((m) => m.EntradasComponent),
  },
  {
    path: 'estoque',
    loadComponent: () =>
      import('./pages/estoque/estoque.component').then((m) => m.EstoqueComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
