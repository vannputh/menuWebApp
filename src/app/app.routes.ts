import { Routes } from '@angular/router';
import { MainDishesComponent } from './main-dishes/main-dishes.component';
import { SideDishesComponent } from './side-dishes/side-dishes.component';
import { DrinksComponent } from './drinks/drinks.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: 'main-dishes', component: MainDishesComponent },
  { path: 'side-dishes', component: SideDishesComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  { path: '', redirectTo: '/main-dishes', pathMatch: 'full' },
  { path: '**', redirectTo: '/main-dishes' },

];
