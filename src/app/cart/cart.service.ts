import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(item: CartItem) {
    const currentItems = [...this.cartItemsSubject.value];
    const existingItemIndex = currentItems.findIndex(cartItem => cartItem.title === item.title);

    if (existingItemIndex > -1) {
      // If item exists, update its quantity
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      // If item doesn't exist, add new item
      currentItems.push(item);
    }

    this.cartItemsSubject.next(currentItems);
  }

  updateQuantity(index: number, quantity: number) {
    const currentItems = [...this.cartItemsSubject.value];
    if (quantity > 0) {
      currentItems[index].quantity = quantity;
      this.cartItemsSubject.next(currentItems);
    }
  }

  removeItem(index: number) {
    const currentItems = [...this.cartItemsSubject.value];
    currentItems.splice(index, 1);
    this.cartItemsSubject.next(currentItems);
  }
}
