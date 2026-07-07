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

  allProducts: any[] = []; 
  displayedProducts: any[] = [];
  currentSlideIndex = signal<number>(0);
  private autoAdvanceTimer: any;

  selectedCategory = signal<string>('All');
  isCartOpen = signal<boolean>(false);
  
  // ⚙️ Admin Mode view toggles and form bindings
  isAdminMode = signal<boolean>(false);
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();
  isFilterWindowOpen = false;

  constructor(public shopService: ShopService) {}

  //  ONE Single Unified Signal Object State (Clean & Bug-Free)
  activeFilters = signal({
    sortBy: 'default',
    maxPrice: 5000,
    inStockOnly: false,
    selectedBrand: 'All' // 🏷️ Track brand filters reactively
  });

  // 2. Expand your high-performance Computed Signal Engine pipeline
  filteredProducts = computed(() => {
    const activeCategory = this.selectedCategory();
    const allProducts = this.shopService.products() || [];
    const filters = this.activeFilters();

    // Step A: Filter by Category Tab Strip Link
    let results = allProducts;
    if (activeCategory !== 'All') {
      results = results.filter((p: Product) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Step B: NEW! Filter by Brand selection matching
    if (filters.selectedBrand !== 'All') {
      results = results.filter((p: Product) => p.brand && p.brand.toLowerCase() === filters.selectedBrand.toLowerCase());
    }

    // Step C: Filter by Max Price limits
    results = results.filter((p: Product) => p.price <= filters.maxPrice);

    // Step D: Filter by Stock Level Matrix
    if (filters.inStockOnly) {
      results = results.filter((p: Product) => (p.stockCount !== undefined ? p.stockCount > 0 : (p as any).stock > 0));
    }

    // Step E: Apply Sorting
    if (filters.sortBy === 'priceLowHigh') {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHighLow') {
      results = [...results].sort((a, b) => b.price - a.price);
    }

    return results;
  });

  // 3. Add a helper function to modify this new brand criteria dynamically
  updateBrand(brandName: string) {
    this.activeFilters.update(f => ({ ...f, selectedBrand: brandName }));
  }

  // 🛠️ Safe Modifier Handlers for the HTML Template
  updateSortBy(value: string) {
    this.activeFilters.update(f => ({ ...f, sortBy: value }));
  }

  updateMaxPrice(value: any) {
    this.activeFilters.update(f => ({ ...f, maxPrice: Number(value) }));
  }

  updateStock(value: boolean) {
    this.activeFilters.update(f => ({ ...f, inStockOnly: value }));
  }

  resetFilters() {
    this.activeFilters.set({
      sortBy: 'default',
      maxPrice: 5000,
      inStockOnly: false,
      selectedBrand: 'All'
    });
  }

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
    return { id: '', name: '', price: 0, category: 'Tops', brand:'',  image: '', description: '', stockCount: 0, colors: [] };
  }

  toggleFilterWindow(isOpen: boolean) {
    this.isFilterWindowOpen = isOpen;
  }
}