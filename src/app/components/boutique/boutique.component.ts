import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { ShopService, Product } from '../../services/shop.service';

interface HeroSlide {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent implements OnInit, OnDestroy {
  categories: string[] = ['All', 'Tops', 'Accessories', 'Dresses']; 
  heroSlides: HeroSlide[] = [
    { title: 'The Summer Collection', subtitle: 'Curated minimalist tailoring designed for modern ease.' },
    { title: 'Elevated Essentials', subtitle: 'Handcrafted premium statement jewelry to anchor any look.' },
    { title: 'Timeless Aesthetic', subtitle: 'Sustainably sourced accessories crafted with flawless precision.' }
  ];

  currentSlideIndex = signal<number>(0);
  private autoAdvanceTimer: any;

  selectedCategory = signal<string>('All');
  isCartOpen = signal<boolean>(false);
  
  // ⚙️ Admin Mode view toggles and form bindings
  isAdminMode = signal<boolean>(false);
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();

  constructor(public shopService: ShopService) {}

  filteredProducts = computed(() => {
    const activeCategory = this.selectedCategory();
    const allProducts = this.shopService.products();

    if (activeCategory === 'All') {
      return allProducts;
    }
    return allProducts.filter((p: Product) => p.category.toLowerCase() === activeCategory.toLowerCase());
  });

  ngOnInit() {
    this.autoAdvanceTimer = setInterval(() => {
      this.currentSlideIndex.update(index => (index + 1) % this.heroSlides.length);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
    }
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
  }

  toggleCart() {
    this.isCartOpen.update(isOpen => !isOpen);
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  // 🛠️ Admin Action Handling
  // toggleAdminMode() {
  //   this.isAdminMode.update(val => !val);
  //   this.cancelEdit();
  // }

  saveProduct() {
    if (!this.currentProduct.name || !this.currentProduct.price) return;

    if (this.isEditing) {
      this.shopService.updateProduct(this.currentProduct);
    } else {
      this.shopService.addProduct(this.currentProduct);
    }
    this.cancelEdit();
  }

  startEdit(product: Product) {
    this.isEditing = true;
    this.currentProduct = { ...product };
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentProduct = this.getEmptyProduct();
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to remove this product from your inventory?')) {
      this.shopService.deleteProduct(id);
      this.cancelEdit();
    }
  }

  private getEmptyProduct(): Product {
    return { id: '', name: '', price: 0, category: 'Tops', image: '', description: '', stockCount:0, colors:[] };
  }
}