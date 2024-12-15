import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.interface';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6 dark:bg-gray-800 min-h-screen mt-24">
        <h1 class="text-3xl font-bold mb-6 dark:text-white">Orders Dashboard</h1>

        <div class="grid grid-cols-1 gap-4">
            <div *ngFor="let order of orders"
                 class="bg-white dark:bg-gray-700 rounded-lg shadow p-4 transition-all hover:shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-xl font-semibold dark:text-white">Order #{{order.id}}</h2>
                        <p class="text-gray-600 dark:text-gray-300">{{order.customerName}}</p>
                        <p class="text-gray-500 dark:text-gray-400">{{order.createdAt | date:'medium'}}</p>
                        <p class="text-gray-500 dark:text-gray-400">Payment: {{order.paymentMethod}}</p>
                    </div>
                    <div class="flex items-center">
                        <span [class]="getStatusClass(order.status)">
                            {{order.status}}
                        </span>
                        <button
                                *ngIf="order.status === 'pending'"
                                (click)="markAsCompleted(order)"
                                class="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                            Mark Complete
                        </button>
                    </div>
                </div>

                <div class="border-t dark:border-gray-600 pt-4">
                    <h3 class="font-semibold mb-2 dark:text-white">Order Items:</h3>
                    <div *ngFor="let orderItem of order.items" class="flex justify-between items-center mb-2">
                        <span class="dark:text-gray-300">{{orderItem.quantity}}x {{orderItem.title}}</span>
                        <span class="dark:text-gray-300">\${{orderItem.price * orderItem.quantity}}</span>
                        <span class="dark:text-gray-300">({{orderItem.specialInstructions}})</span>
                    </div>
                    <div class="border-t dark:border-gray-600 mt-2 pt-2 flex justify-between font-semibold">
                        <span class="dark:text-white">Total:</span>
                        <span class="dark:text-white">\${{order.total}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    orders: Order[] = [];

    constructor(private orderService: OrderService) {}

    ngOnInit() {
    this.orderService.getOrders()
        .subscribe({
            next: (orders) => {
                this.orders = orders;
            },
            error: (error) => {
                console.error('Error fetching orders:', error);
                alert('Failed to fetch orders. Please check the console for more details.');
            }
        });
    }

    getStatusClass(status: string): string {
        return status === 'completed'
            ? 'px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }

    markAsCompleted(order: Order) {
        this.orderService.updateOrderStatus(order.id, 'completed')
            .subscribe({
                next: (updatedOrder) => {
                    order.status = updatedOrder.status;
                },
                error: (error) => {
                    console.error('Error updating order status:', error);
                }
            });
    }
}
