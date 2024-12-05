import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MainDishesService } from './main-dishes.service';
import { MainDish } from './main-dishes.interface';
import {AddToCartDialogComponent} from "../menu-item/add-to-cart-dialog.component";

@Component({
  selector: 'app-main-dishes',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent
  ],
  styleUrl: './main-dishes.component.scss',
  template: `
    <div class="menu-items">
      <app-menu-item
        *ngFor="let dish of mainDishes"
        [imageSrc]="dish.imageSrc"
        [title]="dish.title"
        [price]="dish.price" 
        (addToCartEvent)="onAddToCart({ imageSrc: dish.imageSrc, title: dish.title, price: dish.price, quantity: 1 })">
      </app-menu-item>
    </div>
  `
})
export class MainDishesComponent implements OnInit {
  mainDishes: MainDish[] = [];
    private dialog: any;

  constructor(private mainDishesService: MainDishesService) {}

  ngOnInit() {
    this.mainDishesService.getMainDishes()
        .subscribe({
          next: (dishes) => {
            this.mainDishes = dishes;
          },
          error: (error) => {
            console.error('Error fetching main dishes:', error);
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
