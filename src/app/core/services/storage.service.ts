import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly AUTH_KEY = 'auth_customer';

  // BehaviorSubject holds current auth data, initialized from localStorage
  private authSubject = new BehaviorSubject<{
    id: string;
    name: string;
    email: string;
    token: string;
  } | null>(this.getAuth());

  // Observable for components to subscribe to
  authChanges$ = this.authSubject.asObservable();

  constructor() {}

  // Save auth data (user + token)
  setAuth(authData: {
    id: string;
    name: string;
    email: string;
    token: string;
  }): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    this.authSubject.next(authData); // emit new auth data
  }

  // Get auth data (user + token)
  getAuth(): {
    id: string;
    name: string;
    email: string;
    token: string;
  } | null {
    const data = localStorage.getItem(this.AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Get just the token (if needed separately)
  getToken(): string | null {
    const auth = this.getAuth();
    return auth ? auth.token : null;
  }

  // Remove auth data (on logout)
  clearAuth(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.authSubject.next(null); // emit null on logout
  }

  // Optional: check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
