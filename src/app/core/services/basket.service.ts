import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

export interface BasketItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitQuantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = 'https://localhost:44344/api';

  constructor(private _dataApiService: DataService) {}

  getBasketByUserId(): Observable<any[]> {
    return this._dataApiService.getById(`${this.baseUrl}/basket`);
  }

  updateUserBasket(request: any): Observable<void> {
    return this._dataApiService.post(`${this.baseUrl}/basket/merge`, request);
  }

  clearBackendBasket(): Observable<any> {
    return this._dataApiService.delete<any>(`${this.baseUrl}/basket/items/`);
  }

  removeItemFromBackend(productId: string): Observable<any> {
    return this._dataApiService.delete<any>(
      `${this.baseUrl}/basket/items/${productId}`
    );
  }
}
