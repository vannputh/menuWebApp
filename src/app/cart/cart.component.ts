import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.items = items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(index: number, quantity: number) {
    this.cartService.updateQuantity(index, quantity);
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  checkout() {
    // Implement checkout logic
    console.log('Checkout initiated');
  }
}
