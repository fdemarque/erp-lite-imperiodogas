import { Component, OnInit, signal, inject } from '@angular/core';
import { formatCurrency } from '../../utils/formatters';
import { DashboardService, DashboardMetrics } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-2 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Dashboard
        </h2>
        <p class="text-slate-500 dark:text-zinc-400 mt-1 mb-0">Visão geral do desempenho e logística da distribuidora.</p>
      </div>

      <!-- Metrics Cards -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        @for (metric of metrics; track metric.title) {
          <div class="bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 rounded-2xl p-6">
            <div class="flex flex-row items-center justify-between pb-2">
              <span class="text-sm font-medium text-slate-500 dark:text-zinc-400">{{ metric.title }}</span>
              <div class="p-2 rounded-xl bg-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="metric.iconPath" />
                </svg>
              </div>
            </div>
            <div>
              <div class="text-3xl font-bold text-slate-800 dark:text-zinc-100">{{ metric.value }}</div>
              <p class="text-sm text-slate-400 dark:text-zinc-500 mt-1 m-0">{{ metric.subtitle }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Bottom Section -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <!-- Chart Placeholder -->
        <div class="col-span-1 lg:col-span-4 bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 rounded-2xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-zinc-100 m-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Volume de Pedidos por Bairro
            </h3>
            <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1 m-0">Concentração logística baseada nas últimas entregas.</p>
          </div>
          <!-- Chart bars -->
          <div class="space-y-3 mt-4">
            @for (item of neighborhoodData(); track item.name) {
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 dark:text-zinc-400 w-16 text-right truncate">{{ item.name }}</span>
                <div class="flex-1 h-8 bg-slate-50 dark:bg-zinc-800/50 rounded-lg overflow-hidden">
                  <div
                    class="h-full rounded-lg transition-all duration-500"
                    [style.width.%]="getMaxOrders() > 0 ? (item.orders / getMaxOrders()) * 100 : 0"
                    [style.background-color]="getEmeraldColor(item.orders, getMaxOrders())"
                  ></div>
                </div>
                <span class="text-xs font-medium text-slate-600 dark:text-zinc-300 w-8">{{ item.orders }}</span>
              </div>
            }
            @if (neighborhoodData().length === 0) {
              <p class="text-sm text-slate-400 dark:text-zinc-500 text-center py-4">Nenhum dado disponível.</p>
            }
          </div>
        </div>

        <!-- Stock Alerts -->
        <div class="col-span-1 lg:col-span-3 bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 rounded-2xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-zinc-100 m-0">Níveis de Estoque Alerta</h3>
            <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1 m-0">Produtos que precisam de atenção.</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <!-- Coluna Esquerda: Cheios -->
            <div class="space-y-4">
              <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cheios</h4>
              <!-- P13 Cheio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">GLP 13kg</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ metricsData()?.p13Stock || 0 }}</span>
                </div>
              </div>
              <!-- P20 Cheio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">GLP 20kg</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ metricsData()?.p20Stock || 0 }}</span>
                </div>
              </div>
              <!-- P45 Cheio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">GLP 45kg</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ metricsData()?.p45Stock || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Vasilhames -->
            <div class="space-y-4">
              <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vasilhames</h4>
              <!-- P13 Vazio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">Vazios 13</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ metricsData()?.p13Empty || 0 }}</span>
                </div>
              </div>
              <!-- P20 Vazio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">Vazios 20</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ metricsData()?.p20Empty || 0 }}</span>
                </div>
              </div>
              <!-- P45 Vazio -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-zinc-100 m-0">Vazios 45</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ metricsData()?.p45Empty || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  metricsData = signal<DashboardMetrics | null>(null);
  neighborhoodData = signal<Array<{ name: string, orders: number }>>([]);

  metrics = [
    { title: 'Última Entrada', value: '0', subtitle: 'Data do último carregamento', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Sangria (dia)', value: '0', subtitle: 'Gastos operacionais', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Vendas (dia)', value: formatCurrency(0), subtitle: '0 pedidos finalizados', iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { title: 'Inadimplência', value: '0', subtitle: 'Faturas em atraso', iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  ];

  ngOnInit() {
    this.dashboardService.getMetrics().subscribe(data => {
      this.metricsData.set(data);
      this.neighborhoodData.set(data.neighborhoodMetrics);

      this.metrics = [
        { title: 'Estoque P13', value: data.p13Stock.toString(), subtitle: 'Unidades disponíveis', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { title: 'Estoque P45', value: data.p45Stock.toString(), subtitle: 'Unidades disponíveis', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { title: 'Vendas do Dia', value: formatCurrency(data.todaySalesAmount), subtitle: `${data.todaySalesCount} pedidos finalizados`, iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        { title: 'Inadimplência', value: data.overdueInvoices.toString(), subtitle: 'Faturas em atraso', iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
      ];
    });
  }

  getMaxOrders(): number {
    const data = this.neighborhoodData();
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.orders));
  }

  getEmeraldColor(value: number, max: number): string {
    if (max === 0) return '#94bfa0';
    const ratio = value / max;
    if (ratio > 0.8) return '#17311b';
    if (ratio > 0.6) return '#214727';
    if (ratio > 0.4) return '#2c5f34';
    if (ratio > 0.2) return '#69a67a';
    return '#94bfa0';
  }
}
