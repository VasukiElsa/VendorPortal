import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  userId = '';
  password = '';
  isLoading = false;
  loginMessage = '';
  userIdFocused = false;
  passwordFocused = false;
  
  private authSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.isLoading = state.isLoading;
      
      if (state.error) {
        this.loginMessage = state.error;
      } else if (state.isAuthenticated) {
        this.loginMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  login(): void {
    if (!this.userId || !this.password) {
      this.loginMessage = 'Please enter both User ID and Password';
      return;
    }

    this.loginMessage = '';
    this.authService.login(this.userId, this.password).subscribe();
  }
}
