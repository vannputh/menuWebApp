import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { DrinksService } from './drinks.service';
import { Drink } from './drink.interface';

@Component({
    selector: 'app-drinks',
    standalone: true,
    imports: [
        CommonModule,
        MenuItemComponent
    ],
    styleUrl: './drinks.component.scss',
    template: `
    <div class="menu-items">
      <app-menu-item
        *ngFor="let drink of drinks"
        [imageSrc]="drink.imageSrc"
        [title]="drink.title"
        [price]="drink.price"
        itemType="drink">
      </app-menu-item>
    </div>
  `
})
export class DrinksComponent implements OnInit {
    drinks: Drink[] = [];
    private dialog: any;

    constructor(private drinksService: DrinksService) {}

    ngOnInit() {
        this.drinksService.getDrinks()
            .subscribe({
                next: (drinks) => {
                    this.drinks = drinks;
                },
                error: (error) => {
                    console.error('Error fetching drinks:', error);
                }
            });
    }
}
