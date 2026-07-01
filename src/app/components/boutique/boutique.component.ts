import { Component, computed, signal } from '@angular/core';
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

export class BoutiqueComponent {
  // Master category list for the navigation tabs
  categories: string[] = ['All', 'Tops', 'Accessories', 'Dresses']; 
  heroSlides: HeroSlide[] = [
    { title: 'The Summer Collection', subtitle: 'Curated minimalist tailoring designed for modern ease.' },
    { title: 'Elevated Essentials', subtitle: 'Handcrafted premium statement jewelry to anchor any look.' },
    { title: 'Timeless Aesthetic', subtitle: 'Sustainably sourced accessories crafted with flawless precision.' }
  ];
  // 2. Signal tracking the current active slide index
  currentSlideIndex = signal<number>(0);
  private autoAdvanceTimer: any;

  // Track the active filter state
  selectedCategory = signal<string>('All');
isCartOpen = signal<boolean>(false);
  constructor(public shopService: ShopService) {}

  // Computed signal that filters products dynamically whenever selectedCategory or shopService.products updates
  filteredProducts = computed(() => {
    const activeCategory = this.selectedCategory();
    const allProducts = this.shopService.products(); // Reading your products signal

    if (activeCategory === 'All') {
      return allProducts;
    }
    
    return allProducts.filter((p: Product) => p.category.toLowerCase() === activeCategory.toLowerCase());
  });
  ngOnInit() {
    // 3. Cycle the hero banners every 5 seconds automatically
    this.autoAdvanceTimer = setInterval(() => {
      this.currentSlideIndex.update(index => (index + 1) % this.heroSlides.length);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
    }
  }

  // Helper method to jump to a specific slide if manually clicked
  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
  }
toggleCart() {
    this.isCartOpen.update(isOpen => !isOpen);
  }
  setCategory(category: string) {
    this.selectedCategory.set(category);
  }
}