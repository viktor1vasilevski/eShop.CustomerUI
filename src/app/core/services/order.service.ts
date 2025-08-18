import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(private _dataApiService: DataService) {}

  getOrdersForUser(userId: any): Observable<any> {
    const url = `${this.baseUrl}/order/${userId}`;
    return this._dataApiService.getById<any>(url);
  }

  placeOrder(request: any): Observable<any> {
    const url = `${this.baseUrl}/order`;
    return this._dataApiService.post<any, any>(url, request);
  }
}
