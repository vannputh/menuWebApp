import { Component } from '@angular/core';
import {MenuItemComponent} from "../menu-item/menu-item.component";

@Component({
  selector: 'app-drinks',
  standalone: true,
    imports: [
        MenuItemComponent
    ],
  templateUrl: './drinks.component.html',
  styleUrl: './drinks.component.scss'
})
export class DrinksComponent {

}
