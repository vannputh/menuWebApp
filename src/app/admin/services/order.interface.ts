// src/app/admin/services/order.interface.ts
import { OrderItem } from './order-item.interface';

export interface Order {
    items: OrderItem[];
    total: number;
    status: 'pending' | 'completed';
    createdAt: string;
    paymentMethod: 'cash' | 'khqr';
    customerName: string;
}
