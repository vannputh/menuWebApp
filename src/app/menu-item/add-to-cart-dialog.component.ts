import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CartItem } from '../cart/cart-item.interface';

export interface AddToCartDialogData {
    title: string;
    price: number;
    imageSrc: string;
}

@Component({
    selector: 'app-add-to-cart-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Add Item to Cart</h2>
          </div>
          <form class="p-6">
            <div class="space-y-4">
              <div class="dialog-content flex items-start gap-4">
                <img [src]="dialogData.imageSrc" [alt]="dialogData.title" class="item-image max-w-xs max-h-xs object-cover rounded-md">
                <div class="item-details flex-grow">
                  <h3 class="text-lg font-semibold">{{dialogData.title}}</h3>
                  <p class="text-gray-700">Price: \${{dialogData.price}}</p>
                  <div>
                    <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      [(ngModel)]="quantity"
                      min="1"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                    >
                  </div>
                  <div class="mt-4">
                    <label for="specialInstructions" class="block text-sm font-medium text-gray-700">Special Instructions</label>
                    <textarea
                      id="specialInstructions"
                      [(ngModel)]="specialInstructions"
                      placeholder="Any special requests?"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" (click)="onCancel()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
              <button
                type="button"
                (click)="onAddToCart()"
                [disabled]="quantity < 1"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </form>
        </div>
      </div>
    `,
    styles: [`
      .dialog-content {
        display: flex;
        align-items: start;
        gap: 20px;
      }
      .item-image {
        max-width: 150px;
        max-height: 150px;
        object-fit: cover;
      }
      .item-details {
        flex-grow: 1;
      }
    `]
})
export class AddToCartDialogComponent {
    quantity: number = 1;
    specialInstructions: string = '';
    dialogData: AddToCartDialogData;

    constructor(
        public dialogRef: MatDialogRef<AddToCartDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: AddToCartDialogData
    ) {
        this.dialogData = data;
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onAddToCart(): void {
        const cartItem: CartItem = {
            imageUrl: this.dialogData.imageSrc,
            title: this.dialogData.title,
            price: this.dialogData.price,
            quantity: this.quantity,
            specialInstructions: this.specialInstructions
        };

        this.dialogRef.close(cartItem);
    }
}
