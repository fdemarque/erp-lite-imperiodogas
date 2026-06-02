import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Inbound {
  id: string;
  invoice_number: string;
  truck_plate: string;
  status: 'ABERTO' | 'FINALIZADO' | 'CANCELADO';
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class InboundService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inbounds`;

  getAll(): Observable<Inbound[]> {
    return this.http.get<ApiResponse<Inbound[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  create(payload: { invoice_number: string; truck_plate: string; items?: any[] }): Observable<Inbound> {
    return this.http.post<ApiResponse<Inbound>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }
}
