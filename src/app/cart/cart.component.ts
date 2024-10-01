// src/app/cart/cart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../item.service';

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.items[index].quantity = newQuantity;
    } else {
      this.removeItem(index);
    }
  }

  checkout(): void {
    console.log('Checkout button clicked');
  }
}
