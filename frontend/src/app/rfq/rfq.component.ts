import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
  rfqList: any[] = [];
  filteredRFQs: any[] = [];
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortField = '';
  sortDirection = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRFQ();
  }

  loadRFQ(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('username');
    
    if (!userId) {
      alert('User not logged in!');
      this.isLoading = false;
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/rfq/get-vendor-rfq', { params })
      .subscribe({
        next: (res) => {
          console.log('✅ RFQ data from backend:', res);
          this.rfqList = res;
          this.filteredRFQs = [...res];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error fetching RFQ:', err);
          this.isLoading = false;
        }
      });
  }

  getActiveRFQs(): number {
    const now = new Date();
    return this.rfqList.filter(rfq => {
      const bidDate = new Date(rfq.bidDate);
      return bidDate > now;
    }).length;
  }

  getDaysAgo(date: string): string {
    const rfqDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - rfqDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getBidStatus(bidDate: string): string {
    const bid = new Date(bidDate);
    const now = new Date();
    const diffTime = bid.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Closed';
    if (diffDays === 0) return 'Due today';
    if (diffDays <= 7) return `${diffDays} days left`;
    return 'Open';
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
      this.filteredRFQs = [...this.rfqList];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredRFQs = this.rfqList.filter(rfq => 
        rfq.rfqNumber?.toLowerCase().includes(searchLower) ||
        rfq.vendorName?.toLowerCase().includes(searchLower) ||
        rfq.materialDes?.toLowerCase().includes(searchLower) ||
        rfq.purOrg?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredRFQs = [...this.rfqList];
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

    this.filteredRFQs.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date sorting
      if (field === 'rfqCreation' || field === 'bidDate' || field === 'delDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric sorting
      if (field === 'quantity') {
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
    return this.filteredRFQs.length;
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

  get paginatedRFQs(): any[] {
    return this.filteredRFQs.slice(this.startIndex, this.endIndex);
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
  getStatusText(rfq: any): string {
    const bidDate = new Date(rfq.bidDate);
    const now = new Date();
    const diffTime = bidDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Closed';
    if (diffDays <= 7) return 'Urgent';
    if (diffDays <= 30) return 'Active';
    return 'Open';
  }

  getStatusClass(rfq: any): string {
    const status = this.getStatusText(rfq);
    switch (status) {
      case 'Closed': return 'status-danger';
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
    this.loadRFQ();
  }
}
