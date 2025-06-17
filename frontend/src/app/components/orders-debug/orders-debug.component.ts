import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
/**
 * OrdersDebugComponent - Contains 5 intentional bugs for Cody AI debugging practice
 * 
 * Bug 1: Missing error handling in loadOrders() method
 * Bug 2: Unsafe property access to customerInfo.name (runtime error risk)
 * Bug 3: Missing validation in exportToCSV() method
 * Bug 4: Missing trackBy functions in template *ngFor loops
 * Bug 5: Method calls in templates causing performance issues
 */
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
  private destroy$ = new Subject<void>();
  
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  async loadOrders(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    // BUG 1: Missing try-catch error handling - HTTP request can fail
    const orders = await this.http.get<Order[]>('http://localhost:3000/api/orders').toPromise();
    
    // BUG 2: Unsafe property access - customerInfo might be null/undefined
    this.orders = orders?.map(order => ({
    ...order,
    customerName: (order.customerInfo as any).name, // This will throw error if customerInfo is null
    orderDate: new Date(order.orderDate).toLocaleDateString(),
    totalAmount: Math.round(order.totalAmount * 100) / 100
    })) || [];
    
    this.filterOrders();
    this.loading = false;
  }

  async loadOrderStats(): Promise<void> {
    try {
      const stats = await this.http.get<OrderStats>('http://localhost:3000/api/orders/stats/summary').toPromise();
      this.orderStats = stats || null;
    } catch (error) {
      console.log('Stats failed to load');
    }
  }

  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  onStatusChange(): void {
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.orderId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (order.customerInfo?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    this.sortOrders();
  }

  sortOrders(): void {
    this.filteredOrders.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (this.sortBy) {
        case 'date':
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
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
          aValue = a.orderId;
          bValue = b.orderId;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orders = this.orders.filter(order => order.orderId !== orderId);
      this.filterOrders();
      
      this.http.delete(`http://localhost:3000/api/orders/${orderId}`).subscribe();
    }
  }

  updateOrderStatus(orderId: string, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = newStatus;
      this.filterOrders();
      
      this.http.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus })
        .subscribe({
          error: (error) => {
            console.error('Failed to update status:', error);
          }
        });
    }
  }

  refreshOrders(): void {
    this.loadOrders();
    this.loadOrderStats();
  }

  exportToCSV(): void {
    // BUG 3: Missing input validation - no check if there are orders to export
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  private generateCSVContent(): string {
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Total'];
    const rows = this.filteredOrders.map(order => [
      order.orderId,
      order.customerInfo?.name || 'N/A',
      order.orderDate,
      order.status,
      order.totalAmount.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\\n');
  }

  // BUG 4: Performance issue - method called from template causing unnecessary re-calculations
  getItemsCount(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  // BUG 5: Template performance - function called on every change detection cycle
  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'badge-warning',
      'confirmed': 'badge-info', 
      'processing': 'badge-primary',
      'shipped': 'badge-success',
      'delivered': 'badge-success',
      'cancelled': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  viewOrderDetails(order: Order): void {
    // Simple implementation for the exercise
    alert(`Order Details:\\nID: ${order.orderId}\\nCustomer: ${order.customerInfo?.name || 'N/A'}\\nTotal: $${order.totalAmount}`);
  }
}
