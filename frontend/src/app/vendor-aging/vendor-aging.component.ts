import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vendor-aging',
  templateUrl: './vendor-aging.component.html',
  styleUrls: ['./vendor-aging.component.css']
})
export class VendorAgingComponent implements OnInit {
  agingData: any[] = [];
  filteredAgingData: any[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  visiblePages: number[] = [];

  // Sorting
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('username');
    if (!userId) {
      alert('User not logged in');
      this.isLoading = false;
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/vendor-payments/get-vendor-aging', { params })
      .subscribe({
        next: (data) => {
          this.agingData = data;
          this.filteredAgingData = [...data];
          this.totalItems = data.length;
          this.calculatePagination();
          this.isLoading = false;
          console.log('Vendor Aging Data:', data);
        },
        error: (err) => {
          console.error('Failed to fetch vendor aging data', err);
          this.isLoading = false;
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAgingData = [...this.agingData];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredAgingData = this.agingData.filter(item =>
        item.paymentDoc?.toString().toLowerCase().includes(searchLower) ||
        item.userId?.toString().toLowerCase().includes(searchLower) ||
        item.currency?.toString().toLowerCase().includes(searchLower) ||
        item.aging?.toString().toLowerCase().includes(searchLower)
      );
    }
    this.totalItems = this.filteredAgingData.length;
    this.currentPage = 1;
    this.calculatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredAgingData.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date fields
      if (field === 'paymentDate' || field === 'dueDate') {
        aValue = this.convertSAPDate(aValue);
        bValue = this.convertSAPDate(bValue);
      }

      // Handle numeric fields
      if (field === 'amountPaid' || field === 'aging') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    
    // Calculate visible pages
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.calculatePagination();
    }
  }

  refreshData(): void {
    this.loadData();
  }

  getAgingClass(aging: string): string {
    const agingValue = parseInt(aging) || 0;
    if (agingValue <= 30) return 'aging-normal';
    if (agingValue <= 60) return 'aging-warning';
    return 'aging-critical';
  }

  convertSAPDate(sapDateString: string): string {
    const match = sapDateString?.match(/\d+/);
    if (!match) return '';
    const date = new Date(parseInt(match[0], 10));
    return date.toLocaleDateString();
  }
}
