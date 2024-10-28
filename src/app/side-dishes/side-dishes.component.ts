import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { SideDishesService } from './side-dishes.service';
import { SideDish } from './side-dishes.interface';

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
        (addToCartEvent)="onAddToCart($event)">
      </app-menu-item>
    </div>
  `
})
export class SideDishesComponent implements OnInit {
  sideDishes: SideDish[] = [];

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

  onAddToCart(event: {title: string, price: number, quantity: number}) {
    console.log('Added to cart:', event);
  }
}
