import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Laptop } from '../../models/laptop.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-laptop-card',
  imports: [CommonModule],
  templateUrl: './laptop-card.component.html',
  styleUrl: './laptop-card.component.scss'
})
export class LaptopCardComponent {
  @Input() laptop!: Laptop;
  addedToCart = false;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.laptop);
    this.addedToCart = true;
    
    // Reset the feedback after 2 seconds
    setTimeout(() => {
      this.addedToCart = false;
    }, 2000);
  }

  get mainImage(): string {
    return this.laptop.images && this.laptop.images.length > 0 
      ? this.laptop.images[0] 
      : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center';
  }

  get buttonText(): string {
    if (this.addedToCart) return 'Added!';
    if (!this.laptop.inStock) return 'Unavailable';
    return 'Add to Cart';
  }
}
