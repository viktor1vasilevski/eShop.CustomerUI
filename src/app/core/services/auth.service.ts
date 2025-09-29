import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(private http: HttpClient) {}

  login(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, request);
  }
}
