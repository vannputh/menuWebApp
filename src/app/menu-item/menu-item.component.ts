import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart-item.interface';
import {RouterLink} from "@angular/router";

export interface AddToCartDialogData {
  title: string;
  price: number;
  imageSrc: string;
}

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() imageSrc: string = '';
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() itemType: 'drink' | 'bottled' | 'main' | 'side' | 'soup' = 'main';

  @ViewChild('addToCartDialog', { static: true }) addToCartDialog!: TemplateRef<any>;

  dialogQuantity: number = 1;
  dialogSpecialInstructions: string = '';
  dialogSugarLevel: string = '';
  dialogIceLevel: string = '';
  dialogSpiceLevel: string = '';
  dialogSoupType: string = '';
  dialogIced: string = '';
  dialogTopping: string = '';

  constructor(
      private dialog: MatDialog,
      private cartService: CartService
  ) {}

  addToCart() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'centered-dialog';
    dialogConfig.width = '600px';

    const dialogRef = this.dialog.open(this.addToCartDialog, dialogConfig);

    // Reset quantity and special instructions when dialog opens
    this.dialogQuantity = 1;
    this.dialogSpecialInstructions = '';
    this.dialogSugarLevel = '100%';
    this.dialogIceLevel = '100%';
    this.dialogSpiceLevel = '100%';
    this.dialogSoupType = 'sichuan_spicy';
    this.dialogIced = 'yes';
    this.dialogTopping = 'None';
  }

  onAddToCart(dialogRef: MatDialogRef<any>): void {
    const cartItem: CartItem = {
      imageUrl: this.imageSrc,
      title: this.title,
      price: this.price,
      quantity: this.dialogQuantity,
      specialInstructions: this.dialogSpecialInstructions,
      sugarLevel: this.itemType === 'drink' ? this.dialogSugarLevel : undefined,
      iceLevel: this.itemType === 'drink' ? this.dialogIceLevel : undefined,
      spiceLevel: this.itemType === 'main' ? this.dialogSpiceLevel : undefined,
      soupType: this.itemType === 'soup' ? this.dialogSoupType : undefined,
      iced: this.itemType === 'bottled' ? this.dialogIced : undefined,
      topping: this.itemType === 'drink' ? this.dialogTopping : undefined
    };

    this.cartService.addToCart(cartItem);
    dialogRef.close();
  }
}
