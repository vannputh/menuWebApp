import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() addToCartEvent = new EventEmitter<{title: string, price: number, quantity: number}>();

  count: number = 1;

  increment() {
    this.count++;
  }

  decrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

  addToCart() {
    this.addToCartEvent.emit({
      title: this.title,
      price: this.price,
      quantity: this.count
    });
  }
}
