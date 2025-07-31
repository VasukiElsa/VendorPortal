import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrders: any[] = [];
  filteredPurchaseOrders: any[] = [];
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortField = '';
  sortDirection = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('username');
    
    if (!userId) {
      alert('User not logged in');
      this.isLoading = false;
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/po/get-vendor-po', { params })
      .subscribe({
        next: (res) => {
          this.purchaseOrders = res;
          this.filteredPurchaseOrders = [...res];
          this.isLoading = false;
          console.log('PO Data:', res);
        },
        error: (err) => {
          console.error('Failed to fetch PO data', err);
          this.isLoading = false;
        }
      });
  }

  getTotalValue(): number {
    return this.purchaseOrders.reduce((total, po) => {
      const value = parseFloat(po.netValue) || 0;
      return total + value;
    }, 0);
  }

  getDaysAgo(date: string): string {
    const orderDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getDeliveryStatus(deliveryDate: string): string {
    const delivery = new Date(deliveryDate);
    const now = new Date();
    const diffTime = delivery.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays <= 7) return `${diffDays} days left`;
    return 'On track';
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPurchaseOrders = [...this.purchaseOrders];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredPurchaseOrders = this.purchaseOrders.filter(po => 
        po.poNumber?.toLowerCase().includes(searchLower) ||
        po.vendorName?.toLowerCase().includes(searchLower) ||
        po.materialNo?.toLowerCase().includes(searchLower) ||
        po.materialDesc?.toLowerCase().includes(searchLower) ||
        po.plant?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredPurchaseOrders = [...this.purchaseOrders];
    this.currentPage = 1;
  }

  // Sorting functionality
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredPurchaseOrders.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date sorting
      if (field === 'poDocDate' || field === 'deliveryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric sorting
      if (field === 'quantity' || field === 'netValue' || field === 'netPrice') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination functionality
  get totalItems(): number {
    return this.filteredPurchaseOrders.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  get paginatedPurchaseOrders(): any[] {
    return this.filteredPurchaseOrders.slice(this.startIndex, this.endIndex);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Status functionality
  getStatusText(po: any): string {
    const deliveryDate = new Date(po.deliveryDate);
    const now = new Date();
    const diffTime = deliveryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays <= 7) return 'Urgent';
    if (diffDays <= 30) return 'Active';
    return 'Scheduled';
  }

  getStatusClass(po: any): string {
    const status = this.getStatusText(po);
    switch (status) {
      case 'Overdue': return 'status-danger';
      case 'Urgent': return 'status-warning';
      case 'Active': return 'status-success';
      default: return 'status-info';
    }
  }

  // Filter functionality
  toggleFilters(): void {
    // Implement filter panel toggle
    console.log('Toggle filters');
  }

  // Export functionality
  exportData(): void {
    // Implement export functionality
    console.log('Export data');
  }

  // Refresh functionality
  refreshData(): void {
    this.loadPurchaseOrders();
  }
}
