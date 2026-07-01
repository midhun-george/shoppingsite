import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoutiqueComponent } from './components/boutique/boutique.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component'; // We will create this next
import { AuthGuard } from './guards/auth.guard';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

const routes: Routes = [
  { path: 'shop', component: BoutiqueComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shop/product/:id', component: ProductDetailsComponent },
  { 
    path: 'checkout', 
    component: CheckoutComponent, 
    canActivate: [AuthGuard] // 👈 Blocks unauthorized users instantly!
  },
  { path: '', redirectTo: '/shop', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }