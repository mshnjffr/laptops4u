import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Laptops4U';
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });
  }
}
