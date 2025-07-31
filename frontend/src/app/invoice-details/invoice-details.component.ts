import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortField = '';
  sortDirection = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('username');

    if (!userId) {
      console.error('No user ID found in localStorage');
      this.isLoading = false;
      return;
    }

    const url = `http://localhost:3000/invoice/fetch-invoice/${userId}`;

    this.http.get<any>(url)
      .subscribe({
        next: (res) => {
          this.invoices = res.invoices || [];
          this.filteredInvoices = [...this.invoices];
          this.isLoading = false;
          console.log('Fetched invoices:', this.invoices);
        },
        error: (err) => {
          console.error('Error fetching invoices:', err);
          this.isLoading = false;
        }
      });
  }

  viewPdf(invoiceNumber: string): void {
    this.router.navigate(['/pdf-viewer', invoiceNumber]);
  }

  downloadPdf(invoiceNumber: string): void {
    // Implement download functionality
    console.log('Downloading PDF for invoice:', invoiceNumber);
  }

  formatSapDate(sapDate: string): string {
    const timestamp = parseInt(sapDate.replace('/Date(', '').replace(')/', ''), 10);
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getDaysAgo(sapDate: string): string {
    const timestamp = parseInt(sapDate.replace('/Date(', '').replace(')/', ''), 10);
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getTotalAmount(): number {
    // Calculate total amount if available in invoice data
    return this.invoices.length * 1000; // Placeholder calculation
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInvoices = [...this.invoices];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredInvoices = this.invoices.filter(invoice => 
        invoice.Invoice_number?.toLowerCase().includes(searchLower) ||
        invoice.User_Id?.toLowerCase().includes(searchLower) ||
        invoice.Organization?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredInvoices = [...this.invoices];
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

    this.filteredInvoices.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date sorting
      if (field === 'Invoice_Date') {
        aValue = new Date(this.formatSapDate(aValue));
        bValue = new Date(this.formatSapDate(bValue));
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination functionality
  get totalItems(): number {
    return this.filteredInvoices.length;
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

  get paginatedInvoices(): any[] {
    return this.filteredInvoices.slice(this.startIndex, this.endIndex);
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
    this.loadInvoices();
  }
}
