import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StockBalance {
  id: string;
  name: string;
  balance: number;
}

export interface StockHistory {
  id: string;
  created_at: string;
  movement_type: 'ENTRADA' | 'SAIDA';
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  invoice_number?: string;
  truck_plate?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stock`;

  getCurrentStock(): Observable<StockBalance[]> {
    return this.http.get<ApiResponse<StockBalance[]>>(`${this.baseUrl}/current`).pipe(map((res) => res.data));
  }

  getStockHistory(filters?: { nf?: string; truck_plate?: string; product_id?: string }): Observable<StockHistory[]> {
    let params = new HttpParams();
    if (filters?.nf) params = params.set('nf', filters.nf);
    if (filters?.truck_plate) params = params.set('truck_plate', filters.truck_plate);
    if (filters?.product_id) params = params.set('product_id', filters.product_id);

    return this.http.get<ApiResponse<StockHistory[]>>(`${this.baseUrl}/history`, { params }).pipe(map((res) => res.data));
  }
}
