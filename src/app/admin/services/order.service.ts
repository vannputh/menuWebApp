import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order.interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = environment.apiUrl + '/orders';

    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    updateOrderStatus(orderId: string, status: 'pending' | 'completed'): Observable<Order> {
        return this.http.patch<Order>(`${this.apiUrl}/${orderId}`, { status });
    }
}
