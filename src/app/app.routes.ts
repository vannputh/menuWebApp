import { Routes } from '@angular/router';
import { MainDishesComponent } from './main-dishes/main-dishes.component';
import { SideDishesComponent } from './side-dishes/side-dishes.component';
import { DrinksComponent } from './drinks/drinks.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: 'main-dishes', component: MainDishesComponent },
  { path: 'side-dishes', component: SideDishesComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/main-dishes', pathMatch: 'full' },
  { path: '**', redirectTo: '/main-dishes' }
];
