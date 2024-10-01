import { Component } from '@angular/core';
import {MenuItemComponent} from "../menu-item/menu-item.component";

@Component({
  selector: 'app-main-dishes',
  standalone: true,
  imports: [
    MenuItemComponent
  ],
  templateUrl: './main-dishes.component.html',
  styleUrl: './main-dishes.component.scss'
})
export class MainDishesComponent {

}
