import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProductModule { 
  
}
