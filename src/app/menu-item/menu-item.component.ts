import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../cart/cart.service';
import { AddToCartDialogComponent } from './add-to-cart-dialog.component';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() price!: number;
  @Output() addToCartEvent = new EventEmitter<{ title: string; price: number; quantity: number }>();

  constructor(
      private dialog: MatDialog,
      private cartService: CartService
  ) {}

  addToCart() {
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '500px',
      data: {
        title: this.title,
        price: this.price,
        imageSrc: this.imageSrc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.addToCart(result);
      }
    });
  }
}
