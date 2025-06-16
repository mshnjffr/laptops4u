import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart-item.model';
import { Laptop } from '../models/laptop.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'laptops4u-cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartSummary>(this.getCartSummary());

  cart$: Observable<CartSummary> = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(laptop: Laptop, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.laptop.id === laptop.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ laptop, quantity });
    }
    
    this.updateCart();
  }

  removeFromCart(laptopId: string): void {
    this.cartItems = this.cartItems.filter(item => item.laptop.id !== laptopId);
    this.updateCart();
  }

  updateQuantity(laptopId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.laptop.id === laptopId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(laptopId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  private updateCart(): void {
    this.saveCartToStorage();
    this.cartSubject.next(this.getCartSummary());
  }

  private loadCartFromStorage(): void {
    try {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.cartSubject.next(this.getCartSummary());
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems = [];
    }
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private getCartSummary(): CartSummary {
    const totalAmount = this.cartItems.reduce(
      (total, item) => total + (item.laptop.price * item.quantity), 0
    );
    const totalItems = this.cartItems.reduce(
      (total, item) => total + item.quantity, 0
    );

    return {
      items: [...this.cartItems],
      totalAmount,
      totalItems
    };
  }
}
