import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DashboardMetrics {
  p13Stock: number;
  p13Empty: number;
  p20Stock: number;
  p20Empty: number;
  p45Stock: number;
  p45Empty: number;
  todaySalesAmount: number;
  todaySalesCount: number;
  overdueInvoices: number;
  neighborhoodMetrics: Array<{ name: string; orders: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<{ success: boolean; data: DashboardMetrics }>(this.apiUrl)
      .pipe(map(response => response.data));
  }
}
