import { Component } from '@angular/core';
import { formatCurrency } from '../../utils/formatters';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-800 m-0">Dashboard</h2>
        <p class="text-slate-500 mt-1 mb-0">Visão geral do desempenho e logística da distribuidora.</p>
      </div>

      <!-- Metrics Cards -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        @for (metric of metrics; track metric.title) {
          <div class="bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
            <div class="flex flex-row items-center justify-between pb-2">
              <span class="text-sm font-medium text-slate-500">{{ metric.title }}</span>
              <div class="p-2 rounded-xl bg-orange-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="metric.iconPath" />
                </svg>
              </div>
            </div>
            <div>
              <div class="text-3xl font-bold text-slate-800">{{ metric.value }}</div>
              <p class="text-sm text-slate-400 mt-1 m-0">{{ metric.subtitle }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Bottom Section -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <!-- Chart Placeholder -->
        <div class="col-span-1 lg:col-span-4 bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold flex items-center gap-2 text-slate-800 m-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Volume de Pedidos por Bairro
            </h3>
            <p class="text-sm text-slate-500 mt-1 m-0">Concentração logística baseada nas últimas entregas.</p>
          </div>
          <!-- Chart bars -->
          <div class="space-y-3 mt-4">
            @for (item of neighborhoodData; track item.name) {
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 w-16 text-right">{{ item.name }}</span>
                <div class="flex-1 h-8 bg-slate-50 rounded-lg overflow-hidden">
                  <div
                    class="h-full rounded-lg transition-all duration-500"
                    [style.width.%]="(item.orders / 120) * 100"
                    [style.background-color]="getOrangeColor(item.orders)"
                  ></div>
                </div>
                <span class="text-xs font-medium text-slate-600 w-8">{{ item.orders }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Stock Alerts -->
        <div class="col-span-1 lg:col-span-3 bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-800 m-0">Níveis de Estoque Alerta</h3>
            <p class="text-sm text-slate-500 mt-1 m-0">Produtos que precisam de atenção.</p>
          </div>
          <div class="space-y-4">
            <!-- P45 -->
            <div class="flex items-center justify-between p-4 bg-white border border-slate-100 shadow-sm rounded-xl">
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-orange-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800 m-0">Cilindro P45</p>
                  <p class="text-xs text-slate-500 mt-0.5 m-0">Criticamente baixo</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-orange-600">3</span>
                <span class="text-xs text-slate-400 ml-1">un</span>
              </div>
            </div>
            <!-- P20 -->
            <div class="flex items-center justify-between p-4 bg-white border border-slate-100 shadow-sm rounded-xl">
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800 m-0">Botijão P20</p>
                  <p class="text-xs text-slate-500 mt-0.5 m-0">Atenção ao estoque</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-blue-600">12</span>
                <span class="text-xs text-slate-400 ml-1">un</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  metrics = [
    { title: 'Estoque P13', value: '245', subtitle: 'Unidades disponíveis', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Estoque P45', value: '18', subtitle: 'Unidades disponíveis', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Vendas do Dia', value: formatCurrency(1850), subtitle: '24 pedidos finalizados', iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { title: 'Inadimplência', value: '12', subtitle: 'Faturas em atraso', iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  ];

  neighborhoodData = [
    { name: 'Centro', orders: 120 },
    { name: 'Jardins', orders: 98 },
    { name: 'Vila Nova', orders: 85 },
    { name: 'Boa Vista', orders: 62 },
    { name: 'São José', orders: 45 },
    { name: 'Bela Vista', orders: 30 },
  ];

  getOrangeColor(value: number): string {
    const ratio = value / 120;
    if (ratio > 0.8) return '#ea580c';
    if (ratio > 0.6) return '#f97316';
    if (ratio > 0.4) return '#fb923c';
    if (ratio > 0.2) return '#fdba74';
    return '#fed7aa';
  }
}
