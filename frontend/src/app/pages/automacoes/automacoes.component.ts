import { Component } from '@angular/core';

@Component({
  selector: 'app-automacoes',
  standalone: true,
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-2 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Automações
        </h2>
        <p class="text-slate-500 dark:text-zinc-400 mt-1 mb-0">Módulo de automações em construção.</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 class="text-lg font-medium text-slate-700 dark:text-zinc-200">Módulo em Desenvolvimento</h3>
          <p class="text-slate-500 dark:text-zinc-400 mt-2">As ferramentas de automação estarão disponíveis em breve.</p>
        </div>
      </div>
    </div>
  `
})
export class AutomacoesComponent {}
