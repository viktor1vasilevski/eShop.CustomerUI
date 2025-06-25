import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7106/api';

  constructor(
    private http: HttpClient,
    //private _authenticationManagerService: AuthenticationManagerService,
    private router: Router
  ) {}

  login(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth/register`,
      request
    );
  }

  logout() {
    //this._authenticationManagerService.logout();
    this.router.navigate(['/login']);
  }
}
