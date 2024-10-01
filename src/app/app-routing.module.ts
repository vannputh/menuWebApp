// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDishesComponent } from './main-dishes/main-dishes.component';
import { SideDishesComponent } from './side-dishes/side-dishes.component';
import { CartComponent} from "./cart/cart.component";

const routes: Routes = [
  { path: 'main-dishes', component: MainDishesComponent },
  { path: 'side-dishes', component: SideDishesComponent },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
