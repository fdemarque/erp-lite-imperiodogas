import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  person: {
    id: string;
    name: string;
    document: string;
    phone: string;
    person_type: string;
  };
  email?: string;
  role: 'ADMINISTRADOR' | 'SECRETARIO' | 'ENTREGADOR' | 'ADMIN' | 'OPERADOR';
  cpf: string;
  address: string;
  monthly_salary: number;
  birth_date: string;
  hire_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRequest {
  name: string;
  phone?: string;
  email?: string;
  role: string;
  cpf: string;
  address: string;
  monthly_salary: number;
  birth_date: string;
  hire_date?: string;
  active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  getDeliverers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/entregadores`).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: UserRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: Partial<UserRequest>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, payload).pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
