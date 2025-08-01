import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7106/api';
  private readonly userKey = 'user';

  private currentUserSubject = new BehaviorSubject<any | null>(
    this.loadUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // --- API calls ---
  login(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, request);
  }

  // --- User session management ---
  private loadUserFromStorage(): any | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  saveUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user); // update observable
  }

  getUser(): any | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role || null;
  }

  getUserEmail(): string | null {
    return this.getUser()?.email || null;
  }

  getUserId(): string | null {
    return this.getUser()?.id || null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null); // update observable
    this.router.navigate(['/login']);
  }
}
