import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { LaptopService } from '../../services/laptop.service';
import { Order } from '../../models/order.model';
import { Laptop } from '../../models/laptop.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent implements OnInit {
  orderId: string | null = null;
  order: Order | null = null;
  orderItems: Array<{laptop: Laptop; quantity: number; price: number}> = [];
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private laptopService: LaptopService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || null;
      if (this.orderId) {
        this.loadOrderDetails();
      }
    });
  }

  private loadOrderDetails() {
    if (!this.orderId) return;

    this.loading = true;
    this.error = false;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loadLaptopDetails(order);
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadLaptopDetails(order: Order) {
    const laptopRequests = order.items.map(item => 
      this.laptopService.getLaptopById(item.laptopId)
    );

    forkJoin(laptopRequests).subscribe({
      next: (laptops) => {
        this.orderItems = order.items.map((item, index) => ({
          laptop: laptops[index],
          quantity: item.quantity,
          price: item.price
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading laptop details:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
