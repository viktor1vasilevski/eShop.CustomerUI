import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = 'https://localhost:7106/api';

  // Use a BehaviorSubject to keep basket state reactive
  private _basketItems = new BehaviorSubject<any[]>([]);
  basketItems$ = this._basketItems.asObservable();

  constructor(private _dataApiService: DataService) {}

  // Fetch basket by userId from backend
  getBasketByUserId(userId: string): Observable<any[]> {
    return this._dataApiService.getById(`${this.baseUrl}/basket/${userId}`);
  }

  // Save basket items to local storage and BehaviorSubject
  setBasketItems(items: any[]): void {
    localStorage.setItem('basket', JSON.stringify(items));
    this._basketItems.next(items);
  }

  // Load basket from local storage on app start or as needed
  loadBasketFromStorage(): void {
    const basket = localStorage.getItem('basket');
    if (basket) {
      this._basketItems.next(JSON.parse(basket));
    } else {
      this._basketItems.next([]);
    }
  }

  // Optional: clear basket on logout
  clearBasket(): void {
    localStorage.removeItem('basket');
    this._basketItems.next([]);
  }
}
