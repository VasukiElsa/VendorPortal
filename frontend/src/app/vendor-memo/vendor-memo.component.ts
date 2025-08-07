import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vendor-memo',
  templateUrl: './vendor-memo.component.html',
  styleUrls: ['./vendor-memo.component.css']
})
export class VendorMemoComponent implements OnInit {
  memos: any[] = [];
  filteredMemos: any[] = [];
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

    this.http.get<any[]>('http://localhost:3000/vendor-memo/get-vendor-memos', { params })
      .subscribe({
        next: (res) => {
          this.memos = res;
          this.filteredMemos = [...res];
          this.totalItems = res.length;
          this.calculatePagination();
          this.isLoading = false;
          console.log('Memo Data:', res);
        },
        error: (err) => {
          console.error('Failed to fetch vendor memo data', err);
          this.isLoading = false;
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMemos = [...this.memos];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredMemos = this.memos.filter(memo =>
        memo.memoDocumentNo?.toString().toLowerCase().includes(searchLower) ||
        memo.userId?.toString().toLowerCase().includes(searchLower) ||
        memo.memoType?.toString().toLowerCase().includes(searchLower) ||
        memo.currency?.toString().toLowerCase().includes(searchLower) ||
        memo.docType?.toString().toLowerCase().includes(searchLower) ||
        memo.companyCode?.toString().toLowerCase().includes(searchLower)
      );
    }
    this.totalItems = this.filteredMemos.length;
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

    this.filteredMemos.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date fields
      if (field === 'postingDate' || field === 'entryDate') {
        aValue = this.convertSAPDate(aValue);
        bValue = this.convertSAPDate(bValue);
      }

      // Handle numeric fields
      if (field === 'amount') {
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

  getTotalValue(): number {
    return this.memos.reduce((total, memo) => total + (parseFloat(memo.amount) || 0), 0);
  }

  getMemoTypeClass(memoType: string): string {
    const type = memoType?.toLowerCase();
    if (type?.includes('credit')) return 'memo-credit';
    if (type?.includes('debit')) return 'memo-debit';
    return 'memo-neutral';
  }

  convertSAPDate(sapDate: string): string {
    const match = sapDate?.match(/\d+/);
    if (!match) return '';
    const date = new Date(parseInt(match[0], 10));
    return date.toLocaleDateString();
  }
}
