import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description:string
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  // Master Boutique Inventory Mock Data
 products = signal<Product[]>([
    {
      id: 1,
      name: 'Tailored Linen Blazer',
      price: 145,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop',
      category: 'Clothing',
      description: 'A structural, lightweight blazer crafted entirely from premium organic linen.'
    },
    {
      id: 2,
      name: 'Minimalist Silk Slip Dress',
      price: 180,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop',
      category: 'Clothing',
      description: 'An elegant bias-cut dress made from fluid washed mulberry silk.'
    },
    {
      id: 3,
      name: 'Solid Gold Signet Ring',
      price: 320,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop',
      category: 'Jewelry',
      description: 'Hand-burnished 14k recycled solid yellow gold ring.'
    },
    {
      id: 4,
      name: 'Structured Leather Tote',
      price: 210,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop',
      category: 'Accessories',
      description: 'Full-grain Italian calf leather shoulder bag with a micro-suede lining.'
    }
  ]);

  // Reactive Cart State
  cart = signal<CartItem[]>([]);

  // Computed signals auto-update instantly when the cart changes
  cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  addToCart(product: Product) {
    this.cart.update(currentCart => {
      const existingIndex = currentCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updatedCart = [...currentCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1
        };
        return updatedCart;
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cart.update(currentCart => currentCart.filter(item => item.id !== productId));
  }

getProductById(id: number): Product | undefined {
  // 🔄 Add parentheses () after this.products to read the underlying array value
  return this.products().find((product: Product) => product.id === id);
}
}