import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getActiveOrder(tableId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/active/${tableId}`, this.getAuthHeaders());
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateOrder(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  getOrderHistory(tableId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/table/${tableId}`, this.getAuthHeaders());
  }

  getAllOrders(page: number = 1, pageSize: number = 10, processStatus: string = 'all'): Observable<{ data: any[]; total: number }> {
    return this.http.get<{ data: any[]; total: number }>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}&processStatus=${processStatus}`, this.getAuthHeaders());
  }
} 