import { Component } from '@angular/core';
import {MenuItemComponent} from "../menu-item/menu-item.component";

@Component({
  selector: 'app-side-dishes',
  standalone: true,
    imports: [
        MenuItemComponent
    ],
  templateUrl: './side-dishes.component.html',
  styleUrl: './side-dishes.component.scss'
})
export class SideDishesComponent {

}
