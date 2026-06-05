import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clients`;

  getAll(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(this.baseUrl).pipe(
      map((res) => res.data.map((c: any) => ({
        id: c.id,
        person_type: c.people?.person_type,
        name: c.people?.name,
        document: c.people?.document,
        phone: c.people?.phone,
        trade_name: c.people?.trade_name,
        payment_deadline_days: c.payment_deadline_days,
        active: c.active,
        created_at: c.created_at,
        updated_at: c.updated_at
      })))
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        const c = res.data;
        return {
          id: c.id,
          person_type: c.people?.person_type,
          name: c.people?.name,
          document: c.people?.document,
          phone: c.people?.phone,
          trade_name: c.people?.trade_name,
          payment_deadline_days: c.payment_deadline_days,
          active: c.active,
          created_at: c.created_at,
          updated_at: c.updated_at
        };
      })
    );
  }

  create(payload: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: any): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, payload).pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
