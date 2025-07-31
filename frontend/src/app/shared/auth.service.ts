import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  userId: string;
  name: string;
  email: string;
  telephone: string;
  street: string;
  city: string;
  pincode: string;
  country: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  });

  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    // Don't automatically log in from localStorage
    // Users must explicitly log in each time
  }

  login(userId: string, password: string): Observable<boolean> {
    this.setLoading(true);
    this.clearError();

    const paddedUserId = userId.padStart(10, '0');
    const params = new HttpParams()
      .set('userId', paddedUserId)
      .set('password', password);

    return this.http.get<any>('http://localhost:3000/vendor-login', { params })
      .pipe(
        map(response => {
          if (response.message === 'Login Successful') {
            localStorage.setItem('username', paddedUserId);
            this.authState.next({
              ...this.authState.value,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            this.loadUserProfile(paddedUserId);
            return true;
          } else {
            this.setError('Invalid credentials. Please try again.');
            return false;
          }
        }),
        tap({
          error: (error) => {
            console.error('Login error:', error);
            this.setError(error.error?.details || 'Login failed. Please check your credentials and try again.');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('username');
    this.authState.next({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
  }

  loadUserProfile(userId: string): void {
    this.setLoading(true);
    
    const params = new HttpParams().set('userId', userId);
    
    this.http.get<User>('http://localhost:3000/profile/get-vendor-profile', { params })
      .subscribe({
        next: (user) => {
          this.authState.next({
            ...this.authState.value,
            user,
            isLoading: false
          });
        },
        error: (error) => {
          console.error('Profile loading error:', error);
          this.setError('Failed to load user profile.');
        }
      });
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isLoggedIn(): boolean {
    return this.authState.value.isAuthenticated;
  }

  private setLoading(isLoading: boolean): void {
    this.authState.next({
      ...this.authState.value,
      isLoading
    });
  }

  private setError(error: string): void {
    this.authState.next({
      ...this.authState.value,
      error,
      isLoading: false
    });
  }

  private clearError(): void {
    this.authState.next({
      ...this.authState.value,
      error: null
    });
  }
} 