import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableService {
  private apiUrl = 'http://localhost:3000/tables';
  private http = inject(HttpClient);

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    console.log('token',token)

    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getTables(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  createTable(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateTable(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteTable(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  seedTables(): Observable<any> {
    return this.http.post(`${this.apiUrl}/seed`, {}, this.getAuthHeaders());
  }
} 