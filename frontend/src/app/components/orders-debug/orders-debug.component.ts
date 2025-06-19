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
 * Bug 2: Orders not displayed - filteredOrders never gets populated 
 * Bug 3: Export button doesn't work - missing link.click() trigger
 * Bug 4: Change status doesn't work - UI never updates when status changes
 * Bug 5: Status filter doesn't work - always shows all orders regardless of filter
 */
export class OrdersDebugComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
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
    
    // BUG 1: Missing try-catch error handling - HTTP request can fail
    const orders = await this.http.get<Order[]>('http://localhost:3000/api/orders').toPromise();
    
    // BUG 2: Orders not displayed - filteredOrders never gets populated
    this.orders = orders!.map(order => ({
      ...order,
      orderDate: new Date(order.orderDate).toLocaleDateString(),
      totalAmount: Math.round(order.totalAmount * 100) / 100
    }));
    
    // Missing: this.filterOrders(); - this causes orders to never be displayed
    this.loading = false;
  }



  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  onStatusChange(): void {
    this.filterOrders();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const [field, direction] = value.split('-');
    this.sortBy = field;
    this.sortDirection = direction as 'asc' | 'desc';
    this.sortOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.orderId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // BUG 5: Status filter doesn't work - always returns true instead of checking selectedStatus
      const matchesStatus = true; // Should be: this.selectedStatus === 'all' || order.status === this.selectedStatus;
      
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
    // BUG 4: Change status option doesn't work - missing event.preventDefault()
    const newStatus = (event.target as HTMLSelectElement).value;
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
      // Missing: this.orders[orderIndex].status = newStatus; - status never updates in UI
      this.filterOrders();
      
      this.http.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus })
        .subscribe({
          error: (error) => {
            console.error('Failed to update status:', error);
          }
        });
    }
  }



  exportToCSV(): void {
    // BUG 3: Export button doesn't work - missing link click event
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders-export.csv';
    document.body.appendChild(link);
    // Missing: link.click(); - this prevents the download from starting
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateCSVContent(): string {
    const headers = ['Order ID', 'Date', 'Items Count', 'Status', 'Total'];
    const rows = this.filteredOrders.map(order => [
      order.orderId,
      order.orderDate,
      order.items.length.toString(),
      order.status,
      order.totalAmount.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\\n');
  }




  // BUG 5: Performance issue - method called from template causing unnecessary re-calculations
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
    alert(`Order Details:\\nID: ${order.orderId}\\nDate: ${order.orderDate}\\nItems: ${order.items.length}\\nTotal: $${order.totalAmount}`);
  }
}
