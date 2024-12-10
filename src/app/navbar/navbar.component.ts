import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    cartCount: number = 0;

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
        });
    }
}
