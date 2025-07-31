import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  goodsReceipts: any[] = [];
  filteredGoodsReceipts: any[] = [];
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortField = '';
  sortDirection = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGoodsReceipts();
  }

  loadGoodsReceipts(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('username');
    
    if (!userId) {
      alert('User not logged in');
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/gr/get-vendor-gr', { params })
      .subscribe({
        next: (res) => {
          this.goodsReceipts = res;
          this.filteredGoodsReceipts = [...res];
          this.isLoading = false;
          console.log('Goods Receipt Data:', res);
        },
        error: (err) => {
          console.error('Failed to fetch GR data', err);
          this.isLoading = false;
        }
      });
  }

  convertSAPDate(sapDateString: string): string {
    const match = sapDateString.match(/\d+/);
    if (!match) return '';
    const date = new Date(parseInt(match[0], 10));
    return date.toLocaleDateString();
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredGoodsReceipts = [...this.goodsReceipts];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredGoodsReceipts = this.goodsReceipts.filter(gr => 
        gr.materialDocNo?.toLowerCase().includes(searchLower) ||
        gr.materialNo?.toLowerCase().includes(searchLower) ||
        gr.materialDes?.toLowerCase().includes(searchLower) ||
        gr.purchaseOrderNo?.toLowerCase().includes(searchLower) ||
        gr.plant?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredGoodsReceipts = [...this.goodsReceipts];
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

    this.filteredGoodsReceipts.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date sorting
      if (field === 'postingDate' || field === 'entryDate') {
        aValue = new Date(this.convertSAPDate(aValue));
        bValue = new Date(this.convertSAPDate(bValue));
      }

      // Handle numeric sorting
      if (field === 'quantity' || field === 'amtLocalCurr') {
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
    return this.filteredGoodsReceipts.length;
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

  get paginatedGoodsReceipts(): any[] {
    return this.filteredGoodsReceipts.slice(this.startIndex, this.endIndex);
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
  getStatusText(gr: any): string {
    // You can implement custom status logic based on your business rules
    if (gr.debitOrCreditIndicator === 'H') return 'Received';
    if (gr.debitOrCreditIndicator === 'S') return 'Posted';
    return 'Pending';
  }

  getStatusClass(gr: any): string {
    const status = this.getStatusText(gr);
    switch (status) {
      case 'Received': return 'status-success';
      case 'Posted': return 'status-info';
      default: return 'status-warning';
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
    this.loadGoodsReceipts();
  }
}

