import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7106/api';
  private readonly userKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  login(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, request);
  }

  // --- Local Storage / Session Management ---
  saveUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}
