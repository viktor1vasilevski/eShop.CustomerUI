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

  getBasketByUserId(userId: string | null): Observable<any[]> {
    return this._dataApiService.getById(`${this.baseUrl}/basket/${userId}`);
  }

  updateUserBasket(userId: string | null, request: any): Observable<void> {
    return this._dataApiService.post(
      `${this.baseUrl}/basket/${userId}/merge`,
      request
    );
  }

  // updateItemQuantity(
  //   userId: string | null,
  //   productId: string,
  //   quantity: number
  // ): Observable<void> {
  //   return this._dataApiService.patch<void>(
  //     `${this.baseUrl}/basket/${userId}/items/${productId}`,
  //     { quantity }
  //   );
  // }

  clearBackendBasket(userId: string | null): Observable<any> {
    return this._dataApiService.delete<any>(
      `${this.baseUrl}/basket/${userId}/items/`
    );
  }

  removeItemFromBackend(
    userId: string | null,
    productId: string
  ): Observable<any> {
    return this._dataApiService.delete<any>(
      `${this.baseUrl}/basket/${userId}/items/${productId}`
    );
  }
}
