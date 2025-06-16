import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, orderRequest);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
  }
}
