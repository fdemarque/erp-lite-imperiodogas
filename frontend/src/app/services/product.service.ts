import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  current_price?: number;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: any): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: any): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, payload).pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
