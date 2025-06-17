import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface Order {
  orderId: string;
  orderDate: string;
  items: Array<{
    laptopId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  customerInfo?: {
    name: string;
    email: string;
  };
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

@Component({
  selector: 'app-orders-debug',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-debug.component.html',
  styleUrl: './orders-debug.component.scss'
})
export class OrdersDebugComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderStats: OrderStats | null = null;
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  private searchSubject = new Subject<string>();
  private refreshSubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  private autoRefreshInterval = interval(5000);
  private ordersCache = new BehaviorSubject<Order[]>([]);
  
  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStats();
    
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.filterOrders();
      });

    this.autoRefreshInterval
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOrders();
        this.loadOrderStats();
      });

    this.ordersCache
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = orders;
        this.filterOrders();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
    this.refreshSubject.complete();
    this.ordersCache.complete();
  }

  async loadOrders(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      // BUG 8: No error handling for HTTP requests
      const orders = await this.http.get<Order[]>('http://localhost:3000/api/orders').toPromise();
      
      // BUG 9: Potential null/undefined access
      this.orders = orders?.map(order => ({
        ...order,
        // BUG 10: Unsafe property access
        customerName: order.customerInfo?.name,
        // BUG 11: Incorrect date parsing
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        // BUG 12: Math precision issues
        totalAmount: Math.round(order.totalAmount * 100) / 100
      })) || [];
      
      this.ordersCache.next(this.orders);
      this.filterOrders();
    } catch (error) {
      // BUG 13: Poor error handling
      this.error = 'Failed to load orders';
      console.log(error); // Should use console.error
    } finally {
      this.loading = false;
    }
  }

  async loadOrderStats(): Promise<void> {
    try {
      // BUG 14: Hardcoded URL without environment config
      const stats = await this.http.get<OrderStats>('http://localhost:3000/api/orders/stats/summary').toPromise();
      this.orderStats = stats || null;
    } catch (error) {
      // BUG 15: Silent failure
      console.log('Stats failed to load');
    }
  }

  onSearchChange(event: Event): void {
    // BUG 16: Emitting too frequently
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  onStatusChange(): void {
    this.filterOrders();
  }

  onSortChange(): void {
    this.sortOrders();
  }

  filterOrders(): void {
    let filtered = [...this.orders];

    // BUG 17: Case-sensitive search
    if (this.searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.includes(this.searchTerm) ||
        // BUG 18: Potential null reference  
        order.customerInfo?.email?.includes(this.searchTerm)
      );
    }

    // BUG 19: String comparison issue
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    this.filteredOrders = filtered;
    this.sortOrders();
  }

  sortOrders(): void {
    // BUG 20: Missing null check
    this.filteredOrders.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortBy) {
        case 'date':
          // BUG 21: Incorrect date comparison
          aValue = a.orderDate;
          bValue = b.orderDate;
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      // BUG 22: Type coercion issues
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // BUG 23: Missing trackBy function causing performance issues
  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      // BUG 24: Optimistic update without proper error handling
      this.orders = this.orders.filter(order => order.orderId !== orderId);
      this.filterOrders();
      
      this.http.delete(`http://localhost:3000/api/orders/${orderId}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => {
            console.error('Failed to delete order', error);
            this.loadOrders(); // Reload to revert optimistic update
          }
        });
    }
  }

  updateOrderStatus(orderId: string, event: Event): void {
    // BUG 26: Race condition - multiple rapid clicks
    const newStatus = (event.target as HTMLSelectElement).value;
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = newStatus;
      this.filterOrders();
      
      this.http.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => {
            console.error('Failed to update order status', error);
            this.loadOrders(); // Reload to revert optimistic update
          }
        });
    }
  }

  refreshOrders(): void {
    // BUG 29: No debouncing on manual refresh
    this.loadOrders();
    this.loadOrderStats();
  }

  // BUG 30: Method with side effects and no error handling
  exportOrders(): void {
    const csvData = this.orders.map(order => {
      return [
        order.orderId,
        order.orderDate,
        order.status,
        order.totalAmount,
        // BUG 31: Potential null reference in export
        order.customerInfo?.email || 'N/A'
      ].join(',');
    }).join('\n');

    // BUG 32: Browser compatibility issues
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // BUG 34: Method called from template causing performance issues
  getItemsCount(order: Order): number {
    // BUG 35: Expensive calculation called on every change detection
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  viewOrderDetails(order: Order): void {
    // BUG 36: Not implemented but referenced in template
    alert('View details not implemented yet');
  }
}
