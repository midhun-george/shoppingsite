import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, Product } from '../../../services/shop.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();

  // Inject the global store service here cleanly
  constructor(public shopService: ShopService) {}

  ngOnInit() {}

  saveProduct() {
    // Basic validation guard
    if (!this.currentProduct.name || this.currentProduct.price <= 0) return;

    if (this.isEditing) {
      // 🔄 Directly tell the service to update its signal state
      this.shopService.updateProduct(this.currentProduct);
    } else {
      // 🔄 Directly push the new item metadata into the store signals channel
      this.shopService.addProduct(this.currentProduct);
    }

    this.cancelEdit();
  }

  startEdit(product: Product) {
    this.isEditing = true;
    // Deep copy to prevent mutating live list data directly before clicking update
    this.currentProduct = { 
      ...product,
      colors: product.colors ? [...product.colors] : [] 
    };
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentProduct = this.getEmptyProduct();
  }

  deleteProduct(id: string) {
    if (confirm('Are you certain you want to remove this catalog product entirely?')) {
      // 🔄 Let your service handle filtering and state propagation seamlessly
      this.shopService.deleteProduct(id);
      this.cancelEdit();
    }
  }

  addColor(colorVal: string) {
    const trimmed = colorVal.trim().toLowerCase();
    if (!trimmed) return;
    
    if (!this.currentProduct.colors) {
      this.currentProduct.colors = [];
    }
    
    if (!this.currentProduct.colors.includes(trimmed)) {
      this.currentProduct.colors.push(trimmed);
    }
  }

  removeColor(index: number) {
    if (this.currentProduct.colors) {
      this.currentProduct.colors.splice(index, 1);
    }
  }

  private getEmptyProduct(): Product {
    return { 
      id: '', 
      name: '', 
      price: 0, 
      category: 'Clothing', 
      image: '', 
      description: '',
      stockCount: 0,   
      colors: []       
    };
  }
}