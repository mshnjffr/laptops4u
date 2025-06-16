import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartSummary, CartItem } from '../../models/cart-item.model';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CartItemComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartSummary: CartSummary = { items: [], totalAmount: 0, totalItems: 0 };
  placing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cartSummary = cart;
    });
  }

  placeOrder() {
    if (this.cartSummary.items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (this.placing) return; // Prevent double-clicking

    this.placing = true;
    
    const orderRequest: CreateOrderRequest = {
      items: this.cartSummary.items.map(item => ({
        laptopId: item.laptop.id,
        quantity: item.quantity,
        price: item.laptop.price
      })),
      totalAmount: this.cartSummary.totalAmount
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        this.cartService.clearCart();
        this.router.navigate(['/order-success'], { 
          queryParams: { orderId: order.orderId } 
        });
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.placing = false;
        
        // Handle different error types
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (err.status === 400) {
          errorMessage = err.error?.message || 'Invalid order data. Please check your cart.';
        } else if (err.status === 404) {
          errorMessage = 'One or more items in your cart are no longer available.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.status === 0) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        alert(errorMessage);
      }
    });
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.laptop.id;
  }
}
