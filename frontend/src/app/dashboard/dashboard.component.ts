import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService, User } from '../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedSection: string = ''; // Start with empty state
  showProfileModal = false;
  profile: User | null = null;
  isLoading = false;
  
  private authSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Restore selected section from sessionStorage if it exists
    const savedSection = sessionStorage.getItem('dashboardSection');
    if (savedSection) {
      this.selectedSection = savedSection;
    }

    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.profile = state.user;
      this.isLoading = state.isLoading;
    });

    // Listen to navigation events to maintain selected section
    this.routerSubscription = this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // When returning to dashboard, restore the selected section
        if (event.url === '/dashboard') {
          const savedSection = sessionStorage.getItem('dashboardSection');
          if (savedSection && !this.selectedSection) {
            this.selectedSection = savedSection;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  selectSection(section: string): void {
    this.selectedSection = section;
    // Store the selected section in sessionStorage for persistence
    sessionStorage.setItem('dashboardSection', section);
  }

  fetchProfile(): void {
    this.showProfileModal = true;
  }

  logout(): void {
    // Clear the selected section when logging out
    sessionStorage.removeItem('dashboardSection');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToRFQ(): void {
    this.router.navigate(['/rfq']);
  }

  goToPO(): void {
    this.router.navigate(['/purchase-order']);
  }

  goToInvoiceDetails(): void {
    this.router.navigate(['/invoice-details']);
  }

  goToGoodsReceipt(): void {
    this.router.navigate(['/goods-receipt']);
  }

  goToVendorAging(): void {
    this.router.navigate(['/vendor-aging']);
  }

  goToVendorMemo(): void {
    this.router.navigate(['/vendor-memo']);
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }
}
