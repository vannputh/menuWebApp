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
    const existingItemIndex = currentItems.findIndex(cartItem =>
      cartItem.title === item.title &&
      cartItem.price === item.price &&
      cartItem.sugarLevel === item.sugarLevel &&
      cartItem.iceLevel === item.iceLevel &&
      cartItem.spiceLevel === item.spiceLevel &&
      cartItem.soupType === item.soupType &&
      cartItem.specialInstructions === item.specialInstructions
    );

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

  clearCart() {
    //clear cart
    this.cartItemsSubject.next([]);
  }
}
