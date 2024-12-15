import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from './order.interface';

@Injectable({
    providedIn: 'root'
})
export class MockOrderService {
    private mockOrders: Order[] = [
        {
            id: '1',
            customerName: 'John Doe',
            items: [
                {
                    productId: '1',
                    quantity: 2,
                    price: 9.99,
                    title: 'Product 1',
                    specialInstructions: ''
                }
            ],
            total: 19.98,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentMethod: 'cash'
        }
    ];

    getOrders(): Observable<Order[]> {
        return of(this.mockOrders);
    }

    updateOrderStatus(orderId: string, status: 'pending' | 'completed'): Observable<Order> {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            return of(order);
        }
        throw new Error('Order not found');
    }

}
