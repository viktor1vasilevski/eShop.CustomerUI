import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthStorageService } from './auth.storage.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(
    private _dataApiService: DataService,
    private _authService: AuthService,
    private _authStorageService: AuthStorageService
  ) {}

  getOrdersForUser(userId: any): Observable<any> {
    // const token = this._authService.getToken();
    // let headers = new HttpHeaders();
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }
    const url = `${this.baseUrl}/order/${userId}`;
    return this._dataApiService.getById<any>(url);
  }

  placeOrder(request: any): Observable<any> {
    const token = this._authStorageService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.baseUrl}/order`;
    return this._dataApiService.post<any, any>(url, request, { headers });
  }
}
