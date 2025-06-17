import { Routes } from '@angular/router';
import { LaptopListComponent } from './components/laptop-list/laptop-list.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { OrdersDebugComponent } from './components/orders-debug/orders-debug.component';

export const routes: Routes = [
  { path: '', component: LaptopListComponent },
  { path: 'laptops', component: LaptopListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'orders-debug', component: OrdersDebugComponent }, // Hidden debug page
  { path: '**', redirectTo: '' }
];
