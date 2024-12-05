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

// @ts-ignore
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
        <h2 mat-dialog-title>Add Item to Cart</h2>
        <mat-dialog-content>
            <div class="dialog-content">
                <img [src]="dialogData.imageSrc" [alt]="dialogData.title" class="item-image">
                <div class="item-details">
                    <h3>{{dialogData.title}}</h3>
                    <p>Price: \${{dialogData.price}}</p>
                    <mat-form-field>
                        <mat-label>Quantity</mat-label>
                        <input
                                matInput
                                type="number"
                                [(ngModel)]="quantity"
                                min="1"
                        >
                    </mat-form-field>

                    <mat-form-field>
                        <mat-label>Special Instructions</mat-label>
                        <textarea
                                matInput
                                [(ngModel)]="specialInstructions"
                                placeholder="Any special requests?"
                        ></textarea>
                    </mat-form-field>
                </div>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button (click)="onCancel()">Cancel</button>
            <button
                    mat-raised-button
                    color="primary"
                    (click)="onAddToCart()"
                    [disabled]="quantity < 1"
            >
                Add to Cart
            </button>
        </mat-dialog-actions>
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
      mat-form-field {
        width: 100%;
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
