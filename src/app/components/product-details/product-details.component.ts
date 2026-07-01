import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ShopService, Product } from '../../services/shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  // 2. Strongly type your property instead of using 'any'
  product: Product | undefined; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.product = this.shopService.getProductById(productId);
    });
  }

  addToBag() {
    if (this.product) {
      this.shopService.addToCart(this.product);
      alert(`${this.product.name} added to your bag!`);
    }
  }
}