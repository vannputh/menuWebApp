import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { SideDishesService } from './side-dishes.service';
import { SideDish } from './side-dishes.interface';
import {AddToCartDialogComponent} from "../menu-item/add-to-cart-dialog.component";

@Component({
  selector: 'app-side-dishes',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent
  ],
  styleUrl: './side-dishes.component.scss',
  template: `
    <div class="menu-items">
      <app-menu-item
        *ngFor="let dish of sideDishes"
        [imageSrc]="dish.imageSrc"
        [title]="dish.title"
        [price]="dish.price"
        (addToCartEvent)="onAddToCart({ imageSrc: dish.imageSrc, title: dish.title, price: dish.price, quantity: 1 })">
      </app-menu-item>
    </div>
  `
})
export class SideDishesComponent implements OnInit {
  sideDishes: SideDish[] = [];
    private dialog: any;

  constructor(private sideDishesService: SideDishesService) {}

  ngOnInit() {
    this.sideDishesService.getSideDishes()
        .subscribe({
          next: (dishes) => {
            this.sideDishes = dishes;
          },
          error: (error) => {
            console.error('Error fetching side dishes:', error);
          }
        });
  }

    onAddToCart(item: {
        imageSrc: any;
        title: string; price: number; quantity: number }) {
        const dialogRef = this.dialog.open(AddToCartDialogComponent, {
            width: '500px',
            data: {
                title: item.title,
                price: item.price,
                imageSrc: item.imageSrc
            }
        });
}
}
