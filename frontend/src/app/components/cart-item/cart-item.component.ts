import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() cartItem!: CartItem;

  constructor(private cartService: CartService) {}

  updateQuantity(newQuantity: number) {
    this.cartService.updateQuantity(this.cartItem.laptop.id, newQuantity);
  }

  removeItem() {
    this.cartService.removeFromCart(this.cartItem.laptop.id);
  }

  get subtotal(): number {
    return this.cartItem.laptop.price * this.cartItem.quantity;
  }
}
