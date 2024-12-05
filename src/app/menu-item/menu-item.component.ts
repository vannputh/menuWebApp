import { Component, Input } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart-item.interface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  standalone: true,
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() price!: number;

  count: number = 1;

  constructor(private cartService: CartService) {}

  increment() {
    this.count++;
  }

  decrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

  addToCart() {
    const cartItem: CartItem = {
      imageUrl: this.imageSrc,
      title: this.title,
      price: this.price,
      quantity: this.count
    };

    this.cartService.addToCart(cartItem);

    // Reset count after adding to cart
    this.count = 1;
  }
}
